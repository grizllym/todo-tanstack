import { FetchError } from "src/utils/fetcher"
import { notifications } from "@mantine/notifications"

export default function handleError(err: Error) {
	console.error(err);
	if (FetchError.is(err)) {
		notifications.show({
			color: 'red',
			title: 'Server Error',
			message: err.response.statusText,
		})
		return
	}
	notifications.show({
		color: 'red',
		title: 'Error: ' + err.name,
		message: err.message
	})
}