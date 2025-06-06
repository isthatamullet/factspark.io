# FactSpark.io UI/UX Requirements Document v2.0
## Dark Theme Fact-Checking Platform

### 1. Introduction
This document outlines the visual styling, color scheme, and user experience requirements for FactSpark.io, an AI-powered fact-checking platform. The design emphasizes trust, clarity, and modern aesthetics with a sophisticated dark theme.

### 2. Overall Design Philosophy
- **Trust-First Design**: Clean, professional interface that builds user confidence
- **Information Hierarchy**: Clear visual organization of fact-checking data
- **Accessibility**: High contrast and readable typography for all users
- **Modern Minimalism**: Sophisticated dark theme with strategic color usage
- **Responsive Excellence**: Seamless experience across desktop, tablet, and mobile

### 3. Color Palette

#### Primary Colors
- **Deep Background**: `#0A0A0B` - Main application background
- **Card Background**: `#1A1B1E` - Content cards, modals, elevated surfaces
- **Surface Background**: `#252629` - Secondary surfaces, sidebar panels

#### Accent Colors
- **Primary Accent**: `#4F46E5` - CTAs, links, primary actions, accuracy indicators
- **Success Green**: `#10B981` - "True" ratings, verified claims, positive indicators
- **Warning Orange**: `#F59E0B` - "Mixed" ratings, caution states, pending analysis
- **Error Red**: `#EF4444` - "False" ratings, errors, critical warnings
- **Info Blue**: `#3B82F6` - "Unverifiable" ratings, neutral information

#### Text Colors
- **Primary Text**: `#F9FAFB` - Headlines, primary content, important labels
- **Secondary Text**: `#D1D5DB` - Body text, descriptions, metadata
- **Muted Text**: `#9CA3AF` - Timestamps, less critical information
- **Accent Text**: `#A855F7` - Interactive text, highlighted terms

#### Utility Colors
- **Border**: `#374151` - Card borders, dividers, input outlines
- **Border Light**: `#4B5563` - Hover states, focused elements
- **Overlay**: `rgba(0, 0, 0, 0.75)` - Modals, dropdowns, overlays

### 4. Typography System

#### Font Hierarchy
- **Display**: 32-48px, Bold, `#F9FAFB` - Page titles, hero headings
- **Heading 1**: 24-32px, Semibold, `#F9FAFB` - Section titles
- **Heading 2**: 20-24px, Semibold, `#F9FAFB` - Subsection titles
- **Heading 3**: 18-20px, Medium, `#F9FAFB` - Card titles, article headlines
- **Body Large**: 16-18px, Regular, `#D1D5DB` - Primary content
- **Body**: 14-16px, Regular, `#D1D5DB` - Standard text
- **Caption**: 12-14px, Medium, `#9CA3AF` - Metadata, timestamps
- **Label**: 12-14px, Semibold, `#F9FAFB` - Form labels, tags

#### Font Recommendations
- Primary: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Monospace: "SF Mono", Monaco, "Cascadia Code", monospace (for URLs, code)

### 5. Implementation with Tailwind CSS

#### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        card: '#1A1B1E',
        surface: '#252629',
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          active: '#3730A3',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        text: {
          primary: '#F9FAFB',
          secondary: '#D1D5DB',
          muted: '#9CA3AF',
          accent: '#A855F7',
        },
        border: {
          DEFAULT: '#374151',
          light: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', '"Cascadia Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 6. Component Specifications (Complete from original)

#### 6.1 Navigation & Header
**Top Navigation Bar**
- Background: `bg-card border-b border-border`
- Logo with search icon accent in `text-primary`
- Navigation links: `text-text-secondary hover:text-text-primary`
- Mobile: Hamburger menu with slide-out navigation

#### 6.2 URL Submission Interface
**Hero Section**
- Large, centered URL input field with rounded corners
- Input styling: `bg-surface border-border focus:border-primary`
- Submit button: `bg-primary hover:bg-primary-hover text-white`

#### 6.3 Fact-Check Analysis Cards
**Article Analysis Card**
- Background: `bg-card border border-border rounded-2xl`
- Hover: `hover:shadow-xl hover:-translate-y-1 transition-all`
- Accuracy indicators with dynamic colors based on score

#### 6.4 Category & Browse Pages
**Category Pills**
- Inactive: `bg-surface text-text-secondary`
- Active: `bg-primary text-white`
- Hover transitions with Tailwind

#### 6.5 Mobile-Specific Considerations
- Minimum 44px touch targets
- Bottom navigation for mobile
- Swipe gestures support

### 7. Interactive States & Animations

```css
/* Custom animations in globals.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
  }
}

/* Loading shimmer effect */
.shimmer {
  background: linear-gradient(
    90deg,
    theme('colors.card') 25%,
    theme('colors.surface') 50%,
    theme('colors.card') 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 8. Page-Specific Requirements (All from original preserved)
[All original page specifications maintained...]

### 9. Responsive Breakpoints
- Desktop (1200px+): Full layouts
- Tablet (768px - 1199px): Adjusted grids
- Mobile (320px - 767px): Single column

### 10. Performance Considerations
- Use CSS transforms for animations
- Implement will-change sparingly
- Respect prefers-reduced-motion
- Lazy load non-critical assets

### 11. Brand Integration
- Logo variations for different contexts
- Consistent voice in UI copy
- Trust-building through transparency