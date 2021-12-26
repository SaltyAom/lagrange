import { writable } from 'svelte/store'

export interface FetchResponse {
    isLoading: boolean
    response: string
    error: string
}

export const defaultResponse: FetchResponse = {
    isLoading: false,
    response: '',
    error: ''
}

const fetchResponse = writable<FetchResponse>(defaultResponse)

export default fetchResponse
