export function saveToken(token) {
  // Persist the JWT for future API calls.
  // localStorage keeps the session available after refreshes.
  localStorage.setItem('token', token);
}

export function clearToken() {
  // Remove both token and cached profile data on sign-out.
  // Clearing both values prevents stale user state from leaking into the UI.
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function getUserFromToken() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    // JWTs are base64url encoded, so the payload needs a small normalization step.
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decoded = JSON.parse(atob(paddedPayload));
    return decoded;
  } catch {
    return null;
  }
}

export function getUserRole() {
  // Prefer the cached user object, then fall back to the JWT payload.
  // This lets the app still route correctly even if localStorage entries are partial.
  const user = getUser() || getUserFromToken();

  if (!user) {
    return 'student';
  }

  return (user.role || user.userRole || 'student').toLowerCase();
}

export function getUserDisplayName() {
  const user = getUser() || getUserFromToken();

  if (!user) {
    return 'Study Group User';
  }

  return user.name || user.fullName || user.displayName || 'Study Group User';
}

export function getUserAdminCode() {
  const user = getUser() || getUserFromToken();
  return user?.adminCode || null;
}

export function getUserId() {
  const user = getUser() || getUserFromToken();
  return user?.id || null;
}
