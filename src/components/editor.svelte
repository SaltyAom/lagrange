<script lang="ts">
    import fetchStorage from '../store/fetch'
    import { saveFetchStorage } from '../store/deriveSave'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    import { detectLanguage } from '../lib/language'

    let editorDebounce: number

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { editor, updateEditor }
    }) => {
        fetchStorage.subscribe(async ({ body, language }) => {
            if (!editor) return

            updateEditor(body, language)
        })

        updateEditor($fetchStorage.body, $fetchStorage.language)

        editor.onDidChangeModelContent(() => {
            if (editorDebounce) clearTimeout(editorDebounce)

            editorDebounce = setTimeout(() => {
                editorDebounce = null

                let body = editor.getValue()
                let language = detectLanguage(body)

                if (language !== $fetchStorage.language) {
                    $fetchStorage.language = language
                    updateEditor(body, language)
                }
            }, 100) as unknown as number
        })

        editor.onDidBlurEditorText(() => {
            $fetchStorage.body = editor.getValue()
            saveFetchStorage()
        })

        editor.onKeyDown(
            ({ browserEvent: { key, metaKey, stopPropagation } }) => {
                if (metaKey && key === 'Enter') {
                    const pos = editor.getPosition()

                    $fetchStorage.body = editor.getValue()
                    window.dispatchEvent(new CustomEvent('fetch-request'))
                }
            }
        )
    }

    const onEditorDestroy = () => {
        saveFetchStorage()
    }
</script>

<section
    use:editor
    on:editorReady={onEditorReady}
    on:editorDestroy={onEditorDestroy}
    class={`w-full h-screen dark:text-white ${$$props.class}`}
/>
