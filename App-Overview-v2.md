# Factspark.io Foundational Goals v2.0

## 1. Core App Concept & Goal:
* An AI-powered website designed to fact-check news articles and online content submitted via URL.
* The primary goal is to provide users with an assessment of the content's reliability and the accuracy of its claims, supported by evidence.

## 2. User Interface (UI) & User Experience (UX):
* Design: Modern, elegant, clean, and intuitive (including light mode, dark mode, and mobile/portrait responsiveness).
* Focus: Ease of use for submitting URLs and understanding the presented fact-checking results.

## 3. Core AI Fact-Checking Workflow (Order of Operations for a URL):
1. **Input & Pre-flight Checks**: User submits URL → Validate URL format → Check reachability, robots.txt, paywalls, and potentially a cache for recent checks.
2. **Content Acquisition**: Robustly scrape text content and a main contextual image from the URL, with graceful error handling.
3. **Content Understanding & Claim Extraction**: AI processes the cleaned text to identify key entities, topics, overall sentiment, and most importantly, extract distinct, checkable factual claims.
4. **Iterative Claim Verification (RAG-centric - for each claim)**:
   * Formulate verification queries.
   * Retrieve evidence from a curated knowledge base of "reputable sources" (using vector search) and/or filtered live web searches.
   * AI (LLM) analyzes the claim against the retrieved evidence.
   * Assign a nuanced accuracy score/rating (e.g., True, Partially True, Misleading, Unverifiable) with a confidence level.
   * Generate a brief explanation for the rating, citing specific evidence.
   * Handle cases of "no evidence" or "conflicting evidence."
5. **Synthesis & Report Generation**: AI aggregates all individual claim analyses → Assesses overall content reliability (with appropriate nuance) → Generates a comprehensive summary explaining the verdict.
6. **Output Presentation**: Display the summary, a claim-by-claim breakdown (scores, explanations, sources), and any contextual warnings to the user.

## 4. Key AI Technologies & Techniques:
* **Large Language Models (LLMs)**: Via APIs (Google Gemini preferred for cost efficiency)
* **Retrieval Augmented Generation (RAG)**: The core mechanism for grounding AI responses in facts
* **Data Grounding**: Ensuring AI outputs are connected to verifiable data sources
* **Claim Extraction**: AI techniques to identify specific, verifiable statements
* **Nuanced Scoring**: Moving beyond simple true/false to a spectrum of accuracy ratings
* **Automated Summarization**: AI-generated summaries of fact-checking findings
* **Prompt Engineering**: Carefully crafting instructions for the LLMs at each stage

## 5. Budget & Monetization:
* **Initial Budget Context**: Approx. $10,000, guiding decisions towards serverless/managed services
* **Potential Monetization**: 
  - Freemium model (basic free tier, premium paid tier)
  - API access for businesses
  - Usage-based fees
  - Browser extension (future)
* **Value Proposition for Paid Tier**: Superior accuracy, speed, depth of analysis, higher usage limits, ad-free experience

## 6. Foundational Technical Decisions (REVISED FOR CODESPACES):
* **Version Control**: Git on GitHub
* **Primary Stack**:
  - **Frontend**: Next.js 14+ with TypeScript (single codebase)
  - **Styling**: Tailwind CSS (as specified in UI requirements)
  - **API**: Hono framework within Next.js API routes
  - **Edge Runtime**: For optimal performance
* **Project Structure**: Monorepo with Turborepo
* **Configuration Management**: Environment variables via Vercel
* **Databases**:
  - **Primary**: Neon (serverless PostgreSQL)
  - **Vector Database**: Upstash Vector (serverless, no local storage)
  - **Caching**: Upstash Redis
* **API Design**: tRPC for type-safe, efficient APIs
* **Logging**: Vercel logging + Google Cloud Logging integration
* **Testing**: Vitest for unit/integration tests
* **CI/CD**: GitHub Actions + Vercel auto-deploy
* **Error Tracking**: Sentry integration
* **Security**: Edge-based security, rate limiting, secure secrets in Vercel

## 7. Deployment & Infrastructure (CLOUD-NATIVE):
* **No Docker Required**: Leverage Vercel's infrastructure
* **Deployment Strategy**:
  - **Frontend + Backend**: Vercel (unified deployment)
  - **Edge Functions**: For API routes
  - **Database**: Neon (managed PostgreSQL)
  - **Vector Search**: Upstash Vector
* **Serverless Architecture**: Eliminates Codespaces storage constraints

## 8. Ensuring Trustworthiness & Reliability:
* **Core Principle**: Prioritizing accuracy and transparency
* **Methods**: 
  - Strong emphasis on data grounding through RAG
  - Meticulous curation of "reputable sources"
  - Transparently citing evidence
  - Clear communication of AI confidence levels and limitations
  - Regular source database updates
  - Bias mitigation strategies

## 9. Development Environment:
* **GitHub Codespaces**: Primary development environment
* **Package Manager**: pnpm (efficient for monorepos)
* **Build Tool**: Turborepo
* **No Local Services**: All data/services cloud-based to work within 32GB limit