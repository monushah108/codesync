import {
  FolderOpen,
  Users,
  UserCheck,
  Clock,
  ExternalLink,
  UserPlus,
  Pencil,
  Copy,
  Share2,
  LogOut,
} from "lucide-react";

export const INITIAL_ROOMS = [
  {
    id: "1",
    name: "Frontend Interview",
    language: "JavaScript",
    languageColor: "#EAB308",
    members: [
      { name: "Monu", initials: "MO", color: "#6366F1" },
      { name: "Rahul", initials: "RA", color: "#8B5CF6" },
      { name: "Aman", initials: "AM", color: "#22C55E" },
    ],
    lastOpened: "2 minutes ago",
  },
  {
    id: "2",
    name: "API Design Review",
    language: "TypeScript",
    languageColor: "#3B82F6",
    members: [
      { name: "Priya", initials: "PR", color: "#EC4899" },
      { name: "Dev", initials: "DE", color: "#F59E0B" },
    ],
    lastOpened: "Yesterday",
  },
  {
    id: "3",
    name: "System Design — LLD",
    language: "Python",
    languageColor: "#38BDF8",
    members: [
      { name: "Monu", initials: "MO", color: "#6366F1" },
      { name: "Kiran", initials: "KI", color: "#14B8A6" },
      { name: "Raj", initials: "RA", color: "#F97316" },
      { name: "Nisha", initials: "NI", color: "#A855F7" },
      { name: "Arjun", initials: "AR", color: "#06B6D4" },
    ],
    lastOpened: "3 days ago",
  },
  {
    id: "4",
    name: "React Architecture",
    language: "TypeScript",
    languageColor: "#3B82F6",
    members: [
      { name: "Monu", initials: "MO", color: "#6366F1" },
      { name: "Sahil", initials: "SA", color: "#10B981" },
    ],
    lastOpened: "Last week",
  },
  {
    id: "5",
    name: "DSA Practice",
    language: "C++",
    languageColor: "#F43F5E",
    members: [
      { name: "Aman", initials: "AM", color: "#22C55E" },
      { name: "Monu", initials: "MO", color: "#6366F1" },
      { name: "Vivek", initials: "VI", color: "#FB923C" },
    ],
    lastOpened: "2 weeks ago",
  },
];

export const cards = [
  {
    label: "Rooms Created",
    value: "18",
    sub: "+3 this week",
    icon: FolderOpen,
    accent: "#6366F1",
    glow: "rgba(99,102,241,0.18)",
    iconBg: "rgba(99,102,241,0.12)",
    subColor: "#818CF8",
  },
  {
    label: "Active Collaborations",
    value: "6",
    sub: "2 in progress",
    icon: Users,
    accent: "#8B5CF6",
    glow: "rgba(139,92,246,0.15)",
    iconBg: "rgba(139,92,246,0.12)",
    subColor: "#A78BFA",
  },
  {
    label: "Team Members",
    value: "42",
    sub: "+4 this month",
    icon: UserCheck,
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.12)",
    iconBg: "rgba(34,197,94,0.1)",
    subColor: "#4ADE80",
  },
  {
    label: "Last Opened",
    value: "2h ago",
    sub: "Frontend Interview",
    icon: Clock,
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.12)",
    iconBg: "rgba(245,158,11,0.1)",
    subColor: "#FCD34D",
  },
];

export const ROW_ACTIONS = [
  { icon: <ExternalLink size={12} />, label: "Open Room" },
  { icon: <LogOut size={12} />, label: "leave room" },
  { icon: <Pencil size={12} />, label: "Rename" },

  { icon: <Share2 size={12} />, label: "Share Link" },
];

export const SORT_OPTS = [
  { value: "recent", label: "Recently Opened" },
  { value: "name", label: "Name (A–Z)" },
  { value: "members", label: "Most Members" },
];

export const TAGS = [
  "locked-in",
  "grind",
  "cookin",
  "brainstorm",
  "ship-it",
  "bug-hunt",
  "focus",
  "pair",
  "chaos",
  "study",
  "challenge",
  "night-owl",
];

export const TAGS_COLORS = {
  "locked-in": {
    bg: "rgba(59,130,246,0.14)",
    text: "#60A5FA",
    dot: "#3B82F6",
  },
  grind: {
    bg: "rgba(245,158,11,0.14)",
    text: "#FBBF24",
    dot: "#F59E0B",
  },
  cookin: {
    bg: "rgba(249,115,22,0.14)",
    text: "#FB923C",
    dot: "#F97316",
  },
  brainstorm: {
    bg: "rgba(168,85,247,0.14)",
    text: "#C084FC",
    dot: "#A855F7",
  },
  "ship-it": {
    bg: "rgba(16,185,129,0.14)",
    text: "#34D399",
    dot: "#10B981",
  },
  "bug-hunt": {
    bg: "rgba(239,68,68,0.14)",
    text: "#F87171",
    dot: "#EF4444",
  },
  focus: {
    bg: "rgba(14,165,233,0.14)",
    text: "#38BDF8",
    dot: "#0EA5E9",
  },
  pair: {
    bg: "rgba(236,72,153,0.14)",
    text: "#F472B6",
    dot: "#EC4899",
  },
  chaos: {
    bg: "rgba(107,114,128,0.14)",
    text: "#D1D5DB",
    dot: "#6B7280",
  },
  study: {
    bg: "rgba(99,102,241,0.14)",
    text: "#818CF8",
    dot: "#6366F1",
  },
  challenge: {
    bg: "rgba(234,88,12,0.14)",
    text: "#FB923C",
    dot: "#EA580C",
  },
  "night-owl": {
    bg: "rgba(139,92,246,0.14)",
    text: "#A78BFA",
    dot: "#8B5CF6",
  },

  // Extra tags
  urgent: {
    bg: "rgba(220,38,38,0.14)",
    text: "#F87171",
    dot: "#DC2626",
  },
  review: {
    bg: "rgba(6,182,212,0.14)",
    text: "#67E8F9",
    dot: "#06B6D4",
  },
  testing: {
    bg: "rgba(132,204,22,0.14)",
    text: "#BEF264",
    dot: "#84CC16",
  },
  docs: {
    bg: "rgba(124,58,237,0.14)",
    text: "#C4B5FD",
    dot: "#7C3AED",
  },
  refactor: {
    bg: "rgba(217,119,6,0.14)",
    text: "#FCD34D",
    dot: "#D97706",
  },
  deploy: {
    bg: "rgba(5,150,105,0.14)",
    text: "#6EE7B7",
    dot: "#059669",
  },
  design: {
    bg: "rgba(236,72,153,0.14)",
    text: "#F9A8D4",
    dot: "#EC4899",
  },
  backend: {
    bg: "rgba(34,197,94,0.14)",
    text: "#86EFAC",
    dot: "#22C55E",
  },
  frontend: {
    bg: "rgba(59,130,246,0.14)",
    text: "#93C5FD",
    dot: "#2563EB",
  },
  database: {
    bg: "rgba(20,184,166,0.14)",
    text: "#5EEAD4",
    dot: "#14B8A6",
  },
};
