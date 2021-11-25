export const fileTypes = {
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

export function extToFiletype(ext) {
    for (let type in fileTypes) {
        if (fileTypes[type].includes(ext)) {
            return type;
        }
    }
    return "defaultDownloadFolder";
}