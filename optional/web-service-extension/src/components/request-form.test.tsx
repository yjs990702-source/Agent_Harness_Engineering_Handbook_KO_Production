import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequestForm } from "./request-form";

describe("RequestForm", () => {
  afterEach(() => vi.restoreAllMocks());

  it("짧은 제목을 API 호출 전에 거부하고 field에 focus한다", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<RequestForm onCreated={vi.fn()} />);
    const input = screen.getByLabelText("제목");
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.click(screen.getByRole("button", { name: "요청 등록" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("3자 이상");
    expect(input).toHaveFocus();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
