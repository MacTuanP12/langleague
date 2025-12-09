/**
 * Custom hook for Haptic Feedback on Mobile Devices
 * Provides vibration feedback for user interactions
 */

type FeedbackType = 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning';

interface HapticOptions {
  enabled?: boolean;
}

export const useHapticFeedback = (options: HapticOptions = { enabled: true }) => {
  const { enabled = true } = options;

  /**
   * Check if haptic feedback is supported
   */
  const isSupported = (): boolean => {
    return 'vibrate' in navigator;
  };

  /**
   * Trigger haptic feedback based on type
   */
  const trigger = (type: FeedbackType = 'light'): void => {
    if (!enabled || !isSupported()) {
      return;
    }

    try {
      switch (type) {
        case 'light':
          // Single short vibration
          navigator.vibrate(10);
          break;
        case 'medium':
          // Medium vibration
          navigator.vibrate(20);
          break;
        case 'heavy':
          // Strong vibration
          navigator.vibrate(50);
          break;
        case 'error':
          // Error pattern: three short bursts
          navigator.vibrate([30, 50, 30, 50, 30]);
          break;
        case 'success':
          // Success pattern: two quick vibrations
          navigator.vibrate([20, 30, 20]);
          break;
        case 'warning':
          // Warning pattern: long-short-long
          navigator.vibrate([40, 30, 20, 30, 40]);
          break;
        default:
          navigator.vibrate(10);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  /**
   * Trigger success feedback (correct answer)
   */
  const success = (): void => {
    trigger('success');
  };

  /**
   * Trigger error feedback (wrong answer)
   */
  const error = (): void => {
    trigger('error');
  };

  /**
   * Trigger warning feedback
   */
  const warning = (): void => {
    trigger('warning');
  };

  /**
   * Trigger light tap feedback (button press)
   */
  const tap = (): void => {
    trigger('light');
  };

  /**
   * Trigger selection feedback
   */
  const select = (): void => {
    trigger('medium');
  };

  /**
   * Cancel any ongoing vibration
   */
  const cancel = (): void => {
    if (isSupported()) {
      navigator.vibrate(0);
    }
  };

  return {
    trigger,
    success,
    error,
    warning,
    tap,
    select,
    cancel,
    isSupported,
  };
};

export default useHapticFeedback;
