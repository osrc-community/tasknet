CREATE TABLE 'groups' (
    identifier text PRIMARY KEY,
    title text
);

CREATE TABLE 'group_panel' (
    group_identifier text PRIMARY KEY,
    panel_identifier text,
    FOREIGN KEY(group_identifier) REFERENCES groups(identifier)
        ON DELETE CASCADE,
    FOREIGN KEY(panel_identifier) REFERENCES panels(identifier)
        ON DELETE CASCADE
);

CREATE TABLE 'panels' (
    identifier text PRIMARY KEY,
    title text,
    image text
);

CREATE TABLE 'panel_list' (
    panel_identifier text,
    list_identifier text,
    FOREIGN KEY(panel_identifier) REFERENCES panels(identifier)
        ON DELETE CASCADE,
    FOREIGN KEY(list_identifier) REFERENCES lists(identifier)
        ON DELETE CASCADE
);

CREATE TABLE 'lists' (
    identifier text PRIMARY KEY,
    title text
);

CREATE TABLE 'list_entries' (
    list_identifier text,
    entry_identifier text,
    FOREIGN KEY(list_identifier) REFERENCES lists(identifier)
        ON DELETE CASCADE,
    FOREIGN KEY(entry_identifier) REFERENCES entries(identifier)
        ON DELETE CASCADE
);

CREATE TABLE 'entries' (
    identifier text PRIMARY KEY,
    type text,
    message text
);
