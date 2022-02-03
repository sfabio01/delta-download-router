<script>
    import ModalWindow from "./ModalWindow.svelte";
    import "./style.css";
    import * as types from "./types";
    import * as utils from "./utils";
    import { options } from "./stores";
    import DomainMappingSection from "./sections/domain_mapping/DomainMappingSection.svelte";
    import FiletypeMappingSection from "./sections/filetype_mapping/FiletypeMappingSection.svelte";
    import RulesPrioritySection from "./sections/global_settings/RulesPrioritySection.svelte";
    import DefaultDownloadFolderSection from "./sections/global_settings/DefaultDownloadFolderSection.svelte";
    import Footer from "./sections/Footer.svelte";
    import OtherSection from "./sections/OtherSection.svelte";
    // DEBUG:
    // $: console.log(options);

    let array = [];
    let domainToFolderArr = [];
    let filetypeToFolderObj = {};
    let priorityList = ["urlToFolder", "filetypeToFolder"];

    $: array = Object.entries($options);
    $: domainToFolderArr = array.filter(
        ([key, _]) =>
            !types.fileTypes.hasOwnProperty(key) &&
            utils.specialKeys.indexOf(key) == -1
    );
    $: filetypeToFolderObj = Object.fromEntries(
        array.filter(
            ([key, _]) =>
                types.fileTypes.hasOwnProperty(key) &&
                utils.specialKeys.indexOf(key) == -1
        )
    );

    /* --- Init --- */
    chrome.storage.local.get(null, function (result) {
        console.log(result);
        if (result["priorityList"] == null) {
            result["priorityList"] = ["urlToFolder", "filetypeToFolder"];
        }
        if (result["urlMappingMode"] == null) {
            result["urlMappingMode"] = "specific";
        }
        if (result["defaultDomainMapping"] == null) {
            result["defaultDomainMapping"] = false;
        }
        priorityList = result["priorityList"];
        options.set(result);
        if (
            !$options["newVersionAlertViewed"] ||
            $options["newVersionAlertViewed"] != "1.2.0"
        ) {
            chrome.storage.local.set({ newVersionAlertViewed: "1.2.0" });
            window.location = "#open-modal";
        }
    });
</script>

<main>
    <div class="container-fluid">
        <h1>Settings</h1>
        <div class="row">
            <div class="col-8">
                <DomainMappingSection {domainToFolderArr} />
                <FiletypeMappingSection {filetypeToFolderObj} />
            </div>
            <div class="col">
                <RulesPrioritySection {priorityList} />
                <DefaultDownloadFolderSection />
                <OtherSection />
            </div>
        </div>
    </div>
    <ModalWindow />
    <Footer />
</main>
