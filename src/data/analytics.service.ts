import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Service to report application errors to Firebase Analytics.
 * @param context A string describing where the error occurred (e.g., 'SaveExperience').
 * @param error The error object or message.
 * @param metadata Optional additional parameters to send with the event.
 */
export const logAppError = (
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>,
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (analytics) {
    logEvent(analytics, 'exception', {
      description: errorMessage,
      context,
      ...metadata,
    });
  }
};
