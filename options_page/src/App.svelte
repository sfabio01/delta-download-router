<script>
    import "./style.css";
    import * as types from "./types";
    import * as utils from "./utils";

    let objs = {};

    // DEBUG:
    // $: console.log(objs);

    let array = [];
    let urlToFolderArr = [];
    let filetypeToFolderArr = [];
    let filetypeToFolderObj = {};
    let priorityList = ["urlToFolder", "filetypeToFolder"];

    $: array = Object.entries(objs);
    $: urlToFolderArr = array.filter(
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
        priorityList = result["priorityList"];
        objs = result;
    });
    /* --- --- --- --- --- --- --- --- --- */

    function addRule() {
        let urlInput = document.getElementById("urlInput");
        let folderInput = document.getElementById("folderInput");
        let url = urlInput.value;
        let folder = folderInput.value;
        if (utils.urlIsValid(url)) {
            if (!utils.pathIsValid(folder)) {
                folder = utils.tryCorrectPath(folder);
            }
            if (utils.pathIsValid(folder)) {
                chrome.storage.local.set({ [url]: folder }, function () {
                    // DEBUG:
                    // console.log("Rule added: {" + url + ": " + folder + "}");

                    objs[url] = folder;
                    objs = objs;
                    urlInput.value = "";
                    folderInput.value = "";
                });
            } else {
                alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
            }
        } else {
            alert("Invalid URL");
        }
    }
    function deleteRule(key) {
        let yes = confirm(
            "Are you sure you want to delete the following rule?\n" +
                "URL: " +
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
    function editRule(key) {
        let newFolder = prompt("URL: " + key + "\nEdit Folder", objs[key]);
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
                {#each urlToFolderArr as [key, value]}
                    <div class="row-item">
                        <span class="item-title">{key}</span>
                        <span class="item-subtitle">{value}</span>
                        <div class="item-btn-group">
                            <button
                                on:click={() => {
                                    editRule(key);
                                }}
                                class="item-btn btn btn-primary btn-sm"
                                ><img
                                    src="./../icons/edit.svg"
                                    alt="edit"
                                /></button
                            >
                            <button
                                on:click={() => {
                                    deleteRule(key);
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
                <div class="row-item">
                    <input
                        id="urlInput"
                        class="form-control form-control-sm item-title"
                        type="text"
                        placeholder="https://example.com/foo"
                    />
                    <div
                        class="item-subtitle"
                        style="display: flex; width: 100%;"
                    >
                        <input
                            id="folderInput"
                            class="form-control form-control-sm"
                            type="text"
                            placeholder="path/to/destination/folder"
                            style="display: inline; margin-right: 2px;"
                        />
                        <img
                            src="./../icons/help.svg"
                            alt="help"
                            title={utils.pathFormatMessage}
                        />
                    </div>

                    <button
                        on:click={addRule}
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
                                    editRule(key);
                                }}
                                class="item-btn btn btn-primary btn-sm"
                                ><img
                                    src="./../icons/edit.svg"
                                    alt="edit"
                                /></button
                            >
                            <button
                                on:click={() => deleteRule(key)}
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
                                editRule("defaultDownloadFolder");
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
                        case no rule matches.
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>
