import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SmartConversionReviewDialog } from "./SmartConversionReviewDialog";
import {
  approveSmartConversion,
  type SmartConversionPayload,
} from "@/features/planning/services/smartConversion.service";

vi.mock("@/hooks/central", () => ({
  useProjects: vi.fn(() => ({
    data: [
      {
        id: "33333333-3333-4333-8333-333333333333",
        name: "مشروع التحول الرقمي",
      },
    ],
    isLoading: false,
  })),
}));

vi.mock("@/features/planning/services/smartConversion.service", () => ({
  approveSmartConversion: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

const taskPayloadWithoutProject: SmartConversionPayload = {
  sourceElementIds: ["11111111-1111-4111-8111-111111111111"],
  targetEntityType: "task",
  suggestedData: {
    name: "مهمة بدون مشروع مقترح",
    description: "يجب أن تطلب الواجهة اختيار مشروع قبل الاعتماد.",
  },
  approval: { approved: false },
  boardId: "22222222-2222-4222-8222-222222222222",
};

describe("SmartConversionReviewDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks the user to choose a project when converting a task without a suggested project", () => {
    render(
      <SmartConversionReviewDialog
        open
        payload={taskPayloadWithoutProject}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText("المشروع المرتبط بالمهمة")).toBeInTheDocument();
    expect(
      screen.getByLabelText("اختر مشروعًا لربط المهمة"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "لم تقترح AI مشروعًا لهذه المهمة. يجب اختيار مشروع حتى يتم إنشاء المهمة وربطها بشكل صحيح.",
      ),
    ).toBeInTheDocument();

    const approveButton = screen.getByRole("button", {
      name: /اعتماد وإنشاء السجل/,
    });
    expect(approveButton).toBeDisabled();

    fireEvent.click(approveButton);
    expect(approveSmartConversion).not.toHaveBeenCalled();
  });
});
