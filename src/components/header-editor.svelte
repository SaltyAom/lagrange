<script lang="ts">
    import fetchStorage from '../store/fetch'
    import { saveFetchStorage } from '../store/deriveSave'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    let prevHeaders = ''

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { editor, updateEditor }
    }) => {
        updateEditor($fetchStorage.headers, 'json')

        fetchStorage.subscribe(async ({ headers }) => {
            if (!editor) return
            if (headers === prevHeaders) return

            prevHeaders = headers

            updateEditor(headers, "json")
        })

        editor.onDidBlurEditorText(() => {
            $fetchStorage.headers = editor.getValue()
            saveFetchStorage()
        })

        editor.onKeyDown(({ browserEvent: { key, metaKey } }) => {
            if (metaKey && key === 'Enter') {
                const pos = editor.getPosition()

                $fetchStorage.headers = editor.getValue()

                window.dispatchEvent(new CustomEvent('fetch-request'))

                requestAnimationFrame(() => {
                    editor.setPosition(pos)
                })
            }
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
    class={`w-full h-screen dark:text-white ${$$props.class}`}
/>
