import { writable } from 'svelte/store'

export interface FetchResponse {
    isLoading: boolean
    response: string
    error: string
    status: number
    headers: {},
    duration: number
}

export const defaultResponse: FetchResponse = {
    isLoading: false,
    response: '',
    error: '',
    status: 0,
    headers: {},
    duration: 0
}

const fetchResponse = writable<FetchResponse>(defaultResponse)

export default fetchResponse
