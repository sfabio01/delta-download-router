export function tryCorrectPath(path) {
    path = path.replace(/\\/g, "/");
    if (path.charAt(0) == "/") {
        path = path.substr(1);
    }
    if (path.charAt(path.length - 1) == "/") {
        path = path.substr(0, path.length - 1);
    }
    return path;
}
export function pathIsValid(path) {
    if (path.length == 0) {
        return false;
    }
    if (path.charAt(0) == "/") {
        return false;
    }
    if (path.charAt(path.length - 1) == "/") {
        return false;
    }
    for (let c of prohibitedCharsList) {
        if (path.indexOf(c) != -1) {
            return false;
        }
    }
    return true;
}

const prohibitedCharsList = ["*", "?", ":", '"', "<", ">", "|", "\\"];
export let pathFormatMessage = "Remember that the folder path is relative to the default download location defined in your browser's settings.\nRead the get started page to know more."
export let prohibitedCharsMessage = "The following characters are not allowed: " + prohibitedCharsList.join("  ");