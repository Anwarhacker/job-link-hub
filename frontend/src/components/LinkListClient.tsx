"use client";

import React, { useEffect, useState } from "react";
import { LinkList } from "./LinkList";
import { LinkDTO } from "@/models/Link";

export const LinkListClient: React.FC = () => {
  const [links, setLinks] = useState<LinkDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinks() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/links");
        if (!res.ok) {
          throw new Error("Failed to load links");
        }
        const data = await res.json();
        setLinks(data);
      } catch (err: unknown) {
        console.error("Fetch links error:", err);
        setError(err instanceof Error ? err.message : "Error loading links");
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  return <LinkList links={links} loading={loading} error={error} />;
};
