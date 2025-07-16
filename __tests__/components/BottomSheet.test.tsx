import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BottomSheet from "../../app/components/BottomSheet";

describe("BottomSheet", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders content when open", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <BottomSheet isOpen={false} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    const closeButton = screen.getByLabelText("Close bottom sheet");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    const overlay = screen.getByRole("dialog").parentElement;
    await user.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when overlay is clicked if closeOnOverlayClick is false", async () => {
    const user = userEvent.setup();
    
    render(
      <BottomSheet 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test Title"
        closeOnOverlayClick={false}
      >
        <div>Test Content</div>
      </BottomSheet>
    );

    const overlay = screen.getByRole("dialog").parentElement;
    await user.click(overlay!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("does not show close button when showCloseButton is false", () => {
    render(
      <BottomSheet 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test Title"
        showCloseButton={false}
      >
        <div>Test Content</div>
      </BottomSheet>
    );

    expect(screen.queryByLabelText("Close bottom sheet")).not.toBeInTheDocument();
  });

  it("renders without title when title is not provided", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </BottomSheet>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <BottomSheet 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test Title"
        className="custom-class"
      >
        <div>Test Content</div>
      </BottomSheet>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("custom-class");
  });

  it("has proper ARIA attributes", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "bottom-sheet-title");
  });

  it("includes drag indicator", () => {
    render(
      <BottomSheet isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test Content</div>
      </BottomSheet>
    );

    const dialog = screen.getByRole("dialog");
    const dragIndicator = dialog.querySelector(".w-10.h-1.bg-\\[var\\(--muted\\)\\]");
    expect(dragIndicator).toBeInTheDocument();
  });
});