# Markdown Book Reader

A clean, distraction-free reading interface for Markdown content, built with modern web technologies.

## 🛠 Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Markdown Parsing**: 
    *   [`react-markdown`](https://github.com/remarkjs/react-markdown) for rendering Markdown to React components.
    *   [`remark-gfm`](https://github.com/remarkjs/remark-gfm) for GitHub Flavored Markdown support (tables, strikethrough, task lists, etc.).
*   **Typography**: [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) for beautiful, highly readable default prose styling.
*   **Icons**: [`lucide-react`](https://lucide.dev/) for clean, consistent SVG icons.

## ✨ Implemented Features

### 📖 Core Reading Experience
*   **Markdown Rendering**: Parses and renders complex Markdown content, including tables, blockquotes, code blocks, and lists.
*   **Distraction-Free UI**: Clean interface focused entirely on the reading experience.

### 🧭 Navigation
*   **Dynamic Table of Contents**: Automatically extracts headings (`H1`, `H2`, `H3`) from the Markdown content using Regex.
*   **Interactive Sidebar**: Clickable navigation menu that smoothly scrolls to the selected section.
*   **Mobile-Friendly**: The sidebar is collapsible on smaller screens for maximum reading space, and automatically closes when a link is clicked on mobile.

### 🎨 Customization
*   **Theme Toggle**: Built-in Dark/Light mode switch. Automatically detects and applies the user's system preference on first load using `window.matchMedia`.
*   **Typography Controls**: Font size toggle allowing users to cycle through different text sizes (`sm`, `base`, `lg`, `xl`) for optimal readability.

### ⚡ Performance & Architecture
*   **Responsive Design**: Fluid layout that adapts perfectly to mobile, tablet, and desktop screens.
*   **Client-Side Interactivity**: Uses React hooks (`useState`, `useEffect`, `useRef`) for smooth state management and DOM interactions without page reloads.
*   **Custom Markdown Components**: Overrides default `react-markdown` heading components to automatically generate URL-friendly `id` attributes, enabling the smooth-scroll anchor links.
