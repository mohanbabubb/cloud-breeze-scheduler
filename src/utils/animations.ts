
import { useEffect, useState } from 'react';

export type TransitionState = 'from' | 'to';
export type TransitionType = 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'blur';

interface UseTransitionOptions {
  duration?: number;
  delay?: number;
  type?: TransitionType;
}

/**
 * Hook for smooth transitions
 */
export function useTransition(
  isVisible: boolean,
  options: UseTransitionOptions = {}
): [boolean, TransitionState] {
  const { duration = 300, delay = 0, type = 'fade' } = options;
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [transitionState, setTransitionState] = useState<TransitionState>(isVisible ? 'to' : 'from');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      setShouldRender(true);
      timeoutId = setTimeout(() => {
        setTransitionState('to');
      }, 10); // Small delay to ensure DOM updates
    } else {
      setTransitionState('from');
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, duration]);

  return [shouldRender, transitionState];
}

/**
 * Get transition classes based on state and type
 */
export function getTransitionClasses(state: TransitionState, type: TransitionType = 'fade'): string {
  const baseStyle = 'transition-all duration-300';
  
  switch (type) {
    case 'fade':
      return `${baseStyle} ${state === 'from' ? 'opacity-0' : 'opacity-100'}`;
    case 'slide-up':
      return `${baseStyle} ${state === 'from' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`;
    case 'slide-down':
      return `${baseStyle} ${state === 'from' ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`;
    case 'scale':
      return `${baseStyle} ${state === 'from' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`;
    case 'blur':
      return `${baseStyle} ${state === 'from' ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'}`;
    default:
      return baseStyle;
  }
}

/**
 * Create a staggered animation effect for list items
 */
export function useStaggeredAnimation(
  items: any[],
  isVisible: boolean,
  options: { baseDelay?: number; staggerDelay?: number } = {}
): { animationClass: string }[] {
  const { baseDelay = 100, staggerDelay = 50 } = options;
  
  return items.map((_, index) => {
    const delay = baseDelay + index * staggerDelay;
    return {
      animationClass: isVisible
        ? `animate-in fade-in slide-in-up delay-[${delay}ms]`
        : 'animate-out fade-out'
    };
  });
}
