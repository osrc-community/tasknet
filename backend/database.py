import sqlite3


class DatabaseSqlite:
    def __init__(self):
        self.file = "database_sqlite.db"
        self.conn = None
        self.get_connection()

    def get_connection(self):
        self.conn = sqlite3.connect(self.file)
        return self.conn

    def get_cursor(self):
        return self.conn.cursor()
