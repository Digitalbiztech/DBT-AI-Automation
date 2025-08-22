# Digital Marketing Orchestrator - Design System

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Layout](#layout)
5. [UI Components](#ui-components)
6. [Animations](#animations)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Icons](#icons)
10. [Theming](#theming)

## Design Principles

1. **Clarity** - Clear visual hierarchy and intuitive navigation with focused content areas
2. **Consistency** - Uniform components and patterns throughout the application
3. **Efficiency** - Streamlined workflows for common marketing tasks with minimal clicks
4. **Flexibility** - Adaptable to various marketing needs and campaign types
5. **Data-Driven** - Clear visualization of marketing metrics and KPIs
6. **Accessibility** - WCAG 2.1 AA compliance for all users
7. **Performance** - Fast loading times and smooth interactions

## Color Palette

### Primary Colors
- `Primary`: `#3B82F6` (Blue-500) - Used for primary actions and important elements
- `Primary Dark`: `#2563EB` (Blue-600) - Hover/focus states
- `Primary Light`: `#60A5FA` (Blue-400) - Subtle highlights
- `Primary/10`: `#EFF6FF` - Light backgrounds, highlights

### Secondary Colors
- `Success`: `#10B981` (Emerald-500) - Positive actions, success states
- `Success/10`: `#ECFDF5` - Success backgrounds
- `Warning`: `#F59E0B` (Amber-500) - Warnings, pending states
- `Warning/10`: `#FFFBEB` - Warning backgrounds
- `Error`: `#EF4444` (Red-500) - Errors, destructive actions
- `Error/10`: `#FEF2F2` - Error backgrounds
- `Info`: `#3B82F6` (Blue-500) - Informational messages
- `Info/10`: `#EFF6FF` - Info backgrounds

### Neutrals
- `Background`: `#F9FAFB` (Gray-50) - Page background
- `Surface`: `#FFFFFF` (White) - Cards, panels, modals
- `Border`: `#E5E7EB` (Gray-200) - Dividers, borders
- `Text Primary`: `#111827` (Gray-900) - Main text
- `Text Secondary`: `#6B7280` (Gray-500) - Secondary text
- `Disabled`: `#9CA3AF` (Gray-400) - Disabled states
- `Overlay`: `rgba(0, 0, 0, 0.5)` - Backdrop overlays

### Gradients
- `Primary Gradient`: `linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)`
- `Success Gradient`: `linear-gradient(135deg, #10B981 0%, #059669 100%)`
- `Warning Gradient`: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`
- `Error Gradient`: `linear-gradient(135deg, #EF4444 0%, #DC2626 100%)`

### Usage Guidelines
- Use primary colors for primary actions and important elements
- Use semantic colors appropriately (success, warning, error, info)
- Maintain sufficient contrast for text readability (4.5:1 minimum)
- Use gradients sparingly for emphasis and visual interest
- Follow dark mode theming guidelines for all color usage

## Typography

### Font Family
- **Primary**: `Inter`, system-ui, sans-serif
- **Monospace**: `JetBrains Mono`, monospace
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Font Loading**: Preload critical fonts for better performance

### Type Scale

| Element | Font Size | Line Height | Font Weight | Letter Spacing | Usage |
|---------|-----------|-------------|-------------|----------------|-------|
| Display | 3.5rem (56px) | 4rem | 700 | -0.02em | Hero sections, page titles |
| H1 | 2.5rem (40px) | 3rem | 700 | -0.02em | Main page headings |
| H2 | 2rem (32px) | 2.5rem | 700 | -0.02em | Section headings |
| H3 | 1.75rem (28px) | 2.25rem | 600 | -0.01em | Subsection headings |
| H4 | 1.5rem (24px) | 2rem | 600 | -0.01em | Card titles, form labels |
| H5 | 1.25rem (20px) | 1.75rem | 600 | 0 | Subtitles, small headings |
| H6 | 1.125rem (18px) | 1.5rem | 600 | 0.01em | UI elements, buttons |
| Body L | 1.125rem (18px) | 1.75rem | 400 | 0 | Large body text |
| Body M | 1rem (16px) | 1.5rem | 400 | 0.01em | Standard body text |
| Body S | 0.875rem (14px) | 1.25rem | 400 | 0.01em | Secondary text, captions |
| Button L | 1rem (16px) | 1.5rem | 500 | 0.02em | Large buttons |
| Button M | 0.875rem (14px) | 1.25rem | 500 | 0.02em | Standard buttons |
| Button S | 0.75rem (12px) | 1rem | 500 | 0.02em | Small buttons |
| Caption | 0.75rem (12px) | 1rem | 400 | 0.02em | Help text, timestamps |
| Overline | 0.625rem (10px) | 0.75rem | 500 | 0.1em | Labels, tags |

### Text Styles

#### Headings
```css
h1, .h1 {
  font-size: 2.5rem;
  line-height: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}
```

#### Body Text
```css
.body-regular {
  font-size: 1rem;
  line-height: 1.5rem;
  letter-spacing: 0.01em;
  color: var(--text-primary);
}
```

#### Utility Classes
```css
/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Text transformation */
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
.normal-case { text-transform: none; }

/* Text decoration */
.underline { text-decoration: underline; }
.line-through { text-decoration: line-through; }
.no-underline { text-decoration: none; }

/* Text overflow */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Line clamp (multiline truncate) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Text colors */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-inherit { color: inherit; }

/* Font weights */
.font-regular { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### Font Pairing
- **Primary + Monospace**: Use for code snippets within content
- **Headings + Body**: Maintain good contrast between heading and body text
- **Hierarchy**: Use consistent spacing and sizing to establish clear visual hierarchy

### Best Practices
- Use relative units (rem) for font sizes to respect user preferences
- Maintain a line length of 45-75 characters for optimal readability
- Use proper heading hierarchy (h1 > h2 > h3, etc.)
- Ensure sufficient contrast between text and background colors
- Use letter-spacing to improve readability, especially for all-caps text

## Layout

### Grid System

#### Base Units
- **1 Unit**: `4px` (0.25rem)
- **Base Spacing**: `16px` (1rem)
- **Gutter**: `24px` (1.5rem)
- **Max Container Width**: `1280px` (80rem)
- **Sidebar Width**: `280px` (17.5rem)
- **Collapsed Sidebar**: `72px` (4.5rem)
- **Header Height**: `64px` (4rem)
- **Footer Height**: `56px` (3.5rem)
- **Border Radius**:
  - `sm`: `4px` (0.25rem)
  - `md`: `8px` (0.5rem)
  - `lg`: `12px` (0.75rem)
  - `xl`: `16px` (1rem)
  - `2xl`: `24px` (1.5rem)
  - `full`: `9999px` (fully rounded)

### Spacing Scale

| Name | Value (px) | Value (rem) | Example Usage |
|------|------------|-------------|---------------|
| 3xs | 4px | 0.25rem | Small padding, tight spacing |
| 2xs | 8px | 0.5rem | Small padding, tight spacing |
| xs | 12px | 0.75rem | Small padding, tight spacing |
| sm | 16px | 1rem | Default padding |
| md | 24px | 1.5rem | Section spacing |
| lg | 32px | 2rem | Large spacing |
| xl | 48px | 3rem | Extra large spacing |
| 2xl | 64px | 4rem | Section spacing |
| 3xl | 96px | 6rem | Large section spacing |

### Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base | 0 | Default |
| Dropdown | 1000 | Dropdowns, popovers |
| Sticky | 1100 | Sticky headers |
| Fixed | 1200 | Fixed elements |
| Modal | 1300 | Modals, dialogs |
| Toast | 1400 | Toasts, notifications |
| Tooltip | 1500 | Tooltips |

### Layout Utilities

#### Container
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Responsive container */
@screen md {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
```

#### Grid Layout
```css
.grid {
  display: grid;
  gap: 1.5rem; /* 24px */
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/* Example column spans */
.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
/* ... up to col-span-12 */

/* Responsive grid */
@screen md {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

#### Flexbox Utilities
```css
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; } /* 16px */
```

#### Spacing Utilities
```css
/* Margin */
.m-4 { margin: 1rem; } /* 16px */
.mx-auto { margin-left: auto; margin-right: auto; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; } /* 32px */
.mt-4 { margin-top: 1rem; } /* 16px */

/* Padding */
.p-4 { padding: 1rem; } /* 16px */
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; } /* 24px */
.py-8 { padding-top: 2rem; padding-bottom: 2rem; } /* 32px */
.pt-12 { padding-top: 3rem; } /* 48px */
```

#### Position Utilities
```css
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }
.top-0 { top: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }
.z-10 { z-index: 10; }
```

### Page Layout Examples

#### Sidebar Layout
```tsx
<div className="flex h-screen bg-background">
  {/* Sidebar */}
  <aside className="w-72 border-r border-border bg-card">
    {/* Sidebar content */}
  </aside>
  
  {/* Main content */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <header className="h-16 border-b border-border flex items-center px-6">
      {/* Header content */}
    </header>
    
    {/* Page content */}
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page content */}
      </div>
    </main>
  </div>
</div>
```

#### Card Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  {items.map((item) => (
    <Card key={item.id} className="h-full">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

### Best Practices
- Use a consistent spacing scale throughout the application
- Maintain proper vertical rhythm using consistent spacing
- Use semantic HTML5 elements for better accessibility
- Implement responsive design with mobile-first approach
- Test layouts across different screen sizes and devices
- Use CSS Grid for two-dimensional layouts
- Use Flexbox for one-dimensional layouts

## UI Components

### Dashboard Stats Cards

Stats cards are used to display key metrics and KPIs in the dashboard overview. Each card provides a quick snapshot of important information.

#### Design Specifications

- **Container**: 
  - Rounded corners: `rounded-xl`
  - Background: White or card background
  - Shadow: `shadow-sm` on default, `shadow-md` on hover
  - Padding: `p-6`
  - Border: `border` with subtle border color
  - Hover effect: Slight scale and shadow increase

- **Content Layout**:
  - Flex column layout
  - Space between content: `space-y-4`
  - Icon positioned at the top right

- **Typography**:
  - Title: `text-sm font-medium text-muted-foreground`
  - Value: `text-2xl font-bold`
  - Change indicator: `text-sm` with appropriate color based on trend

- **Colors**:
  - Each card can have a unique accent color for the icon and gradient
  - Use semantic colors for different metric types (e.g., green for positive, red for negative)

#### Example Implementation

```tsx
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  gradient
}: StatCardProps) => (
  <div className="relative p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{change}</p>
    </div>
  </div>
);

// Usage
const stats = [
  {
    title: "Total Campaigns",
    value: "24",
    change: "+12% from last month",
    icon: BarChart3,
    color: "text-blue-600",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+5.2% from last week",
    icon: Users,
    color: "text-green-600",
    gradient: "from-green-400 to-emerald-600"
  },
  {
    title: "Posts Scheduled",
    value: "156",
    change: "Next 7 days",
    icon: Calendar,
    color: "text-purple-600",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    title: "AI Agents Active",
    value: "8",
    change: "All systems operational",
    icon: Bot,
    color: "text-orange-600",
    gradient: "from-orange-400 to-red-500"
  }
];

// In your component
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map((stat, index) => (
    <StatCard key={index} {...stat} />
  ))}
</div>
```

#### Accessibility Considerations
- Ensure sufficient color contrast for text and icons
- Include ARIA labels for icons
- Make the card focusable and keyboard navigable
- Provide meaningful text alternatives for visual elements
- Use semantic HTML elements where appropriate

#### Best Practices
- Keep the number of stats cards to a maximum of 4-6 for better scannability
- Use consistent formatting for similar metrics (e.g., always show percentages with one decimal place)
- Group related metrics together
- Consider adding loading states for async data
- Make the cards clickable if they lead to more detailed views

#### Responsive Behavior
- On mobile: 1 column
- On tablet: 2 columns
- On desktop: 4 columns
- Adjust padding and font sizes for smaller screens

#### Variations
- **With Trend Indicator**: Add an arrow icon showing upward/downward trend
- **With Progress Bar**: Show a progress bar for completion metrics
- **With Sparkline**: Add a small chart showing historical data
- **With Action Button**: Include a small action button in the corner

### Buttons

```tsx
import { Button } from "@/components/ui/button"

// Primary Button
<Button>Primary Action</Button>

// Secondary Button
<Button variant="outline">Secondary Action</Button>

// Icon Button
<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>

// Loading State
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Campaign Performance</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Forms

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormInput({ label, id, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}
```

### Data Tables

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Campaign</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Impressions</TableHead>
      <TableHead>CTR</TableHead>
      <TableHead>Conversions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* Table rows */}
  </TableBody>
</Table>
```

## Animations

### Micro-interactions

1. **Button Hover/Focus**
   ```css
   .btn {
     transition: all 0.2s ease-in-out;
   }
   .btn:hover {
     transform: translateY(-1px);
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   }
   .btn:active {
     transform: translateY(0);
   }
   ```

2. **Card Hover**
   ```css
   .card {
     transition: transform 0.2s ease, box-shadow 0.2s ease;
   }
   .card:hover {
     transform: translateY(-2px);
     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
   }
   ```

### Page Transitions

```tsx
// Using framer-motion
import { motion } from "framer-motion"

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)
```

### Loading States

```tsx
// Skeleton loader
import { Skeleton } from "@/components/ui/skeleton"

const LoadingCard = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </CardContent>
  </Card>
)
```

## Responsive Design

### Breakpoints
- Mobile: `640px` and below
- Tablet: `641px` to `1024px`
- Desktop: `1025px` and above

### Responsive Utilities

```tsx
// Using Tailwind CSS responsive prefixes
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>

// Hiding elements based on breakpoint
<div className="hidden md:block">
  {/* Only visible on medium screens and up */}
</div>
```

## Accessibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Logical tab order
- Skip to main content link

### ARIA
- Proper ARIA labels for all interactive elements
- ARIA live regions for dynamic content
- Proper heading hierarchy
- Form field associations

### Color Contrast
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Color is not the only means of conveying information

### Screen Reader Support
- All images have alt text
- Decorative images have empty alt attributes
- Complex widgets have proper ARIA attributes
- Form validation messages are associated with form fields

## Design Tokens

### Shadows
- xs: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- sm: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- md: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### Border Radius
- sm: `2px`
- md: `4px`
- lg: `8px`
- full: `9999px`

### Transitions
- fast: `100ms`
- normal: `200ms`
- slow: `300ms`

## Component States

### Button States
- Default
- Hover
- Focus
- Active
- Disabled
- Loading

### Form Field States
- Default
- Hover
- Focus
- Error
- Disabled
- Read-only

## Icons

### Icon Sizes
- xs: `12px`
- sm: `16px`
- md: `20px`
- lg: `24px`
- xl: `32px`

### Icon Usage
```tsx
import { Plus, Trash2, Edit, Settings } from "lucide-react"

<Button variant="outline" size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

## Best Practices

### Do's
- Use semantic HTML elements
- Follow the spacing scale
- Maintain consistent padding and margins
- Use the color palette consistently
- Test components in multiple viewports
- Ensure proper contrast ratios
- Provide alternative text for images
- Use ARIA attributes where appropriate

### Don'ts
- Don't use inline styles
- Don't override component styles unless necessary
- Don't use absolute positioning unless required
- Don't use fixed heights that might cause content overflow
- Don't rely solely on color to convey information
- Don't use small font sizes (below 12px)

## Design Resources
- [Figma UI Kit](#) (Link to Figma file)
- [Icon Library](#) (Link to icon set)
- [Color Palette](#) (Link to color palette)
- [Typography Scale](#) (Link to type scale)

## Implementation Notes
- All components are built with React and TypeScript
- Styling is done with Tailwind CSS
- Animations use Framer Motion
- Icons are from Lucide React
- Form handling with React Hook Form
- State management with React Query and Zustand
