import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  /** Value like "8", "100+", "12+", "28 ans", "620 ha", "1 000+ ha", "5 000 000 FCFA" */
  value: string;
  /** Animation duration in ms */
  duration?: number;
  className?: string;
}

/**
 * Animates the leading numeric portion of a label.
 * Preserves prefix/suffix text (e.g. "+", "ha", "ans", " FCFA") exactly.
 */
const AnimatedCounter = ({ value, duration = 1600, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Parse: optional leading non-digits, the digits (with spaces/commas/dots as separators), then suffix
  const match = value.match(/^([^\d-]*)([\d\s.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const rawNumber = match?.[2]?.replace(/[\s,]/g, "") ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(rawNumber);
  const valid = match && !Number.isNaN(target);

  const [display, setDisplay] = useState(valid ? 0 : value);

  useEffect(() => {
    if (!valid || !inView) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, valid, target, duration]);

  if (!valid) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  const formatted = typeof display === "number"
    ? display.toLocaleString("fr-FR").replace(/,/g, " ")
    : display;

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default AnimatedCounter;