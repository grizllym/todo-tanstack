import { randomId } from "@mantine/hooks"
import { ToDoType } from "src/types/ToDo"
import { FetchError } from "src/utils/fetcher";

async function sleep(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function simulateServer(min = 100, max = 3000) {
  const time = Math.floor(Math.random() * (max - min + 1) + min)
  await sleep(time)
  if (Math.random() < 0.5) {
    throw new FetchError(new Response(null, { status: 500, statusText: 'Internal Server Error' }))
  }
}

export default class MockApi {
  private data: ToDoType[] = []

  async list() {
    const result = JSON.parse(JSON.stringify(this.data)); // just simple copy for mock data to ensure no mutations on array or items
    return result as ToDoType[]
  }

  async insert({ text } : Omit<ToDoType, 'id' | 'createdAt' | 'isDone'>) {
    await simulateServer()
    const id = randomId().replace('mantine', 'todo')
    const newTodo: ToDoType = {
			id,
			text,
			createdAt: new Date().toISOString(),
			isDone: false
		}
    this.data.unshift(newTodo)
  }

  async rename(item: ToDoType) {
    await simulateServer()
    const oldItem = this.data.find(i => i.id === item.id)

    if (!oldItem) {
      throw new FetchError(new Response(null, { status: 404, statusText: 'Not Found!' }))
    }
      
    oldItem.text = item.text
  }

  async toggle(item: ToDoType) {
    await simulateServer()
    const oldItem = this.data.find(i => i.id === item.id)

    if (!oldItem) {
      throw new FetchError(new Response(null, { status: 404, statusText: 'Not Found!' }))
    }
      
    oldItem.isDone = item.isDone
  }

  async remove(id: string) {
    await simulateServer()
    const index = this.data.findIndex(i => i.id === id)
    if (index > -1) {
      this.data.splice(index)
      return
    }
    throw new FetchError(new Response(null, { status: 404, statusText: 'Not Found!' }))
  }
}
