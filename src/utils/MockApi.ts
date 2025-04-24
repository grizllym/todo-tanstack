import { randomId } from "@mantine/hooks"
import { ToDoType } from "src/types/ToDo"
import { FetchError } from "src/utils/fetcher";

async function sleep(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function simulateServer(min = 100, max = 3000) {
  const time = Math.floor(Math.random() * (max - min + 1) + min)
  await sleep(time)
  if (Math.random() < 0.25) {
    throw new FetchError(new Response(null, { status: 500, statusText: 'Internal Server Error' }))
  }
}

export default class MockApi {
  private data: ToDoType[] = []
  private STORAGE_KEY = 'MOCK_API_STORAGE'

  constructor() {
    this.load()
  }

  private load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY)
      if (!raw) return

      this.data = JSON.parse(raw)
    } catch (err) {
      console.error(err);
    }
  }

  private save() {
    const raw = JSON.stringify(this.data)
    localStorage.setItem(this.STORAGE_KEY, raw)
  }

  async list() {
    // await simulateServer()
    const result = JSON.parse(JSON.stringify(this.data)) as ToDoType[]; // just simple copy for mock data to ensure no mutations on array or items
    result.sort((a, b) => {
      if (a.isDone === b.isDone) {
        return b.createdAt.localeCompare(a.createdAt)
      }
      return +a.isDone - +b.isDone
    })
    return result
  }

  async insert({ text } : Omit<ToDoType, 'id' | 'createdAt' | 'isDone'>) {
    // await simulateServer()
    const id = randomId().replace('mantine', 'todo')
    const newTodo: ToDoType = {
			id,
			text,
			createdAt: new Date().toISOString(),
			isDone: false
		}
    this.data.unshift(newTodo)
    this.save()
  }

  async rename(item: ToDoType) {
    // await simulateServer()
    const oldItem = this.data.find(i => i.id === item.id)

    if (!oldItem) {
      throw new FetchError(new Response(null, { status: 404, statusText: 'Not Found!' }))
    }
      
    oldItem.text = item.text
    this.save()
  }

  async toggle(item: ToDoType) {
    // await simulateServer()
    const oldItem = this.data.find(i => i.id === item.id)

    if (!oldItem) {
      throw new FetchError(new Response(null, { status: 404, statusText: 'Not Found!' }))
    }

    oldItem.isDone = item.isDone
    this.save()
  }

  async remove(id: string) {
    // await simulateServer()
    const index = this.data.findIndex(i => i.id === id)
    if (index > -1) {
      this.data.splice(index)
      this.save()
      return
    }
    throw new FetchError(new Response(null, { status: 404, statusText: 'Not Found!' }))
  }
}
