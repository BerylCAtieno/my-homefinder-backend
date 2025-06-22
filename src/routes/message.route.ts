import { RequestHandler, Router } from "express";
import { Routes } from "../interfaces/route.interface";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MessageController } from "../controllers/message.controller";

export class MessageRoute implements Routes {
  public path = "/message";
  public router = Router();
  private messageController = new MessageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/send`,
        authMiddleware, 
        this.messageController.sendMessage as RequestHandler
    );
    this.router.get(`/thread/:withUserId`, 
        authMiddleware, 
        this.messageController.getThread as RequestHandler
    );
  }
}