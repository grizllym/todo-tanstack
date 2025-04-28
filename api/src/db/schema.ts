import { int, sqliteTable, text,  } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos_table", {
	id: int().primaryKey({ autoIncrement: true }),
	text: text().notNull(),
	isDone: int({ mode: 'boolean' }).default(false),
	createdAt: int({ mode: 'timestamp' }),
})