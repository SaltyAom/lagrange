<script lang="ts">
    import fetchStorage from '../store/fetch'
    import controller from '../store/controller'
    import { saveFetchStorage } from '../store/deriveSave'

    import fetchSchema from '../lib/fetchSchema'
    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'
    import { detectLanguage } from '../lib/language'

    import { initializeMode } from 'monaco-graphql/esm/initializeMode'

    let editorDebounce: number
    let requestEditorChange = false

    let prevIndex: number
    let prevUrl: string

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

            prevUrl = url

            try {

                let schema = await fetchSchema(url)

                gqlLanguageService.setSchemaConfig([
                    {
                        // schema,
                        uri: 'https://akashic.opener.studio/v1/graphql',
                        introspectionJSON: schema
                    }
                ])
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
</script>

<section
    use:editor
    on:editorReady={onEditorReady}
    on:editorDestroy={onEditorDestroy}
    class={`content-app w-full h-screen dark:text-white ${$$props.class}`}
/>
