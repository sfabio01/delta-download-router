<script>
    import DomainMappingItem from "./DomainMappingItem.svelte";

    export let domainToFolderArr;
</script>

<main>
    <div class="box">
        {#each domainToFolderArr as [key, value]}
            <DomainMappingItem
                domainName={key}
                domainFolder={value["folder"]}
                paths={value["paths"]}
            />
        {/each}

        <p class="hint-text" style="text-align: center; margin-top: 8px;">
            You can add a new rule by clicking the extension icon <img
                src="./../icons/delta_32.png"
                alt="delta"
                width="16px"
            /> next to the address bar when you are visiting a website
        </p>
    </div>
</main>
