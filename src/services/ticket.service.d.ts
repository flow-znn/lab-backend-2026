import { z } from "zod";
export declare const createTicketSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
export declare const updateTicketStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        IN_PROGRESS: "IN_PROGRESS";
        OPEN: "OPEN";
        RESOLVED: "RESOLVED";
    }>;
}, z.core.$strip>;
export declare class TicketService {
    list(userId: string, isAdmin: boolean): import(".prisma/client").Prisma.PrismaPromise<({
        owner: {
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getById(id: string, userId: string, isAdmin: boolean): import(".prisma/client").Prisma.Prisma__TicketClient<({
        owner: {
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(input: unknown, userId: string): import(".prisma/client").Prisma.Prisma__TicketClient<{
        owner: {
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateStatus(id: string, input: unknown): import(".prisma/client").Prisma.Prisma__TicketClient<{
        owner: {
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
//# sourceMappingURL=ticket.service.d.ts.map