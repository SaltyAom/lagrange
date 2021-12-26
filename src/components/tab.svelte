<script lang="ts">
    import { onMount } from 'svelte'

    import controller from '../store/controller'
    import response, { defaultResponse } from '../store/response'
    import { movePersistedFile, saveFetchStorage } from '../store/deriveSave'

    import { PlusIcon, XIcon } from 'svelte-feather-icons'

    const newTab = () => {
        controller.update((v) => ({
            ...v,
            index: $controller.tabs.length,
            tabs: [
                ...$controller.tabs,
                {
                    label: 'New Tab'
                }
            ]
        }))
    }

    const setActiveTab = (index: number) => async () => {
        response.set(defaultResponse)

        await saveFetchStorage($controller.index)

        controller.update((v) => ({
            ...v,
            index
        }))
    }

    const closeTab = (index: number) => async () => {
        const tabs = [...$controller.tabs]
        tabs.splice(index, 1)

        await movePersistedFile(index)

        controller.update((v) => ({
            ...v,
            tabs,
            index: index < tabs.length ? index : tabs.length - 1
        }))
    }

    const switchTo = (index: number) => () => {
        if (index < $controller.tabs.length) {
            setActiveTab(index)()
        }
    }

    onMount(async () => {
        window.addEventListener('keypress', ({ metaKey, key }) => {
            if (metaKey) {
                switch (key) {
                    case 't':
                        newTab()
                        break

                    case '1':
                        switchTo(0)()
                        break

                    case '2':
                        switchTo(1)()
                        break

                    case '3':
                        switchTo(2)()
                        break

                    case '4':
                        switchTo(3)()
                        break

                    case '5':
                        switchTo(4)()
                        break

                    case '6':
                        switchTo(5)()
                        break

                    case '7':
                        switchTo(6)()
                        break

                    case '8':
                        switchTo(7)()
                        break

                    case '9':
                        switchTo(8)()
                        break
                }
            }
        })
    })
</script>

<nav
    id="tab"
    class="flex items-center gap-2 w-full h-11 px-2 py-1.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-y-hidden"
>
    {#each $controller.tabs as tab, index (index)}
        {#if index === $controller.index}
            <div
                class="flex items-center h-full pl-2 pr-0.5 bg-white dark:bg-gray-700 border rounded dark:border-gray-700 shadow-md gap-2"
            >
                <input
                    bind:value={$controller.tabs[index].label}
                    class="appearance-none bg-transparent dark:text-white outline-none"
                    autocomplete="off"
                    style="width:{tab.label.length >= 5
                        ? tab.label.length
                        : 5}ch"
                />
                <button
                    class="flex justify-center items-center w-6 h-6 p-1 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    on:click|preventDefault={closeTab(index)}><XIcon /></button
                >
            </div>
        {:else}
            <button
                class="flex items-center h-full px-2 dark:text-gray-400 rounded gap-6 border border-transparent whitespace-nowrap"
                on:click|preventDefault={setActiveTab(index)}
                >{tab.label}
            </button>
        {/if}
    {/each}

    <button
        on:click={newTab}
        class="flex justify-center items-center dark:text-white w-8 h-8 p-2 rounded bg-white dark:bg-gray-700 border dark:border-gray-800 transform opacity-60 hover:opacity-100 focus:opacity-100 hover:shadow-lg focus:shadow-lg transition-shadow"
        ><PlusIcon class="w-8" /></button
    >
</nav>

<style>
    #tab {
        @apply overflow-x-hidden;
    }

    #tab:hover,
    #tab:focus {
        @apply overflow-x-auto;
    }

    #tab::-webkit-scrollbar {
        height: 0.25em;
    }

    #tab::-webkit-scrollbar-thumb {
        @apply bg-gray-300;
        border-radius: 0.5em;
    }

    @media (prefers-color-scheme: dark) {
        #tab::-webkit-scrollbar-thumb {
            background-color: rgb(55, 65, 81);
        }
    }
</style>
