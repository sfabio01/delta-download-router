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

    chrome.storage.local.get(url, function (result) {
        if (result[url]) {
            let finalPath = result[url] + '/' + filename;
            // DEBUG:
            console.log('Final path: ' + finalPath);

            suggest({ filename: finalPath });
        } else {
            suggest({ filename: "Downloads/" + filename });
        }
    });
    return true;

    // TODO:
    // - choose default download path
    // - control download path format
    // - add support for filetype to folder mapping
    // - add support for rules priority
});