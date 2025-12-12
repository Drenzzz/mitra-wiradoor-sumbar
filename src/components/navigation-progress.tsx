"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: "ease",
  speed: 400,
  trickleSpeed: 200,
});

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const isExternal = anchor.target === "_blank" || anchor.rel?.includes("external");
        const isSameOrigin = href?.startsWith("/") || href?.startsWith(window.location.origin);
        const isHashLink = href?.startsWith("#");
        const isDownload = anchor.hasAttribute("download");

        if (isSameOrigin && !isExternal && !isHashLink && !isDownload && href !== pathname) {
          NProgress.start();
        }
      }
    };

    const handleMutation = () => {
      NProgress.done();
    };

    document.addEventListener("click", handleAnchorClick);

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      observer.disconnect();
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
