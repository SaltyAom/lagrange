<script lang="ts">
    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    import { detectLanguage } from '../lib/language'

    import fetchResponse from '../store/response'

    let preview = ''
    let localError = ''

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { updateEditor }
    }) => {
        fetchResponse.subscribe(({ response, error }) => {
            if (error)
                return error.startsWith('Lagrange Error: ')
                    ? (localError = error.replace('Lagrange Error: ', ''))
                    : updateEditor(error, detectLanguage(error))

            localError = ''
            if (preview === response) return

            preview = response
            updateEditor(response, detectLanguage(response))
        })
    }
</script>

{#if localError}
    <section
        class="z-10 absolute flex flex-col justify-center items-center gap-2 w-full h-full bg-white dark:bg-gray-800 app-safe-area"
    >
        <img
            class="w-36 h-36 object-contain object-center"
            src="/red.gif"
            alt="Griffon"
        />
        <h6 class="text-xl text-gray-600 dark:text-gray-200">{localError}</h6>
        <p class="text-sm text-gray-400 dark:text-gray-500">
            {#if localError.includes('Malform headers')}
                Invalid JSON format in <button>Headers</button>
            {:else if localError.includes('Malform variables')}
                Invalid JSON format in <button>Variables</button>
            {/if}
        </p>
    </section>
{/if}
<div
    use:editor
    on:editorReady={onEditorReady}
    class="w-full h-screen dark:text-white"
/>
{#if $fetchResponse.isLoading}
    <div
        class="absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full text-gray-900 dark:text-gray-300 app-safe-area bg-white dark:bg-gray-800"
    >
        <img class="w-36 h-36 mb-4 object-contain object-center" src="/a-chan.gif" alt="Loading" />
        <h4 class="text-xl">Loading...</h4>
    </div>
{/if}
