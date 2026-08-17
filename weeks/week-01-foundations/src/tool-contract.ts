export type ToolPermission = "read" | "write" | "network" | "deploy";

export type ToolDescriptor = Readonly<{
  name: string;
  sideEffect: "none" | "consequential";
  permissions: readonly ToolPermission[];
  requiresApproval: boolean;
  validateInput: (input: unknown) => boolean;
  outputSchema: string;
}>;

export type ToolProposal = Readonly<{
  tool: string;
  permissions: readonly string[];
  input: unknown;
}>;

export type ValidatedToolCall = Readonly<{
  tool: string;
  permissions: readonly ToolPermission[];
  input: unknown;
  sideEffect: ToolDescriptor["sideEffect"];
}>;

const PERMISSIONS = new Set<ToolPermission>([
  "read",
  "write",
  "network",
  "deploy",
]);

function isPermission(value: string): value is ToolPermission {
  // 문자열을 닫힌 권한 집합으로 좁히는 TypeScript type guard입니다.
  return PERMISSIONS.has(value as ToolPermission);
}

export function createToolRegistry(
  descriptors: readonly ToolDescriptor[],
): ReadonlyMap<string, ToolDescriptor> {
  // descriptor 오류는 첫 모델 호출 전에 발견해야 실행 중 정책이 흔들리지 않습니다.
  const registry = new Map<string, ToolDescriptor>();
  for (const descriptor of descriptors) {
    const name = descriptor.name.trim();
    if (!/^[a-z][a-z0-9_]{2,63}$/.test(name)) {
      throw new TypeError(`도구 이름이 유효하지 않습니다: ${descriptor.name}`);
    }
    // 같은 이름의 구현이 둘이면 실제 실행 대상을 예측할 수 없습니다.
    if (registry.has(name)) throw new Error(`중복 도구 이름: ${name}`);
    // 부작용 분류와 승인 정책의 모순을 구성 단계에서 거부합니다.
    if (
      descriptor.permissions.length === 0 ||
      descriptor.permissions.some((permission) => !isPermission(permission))
    ) {
      throw new Error(`알 수 없거나 비어 있는 도구 권한: ${name}`);
    }
    if (
      new Set(descriptor.permissions).size !== descriptor.permissions.length
    ) {
      throw new Error(`중복 도구 권한: ${name}`);
    }
    if (descriptor.outputSchema.trim().length < 3) {
      throw new Error(`출력 schema가 필요합니다: ${name}`);
    }
    if (
      descriptor.sideEffect === "consequential" &&
      !descriptor.requiresApproval
    ) {
      throw new Error(`부작용 도구에는 승인이 필요합니다: ${name}`);
    }
    registry.set(
      name,
      Object.freeze({
        ...descriptor,
        name,
        permissions: Object.freeze([...descriptor.permissions]),
        outputSchema: descriptor.outputSchema.trim(),
      }),
    );
  }
  return registry;
}

export function validateToolProposal(
  registry: ReadonlyMap<string, ToolDescriptor>,
  proposal: ToolProposal,
  approvalGranted = false,
): ValidatedToolCall {
  // allowlist에 없는 도구는 구현 탐색이나 실행 전에 즉시 거부합니다.
  const descriptor = registry.get(proposal.tool);
  if (!descriptor) throw new Error(`등록되지 않은 도구: ${proposal.tool}`);
  // 요청 권한은 descriptor 권한의 부분집합이어야 하며 자동 승격하지 않습니다.
  if (
    proposal.permissions.length === 0 ||
    proposal.permissions.some((permission) => !isPermission(permission))
  ) {
    throw new Error("알 수 없거나 비어 있는 권한 요청입니다.");
  }
  const requestedPermissions = proposal.permissions.map(
    (permission) => permission as ToolPermission,
  );
  if (
    requestedPermissions.some(
      (permission) => !descriptor.permissions.includes(permission),
    )
  ) {
    throw new Error("descriptor 범위를 벗어난 권한 요청입니다.");
  }
  // 도구 이름이 맞아도 입력 계약이 다르면 executor에 전달하지 않습니다.
  if (!descriptor.validateInput(proposal.input)) {
    throw new TypeError("도구 입력 schema 검증에 실패했습니다.");
  }
  if (descriptor.requiresApproval && !approvalGranted) {
    throw new Error("부작용 도구 실행에는 사람 승인이 필요합니다.");
  }
  // 검증 결과를 동결해 executor로 이동하는 동안 권한이나 입력 참조가 바뀌지 않게 합니다.
  return Object.freeze({
    tool: descriptor.name,
    permissions: Object.freeze(requestedPermissions),
    input: proposal.input,
    sideEffect: descriptor.sideEffect,
  });
}
