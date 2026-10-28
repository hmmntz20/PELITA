"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AiChatPanel } from "@/components/ai-chat-panel";
import { TopNav } from "@/components/top-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  // Derive section and page for TopNav breadcrumb
  let pageName = "Dashboard";
  if (pathname.includes("/schedule")) pageName = "Schedule";
  else if (pathname.includes("/finance")) pageName = "Finance";
  else if (pathname.includes("/nutrition")) pageName = "Nutrition";
  else if (pathname.includes("/settings")) pageName = "Settings";

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const calculatedWidth = window.innerWidth - e.clientX;
      // Clamp between 400px minimal width and 750px
      const clamped = Math.max(400, Math.min(750, calculatedWidth));
      setChatWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* 220px Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
        <TopNav
          section="Workspace"
          page={pageName}
          chatOpen={chatOpen}
          onToggleChat={() => setChatOpen((prev) => !prev)}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      {/* Resizable AI Chat Panel (Default 359px) */}
      {chatOpen && (
        <AiChatPanel
          width={chatWidth}
          onResizeStart={handleResizeStart}
          isResizing={isResizing}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
