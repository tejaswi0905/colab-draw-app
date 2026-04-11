import { Request, Response } from "express";

import { prismaClient } from "@repo/db";
import { roomSchema } from "@repo/common/types";

export const createRoom = async (req: Request, res: Response) => {
  const result = roomSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid input",
      issues: result.error.issues,
    });
  }

  try {
    const { slug } = result.data;

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        status: "failed",
        message: "user not authenticates",
      });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    const newRoom = await prismaClient.room.create({
      data: {
        slug,
        adminId: userId,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Room created successfully",
      data: {
        roomId: newRoom.id,
        roomName: newRoom.slug,
      },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(409).json({
        status: "failed",
        message: "Room name already taken",
      });
    }

    console.error(e);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong while creating room",
    });
  }
};

export const getRoomMessages = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid roomId",
      });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({
        status: "failed",
        message: "Room not found",
      });
    }
    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: {
        id: "asc", // important for correct order
      },
      take: 50,
    });

    return res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (e: any) {
    console.error("Something went wrong in roomController getRoomMessages ", e);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({
        status: "failed",
        message: "Slug is required",
      });
    }

    const room = await prismaClient.room.findUnique({
      where: { slug },
    });

    if (!room) {
      return res.status(404).json({
        status: "failed",
        message: "Room not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        roomId: room.id,
        slug: room.slug,
      },
    });
  } catch (e) {
    console.error("Error in getRoomBySlug:", e);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};
