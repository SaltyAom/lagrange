<script lang="ts">
    import fetchStorage from '../store/fetch'
    import { saveFetchStorage } from '../store/deriveSave'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    let prevVariables = ''

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { Monaco, editor, updateEditor }
    }) => {
        updateEditor($fetchStorage.variables, 'json')

        fetchStorage.subscribe(async ({ variables, language }) => {
            if (!editor) return
            if (variables === prevVariables) return

            prevVariables = variables

            updateEditor(variables, 'json')
        })

        editor.onDidBlurEditorText(() => {
            $fetchStorage.variables = editor.getValue()
            saveFetchStorage()
        })

        editor.addCommand(Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter, () => {
            $fetchStorage.variables = editor.getValue()
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
