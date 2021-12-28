<script lang="ts">
    import response from '../store/response'
    import responsePage, { responsePages } from '../store/response-tab'
    import type { ResponsePage } from '../store/response-tab'

    const setActiveTab = (tab: ResponsePage) => () => {
        responsePage.set(tab)
    }

    const colorMap = {
        '1': 'bg-blue-500',
        '2': 'bg-green-600',
        '3': 'bg-yellow-500',
        '4': 'bg-red-500',
        '5': 'bg-red-500'
    }

    const getColor = (status: number) => {
        let value = `${status}`

        return colorMap[value[0]] || '!text-transparent'
    }
</script>

<aside
    class={`flex items-center gap-1 text-sm w-full bg-white dark:bg-gray-800 h-[35px] px-2 pt-0.5 pb-1 border-b border-gray-200 dark:border-gray-700 ${
        $$props.class || ''
    }`}
>
    <h6
        id="status-code"
        class={`flex items-center text-white font-medium h-6 px-2 rounded cursor-default ${getColor(
            $response.status
        )}`}
        title="Response Status"
    >
        {$response.status || '200'}
    </h6>
    <div class="w-[1px] h-6 mx-2 bg-gray-300 dark:bg-gray-600" />
    {#each responsePages as tab (tab)}
        {#if tab === $responsePage}
            <button
                class="dark:text-gray-300 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded capitalize whitespace-nowrap"
            >
                {tab}
            </button>
        {:else}
            <button
                class="px-2 py-1 text-gray-400 dark:text-gray-600 capitalize whitespace-nowrap"
                on:click={setActiveTab(tab)}>{tab}</button
            >
        {/if}
    {/each}
</aside>

<style>
    #status-code {
        user-select: none;
        -webkit-user-select: none;
        font-variant-numeric: tabular-nums;
    }
</style>
