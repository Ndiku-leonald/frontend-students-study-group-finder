export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
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
