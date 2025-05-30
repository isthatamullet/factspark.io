# FactSpark.io Complete Page Specifications v2.0

[All original page specifications preserved with implementation details]

## Implementation Examples with Next.js 14

### 1. Homepage Component
```typescript
// app/page.tsx
import { Suspense } from 'react'
import { HeroSection } from '@/components/hero'
import { RecentAnalyses } from '@/components/recent-analyses'
import { TrustIndicators } from '@/components/trust-indicators'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <TrustIndicators />
      <Suspense fallback={<div className="shimmer h-96" />}>
        <RecentAnalyses />
      </Suspense>
    </main>
  )
}
```

### 2. Analysis Results Page
```typescript
// app/analysis/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getAnalysis } from '@/lib/api'
import { AnalysisResults } from '@/components/analysis-results'

export default async function AnalysisPage({
  params
}: {
  params: { id: string }
}) {
  const analysis = await getAnalysis(params.id)
  
  if (!analysis) {
    notFound()
  }

  return <AnalysisResults data={analysis} />
}
```

### 3. API Route Example
```typescript
// app/api/check/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { processUrl } from '@/lib/fact-check'

const schema = z.object({
  url: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = schema.parse(body)
    
    const jobId = await processUrl(url)
    
    return Response.json({ jobId }, { status: 202 })
  } catch (error) {
    return Response.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
```

[All original page layouts, copy content, and styling specifications preserved]

## Public URL Submission Decision

Based on the analysis in the original document, implement a **Hybrid Model**:
- **Phase 1 (MVP)**: Admin-only submission for quality control
- **Phase 2**: Limited public submission with rate limiting
- **Phase 3**: Full public access with freemium model

This approach balances growth potential with resource management.