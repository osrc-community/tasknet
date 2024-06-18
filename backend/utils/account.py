from database import DatabaseSqlite
from models.AuthUser import AuthUser


def user_exists(email) -> bool:
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("SELECT email from users WHERE email LIKE ?", (email,))
    result = cursor.fetchone()
    if result is not None:
        return True
    return False


def get_user_by_email(email) -> AuthUser:
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("SELECT id,email,password_hash,image,firstname,lastname from users WHERE email LIKE ?", (email,))
    result = cursor.fetchone()

    id, email, password_hash, image, firstname, lastname = result
    user = AuthUser(id=id, email=email, password_hash=password_hash, image=image, firstname=firstname, lastname=lastname)
    return user
