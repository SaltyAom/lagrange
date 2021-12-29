<script lang="ts">
    import fetchStorage from '../store/fetch'
    import controller from '../store/controller'
    import { saveFetchStorage } from '../store/deriveSave'

    import fetchSchema from '../lib/fetchSchema'
    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'
    import { detectLanguage } from '../lib/language'

    import { buildClientSchema, printSchema } from 'graphql'
    import type { IntrospectionQuery } from 'graphql'

    import { initializeMode } from 'monaco-graphql/esm/initializeMode'

    import { FileIcon, XIcon } from 'svelte-feather-icons'
    import HeightResize from './height-resize.svelte'

    let editorDebounce: number
    let requestEditorChange = false

    let prevIndex: number
    let prevUrl: string
    let schema: IntrospectionQuery | null

    let viewSchema = false

    const gqlLanguageService = initializeMode()

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { Monaco, editor, updateEditor }
    }) => {
        prevIndex = $controller.index

        fetchStorage.subscribe(async ({ body, language }) => {
            if (!editor) return

            updateEditor(body, language, {
                overwrite: requestEditorChange
            })

            requestEditorChange = false
        })

        fetchStorage.subscribe(async ({ url }) => {
            if (url === prevUrl) return

            schema = null
            viewSchema = false
            prevUrl = url

            try {
                let _schema = await fetchSchema(url)
                schema = _schema

                gqlLanguageService.setSchemaConfig([
                    {
                        // schema,
                        uri: 'https://akashic.opener.studio/v1/graphql',
                        introspectionJSON: schema
                    }
                ])

                updateGqlDocEditor(
                    printSchema(buildClientSchema(schema)),
                    'graphql'
                )
            } catch (err) {
                gqlLanguageService.setSchemaConfig([])
            }
        })

        controller.subscribe(({ index }) => {
            if (index === prevIndex) return

            requestEditorChange = true
        })

        updateEditor($fetchStorage.body, $fetchStorage.language)

        editor.onDidChangeModelContent(() => {
            if (editorDebounce) clearTimeout(editorDebounce)

            editorDebounce = setTimeout(() => {
                editorDebounce = null

                let body = editor.getValue()
                let language = detectLanguage(body)

                if (language !== $fetchStorage.language)
                    $fetchStorage.language = language
            }, 100) as unknown as number
        })

        editor.onDidBlurEditorText(() => {
            $fetchStorage.body = editor.getValue()
            saveFetchStorage()
        })

        editor.addCommand(Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter, () => {
            $fetchStorage.body = editor.getValue()
            window.dispatchEvent(new CustomEvent('fetch-request'))
        })
    }

    const onEditorDestroy = () => {
        saveFetchStorage()
    }

    let updateGqlDocEditor: EditorConfig['updateEditor']

    const onSchemaViewerReady: EditorConfig['handleCustomEvent'] = ({
        detail: { updateEditor }
    }) => {
        updateGqlDocEditor = updateEditor
    }

    const toggleSchema = () => {
        viewSchema = !viewSchema
    }
</script>

<HeightResize
    class={`absolute z-20 bottom-0 flex flex-col w-full h-1/2 bg-white dark:bg-gray-800 ${
        viewSchema ? '' : 'hidden'
    }`}
>
    <div
        class="w-full h-full"
        use:editor={{
            readOnly: true
        }}
        on:editorReady={onSchemaViewerReady}
    />
</HeightResize>

{#if schema}
    <button
        class="z-20 absolute bottom-3 right-6 flex justify-center items-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-700 w-8 h-8 p-1.5 rounded-lg shadow-lg border dark:border-gray-700"
        title="View GraphQL Schema"
        aria-label="View GraphQL Schema"
        on:click={toggleSchema}
    >
        {#if viewSchema}
            <XIcon strokeWidth={1.5} />
        {:else}
            <FileIcon strokeWidth={1.5} />
        {/if}
    </button>
{/if}

<section
    use:editor
    on:editorReady={onEditorReady}
    on:editorDestroy={onEditorDestroy}
    class={`content-app w-full h-screen dark:text-white ${$$props.class}`}
/>
