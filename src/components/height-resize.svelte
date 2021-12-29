<script lang="ts">
    import { onMount } from 'svelte'

    let dragging = false
    let height

    onMount(() => {
        height = window.innerHeight / 2
    })

    const onMouseDown = () => {
        dragging = true
    }

    const onMouseMove = (e) => {
        if (!dragging) return

        const newHeight = Math.abs(window.innerHeight - e.clientY)

        if (newHeight > window.innerHeight - 123 || newHeight < 100) return

        height = Math.abs(window.innerHeight - e.clientY)
    }

    const onMouseUp = () => {
        dragging = false
    }
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />
<section class={$$props.class} style="height:{height}px">
    <div class="z-20 flex items-center w-full h-[6px] bg-transparent cursor-row-resize " on:mousedown={onMouseDown}>
        <div class="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
    </div>

    <slot />
</section>
