import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const artifacts = pgTable("artifacts", {
  id: serial("id").primaryKey(),
  uniquecode: varchar("uniquecode", { length: 64 }).notNull().unique(),
  html: text("html").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
