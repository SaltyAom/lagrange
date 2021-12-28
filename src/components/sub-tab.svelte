<script lang="ts">
    import fetchStorage from '../store/fetch'
    import active, { pages, mapOptionWidth } from '../store/page'
    import type { Page } from '../store/page'
    import { saveFetchStorage } from '../store/deriveSave'

    import { ChevronDownIcon } from 'svelte-feather-icons'

    const setActiveTab = (tab: Page) => () => {
        active.set(tab)
    }

    const saveOption = async () => {
        await saveFetchStorage()
    }
</script>

<aside
    class={`flex gap-1 text-sm w-full bg-white dark:bg-gray-800 h-[35px] px-2 pt-0.5 pb-1 border-b border-gray-200 dark:border-gray-700 ${
        $$props.class || ''
    }`}
>
    {#if $active === 'body'}
        <div class="relative inline-flex items-center dark:text-gray-300">
            <select
                bind:value={$fetchStorage.type}
                class="box-content appearance-none inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded capitalize whitespace-nowrap bg-transparent outline-none"
                style={`width:${mapOptionWidth[$fetchStorage.type]}ch`}
                on:change={saveOption}
            >
                <option>body</option>
                <option>form</option>
            </select>
            <ChevronDownIcon
                class="absolute w-4 h-4 right-1.5 pointer-events-none"
            />
        </div>
    {:else}
        <button
            on:click={setActiveTab('body')}
            class="inline-flex items-center px-2 py-1 text-gray-400 dark:text-gray-600 capitalize whitespace-nowrap"
            >{$fetchStorage.type}
        </button>
    {/if}

    {#each pages as tab (tab)}
        {#if tab === $active}
            <button
                class="dark:text-gray-300 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded capitalize whitespace-nowrap"
            >
                {tab}
            </button>
        {:else}
            <button
                on:click={setActiveTab(tab)}
                class="px-2 py-1 text-gray-400 dark:text-gray-600 capitalize whitespace-nowrap"
                >{tab}</button
            >
        {/if}
    {/each}
</aside>
