// Admin authentication utilities

const AUTH_KEY = "tida_admin_auth";

export const ADMIN_CREDENTIALS = {
  email: "admin@tidasports.com",
  password: "Admin@2026",
};
export interface AdminSession {
  email: string;
  name: string;
  role: string;
  loginAt: string;
}

export function login(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const trimmedEmail = email.trim().toLowerCase();
  if (trimmedEmail !== ADMIN_CREDENTIALS.email) {
    return { success: false, error: "No admin account found with this email." };
  }
  if (password !== ADMIN_CREDENTIALS.password) {
    return { success: false, error: "Incorrect password. Please try again." };
  }
  const session: AdminSession = {
    email: ADMIN_CREDENTIALS.email,
    name: "Super Admin",
    role: "Administrator",
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AdminSession;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
