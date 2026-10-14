-- CreateTable
CREATE TABLE "Favourite" (
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    PRIMARY KEY ("userId", "category"),
    CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reminder" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardDesign" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'sage',
    "stickers" JSONB NOT NULL,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "CardDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardDesign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
