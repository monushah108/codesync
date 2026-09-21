"use client";

import { ReactNode, useEffect, useState } from "react";
import VSCodeTitleBar from "./VSCodeTitleBar";
import VSCodeSidebar from "./VSCodeSidebar";
import VSCodeTabs from "./VSCodeTabs";

interface VSCodeWindowProps {
  activeFile: "login.tsx" | "signup.tsx";
  children: ReactNode;
}

export default function VSCodeWindow({
  activeFile,
  children,
}: VSCodeWindowProps) {
  // Desktop defaults to open, mobile starts closed so the form is visible immediately
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Open explorer sidebar automatically on tablet and desktop screens
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4] font-sans antialiased select-text">
      {/* 1. VS Code Clean Top Header */}
      <VSCodeTitleBar
        activeFile={activeFile}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* 2. Main Workbench (Explorer + Editor) */}
      <div className="relative flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Explorer Sidebar & Mobile Drawer */}
        <VSCodeSidebar
          activeFile={activeFile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Editor Area */}
        <main className="flex flex-1 min-w-0 flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Editor Tabs & Breadcrumbs */}
          <VSCodeTabs activeFile={activeFile} />

          {/* Editor Buffer / Form Body */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-[#1e1e1e]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
