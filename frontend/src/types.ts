export type User = { id: string; username: string; email: string; roles: string[] };
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; name: string; email: string };
};
