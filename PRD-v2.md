# Product Requirement Document: FactSpark.io v2.0
Version: 2.0
Date: May 25, 2025
Author: AI Assistant & isthatamullet
Status: Revised for Codespaces Environment

## 1. Introduction / Overview
- **1.1. Purpose**: This document outlines the product requirements, technical specifications, features, data flows, and implementation roadmap for FactSpark.io, an AI-powered fact-checking platform.
- **1.2. Product Vision**: To empower individuals with an accessible and reliable tool to critically evaluate the accuracy of online information, combating misinformation through transparent AI-driven analysis.
- **1.3. Goals & Objectives**:
  - Develop an MVP that allows users to submit URLs for AI-driven fact-checking
  - Provide clear summaries with claim accuracy assessment and evidence
  - Ensure high trustworthiness and transparency
  - Build a maintainable, scalable platform
  - Achieve within $10,000 budget using cloud-native approach
- **1.4. Target Audience**:
  - General public seeking quick verification
  - Students and researchers
  - Content consumers wanting authenticity checks
- **1.5. Scope**:
  - **MVP**: Core URL submission, scraping, claim extraction, AI verification with RAG, results display, light/dark mode
  - **Future**: User accounts, browser extension, advanced media analysis
- **1.6. Success Metrics (MVP)**:
  - Successful URL analyses per day
  - User engagement metrics
  - System uptime (99% target)
  - Analysis completion time (<90 seconds)

## 2. User Stories / Features

### 2.1. Core Features (MVP)
**F1: URL Submission**
- User Story: As a user, I want to paste a URL for fact-checking
- Acceptance Criteria:
  - Clear input field on homepage
  - URL validation
  - Loading state during analysis
  - Error handling

**F2: Content Processing & Claim Analysis**
- System processes URL content using AI
- Extracts distinct factual claims
- Verifies each claim using RAG pipeline
- Assigns nuanced accuracy scores with confidence levels

**F3: Results Display**
- Clear summary of findings
- Individual claim breakdowns
- Evidence citations
- Visual accuracy indicators

### 2.2. UI/UX Features (MVP)
**F4: Responsive Design**
- Works on desktop, tablet, mobile
- Tailwind CSS responsive utilities

**F5: Light/Dark Mode**
- Theme toggle with localStorage persistence
- Consistent styling across themes

### 2.3. Non-Functional Requirements
- **Performance**: <2s page loads, <90s analysis
- **Reliability**: 99% uptime target
- **Security**: HTTPS, secure API keys, input validation
- **Maintainability**: Clean code, TypeScript, testing
- **Scalability**: Serverless architecture

## 3. System Architecture & Technical Stack (REVISED)

### 3.1. Overall Architecture
- **Monorepo Structure**: Turborepo for build optimization
- **Frontend**: Next.js 14+ with App Router
- **Backend**: API routes in Next.js with Hono
- **AI Core**: Gemini API + RAG with Upstash Vector
- **Databases**: Neon (PostgreSQL) + Upstash (Redis/Vector)
- **Cloud Services**: Vercel + Google Cloud APIs

### 3.2. Frontend Details
```typescript
// Tech stack
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + Shadcn/ui
- State: Zustand (lightweight)
- API Client: tRPC
```

### 3.3. Backend Details
```typescript
// Tech stack
- Runtime: Node.js with Edge Runtime
- Framework: Hono (within Next.js)
- API: tRPC for type safety
- Validation: Zod schemas
```

### 3.4. AI Core Details
- **LLM**: Google Gemini 1.5 Flash (cost-effective)
- **RAG Orchestration**: Custom implementation with Vercel AI SDK
- **Embeddings**: Gemini embeddings API
- **Vector Search**: Upstash Vector (serverless)

### 3.5. Database Strategy
- **Primary DB**: Neon (serverless PostgreSQL)
  - User data (future)
  - Analysis history
  - Caching layer
- **Vector DB**: Upstash Vector
  - Knowledge base storage
  - Similarity search
  - No local storage required

### 3.6. Project Structure
```
factspark.io/
├── apps/
│   └── web/
│       ├── app/              # Next.js app router
│       │   ├── (routes)/     # Page routes
│       │   ├── api/          # API routes
│       │   └── components/   # React components
│       ├── lib/              # Utilities
│       └── server/           # Server-side code
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── database/             # DB schemas & types
│   └── ai/                   # AI utilities
├── turbo.json                # Turborepo config
└── package.json              # Root package
```

## 4. Data Flow Diagrams

### 4.1. URL Fact-Checking Process (Serverless)
```
User → URL Input → API Route → Validation
                              ↓
                         Job Queue (Redis)
                              ↓
                    Edge Function Process:
                    1. Scrape Content (Playwright)
                    2. Extract Claims (Gemini)
                    3. For each claim:
                       - Generate embedding
                       - Vector search (Upstash)
                       - Verify with Gemini
                    4. Generate summary
                              ↓
                    Store results (Neon)
                              ↓
                    Return to user (SSE)
```

### 4.2. RAG Component Flow
```
Claim → Embedding (Gemini) → Vector Search (Upstash)
                                    ↓
                           Relevant Sources
                                    ↓
                    Prompt Engineering + Context
                                    ↓
                         Gemini Verification
                                    ↓
                    Scored Result + Evidence
```

## 5. Detailed Implementation Roadmap

### Phase 0: Foundation & Setup (Day 1)
```bash
# Initialize monorepo
npx create-turbo@latest factspark.io
cd factspark.io

# Setup packages
pnpm add next@latest react@latest react-dom@latest
pnpm add -D typescript @types/react tailwindcss

# Configure environment
cp .env.example .env.local
```

### Phase 1: Core API & URL Submission (Days 2-3)
- Setup Next.js with TypeScript
- Implement Tailwind CSS (per Section 3.8 of original PRD)
- Create URL submission API route
- Add validation with Zod
- Setup error handling

### Phase 2: Content Scraping (Days 4-5)
- Integrate Playwright Cloud API
- Extract article text and images
- Handle edge cases (paywalls, etc.)
- Implement caching strategy

### Phase 3: AI Claim Extraction (Days 6-7)
- Setup Gemini API integration
- Develop claim extraction prompts
- Parse structured responses
- Handle API errors gracefully

### Phase 4: RAG Implementation (Days 8-10)
- Setup Upstash Vector
- Create embedding pipeline
- Implement similarity search
- Build verification workflow

### Phase 5: UI Development (Days 11-13)
- Build component library
- Implement dark/light themes
- Create responsive layouts
- Add loading states

### Phase 6: Testing & Optimization (Days 14-15)
- Write unit tests with Vitest
- Integration testing
- Performance optimization
- Security review

### Phase 7: Deployment (Day 16)
- Configure Vercel project
- Setup environment variables
- Deploy to production
- Monitor performance

## 6. AI Implementation Guidelines (From Original)

### Core AI Analysis Methodology
[All original AI guidelines preserved, including multi-layer verification, source curation, prompts, etc.]

### Claim Extraction Prompt
```python
CLAIM_EXTRACTION_PROMPT = """
[Original prompt preserved exactly as specified]
"""
```

### Verification Prompt
```python
VERIFICATION_PROMPT = """
[Original prompt preserved exactly as specified]
"""
```

## 7. Development Best Practices
- **Version Control**: Git with conventional commits
- **Code Quality**: ESLint + Prettier
- **Type Safety**: Strict TypeScript
- **Testing**: Vitest for unit, Playwright for E2E
- **Documentation**: JSDoc + README files
- **Security**: OWASP awareness, dependency scanning

## 8. Deployment Strategy (Serverless)
- **No Docker Required**: Use Vercel's infrastructure
- **CI/CD**: GitHub Actions → Vercel
- **Preview Deployments**: Automatic for PRs
- **Environment Management**: Vercel dashboard
- **Monitoring**: Vercel Analytics + Sentry

## 9. Budget Considerations
- Gemini Flash API: ~$0.075 per 1M tokens
- Upstash: Pay-per-request model
- Vercel: Free tier sufficient for MVP
- Neon: Free tier includes 0.5GB
- Total estimated: <$50/month for MVP

## 10. Future Roadmap (Post-MVP)
- User accounts and authentication
- Browser extension development
- Advanced media analysis
- API for third-party integration
- Localization support
- Premium tier features