import psycopg2
import string 
import random
import sys



def generateTopic(len):
    return ''.join(random.choices(string.ascii_lowercase +
                             string.digits, k=len))


def getID(cur):
    
    cur.execute('SELECT * FROM "Topic" LIMIT 1;')
    return cur.fetchone()[1]
    

if len(sys.argv)<2:
    print("require the number of records")
    exit(1)
num = int(sys.argv[1])
print("create %d topics" % num)

conn = psycopg2.connect(dbname="test", user="test", password="test",host="localhost", port=5432)

with conn:
    with conn.cursor() as cur:
        id = getID(cur)
        for _ in range(num):
            topic = generateTopic(10)
            cur.execute('INSERT INTO "Topic" ("creatorId", topic) VALUES (%s, %s)', (id, topic))


