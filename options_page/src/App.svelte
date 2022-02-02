<script>
    import ModalWindow from "./ModalWindow.svelte";
    import "./style.css";
    import * as types from "./types";
    import * as utils from "./utils";
    import { objs } from "./stores";
    import DomainMappingSection from "./sections/domain_mapping/DomainMappingSection.svelte";
    import FiletypeMappingSection from "./sections/filetype_mapping/FiletypeMappingSection.svelte";
    import RulesPrioritySection from "./sections/global_settings/RulesPrioritySection.svelte";
    import DefaultDownloadFolderSection from "./sections/global_settings/DefaultDownloadFolderSection.svelte";
    // DEBUG:
    // $: console.log(objs);

    let array = [];
    let domainToFolderArr = [];
    let filetypeToFolderArr = [];
    let filetypeToFolderObj = {};
    let priorityList = ["urlToFolder", "filetypeToFolder"];

    $: array = Object.entries($objs);
    $: domainToFolderArr = array.filter(
        ([key, _]) =>
            !types.fileTypes.hasOwnProperty(key) &&
            utils.specialKeys.indexOf(key) == -1
    );
    $: filetypeToFolderArr = array.filter(
        ([key, _]) =>
            types.fileTypes.hasOwnProperty(key) &&
            utils.specialKeys.indexOf(key) == -1
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
        objs.set(result);
        if (
            !$objs["newVersionAlertViewed"] ||
            $objs["newVersionAlertViewed"] != "1.2.0"
        ) {
            chrome.storage.local.set({ newVersionAlertViewed: "1.2.0" });
            window.location = "#open-modal";
        }
    });

    /* --- --- --- --- --- --- --- --- --- */
</script>

<main class="main">
    <h1>Settings</h1>
    <div class="container1">
        <!-- LEFT COLUMN start -->
        <div class="col1">
            <!-- DOMAIN MAPPING SECTION start -->
            <DomainMappingSection {domainToFolderArr} />
            <!-- DOMAIN MAPPING SECTION end -->
            <!-- FILETYPE MAPPING SECTION start -->
            <FiletypeMappingSection {filetypeToFolderObj} />
            <!-- FILETYPE MAPPING SECTION end -->
        </div>
        <!-- LEFT COLUMN end -->
        <!-- RIGHT COLUMN start -->
        <div class="col1">
            <!-- RULES PRIORITY SECTION start -->
            <RulesPrioritySection {priorityList} />
            <!-- RULES PRIORITY SECTION end -->
            <!-- DEFAULT DOWNLOAD FOLDER SECTION start -->
            <DefaultDownloadFolderSection />
            <!-- DEFAULT DOWNLOAD FOLDER SECTION end -->
            <div>
                <a href="./../getstarted.html" target="_blank">Get Started</a>
            </div>
        </div>
        <!-- RIGHT COLUMN end -->
    </div>
    <ModalWindow />
    <footer>
        <div>Developed by <b>Fabio Sabbion</b></div>
        <div class="footer-icon">
            <a target="_blank" href="https://www.buymeacoffee.com/fabiosabbion">
                <img src="./../icons/bmc.svg" alt="buy me a coffe" /></a
            >
        </div>
    </footer>
</main>
