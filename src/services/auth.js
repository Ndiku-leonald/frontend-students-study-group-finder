export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
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
  const user = getUserFromToken();

  if (!user) {
    return 'student';
  }

  return (user.role || user.userRole || 'student').toLowerCase();
}

export function getUserDisplayName() {
  const user = getUserFromToken();

  if (!user) {
    return 'Study Group User';
  }

  return user.fullName || user.name || user.username || user.email || 'Study Group User';
}
