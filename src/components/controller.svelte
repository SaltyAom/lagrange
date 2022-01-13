<script lang="ts">
    import { Body, fetch, ResponseType } from '@tauri-apps/api/http'
    import type { FetchOptions, HttpVerb } from '@tauri-apps/api/http'

    import { onMount } from 'svelte'

    import controller from '../store/controller'
    import fetchStorage from '../store/fetch'
    import type { Language, Method } from '../store/fetch'
    import { saveFetchStorage } from '../store/deriveSave'
    import fetchResponse, { defaultResponse } from '../store/response'

    import { trySerialize } from '../lib/json'

    let url: string
    let method: Method = 'GET'
    let language: Language

    onMount(async () => {
        window.addEventListener('fetch-request', () => {
            if (
                $controller.index >= 0 &&
                $controller.index <= $controller.tabs.length - 1
            )
                get()
        })

        window.addEventListener('keypress', ({ key, metaKey }) => {
            if (
                metaKey &&
                key === 'Enter' &&
                $controller.index >= 0 &&
                $controller.index <= $controller.tabs.length - 1
            )
                get()
        })
    })

    fetchStorage.subscribe((v) => {
        url = v.url
        method = v.method
        language = v.language
    })

    const save = () => {
        fetchStorage.update((storage) => ({
            ...storage,
            url,
            language,
            method
        }))

        saveFetchStorage()
    }

    const get = async () => {
        fetchResponse.update((v) => ({
            ...defaultResponse,
            error: !v.error?.startsWith('Lagrange Error: ') ? v.error : '',
            isLoading: true
        }))

        let headers

        try {
            headers = JSON.parse($fetchStorage.headers || '{}')
        } catch (err) {
            return fetchResponse.set({
                ...defaultResponse,
                error: 'Lagrange Error: Malform headers'
            })
        }

        let options: FetchOptions = {
            method: method as unknown as HttpVerb,
            headers,
            responseType: ResponseType.Text
        }

        if (method !== 'GET') {
            let variables

            if ($fetchStorage.language === 'graphql')
                try {
                    variables = JSON.parse($fetchStorage.variables)
                } catch (err) {
                    return fetchResponse.set({
                        ...defaultResponse,
                        error: 'Lagrange Error: Malform variables',
                        isLoading: false
                    })
                }

            try {
                if ($fetchStorage.type === 'form') {
                    options.body = Body.form(JSON.parse($fetchStorage.body))
                    options.headers['Content-Type'] =
                        'application/x-www-form-urlencoded'
                } else {
                    const body =
                        $fetchStorage.language === 'graphql'
                            ? {
                                  query: $fetchStorage.body
                                      .split('\n')
                                      .map((line) => line.split('#')[0])
                                      .join(''),
                                  variables
                              }
                            : JSON.parse($fetchStorage.body)

                    options.body = Body.json(body)
                    options.headers['Content-Type'] = 'application/json'
                }
            } catch (err) {
                return fetchResponse.set({
                    ...defaultResponse,
                    error: 'Lagrange Error: Malform Json body',
                    isLoading: false
                })
            }
        }

        const since = performance.now()

        try {
            const response = await fetch(url, options)

            const { data: value, headers: responseHeaders, status } = response

            fetchResponse.set({
                isLoading: false,
                response: trySerialize(value as string),
                error: null,
                headers: responseHeaders,
                status,
                duration: performance.now() - since
            })
        } catch (error) {
            if (
                error
                    ?.toString()
                    .includes('failed to lookup address information')
            )
                return fetchResponse.set({
                    ...defaultResponse,
                    isLoading: false,
                    error: 'Lagrange Error: Unable to resolve hostname',
                    duration: performance.now() - since
                })

            fetchResponse.set({
                ...defaultResponse,
                error: error?.toString(),
                duration: performance.now() - since
            })
        }
    }
</script>

<aside
    class={`flex items-center gap-2 w-full pb-1 px-2 pt-1.5 dark:text-white bg-white dark:bg-gray-900 ${
        $$props.class || ''
    }`}
>
    <select
        class="box-content appearance-none text-gray-600 dark:text-gray-100 h-8 px-2 rounded dark:bg-gray-800 border dark:border-gray-700 outline-none"
        style="width:{method?.length + 0.5}ch"
        bind:value={method}
        on:change={save}
    >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
        <option value="OPTIONS">OPTIONS</option>
        <option value="HEAD">HEAD</option>
    </select>
    <form
        class="box-content flex items-center w-full h-8 text-gray-600 dark:text-gray-100 pl-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded"
        on:submit|preventDefault={get}
    >
        <input
            class="appearance-none w-full bg-transparent outline-none"
            type="text"
            placeholder="localhost"
            spellcheck="false"
            bind:value={url}
            on:blur={save}
        />
        <button class="px-2">Send</button>
    </form>
</aside>
