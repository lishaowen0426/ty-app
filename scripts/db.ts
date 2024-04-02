import { PrismaClient } from "@prisma/client";
import { program } from "commander";
import SHA256 from "crypto-js/sha256";
import type { Topic } from "@prisma/client";

const prisma = new PrismaClient();

const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

const EMAIL_HOST = "@tysoft.com";

function generateString(length: number) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function random_item(items: any[]) {
  // Use Math.random() to generate a random number between 0 and 1,
  // multiply it by the length of the array, and use Math.floor() to round down to the nearest integer
  return items[Math.floor(Math.random() * items.length)];
}

const createUser = async (count: number) => {
  console.log("create ", count, " users");

  for (var i = 0; i < count; i++) {
    const name = generateString(5);
    await prisma.user.create({
      data: {
        email: `${name}${EMAIL_HOST}`,
        password: `${SHA256("123456")}`,
        name: name,
        emailVerified: new Date(),
      },
    });
  }
};
const createTopic = async (count: number) => {
  console.log("create ", count, " topics");
  //retrive creator id
  let creators = await prisma.user
    .findMany({
      select: { id: true },
      take: 1000,
    })
    .then((arr) => {
      return arr.map((r) => r.id);
    });
  let categories = await prisma.topicCategory
    .findMany({
      select: { category: true },
    })
    .then((arr) => {
      return arr.map((r) => r.category);
    });

  //retrive category
  for (var i = 0; i < count; i++) {
    await prisma.topic.create({
      data: {
        topic: generateString(10),
        description: generateString(30),
        creatorId: random_item(creators),
        categories: {
          connect: [{ category: random_item(categories) }],
        },
      },
    });
  }
};

program
  .command("user")
  .argument("<count>", "number of users to create", parseInt)
  .action(createUser);

program
  .command("topic")
  .argument("<count>", "number of topics to create", parseInt)
  .action(createTopic);

program.parseAsync(process.argv);
