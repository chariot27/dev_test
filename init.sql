CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE "post" (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    "userId" INTEGER,
    CONSTRAINT fk_user
        FOREIGN KEY ("userId") 
        REFERENCES "user"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);