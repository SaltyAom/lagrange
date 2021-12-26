<script lang="ts">
    import active, { pages } from '../store/page'
    import type { Page } from '../store/page'

    const setActiveTab = (tab: Page) => () => {
        active.set(tab)
    }
</script>

<aside
    class={`flex gap-1 text-sm w-full bg-white dark:bg-gray-800 h-[35px] px-2 pt-0.5 pb-1 border-b border-gray-200 dark:border-gray-700 ${
        $$props.class || ''
    }`}
>
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
