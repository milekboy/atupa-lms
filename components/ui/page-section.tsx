"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
export function PageSection({ children, delay = 0, className = "", label }: { children: ReactNode; delay?: number; className?: string; label?: string }) {
  const reduce = useReducedMotion();
  return <motion.section aria-label={label} className={className} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .24, delay: reduce ? 0 : delay }}>{children}</motion.section>;
}
