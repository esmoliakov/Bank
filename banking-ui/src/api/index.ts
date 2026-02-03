import {
  UserResponse,
  UserCreateDto,
  UserUpdateDto,
  AccountResponse,
  AccountCreateDto,
  AccountUpdateDto,
  TransactionResponse,
  TransactionCreateDto,
} from "../types";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // backend returns plain text or { message } on errors
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json ?? text;
    } catch {
      /* keep plain text */
    }
    throw new Error(message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  create: (dto: UserCreateDto) =>
    request<UserResponse>("POST", "/users", dto),

  getById: (id: number) =>
    request<UserResponse>("GET", `/users/${id}`),

  getAll: () =>
    request<UserResponse[]>("GET", "/users"),

  update: (id: number, dto: UserUpdateDto) =>
    request<UserResponse>("PUT", `/users/${id}`, dto),

  delete: (id: number) =>
    request<void>("DELETE", `/users/${id}`),
};

// ─── Accounts ─────────────────────────────────────────────────────────────────

export const accountsApi = {
  create: (dto: AccountCreateDto) =>
    request<AccountResponse>("POST", "/accounts", dto),

  getById: (id: number) =>
    request<AccountResponse>("GET", `/accounts/${id}`),

  getAll: () =>
    request<AccountResponse[]>("GET", "/accounts"),

  update: (id: number, dto: AccountUpdateDto) =>
    request<AccountResponse>("PUT", `/accounts/${id}`, dto),

  delete: (id: number) =>
    request<void>("DELETE", `/accounts/${id}`),
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactionsApi = {
  create: (dto: TransactionCreateDto) =>
    request<TransactionResponse>("POST", "/transactions", dto),

  getById: (id: number) =>
    request<TransactionResponse>("GET", `/transactions/${id}`),

  delete: (id: number) =>
    request<void>("DELETE", `/transactions/${id}`),
};
