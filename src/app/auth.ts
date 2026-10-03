/**
 * Mock session — same storage keys as the Angular AuthGuard, login
 * component, and header logout.
 *
 * "Keep me signed in" chooses localStorage (survives closing the browser)
 * or sessionStorage (this tab only); Angular always used localStorage, so
 * the checkbox did nothing.
 *
 * Storage access is guarded: private windows or blocked site data can
 * throw, which must read as "signed out" rather than crash the app.
 */

const AUTH_KEY = 'dentalab-auth';
const TOKEN_KEY = 'dentalab-auth-token';

function stores(): Storage[] {
  try {
    return typeof window === 'undefined' ? [] : [localStorage, sessionStorage];
  } catch {
    return [];
  }
}

export function isAuthenticated(): boolean {
  try {
    return stores().some((store) => store.getItem(AUTH_KEY) === 'true');
  } catch {
    return false;
  }
}

export function signIn(remember = true): void {
  signOut();
  try {
    const store = remember ? localStorage : sessionStorage;
    store.setItem(AUTH_KEY, 'true');
    store.setItem(TOKEN_KEY, 'mock-jwt-token');
  } catch {
    // Session still proceeds for this page load.
  }
}

export function signOut(): void {
  try {
    stores().forEach((store) => {
      store.removeItem(AUTH_KEY);
      store.removeItem(TOKEN_KEY);
    });
  } catch {
    // Nothing persisted to clear.
  }
}
