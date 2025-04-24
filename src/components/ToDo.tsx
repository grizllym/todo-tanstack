import { ActionIcon, Checkbox, Group, Menu, Stack, Text, TextInput } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { ToDoType } from "src/types/ToDo"
import dayjs from "dayjs"

type TodoProps = {
	data: ToDoType;
	onRename: (newTodo: ToDoType) => void;
	onToggle: (newTodo: ToDoType) => void;
	onRemove: (id: string) => void;
}

export default function ToDo({ data, onRename, onToggle, onRemove }: TodoProps) {

	const [ isEditing, setIsEditing ] = useState(false)

	function handleSubmit() {
		const text = inputRef.current.value
		if (text) {
			const newTodo = { ...data, text }
			onRename(newTodo)
		}
		setIsEditing(false)
	}

	const inputRef = useClickOutside(() => handleSubmit())

	function handleToggle(e: React.ChangeEvent<HTMLInputElement>) {
		const isDone = e.currentTarget.checked
		const newTodo = { ...data, isDone }
		onToggle(newTodo)
	}

	return (
		<Group>
			<Checkbox checked={data.isDone} onChange={handleToggle} />
			<Stack gap={0} className="flex-1">
				{ !isEditing && <Text>{ data.text }</Text> }
				{
					isEditing && (
						<TextInput
							ref={inputRef}
							autoFocus
							defaultValue={data.text}
							onKeyUp={e => e.key === 'Enter' && handleSubmit()}
						/>
					)
				}
				<Text size="xs" c="dimmed">{ dayjs(data.createdAt).format('L LTS') }</Text>
			</Stack>
			<Menu position="bottom-end">
				<Menu.Target>
					<ActionIcon variant="subtle" size="input-sm" className="ml-auto"><IconDotsVertical /></ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item leftSection={<IconEdit size="18" />} onClick={() => setIsEditing(true)}>Edit</Menu.Item>
					<Menu.Item leftSection={<IconTrash size="18" />} onClick={() => onRemove(data.id)} color="red">Delete</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</Group>
	)
}