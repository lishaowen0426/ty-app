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

/* DB-related*/
const getTopic = async (id: string) => {
  try {
    const topic = await prisma.topic.findFirstOrThrow({
      where: {
        id: parseInt(id),
      },
    });
    return topic;
  } catch (e) {
    throw e;
  }
};
/**/
io.on("connection", (socket) => {
  const topicID = socket.handshake.headers.topic;
  const user = socket.handshake.auth.user as Session["user"];
  //console.log(topicID);
  console.log(user);
  if (!topicID) {
    socket.emit("notfound");
  } else {
    getTopic(topicID as string)
      .then((topic) => {
        socket.emit("OK");
      })
      .catch((e) => {
        console.log(topicID);
        //socket.emit("OK");
        socket.emit("notfound");
      });
  }
});
