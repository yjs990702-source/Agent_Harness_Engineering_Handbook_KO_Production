import { describe, expect, it } from "vitest";

import {
  createDeploymentManifest,
  missingVariableNames,
} from "../src/deployment.js";
import { buildServiceSpec } from "../src/spec.js";

const spec = buildServiceSpec({
  problem: "팀 요청이 메신저에 흩어진다",
  targetUser: "내부 운영 담당자",
  successMetric: "요청 누락을 0건으로 유지한다",
  coreFlow: ["요청 등록", "목록 확인"],
  outOfScope: ["실제 고객 데이터", "Production 자동 배포"],
});

describe("배포 Evidence", () => {
  it("Preview manifest에는 변수 이름만 기록한다", () => {
    const manifest = createDeploymentManifest(spec, {
      commitSha: "0123456",
      environment: "preview",
      requiredVariableNames: ["APP_ENV", "PUBLIC_BASE_URL"],
      rollbackCondition: "health 또는 수용 테스트가 실패한다",
    });

    expect(manifest.secretValuesIncluded).toBe(false);
    expect(missingVariableNames(manifest, new Set(["APP_ENV"]))).toEqual([
      "PUBLIC_BASE_URL",
    ]);
  });

  it("사람 승인 없는 Production manifest를 거부한다", () => {
    expect(() =>
      createDeploymentManifest(spec, {
        commitSha: "0123456",
        environment: "production",
        requiredVariableNames: ["APP_ENV"],
        rollbackCondition: "health check가 실패한다",
      }),
    ).toThrow(/사람 승인/);
  });
});
