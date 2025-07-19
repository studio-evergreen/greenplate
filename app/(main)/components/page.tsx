"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../components/ToastProvider";
import { useTheme } from "../../components/ThemeProvider";

// Component imports
import { Card, CardHeader, CardBody, CardFooter } from "../../components/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from "../../components/Modal";
import { Loading, LoadingButton } from "../../components/Loading";
import { Badge, DotBadge, NumberBadge, StatusBadge } from "../../components/Badge";
import { Select, SelectOption } from "../../components/Select";
import { BottomSheet } from "../../components/BottomSheet";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageDropdown from "../../components/LanguageDropdown";
import GoogleIcon from "../../components/GoogleIcon";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ComponentExample } from "../../components/CodeBlock";

// Icons
import { 
  Search, Heart, User, Settings, MapPin, Globe, Star,
  Menu, X, Palette, Code, Smartphone,
  Database, Shield, Layers, Zap, Bell, CheckCircle, AlertCircle
} from "lucide-react";

// Navigation sections for sidebar
const navigationSections = [
  {
    title: "Getting Started",
    items: [
      { id: "overview", label: "Overview", icon: <Layers size={16} /> },
      { id: "installation", label: "Installation", icon: <Code size={16} /> }
    ]
  },
  {
    title: "Layout",
    items: [
      { id: "card", label: "Card", icon: <Layers size={16} /> },
      { id: "modal", label: "Modal", icon: <Layers size={16} /> },
      { id: "bottomsheet", label: "Bottom Sheet", icon: <Smartphone size={16} /> }
    ]
  },
  {
    title: "Form Controls",
    items: [
      { id: "button", label: "Button", icon: <Layers size={16} /> },
      { id: "input", label: "Input", icon: <Layers size={16} /> },
      { id: "select", label: "Select", icon: <Layers size={16} /> }
    ]
  },
  {
    title: "Feedback",
    items: [
      { id: "toast", label: "Toast", icon: <Bell size={16} /> },
      { id: "loading", label: "Loading", icon: <Zap size={16} /> },
      { id: "badge", label: "Badge", icon: <Layers size={16} /> }
    ]
  },
  {
    title: "Navigation",
    items: [
      { id: "theme", label: "Theme Toggle", icon: <Palette size={16} /> },
      { id: "language", label: "Language", icon: <Globe size={16} /> }
    ]
  },
  {
    title: "Utilities",
    items: [
      { id: "icons", label: "Icons", icon: <Star size={16} /> },
      { id: "providers", label: "Providers", icon: <Database size={16} /> },
      { id: "error", label: "Error Boundary", icon: <Shield size={16} /> }
    ]
  }
];

export default function ComponentsPage() {
  const { showToast } = useToast();
  const { theme } = useTheme();
  
  // State for demos
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [loadingButtonState, setLoadingButtonState] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState("");

  // Demo options
  const selectOptions: SelectOption[] = [
    { value: "react", label: "React", icon: <Star size={16} /> },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte", disabled: true },
    { value: "next", label: "Next.js" }
  ];

  const locationOptions: SelectOption[] = [
    { value: "us", label: "United States", icon: <Globe size={16} /> },
    { value: "uk", label: "United Kingdom", icon: <Globe size={16} /> },
    { value: "ca", label: "Canada", icon: <MapPin size={16} /> },
    { value: "de", label: "Germany", icon: <MapPin size={16} /> },
    { value: "jp", label: "Japan", icon: <MapPin size={16} /> }
  ];

  // Handle demo actions
  const handleLoadingButton = () => {
    setLoadingButtonState(true);
    setTimeout(() => setLoadingButtonState(false), 2000);
  };

  const handleToastDemo = (type: "success" | "error" | "warning" | "info") => {
    const messages = {
      success: "Operation completed successfully!",
      error: "Something went wrong. Please try again.",
      warning: "This action requires your attention.",
      info: "Here's some helpful information."
    };
    showToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: messages[type]
    });
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationSections.flatMap(section => section.items);
      const currentSection = sections.find(item => {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 200;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Components</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-30 h-screen lg:h-[calc(100vh-60px)]
          w-64 bg-[var(--background)] border-r border-[var(--border)]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border)]
        `}>
          <div className="p-6">
            <div className="hidden lg:block mb-8">
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Components</h1>
              <p className="text-sm text-[var(--muted)]">
                Comprehensive UI component library built with React and Tailwind CSS
              </p>
            </div>

            <nav className="space-y-6">
              {navigationSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md
                            transition-colors text-left
                            ${activeSection === item.id 
                              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' 
                              : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/10'
                            }
                          `}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
            
            {/* Overview Section */}
            <section id="overview" className="mb-16">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
                  Component Library
                </h1>
                <p className="text-lg text-[var(--muted)] max-w-3xl leading-relaxed">
                  A comprehensive collection of reusable React components built with TypeScript, 
                  Tailwind CSS, and modern best practices. All components are fully responsive, 
                  accessible, and support both light and dark themes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center">
                  <CardBody className="py-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Mobile First</h3>
                    <p className="text-sm text-[var(--muted)]">
                      Responsive design with mobile-optimized interactions like bottom sheets
                    </p>
                  </CardBody>
                </Card>

                <Card className="text-center">
                  <CardBody className="py-8">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Theme Support</h3>
                    <p className="text-sm text-[var(--muted)]">
                      Built-in dark/light theme support with system preference detection
                    </p>
                  </CardBody>
                </Card>

                <Card className="text-center">
                  <CardBody className="py-8">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Accessible</h3>
                    <p className="text-sm text-[var(--muted)]">
                      WCAG compliant with proper ARIA attributes and keyboard navigation
                    </p>
                  </CardBody>
                </Card>
              </div>
            </section>

            {/* Installation Section */}
            <section id="installation" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Installation
              </h2>
              
              <ComponentExample
                title="Getting Started"
                description="Import components from the components directory"
                code={`// Import individual components
import Button from '@/app/components/Button';
import { Card, CardBody } from '@/app/components/Card';
import { useToast } from '@/app/components/ToastProvider';

// Wrap your app with providers
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <YourApp />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}`}
              >
                <div className="p-6 bg-[var(--muted)]/10 rounded-lg">
                  <p className="text-[var(--foreground)] font-medium mb-2">Ready to use!</p>
                  <p className="text-[var(--muted)] text-sm">
                    All components are pre-configured with TypeScript definitions and Tailwind CSS styling.
                  </p>
                </div>
              </ComponentExample>
            </section>

            {/* Card Components */}
            <section id="card" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Card
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Basic Card"
                  description="A simple container with subtle shadow and rounded corners"
                  code={`import { Card, CardBody } from '@/app/components/Card';

<Card>
  <CardBody>
    This is a basic card with some content inside.
  </CardBody>
</Card>`}
                >
                  <Card>
                    <CardBody>
                      This is a basic card with some content inside.
                    </CardBody>
                  </Card>
                </ComponentExample>

                <ComponentExample
                  title="Card with Header and Footer"
                  description="Complete card structure with header, body, and footer sections"
                  code={`<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold">Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>This card demonstrates the header, body, and footer structure.</p>
  </CardBody>
  <CardFooter>
    <Button variant="primary">Action</Button>
    <Button variant="secondary">Cancel</Button>
  </CardFooter>
</Card>`}
                >
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Card Title</h3>
                    </CardHeader>
                    <CardBody>
                      <p>This card demonstrates the header, body, and footer structure.</p>
                    </CardBody>
                    <CardFooter>
                      <Button variant="primary">Action</Button>
                      <Button variant="secondary">Cancel</Button>
                    </CardFooter>
                  </Card>
                </ComponentExample>

                <ComponentExample
                  title="Card Variants"
                  description="Different card configurations with padding, shadow, and hover effects"
                  code={`<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card padding="sm" shadow="none" border={true}>
    <CardBody>Small padding, no shadow</CardBody>
  </Card>
  
  <Card padding="md" shadow="md" hover={true}>
    <CardBody>Medium shadow with hover</CardBody>
  </Card>
  
  <Card padding="lg" shadow="lg">
    <CardBody>Large padding and shadow</CardBody>
  </Card>
</div>`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <Card padding="sm" shadow="none" border={true}>
                      <CardBody>Small padding, no shadow</CardBody>
                    </Card>
                    
                    <Card padding="md" shadow="md" hover={true}>
                      <CardBody>Medium shadow with hover</CardBody>
                    </Card>
                    
                    <Card padding="lg" shadow="lg">
                      <CardBody>Large padding and shadow</CardBody>
                    </Card>
                  </div>
                </ComponentExample>
              </div>
            </section>

            {/* Modal Components */}
            <section id="modal" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Modal
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Basic Modal"
                  description="A modal dialog with header, body, and footer"
                  code={`import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/app/components/Modal';

const [modalOpen, setModalOpen] = useState(false);

<>
  <Button onClick={() => setModalOpen(true)}>
    Open Modal
  </Button>
  
  <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
    <ModalHeader>Modal Title</ModalHeader>
    <ModalBody>
      <p>This is the modal content.</p>
    </ModalBody>
    <ModalFooter>
      <Button variant="secondary" onClick={() => setModalOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => setModalOpen(false)}>
        Confirm
      </Button>
    </ModalFooter>
  </Modal>
</>`}
                >
                  <Button onClick={() => setModalOpen(true)}>
                    Open Modal
                  </Button>
                </ComponentExample>

                <ComponentExample
                  title="Confirm Modal"
                  description="A pre-built confirmation modal for dangerous actions"
                  code={`import { ConfirmModal } from '@/app/components/Modal';

<ConfirmModal
  isOpen={confirmModalOpen}
  onClose={() => setConfirmModalOpen(false)}
  onConfirm={() => {
    // Handle deletion
    setConfirmModalOpen(false);
  }}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
  variant="danger"
/>`}
                >
                  <Button 
                    variant="primary"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setConfirmModalOpen(true)}
                  >
                    Delete Item
                  </Button>
                </ComponentExample>
              </div>
            </section>

            {/* Bottom Sheet */}
            <section id="bottomsheet" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Bottom Sheet
              </h2>
              
              <ComponentExample
                title="Mobile Bottom Sheet"
                description="Mobile-optimized overlay that slides up from the bottom"
                code={`import { BottomSheet } from '@/app/components/BottomSheet';

const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

<>
  <Button onClick={() => setBottomSheetOpen(true)}>
    Open Bottom Sheet
  </Button>
  
  <BottomSheet
    isOpen={bottomSheetOpen}
    onClose={() => setBottomSheetOpen(false)}
    title="Settings"
  >
    <div className="space-y-4">
      <p>This content slides up from the bottom on mobile devices.</p>
      <Button fullWidth onClick={() => setBottomSheetOpen(false)}>
        Close
      </Button>
    </div>
  </BottomSheet>
</>`}
              >
                <Button onClick={() => setBottomSheetOpen(true)}>
                  Open Bottom Sheet
                </Button>
              </ComponentExample>
            </section>

            {/* Button Components */}
            <section id="button" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Button
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Button Variants"
                  description="Different button styles for various use cases"
                  code={`import Button from '@/app/components/Button';

<div className="flex flex-wrap gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
</div>`}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Buttons with Icons"
                  description="Buttons with left or right icons"
                  code={`<div className="flex flex-wrap gap-3">
  <Button variant="primary" leftIcon={<Heart size={16} />}>
    Like
  </Button>
  
  <Button variant="secondary" rightIcon={<Settings size={16} />}>
    Settings
  </Button>
  
  <Button variant="primary" disabled>
    Disabled
  </Button>
</div>`}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" leftIcon={<Heart size={16} />}>
                      Like
                    </Button>
                    
                    <Button variant="secondary" rightIcon={<Settings size={16} />}>
                      Settings
                    </Button>
                    
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Button Sizes"
                  description="Different button sizes from small to large"
                  code={`<div className="flex items-center gap-3">
  <Button size="sm" variant="primary">Small</Button>
  <Button size="md" variant="primary">Medium</Button>
  <Button size="lg" variant="primary">Large</Button>
</div>`}
                >
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="primary">Small</Button>
                    <Button size="md" variant="primary">Medium</Button>
                    <Button size="lg" variant="primary">Large</Button>
                  </div>
                </ComponentExample>
              </div>
            </section>

            {/* Input Components */}
            <section id="input" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Input
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Input Variants"
                  description="Text inputs with labels, icons, and validation states"
                  code={`import Input from '@/app/components/Input';

<div className="space-y-4 max-w-md">
  <Input 
    label="Email"
    placeholder="Enter your email"
    type="email"
  />
  
  <Input 
    label="Search"
    placeholder="Search..."
    leftIcon={<Search size={16} />}
  />
  
  <Input 
    label="Username"
    placeholder="Username"
    leftIcon={<User size={16} />}
    error="Username is required"
  />
</div>`}
                >
                  <div className="space-y-4 max-w-md">
                    <Input 
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                    />
                    
                    <Input 
                      label="Search"
                      placeholder="Search..."
                      leftIcon={<Search size={16} />}
                    />
                    
                    <Input 
                      label="Username"
                      placeholder="Username"
                      leftIcon={<User size={16} />}
                      error="Username is required"
                    />
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Input Sizes"
                  description="Different input sizes with helper text"
                  code={`<div className="space-y-4 max-w-md">
  <Input 
    size="sm"
    placeholder="Small input"
    helperText="Small size input"
  />
  
  <Input 
    size="md"
    placeholder="Medium input" 
    helperText="Medium size input (default)"
  />
  
  <Input 
    size="lg"
    placeholder="Large input"
    helperText="Large size input"
  />
</div>`}
                >
                  <div className="space-y-4 max-w-md">
                    <Input 
                      size="sm"
                      placeholder="Small input"
                      helperText="Small size input"
                    />
                    
                    <Input 
                      size="md"
                      placeholder="Medium input" 
                      helperText="Medium size input (default)"
                    />
                    
                    <Input 
                      size="lg"
                      placeholder="Large input"
                      helperText="Large size input"
                    />
                  </div>
                </ComponentExample>
              </div>
            </section>

            {/* Select Components */}
            <section id="select" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Select
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Basic Select"
                  description="A dropdown select with options and icons"
                  code={`import { Select, SelectOption } from '@/app/components/Select';

const options: SelectOption[] = [
  { value: "react", label: "React", icon: <Star size={16} /> },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte", disabled: true },
  { value: "next", label: "Next.js" }
];

<Select 
  options={options}
  value={selectValue}
  onChange={setSelectValue}
  label="Framework"
  placeholder="Choose a framework"
/>`}
                >
                  <div className="max-w-md w-full">
                    <Select 
                      options={selectOptions}
                      value={selectValue}
                      onChange={setSelectValue}
                      label="Framework"
                      placeholder="Choose a framework"
                    />
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Searchable Select"
                  description="A select dropdown with search functionality"
                  code={`<Select 
  options={locationOptions}
  label="Location"
  placeholder="Search countries..."
  searchable
  clearable
/>`}
                >
                  <div className="max-w-md w-full">
                    <Select 
                      options={locationOptions}
                      label="Location"
                      placeholder="Search countries..."
                      searchable
                      clearable
                    />
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Multiple Select"
                  description="Select multiple options with tags display"
                  code={`<Select 
  options={selectOptions}
  value={multiSelectValue}
  onChange={setMultiSelectValue}
  label="Technologies"
  placeholder="Select technologies"
  multiple
  clearable
/>`}
                >
                  <div className="max-w-md w-full">
                    <Select 
                      options={selectOptions}
                      value={multiSelectValue}
                      onChange={setMultiSelectValue}
                      label="Technologies"
                      placeholder="Select technologies"
                      multiple
                      clearable
                    />
                  </div>
                </ComponentExample>
              </div>
            </section>

            {/* Toast Components */}
            <section id="toast" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Toast
              </h2>
              
              <ComponentExample
                title="Toast Notifications"
                description="Show contextual feedback messages with different types"
                code={`import { useToast } from '@/app/components/ToastProvider';

const { showToast } = useToast();

// Show different toast types
showToast('success', 'Success', 'Operation completed successfully!');
showToast('error', 'Error', 'Something went wrong.');
showToast('warning', 'Warning', 'This action requires attention.');
showToast('info', 'Info', 'Here\\'s some helpful information.');`}
              >
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="primary" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleToastDemo('success')}
                  >
                    Success Toast
                  </Button>
                  <Button 
                    variant="primary" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleToastDemo('error')}
                  >
                    Error Toast
                  </Button>
                  <Button 
                    variant="primary" 
                    className="bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => handleToastDemo('warning')}
                  >
                    Warning Toast
                  </Button>
                  <Button 
                    variant="primary" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleToastDemo('info')}
                  >
                    Info Toast
                  </Button>
                </div>
              </ComponentExample>
            </section>

            {/* Loading Components */}
            <section id="loading" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Loading
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Loading Variants"
                  description="Different loading animations for various use cases"
                  code={`import { Loading } from '@/app/components/Loading';

<div className="flex items-center gap-8">
  <Loading variant="spinner" size="md" />
  <Loading variant="dots" size="md" />
  <Loading variant="pulse" size="md" />
</div>`}
                >
                  <div className="flex items-center gap-8">
                    <Loading variant="spinner" size="md" />
                    <Loading variant="dots" size="md" />
                    <Loading variant="pulse" size="md" />
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Loading with Text"
                  description="Loading indicators with custom text messages"
                  code={`<div className="space-y-4">
  <Loading text="Loading data..." />
  <Loading variant="dots" text="Processing..." />
  <Loading variant="pulse" text="Please wait..." />
</div>`}
                >
                  <div className="space-y-4">
                    <Loading text="Loading data..." />
                    <Loading variant="dots" text="Processing..." />
                    <Loading variant="pulse" text="Please wait..." />
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Loading Button"
                  description="A button that shows loading state during async operations"
                  code={`import { LoadingButton } from '@/app/components/Loading';

<LoadingButton 
  isLoading={loading}
  onClick={handleClick}
  loadingText="Saving..."
>
  Save Changes
</LoadingButton>`}
                >
                  <LoadingButton 
                    isLoading={loadingButtonState}
                    onClick={handleLoadingButton}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </LoadingButton>
                </ComponentExample>
              </div>
            </section>

            {/* Badge Components */}
            <section id="badge" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Badge
              </h2>
              
              <div className="space-y-8">
                <ComponentExample
                  title="Badge Variants"
                  description="Different badge styles for various contexts"
                  code={`import { Badge } from '@/app/components/Badge';

<div className="flex flex-wrap gap-2">
  <Badge variant="primary">Primary</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="danger">Danger</Badge>
  <Badge variant="info">Info</Badge>
</div>`}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Removable Badges"
                  description="Badges with remove functionality for tags"
                  code={`<div className="flex flex-wrap gap-2">
  <Badge variant="primary" removable onRemove={() => console.log('Removed!')}>
    React
  </Badge>
  <Badge variant="secondary" removable onRemove={() => console.log('Removed!')}>
    TypeScript
  </Badge>
  <Badge variant="info" removable onRemove={() => console.log('Removed!')}>
    Tailwind
  </Badge>
</div>`}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary" removable onRemove={() => console.log('Removed!')}>
                      React
                    </Badge>
                    <Badge variant="secondary" removable onRemove={() => console.log('Removed!')}>
                      TypeScript
                    </Badge>
                    <Badge variant="info" removable onRemove={() => console.log('Removed!')}>
                      Tailwind
                    </Badge>
                  </div>
                </ComponentExample>

                <ComponentExample
                  title="Special Badges"
                  description="Number badges, status badges, and dot indicators"
                  code={`import { NumberBadge, StatusBadge, DotBadge } from '@/app/components/Badge';

<div className="flex items-center gap-4 flex-wrap">
  <div className="flex items-center gap-2">
    <span>Notifications</span>
    <NumberBadge count={5} />
  </div>
  
  <div className="flex items-center gap-2">
    <span>Messages</span>
    <NumberBadge count={150} max={99} />
  </div>
  
  <StatusBadge status="online" />
  <StatusBadge status="busy" />
  
  <div className="flex items-center gap-2">
    <DotBadge variant="success" pulse />
    <span>Live</span>
  </div>
</div>`}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span>Notifications</span>
                      <NumberBadge count={5} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Messages</span>
                      <NumberBadge count={150} max={99} />
                    </div>
                    
                    <StatusBadge status="online" />
                    <StatusBadge status="busy" />
                    
                    <div className="flex items-center gap-2">
                      <DotBadge variant="success" pulse />
                      <span>Live</span>
                    </div>
                  </div>
                </ComponentExample>
              </div>
            </section>

            {/* Theme Components */}
            <section id="theme" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Theme Toggle
              </h2>
              
              <ComponentExample
                title="Theme Switcher"
                description="Toggle between light and dark themes with smooth transitions"
                code={`import { ThemeToggle } from '@/app/components/ThemeToggle';
import { useTheme } from '@/app/components/ThemeProvider';

const { theme, setTheme } = useTheme();

<div className="flex items-center gap-4">
  <ThemeToggle />
  <span>Current theme: {theme}</span>
</div>`}
              >
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <span>Current theme: {theme}</span>
                </div>
              </ComponentExample>
            </section>

            {/* Language Components */}
            <section id="language" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Language Dropdown
              </h2>
              
              <ComponentExample
                title="Language Switcher"
                description="Switch between supported languages (Korean/English)"
                code={`import { LanguageDropdown } from '@/app/components/LanguageDropdown';
import { useLanguage } from '@/app/components/LanguageProvider';

const { language } = useLanguage();

<div className="flex items-center gap-4">
  <LanguageDropdown />
  <span>Current language: {language}</span>
</div>`}
              >
                <div className="flex items-center gap-4">
                  <LanguageDropdown />
                  <span>Current language: Korean/English</span>
                </div>
              </ComponentExample>
            </section>

            {/* Icons Section */}
            <section id="icons" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Icons
              </h2>
              
              <ComponentExample
                title="Google Icon"
                description="Official Google logo for OAuth integration"
                code={`import { GoogleIcon } from '@/app/components/GoogleIcon';

<div className="flex items-center gap-4">
  <GoogleIcon size={16} />
  <GoogleIcon size={24} />
  <GoogleIcon size={32} />
</div>`}
              >
                <div className="flex items-center gap-4">
                  <GoogleIcon size={16} />
                  <GoogleIcon size={24} />
                  <GoogleIcon size={32} />
                </div>
              </ComponentExample>

              <ComponentExample
                title="Lucide Icons"
                description="Comprehensive icon set from Lucide React"
                code={`import { Search, Heart, User, Settings, Star, Bell } from 'lucide-react';

<div className="flex items-center gap-4">
  <Search size={20} />
  <Heart size={20} />
  <User size={20} />
  <Settings size={20} />
  <Star size={20} />
  <Bell size={20} />
</div>`}
              >
                <div className="flex items-center gap-4">
                  <Search size={20} />
                  <Heart size={20} />
                  <User size={20} />
                  <Settings size={20} />
                  <Star size={20} />
                  <Bell size={20} />
                </div>
              </ComponentExample>
            </section>

            {/* Providers Section */}
            <section id="providers" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Providers
              </h2>
              
              <ComponentExample
                title="Context Providers"
                description="Global state management for theme, language, and notifications"
                code={`import { ThemeProvider } from '@/app/components/ThemeProvider';
import { LanguageProvider } from '@/app/components/LanguageProvider';
import { ToastProvider } from '@/app/components/ToastProvider';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          {/* Your app components */}
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Use in components
const { theme, setTheme } = useTheme();
const { language, t } = useLanguage();
const { showToast } = useToast();`}
              >
                <div className="p-6 bg-[var(--muted)]/10 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">ThemeProvider - Dark/light theme management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">LanguageProvider - Internationalization (i18n)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">ToastProvider - Global notification system</span>
                    </div>
                  </div>
                </div>
              </ComponentExample>
            </section>

            {/* Error Boundary Section */}
            <section id="error" className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                Error Boundary
              </h2>
              
              <ComponentExample
                title="Error Boundary"
                description="Catch and handle React component errors gracefully"
                code={`import { ErrorBoundary } from '@/app/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary 
  fallback={
    <div className="text-center p-8">
      <h2>Oops! Something went wrong</h2>
      <p>Please refresh the page and try again.</p>
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>`}
              >
                <div className="p-6 bg-[var(--muted)]/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[var(--foreground)] mb-1">Error Boundary Active</h4>
                      <p className="text-sm text-[var(--muted)]">
                        This component will catch JavaScript errors anywhere in the child component tree 
                        and display a fallback UI instead of crashing the entire application.
                      </p>
                    </div>
                  </div>
                </div>
              </ComponentExample>
            </section>

          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>Example Modal</ModalHeader>
        <ModalBody>
          <p>This is an example modal dialog. You can put any content here including forms, images, or other components.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          showToast({
            type: 'success',
            title: 'Deleted',
            message: 'Item has been deleted successfully!'
          });
          setConfirmModalOpen(false);
        }}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        title="Mobile Bottom Sheet"
      >
        <div className="space-y-4">
          <p>This is a bottom sheet that slides up from the bottom on mobile devices. It&apos;s perfect for mobile-optimized interactions.</p>
          <div className="space-y-3">
            <Button fullWidth variant="primary">
              Primary Action
            </Button>
            <Button fullWidth variant="secondary" onClick={() => setBottomSheetOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}