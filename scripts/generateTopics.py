import argparse
import random
import string
import sys
import hashlib

import psycopg2

MAX_DESCRIPTION_LENGTH = 30


def generateTopic(len):
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=len))


def generateDescription():
    return "".join(
        random.choices(string.ascii_lowercase + string.digits, k=MAX_DESCRIPTION_LENGTH)
    )


def getID(cur):
    cur.execute('SELECT * FROM "User" LIMIT 1;')
    user = cur.fetchone()
    return user[0]


"""
if len(sys.argv) < 2:
    print("require the number of records")
    exit(1)
num = int(sys.argv[1])
print("create %d topics" % num)


with conn:
    with conn.cursor() as cur:
        id = getID(cur)
        for _ in range(num):
            topic = generateTopic(10)
            cur.execute(
                'INSERT INTO "Topic" ("creatorId", topic) VALUES (%s, %s)', (id, topic)
            )
"""

PASSWORD = "123456"
hasher = hashlib.sha256()
hasher.update(b"123456")
HASHED_PASSWORD = bytes.hex(hasher.digest())
USERNAME_LENGTH = 5
EMAIL_HOST = "@tysoft.com"


def generateRandomText(len):
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=len))


def generateUser(cur, count, output):
    for _ in range(count):
        name = f"{generateRandomText(USERNAME_LENGTH)}"
        email = f"{name}{EMAIL_HOST}"
        print(f"{email} {PASSWORD}")

    return


def generateTopic(cur, count):
    return


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog="script")
    parser.add_argument(
        "command",
        metavar="comm",
        choices=["user", "topic"],
        help='generate random data to db: be "user", "topic"',
    )
    parser.add_argument(
        "-c",
        "--count",
        required=True,
        type=int,
        help="the number of records to generate",
    )

    args = parser.parse_args()
    while (
        input(f"generate {args.count} record to {args.command}, press ENTER to execute")
        != ""
    ):
        continue

    conn = psycopg2.connect(
        dbname="test", user="test", password="test", host="localhost", port=5432
    )
    userinfo = open("user_info", "a")
    with conn:
        with conn.cursor() as cur:
            match args.command:
                case "user":
                    generateUser(
                        cur,
                        args.count,
                        userinfo,
                    )
                case "topic":
                    print("topic")
                case _:
                    print("unknown command")
