export const IDLE_TIMEOUT_MS = 4000;
export const IDLE_CHECK_INTERVAL_MS = 1000;

// Dynamically generate pure CSS styles for remote cursors and selection ranges
export function updateRemoteCursorStyles(
  awareness: any,
  activityMap: Map<number, { signature: string; lastActiveAt: number }>,
) {
  if (typeof document === "undefined" || !awareness) return;

  let styleEl = document.getElementById("yjs-cursor-styles") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "yjs-cursor-styles";
    document.head.appendChild(styleEl);
  }

  const myId = awareness.clientID;
  const now = Date.now();
  let css = "";

  awareness.getStates().forEach((state: any, clientId: number) => {
    if (clientId === myId) return;

    const user = state.user;
    const color = user?.color || "#3b82f6";
    const name = user?.name || "Collaborator";

    // Track cursor activity for idle detection
    const signature = JSON.stringify(state.selection ?? null);
    const prev = activityMap.get(clientId);

    if (!prev || prev.signature !== signature) {
      activityMap.set(clientId, { signature, lastActiveAt: now });
    }

    const lastActiveAt = activityMap.get(clientId)?.lastActiveAt ?? now;
    const isIdle = now - lastActiveAt > IDLE_TIMEOUT_MS;
    const opacity = isIdle ? "0.35" : "1";
    const zIndex = isIdle ? "10" : "100";

    const safeName = name.replace(/["\\]/g, "");

    css += `
.yRemoteSelection-${clientId} {
  background-color: ${color}33 !important;
}
.yRemoteSelectionHead-${clientId} {
  position: absolute !important;
  border-left: 2px solid ${color} !important;
  height: 100% !important;
  box-sizing: border-box !important;
  opacity: ${opacity} !important;
  transition: opacity 200ms ease !important;
  z-index: ${zIndex} !important;
  pointer-events: none !important;
}
.yRemoteSelectionHead-${clientId}::after {
  content: "${safeName}" !important;
  position: absolute !important;
  top: -19px !important;
  left: -2px !important;
  font-size: 10px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-weight: 500 !important;
  background-color: ${color} !important;
  color: #ffffff !important;
  padding: 1px 5px !important;
  border-radius: 3px !important;
  white-space: nowrap !important;
  pointer-events: none !important;
  line-height: normal !important;
  z-index: ${zIndex} !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  opacity: ${opacity} !important;
  transition: opacity 200ms ease !important;
}
`;
  });

  styleEl.textContent = css;
}

export function clearRemoteCursorStyles() {
  if (typeof document === "undefined") return;
  const styleEl = document.getElementById("yjs-cursor-styles");
  if (styleEl) {
    styleEl.textContent = "";
  }
}
