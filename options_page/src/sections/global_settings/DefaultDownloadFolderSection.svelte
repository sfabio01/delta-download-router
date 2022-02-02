<script>
    import { objs } from "./../../stores";
    import * as utils from "./../../utils";

    const defaultDownloadFolderKey = "defaultDownloadFolder";

    function deleteDefaultDownloadFolder() {
        let yes = confirm(
            "Are you sure you want to delete the default download folder?\n" +
                "Folder: " +
                $objs[defaultDownloadFolderKey]
        );
        if (yes) {
            chrome.storage.local.remove(defaultDownloadFolderKey, function () {
                // DEBUG:
                // console.log("Rule deleted: " + key);

                objs.update((o) => {
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
            $objs[defaultDownloadFolderKey]
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
                    objs.update((o) => {
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
        <div class="row-item">
            <span class="item-title">Default download folder</span>
            <span class="item-subtitle"
                >{#if $objs["defaultDownloadFolder"]}{$objs[
                        "defaultDownloadFolder"
                    ]}{:else}Not defined{/if}</span
            >
            <div class="item-btn-group">
                <button
                    on:click={editDefaultDownloadFolder}
                    class="item-btn btn btn-primary btn-sm"
                    ><img src="./../icons/edit.svg" alt="edit" /></button
                >
                <button
                    on:click={deleteDefaultDownloadFolder}
                    class="item-btn btn btn-danger btn-sm"
                    ><img src="./../icons/delete.svg" alt="delete" /></button
                >
            </div>
        </div>
        {#if !$objs["defaultDownloadFolder"]}
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
