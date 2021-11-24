export function urlIsValid(url) {
    return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
}

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
    for (let c of [":", "*", "?", '"', "<", ">", "|", "\\"]) {
        if (path.indexOf(c) != -1) {
            return false;
        }
    }
    return true;
}