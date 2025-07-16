/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from "../../app/components/Modal";

describe("Modal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Modal component", () => {
    it("renders when isOpen is true", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );
      
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(
        <Modal isOpen={false} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );
      
      expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });

    it("renders close button by default", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );
      
      expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
    });

    it("does not render close button when showCloseButton is false", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} showCloseButton={false}>
          <div>Modal content</div>
        </Modal>
      );
      
      expect(screen.queryByLabelText("Close modal")).not.toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      );
      
      const closeButton = screen.getByLabelText("Close modal");
      await userEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Escape key is pressed", async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: "Escape" });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose on Escape when closeOnEscape is false", () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
          <div>Modal content</div>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: "Escape" });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when overlay is clicked", async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      );
      
      const overlay = document.querySelector(".fixed.inset-0");
      await userEvent.click(overlay!);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when overlay is clicked and closeOnOverlayClick is false", async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
          <div>Modal content</div>
        </Modal>
      );
      
      const overlay = document.querySelector(".fixed.inset-0");
      await userEvent.click(overlay!);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it("applies size classes correctly", () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} size="sm">
          <div>Content</div>
        </Modal>
      );
      
      expect(document.querySelector(".max-w-md")).toBeInTheDocument();
      
      rerender(
        <Modal isOpen={true} onClose={() => {}} size="lg">
          <div>Content</div>
        </Modal>
      );
      
      expect(document.querySelector(".max-w-2xl")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} className="custom-modal">
          <div>Content</div>
        </Modal>
      );
      
      expect(document.querySelector(".custom-modal")).toBeInTheDocument();
    });

    it("sets body overflow to hidden when open", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  describe("ModalHeader component", () => {
    it("renders children correctly", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalHeader>Header Title</ModalHeader>
        </Modal>
      );
      
      expect(screen.getByText("Header Title")).toBeInTheDocument();
    });

    it("applies correct header styles", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalHeader>Header</ModalHeader>
        </Modal>
      );
      
      const header = screen.getByText("Header").parentElement;
      expect(header).toHaveClass("px-4", "py-4", "sm:px-6", "sm:py-4", "border-b", "border-[var(--border)]");
    });
  });

  describe("ModalBody component", () => {
    it("renders children correctly", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalBody>Body content</ModalBody>
        </Modal>
      );
      
      expect(screen.getByText("Body content")).toBeInTheDocument();
    });

    it("applies correct body styles", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalBody data-testid="modal-body">Body</ModalBody>
        </Modal>
      );
      
      const bodyWrapper = screen.getByTestId("modal-body");
      expect(bodyWrapper).toHaveClass("px-4", "py-4", "sm:px-6", "sm:py-4");
    });
  });

  describe("ModalFooter component", () => {
    it("renders children correctly", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalFooter>
            <button>Action</button>
          </ModalFooter>
        </Modal>
      );
      
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("applies correct footer styles", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalFooter data-testid="modal-footer">Footer</ModalFooter>
        </Modal>
      );
      
      const footer = screen.getByTestId("modal-footer");
      expect(footer).toHaveClass("px-4", "py-4", "sm:px-6", "sm:py-4", "border-t", "border-[var(--border)]", "flex", "justify-end");
    });
  });

  describe("ConfirmModal component", () => {
    it("renders title and message correctly", () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Confirm Action"
          message="Are you sure?"
        />
      );
      
      expect(screen.getByText("Confirm Action")).toBeInTheDocument();
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });

    it("renders default button texts", () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Title"
          message="Message"
        />
      );
      
      expect(screen.getByText("Confirm")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("renders custom button texts", () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Title"
          message="Message"
          confirmText="Delete"
          cancelText="Keep"
        />
      );
      
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("Keep")).toBeInTheDocument();
    });

    it("calls onConfirm and onClose when confirm button is clicked", async () => {
      const onConfirm = jest.fn();
      const onClose = jest.fn();
      
      render(
        <ConfirmModal
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Title"
          message="Message"
        />
      );
      
      const confirmButton = screen.getByText("Confirm");
      await userEvent.click(confirmButton);
      
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls only onClose when cancel button is clicked", async () => {
      const onConfirm = jest.fn();
      const onClose = jest.fn();
      
      render(
        <ConfirmModal
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Title"
          message="Message"
        />
      );
      
      const cancelButton = screen.getByText("Cancel");
      await userEvent.click(cancelButton);
      
      expect(onConfirm).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Responsive behavior", () => {
    it("applies responsive padding to header", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalHeader>Header</ModalHeader>
        </Modal>
      );
      
      const header = screen.getByText("Header").parentElement;
      expect(header).toHaveClass("px-4", "py-4", "sm:px-6", "sm:py-4");
    });

    it("applies responsive padding to body", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalBody data-testid="modal-body">Body</ModalBody>
        </Modal>
      );
      
      const body = screen.getByTestId("modal-body");
      expect(body).toHaveClass("px-4", "py-4", "sm:px-6", "sm:py-4");
    });

    it("applies responsive padding to footer", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalFooter data-testid="modal-footer">Footer</ModalFooter>
        </Modal>
      );
      
      const footer = screen.getByTestId("modal-footer");
      expect(footer).toHaveClass("px-4", "py-4", "sm:px-6", "sm:py-4", "flex", "flex-col", "sm:flex-row");
    });

    it("applies fullScreenOnMobile classes when enabled", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} fullScreenOnMobile={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );
      
      const modalContainer = document.querySelector('[role="dialog"]');
      expect(modalContainer).toHaveClass("rounded-none", "sm:rounded-xl");
    });
  });
});