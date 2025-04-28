import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm'
import { todosTable } from './db/schema.js'

const client = createClient({ url: process.env.DB_FILE_NAME! })
const db = drizzle({ client, schema: { todosTable } })
const app = new Hono()

const todoSchema = z.object({
  text: z.string()
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/todos',
  zValidator('query', z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(15),
  })),
  async c => {
    const { page, limit } = c.req.valid('query')
    const result = await db.query.todosTable.findMany({
      orderBy: (todos, { desc, asc }) => [ asc(todos.isDone), desc(todos.createdAt) ],
      limit,
      offset: ((page - 1) * limit)
    }).execute()

    return c.json(result)
  }
)

app.post('/api/v1/todos',
  zValidator('json', todoSchema),
  async c => {
    const values = c.req.valid('json')
    const record: typeof todosTable.$inferInsert = {
      text: values.text,
      createdAt: new Date(),
    }
    const result = await db.insert(todosTable).values(record).returning()
    return c.json(result, 201)
  }
)

app.patch('/api/v1/todos/:id/rename',
  zValidator('json', todoSchema),
  zValidator('param', z.object({ id: z.coerce.number() }) ),
  async c => {
    const id = c.req.valid('param').id
    const values = c.req.valid('json')

    const records = await db
      .update(todosTable)
      .set({ text: values.text })
      .where(eq(todosTable.id, id))
      .returning()

    if (!records[0]) {
      return c.notFound()
    }
    
    return c.json(records[0])
  }
)

app.patch('/api/v1/todos/:id/toggle',
  zValidator('param', z.object({ id: z.coerce.number() }) ),
  async c => {
    const id = c.req.valid('param').id
    
    const oldRecord = await db.query.todosTable.findFirst({ where: eq(todosTable.id, id) })
    
    if (!oldRecord) {
      return c.notFound()
    }

    const records = await db
      .update(todosTable)
      .set({ isDone: !oldRecord?.isDone })
      .where(eq(todosTable.id, id))
      .returning()
    
    if (!records[0]) {
      return c.notFound()
    }

    return c.json(records)
  }
)

app.delete('/api/v1/todos/:id',
  zValidator('param', z.object({ id: z.coerce.number() }) ),
  async c => {
    const id = c.req.valid('param').id

    await db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
    return c.body(null, 204)
  }
)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
