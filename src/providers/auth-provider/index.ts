import type { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "@providers/axios";
import { authStorage, type AuthUser } from "@lib/authStorage";

/**
 * Token-based auth against the separate Dolphin API.
 *
 * API contract:
 *   POST /auth/login  { login, password } → { token: string, user: AuthUser }
 *                     (login = username or email)
 *   GET  /auth/me                          → { data: AuthUser }   (Bearer token)
 * Any request returning 401 logs the user out.
 *
 * Accounts are shared with the POS app. Role "kasir" (cashier) may only use
 * the POS, so it is refused here (the API also answers 403 for it).
 */
interface LoginResponse {
  token: string;
  user: AuthUser;
}

const POS_ONLY_ROLES = ["kasir"];

export const authProvider: AuthProvider = {
  login: async ({ login, password }) => {
    let data: LoginResponse;
    try {
      ({ data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        login,
        password,
      }));
    } catch {
      return {
        success: false,
        error: {
          name: "Login Failed",
          message: "Invalid username/email or password. Please try again.",
        },
      };
    }

    if (POS_ONLY_ROLES.includes(data.user.role)) {
      return {
        success: false,
        error: {
          name: "Login Failed",
          message: "Cashier accounts can only sign in to the POS app.",
        },
      };
    }

    authStorage.set(data.token, data.user);
    return {
      success: true,
      redirectTo: "/dashboard",
      successNotification: {
        message: "Welcome back to Dolphin Portal!",
        description: "You have successfully logged in.",
      },
    };
  },

  logout: async () => {
    authStorage.clear();
    return {
      success: true,
      redirectTo: "/login",
      successNotification: {
        message: "Logout Successful",
        description: "You have been logged out of your account.",
      },
    };
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.response?.status === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },

  check: async () => {
    if (authStorage.getToken()) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => authStorage.getUser()?.role ?? null,

  getIdentity: async () => authStorage.getUser(),
};
