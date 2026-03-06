'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import Mark from 'mark.js';
import { markdownContent } from '@/lib/content';
import { 
  Menu, X, Search, Upload, Clock, BookOpen, Settings as SettingsIcon, 
  Bookmark, Highlighter, Palette, Type, Maximize, Trash2, 
  ChevronLeft, AlignLeft, BookmarkPlus, BookmarkMinus, Check,
  Printer, Link as LinkIcon, Download, Eye
} from 'lucide-react';

// --- Types ---
type Theme = 'light' | 'dark' | 'sepia' | 'high-contrast';
type FontFamily = 'sans' | 'serif' | 'mono';
type LineHeight = 'compact' | 'normal' | 'relaxed';
type MaxWidth = 'narrow' | 'medium' | 'wide' | 'full';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';

interface AppSettings {
  theme: Theme;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  maxWidth: MaxWidth;
  fontSize: FontSize;
  focusMode: boolean;
}

interface Book {
  id: string;
  title: string;
  content: string;
  progress: number;
  wordCount: number;
  lastRead: number;
  coverColor: string;
}

interface Highlight {
  id: string;
  bookId: string;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  timestamp: number;
  headingText?: string;
}

interface BookBookmark {
  id: string;
  bookId: string;
  headingId: string;
  headingText: string;
  timestamp: number;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  fontFamily: 'sans',
  lineHeight: 'normal',
  maxWidth: 'medium',
  fontSize: 'base',
  focusMode: false
};

// --- Helpers ---
function extractHeadings(markdown: string) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/[^\w]+/g, '-'),
      index: match.index
    });
  }
  return headings;
}

function generateColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

// --- Main Component ---
export default function ReaderApp() {
  // Global State
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [bookmarks, setBookmarks] = useState<BookBookmark[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // UI State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{message: string, onConfirm: () => void} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmAction = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  };

  // Initialize from local storage
  useEffect(() => {
    const savedBooks = localStorage.getItem('reader_books');
    if (savedBooks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBooks(JSON.parse(savedBooks));
    } else {
      const defaultBook: Book = {
        id: 'default-book',
        title: 'The System Design Playbook',
        content: markdownContent,
        progress: 0,
        wordCount: markdownContent.trim().split(/\s+/).length,
        lastRead: Date.now(),
        coverColor: '#3b82f6'
      };
      setBooks([defaultBook]);
      localStorage.setItem('reader_books', JSON.stringify([defaultBook]));
    }
    
    const savedSettings = localStorage.getItem('reader_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setSettings(s => ({ ...s, theme: 'dark' }));
    }
    
    const savedHighlights = localStorage.getItem('reader_highlights');
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
    
    const savedBookmarks = localStorage.getItem('reader_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  // Save state to local storage
  useEffect(() => {
    if (books.length > 0) localStorage.setItem('reader_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('reader_settings', JSON.stringify(settings));
    document.documentElement.classList.remove('dark', 'sepia', 'high-contrast');
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    if (settings.theme === 'sepia') document.documentElement.classList.add('sepia');
    if (settings.theme === 'high-contrast') document.documentElement.classList.add('high-contrast');
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('reader_highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    localStorage.setItem('reader_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handlers
  const handleAddBook = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.md')) {
      const text = await file.text();
      const titleMatch = text.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.name.replace('.md', '');
      
      const newBook: Book = {
        id: crypto.randomUUID(),
        title,
        content: text,
        progress: 0,
        wordCount: text.trim().split(/\s+/).length,
        lastRead: Date.now(),
        coverColor: generateColor(title)
      };
      setBooks(prev => [newBook, ...prev]);
    }
    e.target.value = '';
  };

  const handleDeleteBook = (id: string) => {
    confirmAction('Are you sure you want to delete this book?', () => {
      setBooks(prev => prev.filter(b => b.id !== id));
      setHighlights(prev => prev.filter(h => h.bookId !== id));
      setBookmarks(prev => prev.filter(b => b.bookId !== id));
      showToast('Book deleted successfully', 'success');
    });
  };

  const currentBook = books.find(b => b.id === currentBookId);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${getThemeClasses(settings.theme)}`}>
      {currentBookId && currentBook ? (
        <ReaderView 
          book={currentBook} 
          settings={settings}
          highlights={highlights}
          bookmarks={bookmarks}
          onClose={() => setCurrentBookId(null)}
          onUpdateBook={(updates: Partial<Book>) => setBooks(prev => prev.map(b => b.id === currentBook.id ? { ...b, ...updates } : b))}
          onAddHighlight={(h: Highlight) => setHighlights(prev => [...prev, h])}
          onRemoveHighlight={(id: string) => setHighlights(prev => prev.filter(h => h.id !== id))}
          onToggleBookmark={(b: BookBookmark) => {
            const exists = bookmarks.find(x => x.bookId === b.bookId && x.headingId === b.headingId);
            if (exists) setBookmarks(prev => prev.filter(x => x.id !== exists.id));
            else setBookmarks(prev => [...prev, b]);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          showToast={showToast}
          confirmAction={confirmAction}
        />
      ) : (
        <LibraryView 
          books={books} 
          onOpenBook={(id: string) => {
            setBooks(prev => prev.map(b => b.id === id ? { ...b, lastRead: Date.now() } : b));
            setCurrentBookId(id);
          }} 
          onAddBook={handleAddBook}
          onDeleteBook={handleDeleteBook}
          onOpenSettings={() => setIsSettingsOpen(true)}
          showToast={showToast}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          setSettings={setSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border
            ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800' : 
              toast.type === 'error' ? 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800' : 
              'bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}`}
          >
            {toast.type === 'success' && <Check size={16} className="text-emerald-500" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmDialog(null)}>
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Confirm Action</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">{confirmDialog.message}</p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-black/5 dark:border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Library View ---
function LibraryView({ books, onOpenBook, onAddBook, onDeleteBook, onOpenSettings, showToast }: any) {
  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 md:p-12">
      <header className="flex justify-between items-end mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Document Library</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Manage and read your markdown documents</p>
        </div>
        <button onClick={onOpenSettings} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 shadow-sm">
          <SettingsIcon size={20} />
        </button>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer min-h-[260px] text-center group bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
            <Upload size={24} />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">Upload Document</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Markdown (.md) files only</span>
          <input type="file" accept=".md" className="hidden" onChange={(e) => {
            onAddBook(e);
            if (e.target.files?.length) showToast('Document uploaded successfully', 'success');
          }} />
        </label>

        {books.map((book: Book) => (
          <div 
            key={book.id} 
            onClick={() => onOpenBook(book.id)}
            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:-translate-y-1"
          >
            <div className="h-40 flex items-center justify-center p-6 text-center relative overflow-hidden" style={{ backgroundColor: book.coverColor }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <h2 className="font-semibold text-white text-lg line-clamp-3 relative z-10 leading-snug px-2 drop-shadow-md">{book.title}</h2>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-zinc-900">
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{book.wordCount.toLocaleString()} words</span>
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{Math.round(book.progress)}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${book.progress}%` }}></div>
                </div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                  <Clock size={12} />
                  {new Date(book.lastRead).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteBook(book.id); }} 
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Reader View ---
function ReaderView({ book, settings, highlights, bookmarks, onClose, onUpdateBook, onAddHighlight, onRemoveHighlight, onToggleBookmark, onOpenSettings, showToast, confirmAction }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'contents' | 'bookmarks' | 'highlights'>('contents');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selection, setSelection] = useState<{text: string, rect: DOMRect | null}>({text: '', rect: null});
  
  const mainRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(book.wordCount / 225)), [book.wordCount]);
  const bookHighlights = highlights.filter((h: any) => h.bookId === book.id);
  const bookBookmarks = bookmarks.filter((b: any) => b.bookId === book.id);

  // Parse headings
  const headings = useMemo(() => extractHeadings(book.content), [book.content]);

  // Restore scroll and handle shareable links
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#passage=')) {
      const params = new URLSearchParams(hash.substring(1));
      const passage = params.get('passage');
      const scroll = params.get('scroll');
      
      if (scroll && mainRef.current) {
        setTimeout(() => {
          if (mainRef.current) mainRef.current.scrollTop = parseFloat(scroll);
        }, 500);
      }
      
      if (passage) {
        setTimeout(() => {
          if (!mainRef.current) return;
          const instance = new Mark(mainRef.current);
          instance.mark(passage, {
            className: 'bg-orange-400/50 text-inherit animate-pulse rounded-sm',
            accuracy: "exactly",
            separateWordSearch: false,
          });
          setTimeout(() => instance.unmark(), 5000);
        }, 600);
      }
      
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      const savedScroll = localStorage.getItem(`scroll_${book.id}`);
      if (savedScroll && mainRef.current) {
        setTimeout(() => {
          if (mainRef.current) mainRef.current.scrollTop = parseFloat(savedScroll);
        }, 100);
      }
    }
  }, [book.id]);

  // Apply highlights via mark.js
  useEffect(() => {
    if (!mainRef.current) return;
    const instance = new Mark(mainRef.current);
    instance.unmark();
    
    bookHighlights.forEach((h: any) => {
      const colorClass = 
        h.color === 'yellow' ? 'bg-yellow-300/80 dark:bg-yellow-500/40 text-inherit' :
        h.color === 'green' ? 'bg-green-300/80 dark:bg-green-500/40 text-inherit' :
        h.color === 'blue' ? 'bg-blue-300/80 dark:bg-blue-500/40 text-inherit' :
        'bg-pink-300/80 dark:bg-pink-500/40 text-inherit';
        
      instance.mark(h.text, {
        className: `${colorClass} px-0.5 rounded-sm cursor-pointer`,
        acrossElements: true,
        accuracy: "exactly",
        diacritics: true,
        separateWordSearch: false,
        element: "mark",
        each: (element: Element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.setAttribute('data-highlight-id', h.id);
          htmlElement.onclick = () => {
            confirmAction('Remove this highlight?', () => {
              onRemoveHighlight(h.id);
              showToast('Highlight removed', 'success');
            });
          };
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.content, bookHighlights, settings.theme]);

  // Text Selection
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0 && mainRef.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelection({ text: sel.toString().trim(), rect });
      } else {
        setSelection({ text: '', rect: null });
      }
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // Keyboard navigation (j/k)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isSearchOpen) return;

      if (e.key === 'j' || e.key === 'k') {
        const headingElements = Array.from(document.querySelectorAll('main h1, main h2, main h3')) as HTMLElement[];
        if (!headingElements.length || !mainRef.current) return;

        const currentScroll = mainRef.current.scrollTop;
        const offset = 60;

        if (e.key === 'j') {
          const next = headingElements.find(el => el.offsetTop > currentScroll + offset);
          if (next) mainRef.current.scrollTo({ top: next.offsetTop - 20, behavior: 'smooth' });
        } else if (e.key === 'k') {
          const prev = headingElements.slice().reverse().find(el => el.offsetTop < currentScroll - offset);
          if (prev) mainRef.current.scrollTo({ top: prev.offsetTop - 20, behavior: 'smooth' });
          else mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isSearchOpen) setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];
    let currentIndex = 0;
    const lowerContent = book.content.toLowerCase();
    
    while ((currentIndex = lowerContent.indexOf(query, currentIndex)) !== -1) {
      let nearestHeadingId = headings[0]?.id || '';
      let headingText = '';
      const start = Math.max(0, currentIndex - 40);
      const end = Math.min(book.content.length, currentIndex + query.length + 40);
      let snippet = book.content.substring(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < book.content.length) snippet = snippet + '...';
      
      const heading = headings.slice().reverse().find(h => h.index < currentIndex);
      if (heading) {
        nearestHeadingId = heading.id;
        headingText = heading.text;
      }
      results.push({ snippet, headingId: nearestHeadingId, headingText });
      currentIndex += query.length;
      if (results.length > 50) break;
    }
    return results;
  }, [searchQuery, book.content, headings]);

  const handleScroll = () => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    onUpdateBook({ progress: progress || 0 });
    localStorage.setItem(`scroll_${book.id}`, scrollTop.toString());

    if (settings.focusMode) {
      const elements = Array.from(mainRef.current.querySelectorAll('.prose > *'));
      const center = window.innerHeight / 2;
      let closest = -1;
      let minDistance = Infinity;
      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        if (distance < minDistance) {
          minDistance = distance;
          closest = i;
        }
      });
      elements.forEach((el, i) => {
        if (i === closest) {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.filter = 'blur(0px)';
        } else {
          (el as HTMLElement).style.opacity = '0.2';
          (el as HTMLElement).style.filter = 'blur(1px)';
        }
        (el as HTMLElement).style.transition = 'opacity 0.3s, filter 0.3s';
      });
    } else {
      const elements = Array.from(mainRef.current.querySelectorAll('.prose > *'));
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '';
        (el as HTMLElement).style.filter = '';
      });
    }
  };

  // Apply focus mode on toggle
  useEffect(() => {
    if (!mainRef.current) return;
    if (settings.focusMode) {
      handleScroll(); // Trigger calculation
    } else {
      const elements = Array.from(mainRef.current.querySelectorAll('.prose > *'));
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '';
        (el as HTMLElement).style.filter = '';
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusMode]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleAddHighlight = (color: string) => {
    if (!selection.text) return;
    
    const currentScroll = mainRef.current?.scrollTop || 0;
    const headingElements = Array.from(document.querySelectorAll('main h1, main h2, main h3')) as HTMLElement[];
    const prev = headingElements.slice().reverse().find(el => el.offsetTop <= currentScroll + 200);
    
    onAddHighlight({
      id: crypto.randomUUID(),
      bookId: book.id,
      text: selection.text,
      color,
      timestamp: Date.now(),
      headingText: prev ? prev.innerText : ''
    });
    setSelection({ text: '', rect: null });
    window.getSelection()?.removeAllRanges();
  };

  const handleSharePassage = () => {
    if (!selection.text) return;
    const scroll = mainRef.current?.scrollTop || 0;
    const hash = `#passage=${encodeURIComponent(selection.text)}&scroll=${scroll}`;
    window.history.replaceState(null, '', hash);
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
    setSelection({ text: '', rect: null });
    window.getSelection()?.removeAllRanges();
  };

  const handleExportNotes = () => {
    let md = `# Highlights for ${book.title}\n\n`;
    if (bookHighlights.length === 0) {
      showToast('No highlights to export.', 'error');
      return;
    }
    
    const grouped: Record<string, any[]> = {};
    bookHighlights.forEach((h: any) => {
      const heading = h.headingText || 'General';
      if (!grouped[heading]) grouped[heading] = [];
      grouped[heading].push(h);
    });
    
    Object.entries(grouped).forEach(([heading, hlts]) => {
      if (heading !== 'General') md += `### ${heading}\n\n`;
      hlts.forEach(h => {
        md += `> ${h.text}\n\n`;
      });
    });
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '-')}-highlights.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Highlights exported successfully', 'success');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-150 ease-out" style={{ width: `${book.progress}%` }} />

      {/* Highlight Toolbar */}
      {selection.rect && (
        <div 
          className="fixed z-50 flex gap-1.5 p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-200"
          style={{ top: Math.max(10, selection.rect.top - 55), left: Math.max(10, selection.rect.left + selection.rect.width / 2 - 85) }}
        >
          <button onClick={() => handleAddHighlight('yellow')} className="w-7 h-7 rounded-full bg-yellow-400 hover:scale-110 transition-transform shadow-sm border border-black/5"></button>
          <button onClick={() => handleAddHighlight('green')} className="w-7 h-7 rounded-full bg-green-400 hover:scale-110 transition-transform shadow-sm border border-black/5"></button>
          <button onClick={() => handleAddHighlight('blue')} className="w-7 h-7 rounded-full bg-blue-400 hover:scale-110 transition-transform shadow-sm border border-black/5"></button>
          <button onClick={() => handleAddHighlight('pink')} className="w-7 h-7 rounded-full bg-pink-400 hover:scale-110 transition-transform shadow-sm border border-black/5"></button>
          <div className="w-px h-7 bg-black/10 dark:bg-white/10 mx-1"></div>
          <button onClick={handleSharePassage} className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:scale-110 transition-transform shadow-sm border border-black/5 text-zinc-600 dark:text-zinc-300" title="Share Passage"><LinkIcon size={14} /></button>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSearchOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
              <Search size={20} className="text-zinc-400" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search in document..." 
                className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-lg"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-2">
              {searchResults.length === 0 && searchQuery && (
                <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">No results found for &quot;{searchQuery}&quot;</div>
              )}
              {searchResults.length === 0 && !searchQuery && (
                <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">Type to start searching...</div>
              )}
              {searchResults.map((result, i) => (
                <button 
                  key={i}
                  className="w-full text-left p-4 rounded-xl mb-1 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50 group"
                  onClick={() => {
                    scrollToHeading(result.headingId);
                    setIsSearchOpen(false);
                  }}
                >
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wider">{result.headingText || 'Document Start'}</div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{result.snippet}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400" title="Back to Library">
            <ChevronLeft size={20} />
          </button>
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400" title="Toggle Sidebar">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex flex-col ml-2">
            <h1 className="font-semibold text-base hidden sm:block leading-tight line-clamp-1 text-zinc-900 dark:text-zinc-100">{book.title}</h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
              <Clock size={12} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Search (Cmd+F)">
            <Search size={18} />
          </button>
          <button onClick={handleExportNotes} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Export Highlights (Markdown)">
            <Download size={18} />
          </button>
          <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Print / PDF">
            <Printer size={18} />
          </button>
          <button onClick={onOpenSettings} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Settings">
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside 
          className={`
            absolute md:static inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 ease-in-out
            border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-xl flex flex-col
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
          `}
        >
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
            <button onClick={() => setActiveTab('contents')} className={`flex-1 py-3.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'contents' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b-2 border-transparent'}`}>
              <AlignLeft size={14} /> Contents
            </button>
            <button onClick={() => setActiveTab('bookmarks')} className={`flex-1 py-3.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'bookmarks' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b-2 border-transparent'}`}>
              <Bookmark size={14} /> Bookmarks
            </button>
            <button onClick={() => setActiveTab('highlights')} className={`flex-1 py-3.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors ${activeTab === 'highlights' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-b-2 border-transparent'}`}>
              <Highlighter size={14} /> Highlights
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'contents' && (
              <nav className="space-y-0.5">
                {headings.map((heading, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      block w-full text-left py-2 px-3 rounded-lg transition-colors text-sm hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100
                      ${heading.level === 1 ? 'font-semibold mt-4 mb-1 text-zinc-900 dark:text-zinc-100' : ''}
                      ${heading.level === 2 ? 'font-medium ml-3' : ''}
                      ${heading.level === 3 ? 'text-sm opacity-80 ml-6' : ''}
                    `}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-2">
                {bookBookmarks.length === 0 ? (
                  <div className="text-center p-8 text-zinc-500 dark:text-zinc-400 text-sm">No bookmarks yet. Click the bookmark icon next to any heading to save it.</div>
                ) : (
                  bookBookmarks.map((b: BookBookmark) => (
                    <div key={b.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow transition-all group cursor-pointer" onClick={() => scrollToHeading(b.headingId)}>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 leading-snug">{b.headingText}</h4>
                        <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(b); }} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-colors p-1 -mr-1 -mt-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 flex items-center gap-1.5"><Clock size={10} /> {new Date(b.timestamp).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'highlights' && (
              <div className="space-y-3">
                {bookHighlights.length === 0 ? (
                  <div className="text-center p-8 text-zinc-500 dark:text-zinc-400 text-sm">No highlights yet. Select any text to highlight it.</div>
                ) : (
                  bookHighlights.map((h: any) => (
                    <div key={h.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow transition-all group">
                      <div className={`w-3 h-3 rounded-full mb-3 bg-${h.color}-400 shadow-sm`} />
                      <p className="text-sm italic text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-4">&quot;{h.text}&quot;</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5"><Clock size={10} /> {new Date(h.timestamp).toLocaleDateString()}</div>
                        <button onClick={() => onRemoveHighlight(h.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scroll-smooth pb-32"
        >
          <div className={`mx-auto px-6 py-12 md:py-20 ${getMaxWidthClasses(settings.maxWidth)}`}>
            <div 
              className={`
                prose max-w-none
                ${getProseThemeClasses(settings.theme)}
                ${getFontClasses(settings.fontFamily)}
                ${getLineHeightClasses(settings.lineHeight)}
                ${settings.fontSize === 'sm' ? 'prose-sm' : settings.fontSize === 'lg' ? 'prose-lg' : settings.fontSize === 'xl' ? 'prose-xl' : 'prose-base'}
                prose-table:w-full prose-table:text-sm
                prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800/50 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                prose-td:p-3 prose-td:border-t prose-td:border-zinc-200 dark:prose-td:border-zinc-800
              `}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  a: ({node, href, children, ...props}) => {
                    if (href?.startsWith('#user-content-fn-')) {
                      return (
                        <FootnoteTooltip href={href}>
                          <a href={href} {...props}>{children}</a>
                        </FootnoteTooltip>
                      );
                    }
                    return <a href={href} {...props}>{children}</a>;
                  },
                  h1: ({node, ...props}) => {
                    const text = Array.isArray(props.children) ? props.children.join('') : props.children?.toString() || '';
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    const isBookmarked = bookBookmarks.some((b: any) => b.headingId === id);
                    return (
                      <div className="group relative flex items-center">
                        <h1 id={id} {...props} className="w-full" />
                        <button 
                          onClick={() => onToggleBookmark({ id: crypto.randomUUID(), bookId: book.id, headingId: id, headingText: text, timestamp: Date.now() })}
                          className={`absolute -left-8 p-1 rounded-md transition-opacity ${isBookmarked ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'}`}
                          title="Bookmark section"
                        >
                          {isBookmarked ? <BookmarkMinus size={20} /> : <BookmarkPlus size={20} />}
                        </button>
                      </div>
                    );
                  },
                  h2: ({node, ...props}) => {
                    const text = Array.isArray(props.children) ? props.children.join('') : props.children?.toString() || '';
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    const isBookmarked = bookBookmarks.some((b: any) => b.headingId === id);
                    return (
                      <div className="group relative flex items-center">
                        <h2 id={id} {...props} className="w-full border-b border-zinc-200 dark:border-zinc-800 pb-2" />
                        <button 
                          onClick={() => onToggleBookmark({ id: crypto.randomUUID(), bookId: book.id, headingId: id, headingText: text, timestamp: Date.now() })}
                          className={`absolute -left-8 p-1 rounded-md transition-opacity ${isBookmarked ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'}`}
                          title="Bookmark section"
                        >
                          {isBookmarked ? <BookmarkMinus size={18} /> : <BookmarkPlus size={18} />}
                        </button>
                      </div>
                    );
                  },
                  h3: ({node, ...props}) => {
                    const text = Array.isArray(props.children) ? props.children.join('') : props.children?.toString() || '';
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    const isBookmarked = bookBookmarks.some((b: any) => b.headingId === id);
                    return (
                      <div className="group relative flex items-center">
                        <h3 id={id} {...props} className="w-full" />
                        <button 
                          onClick={() => onToggleBookmark({ id: crypto.randomUUID(), bookId: book.id, headingId: id, headingText: text, timestamp: Date.now() })}
                          className={`absolute -left-8 p-1 rounded-md transition-opacity ${isBookmarked ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'}`}
                          title="Bookmark section"
                        >
                          {isBookmarked ? <BookmarkMinus size={16} /> : <BookmarkPlus size={16} />}
                        </button>
                      </div>
                    );
                  },
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl !my-6 !bg-[#1E1E1E] text-sm shadow-lg overflow-hidden border border-zinc-800"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-zinc-200 dark:border-zinc-700`} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {book.content}
              </ReactMarkdown>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Settings Modal ---
function SettingsModal({ settings, setSettings, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
          <h2 className="font-semibold text-lg flex items-center gap-2"><SettingsIcon size={18} className="text-zinc-500" /> Reading Preferences</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-500 transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"><Palette size={16} className="text-zinc-400" /> Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'light', name: 'Light', class: 'bg-white text-zinc-900 border-zinc-200 dark:border-zinc-700' },
                { id: 'dark', name: 'Dark', class: 'bg-zinc-950 text-zinc-100 border-zinc-800' },
                { id: 'sepia', name: 'Sepia', class: 'bg-[#f4ecd8] text-[#5c4a1e] border-[#d4c4a8]' },
                { id: 'high-contrast', name: 'High Contrast', class: 'bg-black text-white border-zinc-800' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSettings({ ...settings, theme: t.id })}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${t.class} ${settings.theme === t.id ? 'ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-zinc-900 border-transparent' : 'hover:border-zinc-400 dark:hover:border-zinc-500'}`}
                >
                  <span className="font-medium text-sm">{t.name}</span>
                  {settings.theme === t.id && <Check size={16} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"><Type size={16} className="text-zinc-400" /> Typography</label>
            <div className="space-y-4">
              <div className="flex bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                {[
                  { id: 'sans', name: 'Sans', class: 'font-sans' },
                  { id: 'serif', name: 'Serif', class: 'font-serif' },
                  { id: 'mono', name: 'Mono', class: 'font-mono' }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setSettings({ ...settings, fontFamily: f.id })}
                    className={`flex-1 py-1.5 text-sm rounded-md transition-all ${f.class} ${settings.fontFamily === f.id ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 w-16">Size</span>
                <input 
                  type="range" min="0" max="3" step="1" 
                  value={['sm', 'base', 'lg', 'xl'].indexOf(settings.fontSize)}
                  onChange={e => setSettings({ ...settings, fontSize: ['sm', 'base', 'lg', 'xl'][parseInt(e.target.value)] as FontSize })}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm font-mono w-8 text-right text-zinc-500 dark:text-zinc-400">{settings.fontSize}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 w-16">Spacing</span>
                <div className="flex-1 flex bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                  {[
                    { id: 'compact', name: '1.4' },
                    { id: 'normal', name: '1.7' },
                    { id: 'relaxed', name: '2.0' }
                  ].map(lh => (
                    <button 
                      key={lh.id}
                      onClick={() => setSettings({ ...settings, lineHeight: lh.id })}
                      className={`flex-1 py-1 text-sm rounded-md transition-all ${settings.lineHeight === lh.id ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                    >
                      {lh.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"><Maximize size={16} className="text-zinc-400" /> Layout Width</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
              {[
                { id: 'narrow', name: 'Narrow' },
                { id: 'medium', name: 'Medium' },
                { id: 'wide', name: 'Wide' },
                { id: 'full', name: 'Full' }
              ].map(mw => (
                <button 
                  key={mw.id}
                  onClick={() => setSettings({ ...settings, maxWidth: mw.id })}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${settings.maxWidth === mw.id ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                >
                  {mw.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">Optimal reading length is 60-80 characters (Medium).</p>
          </div>

          {/* Reading Experience */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"><Eye size={16} className="text-zinc-400" /> Experience</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Focus Mode</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Dim inactive paragraphs</div>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${settings.focusMode ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.focusMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={settings.focusMode} 
                  onChange={e => setSettings({ ...settings, focusMode: e.target.checked })} 
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Footnote Tooltip ---
function FootnoteTooltip({ href, children }: { href: string, children: React.ReactNode }) {
  const [content, setContent] = useState<string | null>(null);
  
  return (
    <span 
      className="inline-block relative group"
      onMouseEnter={() => {
        const id = href.startsWith('#') ? href.slice(1) : href;
        const el = document.getElementById(id);
        if (el) {
          // Extract text content, ignoring the backreference link
          const text = el.innerText.replace('↩', '').trim();
          setContent(text);
        }
      }}
    >
      {children}
      {content && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900"></div>
        </div>
      )}
    </span>
  );
}

// --- CSS Class Helpers ---
function getThemeClasses(theme: Theme) {
  switch (theme) {
    case 'dark': return 'bg-zinc-950 text-zinc-100';
    case 'sepia': return 'bg-[#f4ecd8] text-[#5c4a1e]';
    case 'high-contrast': return 'bg-black text-white';
    case 'light': default: return 'bg-zinc-50 text-zinc-900';
  }
}

function getProseThemeClasses(theme: Theme) {
  const baseClasses = "prose-headings:font-semibold prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:rounded-r-lg";
  switch (theme) {
    case 'dark': return `prose-invert prose-zinc ${baseClasses} prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-blue-400 prose-strong:text-zinc-100 prose-code:text-zinc-200 prose-blockquote:text-zinc-300 prose-blockquote:border-zinc-700 prose-blockquote:bg-zinc-900/50`;
    case 'sepia': return `prose-stone ${baseClasses} prose-headings:text-[#4a3b18] prose-p:text-[#5c4a1e] prose-a:text-[#b45309] prose-strong:text-[#4a3b18] prose-code:text-[#5c4a1e] prose-blockquote:text-[#786127] prose-blockquote:border-[#d4c4a8] prose-blockquote:bg-[#e8dec3]/50`;
    case 'high-contrast': return `prose-invert ${baseClasses} prose-headings:text-white prose-p:text-white prose-a:text-yellow-400 prose-strong:text-white prose-code:text-white prose-blockquote:text-white prose-blockquote:border-white prose-blockquote:bg-zinc-900`;
    case 'light': default: return `prose-zinc ${baseClasses} prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-a:text-blue-600 prose-strong:text-zinc-900 prose-code:text-zinc-800 prose-blockquote:text-zinc-700 prose-blockquote:border-zinc-300 prose-blockquote:bg-zinc-50`;
  }
}

function getFontClasses(font: FontFamily) {
  switch (font) {
    case 'serif': return 'font-serif';
    case 'mono': return 'font-mono';
    case 'sans': default: return 'font-sans';
  }
}

function getLineHeightClasses(lh: LineHeight) {
  switch (lh) {
    case 'compact': return 'leading-relaxed prose-p:my-3 prose-headings:mb-3 prose-headings:mt-6';
    case 'relaxed': return 'leading-[2.2] prose-p:my-8 prose-headings:mb-8 prose-headings:mt-12';
    case 'normal': default: return 'leading-loose prose-p:my-5 prose-headings:mb-5 prose-headings:mt-10';
  }
}

function getMaxWidthClasses(mw: MaxWidth) {
  switch (mw) {
    case 'narrow': return 'max-w-[60ch]';
    case 'wide': return 'max-w-[90ch]';
    case 'full': return 'max-w-full px-4 md:px-12';
    case 'medium': default: return 'max-w-[75ch]';
  }
}
