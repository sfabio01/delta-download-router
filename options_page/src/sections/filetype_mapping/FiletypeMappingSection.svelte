<script>
    import { objs } from "./../../stores";
    import * as utils from "./../../utils";
    import * as types from "./../../types";

    export let filetypeToFolderObj;

    function deleteFiletypeRule(key) {
        let yes = confirm(
            "Are you sure you want to delete the following rule?\n" +
                "Filetype: " +
                key +
                "\n" +
                "Folder: " +
                $objs[key]
        );
        if (yes) {
            chrome.storage.local.remove(key, function () {
                // DEBUG:
                // console.log("Rule deleted: " + key);

                objs.update((o) => {
                    delete o[key];
                    return o;
                });
            });
        }
    }

    function editFiletypeRule(key) {
        // Used also for editing default download folder
        let newFolder = prompt(
            "Filetype: " + key + "\nEdit Folder",
            $objs[key]
        );
        if (!newFolder) {
            return;
        }
        newFolder = newFolder.trim();
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            chrome.storage.local.set({ [key]: newFolder }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + key + ": " + newFolder + "}");
                objs.update((o) => {
                    o[key] = newFolder;
                    return o;
                });
            });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
</script>

<main>
    <h3>Filetype Mapping</h3>
    <div class="box">
        {#each Object.entries(types.fileTypes) as [key, value]}
            <div class="row-item">
                <span class="item-title capitalize"
                    >{key}
                    <img
                        title={value}
                        src="./../icons/help.svg"
                        alt="help"
                    /></span
                >
                <span class="item-subtitle"
                    >{#if filetypeToFolderObj[key]}{filetypeToFolderObj[
                            key
                        ]}{:else}Rule not defined{/if}</span
                >
                <div class="item-btn-group">
                    <button
                        on:click={() => {
                            editFiletypeRule(key);
                        }}
                        class="item-btn btn btn-primary btn-sm"
                        ><img src="./../icons/edit.svg" alt="edit" /></button
                    >
                    <button
                        on:click={() => deleteFiletypeRule(key)}
                        class="item-btn btn btn-danger btn-sm"
                        ><img
                            src="./../icons/delete.svg"
                            alt="delete"
                        /></button
                    >
                </div>
            </div>
        {/each}
    </div>
</main>
