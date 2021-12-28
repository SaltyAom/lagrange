<script lang="ts">
    import page from './store/page'
    import responsePage from './store/response-tab'
    import useDeriveSave from './store/deriveSave'
    import controller from './store/controller'

    import Welcome from './components/welcome.svelte'

    import Controller from './components/controller.svelte'
    import Tab from './components/tab.svelte'
    import SplitPane from './components/split-pane.svelte'

    import SubTab from './components/sub-tab.svelte'
    import Editor from './components/editor.svelte'
    import HeaderEditor from './components/header-editor.svelte'
    import GqlVariableEditor from './components/variable-editor.svelte'

    import Response from './components/response.svelte'
    import ResponseTab from './components/response-tab.svelte'
    import ResponseHeader from './components/response-header.svelte'
    import ResponseStatus from './components/response-status.svelte'

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

<Welcome
    class={$controller.index < 0 ||
    $controller.index > $controller.tabs.length - 1
        ? ''
        : 'hidden'}
/>

<main class="content-app flex">
    <SplitPane class={hideIfInvalid} minWidth={50}>
        <main class="flex flex-col" slot="left">
            <SubTab class={hideIfInvalid} />
            <Editor class={$page !== 'body' ? 'hidden' : ''} />
            <HeaderEditor class={$page !== 'headers' ? 'hidden' : ''} />
            <GqlVariableEditor
                class={$page !== 'gql variables' ? 'hidden' : ''}
            />
        </main>
        <section class="flex flex-col" slot="right">
            <ResponseTab />

            <div class="relative flex flex-col w-full">
                <ResponseStatus />

                <Response class={$responsePage !== 'body' ? 'hidden' : ''} />
                <ResponseHeader
                    class={$responsePage !== 'headers' ? 'hidden' : ''}
                />
            </div>
        </section>
    </SplitPane>
</main>
