import { writable } from 'svelte/store'

import type { IntrospectionQuery } from 'graphql'

export interface SharedSchema {
    schema: IntrospectionQuery | null
}

export const defaultSharedSchema: SharedSchema = {
    schema: null
}

const sharedSchema = writable<SharedSchema>(defaultSharedSchema)

export default sharedSchema
