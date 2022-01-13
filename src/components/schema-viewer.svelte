<script lang="ts">
    import fetchStorage from '../store/fetch'
    import sharedSchema, { defaultSharedSchema } from '../store/schema'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'
    import fetchSchema from '../lib/fetchSchema'

    import { buildClientSchema, printSchema } from 'graphql'
    import type { IntrospectionQuery } from 'graphql'

    import { FileIcon, XIcon } from 'svelte-feather-icons'
    import HeightResize from './height-resize.svelte'

    let schema: IntrospectionQuery | null

    let isViewingSchema = false

    let updateSchemaViewer: EditorConfig['updateEditor']

    let prevUrl: string

    const onSchemaViewerReady: EditorConfig['handleCustomEvent'] = ({
        detail: { updateEditor }
    }) => {
        updateSchemaViewer = updateEditor

        fetchStorage.subscribe(async ({ url }) => {
            if (url === prevUrl) return

            schema = null
            isViewingSchema = false
            prevUrl = url
            sharedSchema.set(defaultSharedSchema)

            try {
                schema = await fetchSchema(url)

                if (url !== prevUrl) return

                updateSchemaViewer(
                    printSchema(buildClientSchema(schema)),
                    'graphql',
                    {
                        overwrite: true
                    }
                )

                sharedSchema.set({
                    schema
                })
            } catch (err) {}
        })
    }

    const toggleSchema = () => {
        isViewingSchema = !isViewingSchema
    }
</script>

<HeightResize
    class={`absolute z-20 bottom-0 flex flex-col w-full h-1/2 bg-white dark:bg-gray-800 ${
        isViewingSchema ? '' : 'hidden'
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
        {#if isViewingSchema}
            <XIcon strokeWidth={1.5} />
        {:else}
            <FileIcon strokeWidth={1.5} />
        {/if}
    </button>
{/if}
