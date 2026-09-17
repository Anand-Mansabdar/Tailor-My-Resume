import { useEffect, useRef } from "react";
import anime from "animejs";

export default function PageTransition({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anime({
      targets: ref.current,
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 280,
      easing: "easeOutQuad",
    });
  }, []);
  return <div ref={ref}>{children}</div>;
}