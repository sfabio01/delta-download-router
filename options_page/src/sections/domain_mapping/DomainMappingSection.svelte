<script>
    import DomainMappingSettings from "./components/DomainMappingSettings.svelte";
    import DomainUrlMappings from "./components/DomainUrlMappings.svelte";
    export let domainToFolderArr;
</script>

<main>
    <h3>Domain and URL Mapping</h3>
    <DomainUrlMappings {domainToFolderArr} />
    <DomainMappingSettings />
</main>
