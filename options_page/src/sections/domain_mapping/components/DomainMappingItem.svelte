<script>
    import { options } from "./../../../stores";
    import * as utils from "./../../../utils";

    export let domainName;
    export let domainFolder;
    export let paths;

    async function editDomainRule() {
        let newFolder = prompt(
            "Domain: " + domainName + "\nEdit Folder",
            domainFolder
        );
        if (!newFolder) {
            return;
        }
        newFolder = newFolder.trim();
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            options.update((o) => {
                o[domainName].folder = newFolder;
                return o;
            });

            chrome.storage.local.set({ [domainName]: $options[domainName] });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
    function deleteDomainRule() {
        let yes = confirm(
            "Are you sure you want to delete the following domain, and all its paths?\n" +
                domainName
        );
        if (yes) {
            options.update((o) => {
                delete o[domainName];
                return o;
            });
            chrome.storage.local.remove(domainName);
        }
    }

    function deletePathRule(path) {
        let yes = confirm(
            "Are you sure you want to delete the following URL?\n" +
                domainName +
                path
        );
        if (yes) {
            options.update((o) => {
                delete o[domainName].paths[path];
                return o;
            });
            chrome.storage.local.set({ [domainName]: $options[domainName] });
        }
    }

    function editPathRule(path) {
        let newFolder = prompt(
            "URL: " + domainName + path + "\nEdit Folder",
            paths[path]
        );

        if (!newFolder) {
            return;
        }
        newFolder = newFolder.trim();
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            options.update((o) => {
                o[domainName].paths[path] = newFolder;
                return o;
            });

            chrome.storage.local.set({ [domainName]: $options[domainName] });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
</script>

<div class="block-item">
    <div class="row align-items-center">
        <div class="col-8">
            <div class="title">{domainName}</div>
            <div class="subtitle">{domainFolder}</div>
        </div>

        <div class="col text-end">
            <button on:click={editDomainRule} class="btn btn-primary btn-sm"
                ><img src="./../icons/edit.svg" alt="edit" /></button
            >
            <button on:click={deleteDomainRule} class="btn btn-danger btn-sm"
                ><img src="./../icons/delete.svg" alt="delete" /></button
            >
        </div>
    </div>
    {#each Object.entries(paths) as [path, folder]}
        <div class="paths">
            <div class="row align-items-center">
                <div class="col-8">
                    <div class="title2">{path}</div>
                    <div class="subtitle2">{folder}</div>
                </div>
                <div class="col text-end">
                    <button
                        on:click={() => {
                            editPathRule(path);
                        }}
                        class="btn btn-primary btn-sm"
                        ><img src="./../icons/edit.svg" alt="edit" /></button
                    >
                    <button
                        on:click={() => {
                            deletePathRule(path);
                        }}
                        class="btn btn-danger btn-sm"
                        ><img
                            src="./../icons/delete.svg"
                            alt="delete"
                        /></button
                    >
                </div>
            </div>
        </div>
    {/each}
</div>
