<script>
    import "./style.css";
    import { fileTypes, priorityValueTextMap } from "./types";

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

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
        ([key, _]) => !fileTypes.hasOwnProperty(key) && key != "priorityList"
    );
    $: filetypeToFolderArr = array.filter(
        ([key, _]) => fileTypes.hasOwnProperty(key) && key != "priorityList"
    );
    $: filetypeToFolderObj = Object.fromEntries(filetypeToFolderArr);

    /* --- Initialize objs from storage --- */
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
        if (url.length > 0 && folder.length > 0 && urlRegex.test(url)) {
            chrome.storage.local.set({ [url]: folder }, function () {
                // DEBUG:
                // console.log("Rule added: {" + url + ": " + folder + "}");

                objs[url] = folder;
                objs = objs;
                urlInput.value = "";
                folderInput.value = "";
            });
        } else {
            alert("Invalid URL or folder name");
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
        if (key.length > 0 && newFolder.length > 0) {
            chrome.storage.local.set({ [key]: newFolder }, function () {
                // DEBUG:
                // console.log("Rule edited: {" + key + ": " + newFolder + "}");

                objs[key] = newFolder;
                objs = objs;
            });
        } else {
            alert("Invalid folder name");
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
    <h1>Settings</h1>
    <div class="container1">
        <div class="col1">
            <h2>URL to folder</h2>
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
                    <input
                        id="folderInput"
                        class="form-control form-control-sm item-subtitle"
                        type="text"
                        placeholder="path/to/destination/folder"
                    />
                    <button
                        on:click={addRule}
                        class="item-btn btn btn-primary btn-sm"
                        ><img src="./../icons/add.svg" alt="add" /></button
                    >
                </div>
            </div>
            <h2>Filetype to folder</h2>
            <div class="box">
                {#each Object.entries(fileTypes) as [key, value]}
                    <div class="row-item">
                        <span class="item-title capitalize">{key}</span>
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
            <h2>Rules priority</h2>
            <div class="box">
                <ol id="priority-list" style="font-weight: bold;">
                    {#each priorityList as value}
                        <li
                            aria-valuetext={value}
                            draggable="true"
                            class="sortable-item"
                        >
                            {priorityValueTextMap[value]}
                        </li>
                    {/each}
                </ol>
            </div>
        </div>
    </div>
</main>
