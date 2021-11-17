<script>
    let urlToFolderObj = {
        "https://webeep.polimi.it/course/view.php?id=921":
            "downloads/uni/analisi",
        "https://webee.polimi.it/chimica": "downloads/uni/chimica",
    };
    let filetypeToFolderObj = {};
</script>

<main>
    <h1>Settings</h1>
    <div class="container">
        <div class="col1">
            <h2>URL to folder</h2>
            <div class="box">
                {#each Object.entries(urlToFolderObj) as [key, value]}
                    <div class="row-item">
                        <span class="item-title">{key}</span>
                        <span class="item-subtitle">{value}</span>
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
                {/each}
                <div class="row-item">
                    <input
                        class="form-control form-control-sm item-title"
                        type="text"
                        placeholder="https://example.com/foo"
                    />
                    <input
                        class="form-control form-control-sm item-subtitle"
                        type="text"
                        placeholder="path/to/destination/folder"
                    />
                    <button class="item-btn btn btn-primary btn-sm"
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
        <div class="col2">
            <h2>Rules priority</h2>
            <div class="box" />
        </div>
    </div>
</main>

<style>
    .item-title {
        font-weight: bold;
        grid-area: title;
    }
    .item-subtitle {
        grid-area: subtitle;
        font-size: 14px;
    }
    .item-btn-group {
        display: flex;
        flex-direction: row;
        grid-area: btn;
        align-self: center;
    }
    .item-btn {
        border-radius: 24px;
        margin: 0px 2px;
    }
    .row-item {
        display: grid;
        margin-bottom: 10px;
        column-gap: 4px;
        grid-template-areas:
            "title title btn"
            "subtitle subtitle btn";
        align-items: center;
        justify-content: space-between;
    }
    @media (max-width: 768px) {
        .row-item {
            grid-template-areas:
                "title title"
                "subtitle subtitle"
                "btn btn";
        }
    }
    main {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }
    .container {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr;
        column-gap: 20px;
        margin: 0px;
        padding: 0px;
    }
    .col1 {
        display: flex;
        flex-direction: column;
    }
    .col2 {
        display: flex;
        flex-direction: column;
    }
    .box {
        margin-bottom: 24px;
        border: 2px solid black;
        border-radius: 14px;
        padding: 8px;
    }
</style>
