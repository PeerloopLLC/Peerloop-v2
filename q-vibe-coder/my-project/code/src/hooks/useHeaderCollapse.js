import { useState, useEffect, useRef } from 'react';

/**
 * Hook for collapsible header behavior on scroll
 * - Immediately expands on ANY upward scroll
 * - Collapses when scrolling down past threshold
 * - Always expanded when near top
 */
export const useHeaderCollapse = (options = {}) => {
  const {
    collapseThreshold = 100,  // How far down before collapse is allowed
    scrollDownDelta = 10,     // Minimum scroll down movement to trigger collapse
    topThreshold = 30,        // Always expand when within this distance from top
  } = options;

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const isCollapsedRef = useRef(false);

  useEffect(() => {
    const handleScroll = (e) => {
      // Get scroll position from event target or window
      const scrollElement = e.target;
      const currentScrollY = scrollElement.scrollTop ?? window.scrollY ?? 0;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Skip tiny movements
      if (Math.abs(scrollDelta) < 2) return;

      // Immediately expand on ANY upward scroll
      if (scrollDelta < 0 && isCollapsedRef.current) {
        setIsHeaderCollapsed(false);
        isCollapsedRef.current = false;
      }
      // Collapse when scrolling down past threshold with significant movement
      else if (
        scrollDelta > scrollDownDelta &&
        currentScrollY > collapseThreshold &&
        !isCollapsedRef.current
      ) {
        setIsHeaderCollapsed(true);
        isCollapsedRef.current = true;
      }
      // Always expand when near top
      else if (currentScrollY <= topThreshold && isCollapsedRef.current) {
        setIsHeaderCollapsed(false);
        isCollapsedRef.current = false;
      }

      lastScrollY.current = currentScrollY;
    };

    // Track which elements we've attached listeners to
    const attachedElements = [];

    const attachListeners = () => {
      // Listen on multiple possible scroll containers
      const containers = [
        document.querySelector('.main-content'),
        document.querySelector('.center-column'),
        document.querySelector('.community-center-column')
      ].filter(Boolean);

      containers.forEach(el => {
        if (!attachedElements.includes(el)) {
          el.addEventListener('scroll', handleScroll, { passive: true });
          attachedElements.push(el);
        }
      });

      // Always listen on window
      if (!attachedElements.includes(window)) {
        window.addEventListener('scroll', handleScroll, { passive: true });
        attachedElements.push(window);
      }
    };

    // Attach immediately
    attachListeners();

    // Also re-attach after a short delay (for dynamically rendered elements)
    const timeoutId = setTimeout(attachListeners, 100);
    const timeoutId2 = setTimeout(attachListeners, 500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      attachedElements.forEach(el => {
        if (el === window) {
          window.removeEventListener('scroll', handleScroll);
        } else {
          el.removeEventListener('scroll', handleScroll);
        }
      });
    };
  }, [collapseThreshold, scrollDownDelta, topThreshold]);

  return isHeaderCollapsed;
};

export default useHeaderCollapse;
