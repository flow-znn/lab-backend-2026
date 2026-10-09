import type { Ticket, TicketStatus, User } from "./types";

const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
const tokenKey = "helpdesk.session";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const getToken = () => sessionStorage.getItem(tokenKey);
export const setToken = (token: string) => sessionStorage.setItem(tokenKey, token);
export const clearToken = () => sessionStorage.removeItem(tokenKey);

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Não foi possível conectar à API. Confira se o backend está iniciado.", 0);
  }
  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new Event("helpdesk:unauthorized"));
  }
  if (!response.ok) {
    let message = response.status === 401 ? "E-mail ou senha inválidos." : `A solicitação falhou (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body.message === "string") message = body.message;
      else if (typeof body.error === "string") message = body.error;
    } catch { /* resposta sem JSON */ }
    if (response.status === 403) message = "Você não tem permissão para essa ação.";
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) => request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<User>("/auth/me"),
  status: () => request<{ message: string }>("/"),
  tickets: () => request<Ticket[]>("/tickets"),
  ticket: (id: string) => request<Ticket>(`/tickets/${encodeURIComponent(id)}`),
  createTicket: (title: string, description: string) => request<Ticket>("/tickets", { method: "POST", body: JSON.stringify({ title, description }) }),
  updateTicketStatus: (id: string, status: TicketStatus) => request<Ticket>(`/tickets/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
