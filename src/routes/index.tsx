import { ActionIcon, Alert, Center, Container, Group, Loader, Stack, TextInput } from '@mantine/core'
import { isNotEmpty, useField } from '@mantine/form'
import { modals } from '@mantine/modals'
import { IconPlus } from '@tabler/icons-react'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import ToDo from 'src/components/ToDo'
import { ToDoType } from 'src/types/ToDo'
import api from 'src/utils/api'


const todosQueryOptions = queryOptions({
  queryKey: ['todos'],
  queryFn: () => api.list(),
})


export const Route = createFileRoute('/')({
  component: RouteComponent,
  pendingComponent: () => <Center><Loader /></Center>,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(todosQueryOptions)
})

function RouteComponent() {

  const dataQuery = useQuery(todosQueryOptions)

  const insertMutation = useMutation({
    mutationFn: (data: Omit<ToDoType, 'id' | 'createdAt' | 'isDone'>) => api.insert(data),
    onSuccess: () => dataQuery.refetch()
  })
  const renameMutation = useMutation({
    mutationFn: (data: ToDoType) => api.rename(data),
    onSuccess: () => dataQuery.refetch()
  })
  const toggleMutation = useMutation({
    mutationFn: async (data: ToDoType) => api.toggle(data),
    onSuccess: () => dataQuery.refetch(),
  })
  const removeMutation = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => dataQuery.refetch()
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const input = useField({
    initialValue: '',
    validate: isNotEmpty(),
  })

  async function handleSubmit() {
    const isError = await input.validate()
    if (isError) return
    insertMutation.mutateAsync({ text: input.getValue() }).then(() => {
      input.reset()
      setTimeout(() => inputRef.current?.focus(), 0)
    })
  }

  async function handleRemove(id: string) {
    modals.openConfirmModal({
      title: 'Are you sure?',
      onConfirm: () => removeMutation.mutate(id),
      confirmProps: { color: 'red' },
    })
  }

  return (
    <Container>
      <Stack>
        <Group>
          <TextInput
            ref={inputRef}
            placeholder="What to do..."
            className="flex-auto"
            onKeyUp={e => e.key === 'Enter' && handleSubmit()}
            disabled={insertMutation.isPending}
            autoFocus
            {...input.getInputProps()}
          />
          <ActionIcon size="input-sm" onClick={handleSubmit} loading={insertMutation.isPending}><IconPlus /></ActionIcon>
        </Group>
        {
          !dataQuery.data?.length && <Alert>Nothing to do...</Alert>
        }
        {
          dataQuery.data?.map(todo => (
            <ToDo
              key={todo.id}
              data={todo}
              onRename={renameMutation.mutate}
              onToggle={toggleMutation.mutate}
              onRemove={handleRemove}
            />
          ))
        }
      </Stack>
    </Container>
  )
}
