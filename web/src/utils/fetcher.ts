export class FetchError extends Error {
	response: Response

	constructor(response: Response) {
		super(response.statusText)
		this.response = response
	}

	static is(error: Error): error is FetchError {
		if (error.constructor === FetchError) {
			return true
		}
		return false
	}
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Resource = `${Method} /${string}`

// TODO - not tested yet
export default async function fetcher<T>(resource: Resource, options?: Omit<RequestInit, 'method' | 'credentials' | 'body'> & { body?: unknown }) {
	const [ method, url ] = resource.split(' ')
	const body = options?.body ? JSON.stringify(options.body) : undefined
	try {
		const response = await fetch(url, {
			...options,
			credentials: 'include',
			headers: {
				'Content-Type': "application/json"
			},
			method,
			body
		})
		if (!response.ok) {
			throw new FetchError(response)
		}
		if (response.status !== 204) {
			return await response.json() as T
		}
		return null
	} catch (err) {
		console.error(err);
		throw err
	}
}