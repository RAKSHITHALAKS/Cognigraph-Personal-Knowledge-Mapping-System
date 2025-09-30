import pymysql

conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='rakshitha',
    database='knowledge_graph_db',
    port=3306
)

print("Connected!")
conn.close()
