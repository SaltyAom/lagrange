<script lang="ts">
    import page from './store/page'
    import useDeriveSave from './store/deriveSave'
    import controller from './store/controller'

    import Editor from './components/editor.svelte'
    import Tab from './components/tab.svelte'
    import Preview from './components/preview.svelte'
    import Controller from './components/controller.svelte'
    import SplitPane from './components/split-pane.svelte'
    import SubTab from './components/sub-tab.svelte'
    import HeaderEditor from './components/header-editor.svelte'
    import GqlVariableEditor from './components/variable-editor.svelte'

    import './styles/tailwind.css'

    $: hideIfInvalid =
        $controller.index < 0 ||
        $controller.index > $controller.tabs.length - 1 ||
        !$controller.tabs.length
            ? 'hidden'
            : ''

    useDeriveSave()
</script>

<Tab />
<Controller class={hideIfInvalid} />
<SubTab class={hideIfInvalid} />

<main class="flex">
    <SplitPane class={hideIfInvalid} minWidth={50}>
        <main slot="left">
            <Editor class={$page !== 'body' ? 'hidden' : ''} />
            <HeaderEditor class={$page !== 'headers' ? 'hidden' : ''} />
            <GqlVariableEditor
                class={$page !== 'gql variables' ? 'hidden' : ''}
            />
        </main>
        <Preview slot="right" />
    </SplitPane>
</main>
