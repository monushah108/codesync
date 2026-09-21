import { useMemo, useState } from "react";

import { VirtualFileSystem } from "@/lib/features";
import { useSandpack, SandpackPreview as SandpackPreviewComponent, SandpackLayout } from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink, Link2Off, Lock, Maximize2, Minimize2, RefreshCw, Terminal } from "lucide-react";

import { useSandboxConsole } from "./sandpackPreview";
import BottomDrawer from "../preview/ui/bottomDrawer";
interface PreviewUIProps {
    vfs: VirtualFileSystem;
    isFullScreen: boolean;
    onToggleFullScreen: () => void;
    onDisconnect: () => void;
}

export default function PreviewUI({
    vfs,
    isFullScreen,
    onToggleFullScreen,
    onDisconnect,
}: PreviewUIProps) {
    const { sandpack } = useSandpack();
    const [showDrawer, setShowDrawer] = useState(false);

    // Address bar route
    const defaultRoute = vfs.htmlFiles[0] ?? "/index.html";
    const [currentRoute, setCurrentRoute] = useState(defaultRoute);

    // Console logs for error badge
    const { logs, clear: clearLogs } = useSandboxConsole();

    const handleRefresh = () => {
        clearLogs();
        sandpack.runSandpack();
    };

    const errorCount = useMemo(
        () => logs.filter((l) => l.method === "error").length,
        [logs]
    );



    return (
        <div className="flex h-full w-full min-h-0 flex-1 flex-col overflow-hidden bg-[#181818] select-none">
            {/* ---------------- 1. Top Header ---------------- */}
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-[#cccccc]">Preview</span>

                    <span className="flex items-center gap-1 rounded bg-[#1e1e1e] px-1.5 py-0.5 text-[10px] text-[#858585]">
                        <span
                            className={`size-1.5 rounded-full ${sandpack.error
                                ? "bg-red-500"
                                : sandpack.status === "running" || sandpack.status === "idle"
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-yellow-500"
                                }`}
                        />
                        {sandpack.error ? "Error" : sandpack.status === "running" ? "Running" : sandpack.status}
                    </span>

                    <span className="hidden sm:inline-flex items-center rounded border border-[#3c3c3c] bg-[#1e1e1e] px-1.5 py-0.2 text-[10px] uppercase tracking-wider text-[#9d9d9d]">
                        {vfs.template}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Terminal / Console Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        title={showDrawer ? "Hide Terminal / Console" : "Open Terminal & Console"}
                        className={`size-7 rounded-sm transition-colors ${showDrawer
                            ? "bg-[#007acc] text-white hover:bg-[#006bb3]"
                            : "text-[#858585] hover:bg-[#333333] hover:text-white"
                            }`}
                        onClick={() => setShowDrawer((prev) => !prev)}
                    >
                        <div className="relative">
                            <Terminal className="size-3.5" />
                            {errorCount > 0 && !showDrawer && (
                                <span className="absolute -top-1 -right-1 flex size-2 items-center justify-center rounded-full bg-red-500 text-[8px] text-white" />
                            )}
                        </div>
                    </Button>

                    {/* Full Screen Mode */}
                    <Button
                        variant="ghost"
                        size="icon"
                        title={isFullScreen ? "Exit Fullscreen (Esc)" : "Expand to Full Screen"}
                        className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
                        onClick={onToggleFullScreen}
                    >
                        {isFullScreen ? (
                            <Minimize2 className="size-3.5" />
                        ) : (
                            <Maximize2 className="size-3.5" />
                        )}
                    </Button>

                    {/* Refresh */}
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Refresh Preview"
                        className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="size-3.5" />
                    </Button>

                    {/* Disconnect */}
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Disconnect Preview"
                        className="size-7 rounded-sm text-[#858585] hover:bg-red-500/10 hover:text-red-400"
                        onClick={onDisconnect}
                    >
                        <Link2Off className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* ---------------- 2. Browser Navigation Bar ---------------- */}
            <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-[#2d2d30] bg-[#1f1f1f] px-2">
                <Button
                    variant="ghost"
                    size="icon"
                    title="Back"
                    className="size-7 shrink-0 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-[#cccccc]"
                    onClick={() => {
                        const iframe = document.querySelector("iframe");
                        iframe?.contentWindow?.history.back();
                    }}
                >
                    <ArrowLeft className="size-3.5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    title="Forward"
                    className="size-7 shrink-0 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-[#cccccc]"
                    onClick={() => {
                        const iframe = document.querySelector("iframe");
                        iframe?.contentWindow?.history.forward();
                    }}
                >
                    <ArrowRight className="size-3.5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    title="Reload"
                    className="size-7 shrink-0 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-[#cccccc]"
                    onClick={handleRefresh}
                >
                    <RefreshCw className="size-3.5" />
                </Button>

                {/* Address Route Display & Selector */}
                <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#333333] bg-[#181818] px-2.5">
                    <Lock className="size-3 shrink-0 text-[#666666]" />

                    {vfs.htmlFiles.length > 1 ? (
                        <select
                            value={currentRoute}
                            onChange={(e) => {
                                const target = e.target.value;
                                setCurrentRoute(target);
                                sandpack.setActiveFile(target);
                            }}
                            className="flex-1 bg-transparent text-xs text-[#cccccc] outline-none cursor-pointer"
                        >
                            {vfs.htmlFiles.map((htmlPath) => (
                                <option key={htmlPath} value={htmlPath} className="bg-[#252526] text-white">
                                    preview{htmlPath}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="truncate text-xs text-[#858585]">
                            preview{currentRoute}
                        </span>
                    )}
                </div>

                {/* Open in new window */}
                <Button
                    variant="ghost"
                    size="icon"
                    title="Open preview in new tab"
                    className="size-7 shrink-0 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-[#cccccc]"
                    onClick={() => {
                        const iframe = document.querySelector("iframe");
                        if (iframe?.src) {
                            window.open(iframe.src, "_blank", "noopener,noreferrer");
                        }
                    }}
                >
                    <ExternalLink className="size-3.5" />
                </Button>
            </div>

            {/* ---------------- 3. Main Viewport & Preview Frame ---------------- */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
                <SandpackLayout
                    className="!h-full !w-full !border-0 !rounded-none min-h-0 flex-1 flex flex-col"
                    style={{ height: "100%", width: "100%", border: "none" }}
                >
                    <SandpackPreviewComponent
                        showOpenInCodeSandbox={false}
                        showRefreshButton={false}
                        showNavigator={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            flex: 1,
                        }}
                    />
                </SandpackLayout>
            </div>

            {/* ---------------- 4. Bottom Drawer (Terminal & DevTools Console) ---------------- */}
            <BottomDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} vfs={vfs} />
        </div>
    );
}