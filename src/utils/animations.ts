import { animate } from 'animejs'

/**
 * Checks whether the user has requested reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Animates elements entrance smoothly.
 * Automatically bails out if reduced motion is preferred or if elements are missing.
 * Returns a cleanup/revert function.
 */
export function animateEntrance(
  targets: Element | Element[] | NodeListOf<Element> | string,
  options: {
    duration?: number
    delay?: number | ((el: Element, i: number) => number)
    translateY?: [number, number]
    opacity?: [number, number]
  } = {}
): () => void {
  if (prefersReducedMotion() || typeof window === 'undefined') {
    return () => {}
  }

  try {
    const anim = animate(targets as any, {
      opacity: options.opacity ?? [0, 1],
      translateY: options.translateY ?? [24, 0],
      duration: options.duration ?? 450,
      ease: 'outQuad',
      delay: (options.delay as any) ?? 0,
    })

    return () => {
      try {
        anim.pause()
      } catch {
        // Safe no-op on cleanup
      }
    }
  } catch {
    return () => {}
  }
}

/**
 * Micro-animation for favorite button pop feedback.
 */
export function animateFavoritePop(target: Element): void {
  if (prefersReducedMotion() || !target) return

  try {
    animate(target as any, {
      scale: [1, 1.35, 1],
      duration: 350,
      ease: 'outBack',
    })
  } catch {
    // Graceful fallback
  }
}
