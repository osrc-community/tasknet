CREATE TABLE 'users' (
    id integer PRIMARY KEY AUTOINCREMENT,
    email text unique NOT NULL,
    password_hash text NOT NULL,
    image text,
    firstname text NOT NULL,
    lastname text NOT NULL
);

CREATE TABLE 'auth_tokens' (
    user_id integer,
    token text,
    ttl integer,
    timestamp double,
    FOREIGN KEY(user_id) REFERENCES users(id)
);