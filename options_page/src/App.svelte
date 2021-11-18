<script>
    import "./style.css";
    let urlToFolderObj = {
        "https://webeep.polimi.it/course/view.php?id=921":
            "downloads/uni/analisi",
        "https://webee.polimi.it/chimica": "downloads/uni/chimica",
    };
    let filetypeToFolderObj = {};
    function addURLToFolderObj() {
        let urlInput = document.getElementById("urlInput");
        let folderInput = document.getElementById("folderInput");
        let url = urlInput.value;
        let folder = folderInput.value;
        if (url.length > 0 && folder.length > 0) {
            urlToFolderObj[url] = folder;
            urlToFolderObj = urlToFolderObj;
            urlInput.value = "";
            folderInput.value = "";
        }
    }
    function deleteURLToFolderObj(key) {
        let yes = confirm(
            "Are you sure you want to delete the following rule?\n" +
                "URL: " +
                key +
                "\n" +
                "Folder: " +
                urlToFolderObj[key]
        );
        if (yes) {
            delete urlToFolderObj[key];
            urlToFolderObj = urlToFolderObj;
        }
    }
    function editURLToFolderObj(key) {
        let newURL = prompt("Edit URL", key);
        let newFolder = prompt("Edit Folder", urlToFolderObj[key]);
        if (newURL.length > 0 && newFolder.length > 0) {
            if (newURL != key) delete urlToFolderObj[key];
            urlToFolderObj[newURL] = newFolder;
            urlToFolderObj = urlToFolderObj;
        }
    }
</script>

<main>
    <h1>Settings</h1>
    <div class="container1">
        <div class="col1">
            <h2>URL to folder</h2>
            <div class="box">
                {#each Object.entries(urlToFolderObj) as [key, value]}
                    <div class="row-item">
                        <span class="item-title">{key}</span>
                        <span class="item-subtitle">{value}</span>
                        <div class="item-btn-group">
                            <button
                                on:click={() => {
                                    editURLToFolderObj(key);
                                }}
                                class="item-btn btn btn-primary btn-sm"
                                ><img
                                    src="./../icons/edit.svg"
                                    alt="edit"
                                /></button
                            >
                            <button
                                on:click={() => {
                                    deleteURLToFolderObj(key);
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
                        on:click={addURLToFolderObj}
                        class="item-btn btn btn-primary btn-sm"
                        ><img src="./../icons/add.svg" alt="add" /></button
                    >
                </div>
            </div>
            <h2>Filetype to folder</h2>
            <div class="box">
                <div class="row-item">
                    <span class="item-title">Images (png, jpg, svg)</span>
                    <span class="item-subtitle">downloads/images</span>
                    <div class="item-btn-group">
                        <button class="item-btn btn btn-primary btn-sm"
                            ><img
                                src="./../icons/edit.svg"
                                alt="edit"
                            /></button
                        >
                        <button class="item-btn btn btn-danger btn-sm"
                            ><img
                                src="./../icons/delete.svg"
                                alt="delete"
                            /></button
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="col1">
            <h2>Rules priority</h2>
            <div class="box" />
        </div>
    </div>
</main>
