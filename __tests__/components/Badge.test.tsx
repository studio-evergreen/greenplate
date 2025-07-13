import { render, screen, fireEvent } from "@testing-library/react";
import { Badge, DotBadge, NumberBadge, StatusBadge } from "../../app/components/Badge";

describe("Badge", () => {
  describe("Badge component", () => {
    it("renders children correctly", () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("applies default variant and size", () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass("bg-emerald-100", "text-emerald-800", "px-2.5", "py-1", "text-sm");
    });

    it("applies different variants correctly", () => {
      const { container, rerender } = render(<Badge variant="success">Badge</Badge>);
      let badge = container.firstChild;
      expect(badge).toHaveClass("bg-green-100", "text-green-800");

      rerender(<Badge variant="danger">Badge</Badge>);
      badge = container.firstChild;
      expect(badge).toHaveClass("bg-red-100", "text-red-800");

      rerender(<Badge variant="warning">Badge</Badge>);
      badge = container.firstChild;
      expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
    });

    it("applies different sizes correctly", () => {
      const { container, rerender } = render(<Badge size="sm">Badge</Badge>);
      let badge = container.firstChild;
      expect(badge).toHaveClass("px-2", "py-0.5", "text-xs");

      rerender(<Badge size="lg">Badge</Badge>);
      badge = container.firstChild;
      expect(badge).toHaveClass("px-3", "py-1.5", "text-base");
    });

    it("applies rounded styling when rounded prop is true", () => {
      const { container } = render(<Badge rounded={true}>Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass("rounded-full");
    });

    it("applies default rounded styling when rounded prop is false", () => {
      const { container } = render(<Badge rounded={false}>Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass("rounded-md");
    });

    it("shows remove button when removable is true", () => {
      render(<Badge removable={true}>Badge</Badge>);
      expect(screen.getByLabelText("Remove")).toBeInTheDocument();
    });

    it("does not show remove button when removable is false", () => {
      render(<Badge removable={false}>Badge</Badge>);
      expect(screen.queryByLabelText("Remove")).not.toBeInTheDocument();
    });

    it("calls onRemove when remove button is clicked", () => {
      const onRemove = jest.fn();
      render(<Badge removable={true} onRemove={onRemove}>Badge</Badge>);
      
      const removeButton = screen.getByLabelText("Remove");
      fireEvent.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("stops propagation when remove button is clicked", () => {
      const onRemove = jest.fn();
      const onBadgeClick = jest.fn();
      
      render(
        <Badge removable={true} onRemove={onRemove} onClick={onBadgeClick}>
          Badge
        </Badge>
      );
      
      const removeButton = screen.getByLabelText("Remove");
      fireEvent.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onBadgeClick).not.toHaveBeenCalled();
    });

    it("accepts custom className", () => {
      const { container } = render(<Badge className="custom-badge">Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass("custom-badge");
    });

    it("passes through additional props", () => {
      render(<Badge data-testid="custom-badge">Badge</Badge>);
      expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
    });
  });

  describe("DotBadge component", () => {
    it("renders with default variant and size", () => {
      const { container } = render(<DotBadge />);
      const dot = container.firstChild;
      expect(dot).toHaveClass("bg-emerald-500", "w-3", "h-3", "rounded-full");
    });

    it("applies different variants correctly", () => {
      const { container, rerender } = render(<DotBadge variant="success" />);
      let dot = container.firstChild;
      expect(dot).toHaveClass("bg-green-500");

      rerender(<DotBadge variant="danger" />);
      dot = container.firstChild;
      expect(dot).toHaveClass("bg-red-500");
    });

    it("applies different sizes correctly", () => {
      const { container, rerender } = render(<DotBadge size="sm" />);
      let dot = container.firstChild;
      expect(dot).toHaveClass("w-2", "h-2");

      rerender(<DotBadge size="lg" />);
      dot = container.firstChild;
      expect(dot).toHaveClass("w-4", "h-4");
    });

    it("applies pulse animation when pulse is true", () => {
      const { container } = render(<DotBadge pulse={true} />);
      const dot = container.firstChild;
      expect(dot).toHaveClass("animate-pulse");
    });

    it("does not apply pulse animation when pulse is false", () => {
      const { container } = render(<DotBadge pulse={false} />);
      const dot = container.firstChild;
      expect(dot).not.toHaveClass("animate-pulse");
    });

    it("accepts custom className", () => {
      const { container } = render(<DotBadge className="custom-dot" />);
      const dot = container.firstChild;
      expect(dot).toHaveClass("custom-dot");
    });
  });

  describe("NumberBadge component", () => {
    it("renders count correctly", () => {
      render(<NumberBadge count={5} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("shows max+ when count exceeds max", () => {
      render(<NumberBadge count={150} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("does not render when count is 0 and showZero is false", () => {
      const { container } = render(<NumberBadge count={0} showZero={false} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders when count is 0 and showZero is true", () => {
      render(<NumberBadge count={0} showZero={true} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("does not render when count is negative and showZero is false", () => {
      const { container } = render(<NumberBadge count={-1} showZero={false} />);
      expect(container.firstChild).toBeNull();
    });

    it("applies default danger variant", () => {
      const { container } = render(<NumberBadge count={5} />);
      const badge = container.firstChild;
      expect(badge).toHaveClass("bg-red-500", "text-white");
    });

    it("applies different variants correctly", () => {
      const { container, rerender } = render(<NumberBadge count={5} variant="success" />);
      let badge = container.firstChild;
      expect(badge).toHaveClass("bg-green-500");

      rerender(<NumberBadge count={5} variant="info" />);
      badge = container.firstChild;
      expect(badge).toHaveClass("bg-blue-500");
    });

    it("applies different sizes correctly", () => {
      const { container, rerender } = render(<NumberBadge count={5} size="sm" />);
      let badge = container.firstChild;
      expect(badge).toHaveClass("px-1.5", "py-0.5", "text-xs", "h-4");

      rerender(<NumberBadge count={5} size="lg" />);
      badge = container.firstChild;
      expect(badge).toHaveClass("px-2.5", "py-1", "text-sm", "h-6");
    });

    it("accepts custom className", () => {
      const { container } = render(<NumberBadge count={5} className="custom-number" />);
      const badge = container.firstChild;
      expect(badge).toHaveClass("custom-number");
    });
  });

  describe("StatusBadge component", () => {
    it("renders status label by default", () => {
      render(<StatusBadge status="online" />);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("renders custom children when provided", () => {
      render(<StatusBadge status="online">Custom Status</StatusBadge>);
      expect(screen.getByText("Custom Status")).toBeInTheDocument();
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });

    it("shows dot by default", () => {
      const { container } = render(<StatusBadge status="online" />);
      const dot = container.querySelector(".w-2.h-2.rounded-full");
      expect(dot).toBeInTheDocument();
    });

    it("does not show dot when withDot is false", () => {
      const { container } = render(<StatusBadge status="online" withDot={false} />);
      const dot = container.querySelector(".w-2.h-2.rounded-full");
      expect(dot).not.toBeInTheDocument();
    });

    it("applies correct styling for different statuses", () => {
      const { container, rerender } = render(<StatusBadge status="online" />);
      let badge = container.firstChild;
      let dot = container.querySelector(".w-2.h-2.rounded-full");
      
      expect(badge).toHaveClass("bg-green-100", "text-green-800");
      expect(dot).toHaveClass("bg-green-500");

      rerender(<StatusBadge status="offline" />);
      badge = container.firstChild;
      dot = container.querySelector(".w-2.h-2.rounded-full");
      
      expect(badge).toHaveClass("bg-gray-100", "text-gray-800");
      expect(dot).toHaveClass("bg-gray-500");

      rerender(<StatusBadge status="busy" />);
      badge = container.firstChild;
      dot = container.querySelector(".w-2.h-2.rounded-full");
      
      expect(badge).toHaveClass("bg-red-100", "text-red-800");
      expect(dot).toHaveClass("bg-red-500");
    });

    it("renders correct labels for all statuses", () => {
      const statuses = [
        { status: "online" as const, label: "Online" },
        { status: "offline" as const, label: "Offline" },
        { status: "away" as const, label: "Away" },
        { status: "busy" as const, label: "Busy" },
        { status: "idle" as const, label: "Idle" }
      ];

      statuses.forEach(({ status, label }) => {
        const { rerender } = render(<StatusBadge status={status} />);
        expect(screen.getByText(label)).toBeInTheDocument();
        if (status !== statuses[statuses.length - 1].status) {
          rerender(<div />); // Clear for next test
        }
      });
    });

    it("accepts custom className", () => {
      const { container } = render(<StatusBadge status="online" className="custom-status" />);
      const badge = container.firstChild;
      expect(badge).toHaveClass("custom-status");
    });
  });
});