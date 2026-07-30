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

// Language badge colours

export const ROW_ACTIONS = [
  { icon: <ExternalLink size={12} />, label: "Open Room" },
  { icon: <UserPlus size={12} />, label: "Invite Members" },
  { icon: <Pencil size={12} />, label: "Rename" },
  { icon: <Copy size={12} />, label: "Duplicate" },
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
