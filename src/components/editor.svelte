<script lang="ts">
    import fetchStorage from '../store/fetch'
    import controller from '../store/controller';
    import { saveFetchStorage } from '../store/deriveSave'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    import { detectLanguage } from '../lib/language'

    let editorDebounce: number
    let prevIndex: number
    let requestEditorChange = false

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { Monaco, editor, updateEditor }
    }) => {
        prevIndex = +$controller.index

        fetchStorage.subscribe(async ({ body, language }) => {
            if (!editor) return

            updateEditor(body, language, {
                overwrite: requestEditorChange
            })
            requestEditorChange = false
        })

        controller.subscribe(({ index }) => {
            if(index === prevIndex) return

            console.log(index, prevIndex)

            requestEditorChange = true
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
