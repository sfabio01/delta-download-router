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
            }
        }
    });

    async function urlMapping(url, filename) {
        // DEBUG:
        console.log("Performing URL mapping: " + url);

        let result = await chrome.storage.local.get([url]);

        if (result[url]) {
            let finalPath = result[url] + '/' + filename;
            // DEBUG:
            console.log('Final path: ' + finalPath);

            suggest({ filename: finalPath });

            return true;
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


    return true;

    // TODO:
    // - write get started page
    // - import/export rules in JSON
});

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