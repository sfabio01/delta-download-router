chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
    let filename = downloadItem.filename;
    // DEBUG:
    // console.log(filename);

    let url = downloadItem.referrer
    // DEBUG:
    console.log(url);

    let ext = filename.split('.').pop();
    // DEBUG:
    // console.log(ext);

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
    return true;

    // TODO:
    // - control download path format
    // - add support for filetype to folder mapping
    // - add support for rules priority
});