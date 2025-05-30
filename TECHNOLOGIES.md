# TAMAYA - AI Learning Assistant: Technologies Used

This document outlines all the technologies, tools, and dependencies used in the TAMAYA AI Learning Assistant project, along with their specific purpose within the application.

## Core Framework & Libraries

- **React** (v18.3.1): Powers the user interface, providing a component-based architecture that enables building interactive UI elements for the learning assistant.
- **TypeScript** (v5.5.3): Enhances code quality and maintainability through static typing, crucial for a complex educational application with multiple integrations.
- **Vite** (v6.3.3): Provides fast development and optimized production builds, significantly reducing load times for users accessing the learning assistant.

## UI Framework & Components

- **Tailwind CSS** (v3.4.11): Enables rapid UI development with consistent styling across the application, allowing for a polished and responsive learning interface.
- **Shadcn UI**: Delivers accessible, customizable components that maintain a professional appearance while reducing development time.
- **Radix UI**: Provides unstyled, accessible components that form the foundation for complex interactive elements in the learning interface.
- **Framer Motion** (v12.9.2): Creates smooth animations and transitions to enhance the user experience and provide visual feedback during interactions.
- **Sonner** (v1.5.0): Displays toast notifications for user feedback when completing actions in the learning platform.
- **Lucide React** (v0.462.0): Supplies consistent iconography throughout the interface for improved visual communication.
- **React Icons** (v5.5.0): Offers additional icon options to represent various learning concepts and actions.
- **Remixicon** (v4.6.0): Provides supplementary icons for specialized educational contexts.
- **Embla Carousel** (v8.3.0): Powers content carousels for displaying learning materials and examples in sequence.
- **React Day Picker** (v8.10.1): Enables date selection for scheduling learning sessions and tracking progress.
- **Input OTP** (v1.2.4): Manages one-time password inputs for secure authentication processes.
- **Vaul** (v0.9.3): Implements drawer components for additional content and tools that don't need to be constantly visible.
- **React Resizable Panels** (v2.1.3): Allows users to customize their learning workspace by resizing different sections of the interface.

## Content Rendering

- **React Markdown** (v10.1.0): Renders educational content written in Markdown, enabling rich text formatting for learning materials.
- **Remark**: Processes Markdown content with specialized plugins for educational purposes:
  - **remark-gfm** (v4.0.1): Supports GitHub Flavored Markdown features like tables and task lists for structured learning content.
  - **remark-math** (v6.0.0): Enables mathematical notation in learning materials, essential for STEM subjects.
- **Rehype**: Processes HTML content with specialized plugins:
  - **rehype-katex** (v7.0.1): Renders mathematical equations using KaTeX for clear, beautiful math representations.
  - **rehype-raw** (v7.0.0): Allows embedding raw HTML within Markdown for complex educational content layouts.
  - **rehype-sanitize** (v6.0.0): Ensures security by sanitizing HTML content to prevent XSS attacks from user-generated content.
- **KaTeX** (v0.16.22): Renders mathematical expressions with high performance, essential for math and science educational content.
- **React KaTeX** (v3.0.1): Integrates KaTeX with React components for seamless math rendering in the application.
- **React Syntax Highlighter** (v15.6.1): Provides syntax highlighting for code examples in programming tutorials and exercises.
- **Mermaid** (v10.8.0): Enables creation and display of diagrams and flowcharts to visualize complex concepts and processes in educational materials.

## Backend & Data Management

- **Supabase** (v2.49.4): Powers the backend database, authentication, and storage for user profiles, learning content, and progress tracking.
- **Tanstack React Query** (v5.56.2): Manages data fetching, caching, and state synchronization for efficient loading of learning resources.
- **Axios** (v1.9.0): Handles HTTP requests to external APIs for additional learning resources and services integration.

## Form Handling & Validation

- **React Hook Form** (v7.53.0): Manages form state and submission for user inputs like assessments, feedback, and profile information.
- **Zod** (v3.23.8): Validates user input with type-safe schemas, ensuring data integrity for submissions and preferences.
- **Hookform Resolvers** (v3.9.0): Connects React Hook Form with Zod for seamless form validation in user interactions.

## Data Visualization

- **Recharts** (v2.12.7): Creates interactive charts and graphs to visualize learning progress, assessment results, and statistical data.

## Utilities & Helpers

- **date-fns** (v3.6.0): Manages date and time operations for scheduling, progress tracking, and content organization.
- **class-variance-authority** (v0.7.1): Creates variant-based component styling to maintain design consistency across different states.
- **clsx** (v2.1.1): Simplifies conditional class name construction for dynamic UI elements.
- **tailwind-merge** (v2.6.0): Resolves Tailwind class conflicts when combining multiple class sets.
- **tailwindcss-animate** (v1.0.7): Adds animation utilities to enhance user interface interactions.
- **UUID** (v11.1.0): Generates unique identifiers for user content, sessions, and database records.
- **nanoid** (v5.1.5): Creates compact, URL-friendly unique IDs for sharing learning resources and user-generated content.
- **Canvas Confetti** (v1.9.3): Provides celebratory animations when users complete learning milestones or achievements.

## Document Generation

- **jsPDF** (v3.0.1): Enables export of learning materials and user progress to PDF format for offline use and sharing.
- **html2canvas** (v1.4.1): Converts HTML content to canvas elements for PDF generation, allowing users to save complex learning materials with visual fidelity.

## Styling Utilities

- **Styled Components** (v6.1.17): Provides component-specific styling for custom UI elements that require complex state-based styling beyond Tailwind's capabilities.
- **Tailwind CSS Plugins**:
  - **@tailwindcss/forms** (v0.5.10): Enhances form styling for better usability in questionnaires, assessments, and user inputs.
  - **@tailwindcss/typography** (v0.5.15): Improves typography styling for educational content, ensuring readability and visual hierarchy.

## Build & Development Tools

- **SWC** (via @vitejs/plugin-react-swc): Accelerates build times during development, enabling faster iterations of the learning platform.
- **ESLint** (v9.9.0): Enforces code quality standards to maintain a stable and reliable learning application.
- **Autoprefixer** (v10.4.20): Adds vendor prefixes to CSS for cross-browser compatibility, ensuring the learning experience is consistent across devices.
- **PostCSS** (v8.4.47): Processes CSS with plugins for optimal performance and compatibility.
- **Terser** (v5.39.0): Minifies JavaScript for production builds, improving loading performance for users.

## Theming

- **next-themes** (v0.3.0): Implements dark/light mode switching to accommodate user preferences and reduce eye strain during extended learning sessions.

## Routing

- **React Router** (v6.26.2): Manages navigation between different sections of the learning platform, preserving state and enabling deep linking to specific educational resources.

This document represents the current technology stack as of the project's latest update. The versions mentioned are based on the package.json dependencies at the time of writing. 