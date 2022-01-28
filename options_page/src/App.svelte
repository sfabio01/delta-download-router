<script>
    import "./style.css";
    import * as types from "./types";
    import * as utils from "./utils";

    let objs = {};

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
    chrome.storage.local.get(null, function (result) {
        console.log(result);
        if (result["priorityList"] == null) {
            result["priorityList"] = ["urlToFolder", "filetypeToFolder"];
        }
        if (result["urlMappingMode"] == null) {
            result["urlMappingMode"] = "specific";
        }
        priorityList = result["priorityList"];
        objs = result;
    });
    /* --- --- --- --- --- --- --- --- --- */

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
        newFolder = newFolder.trim();
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
        newFolder = newFolder.trim();
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
        newFolder = newFolder.trim();
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

    function setUrlMappingMode(mode) {
        chrome.storage.local.set({ urlMappingMode: mode }, function () {
            // DEBUG:
            // console.log("Mapping mode set to: " + mode);
            objs["urlMappingMode"] = mode;
            objs = objs;
        });
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
    <h1>Settings</h1>
    <div class="container1">
        <!-- LEFT COLUMN start -->
        <div class="col1">
            <!-- DOMAIN MAPPING SECTION start -->
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

                <p
                    class="hint-text"
                    style="text-align: center; margin-top: 8px;"
                >
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
                        >Choose whether to map only the specific URL or also all
                        the URLs starting with it</span
                    >
                    <div class="item-btn-group">
                        <div class="dropdown">
                            <button
                                class="btn btn-primary dropdown-toggle"
                                type="button"
                                id="mappingModeDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                >{objs["urlMappingMode"]
                                    ? objs["urlMappingMode"][0].toUpperCase() +
                                      objs["urlMappingMode"].substr(1)
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
                                        on:click={() =>
                                            setUrlMappingMode("specific")}
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
            <!-- DOMAIN MAPPING SECTION end -->
            <!-- FILETYPE MAPPING SECTION start -->
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
            <!-- FILETYPE MAPPING SECTION end -->
        </div>
        <!-- LEFT COLUMN end -->
        <!-- RIGHT COLUMN start -->
        <div class="col1">
            <!-- RULES PRIORITY SECTION start -->
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
            <!-- RULES PRIORITY SECTION end -->
            <!-- DEFAULT DOWNLOAD FOLDER SECTION start -->
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
                        <button
                            on:click={() =>
                                deleteFiletypeRule("defaultDownloadFolder")}
                            class="item-btn btn btn-danger btn-sm"
                            ><img
                                src="./../icons/delete.svg"
                                alt="delete"
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
                        will be the one set in the browser settings.
                    </div>
                {/if}
            </div>
            <!-- DEFAULT DOWNLOAD FOLDER SECTION end -->
            <div>
                <a href="./../getstarted.html" target="_blank">Get Started</a>
            </div>
        </div>
        <!-- RIGHT COLUMN end -->
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
