<script>
    import { onMount } from 'svelte'

    export let splitterWidth = 10
    let isMouseDown = false
    let leftW
    let rightW

    onMount(() => {
        requestAnimationFrame(() => {
            leftW = (window.innerWidth - splitterWidth) / 2
            rightW = (window.innerWidth - splitterWidth) / 2
        })
    })

    const handleMouseMove = (e) => {
        if (!isMouseDown) return

        leftW = e.clientX
        rightW = Math.abs(window.innerWidth - leftW - splitterWidth)
    }

    const handleMouseDown = () => {
        isMouseDown = true
    }

    const handleMouseUp = () => {
        isMouseDown = false
    }
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />
<section
    class={`flex w-full h-full ${$$props.class || ''} ${
        isMouseDown ? 'disable-select' : ''
    }`}
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
