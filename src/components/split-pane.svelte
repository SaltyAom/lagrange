<script>
    // @see https://svelte.dev/repl/b467a4787de3487fbe5c4508e8221268?version=3.42.1
    import { onMount } from 'svelte'
    export let minWidth = 30
    export let splitterWidth = 10
    let mousePos
    let delta = 0
    let isMouseDown = false
    let containerW
    let initialL
    let leftW
    let rightW

    onMount(() => {
        requestAnimationFrame(() => {
            leftW = ((containerW || window.innerWidth) - splitterWidth) / 2
            rightW = ((containerW || window.innerWidth) - splitterWidth) / 2
        })
    })

    function handleMouseMove(e) {
        if (isMouseDown) {
            delta = mousePos - e.clientX
            leftW =
                initialL - delta <= minWidth
                    ? minWidth
                    : initialL - delta >= containerW - splitterWidth - minWidth
                    ? containerW - splitterWidth - minWidth
                    : initialL - delta

            rightW = containerW - leftW - splitterWidth
        }
    }

    function handleMouseDown(e) {
        mousePos = e.clientX
        initialL = leftW
        isMouseDown = true
    }

    function handleMouseUp() {
        isMouseDown = false
    }

    $: if (
        leftW &&
        rightW & containerW &&
        leftW + rightW !== containerW - splitterWidth
    ) {
        const leftRatio = leftW / (leftW + rightW - splitterWidth / 2)
        leftW = containerW * leftRatio - splitterWidth / 2
        rightW = containerW - leftW - splitterWidth / 2
    }
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />
<section
    bind:clientWidth={containerW}
    class={`flex w-full h-full ${$$props.class || ''} ${isMouseDown ? 'disable-select' : ''}`}
>
    <div class="relative" style="width:{leftW}px">
        <slot name="left" />
        {#if isMouseDown}
            <div class="window-hook" />
        {/if}
    </div>
    <div
        on:mousedown={handleMouseDown}
        id="splitter"
        class="z-10 bg-white dark:bg-gray-800"
        style="width:{splitterWidth}px"
    >
        <div class="w-[1px] h-full bg-gray-300 dark:bg-gray-600 mx-auto" />
    </div>
    <div class="relative" style="width:{rightW}px">
        <slot name="right" />
        {#if isMouseDown}
            <div class="window-hook" />
        {/if}
    </div>
</section>

<style>
    #splitter {
        cursor: col-resize;
    }

    div.window-hook {
        height: 100%;
        width: 100%;
        z-index: 5000;
        position: absolute;
        top: 0;
        left: 0;
    }

    .disable-select,
    .disable-select * {
        user-select: none; /* supported by Chrome and Opera */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        cursor: col-resize;
    }
</style>
