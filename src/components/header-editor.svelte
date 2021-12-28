<script lang="ts">
    import fetchStorage from '../store/fetch'
    import { saveFetchStorage } from '../store/deriveSave'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    let prevHeaders = ''

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { Monaco, editor, updateEditor }
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

        editor.addCommand(Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter, () => {
            $fetchStorage.headers = editor.getValue()
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
