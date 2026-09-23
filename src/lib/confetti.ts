import confetti from "canvas-confetti";

/**
 * Trigger a quick subtle particle burst for completing a single task
 */
export const triggerTaskCompleteConfetti = () => {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#6366F1", "#818CF8", "#22C55E", "#F59E0B", "#38BDF8"],
      disableForReducedMotion: true,
      scalar: 0.9,
    });
  } catch (err) {
    // Graceful fallback if canvas is not supported
  }
};

/**
 * Trigger a full celebratory explosion for 100% daily tasks or adaptive check-in
 */
export const triggerLevelUpConfetti = () => {
  try {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#6366F1", "#A855F7", "#22C55E", "#38BDF8", "#F59E0B"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#6366F1", "#A855F7", "#22C55E", "#38BDF8", "#F59E0B"],
      });
    }, 250);
  } catch (err) {
    // Graceful fallback
  }
};
