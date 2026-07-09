"use client";

import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from "react";

type AnimationName = "fadeInUp" | "zoomIn" | "bounceIn";
type ScrollAnimateTag = "div" | "article" | "section" | "h2";

type ScrollAnimateProps = {
  as?: ScrollAnimateTag;
  animation?: AnimationName;
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export function ScrollAnimate({
  as: Tag = "div",
  animation = "fadeInUp",
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
  ...restProps
}: ScrollAnimateProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setVisible(true);
        observer.disconnect();
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const style: CSSProperties = delay ? { animationDelay: `${delay}ms` } : {};
  const classes = [
    "scroll-animate",
    visible ? "animate__animated animate__fast" : "",
    visible ? `animate__${animation}` : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const setNode = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  if (Tag === "article") {
    return (
      <article {...restProps} ref={setNode} className={classes} style={style}>
        {children}
      </article>
    );
  }

  if (Tag === "section") {
    return (
      <section {...restProps} ref={setNode} className={classes} style={style}>
        {children}
      </section>
    );
  }

  if (Tag === "h2") {
    return (
      <h2 {...restProps} ref={setNode} className={classes} style={style}>
        {children}
      </h2>
    );
  }

  return (
    <div {...restProps} ref={setNode} className={classes} style={style}>
      {children}
    </div>
  );
}
