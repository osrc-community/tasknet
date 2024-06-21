import hashlib
import time
from uuid import uuid4
from fastapi import HTTPException

from database import DatabaseSqlite


def hash_password(password) -> str:
    password_bytes = password.encode('utf-8')
    hash_object = hashlib.sha256(password_bytes)
    return hash_object.hexdigest()


def gen_identifier() -> str:
    """
    7d529dd4-548b-4258-aa8e-23e34dc8d43d
    """
    text = str(uuid4()).replace("-", "")
    return text


def gen_token(user_id: int, ttl: int) -> str | None:
    """
    Generate a random token
    :param user_id: The identifier of the user
    :param ttl: Time to Live of the token in Seconds
    :return: The token or None if an error occurred
    """
    timestamp = time.time()
    token: str = uuid4().__str__()
    db = DatabaseSqlite()
    cursor = db.get_cursor()

    cursor.execute("SELECT * from auth_tokens WHERE user_id LIKE ?", (user_id,))
    already_authenticated = cursor.fetchone()
    if already_authenticated:
        print(f"User '{user_id}' already authenticated!")
        return token

    cursor.execute(
        "INSERT INTO auth_tokens (user_id, token, ttl, timestamp) VALUES (?, ?, ?, ?)",
        (user_id, token, ttl, timestamp)
    )

    db.conn.commit()
    if cursor.rowcount > 0:
        return token
    cursor.close()
    return None


def verify_token(auth_token: str, auth_user: int):
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("SELECT * from auth_tokens WHERE token LIKE ?", (auth_token,))
    result = cursor.fetchone()

    if result is None:
        raise HTTPException(status_code=401, detail="Token expired")

    user_id, token, ttl, timestamp = result

    if ttl != -1:
        if time.time() - ttl <= 0:
            raise HTTPException(status_code=401, detail="Token incorrect")
        if user_id != auth_user:
            raise HTTPException(status_code=401, detail="Token incorrect")
    else:
        print("Developer token found: ", auth_token)


def identifier_exists(identifier: str, table: str, column: str) -> bool:
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    sql = f"SELECT {column} FROM '{table}' WHERE {column} LIKE '{identifier}'"
    cursor.execute(sql)
    result = cursor.fetchone()

    print(sql)
    print(result)

    if result is None:
        return False
    else:
        return True
