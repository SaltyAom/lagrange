import { fetch, Body } from '@tauri-apps/api/http'

import { getIntrospectionQuery } from 'graphql'
import type { IntrospectionQuery } from 'graphql'

const fetchSchema = async (url: string) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: Body.json({
            query: getIntrospectionQuery()
        })
    }).then((response) => {
        if (!response?.data) return

        const { data: responseSchema } = response as {
            data: {
                data: IntrospectionQuery
            }
        }

        if (!responseSchema || !responseSchema.data)
            throw new Error("Schmea doesn't exists")

        return responseSchema.data
    })

export default fetchSchema
