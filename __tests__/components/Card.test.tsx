import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardBody, CardFooter } from "../../app/components/Card";

describe("Card", () => {
  describe("Card component", () => {
    it("renders children correctly", () => {
      render(<Card>Test content</Card>);
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("applies default classes", () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("bg-[var(--card)]", "rounded-xl", "p-4", "sm:p-6", "shadow-sm");
    });

    it("applies custom padding", () => {
      const { container } = render(<Card padding="lg">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("p-6", "sm:p-8");
    });

    it("applies custom shadow", () => {
      const { container } = render(<Card shadow="lg">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("shadow-lg");
    });

    it("applies border when enabled", () => {
      const { container } = render(<Card border={true}>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("border", "border-[var(--border)]");
    });

    it("does not apply border when disabled", () => {
      const { container } = render(<Card border={false}>Content</Card>);
      const card = container.firstChild;
      expect(card).not.toHaveClass("border");
    });

    it("applies hover effects when enabled", () => {
      const { container } = render(<Card hover={true}>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("hover:shadow-md", "hover:border-[var(--muted)]");
    });

    it("accepts custom className", () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("custom-class");
    });

    it("passes through additional props", () => {
      render(<Card data-testid="custom-card">Content</Card>);
      expect(screen.getByTestId("custom-card")).toBeInTheDocument();
    });
  });

  describe("CardHeader component", () => {
    it("renders children correctly", () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText("Header content")).toBeInTheDocument();
    });

    it("applies default header styles", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild;
      expect(header).toHaveClass("border-b", "border-[var(--border)]", "pb-3", "mb-3", "sm:pb-4", "sm:mb-4");
    });

    it("accepts custom className", () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
      const header = container.firstChild;
      expect(header).toHaveClass("custom-header");
    });
  });

  describe("CardBody component", () => {
    it("renders children correctly", () => {
      render(<CardBody>Body content</CardBody>);
      expect(screen.getByText("Body content")).toBeInTheDocument();
    });

    it("applies default body styles", () => {
      const { container } = render(<CardBody>Body</CardBody>);
      const body = container.firstChild;
      expect(body).toHaveClass("text-[var(--muted)]");
    });

    it("accepts custom className", () => {
      const { container } = render(<CardBody className="custom-body">Body</CardBody>);
      const body = container.firstChild;
      expect(body).toHaveClass("custom-body");
    });
  });

  describe("CardFooter component", () => {
    it("renders children correctly", () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("applies default footer styles", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild;
      expect(footer).toHaveClass("border-t", "border-[var(--border)]", "pt-3", "mt-3", "sm:pt-4", "sm:mt-4");
    });

    it("accepts custom className", () => {
      const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
      const footer = container.firstChild;
      expect(footer).toHaveClass("custom-footer");
    });
  });

  describe("Card composition", () => {
    it("renders full card composition correctly", () => {
      render(
        <Card>
          <CardHeader>
            <h2>Card Title</h2>
          </CardHeader>
          <CardBody>
            <p>Card content goes here.</p>
          </CardBody>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card content goes here.")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });

  describe("Responsive behavior", () => {
    it("applies responsive padding classes", () => {
      const { container } = render(<Card padding="md">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("p-4", "sm:p-6");
    });

    it("applies responsive padding for small size", () => {
      const { container } = render(<Card padding="sm">Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass("p-3", "sm:p-4");
    });

    it("CardHeader has responsive spacing", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild;
      expect(header).toHaveClass("pb-3", "mb-3", "sm:pb-4", "sm:mb-4");
    });

    it("CardFooter has responsive spacing", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild;
      expect(footer).toHaveClass("pt-3", "mt-3", "sm:pt-4", "sm:mt-4");
    });
  });
});