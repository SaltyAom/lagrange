import { writable } from 'svelte/store'

export interface FetchResponse {
    isLoading: boolean
    response: string
    error: string
    status: number
    headers: {}
}

export const defaultResponse: FetchResponse = {
    isLoading: false,
    response: '',
    error: '',
    status: 0,
    headers: {}
}

const fetchResponse = writable<FetchResponse>(defaultResponse)

export default fetchResponse
