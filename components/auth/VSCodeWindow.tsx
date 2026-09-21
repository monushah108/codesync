"use client";

import { ReactNode, useState } from "react";
import VSCodeTitleBar from "./VSCodeTitleBar";
import VSCodeActivityBar from "./VSCodeActivityBar";
import VSCodeSidebar from "./VSCodeSidebar";
import VSCodeTabs from "./VSCodeTabs";
import VSCodeStatusBar from "./VSCodeStatusBar";

interface VSCodeWindowProps {
  activeFile: "login.tsx" | "signup.tsx";
  children: ReactNode;
}

export default function VSCodeWindow({
  activeFile,
  children,
}: VSCodeWindowProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4] font-sans antialiased select-text">
      {/* 1. VS Code Titlebar */}
      <VSCodeTitleBar
        activeFile={activeFile}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* 2. Main Workbench (Activity Bar + Sidebar + Editor) */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Activity Bar */}
        <VSCodeActivityBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Explorer Sidebar */}
        {isSidebarOpen && <VSCodeSidebar activeFile={activeFile} />}

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

      {/* 3. VS Code Status Bar */}
      <VSCodeStatusBar />
    </div>
  );
}
