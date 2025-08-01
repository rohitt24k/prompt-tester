# replit.md

## Overview

This is a Next.js 14+ prompt playground application that allows users to create, edit, and test prompts with Jinja2-like templating using nunjucks. The app integrates with OpenAI's API to execute prompts and provides versioning and output management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern React-based architecture using Next.js 14+ with the App Router pattern. It's built as a client-side application with minimal server-side functionality, using localStorage for data persistence and a single API route for OpenAI integration.

### Frontend Architecture
- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS with custom scrollbar utilities
- **State Management**: React hooks (useState, useEffect) for local component state
- **Templating**: Nunjucks for Jinja2-like template rendering

### Backend Architecture
- **API Routes**: Single `/api/openai/route.ts` endpoint for OpenAI integration
- **Data Persistence**: Browser localStorage for prompts, versions, and outputs
- **External Services**: OpenAI API integration using the official SDK

## Key Components

### Core Components
1. **PromptPlayground** - Main container component managing application state
2. **PromptSidebar** - Left sidebar for prompt management (create, delete, rename, select)
3. **PromptEditor** - Central editing area with template input, variables JSON, and rendered preview
4. **OutputPanel** - Right panel displaying AI responses with token usage and timestamps
5. **VersionPanel** - Collapsible right panel for version history management

### Data Models
- **Prompt**: Core entity with id, name, template, variables, and timestamps
- **PromptVersion**: Versioned snapshots with template, variables, note, and timestamp
- **OpenAIOutput**: API responses with content, usage stats, and metadata

## Data Flow

1. **Prompt Creation**: User creates prompts via sidebar, stored in localStorage
2. **Template Editing**: Real-time rendering of Jinja2 templates with JSON variables using nunjucks
3. **Execution**: Rendered prompts sent to `/api/openai` endpoint, responses stored in state
4. **Versioning**: Manual version saving creates timestamped snapshots in localStorage
5. **Persistence**: All data (prompts, versions) persisted in browser localStorage

## External Dependencies

### Production Dependencies
- **next**: Framework (v15.4.5)
- **react/react-dom**: UI library (v19.1.1)
- **typescript**: Type safety (v5.8.3)
- **tailwindcss**: Styling framework (v4.1.11)
- **nunjucks**: Template engine for Jinja2-like syntax
- **openai**: Official OpenAI SDK (v5.11.0)

### Security Configuration
- Security headers configured in `next.config.js` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- CORS and frame protection enabled

## Deployment Strategy

### Environment Requirements
- **Node.js**: Compatible with v18.17.0+ (based on Sharp dependency requirements)
- **Environment Variables**: 
  - `OPENAI_API_KEY`: Required for OpenAI API integration
- **Build Process**: Standard Next.js build with TypeScript compilation

### Storage Strategy
- **Client-side**: localStorage for prompts and versions (no database required)
- **Scalability**: Current architecture suitable for single-user scenarios
- **Data Migration**: No database migrations needed, all data in browser storage

### API Architecture
- **Single Endpoint**: `/api/openai/route.ts` handles all OpenAI requests
- **Model Configuration**: Uses `gpt-4o` model with 2000 max tokens
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

### Development Notes
- App Router experimental features enabled
- TypeScript strict mode configured
- Path aliases configured (`@/*` maps to root)
- Custom scrollbar styling for better UX
- Responsive design considerations with collapsible panels