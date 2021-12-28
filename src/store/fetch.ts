import { writable } from 'svelte/store'

export type Method =
    | 'GET'
    | 'PUT'
    | 'POST'
    | 'DELETE'
    | 'PATCH'
    | 'UPDATE'
    | 'CREATE'

export type Language = 'json' | 'graphql' | 'text' | 'html'
export type FetchType = 'body' | 'form'

export interface FetchStorage {
    url: string
    method: Method
    body: string
    language: Language
    response: string
    headers: string
    variables: string
    type: FetchType
}

export const defaultFetchStorage: FetchStorage = {
    url: '',
    method: 'GET',
    body: '',
    language: 'json',
    response: '',
    headers: '{}',
    variables: '{}',
    type: 'body'
}

export const typeOptions: FetchType[] = ['body', 'form']

const fetchStorage = writable<FetchStorage>(defaultFetchStorage)

export default fetchStorage
