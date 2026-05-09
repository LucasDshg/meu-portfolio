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

/**
 * Logs a page view event.
 * @param screenName The name of the screen/section being viewed.
 */
export const logPageView = (screenName: string): void => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      firebase_screen: screenName,
    });
  }
};

/**
 * Logs a user interaction event (clicks on buttons, menus, etc).
 * @param name Identification of the element interacted with.
 * @param type The type of interaction (e.g., 'button', 'menu_item').
 * @param metadata Optional additional parameters.
 */
export const logInteraction = (
  name: string,
  type: 'button' | 'menu_item' | 'link' | 'social_link',
  metadata?: Record<string, unknown>,
): void => {
  if (analytics) {
    logEvent(analytics, 'select_content', {
      content_type: type,
      item_id: name,
      ...metadata,
    });
  }
};
