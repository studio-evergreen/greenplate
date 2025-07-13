"use client";

import { useState } from "react";
import { useLanguage } from "../../components/LanguageProvider";
import { Card, CardHeader, CardBody, CardFooter } from "../../components/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from "../../components/Modal";
import { Loading, LoadingButton } from "../../components/Loading";
import { Badge, DotBadge, NumberBadge, StatusBadge } from "../../components/Badge";
import { Select, SelectOption } from "../../components/Select";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ComponentExample } from "../../components/CodeBlock";
import { Search, Heart, User, Settings, MapPin, Globe, Star } from "lucide-react";

export default function ComponentsPage() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loadingButtonState, setLoadingButtonState] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState("");

  const handleLoadingButton = () => {
    setLoadingButtonState(true);
    setTimeout(() => setLoadingButtonState(false), 2000);
  };

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
          {t("components.title")}
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-3xl">
          {t("components.subtitle")}
        </p>
      </div>

      {/* Card Components */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          {t("components.card.title")}
        </h2>
        
        <div className="space-y-8">
          <ComponentExample
            title={t("components.card.basicCard")}
            description={t("components.card.basicCardDesc")}
            code={`import { Card, CardBody } from "@/app/components/Card";

<Card>
  <CardBody>
    This is a basic card with some content inside.
  </CardBody>
</Card>`}
          >
            <Card>
              <CardBody>
{t("components.card.basicCardContent")}
              </CardBody>
            </Card>
          </ComponentExample>

          <ComponentExample
            title={t("components.card.withHeaderFooter")}
            description={t("components.card.withHeaderFooterDesc")}
            code={`import { Card, CardHeader, CardBody, CardFooter } from "@/app/components/Card";
import Button from "@/app/components/Button";

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
</Card>`}
          >
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">{t("components.card.cardTitle")}</h3>
              </CardHeader>
              <CardBody>
                <p>{t("components.card.cardDemo")}</p>
              </CardBody>
              <CardFooter>
                <Button variant="primary">{t("components.card.action")}</Button>
                <Button variant="secondary">{t("components.card.cancel")}</Button>
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
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          Modal
        </h2>
        
        <div className="space-y-8">
          <ComponentExample
            title="Basic Modal"
            description="A modal dialog with header, body, and footer"
            code={`import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/app/components/Modal";
import Button from "@/app/components/Button";

const [modalOpen, setModalOpen] = useState(false);

<>
  <Button onClick={() => setModalOpen(true)}>
    Open Modal
  </Button>
  
  <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
    <ModalHeader>Modal Title</ModalHeader>
    <ModalBody>
      <p>This is the modal content. You can put any content here.</p>
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
            code={`import { ConfirmModal } from "@/app/components/Modal";

const [confirmModalOpen, setConfirmModalOpen] = useState(false);

<>
  <Button 
    variant="danger" 
    onClick={() => setConfirmModalOpen(true)}
  >
    Delete Item
  </Button>
  
  <ConfirmModal
    isOpen={confirmModalOpen}
    onClose={() => setConfirmModalOpen(false)}
    onConfirm={() => {
      // Handle deletion
      setConfirmModalOpen(false);
    }}
    title="Delete Item"
    message="Are you sure you want to delete this item? This action cannot be undone."
    confirmText="Delete"
    variant="danger"
  />
</>`}
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

      {/* Loading Components */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          Loading
        </h2>
        
        <div className="space-y-8">
          <ComponentExample
            title="Loading Variants"
            description="Different loading animations with various sizes and colors"
            code={`import { Loading } from "@/app/components/Loading";

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
            code={`import { LoadingButton } from "@/app/components/Loading";

const [loading, setLoading] = useState(false);

const handleClick = () => {
  setLoading(true);
  setTimeout(() => setLoading(false), 2000);
};

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
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          Badge
        </h2>
        
        <div className="space-y-8">
          <ComponentExample
            title="Badge Variants"
            description="Different badge styles for various use cases"
            code={`import { Badge } from "@/app/components/Badge";

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
            description="Badges with remove functionality, perfect for tags"
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
            title="Number and Status Badges"
            description="Special badges for notifications and status indicators"
            code={`import { NumberBadge, StatusBadge, DotBadge } from "@/app/components/Badge";

<div className="flex items-center gap-4">
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

      {/* Select Components */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          Select
        </h2>
        
        <div className="space-y-8">
          <ComponentExample
            title="Basic Select"
            description="A dropdown select with various options and icons"
            code={`import { Select, SelectOption } from "@/app/components/Select";
import { Star } from "lucide-react";

const options: SelectOption[] = [
  { value: "react", label: "React", icon: <Star size={16} /> },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte", disabled: true },
  { value: "next", label: "Next.js" }
];

<div className="max-w-md">
  <Select 
    options={options}
    value={selectValue}
    onChange={setSelectValue}
    label="Framework"
    placeholder="Choose a framework"
  />
</div>`}
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
            code={`<div className="max-w-md">
  <Select 
    options={locationOptions}
    label="Location"
    placeholder="Search countries..."
    searchable
    clearable
  />
</div>`}
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
            code={`<div className="max-w-md">
  <Select 
    options={selectOptions}
    value={multiSelectValue}
    onChange={setMultiSelectValue}
    label="Technologies"
    placeholder="Select technologies"
    multiple
    clearable
  />
</div>`}
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

          <ComponentExample
            title="Select Sizes and States"
            description="Different sizes and error states"
            code={`<div className="space-y-4 max-w-md">
  <Select 
    options={selectOptions}
    placeholder="Small select"
    size="sm"
  />
  
  <Select 
    options={selectOptions}
    placeholder="Large select"
    size="lg"
  />
  
  <Select 
    options={selectOptions}
    label="With Error"
    error="This field is required"
    placeholder="Select option"
  />
  
  <Select 
    options={selectOptions}
    label="Disabled"
    placeholder="Disabled select"
    disabled
  />
</div>`}
          >
            <div className="space-y-4 max-w-md w-full">
              <Select 
                options={selectOptions}
                placeholder="Small select"
                size="sm"
              />
              
              <Select 
                options={selectOptions}
                placeholder="Large select"
                size="lg"
              />
              
              <Select 
                options={selectOptions}
                label="With Error"
                error="This field is required"
                placeholder="Select option"
              />
              
              <Select 
                options={selectOptions}
                label="Disabled"
                placeholder="Disabled select"
                disabled
              />
            </div>
          </ComponentExample>
        </div>
      </section>

      {/* Input & Button Examples */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          Form Controls
        </h2>
        
        <div className="space-y-8">
          <ComponentExample
            title="Input Variants"
            description="Text inputs with icons, labels, and error states"
            code={`import Input from "@/app/components/Input";
import { Search, User } from "lucide-react";

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
            title="Button Variants"
            description="Different button styles and states"
            code={`import Button from "@/app/components/Button";
import { Heart, Settings } from "lucide-react";

<div className="flex flex-wrap gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  
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
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              
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
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalBody>
          <p>This is the modal content. You can put any content here including forms, images, or other components.</p>
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
          console.log('Item deleted!');
          setConfirmModalOpen(false);
        }}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}