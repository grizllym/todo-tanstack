import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { ToDoType } from '../../web/src/types/ToDo.ts'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const data: ToDoType[] = []

const todoSchema = z.object({
  text: z.string()
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/todos', c => {
  const result = data.toSorted((a, b) => {
    if (a.isDone === b.isDone) {
      return b.createdAt.localeCompare(a.createdAt)
    }
    return +a.isDone - +b.isDone
  })
  return c.json(result)
})

app.post('/api/v1/todos',
  zValidator('json', todoSchema),
  async c => {
    const values = c.req.valid('json')
    const record: ToDoType = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isDone: false,
      text: values.text
    }
    data.push(record)
    return c.json(record, 201)
  }
)

app.patch('/api/v1/todos/:id/rename',
  zValidator('json', todoSchema),
  async c => {
    const id = c.req.param().id
    const record = data.find(e => e.id === id)

    if (!record) return c.notFound()
    
    const values = c.req.valid('json')
    record.text = values.text;
    return c.json(record, 200)
  }
)

app.patch('/api/v1/todos/:id/toggle',
  async c => {
    const id = c.req.param().id
    const record = data.find(e => e.id === id)
    
    if (!record) return c.notFound()

    record.isDone = !record.isDone
    return c.json(record, 200)
  }
)

app.delete('/api/v1/todos/:id',
  async c => {
    const id = c.req.param().id
    const index = data.findIndex(e => e.id === id)

    if (index === -1) return c.notFound()

    data.splice(index, 1)
    return c.body(null, 204)
  }
)

console.log(process.env.USER_PORT);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
