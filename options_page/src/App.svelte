<script>
    import "./style.css";
    import * as types from "./types";
    import * as utils from "./utils";

    let objs = {
        "webeep.polimi.it": {
            folder: "OneDrive - Politecnico di Milano",
            paths: {
                "/mod/folder/view.php?id=21121":
                    "OneDrive - Politecnico di Milano/Anno 2/Semestre 1/Chimica generale/Slide",
                "/mod/folder/view.php?id=21130":
                    "OneDrive - Politecnico di Milano/Anno 2/Semestre 1/Chimica generale/Esercitazioni",
            },
        },
    };

    // DEBUG:
    // $: console.log(objs);

    let array = [];
    let domainToFolderArr = [];
    let filetypeToFolderArr = [];
    let filetypeToFolderObj = {};
    let priorityList = ["urlToFolder", "filetypeToFolder"];

    $: array = Object.entries(objs);
    $: domainToFolderArr = array.filter(
        ([key, _]) =>
            !types.fileTypes.hasOwnProperty(key) &&
            types.specialKeys.indexOf(key) == -1
    );
    $: filetypeToFolderArr = array.filter(
        ([key, _]) =>
            types.fileTypes.hasOwnProperty(key) &&
            types.specialKeys.indexOf(key) == -1
    );
    $: filetypeToFolderObj = Object.fromEntries(filetypeToFolderArr);

    /* --- Init --- */
    // chrome.storage.local.get(null, function (result) {
    //     console.log(result);
    //     if (result["priorityList"] == null) {
    //         result["priorityList"] = ["urlToFolder", "filetypeToFolder"];
    //     }
    //     priorityList = result["priorityList"];
    //     objs = result;
    // });
    /* --- --- --- --- --- --- --- --- --- */

    function addDomain() {
        let domainInput = document.getElementById("domainInput");
        let folderInput = document.getElementById("folderInput");
        let domain = domainInput.value.trim();
        let folder = folderInput.value.trim();
        if (utils.domainIsValid(domain)) {
            if (!utils.pathIsValid(folder)) {
                folder = utils.tryCorrectPath(folder);
            }
            if (utils.pathIsValid(folder)) {
                chrome.storage.local.set({ [domain]: folder }, function () {
                    // DEBUG:
                    console.log("Rule added: {" + domain + ": " + folder + "}");

                    objs[domain] = { folder: folder, paths: {} };
                    objs = objs;
                    domainInput.value = "";
                    folderInput.value = "";
                });
            } else {
                alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
            }
        } else {
            alert("Invalid domain");
        }
    }
    function addPathUnderDomain(domain) {
        let path = prompt(
            `Insert new path under ${domain}\nNote: insert only the part of the URL after the domain`,
            ""
        );
        if (path == null) return;
        let folder = prompt(
            `Final URL: ${domain + path}\nDestination folder:`,
            ""
        );
        if (folder == null) return;

        if (!utils.pathIsValid(folder)) {
            folder = utils.tryCorrectPath(folder);
        }
        if (utils.pathIsValid(folder)) {
            chrome.storage.local.set(
                {
                    [domain]: {
                        folder: objs[domain].folder,
                        paths: {
                            [path]: folder,
                        },
                    },
                },
                function () {
                    // DEBUG:
                    console.log(
                        "Rule added: {" +
                            domain +
                            "->" +
                            path +
                            ": " +
                            folder +
                            "}"
                    );

                    objs[domain].paths[path] = folder;
                    objs = objs;
                }
            );
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
    function deleteFiletypeRule(key) {
        let yes = confirm(
            "Are you sure you want to delete the following rule?\n" +
                "Filetype: " +
                key +
                "\n" +
                "Folder: " +
                objs[key]
        );
        if (yes) {
            chrome.storage.local.remove(key, function () {
                // DEBUG:
                // console.log("Rule deleted: " + key);

                delete objs[key];
                objs = objs;
            });
        }
    }
    function deleteDomainRule(key) {
        let yes = confirm(
            "Are you sure you want to delete the following domain, and all its paths?\n" +
                key
        );
        if (yes) {
            chrome.storage.local.remove(key, function () {
                // DEBUG:
                // console.log("Rule deleted: " + key);

                delete objs[key];
                objs = objs;
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
            delete objs[domain].paths[path];
            chrome.storage.local.set({ [domain]: objs[domain] }, function () {
                // DEBUG:
                // console.log("Rule deleted: " + domain + path);

                objs = objs;
            });
        }
    }
    function editFiletypeRule(key) {
        // Used also for editing default download folder
        let newFolder = prompt("Filetype: " + key + "\nEdit Folder", objs[key]);
        if (!newFolder) {
            return;
        }
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            chrome.storage.local.set({ [key]: newFolder }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + key + ": " + newFolder + "}");

                objs[key] = newFolder;
                objs = objs;
            });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
    function editDomainRule(key) {
        let newFolder = prompt(
            "Domain: " + key + "\nEdit Folder",
            objs[key].folder
        );
        if (!newFolder) {
            return;
        }
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            objs[key].folder = newFolder;
            chrome.storage.local.set({ [key]: objs[key] }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + key + ": " + newFolder + "}");

                objs = objs;
            });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }
    function editPathRule(domain, path) {
        let newFolder = prompt(
            "URL: " + domain + path + "\nEdit Folder",
            objs[domain].paths[path]
        );
        if (!newFolder) {
            return;
        }
        if (!utils.pathIsValid(newFolder)) {
            newFolder = utils.tryCorrectPath(newFolder);
        }
        if (utils.pathIsValid(newFolder)) {
            objs[domain].paths[path] = newFolder;
            chrome.storage.local.set({ [domain]: objs[domain] }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + domain + path + ": " + newFolder + "}");

                objs = objs;
            });
        } else {
            alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
        }
    }

    /* --- Sortable list config --- */
    document.addEventListener("DOMContentLoaded", (event) => {
        var _el;

        function dragOver(e) {
            if (isBefore(_el, e.target))
                e.target.parentNode.insertBefore(_el, e.target);
            else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
        }

        function dragStart(e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", null);
            _el = e.target;
        }
        function dragEnd(e) {
            let list = document.getElementById("priority-list");
            let listItems = list.getElementsByTagName("li");
            let newPriorityList = [];
            for (let item of listItems) {
                newPriorityList.push(item.ariaValueText);
            }

            chrome.storage.local.set(
                { priorityList: newPriorityList },
                function () {
                    // DEBUG:
                    // console.log("New priority list: " + newPriorityList);
                }
            );
        }

        function isBefore(el1, el2) {
            if (el2.parentNode === el1.parentNode)
                for (
                    var cur = el1.previousSibling;
                    cur && cur.nodeType !== 9;
                    cur = cur.previousSibling
                )
                    if (cur === el2) return true;
            return false;
        }

        let sortables = document.getElementsByClassName("sortable-item");
        for (let sortable of sortables) {
            sortable.addEventListener("dragstart", dragStart);
            sortable.addEventListener("dragover", dragOver);
            sortable.addEventListener("dragend", dragEnd);
        }
    });
    /* --- --- --- --- --- --- */
</script>

<main>
    <h1>
        <!-- svelte-ignore missing-declaration -->
        Settings
        <button
            on:click={() => {
                chrome.downloads.showDefaultFolder();
            }}
            class="item-btn btn btn-primary btn-sm"
            ><img src="./../icons/folder.svg" alt="download folder" /></button
        >
    </h1>
    <div class="container1">
        <div class="col1">
            <h3>URL Mapping</h3>
            <div class="box">
                {#each domainToFolderArr as [key, value]}
                    <div class="block-item">
                        <div class="row-item">
                            <span class="item-title">{key}</span>
                            <span class="item-subtitle">{value["folder"]}</span>
                            <div class="item-btn-group">
                                <button
                                    on:click={() => {
                                        addPathUnderDomain(key);
                                    }}
                                    class="item-btn btn btn-primary btn-sm"
                                    ><img
                                        src="./../icons/add.svg"
                                        alt="add"
                                    /></button
                                >
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

                <div class="row-item">
                    <input
                        id="domainInput"
                        class="form-control form-control-sm item-title"
                        style="font-size: 16px;"
                        type="text"
                        placeholder="Website domain (e.g. www.sunset.com)"
                    />
                    <div
                        class="item-subtitle"
                        style="display: flex; width: 100%;"
                    >
                        <input
                            id="folderInput"
                            class="form-control form-control-sm"
                            type="text"
                            placeholder="Destination folder (e.g. Images/Sunsets)"
                            style="display: inline; margin-right: 2px;"
                        />
                        <img
                            src="./../icons/help.svg"
                            alt="help"
                            title={utils.pathFormatMessage}
                        />
                    </div>

                    <button
                        on:click={addDomain}
                        class="item-btn btn btn-primary btn-sm"
                        ><img src="./../icons/add.svg" alt="add" /></button
                    >
                </div>
            </div>
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
                                ><img
                                    src="./../icons/edit.svg"
                                    alt="edit"
                                /></button
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
        </div>
        <div class="col1">
            <h3>Rules priority</h3>
            <div class="box">
                <ol id="priority-list" style="font-weight: bold;">
                    {#each priorityList as value}
                        <li
                            aria-valuetext={value}
                            draggable="true"
                            class="sortable-item"
                        >
                            {types.priorityValueTextMap[value]}
                        </li>
                    {/each}
                </ol>
                <p class="hint-text" style="text-align: center;">
                    Drag a list item to change its priority
                </p>
            </div>
            <h3>Default download folder</h3>
            <div class="box">
                <div class="row-item">
                    <span class="item-title">Default download folder</span>
                    <span class="item-subtitle"
                        >{#if objs["defaultDownloadFolder"]}{objs[
                                "defaultDownloadFolder"
                            ]}{:else}Not defined{/if}</span
                    >
                    <div class="item-btn-group">
                        <button
                            on:click={() => {
                                editFiletypeRule("defaultDownloadFolder");
                            }}
                            class="item-btn btn btn-primary btn-sm"
                            ><img
                                src="./../icons/edit.svg"
                                alt="edit"
                            /></button
                        >
                    </div>
                </div>
                {#if !objs["defaultDownloadFolder"]}
                    <div
                        class="alert alert-warning"
                        style="border-radius: 8px;"
                        role="alert"
                    >
                        It's important you set the default download folder in
                        case no rule matches. If you don't, the default folder
                        will be the one set in the browser settings (not
                        recommended).
                    </div>
                {/if}
            </div>
            <div>
                <a href="./../getstarted.html" target="_blank">Get Started</a>
            </div>
        </div>
    </div>
    <footer>
        <div>Developed by <b>Fabio Sabbion</b></div>
        <div class="footer-icon">
            <a target="_blank" href="https://www.buymeacoffee.com/fabiosabbion">
                <img src="./../icons/bmc.svg" alt="buy me a coffe" /></a
            >
        </div>
    </footer>
</main>
