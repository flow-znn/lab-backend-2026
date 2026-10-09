import { Request, Response } from "express";
export declare class TicketController {
    private readonly ticketService;
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    updateStatus: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ticket.controller.d.ts.map