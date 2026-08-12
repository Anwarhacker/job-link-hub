"use client";

import { useEffect } from "react";

export const VisitorTracker: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if session has already been logged
    const sessionTracked = sessionStorage.getItem("app_session_tracked");
    if (sessionTracked) return;

    let isNewVisitor = false;
    const visitorId = localStorage.getItem("app_visitor_id");
    if (!visitorId) {
      isNewVisitor = true;
      localStorage.setItem("app_visitor_id", `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    }

    fetch("/api/stats/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isNewVisitor }),
    })
      .then(() => {
        sessionStorage.setItem("app_session_tracked", "true");
      })
      .catch((err) => console.error("Visitor track error:", err));
  }, []);

  return null;
};
