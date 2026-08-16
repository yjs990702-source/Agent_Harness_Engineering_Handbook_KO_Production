import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WorkRequest } from "@/lib/contracts";
import { RequestCard } from "./request-card";

describe("RequestCard", () => {
  it("HTML처럼 보이는 title을 text로 렌더링한다", () => {
    const request: WorkRequest = {
      id: "ab5845a5-6253-4315-9ace-4a924c649365",
      tenantId: "tenant-demo",
      createdBy: "user-demo",
      title: "<script>globalThis.pwned=true</script>",
      category: "security",
      status: "open",
      dueDate: null,
      createdAt: "2026-08-16T00:00:00.000Z",
    };
    const { container } = render(<RequestCard request={request} />);
    expect(screen.getByText(request.title)).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
  });
});
