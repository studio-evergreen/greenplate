import { render, screen, fireEvent } from "@testing-library/react";
import { Loading, LoadingButton } from "../../app/components/Loading";

describe("Loading", () => {
  describe("Loading component", () => {
    it("renders spinner variant by default", () => {
      const { container } = render(<Loading />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("renders dots variant correctly", () => {
      const { container } = render(<Loading variant="dots" />);
      const dots = container.querySelectorAll(".animate-pulse");
      expect(dots).toHaveLength(3);
    });

    it("renders pulse variant correctly", () => {
      const { container } = render(<Loading variant="pulse" />);
      const pulse = container.querySelector(".animate-pulse");
      expect(pulse).toBeInTheDocument();
    });

    it("applies correct size classes", () => {
      const { container, rerender } = render(<Loading size="sm" />);
      expect(container.querySelector(".w-4.h-4")).toBeInTheDocument();

      rerender(<Loading size="lg" />);
      expect(container.querySelector(".w-8.h-8")).toBeInTheDocument();
    });

    it("applies correct color classes", () => {
      const { container, rerender } = render(<Loading color="primary" />);
      expect(container.querySelector(".border-emerald-600")).toBeInTheDocument();

      rerender(<Loading color="white" />);
      expect(container.querySelector(".border-white")).toBeInTheDocument();

      rerender(<Loading color="gray" />);
      expect(container.querySelector(".border-gray-400")).toBeInTheDocument();
    });

    it("renders loading text when provided", () => {
      render(<Loading text="Please wait..." />);
      expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    it("does not render text when not provided", () => {
      const { container } = render(<Loading />);
      const text = container.querySelector("span");
      expect(text).not.toBeInTheDocument();
    });

    it("applies overlay styles when overlay is true", () => {
      const { container } = render(<Loading overlay={true} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("fixed", "inset-0", "z-50", "bg-white", "bg-opacity-75");
    });

    it("does not apply overlay styles when overlay is false", () => {
      const { container } = render(<Loading overlay={false} />);
      const wrapper = container.firstChild;
      expect(wrapper).not.toHaveClass("fixed", "inset-0");
    });

    it("accepts custom className", () => {
      const { container } = render(<Loading className="custom-loading" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-loading");
    });

    it("passes through additional props", () => {
      render(<Loading data-testid="custom-loading" />);
      expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
    });

    it("has proper accessibility attributes", () => {
      const { container } = render(<Loading />);
      const spinner = container.querySelector("[role='status']");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });
  });

  describe("Loading dots variant", () => {
    it("renders three dots with staggered animations", () => {
      const { container } = render(<Loading variant="dots" />);
      const dots = container.querySelectorAll(".animate-pulse");
      expect(dots).toHaveLength(3);
      
      // Check that each dot has different animation delay
      expect(dots[0]).toHaveStyle("animation-delay: 0s");
      expect(dots[1]).toHaveStyle("animation-delay: 0.15s");
      expect(dots[2]).toHaveStyle("animation-delay: 0.3s");
    });

    it("applies correct size to dots", () => {
      const { container } = render(<Loading variant="dots" size="lg" />);
      const dots = container.querySelectorAll(".w-3.h-3");
      expect(dots).toHaveLength(3);
    });

    it("applies correct color to dots", () => {
      const { container } = render(<Loading variant="dots" color="primary" />);
      const dots = container.querySelectorAll(".bg-emerald-600");
      expect(dots).toHaveLength(3);
    });
  });

  describe("LoadingButton component", () => {
    it("renders children when not loading", () => {
      render(
        <LoadingButton isLoading={false}>
          Save Changes
        </LoadingButton>
      );
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });

    it("renders loading text when loading", () => {
      render(
        <LoadingButton isLoading={true} loadingText="Saving...">
          Save Changes
        </LoadingButton>
      );
      expect(screen.getByText("Saving...")).toBeInTheDocument();
      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
    });

    it("renders default loading text when loading and no loadingText provided", () => {
      render(
        <LoadingButton isLoading={true}>
          Save Changes
        </LoadingButton>
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows spinner when loading", () => {
      const { container } = render(
        <LoadingButton isLoading={true}>
          Save Changes
        </LoadingButton>
      );
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("does not show spinner when not loading", () => {
      const { container } = render(
        <LoadingButton isLoading={false}>
          Save Changes
        </LoadingButton>
      );
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });

    it("is disabled when loading", () => {
      render(
        <LoadingButton isLoading={true}>
          Save Changes
        </LoadingButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("is disabled when disabled prop is true", () => {
      render(
        <LoadingButton isLoading={false} disabled={true}>
          Save Changes
        </LoadingButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("is not disabled when not loading and disabled is false", () => {
      render(
        <LoadingButton isLoading={false} disabled={false}>
          Save Changes
        </LoadingButton>
      );
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });

    it("calls onClick when clicked and not loading", () => {
      const onClick = jest.fn();
      render(
        <LoadingButton isLoading={false} onClick={onClick}>
          Save Changes
        </LoadingButton>
      );
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when loading", () => {
      const onClick = jest.fn();
      render(
        <LoadingButton isLoading={true} onClick={onClick}>
          Save Changes
        </LoadingButton>
      );
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it("applies correct size classes", () => {
      const { container, rerender } = render(
        <LoadingButton isLoading={false} size="sm">
          Button
        </LoadingButton>
      );
      
      let button = container.querySelector("button");
      expect(button).toHaveClass("px-3", "py-2", "text-sm");

      rerender(
        <LoadingButton isLoading={false} size="lg">
          Button
        </LoadingButton>
      );
      
      button = container.querySelector("button");
      expect(button).toHaveClass("px-6", "py-4", "text-lg");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <LoadingButton isLoading={false} className="custom-button">
          Button
        </LoadingButton>
      );
      
      const button = container.querySelector("button");
      expect(button).toHaveClass("custom-button");
    });

    it("uses appropriate spinner size based on button size", () => {
      const { container } = render(
        <LoadingButton isLoading={true} size="lg">
          Button
        </LoadingButton>
      );
      
      // For lg button, should use md spinner (w-6 h-6)
      const spinner = container.querySelector(".w-6.h-6");
      expect(spinner).toBeInTheDocument();
    });
  });
});