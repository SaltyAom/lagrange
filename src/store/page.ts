import { writable } from 'svelte/store'

export type Page = 'body' | 'headers' | 'gql variables'

export const pages: Page[] = ['body', 'headers', 'gql variables']

export const defaultPage: Page = 'body'

const page = writable<Page>(defaultPage)

export default page
