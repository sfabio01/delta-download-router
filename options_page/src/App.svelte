<script>
    import "./style.css";
    import { fileTypes } from "./types";

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    let objs = {
        "https://webee.polimi.it/chimica": "downloads/uni/chimica",
        documents: "download/doc",
        "https://webee.polimi.it/elettronica": "downloads/uni/elettronica",
        "https://webee.polimi.it/fisica": "downloads/uni/fisica",
        images: "download/img",
    };
    let array = [];
    let urlToFolderArr = [];
    let filetypeToFolderArr = [];
    let filetypeToFolderObj = {};

    $: array = Object.entries(objs);
    $: urlToFolderArr = array.filter(
        ([key, _]) => !fileTypes.hasOwnProperty(key)
    );
    $: filetypeToFolderArr = array.filter(([key, _]) =>
        fileTypes.hasOwnProperty(key)
    );
    $: filetypeToFolderObj = Object.fromEntries(filetypeToFolderArr);

    function addRule() {
        let urlInput = document.getElementById("urlInput");
        let folderInput = document.getElementById("folderInput");
        let url = urlInput.value;
        let folder = folderInput.value;
        if (url.length > 0 && folder.length > 0 && urlRegex.test(url)) {
            objs[url] = folder;
            objs = objs;
            urlInput.value = "";
            folderInput.value = "";
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
            delete objs[key];
            objs = objs;
        }
    }
    function editRule(key, canEditKey) {
        let newURL = key;
        if (canEditKey) {
            newURL = prompt("Edit URL", key);
            if (!newURL) {
                return;
            }
        }
        let newFolder = prompt("URL: " + newURL + "\nEdit Folder", objs[key]);
        if (!newFolder) {
            return;
        }
        if (
            newURL.length > 0 &&
            newFolder.length > 0 &&
            (!canEditKey || urlRegex.test(newURL))
        ) {
            if (newURL != key) delete objs[key];
            objs[newURL] = newFolder;
            objs = objs;
        } else {
            alert("Invalid URL or folder name");
        }
    }
    document.addEventListener("DOMContentLoaded", (event) => {
        var _el;

        function dragOver(e) {
            if (isBefore(_el, e.target))
                e.target.parentNode.insertBefore(_el, e.target);
            else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
            console.log(_el);
        }

        function dragStart(e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", null); // Thanks to bqlou for their comment.
            _el = e.target;
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
        }
    });
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
                                    editRule(key, true);
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
                                    editRule(key, false);
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
                    <li
                        id="urlToFolderPriorityItem"
                        draggable="true"
                        class="sortable-item"
                    >
                        Url to folder
                    </li>
                    <li
                        id="filetypeToFolderPriorityItem"
                        draggable="true"
                        class="sortable-item"
                    >
                        Filetype to folder
                    </li>
                </ol>
            </div>
        </div>
    </div>
</main>
