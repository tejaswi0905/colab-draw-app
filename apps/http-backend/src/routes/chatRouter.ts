import express, { Router, Request, Response } from "express";


export const chatRouter:Router = express.Router();

chatRouter.get("/", (req:Request, res:Response) => {
    res.send("The landig page of chats router");
})