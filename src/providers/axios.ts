import axios from "axios";
import type { AxiosError } from "axios";
import type { HttpError } from "@refinedev/core";
import { authStorage } from "@lib/authStorage";

/** Base URL of the separate Dolphin API (see `.env`). */
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Send the access token on every request.
axiosInstance.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function toCamelCase(key: string): string {
  return key
    .split(".")
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join(".");
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
  fields?: Record<string, string>;
}

function extractFieldErrors(
  data: ApiErrorResponse | undefined,
): Record<string, string> | undefined {
  if (!data) return undefined;
  if (data.errors && Object.keys(data.errors).length > 0) {
    return Object.fromEntries(
      Object.entries(data.errors).map(([key, messages]) => [
        toCamelCase(key),
        Array.isArray(messages) ? messages[0] : String(messages),
      ]),
    );
  }
  if (data.fields && Object.keys(data.fields).length > 0) {
    return data.fields;
  }
  return undefined;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const fieldErrors = extractFieldErrors(data);

    const httpError: HttpError = {
      message: data?.error ?? data?.message ?? error.message ?? "An error occurred",
      statusCode: status ?? 0,
      ...(fieldErrors ? { errors: fieldErrors } : {}),
    };

    return Promise.reject(httpError);
  },
);
