const hash = {};
const cache = [];

const add = url => {
    if (!hash[url]) {
        if (url.indexOf('m4a') > -1 || url.indexOf('ogg') > -1) {
            hash[url] = new Audio();
        } else {
            hash[url] = new Image();
        }
        hash[url].src = url;

        cache.push(hash[url]);
    }
    return hash[url];
};

const get = url => {
    return add(url);
};

const stuff = (urls) => {
    if (urls.length > 0) {
        urls.map(add);
    }
};

const ContentCache = {
    add,
    stuff,
    get,
    hash,
    cache,
};

export default ContentCache;
