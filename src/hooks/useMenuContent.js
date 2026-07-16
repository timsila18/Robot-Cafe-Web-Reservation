import { useEffect, useState } from "react";
import { getMenuCategories, getMenuItems, normalizeMenuContent } from "../services/contentService";

const fallback = {
  categories: getMenuCategories(),
  items: getMenuItems(),
};

export function useMenuContent() {
  const [content, setContent] = useState(fallback);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    fetch("/api/content/menu")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load live menu.");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setContent(normalizeMenuContent(data));
        setStatus("loaded");
      })
      .catch(() => {
        if (!active) return;
        setContent(fallback);
        setStatus("fallback");
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...content, status };
}
