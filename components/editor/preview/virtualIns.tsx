"use client";

import { useState } from "react";

import { VirtualFileSystem } from "@/lib/features";

import { Button } from "@/components/ui/button";

import { Search, Copy, Code2, Check } from "lucide-react";

/**
 * Inspector component showing all mounted virtual files, sizes, template, and dependencies
 */
export default function VirtualFSInspector({ vfs }: { vfs: VirtualFileSystem }) {
    const [copiedPath, setCopiedPath] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    const handleCopy = (path: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedPath(path);
        setTimeout(() => setCopiedPath(null), 1500);
    };

    const fileEntries = Object.entries(vfs.files).filter(([path]) =>
        path.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex-1 min-h-0 flex flex-col font-mono text-xs bg-[#181818]">
            {/* VFS Header Info */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#2d2d30] bg-[#202020] px-3 py-1.5 text-[11px]">
                <div className="flex items-center gap-3">
                    <span className="text-[#858585]">
                        Template: <strong className="text-white uppercase">{vfs.template}</strong>
                    </span>
                    <span className="text-[#858585]">
                        Files: <strong className="text-white">{vfs.totalFiles}</strong>
                    </span>
                    <span className="text-[#858585]">
                        Size: <strong className="text-white">{vfs.totalBytes} bytes</strong>
                    </span>
                </div>

                <div className="flex items-center gap-1 rounded bg-[#181818] border border-[#333333] px-2 py-0.5 text-[11px]">
                    <Search className="size-3 text-[#666666]" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search VFS files..."
                        className="w-28 sm:w-36 bg-transparent outline-none text-[#cccccc] placeholder:text-[#555555]"
                    />
                </div>
            </div>

            {/* Dependencies badge bar */}
            {Object.keys(vfs.dependencies).length > 0 && (
                <div className="flex items-center gap-1.5 border-b border-[#252526] px-3 py-1 bg-[#161616] text-[10px] overflow-x-auto">
                    <span className="text-[#858585]">Dependencies:</span>
                    {Object.entries(vfs.dependencies).map(([pkg, ver]) => (
                        <span
                            key={pkg}
                            className="rounded bg-[#252526] px-1.5 py-0.5 text-[#3794ff] border border-[#333333]"
                        >
                            {pkg}@{ver}
                        </span>
                    ))}
                </div>
            )}

            {/* File List */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#232323]">
                {fileEntries.length === 0 ? (
                    <div className="p-4 text-center text-[#666666]">
                        No matching virtual files found.
                    </div>
                ) : (
                    fileEntries.map(([path, file]) => (
                        <div
                            key={path}
                            className="flex items-center justify-between px-3 py-1.5 hover:bg-[#202020] transition-colors"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Code2 className="size-3.5 text-[#007acc] shrink-0" />
                                <span className="text-[#cccccc] font-medium truncate">{path}</span>
                                {file.isSynthesized && (
                                    <span className="rounded bg-yellow-500/10 border border-yellow-500/30 px-1 text-[9px] text-yellow-400">
                                        Auto Synthesized
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-[#666666]">
                                    {file.code.length} bytes
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    title="Copy file code"
                                    className="size-6 text-[#858585] hover:text-white"
                                    onClick={() => handleCopy(path, file.code)}
                                >
                                    {copiedPath === path ? (
                                        <Check className="size-3 text-green-400" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}