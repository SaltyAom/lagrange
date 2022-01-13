<script lang="ts">
    import { onMount } from 'svelte'

    let dragging = false
    let height

    onMount(() => {
        height = 50
    })

    const onMouseDown = () => {
        dragging = true
    }

    const onMouseMove = (e) => {
        if (!dragging) return

        const newHeight = 100 - (e.clientY / window.innerHeight * 100)

        if (newHeight < 2.5 || newHeight > 100) return

        height = newHeight
    }

    const onMouseUp = () => {
        dragging = false
    }
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />
<section class={$$props.class} style="height:{height}vh">
    <div class="z-20 flex items-center w-full h-[6px] bg-transparent cursor-row-resize" on:mousedown={onMouseDown}>
        <div class="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
    </div>

    <slot />
</section>
