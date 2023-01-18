const isBrowser = typeof window !== 'undefined';

/**
 * Simple Analytics
 */
export const Analytics = {
  track: (name: string, metadata?: Object) => {
    if (isBrowser) {
      try {
        (window as any)?.sa_event?.(name, metadata);
      } catch {
        console.error('Error while sending analytics event to simple analytics');
      }
    }
  }
};
