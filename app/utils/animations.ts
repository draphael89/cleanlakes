import { Variants, Transition, TargetAndTransition } from 'framer-motion';
import { SpringValue, animated } from '@react-spring/web';

// Default transition
const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Slide animations
export const slideInLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

// Scale animations
export const scaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

// Stagger children animations
export const staggerChildren = (staggerTime: number = 0.1): Variants => ({
  animate: {
    transition: {
      staggerChildren: staggerTime,
    },
  },
});

// Hover animations
export const hoverScale: TargetAndTransition = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Custom animation creator
export const createCustomAnimation = (
  initial: TargetAndTransition,
  animate: TargetAndTransition,
  exit: TargetAndTransition = initial
): Variants => ({
  initial,
  animate,
  exit,
});

// Transition creator
export const createTransition = (customTransition: Partial<Transition> = {}): Transition => ({
  ...defaultTransition,
  ...customTransition,
});

// React Spring Helpers
export const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1 - i * 0.05,
  rot: -5 + Math.random() * 10,
  delay: i * 100,
});

export const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

export const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export type SpringProps = {
  x: SpringValue<number>;
  y: SpringValue<number>;
  rot: SpringValue<number>;
  scale: SpringValue<number>;
};