import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

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
  console.log(socket.handshake.auth);
  console.log(socket.handshake.headers);
});
