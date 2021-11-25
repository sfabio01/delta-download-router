import * as utils from "./utils";

chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
    let filename = downloadItem.filename;
    // DEBUG:
    // console.log(filename);

    let url = downloadItem.referrer
    // DEBUG:
    // console.log(url);

    function urlMapping(url, filename) {
        // DEBUG:
        console.log("Performing URL mapping: " + url);
        chrome.storage.local.get([url, "defaultDownloadFolder"], function (result) {
            if (result[url]) {
                let finalPath = result[url] + '/' + filename;
                // DEBUG:
                console.log('Final path: ' + finalPath);

                suggest({ filename: finalPath });
            } else {
                // DEBUG:
                console.log('No path for this url: using default folder');

                if (result["defaultDownloadFolder"]) {
                    suggest({ filename: result["defaultDownloadFolder"] + "/" + filename });
                }
            }
        });
    }

    function filetypeMapping(filename) {
        // DEBUG:
        console.log("Performing filetype mapping: " + filename);
        let ext = filename.split('.').pop();
        let filetype = utils.extToFiletype(ext);
        chrome.storage.local.get([filetype, "defaultDownloadFolder"], function (result) {
            if (result[filetype]) {
                let finalPath = result[filetype] + '/' + filename;
                // DEBUG:
                console.log('Final path: ' + finalPath);

                suggest({ filename: finalPath });
            } else {
                // DEBUG:
                console.log('No path for this filetype: using default folder');

                if (result["defaultDownloadFolder"]) {
                    suggest({ filename: result["defaultDownloadFolder"] + "/" + filename });
                }
            }
        });

    }


    return true;

    // TODO:
    // - add support for rules priority
    // - write get started page
    // - import/export rules in JSON
});