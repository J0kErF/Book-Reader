# Markdown Reader

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A local-first Markdown reading application with annotation, progress tracking, and fully customizable typography and themes.



---

## Features

### 📚 Library Management
- **File Import** — Upload any `.md` file directly into your local library via drag-and-drop or file picker.
- **Progress Tracking** — Automatically calculates and persists reading progress (%) and estimated read time based on word count.
- **Local-First Persistence** — Books, highlights, bookmarks, and scroll positions are stored entirely in the browser's `localStorage`. No account required.
- **Document Management** — Delete documents and distinguish them with auto-generated cover colors derived from the document title.

### 📖 Reading Experience
- **Rich Markdown Rendering** — Full GitHub Flavored Markdown support: tables, task lists, strikethrough, and more.
- **Math Rendering** — Inline and block LaTeX equations rendered via KaTeX (`$...$` and `$$...$$`).
- **Syntax Highlighting** — Code blocks highlighted via Prism through `react-syntax-highlighter`.
- **Focus Mode** — Dims inactive paragraphs so only the centrally viewed text is at full opacity, reducing distraction.
- **Footnote Tooltips** — Hover over any footnote reference to read its content inline without losing your scroll position.
- **Responsive Layout** — Fluid design optimized for mobile, tablet, and desktop viewports.

### ✏️ Annotations & Bookmarks
- **Multi-Color Highlighting** — Select any text and apply one of four highlight colors: yellow, green, blue, or pink.
- **Section Bookmarks** — Bookmark any `H1`, `H2`, or `H3` heading for quick sidebar access.
- **Passage Sharing** — Generate a shareable deep link with a `#passage=` hash that auto-scrolls and pulse-highlights the exact text when opened.
- **Export Highlights** — Download all highlights for the active document as a structured `.md` file, grouped by heading.

### 🔍 Navigation & Search
- **Dynamic Table of Contents** — Sidebar TOC auto-generated from the document's heading structure.
- **In-Document Search** — Full-text fuzzy search across the active document with snippet previews and contextual heading labels.
- **Keyboard Navigation** — Vim-style `j`/`k` shortcuts to jump between major headings.

### 🎨 Customization
- **Themes** — 4 color schemes: Light, Dark, Sepia, High Contrast.
- **Font Family** — 3 options: Sans, Serif, Mono.
- **Font Size** — 4 steps: `sm`, `base`, `lg`, `xl`.
- **Line Height** — 3 presets: Compact, Normal, Relaxed.
- **Content Width** — 4 max-width constraints: Narrow (60ch), Medium (75ch), Wide (90ch), Full.

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| **Next.js** | React framework and routing | `^15.4.9` |
| **React** | UI component library | `^19.2.1` |
| **TypeScript** | Static typing | `5.9.3` |
| **Tailwind CSS** | Utility-first styling | `4.1.11` |
| **react-markdown** | Markdown parsing and rendering | `^10.1.0` |
| **remark-gfm** | GitHub Flavored Markdown support | `^4.0.1` |
| **remark-math** | Math syntax parsing | — |
| **rehype-katex** | KaTeX math rendering | `^7.0.1` |
| **react-syntax-highlighter** | Prism-based code highlighting | `^16.1.1` |
| **mark.js** | DOM text highlighting | `^8.11.1` |
| **motion** | UI animations | `^12.23.24` |
| **lucide-react** | SVG icon library | `^0.553.0` |

---

## Project Structure

```text
├── app/
│   ├── globals.css          # Global Tailwind layers, CSS variables, and base resets
│   ├── layout.tsx           # Root Next.js layout — HTML shell, metadata, font loading
│   └── page.tsx             # Application entry point — renders the top-level Reader component
├── components/
│   └── Reader.tsx           # Core application component — library view, reader view, all UI state
├── hooks/
│   └── use-mobile.ts        # Custom hook for responsive breakpoint detection
├── lib/
│   ├── content.ts           # Default onboarding Markdown document shown on first load
│   └── utils.ts             # Shared utility functions (cn, slug generation, etc.)
├── eslint.config.mjs        # ESLint rule configuration
├── next.config.ts           # Next.js build and runtime settings
├── package.json             # Project metadata, scripts, and dependency manifest
├── postcss.config.mjs       # PostCSS pipeline configuration for Tailwind CSS v4
└── tsconfig.json            # TypeScript compiler options
```

---

## Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **npm** (bundled with Node.js)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/markdown-reader.git
cd markdown-reader
```

**2. Install dependencies:**
```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## Usage Guide

| Step | Action |
|---|---|
| **1. Add a document** | From the Library, click **"Upload Document"** and select any `.md` file from your machine. |
| **2. Open a book** | Click any document card to enter the Reader. Scroll position and progress save automatically. |
| **3. Navigate** | Open the sidebar (☰ top left) to access the Table of Contents, Bookmarks, and Highlights tabs. |
| **4. Highlight text** | Select any passage — a color picker toolbar appears. Choose yellow, green, blue, or pink. |
| **5. Bookmark a section** | Click the bookmark icon next to any heading to pin it to your Bookmarks sidebar tab. |
| **6. Share a passage** | Select text → click the link icon in the toolbar → copy the generated URL to share an exact passage. |
| **7. Search** | Click the magnifying glass icon or press `Cmd/Ctrl + F` to search within the current document. |
| **8. Adjust appearance** | Click the ⚙ Settings icon (top right) to change theme, font, size, width, and toggle Focus Mode. |
| **9. Export highlights** | Click the download icon (top right) to export all highlights as a structured `.md` file. |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `j` | Jump to the next heading |
| `k` | Jump to the previous heading |
| `Cmd + F` / `Ctrl + F` | Open the in-document search modal |
| `Esc` | Close the search or settings modal |

---

## Roadmap

- [ ] Cloud synchronization for books, highlights, and bookmarks
- [ ] EPUB file format support
- [ ] Text-to-speech reading mode
- [ ] Custom tags and filtering for highlights and documents
- [ ] Multi-file chapter splitting from a single large document
- [ ] AI-powered chapter summaries
- [ ] Shareable library links for public collections

---

## Contributing

Contributions are welcome and appreciated.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request against `main`

Please ensure your code passes linting (`npm run lint`) before submitting.

---

## License

```text
MIT License

Copyright (c) [Year] [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
