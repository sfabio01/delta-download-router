<script>
    import { objs } from "./../../stores";
    import * as utils from "./../../utils";
    export let domainToFolderArr;

    function deleteDomainRule(key) {
        let yes = confirm(
            "Are you sure you want to delete the following domain, and all its paths?\n" +
                key
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
    function deletePathRule(domain, path) {
        let yes = confirm(
            "Are you sure you want to delete the following URL?\n" +
                domain +
                path
        );
        if (yes) {
            objs.update((o) => {
                delete o[domain].paths[path];
                return o;
            });
            chrome.storage.local.set({ [domain]: objs[domain] }, function () {
                // DEBUG:
                // console.log("Rule deleted: " + domain + path);
            });
        }
    }
    async function editDomainRule(key) {
        let newFolder = prompt(
            "Domain: " + key + "\nEdit Folder",
            $objs[key].folder
        );
        if (!newFolder) {
            return;
        }
        newFolder = newFolder.trim();
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            objs.update((o) => {
                o[key].folder = newFolder;
                return o;
            });

            chrome.storage.local.set({ [key]: objs[key] }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + key + ": " + newFolder + "}");
            });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
    function editPathRule(domain, path) {
        let newFolder = prompt(
            "URL: " + domain + path + "\nEdit Folder",
            $objs[domain].paths[path]
        );

        if (!newFolder) {
            return;
        }
        newFolder = newFolder.trim();
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            objs.update((o) => {
                o[domain].paths[path] = newFolder;
                return o;
            });

            chrome.storage.local.set({ [domain]: objs[domain] }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + domain + path + ": " + newFolder + "}");
            });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }

    function setUrlMappingMode(mode) {
        chrome.storage.local.set({ urlMappingMode: mode }, function () {
            // DEBUG:
            // console.log("Mapping mode set to: " + mode);
            objs.update((o) => {
                o["urlMappingMode"] = mode;
                return o;
            });
        });
    }
</script>

<main>
    <h3>Domain and URL Mapping</h3>
    <div class="box">
        {#each domainToFolderArr as [key, value]}
            <div class="block-item">
                <div class="row-item">
                    <span class="item-title">{key}</span>
                    <span class="item-subtitle">{value["folder"]}</span>
                    <div class="item-btn-group">
                        <button
                            on:click={() => {
                                editDomainRule(key);
                            }}
                            class="item-btn btn btn-primary btn-sm"
                            ><img
                                src="./../icons/edit.svg"
                                alt="edit"
                            /></button
                        >
                        <button
                            on:click={() => {
                                deleteDomainRule(key);
                            }}
                            class="item-btn btn btn-danger btn-sm"
                            ><img
                                src="./../icons/delete.svg"
                                alt="delete"
                            /></button
                        >
                    </div>
                </div>
                {#each Object.entries(value["paths"]) as [path, folder]}
                    <div class="row-item2">
                        <span class="item-title2">{path}</span>
                        <span class="item-subtitle2">{folder}</span>
                        <div class="item-btn-group">
                            <button
                                on:click={() => {
                                    editPathRule(key, path);
                                }}
                                class="item-btn btn btn-primary btn-sm"
                                ><img
                                    src="./../icons/edit.svg"
                                    alt="edit"
                                /></button
                            >
                            <button
                                on:click={() => {
                                    deletePathRule(key, path);
                                }}
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
        {/each}

        <p class="hint-text" style="text-align: center; margin-top: 8px;">
            You can add a new rule by clicking the extension icon <img
                src="./../icons/delta_32.png"
                alt="delta"
                width="16px"
            /> next to the address bar when you are visiting a website
        </p>
    </div>
    <div class="box">
        <div class="row-item">
            <span class="item-title">URL mapping mode</span>
            <span class="item-subtitle"
                >Choose whether to map only the specific URL or also all the
                URLs starting with it</span
            >
            <div class="item-btn-group">
                <div class="dropdown">
                    <button
                        class="btn btn-primary dropdown-toggle"
                        type="button"
                        id="mappingModeDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >{$objs["urlMappingMode"]
                            ? $objs["urlMappingMode"][0].toUpperCase() +
                              $objs["urlMappingMode"].substr(1)
                            : "Select"}</button
                    >
                    <ul
                        class="dropdown-menu"
                        aria-labelledby="mappingModeDropdown"
                    >
                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                on:click={() => setUrlMappingMode("specific")}
                            >
                                Specific</button
                            >
                        </li>
                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                on:click={() =>
                                    setUrlMappingMode("startingWith")}
                            >
                                Starting with</button
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</main>
