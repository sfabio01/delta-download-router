/* --- DOWNLOAD MANAGER LOGIC ---*/
chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
    let filename = downloadItem.filename;
    // DEBUG:
    console.log(filename);

    let url = downloadItem.referrer;
    // DEBUG:
    console.log(url);

    chrome.storage.local.get("priorityList", async function (result) {
        let priorityList = defaultPriorityList;
        let matched = false;

        if (result["priorityList"])
            priorityList = result["priorityList"];

        for (let item of priorityList) {
            if (matched)
                break;
            switch (item) {
                case "urlToFolder": {
                    matched = await urlMapping(url, filename);
                    break;
                }
                case "filetypeToFolder": {
                    matched = await filetypeMapping(filename);
                    break;
                }
            }
        }

        if (!matched) {
            let result = await chrome.storage.local.get(["defaultDownloadFolder"]);
            if (result["defaultDownloadFolder"]) {
                suggest({ filename: result["defaultDownloadFolder"] + "/" + filename });
            } else {
                suggest({ filename: filename });
            }
        }
    });

    return true;

    async function urlMapping(url, filename) {
        // DEBUG:
        console.log("Performing URL mapping: " + url);
        let urlObj;
        try {
            urlObj = new URL(url);
        } catch (error) {
            return false;
        }

        let domain = urlObj.hostname;
        console.log(domain);
        let path = url.split(domain)[1];
        console.log(path);
        let result = await chrome.storage.local.get([domain, "urlMappingMode"]);

        if (result[domain]) {
            let finalFolderPath = "";
            if (result[domain].folder) {
                finalFolderPath = result[domain].folder + "/" + filename;
            }

            if (result.urlMappingMode == "startingWith") {
                console.log("MODE: Starting with");
                let maxLenght = 0;
                for (let p in result[domain].paths) {
                    if (path.startsWith(p)) {
                        console.log("Matched: " + result[domain].paths[p]);
                        let l = p.split("/").length;
                        if (l > maxLenght) {
                            finalFolderPath = result[domain].paths[p] + "/" + filename;
                            maxLenght = l;
                        }
                    }
                }
            }

            if (result[domain].paths[path]) {
                finalFolderPath = result[domain].paths[path] + "/" + filename;
            }
            if (finalFolderPath != "") {
                // DEBUG:
                console.log('Final path: ' + finalFolderPath);

                suggest({ filename: finalFolderPath });

                return true;
            }
        }

        // DEBUG:
        console.log('No path for this url');

        return false;
    }

    async function filetypeMapping(filename) {
        // DEBUG:
        console.log("Performing filetype mapping: " + filename);

        let ext = filename.split('.').pop();
        let filetype = extToFiletype(ext);

        let result = await chrome.storage.local.get([filetype]);

        if (result[filetype]) {
            let finalPath = result[filetype] + '/' + filename;
            // DEBUG:
            console.log('Final path: ' + finalPath);

            suggest({ filename: finalPath });

            return true;
        }

        // DEBUG:
        console.log('No path for this filetype');

        return false;
    }

    // TODO:
    // - import/export rules in JSON
});

/* --- SHOW GET STARTED PAGE --- */
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ url: "getstarted.html" });
});

/* ------- LISTEN FOR MESSAGES --------*/
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message == "getURL") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let url = new URL(tabs[0].url);
                let domain = url.hostname;
                let path = tabs[0].url.split(domain)[1];
                sendResponse([domain, path]);
            });
        }
        return true;
    }
);

/* --- CONSTANTS & UTILS--- */
const fileTypes = {
    documents: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
    images: ["jpg", "jpeg", "png", "gif", "bmp", "svg"],
    audio: ["mp3", "wav", "aiff", "ogg"],
    video: ["mp4", "avi", "mov", "mpeg", "mpg"],
    archives: [
        "zip",
        "rar",
        "7z",
        "gz",
        "bz2",
        "tar",
        "tgz",
        "xz",
        "z",
    ],
    programms: [
        "exe",
        "msi",
        "apk",
        "dmg",
        "pkg",
        "deb",
        "rpm",
        "bat",
        "com",
        "jar",
        "appx",
    ],
    code: [
        "xml",
        "json",
        "html",
        "htm",
        "php",
        "css",
        "js",
        "py",
        "java",
        "c",
        "cpp",
        "h",
        "hpp",
        "cs",
        "go",
        "ts",
        "dart",
        "sh",
        "md",
        "yml",
        "yaml",
        "ini",
        "cfg",
        "conf",
        "log",
        "sql",
        "db",
        "dbf",
        "mdb",
        "sqlite",
    ],
};

function extToFiletype(ext) {
    for (let type in fileTypes) {
        if (fileTypes[type].includes(ext)) {
            return type;
        }
    }
    return "defaultDownloadFolder";
}

const defaultPriorityList = ["urlToFolder", "filetypeToFolder"];