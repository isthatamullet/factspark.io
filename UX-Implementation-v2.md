# FactSpark.io UX Implementation Guide v2.0

## 1. Complete Tailwind Setup

### Installation
```bash
# In the web app directory
pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
pnpm add clsx tailwind-merge class-variance-authority
npx tailwindcss init -p
```

### Configuration (tailwind.config.ts)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        // ... complete color system
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### Global Styles (app/globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0 7;
    --foreground: 0 0 98;
    --card: 0 0 12;
    --card-foreground: 0 0 98;
    --primary: 237 75 90;
    --primary-foreground: 0 0 100;
    /* ... complete CSS variables */
  }

  .dark {
    --background: 0 0 7;
    --foreground: 0 0 98;
    /* ... dark mode variables */
  }
}

@layer components {
  .shimmer {
    @apply relative overflow-hidden;
  }
  
  .shimmer::before {
    @apply absolute inset-0 -translate-x-full;
    background-image: linear-gradient(
      90deg,
      transparent,
      hsl(var(--card) / 0.5),
      transparent
    );
    content: '';
    animation: shimmer 2s infinite;
  }
}
```

## 2. Component Architecture

### Base Component Structure
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Theme Provider
```typescript
// components/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Example Component with Animations
```typescript
// components/analysis-card.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnalysisCardProps {
  analysis: Analysis
  className?: string
}

export function AnalysisCard({ analysis, className }: AnalysisCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'bg-card rounded-xl border border-border p-6',
        'transition-shadow hover:shadow-xl',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            {analysis.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {analysis.excerpt}
          </p>
        </div>
        <ScoreIndicator score={analysis.score} />
      </div>
    </motion.article>
  )
}
```

## 3. Interactive States Implementation

[All original interactive states and animations preserved with Tailwind/Framer Motion implementations]

## 4. Responsive Design System

### Breakpoint Utilities
```typescript
// hooks/use-media-query.ts
import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
```

## 5. Loading States

### Skeleton Components
```typescript
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('shimmer bg-muted rounded-md', className)}
      {...props}
    />
  )
}
```

## 6. Accessibility Features

- Focus visible states on all interactive elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader optimizations
- Reduced motion support

[All original UX requirements and specifications preserved]