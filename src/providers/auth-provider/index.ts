import type { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "@providers/axios";
import { authStorage, type AuthUser } from "@lib/authStorage";

/**
 * Token-based auth against the separate Dolphin API.
 *
 * API contract (to be implemented in the API project):
 *   POST /auth/login  { email, password } → { token: string, user: AuthUser }
 *   GET  /auth/me                          → { data: AuthUser }   (Bearer token)
 * Any request returning 401 logs the user out.
 */
interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      authStorage.set(data.token, data.user);

      return {
        success: true,
        redirectTo: "/dashboard",
        successNotification: {
          message: "Welcome back to Dolphin Portal!",
          description: "You have successfully logged in.",
        },
      };
    } catch {
      return {
        success: false,
        error: {
          name: "Login Failed",
          message: "Invalid email or password. Please try again.",
        },
      };
    }
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
