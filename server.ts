import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";

const PORT =
  process.env.CHAT_PORT ??
  (() => {
    throw new Error("chat port undefined");
  })();

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

httpServer.listen(parseInt(process.env.CHAT_PORT!));

io.on("connection", (socket) => {
  const topic = socket.handshake.headers.topic;
  const user = socket.handshake.auth.user as Session["user"];
  console.log(topic);
  console.log(user);
});
