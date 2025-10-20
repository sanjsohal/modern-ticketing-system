import { useEffect, useRef, useCallback } from 'react';

interface IdleTimeoutOptions {
  onIdle: () => void;
  idleTime?: number; // in milliseconds
  warningTime?: number; // show warning before logout (in milliseconds)
  onWarning?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook to detect user inactivity and trigger callbacks
 * @param options Configuration options for idle detection
 */
export const useIdleTimeout = ({
  onIdle,
  idleTime = 15 * 60 * 1000, // Default: 15 minutes
  warningTime = 1 * 60 * 1000, // Default: 1 minute before logout
  onWarning,
  enabled = true,
}: IdleTimeoutOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    lastActivityRef.current = Date.now();
    clearTimeouts();

    // Set warning timeout
    if (onWarning && warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        onWarning();
      }, idleTime - warningTime);
    }

    // Set idle timeout
    timeoutRef.current = setTimeout(() => {
      onIdle();
    }, idleTime);
  }, [enabled, idleTime, warningTime, onIdle, onWarning, clearTimeouts]);

  useEffect(() => {
    if (!enabled) {
      clearTimeouts();
      return;
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'wheel',
    ];

    // Throttle to avoid excessive timer resets
    let throttleTimeout: NodeJS.Timeout;
    const handleActivity = () => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        resetTimer();
        clearTimeout(throttleTimeout);
      }, 1000); // Throttle to once per second
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeouts();
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [enabled, resetTimer, clearTimeouts]);

  return {
    resetTimer,
    clearTimeouts,
    lastActivity: lastActivityRef.current,
  };
};
