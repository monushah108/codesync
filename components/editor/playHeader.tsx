"use client";

import { Binary, PanelBottomOpen, PanelLeftOpen } from "lucide-react";

import { Button } from "../ui/button";
import { useLayout } from "@/context/layout-context";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import ShowAlert from "./ui/showAlert";

export default function PlayHeader() {
  const { toggle } = useLayout();

  const members = useExplorerstore((s) => s.members);

  const roomFull = members.length > 3;

  return (
    <>
      <div className="h-10 text-[#d4d4d4] shrink-0 bg-[#323233] border-b border-[#2d2d30] flex items-center justify-between px-3 py-4">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="group md:flex items-center gap-1 hidden hover:bg-blue-400/50 px-2 py-2">
            <Binary className="size-5 text-blue-500 group-hover:text-blue-700" />

            <span className="group-hover:flex hidden font-semibold text-blue-600 group-hover:text-blue-800">
              codesync
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            onClick={() => toggle("explorer")}
            variant="ghost"
            size="xs"
            className="hover:bg-[#3a3a3d] text-[#d4d4d4]"
          >
            <PanelLeftOpen className="size-4" />
          </Button>

          <Button
            onClick={() => toggle("terminal")}
            variant="ghost"
            size="xs"
            className="hover:bg-[#3a3a3d] text-[#d4d4d4]"
          >
            <PanelBottomOpen className="size-4" />
          </Button>
        </div>
      </div>
      <ShowAlert
        open={roomFull}
        desc={
          "This room already has 3 members. You can't join this room right now"
        }
        reason={"room is full"}
      />
    </>
  );
}
