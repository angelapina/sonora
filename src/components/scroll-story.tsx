"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type StorySlide = {
  image: string;
  eyebrow: string;
  title: string;
  href: string;
};

function Slide({
  slide,
  index,
  total,
  progress,
}: {
  slide: StorySlide;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const fade = Math.min(0.12, 1 / total / 2);

  const opacity = useTransform(
    progress,
    [
      Math.max(0, start - (index === 0 ? 0 : fade)),
      start + (index === 0 ? 0 : fade),
      end - fade,
      Math.min(1, end + (index === total - 1 ? 0 : fade)),
    ],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );
  const scale = useTransform(progress, [start, end], [1.06, 1]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-16 sm:px-12 sm:pb-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
          {slide.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-white sm:text-5xl">
          {slide.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function ScrollStory({ slides }: { slides: StorySlide[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} style={{ height: `${slides.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        {slides.map((slide, i) => (
          <Slide key={slide.title} slide={slide} index={i} total={slides.length} progress={scrollYProgress} />
        ))}

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:right-10 md:flex">
          {slides.map((_, i) => {
            const start = i / slides.length;
            const end = (i + 1) / slides.length;
            return <Dot key={i} progress={scrollYProgress} start={start} end={end} />;
          })}
        </div>
      </div>
    </div>
  );
}

function Dot({
  progress,
  start,
  end,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const height = useTransform(progress, [start, (start + end) / 2, end], [8, 24, 8]);
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.35, 1, 0.35]);
  return (
    <motion.span
      style={{ height, opacity }}
      className="w-1.5 rounded-full bg-white"
    />
  );
}
