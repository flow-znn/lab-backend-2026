import { z } from "zod";
import prisma from "@/lib/prisma";

export const createTicketSchema = z.object({
  title: z.string().trim().min(3, "O título deve ter ao menos 3 caracteres.").max(160, "O título deve ter no máximo 160 caracteres."),
  description: z.string().trim().min(5, "A descrição deve ter ao menos 5 caracteres.").max(10000, "A descrição deve ter no máximo 10.000 caracteres."),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
});

const ticketInclude = { owner: { select: { id: true, name: true, email: true } } } as const;

export class TicketService {
  list(userId: string, isAdmin: boolean) {
    return prisma.ticket.findMany({
      ...(isAdmin ? {} : { where: { ownerId: userId } }),
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  getById(id: string, userId: string, isAdmin: boolean) {
    return prisma.ticket.findFirst({
      where: { id, ...(isAdmin ? {} : { ownerId: userId }) },
      include: ticketInclude,
    });
  }

  create(input: unknown, userId: string) {
    const data = createTicketSchema.parse(input);
    return prisma.ticket.create({ data: { ...data, ownerId: userId }, include: ticketInclude });
  }

  updateStatus(id: string, input: unknown) {
    const data = updateTicketStatusSchema.parse(input);
    return prisma.ticket.update({ where: { id }, data, include: ticketInclude });
  }
}
