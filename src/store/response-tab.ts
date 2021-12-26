import { writable } from 'svelte/store'

export type ResponsePage = 'body' | 'headers'

export const responsePages: ResponsePage[] = ['body', 'headers']

export const defaultResponsePage: ResponsePage = 'body'

const responsePage = writable<ResponsePage>(defaultResponsePage)

export default responsePage
