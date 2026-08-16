export type WorkerRole = "ui_worker" | "logic_worker" | "test_worker";
export type AgentRole = WorkerRole | "reviewer";

export type CollaborationNode = Readonly<{
  id: string;
  role: AgentRole;
  dependsOn: readonly string[];
  ownedPaths: readonly string[];
  readOnly: boolean;
}>;

export type CollaborationPlan = Readonly<{
  requestId: string;
  goal: string;
  baseRevision: string;
  nodes: readonly CollaborationNode[];
}>;

export type Evidence = Readonly<{
  id: string;
  kind: "test" | "diff" | "review";
  passed: boolean;
  detail: string;
}>;

export type Handoff = Readonly<{
  from: string;
  to: readonly string[];
  baseRevision: string;
  summary: string;
  evidenceIds: readonly string[];
  unresolvedRisks: readonly string[];
}>;

export type AgentResult = Readonly<{
  nodeId: string;
  role: AgentRole;
  summary: string;
  changedFiles: readonly string[];
  evidence: readonly Evidence[];
  handoff: Handoff;
}>;

export type AgentContext = Readonly<{
  request: string;
  plan: CollaborationPlan;
  node: CollaborationNode;
  dependencyResults: readonly AgentResult[];
}>;

export interface AgentExecutor {
  execute(context: AgentContext): Promise<AgentResult>;
}

export interface Planner {
  plan(request: string): Promise<CollaborationPlan>;
}

export type PlanFailure = Readonly<{
  code:
    | "DUPLICATE_NODE"
    | "MISSING_DEPENDENCY"
    | "CYCLE"
    | "INVALID_PATH"
    | "OWNERSHIP_CONFLICT"
    | "INVALID_ROLE_GRAPH";
  detail: string;
}>;

export type VerificationFailure = Readonly<{
  code:
    | "MISSING_RESULT"
    | "PATH_OUT_OF_SCOPE"
    | "READ_ONLY_WRITE"
    | "MISSING_EVIDENCE"
    | "FAILED_EVIDENCE"
    | "INVALID_HANDOFF"
    | "MISSING_REVIEW";
  detail: string;
}>;

export type VerificationVerdict = Readonly<{
  passed: boolean;
  failures: readonly VerificationFailure[];
}>;

export type CollaborationOutcome = Readonly<{
  status:
    | "passed"
    | "planning_failed"
    | "execution_failed"
    | "verification_failed";
  plan?: CollaborationPlan;
  waves: readonly (readonly string[])[];
  results: readonly AgentResult[];
  planFailures: readonly PlanFailure[];
  verification: VerificationVerdict;
  executionError?: string;
}>;
