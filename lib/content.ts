export const markdownContent = `
# Markdown Reader

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Markdown Reader** is a distraction-free reading app that turns any \`.md\` file into a beautiful, interactive reading experience — complete with highlights, bookmarks, notes export, and deep customization. No account. No cloud. Everything stays on your device.

---

## Who Is This For?

Markdown Reader is built for anyone who reads seriously:

- **Students** working through technical books or lecture notes
- **Engineers** reading documentation, RFCs, or study guides
- **Researchers** annotating long-form reference material
- **Writers** reviewing their own drafts and manuscripts

If you have a \`.md\` file and you want to read it properly — not in a code editor, not in a raw text viewer — this is the tool.

---

## Getting Started in 60 Seconds

1. Open the app — you will land on your **Library**
2. Click **"Upload Document"** and choose any \`.md\` file from your computer
3. Click the document card to open it and start reading
4. Everything you do — your scroll position, highlights, bookmarks — is saved automatically

> **First time?** A demo book (*The System Design Playbook*) is pre-loaded so you can explore all features immediately without uploading anything.

---

## The Library

The Library is your home screen. Every document you have ever loaded appears here as a card showing:

- The document title
- Your current **reading progress** as a percentage
- **Estimated reading time** remaining based on your position
- An auto-generated cover color unique to each document

### Managing Your Library

| Action | How |
|---|---|
| Add a document | Click the **"Upload Document"** card → select a \`.md\` file |
| Open a document | Click its card |
| Delete a document | Open the document → use the delete option in the menu |

All documents, progress, highlights, and bookmarks are stored in your browser's local storage. Nothing is uploaded anywhere. If you clear your browser data, your library will reset.

---

## The Reader

Opening a document brings you into the full reading view. Here is a map of what you will find:

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  ☰  Document Title                    🔍  ↓  ⚙         │  ← Top bar
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   Sidebar    │           Reading Area                   │
│              │                                          │
│  • Contents  │   Your markdown rendered beautifully,    │
│  • Bookmarks │   with full support for headings,        │
│  • Highlights│   tables, code, math, and more.          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
\`\`\`

### The Top Bar

| Icon | What It Does |
|---|---|
| ☰ (menu) | Opens and closes the sidebar |
| 🔍 (search) | Opens in-document full-text search |
| ↓ (download) | Exports all your highlights as a \`.md\` file |
| ⚙ (settings) | Opens the appearance and reading settings panel |

---

## The Sidebar

The sidebar has three tabs. Open it with the ☰ icon in the top left.

### 📋 Contents Tab

A live Table of Contents built automatically from every heading in your document. Click any entry to jump directly to that section. For a structured book like *The System Design Playbook*, this gives you instant navigation across parts, chapters, and subsections.

### 🔖 Bookmarks Tab

Every heading you have bookmarked appears here. Click any bookmark to jump back to that section instantly. Bookmarks persist between sessions — close the app and your bookmarks are still there when you return.

### 🖍 Highlights Tab

Every passage you have highlighted appears here, grouped by the heading it falls under. Click any highlight entry to jump to it in the document. Use the download button in the top bar to export the full list as a structured \`.md\` file.

---

## Reading Tools

### Highlighting Text

Select any text in the document — a small toolbar appears above your selection with four color options:

| Color | Suggested Use |
|---|---|
| 🟡 Yellow | General interest, key ideas |
| 🟢 Green | Important to remember, answers |
| 🔵 Blue | Questions, things to research further |
| 🩷 Pink | Critical, must revisit |

The color choice is entirely yours. Highlights are saved immediately and appear in the Highlights sidebar tab.

### Bookmarking a Section

Every \`H1\`, \`H2\`, and \`H3\` heading has a small bookmark icon that appears when you hover over it. Click it to save that section to your Bookmarks tab. Click it again to remove the bookmark.

### Sharing a Passage

To share an exact quote with someone:

1. Select the text you want to share
2. Click the **link icon** in the selection toolbar
3. Copy the generated URL

When anyone opens that URL, the app will scroll directly to that passage and briefly highlight it so it is easy to find. Works even if the recipient does not have the app open — they just need to open the link in their browser.

### Exporting Your Highlights

Click the **↓ download icon** in the top bar at any time. A \`.md\` file will download containing all your highlights for the current document, organized like this:

\`\`\`markdown
## Chapter 1: The Anatomy of a Computer

> "RAM is fast but expensive and volatile. Disk is slow but cheap and persistent."

> "The principle of locality is the philosophical foundation of all caching in distributed systems."

## Chapter 1 Interview Cheat Sheet

> "A cache hit occurs when the CPU finds the requested data in cache, resulting in fast access."
\`\`\`

This format is compatible with Obsidian, Notion, Logseq, and any other Markdown-based note-taking tool.

---

## Search

Press \`Cmd + F\` (Mac) or \`Ctrl + F\` (Windows/Linux) — or click the 🔍 icon — to open the search panel.

- Type any word or phrase to search the entire document
- Results appear as snippets with the surrounding context and the heading they fall under
- Click any result to jump directly to that location
- Press \`Esc\` to close search

Search uses fuzzy matching, so minor typos will still return relevant results.

---

## Appearance Settings

Click the ⚙ icon in the top right to open the Settings panel. Every setting is saved automatically and remembered between sessions.

### Themes

| Theme | Best For |
|---|---|
| **Light** | Bright environments, daytime reading |
| **Dark** | Low-light environments, night reading |
| **Sepia** | Long reading sessions, reduced eye strain |
| **High Contrast** | Accessibility needs, maximum readability |

### Typography

| Setting | Options |
|---|---|
| **Font Family** | Sans-serif · Serif · Monospace |
| **Font Size** | Small · Base · Large · Extra Large |
| **Line Height** | Compact · Normal · Relaxed |

### Layout

| Setting | Options |
|---|---|
| **Content Width** | Narrow (60ch) · Medium (75ch) · Wide (90ch) · Full |

Narrower widths (60–75 characters per line) are recommended for long reading sessions — this is the optimal range for reading comfort according to typography research.

### Focus Mode

Toggle **Focus Mode** in Settings to dim all paragraphs except the one you are currently reading. The active paragraph is highlighted at full opacity while everything around it fades back. Ideal for long, dense material where distraction is a problem.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| \`j\` | Jump to the next heading |
| \`k\` | Jump to the previous heading |
| \`Cmd + F\` / \`Ctrl + F\` | Open search |
| \`Esc\` | Close search or settings |

---

## What Markdown Features Are Supported?

The app renders the full range of Markdown syntax:

| Feature | Example Syntax |
|---|---|
| Headings | \`# H1\`, \`## H2\`, \`### H3\` |
| Bold & Italic | \`**bold**\`, \`*italic*\` |
| Blockquotes | \`> quoted text\` |
| Tables | Standard GFM table syntax |
| Task lists | \`- [ ] item\` / \`- [x] done\` |
| Code blocks | Fenced with \` \`\`\` \` and a language tag |
| Inline code | \`\` \`code\` \`\` |
| Math (inline) | \`$E = mc^2$\` |
| Math (block) | \`$$\\int_a^b f(x)dx$$\` |
| Footnotes | \`[^1]\` with \`[^1]: definition\` |
| Strikethrough | \`~~text~~\` |

Code blocks automatically receive syntax highlighting for all major programming languages. Math equations are rendered using KaTeX. Footnotes appear as hover tooltips so you never lose your place.

---

## Privacy & Data

- **No account required.** The app works entirely in your browser.
- **No data leaves your device.** Documents, highlights, bookmarks, and settings are stored in your browser's \`localStorage\`.
- **No analytics or tracking.** Nothing is sent to any server.
- **Clearing browser data** will erase your library. If you want to preserve highlights, export them using the download button before clearing.

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
2. **Create** a feature branch: \`git checkout -b feature/your-feature-name\`
3. **Commit** your changes: \`git commit -m 'feat: add your feature'\`
4. **Push** to your branch: \`git push origin feature/your-feature-name\`
5. **Open** a Pull Request against \`main\`

Please ensure your code passes linting (\`npm run lint\`) before submitting.

---

## License

\`\`\`text
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
\`\`\`

`;