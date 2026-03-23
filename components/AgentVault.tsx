"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Bot, Code2, Search, Plus, Upload, Terminal, Wand2,
  ChevronLeft, Save, FileText, Trash2, Layers,
  Sparkles, Star, Copy, Download, X, Menu,
  CheckCircle2, AlertCircle, Info, LayoutDashboard,
  BookOpen, Eye, Edit3, ChevronLeftCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════
// BRAND LOGO COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="00CLAUDE"
      className={className}
      width={32}
      height={32}
      priority
      unoptimized
    />
  );
}

// Global styles are now in app/globals.css — no inline injection needed.

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════
interface Doc {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface Toast {
  id: string;
  msg: string;
  type: "info" | "success" | "error";
}

interface CategoryConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  singular: string;
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS & UTILS
// ═══════════════════════════════════════════════════════════════════════
const CATS: Record<string, CategoryConfig> = {
  agent: { label: "AGENTS", color: "#F25A38", icon: Bot, singular: "Agent" },
  skill: { label: "SKILLS", color: "#8B5CF6", icon: Code2, singular: "Skill" },
  template: { label: "TEMPLATES", color: "#14B8A6", icon: Layers, singular: "Template" },
  prompt: { label: "PROMPTS", color: "#F59E0B", icon: Terminal, singular: "Prompt" },
};

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();
const ago = (iso: string) => {
  if (!iso) return "";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Markdown Renderer
function renderMarkdown(md: string): string {
  if (!md) return "";
  return md
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_, _lang, code) =>
        `<pre class="bg-[#0b0c14]/80 border border-[#6366f1]/10 rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed my-4 text-indigo-100 shadow-inner"><code>${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-[#F25A38]/15 text-[#ff8a73] px-1.5 py-0.5 rounded-md font-mono text-[13px]">$1</code>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="font-bebas text-xl tracking-wide text-indigo-200 mt-6 mb-2">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="font-bebas text-2xl tracking-wide text-white mt-8 mb-3 border-b border-indigo-500/20 pb-2">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="font-bebas text-4xl tracking-wide text-[#F25A38] mt-2 mb-6 drop-shadow-sm">$1</h1>'
    )
    .replace(
      /^- \[x\] (.+)$/gm,
      '<div class="flex items-start gap-2 my-1.5"><span class="text-emerald-400 text-sm mt-0.5">&#10003;</span><span class="line-through opacity-50">$1</span></div>'
    )
    .replace(
      /^- \[ \] (.+)$/gm,
      '<div class="flex items-start gap-2 my-1.5"><span class="text-indigo-400/40 text-sm mt-0.5">&#9675;</span><span>$1</span></div>'
    )
    .replace(
      /^- (.+)$/gm,
      '<div class="flex gap-2 my-1.5 pl-1"><span class="text-[#F25A38] opacity-70 mt-0.5">&#8250;</span><span class="leading-relaxed">$1</span></div>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-white font-bold">$1</strong>'
    )
    .replace(
      /\*(.+?)\*/g,
      '<em class="text-indigo-200 italic">$1</em>'
    )
    .replace(/\n\n/g, '<div class="h-4"></div>')
    .replace(/\n/g, "<br>");
}

const SEED_DOCS: Doc[] = [
  {
    id: uid(),
    name: "Frontend Architect",
    category: "agent",
    description: "React/Tailwind architect focused on modern UI/UX.",
    content:
      "# Frontend Architect Agent\n\n## Role\nYou are an expert Frontend Architect specialized in React and Tailwind CSS.\n\n## Directives\n- Use arbitrary values sparingly.\n- Prioritize glassmorphic aesthetics (`bg-white/5 backdrop-blur-md`).\n- Provide the final code wrapped in standard markdown blocks.",
    tags: ["react", "prompt-engineering"],
    favorite: true,
    createdAt: now(),
    updatedAt: now(),
    version: 1,
  },
  {
    id: uid(),
    name: "Python Data Pipeline",
    category: "skill",
    description:
      "Extraction routine for unstructured text to Pandas DataFrame.",
    content:
      "# Skill: Data Extraction Pipeline\n\n## Description\nExtracts tabular data from HTML.\n\n## Steps\n1. Use `BeautifulSoup` to parse DOM.\n2. Output to `pandas.DataFrame`.\n3. Handle `None` gracefully.",
    tags: ["python"],
    favorite: false,
    createdAt: now(),
    updatedAt: now(),
    version: 1,
  },
  {
    id: uid(),
    name: "CLAUDE.md Boilerplate",
    category: "template",
    description: "Standard project configuration template for Claude Code.",
    content:
      "# CLAUDE.md \u2014 Standard Boilerplate v2.0\n\n## Role\nSenior staff engineer + UX lead.\n\n## Principles\n- Best-practices first, ship-ready at all times\n- Boring-is-beautiful (reliable over clever)\n- Verify before push\n- WCAG accessibility\n- OWASP security\n\n## Verification (Before Every Commit)\n- [ ] Lint passes\n- [ ] Typecheck passes\n- [ ] Unit tests pass\n- [ ] Build succeeds\n- [ ] Conventional Commits format",
    tags: ["claude-code", "full-stack"],
    favorite: true,
    createdAt: now(),
    updatedAt: now(),
    version: 1,
  },
  {
    id: uid(),
    name: "Code Review Prompt",
    category: "prompt",
    description:
      "Structured code review covering security, performance, maintainability.",
    content:
      "# Code Review Prompt\n\nReview the following code for:\n\n## Security\n- Input validation and sanitization\n- Authentication/authorization checks\n- SQL injection, XSS, CSRF vulnerabilities\n\n## Performance\n- N+1 query detection\n- Unnecessary re-renders (React)\n- Memory leaks\n- Caching opportunities\n\n## Maintainability\n- Naming clarity\n- Function length and complexity\n- Type safety\n- Error handling completeness\n\nProvide findings as: CRITICAL / WARNING / SUGGESTION with file:line references.",
    tags: ["testing", "security", "performance"],
    favorite: false,
    createdAt: now(),
    updatedAt: now(),
    version: 1,
  },
  {
    id: uid(),
    name: "MCP Server Builder",
    category: "skill",
    description:
      "Model Context Protocol server with Zod schemas and tool registration.",
    content:
      '# MCP Server Builder Skill\n\n## Architecture\n- TypeScript with McpServer class\n- Zod schemas for runtime validation\n- Streamable HTTP for remote, stdio for local\n\n## Tool Registration\n```typescript\nserver.registerTool({\n  name: "search_docs",\n  description: "Search documentation by keyword",\n  inputSchema: z.object({\n    query: z.string().describe("Search query"),\n    limit: z.number().default(10),\n  }),\n  handler: async ({ query, limit }) => {\n    // implementation\n  },\n});\n```\n\n## Best Practices\n- Descriptive tool names (verb_noun)\n- Rich parameter descriptions\n- Pagination for list operations\n- Structured error responses',
    tags: ["api-design", "testing"],
    favorite: true,
    createdAt: now(),
    updatedAt: now(),
    version: 1,
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ANIMATED AMBIENT BACKGROUND (throttled to ~30fps)
// ═══════════════════════════════════════════════════════════════════════
function AmbientField({ isActive = true }: { isActive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let lastTime = 0;
    const frameDuration = 1000 / 30; // ~30fps

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      isRed: boolean;
    }
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const particleCount = window.innerWidth < 768 ? 6 : 18;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.5,
        isRed: Math.random() > 0.6,
      });
    }

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);
      if (timestamp - lastTime < frameDuration) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000) { // 100^2 — avoids Math.hypot
            const dist = Math.sqrt(distSq);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const alpha = 0.2 + p.r * 0.1;
        ctx.fillStyle = p.isRed
          ? `rgba(242, 90, 56, ${alpha})`
          : `rgba(99, 102, 241, ${alpha + 0.1})`;
        ctx.fill();
      }
    };
    animationFrameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-70"
      style={{ willChange: "transform" }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TYPING ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════
const HERO_LINES = [
  { text: "AGENTS, SKILLS,", accent: false },
  { text: "AND PROTOCOLS.", accent: false },
  { text: "FINALLY IN ONE", accent: true },
  { text: "REPO.", accent: true },
];

function computeTypingState(cursor: number) {
  const totalChars = HERO_LINES.reduce((sum, l) => sum + l.text.length, 0);
  const done = cursor >= totalChars;

  // Build prefix sums to determine line boundaries
  const prefixSums = [0];
  for (let i = 0; i < HERO_LINES.length; i++) {
    prefixSums.push(prefixSums[i] + HERO_LINES[i].text.length);
  }

  let cursorLineIndex = -1;
  const lines = HERO_LINES.map((line, i) => {
    const lineStart = prefixSums[i];
    const lineEnd = prefixSums[i + 1];
    if (cursor >= lineEnd) {
      return { text: line.text, accent: line.accent, visible: true };
    }
    if (cursor > lineStart) {
      cursorLineIndex = i;
      return { text: line.text.slice(0, cursor - lineStart), accent: line.accent, visible: true };
    }
    if (cursor === lineStart && !done) {
      cursorLineIndex = i;
      return { text: "", accent: line.accent, visible: true };
    }
    return { text: "", accent: line.accent, visible: false };
  });

  return { lines, done, showCursor: !done, cursorLineIndex };
}

function useTypingAnimation(isActive: boolean) {
  const totalChars = HERO_LINES.reduce((sum, l) => sum + l.text.length, 0);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (!isActive || cursor >= totalChars) return;
    const timeout = setTimeout(() => setCursor((c) => c + 1), 40);
    return () => clearTimeout(timeout);
  }, [isActive, cursor, totalChars]);

  return computeTypingState(cursor);
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function AgentVault() {
  // Navigation & State
  const [hasEntered, setHasEntered] = useState(false);
  const [view, setView] = useState("dashboard");
  const [docs, setDocs] = useState<Doc[]>(() => {
    if (typeof window === "undefined") return SEED_DOCS;
    const saved = localStorage.getItem("agentvault-docs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SEED_DOCS;
      }
    }
    return SEED_DOCS;
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mobile Editor Tabs
  const [mobileEditorTab, setMobileEditorTab] = useState("edit");

  // AI State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiDocType, setAiDocType] = useState("agent");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback(
    (msg: string, type: "info" | "success" | "error" = "info") => {
      const id = uid();
      setToasts((p) => [...p, { id, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
    },
    []
  );

  // Responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileEditorTab("split");
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-save
  useEffect(() => {
    if (docs.length > 0) {
      localStorage.setItem("agentvault-docs", JSON.stringify(docs));
    }
  }, [docs]);

  // Actions
  const enterApp = (targetView: string, category: string | null = null) => {
    setHasEntered(true);
    setView(targetView);
    setActiveCategory(category);
  };

  const goHome = () => {
    setHasEntered(false);
    setSidebarOpen(false);
  };

  const createDoc = (category: string) => {
    const doc: Doc = {
      id: uid(),
      name: `New ${CATS[category].singular}`,
      category,
      description: "",
      content: `# New ${CATS[category].singular}\n\nStart typing...`,
      tags: [],
      favorite: false,
      createdAt: now(),
      updatedAt: now(),
      version: 1,
    };
    setDocs((p) => [doc, ...p]);
    setEditing(doc);
    setView("editor");
    if (window.innerWidth < 1024) setSidebarOpen(false);
    showToast(`Created new ${CATS[category].singular}`, "success");
  };

  const saveDoc = (doc: Doc) => {
    setDocs((p) =>
      p.map((d) =>
        d.id === doc.id
          ? { ...doc, updatedAt: now(), version: d.version + 1 }
          : d
      )
    );
    setEditing(doc);
    showToast("Saved to Vault", "success");
  };

  const deleteDoc = (id: string) => {
    setDocs((p) => p.filter((d) => d.id !== id));
    if (editing?.id === id) {
      setEditing(null);
      setView("library");
    }
    showToast("Document deleted");
  };

  const handleUploadFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
        showToast("Only .md/.txt files allowed", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        let category = "template";
        if (
          content.toLowerCase().includes("role") ||
          content.toLowerCase().includes("agent")
        )
          category = "agent";
        else if (content.toLowerCase().includes("skill")) category = "skill";

        const doc: Doc = {
          id: uid(),
          name: file.name.replace(/\.(md|txt)$/, ""),
          category,
          description: "Imported document",
          content,
          tags: ["imported"],
          favorite: false,
          createdAt: now(),
          updatedAt: now(),
          version: 1,
        };
        setDocs((p) => [doc, ...p]);
        showToast(`Imported ${file.name}`, "success");
      };
      reader.readAsText(file);
    });
  };

  // AI Generation — calls server route or falls back to mock
  const buildMockContent = (prompt: string, docType: string): string => {
    const typeName = CATS[docType].singular;
    const mockTemplates: Record<string, string> = {
      agent: `# ${typeName}: ${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""}\n\n## Role\nYou are a specialized AI agent. ${prompt}\n\n## Capabilities\n- Analyze requirements and context before acting\n- Apply domain-specific best practices\n- Provide structured, actionable outputs\n- Iterate based on feedback\n\n## Instructions\n1. Begin by understanding the full scope of the request\n2. Break complex tasks into clear, sequential steps\n3. Apply relevant expertise and best practices\n4. Validate outputs against the original requirements\n5. Present results in a clean, organized format\n\n## Constraints\n- Stay within your defined scope\n- Ask clarifying questions when requirements are ambiguous\n- Prefer proven approaches over experimental ones\n- Document assumptions and trade-offs\n\n## Output Format\nProvide responses in well-structured markdown with clear headings, code blocks where appropriate, and actionable next steps.`,
      skill: `# Skill: ${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""}\n\n## Description\n${prompt}\n\n## Trigger\nActivate this skill when the user requests tasks related to this domain.\n\n## Steps\n1. **Analyze** — Parse the input and identify key requirements\n2. **Plan** — Outline the approach and identify dependencies\n3. **Execute** — Perform the task following best practices\n4. **Validate** — Verify the output meets the requirements\n5. **Deliver** — Present the result with clear documentation\n\n## Quality Checks\n- [ ] Output matches the stated requirements\n- [ ] Best practices are followed\n- [ ] Edge cases are handled\n- [ ] Documentation is included`,
      template: `# Project Configuration\n\n## Overview\n${prompt}\n\n## Role\nYou are a senior engineer working on this project. Follow all conventions and standards defined below.\n\n## Principles\n- Write clean, maintainable code\n- Prefer simplicity over cleverness\n- Test before you ship\n- Document decisions, not obvious code\n\n## Verification Protocol\n1. Lint and format all changed files\n2. Run the test suite\n3. Verify the build succeeds\n4. Review your own diff before committing\n\n## Commit Standards\n- Use conventional commits: \`feat:\`, \`fix:\`, \`chore:\`, \`docs:\`\n- Keep commits focused and atomic\n- Write meaningful commit messages`,
      prompt: `# Prompt: ${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""}\n\n## Objective\n${prompt}\n\n## Context\nProvide any relevant background information, constraints, or preferences that shape the expected output.\n\n## Instructions\n1. Carefully read and understand the objective\n2. Consider edge cases and constraints\n3. Structure the response clearly\n4. Include examples where helpful\n\n## Expected Output\nA well-structured response that directly addresses the objective with practical, actionable content.\n\n## Evaluation Criteria\n- Relevance to the stated objective\n- Clarity and organization\n- Practical applicability\n- Completeness`,
    };
    return mockTemplates[docType] || mockTemplates.agent;
  };

  const generateAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult("");

    try {
      const res = await fetch("/api/anthropic/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, docType: aiDocType }),
      });
      const data = await res.json();
      if (data.content) {
        setAiResult(data.content);
        showToast("Generation complete", "success");
      } else {
        setAiResult(buildMockContent(aiPrompt, aiDocType));
        showToast(
          data.error
            ? "Using mock generation (no API key configured)"
            : "Using mock generation (unexpected response)",
          "info"
        );
      }
    } catch {
      setAiResult(buildMockContent(aiPrompt, aiDocType));
      showToast("Using mock generation (API unavailable)", "info");
    }
    setAiLoading(false);
  };

  // Derived State
  const filteredDocs = useMemo(() => {
    let res = docs;
    if (activeCategory) res = res.filter((d) => d.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return res.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [docs, activeCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: docs.length,
    agents: docs.filter((d) => d.category === "agent").length,
    skills: docs.filter((d) => d.category === "skill").length,
    templates: docs.filter((d) => d.category === "template").length,
  }), [docs]);

  const rootBgClasses =
    "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1a2f] via-[#110e18] to-[#08070b]";

  // Typing animation for hero heading
  const typing = useTypingAnimation(!hasEntered);

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: HERO (LANDING)
  // ═══════════════════════════════════════════════════════════════════
  if (!hasEntered) {
    return (
      <div
        className={`min-h-[100dvh] flex flex-col relative overflow-hidden ${rootBgClasses}`}
      >
        <AmbientField isActive={!hasEntered} />

        {/* Glows — reduced on mobile for Safari perf */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[60px] md:blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F25A38]/10 rounded-full blur-[60px] md:blur-[150px] pointer-events-none mix-blend-screen" />

        {/* Header — z-30 to stay above hero z-10 */}
        <header className="relative z-30 flex justify-between items-center p-6 lg:px-12 lg:py-8 w-full max-w-7xl mx-auto">
          <div className="font-bebas text-2xl lg:text-3xl tracking-widest flex items-center gap-2 drop-shadow-md">
            <BrandLogo className="w-8 h-8 drop-shadow-[0_0_12px_rgba(69,76,252,0.55)] drop-shadow-[0_0_10px_rgba(242,90,56,0.5)]" />
            <span className="mt-1"><span className="text-white">00</span><span className="text-[#F25A38]">CLAUDE</span></span>
          </div>
          <div className="flex gap-6 text-sm text-indigo-200/70 font-medium">
            <button onClick={() => enterApp("library")} className="hover:text-white transition-colors">Docs</button>
          </div>
        </header>

        {/* Hero Content — z-10, below header */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-bebas text-[4.5rem] leading-[0.9] md:text-[7rem] lg:text-[8.5rem] tracking-tight mb-6 pointer-events-none min-h-[4lh]">
            {typing.lines.map((line, i) => (
              <span
                key={i}
                className={`block drop-shadow-sm ${
                  line.accent
                    ? "text-[#F25A38] drop-shadow-[0_0_40px_rgba(242,90,56,0.5)]"
                    : "text-white"
                }`}
                style={{ visibility: line.visible ? "visible" : "hidden" }}
              >
                {line.text}
                {typing.showCursor && typing.cursorLineIndex === i && (
                  <span className="typing-cursor" />
                )}
                {!line.visible && "\u00A0"}
              </span>
            ))}
          </h1>

          <div className={typing.done ? "fade-in-up" : "opacity-0"}>
            <p className="text-indigo-200/60 text-base md:text-xl leading-relaxed mb-12 max-w-2xl font-light">
              The ultimate repository for Claude Code and other LLMs. Construct,
              refine, and deploy agentic capabilities from a single fast,
              beautiful workspace.
            </p>
          </div>

          {/* Entry Bar — fades in after typing completes */}
          <div className={`glass-panel p-2 rounded-[1.25rem] flex flex-col sm:flex-row gap-2 w-full max-w-lg shadow-2xl ${typing.done ? "fade-in-up-delayed" : "opacity-0"}`}>
            <button
              onClick={() => enterApp("dashboard")}
              className="flex-1 flex items-center gap-3 bg-black/40 text-indigo-200/50 px-5 py-4 rounded-xl hover:text-white hover:bg-black/60 transition-all border border-indigo-500/10"
            >
              <Search className="w-5 h-5 text-[#F25A38]" />
              <span className="text-[0.95rem]">Search the vault...</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => enterApp("library", null)}
                className="flex-1 sm:flex-none px-6 py-4 rounded-xl bg-indigo-500/20 text-indigo-100 font-medium hover:bg-indigo-500/30 transition-all border border-indigo-500/20"
              >
                All
              </button>
              <button
                onClick={() => enterApp("library", "agent")}
                className="flex-1 sm:flex-none px-4 py-4 rounded-xl text-indigo-200/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-indigo-500/20"
              >
                <Bot className="w-4 h-4 text-[#F25A38]" />
                <span className="hidden sm:inline">Agents</span>
              </button>
              <button
                onClick={() => enterApp("library", "skill")}
                className="flex-1 sm:flex-none px-4 py-4 rounded-xl text-indigo-200/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-indigo-500/20"
              >
                <Code2 className="w-4 h-4 text-[#8B5CF6]" />
                <span className="hidden sm:inline">Skills</span>
              </button>
            </div>
          </div>
        </main>

        {/* ═══ VASEY/AI Branded Footer ═══ */}
        <footer className="app-footer relative z-20 px-6 pb-8">
          <div className="footer-divider"></div>
          <div className="footer-brand-row">
            {/* Vasey Multimedia — VM Monogram */}
            <a href="https://vaseymultimedia.com" target="_blank" rel="noopener noreferrer" className="footer-logo" aria-label="Vasey Multimedia">
              <svg className="footer-logo-vm" viewBox="0 0 688 592" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0,592) scale(0.1,-0.1)" fill="currentColor" color="var(--text-secondary)">
                  <path d="M20 3827 l0 -2073 251 -265 c138 -145 281 -299 317 -341 37 -42 70 -76 74 -75 3 1 8 851 10 1889 2 1038 8 1891 12 1895 5 4 11 2 13 -5 3 -7 51 -70 106 -139 144 -178 444 -556 611 -767 77 -98 193 -245 257 -325 64 -80 223 -281 353 -446 130 -165 301 -381 380 -480 78 -99 205 -261 282 -359 76 -99 176 -227 222 -285 46 -58 104 -133 130 -166 323 -418 405 -517 415 -499 13 24 111 152 237 309 83 104 193 244 345 438 22 29 76 97 120 153 44 56 116 148 160 205 44 57 213 270 375 474 162 203 307 386 322 405 15 19 89 112 165 207 76 94 174 218 217 275 44 57 202 258 350 447 317 403 353 448 409 521 l42 55 3 -1903 c1 -1047 6 -1902 10 -1900 4 2 50 50 102 108 52 58 184 197 294 310 110 113 211 221 225 241 l26 35 0 225 c0 123 -1 1053 -2 2067 l-3 1842 -323 0 c-309 0 -323 -1 -332 -19 -6 -11 -57 -79 -115 -151 -126 -158 -178 -226 -377 -486 -83 -109 -191 -249 -240 -311 -48 -61 -166 -212 -262 -335 -197 -251 -337 -430 -522 -663 -70 -88 -146 -186 -170 -217 -120 -155 -371 -476 -528 -673 -96 -121 -198 -249 -226 -285 -28 -36 -111 -140 -184 -232 l-133 -166 -27 31 c-15 18 -49 61 -77 97 -27 36 -103 133 -169 216 -66 82 -164 206 -217 275 -53 68 -170 216 -258 329 -89 113 -276 354 -417 535 -141 182 -289 371 -328 420 -39 50 -128 162 -196 250 -69 88 -181 232 -250 319 -68 87 -221 283 -339 435 -119 152 -271 345 -338 429 -67 84 -129 164 -138 177 l-16 25 -324 0 -324 0 0 -2073z M1209 5883 c5 -10 66 -90 136 -178 69 -88 176 -225 238 -305 61 -80 146 -188 187 -241 41 -52 106 -136 145 -185 38 -49 121 -155 185 -235 63 -80 141 -179 172 -220 62 -79 308 -394 532 -679 213 -272 298 -381 471 -603 88 -114 162 -206 165 -206 3 0 21 21 41 47 19 26 109 141 200 256 90 115 247 315 348 445 236 302 465 594 547 696 102 128 375 474 563 716 96 123 216 276 266 339 50 63 136 171 190 240 l98 125 -374 3 c-292 2 -375 0 -380 -10 -4 -7 -102 -132 -218 -278 -116 -146 -223 -281 -238 -301 -98 -128 -269 -345 -333 -423 -41 -50 -93 -116 -115 -146 -22 -30 -78 -102 -125 -160 -78 -96 -186 -232 -388 -490 -41 -52 -79 -95 -83 -95 -5 0 -46 48 -91 106 -101 129 -455 578 -750 949 -509 643 -621 786 -642 817 l-21 33 -368 0 c-347 0 -367 -1 -358 -17z M1130 2171 l0 -1484 163 -166 c156 -159 343 -353 437 -453 25 -27 48 -48 53 -48 4 0 7 637 7 1415 l0 1415 -33 37 c-19 21 -151 184 -295 363 -144 179 -277 343 -296 365 l-35 40 -1 -1484z M5633 3532 c-50 -64 -193 -245 -317 -401 l-226 -284 0 -1413 c0 -887 4 -1414 10 -1414 5 0 13 6 17 14 10 18 110 125 267 286 66 69 175 181 241 250 l120 125 -3 1478 c-1 812 -5 1477 -10 1476 -4 0 -48 -53 -99 -117z"/>
                </g>
              </svg>
            </a>
            <div className="footer-logo-sep"></div>
            {/* VASEY/AI — V/AI Monogram */}
            <a href="https://vasey.ai" target="_blank" rel="noopener noreferrer" className="footer-logo" aria-label="VASEY/AI">
              <svg className="footer-logo-vai" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0,1080) scale(0.1,-0.1)">
                  <path d="M5797 7988 c-15 -12 -38 -53 -162 -283 -26 -49 -75 -139 -108 -200 -58 -107 -233 -435 -334 -625 -84 -157 -278 -521 -311 -580 -16 -30 -127 -239 -247 -465 -119 -225 -233 -439 -252 -475 -20 -36 -76 -141 -125 -235 -50 -93 -105 -197 -123 -230 -18 -33 -73 -136 -123 -230 -49 -93 -99 -187 -111 -209 -12 -21 -62 -114 -111 -206 -49 -92 -97 -183 -108 -201 -10 -19 -42 -78 -72 -131 -29 -54 -59 -98 -66 -98 -17 0 -34 32 -34 61 0 21 63 146 190 379 196 358 240 441 240 454 0 13 -482 978 -500 1001 -5 6 -74 141 -155 300 -81 160 -195 382 -253 495 -58 113 -134 262 -168 332 -35 70 -71 131 -81 136 -20 11 -983 3 -983 -7 0 -3 31 -62 68 -131 37 -69 103 -192 146 -275 44 -82 129 -244 191 -360 62 -115 143 -268 180 -340 37 -71 103 -195 145 -275 43 -80 105 -199 140 -265 35 -66 82 -156 105 -200 24 -44 118 -224 210 -400 92 -176 202 -385 245 -465 42 -80 119 -226 171 -325 51 -99 133 -256 181 -350 49 -93 147 -286 218 -427 115 -227 134 -258 154 -258 20 0 39 29 136 208 62 114 166 304 230 422 175 321 310 571 380 705 35 66 148 280 253 475 104 195 208 391 232 435 23 44 102 193 175 330 73 138 182 342 243 455 61 113 122 225 135 250 67 125 125 232 162 300 22 41 70 134 107 205 36 72 181 346 323 610 141 264 280 524 309 578 29 54 50 105 47 113 -5 12 -73 14 -439 14 -331 0 -437 -3 -450 -12z M8839 6962 c-42 -20 -114 -55 -160 -76 -152 -71 -473 -226 -529 -256 l-55 -29 -9 -318 c-5 -180 -5 -886 0 -1618 l9 -1300 420 0 420 0 0 1814 c0 1201 -3 1815 -10 1817 -5 1 -44 -14 -86 -34z M5983 6518 c-5 -7 -26 -44 -45 -83 -20 -38 -106 -200 -191 -359 -86 -158 -159 -297 -162 -307 -6 -17 98 -224 285 -574 15 -27 57 -109 94 -182 36 -72 74 -141 84 -152 17 -19 29 -20 424 -22 224 -2 410 0 414 4 3 3 -9 34 -29 69 -41 74 -313 594 -447 853 -265 515 -399 765 -410 765 -4 0 -12 -6 -17 -12z M5066 4761 c-19 -7 -101 -146 -281 -474 -76 -139 -105 -201 -97 -209 7 -7 487 -10 1571 -10 859 -1 1564 2 1567 5 4 3 -16 45 -44 94 -27 48 -74 135 -105 193 -130 249 -200 376 -215 393 -14 16 -83 17 -1196 16 -650 0 -1189 -4 -1200 -8z M6450 3977 c0 -8 15 -43 33 -78 19 -35 78 -149 132 -254 54 -104 101 -194 105 -200 9 -12 97 -182 323 -620 206 -401 225 -435 251 -444 12 -4 227 -5 479 -3 l457 4 -86 167 c-124 237 -179 341 -244 461 -31 58 -85 159 -120 225 -34 66 -79 152 -100 190 -21 39 -75 142 -120 230 -46 87 -104 195 -130 240 l-46 80 -49 6 c-28 3 -238 7 -467 8 -355 2 -418 0 -418 -12z" fill="currentColor" color="var(--text-secondary)"/>
                </g>
              </svg>
            </a>
          </div>
          <div className="footer-suite-tag">A VASEY/AI Production</div>
          <div className="footer-app-tag">00CLAUDE v0.4.0 &middot; The Not-so Secret Agent</div>
          <div className="footer-copyright">
            &copy; 2026 <a href="https://vaseymultimedia.com" target="_blank" rel="noopener noreferrer">VASEY Multimedia</a>. All rights reserved.<br/>
            Designed &amp; engineered by <a href="https://vasey.ai" target="_blank" rel="noopener noreferrer">VASEY/AI</a>
          </div>
        </footer>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: APPLICATION
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div
      className={`flex h-[100dvh] text-white overflow-hidden relative ${rootBgClasses}`}
    >
      <AmbientField isActive={view === "dashboard"} />

      {/* Ambient Glow — reduced on mobile for Safari perf */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[60px] md:blur-[150px] pointer-events-none" />

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`glass-panel px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl border-l-4 pointer-events-auto ${
              t.type === "error"
                ? "border-l-red-500 text-red-100"
                : t.type === "success"
                  ? "border-l-emerald-500 text-emerald-100"
                  : "border-l-[#F25A38] text-white"
            }`}
          >
            {t.type === "error" ? (
              <AlertCircle className="w-4 h-4" />
            ) : t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#06040a]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r border-indigo-500/10 transform transition-transform duration-300 ease-in-out flex flex-col lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-indigo-500/10 shrink-0 flex justify-between items-center">
          <div className="cursor-pointer group" onClick={goHome}>
            <div className="text-[10px] tracking-[0.25em] text-indigo-400 font-bold mb-1.5 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
              <ChevronLeftCircle className="w-3 h-3" /> RETURN TO HOME
            </div>
            <div className="font-bebas text-3xl tracking-widest flex items-center gap-1.5">
              <BrandLogo className="w-7 h-7 drop-shadow-[0_0_10px_rgba(242,90,56,0.5)]" />
              <span><span className="text-white group-hover:text-indigo-50 transition-colors">00</span><span className="text-[#F25A38] drop-shadow-[0_0_15px_rgba(242,90,56,0.6)]">CLAUDE</span></span>
            </div>
          </div>

          <button
            className="lg:hidden p-2 text-indigo-200/50 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto hide-scrollbar">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "library", label: "Vault Library", icon: BookOpen },
            { id: "ai", label: "Forge with AI", icon: Sparkles },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[0.9rem] ${
                view === item.id
                  ? "bg-indigo-500/20 text-indigo-100 shadow-sm border border-indigo-500/20"
                  : "text-indigo-200/60 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${view === item.id ? "text-[#F25A38]" : ""}`}
              />{" "}
              {item.label}
            </button>
          ))}

          <div className="mt-8 mb-3 px-4 text-xs font-bold tracking-widest text-indigo-400/50 uppercase">
            Filters
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setView("library");
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[0.9rem] ${
              !activeCategory && view === "library"
                ? "bg-indigo-500/20 text-indigo-100 border border-indigo-500/20"
                : "text-indigo-200/60 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <Layers className="w-4 h-4" /> All Categories
            <span className="ml-auto text-xs font-mono opacity-60 bg-black/40 px-2 py-0.5 rounded-md border border-indigo-500/20">
              {docs.length}
            </span>
          </button>

          {Object.entries(CATS).map(([key, cat]) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === key && view === "library";
            const count = docs.filter((d) => d.category === key).length;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveCategory(key);
                  setView("library");
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[0.9rem] ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-100 border border-indigo-500/20"
                    : "text-indigo-200/60 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <CatIcon
                  className="w-4 h-4"
                  style={{ color: isActive ? cat.color : undefined }}
                />{" "}
                {cat.label}
                <span className="ml-auto text-xs font-mono opacity-60 bg-black/40 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-[100dvh]">
        {/* Header Bar */}
        <header className="h-16 glass-panel border-b border-indigo-500/10 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-indigo-200/70 hover:text-white bg-indigo-500/10 rounded-xl border border-indigo-500/20 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/50" />
              <input
                type="text"
                placeholder="Search the vault..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (view !== "library") setView("library");
                }}
                className="w-full bg-black/40 border border-indigo-500/20 text-sm text-indigo-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#F25A38]/50 transition-colors placeholder-indigo-300/30 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/50 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <label className="flex items-center gap-2 px-3 py-2 lg:px-4 text-sm rounded-xl text-indigo-200 hover:text-white hover:bg-indigo-500/20 cursor-pointer transition-all border border-transparent hover:border-indigo-500/30">
              <Upload className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".md,.txt"
                multiple
                onChange={(e) => {
                  handleUploadFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
            <button
              onClick={() => createDoc("agent")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-[#F25A38] hover:bg-[#E04826] transition-all shadow-[0_0_15px_rgba(242,90,56,0.3)]"
            >
              <Plus className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          {/* --- DASHBOARD VIEW --- */}
          {view === "dashboard" && (
            <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 pb-20">
              <div className="mb-8 lg:mb-12">
                <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-white mb-2">
                  System{" "}
                  <span className="text-[#F25A38] drop-shadow-sm">
                    Overview
                  </span>
                </h1>
                <p className="text-indigo-200/60 text-sm md:text-base">
                  Metrics and quick access for your configured protocols.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-5 mb-10">
                {[
                  { label: "TOTAL", value: stats.total, color: "text-white" },
                  {
                    label: "AGENTS",
                    value: stats.agents,
                    color: "text-[#F25A38]",
                  },
                  {
                    label: "SKILLS",
                    value: stats.skills,
                    color: "text-[#8B5CF6]",
                  },
                  {
                    label: "TEMPLATES",
                    value: stats.templates,
                    color: "text-[#14B8A6]",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-5 flex flex-col justify-between h-28 lg:h-32 border-t-indigo-400/10 border-l-indigo-400/10"
                  >
                    <div className="font-bebas text-xs lg:text-sm tracking-widest text-indigo-300/50">
                      {s.label}
                    </div>
                    <div className={`font-bebas text-3xl lg:text-4xl ${s.color}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="font-bebas text-2xl tracking-wide text-indigo-100 mb-4 lg:mb-6">
                Quick Initialize
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-10">
                {Object.entries(CATS).map(([key, cat]) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => createDoc(key)}
                      className="glass-card rounded-2xl p-4 lg:p-5 flex items-center gap-4 text-left group"
                    >
                      <div
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 border border-white/5"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <CatIcon
                          className="w-5 h-5 lg:w-6 lg:h-6"
                          style={{ color: cat.color }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-indigo-100 group-hover:text-white transition-colors">
                          {cat.singular}
                        </div>
                        <div className="text-xs text-indigo-300/50">
                          Create new
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- LIBRARY VIEW --- */}
          {view === "library" && (
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 pb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <h1 className="font-bebas text-4xl tracking-wide text-white">
                    {activeCategory
                      ? CATS[activeCategory].label
                      : "All Vaults"}
                  </h1>
                  <p className="text-indigo-200/60 text-sm mt-1">
                    {filteredDocs.length} documents found
                  </p>
                </div>

                {/* Mobile inline search */}
                <div className="md:hidden relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/50" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-indigo-500/20 text-sm text-indigo-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#F25A38]/50 shadow-inner"
                  />
                </div>
              </div>

              {filteredDocs.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-indigo-500/20 rounded-3xl bg-black/20 mx-2 shadow-inner">
                  <Search className="w-12 h-12 text-indigo-500/30 mb-4" />
                  <h3 className="font-bebas text-2xl text-indigo-200 mb-2">
                    Vault Empty
                  </h3>
                  <p className="text-indigo-300/50 text-sm">
                    No matching protocols found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {filteredDocs.map((doc) => {
                    const cat = CATS[doc.category];
                    const CatIcon = cat.icon;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setEditing(doc);
                          setView("editor");
                        }}
                        className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-[200px] lg:h-[220px]"
                      >
                        <div
                          className="h-1 w-full"
                          style={{
                            background: `linear-gradient(90deg, ${cat.color}, transparent)`,
                          }}
                        />
                        <div className="p-4 lg:p-5 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div
                              className="p-2 rounded-lg border border-white/5"
                              style={{
                                backgroundColor: `${cat.color}15`,
                                color: cat.color,
                              }}
                            >
                              <CatIcon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] lg:text-xs text-indigo-300/50 font-mono">
                              {ago(doc.updatedAt)}
                            </span>
                          </div>

                          <h3 className="font-bold text-base lg:text-lg text-indigo-50 mb-1 line-clamp-1 group-hover:text-[#F25A38] transition-colors">
                            {doc.name}
                          </h3>
                          <p className="text-xs lg:text-sm text-indigo-200/60 line-clamp-2 mb-4 flex-1">
                            {doc.description || "No description provided."}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {doc.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] lg:text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* --- EDITOR VIEW --- */}
          {view === "editor" && editing && (
            <div className="flex flex-col h-full">
              {/* Editor Toolbar */}
              <div className="glass-panel p-2 lg:p-4 flex flex-wrap items-center gap-2 lg:gap-3 border-b border-indigo-500/20 shrink-0 z-20 sticky top-0 bg-[#0a0810]/80">
                <button
                  onClick={() => {
                    saveDoc(editing);
                    setView("library");
                  }}
                  className="p-2 text-indigo-300 hover:text-white rounded-lg hover:bg-indigo-500/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="bg-black/40 border border-indigo-500/20 text-xs text-indigo-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#F25A38]/50 uppercase tracking-widest font-bold hidden sm:block"
                >
                  {Object.entries(CATS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.singular}
                    </option>
                  ))}
                </select>

                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="flex-1 bg-transparent border-none text-base lg:text-lg font-bold text-white focus:outline-none placeholder-indigo-300/40 min-w-[120px] px-1"
                  placeholder="Document Title"
                />

                {/* Mobile View Toggles */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-indigo-500/20 lg:hidden">
                  <button
                    onClick={() => setMobileEditorTab("edit")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider ${
                      mobileEditorTab === "edit"
                        ? "bg-indigo-500/30 text-white"
                        : "text-indigo-300/50"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 inline-block mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setMobileEditorTab("preview")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider ${
                      mobileEditorTab === "preview"
                        ? "bg-indigo-500/30 text-white"
                        : "text-indigo-300/50"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline-block mr-1" /> Preview
                  </button>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(editing.content);
                      showToast("Copied to clipboard", "success");
                    }}
                    className="p-2 text-indigo-300/60 hover:text-white hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Copy content"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([editing.content], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${editing.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast("Downloaded", "success");
                    }}
                    className="p-2 text-indigo-300/60 hover:text-white hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Download .md"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditing({ ...editing, favorite: !editing.favorite });
                      setDocs((p) =>
                        p.map((d) =>
                          d.id === editing.id
                            ? { ...d, favorite: !d.favorite }
                            : d
                        )
                      );
                    }}
                    className="p-2 text-indigo-300/60 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Favorite"
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        editing.favorite ? "fill-amber-400 text-amber-400" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteDoc(editing.id)}
                    className="p-2 text-indigo-300/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => saveDoc(editing)}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium text-white bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 transition-all"
                  >
                    <Save className="w-4 h-4" />{" "}
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>

              {/* Meta Inputs */}
              <div className="p-2 sm:p-3 bg-black/20 border-b border-indigo-500/10 flex flex-col sm:flex-row gap-2 shrink-0">
                <input
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Brief description..."
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-indigo-200/80 focus:outline-none px-2"
                />
                <div className="flex items-center gap-2 px-2 w-full sm:w-[300px]">
                  <FileText className="w-3 h-3 text-indigo-400/50 shrink-0" />
                  <input
                    value={editing.tags.join(", ")}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t),
                      })
                    }
                    placeholder="Tags (comma separated)"
                    className="w-full bg-transparent border-none text-xs text-[#F25A38] focus:outline-none placeholder-indigo-400/40"
                  />
                </div>
              </div>

              {/* Responsive Workspace */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#05040a]/40 shadow-inner">
                {/* Textarea Pane */}
                <div
                  className={`flex-1 flex-col border-r border-indigo-500/10 ${
                    mobileEditorTab === "edit" || mobileEditorTab === "split"
                      ? "flex"
                      : "hidden"
                  }`}
                >
                  <textarea
                    value={editing.content}
                    onChange={(e) =>
                      setEditing({ ...editing, content: e.target.value })
                    }
                    className="md-editor flex-1 bg-transparent text-indigo-100 font-mono text-[13px] sm:text-sm leading-relaxed p-4 sm:p-6 w-full hide-scrollbar"
                    spellCheck={false}
                    placeholder="# System Directives..."
                  />
                </div>

                {/* Preview Pane */}
                <div
                  className={`flex-1 flex-col overflow-y-auto bg-[#0a0812]/60 p-4 sm:p-6 lg:p-10 relative ${
                    mobileEditorTab === "preview" ||
                    mobileEditorTab === "split"
                      ? "flex"
                      : "hidden"
                  }`}
                >
                  <div className="absolute top-3 right-4 lg:top-4 lg:right-6 font-bebas text-xs lg:text-sm tracking-widest text-indigo-400/40">
                    RENDERED
                  </div>
                  <div
                    className="pb-20"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(editing.content),
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- AI GENERATE VIEW --- */}
          {view === "ai" && (
            <div className="max-w-3xl mx-auto p-4 md:p-8 lg:p-12 pb-20">
              <div className="mb-8">
                <h1 className="font-bebas text-4xl lg:text-5xl tracking-wide text-white mb-2 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-[#F25A38]" /> Forge
                </h1>
                <p className="text-indigo-200/60 text-sm lg:text-base">
                  Generate agent instructions and skill pipelines with AI.
                </p>
              </div>

              {/* Type Selector */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                {Object.entries(CATS).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setAiDocType(key)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 border ${
                      aiDocType === key
                        ? "bg-[#F25A38] text-white shadow-[0_0_15px_rgba(242,90,56,0.4)] border-[#F25A38]"
                        : "glass-panel text-indigo-300/70 hover:text-white border-transparent hover:border-indigo-500/30"
                    }`}
                  >
                    {cat.singular}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="glass-card rounded-2xl overflow-hidden mb-8 shadow-2xl border-indigo-500/20">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={`Describe the ${CATS[aiDocType].singular.toLowerCase()} requirements...\n\ne.g., "Create a frontend architect focused on Tailwind defaults and React performance."`}
                  className="w-full h-32 lg:h-40 bg-black/20 p-5 text-sm lg:text-base text-white focus:outline-none resize-none placeholder-indigo-300/30 md-editor"
                />
                <div className="bg-[#0b0a12] p-3 lg:p-4 border-t border-indigo-500/20 flex justify-between items-center">
                  <span className="text-[10px] lg:text-xs text-indigo-400/50 font-mono flex items-center gap-2">
                    <Wand2 className="w-3 h-3" /> AI ASSIST
                  </span>
                  <button
                    onClick={generateAI}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs lg:text-sm font-bold tracking-wider uppercase transition-all ${
                      aiLoading || !aiPrompt.trim()
                        ? "bg-indigo-500/10 text-indigo-400/30 cursor-not-allowed border border-transparent"
                        : "bg-[#F25A38] text-white hover:bg-[#E04826] hover:shadow-[0_0_20px_rgba(242,90,56,0.5)] border border-[#F25A38]"
                    }`}
                  >
                    {aiLoading ? (
                      <span className="animate-pulse">Forging...</span>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>

              {/* Result Area */}
              {aiResult && (
                <div className="glass-panel rounded-2xl p-4 lg:p-6 border border-[#F25A38]/40 shadow-2xl bg-black/40">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-indigo-500/20">
                    <h3 className="font-bebas text-xl text-[#F25A38] tracking-widest drop-shadow-[0_0_8px_rgba(242,90,56,0.3)]">
                      OUTPUT PREVIEW
                    </h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiResult);
                          showToast("Copied to clipboard");
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/20 transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          const titleMatch = aiResult.match(/^#\s+(.+)$/m);
                          const doc: Doc = {
                            id: uid(),
                            name: titleMatch
                              ? titleMatch[1]
                              : `Generated ${CATS[aiDocType].singular}`,
                            category: aiDocType,
                            description: "AI Generated",
                            content: aiResult,
                            tags: ["ai-generated"],
                            favorite: false,
                            createdAt: now(),
                            updatedAt: now(),
                            version: 1,
                          };
                          setDocs((p) => [doc, ...p]);
                          setAiResult("");
                          setAiPrompt("");
                          setView("library");
                          setActiveCategory(aiDocType);
                          showToast("Added to Vault", "success");
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F25A38]/20 text-[#F25A38] hover:bg-[#F25A38]/30 border border-[#F25A38]/30 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div
                    className="text-sm text-indigo-100"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(aiResult),
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
