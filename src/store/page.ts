import { writable } from 'svelte/store'
import type { FetchType } from './fetch'

export type Page = 'body' | 'headers' | 'gql variables'

export const pages: Page[] = ['headers', 'gql variables']

export const mapOptionWidth: Record<FetchType, number> = {
    body: 6,
    form: 6
}

export const defaultPage: Page = 'body'

const page = writable<Page>(defaultPage)

export default page
