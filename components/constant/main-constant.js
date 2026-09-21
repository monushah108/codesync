import { Shuffle, UserPlus, Bot, Shield, Search, Code2 } from "lucide-react";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";
export const Steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your free account in seconds. No credit card required. Choose your preferred programming languages and skill level.",
  },
  {
    number: "02",
    icon: Search,
    title: "Find a Partner",
    description:
      "Match with a random developer, invite a friend, or request an AI assistant. Get paired based on your language and availability.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Code Together with AI",
    description:
      "Start coding in real-time with your partner. Get AI-powered suggestions, share screens, and build amazing projects together.",
  },
];

export const Featuresprops = [
  {
    icon: Shuffle,
    title: "Pair with Random Developers",
    description:
      "Match with developers worldwide based on your programming language and skill level. Expand your network and learn new approaches.",
    color: "blue",
  },
  {
    icon: UserPlus,
    title: "Invite Friends",
    description:
      "Collaborate seamlessly with your team. Share private session links and work together in real-time on any project.",
    color: "purple",
  },
  {
    icon: Bot,
    title: "Code with AI",
    description:
      "Get intelligent suggestions and pair with an AI assistant that understands your code. Debug faster and learn best practices.",
    color: "indigo",
  },
  {
    icon: Shield,
    title: "Secure Real-Time",
    description:
      "End-to-end encrypted sessions with enterprise-grade security. Your code stays private and protected at all times.",
    color: "green",
  },
];

export const NavItems = ["Features", "How it works", "Testimonials", "Demo"];

export const FooterLinks = {
  product: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Community", href: "#" },
  ],
};

export const SocialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    avatar:
      "https://images.unsplash.com/photo-1573495628363-7114730a4a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNvZnR3YXJlJTIwZW5naW5lZXJ8ZW58MXx8fHwxNzYwOTQwMTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "codesync has transformed how our team collaborates. The real-time coding is seamless, and the AI assistant helps us catch issues early. Highly recommend!",
    rating: 5,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupHub",
    avatar:
      "https://images.unsplash.com/photo-1634133472760-e5c2bd346787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZ3JhbW1lciUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDk4NDYzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "I've learned more in a month of pair programming sessions than I did in a year coding solo. The community is incredible, and matching with random devs is always exciting.",
    rating: 5,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Aisha Patel",
    role: "Software Architect",
    company: "CloudScale",
    avatar:
      "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA5ODAwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote:
      "The security features are enterprise-grade. We use it for onboarding new developers and code reviews. It's become an essential part of our workflow.",
    rating: 5,
    gradient: "from-indigo-500 to-purple-500",
  },
];


export const CODE_FILES = {
  "CollabRoom.tsx": {
    fileName: "CollabRoom.tsx",
    lang: "typescript",
    code: [
      {
        num: 1,
        tokens: [
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { useMultiplayer, useAI } ", color: "text-slate-800 dark:text-slate-200" },
          { text: "from", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: ' "@codesync/core"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: ";", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { Editor } ", color: "text-slate-800 dark:text-slate-200" },
          { text: "from", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: ' "@codesync/monaco"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: ";", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 3,
        tokens: [{ text: "", color: "text-transparent" }],
      },
      {
        num: 4,
        tokens: [
          { text: "export default function", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " LiveWorkspace", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: "({ roomId }: { roomId: ", color: "text-slate-800 dark:text-slate-200" },
          { text: "string", color: "text-amber-600 dark:text-amber-400" },
          { text: " }) {", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  const", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { peers, syncStatus } = ", color: "text-slate-800 dark:text-slate-200" },
          { text: "useMultiplayer", color: "text-cyan-600 dark:text-cyan-400 font-medium" },
          { text: "(roomId);", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "  const", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { copilotSuggest } = ", color: "text-slate-800 dark:text-slate-200" },
          { text: "useAI", color: "text-indigo-600 dark:text-indigo-400 font-medium" },
          { text: "({ model: ", color: "text-slate-800 dark:text-slate-200" },
          { text: '"claude-3.5-sonnet"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: " });", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 7,
        tokens: [{ text: "", color: "text-transparent" }],
      },
      {
        num: 8,
        tokens: [
          { text: "  return", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " (", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "    <", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.SyncRoom", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: " presence=", color: "text-purple-600 dark:text-purple-300" },
          { text: "{peers}", color: "text-amber-600 dark:text-amber-300" },
          { text: " latency=", color: "text-purple-600 dark:text-purple-300" },
          { text: '"<15ms"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: ">", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "      <", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.MultiCursor", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: " showNametags=", color: "text-purple-600 dark:text-purple-300" },
          { text: "{true}", color: "text-amber-600 dark:text-amber-400" },
          { text: " />", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 11,
        tokens: [
          { text: "      <", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.InlineAI", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: " onTabAccept=", color: "text-purple-600 dark:text-purple-300" },
          { text: "{copilotSuggest}", color: "text-indigo-600 dark:text-indigo-300" },
          { text: " />", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 12,
        tokens: [
          { text: "    </", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.SyncRoom", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: ">", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 13,
        tokens: [
          { text: "  );", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 14,
        tokens: [
          { text: "}", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
    ],
  },
  "ai-copilot.py": {
    fileName: "ai-copilot.py",
    lang: "python",
    code: [
      {
        num: 1,
        tokens: [
          { text: "from", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " codesync.agents ", color: "text-slate-800 dark:text-slate-200" },
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " PairProgrammer", color: "text-blue-600 dark:text-blue-400 font-medium" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " asyncio, websockets", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 3,
        tokens: [{ text: "", color: "text-transparent" }],
      },
      {
        num: 4,
        tokens: [
          { text: "async def", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " orchestrate_pairing", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: "(session_id: ", color: "text-slate-800 dark:text-slate-200" },
          { text: "str", color: "text-amber-600 dark:text-amber-400" },
          { text: "):", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "    agent = ", color: "text-slate-800 dark:text-slate-200" },
          { text: "PairProgrammer", color: "text-cyan-600 dark:text-cyan-400 font-medium" },
          { text: '(name="CodeSync-AI", mode="autonomous")', color: "text-emerald-600 dark:text-emerald-400" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "    await", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " agent.connect_crdt_mesh(session_id)", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "    print", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: '("✓ AI Copilot synced to peer room in 8ms")', color: "text-emerald-600 dark:text-emerald-400" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "    return", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " agent.stream_suggestions()", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
    ],
  },
};