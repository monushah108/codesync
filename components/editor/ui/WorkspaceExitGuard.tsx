"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import WorkspaceConfirmModal from "./WorkspaceConfirmModal";

interface WorkspaceExitGuardProps {
  roomId?: string;
}

export default function WorkspaceExitGuard({ roomId }: WorkspaceExitGuardProps) {
  const router = useRouter();
  const showConfirmModal = useLayoutstore((s) => s.showConfirmModal);

  useEffect(() => {
    // 1. Native Browser beforeunload guard
    // Stops accidental tab close, browser window close, or browser refresh button
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Skip guard if a force navigation is in progress (e.g. kicked/banned redirect)
      if (useLayoutstore.getState().isForceNavigating) return;
      e.preventDefault();
      e.returnValue = "Changes you made may not be saved.";
      return "Changes you made may not be saved.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2. Intercept keyboard reload shortcuts (F5, Ctrl+R, Cmd+R)
    // Shows our custom VS Code confirmation box instead of letting the browser reload
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip guard if a force navigation is in progress (e.g. kicked/banned redirect)
      if (useLayoutstore.getState().isForceNavigating) return;
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isF5 = e.key === "F5";
      const isCtrlR = isCtrlOrCmd && e.key.toLowerCase() === "r";

      if (isF5 || isCtrlR) {
        e.preventDefault();
        e.stopPropagation();

        showConfirmModal({
          type: "reload",
          title: "Reload Workspace?",
          description:
            "Reloading the page will refresh all editor panels, restart terminal sessions, and re-establish real-time synchronization.",
          confirmText: "Reload Workspace",
          cancelText: "Stay in Workspace",
          warningNote: "Unsaved code buffers and active terminal history will be reloaded.",
          onConfirm: () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.location.reload();
          },
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    // 3. Intercept in-app link clicks that would navigate away from this workspace
    const handleAnchorClick = (e: MouseEvent) => {
      // Skip guard if a force navigation is in progress (e.g. kicked/banned redirect)
      if (useLayoutstore.getState().isForceNavigating) return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;

      // Ignore download anchors, blob URLs, and data URLs so file downloads work normally
      if (
        anchor.hasAttribute("download") ||
        Boolean(anchor.download) ||
        anchor.href.startsWith("blob:") ||
        anchor.href.startsWith("data:")
      ) {
        return;
      }

      try {
        const url = new URL(anchor.href, window.location.origin);

        // Also check URL protocol
        if (url.protocol === "blob:" || url.protocol === "data:") {
          return;
        }

        const isCurrentPlayground = roomId
          ? url.pathname.includes(`/playground/${roomId}`)
          : url.pathname.startsWith("/playground");

        // If target is internal to the application but leaving this workspace
        if (url.origin === window.location.origin && !isCurrentPlayground) {
          e.preventDefault();
          e.stopPropagation();

          showConfirmModal({
            type: "leave",
            title: "Leave Workspace?",
            description:
              "Are you sure you want to leave CodeSync and return to the dashboard? Your active session will be disconnected.",
            confirmText: "Leave Workspace",
            cancelText: "Stay in Workspace",
            warningNote: "Collaborative edits and active running processes will be exited.",
            onConfirm: () => {
              window.removeEventListener("beforeunload", handleBeforeUnload);
              router.push(url.pathname + url.search);
            },
          });
        }
      } catch {
        // Ignore invalid URL
      }
    };

    document.addEventListener("click", handleAnchorClick, true);

    // 4. Intercept browser back/forward buttons (popstate)
    // Push a dummy history state so pressing browser 'Back' is trapped
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Skip guard if a force navigation is in progress (e.g. kicked/banned redirect)
      if (useLayoutstore.getState().isForceNavigating) return;
      // Re-push history entry so page stays on the playground while dialog is open
      window.history.pushState(null, "", window.location.href);

      showConfirmModal({
        type: "leave",
        title: "Leave Workspace?",
        description:
          "You used the browser navigation to exit this workspace. Do you want to leave and return to the previous page?",
        confirmText: "Leave Workspace",
        cancelText: "Stay in Workspace",
        warningNote: "Your connection to this collaborative workspace will be terminated.",
        onConfirm: () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
          window.history.back();
        },
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [roomId, router, showConfirmModal]);

  return <WorkspaceConfirmModal />;
}
