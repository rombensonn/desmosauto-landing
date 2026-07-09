"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MotionBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const viewport = { once: true, amount: 0.22 };
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ServiceStoryHero({ children, className, delay = 0 }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.72, delay, ease: smoothEase }}
    >
      {children}
    </motion.div>
  );
}

export function ServiceStoryReveal({ children, className, delay = 0 }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={reduceMotion ? undefined : { duration: 0.68, delay, ease: smoothEase }}
    >
      {children}
    </motion.div>
  );
}

export function ServiceStoryCard({ children, className, delay = 0 }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      viewport={viewport}
      transition={
        reduceMotion
          ? undefined
          : {
              opacity: { duration: 0.58, delay, ease: smoothEase },
              y: { type: "spring", stiffness: 420, damping: 34, delay }
            }
      }
    >
      {children}
    </motion.article>
  );
}
