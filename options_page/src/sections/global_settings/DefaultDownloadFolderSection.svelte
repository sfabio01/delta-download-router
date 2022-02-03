<script>
    import { options } from "./../../stores";
    import * as utils from "./../../utils";

    const defaultDownloadFolderKey = "defaultDownloadFolder";

    function deleteDefaultDownloadFolder() {
        let yes = confirm(
            "Are you sure you want to delete the default download folder?\n" +
                "Folder: " +
                $options[defaultDownloadFolderKey]
        );
        if (yes) {
            chrome.storage.local.remove(defaultDownloadFolderKey, function () {
                // DEBUG:
                // console.log("Rule deleted: " + key);

                options.update((o) => {
                    delete o[defaultDownloadFolderKey];
                    return o;
                });
            });
        }
    }

    function editDefaultDownloadFolder() {
        // Used also for editing default download folder
        let newFolder = prompt(
            "Edit default download folder",
            $options[defaultDownloadFolderKey]
        );
        if (!newFolder) {
            return;
        }
        newFolder = newFolder.trim();
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            chrome.storage.local.set(
                { [defaultDownloadFolderKey]: newFolder },
                function () {
                    // DEBUG:
                    // console.log("Rule edited: {" + defaultDownloadFolderKey + ": " + newFolder + "}");
                    options.update((o) => {
                        o[defaultDownloadFolderKey] = newFolder;
                        return o;
                    });
                }
            );
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
</script>

<main>
    <h3>Default download folder</h3>
    <div class="box">
        <div class="block-item">
            <div class="row align-items-center">
                <div class="col-8">
                    <div class="title">Default download folder</div>
                    <div class="subtitle">
                        {#if $options["defaultDownloadFolder"]}{$options[
                                "defaultDownloadFolder"
                            ]}{:else}Not defined{/if}
                    </div>
                </div>
                <div class="col text-end">
                    <button
                        on:click={editDefaultDownloadFolder}
                        class="btn btn-primary btn-sm"
                        ><img src="./../icons/edit.svg" alt="edit" /></button
                    >
                    <button
                        on:click={deleteDefaultDownloadFolder}
                        class="btn btn-danger btn-sm"
                        ><img
                            src="./../icons/delete.svg"
                            alt="delete"
                        /></button
                    >
                </div>
            </div>
        </div>

        {#if !$options["defaultDownloadFolder"]}
            <div
                class="alert alert-warning"
                style="border-radius: 8px;"
                role="alert"
            >
                It's important you set the default download folder in case no
                rule matches. If you don't, the default folder will be the one
                set in the browser settings.
            </div>
        {/if}
    </div>
</main>
