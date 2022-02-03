<script>
    import { options } from "./../../stores";
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
                $options[key]
        );
        if (yes) {
            chrome.storage.local.remove(key, function () {
                // DEBUG:
                // console.log("Rule deleted: " + key);

                options.update((o) => {
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
            $options[key]
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
                options.update((o) => {
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
            <div class="block-item">
                <div class="row align-items-center">
                    <div class="col">
                        <div class="title capitalize">
                            {key}
                            <img
                                title={value}
                                src="./../icons/help.svg"
                                alt="help"
                            />
                        </div>

                        <div class="subtitle">
                            {#if filetypeToFolderObj[key]}{filetypeToFolderObj[
                                    key
                                ]}{:else}Rule not defined{/if}
                        </div>
                    </div>
                    <div class="col text-end">
                        <button
                            on:click={() => {
                                editFiletypeRule(key);
                            }}
                            class="btn btn-primary btn-sm"
                            ><img
                                src="./../icons/edit.svg"
                                alt="edit"
                            /></button
                        >
                        <button
                            on:click={() => deleteFiletypeRule(key)}
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
</main>
