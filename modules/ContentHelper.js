import ContentCache from './ContentCache';

const ContentHelper = {
    loadItem(url, callback) {
        const content = ContentCache.get(url);

        return new Promise((resolve, reject) => {
            const handleSuccess = () => {
                if (content.src.indexOf('m4a') > -1 || content.src.indexOf('ogg') > -1) {
                    content.muted = false;
                    content.pause();
                    content.removeEventListener('playing', handleSuccess, false);
                }
                if (callback) {
                    callback(true);
                }
                resolve(content);
            };
            const handleError = () => {
                console.error('Content failed', content);
                if (callback) {
                    callback(false);
                }
                reject(content);
            };

            if ((content.naturalWidth && content.naturalHeight) || content.readyState === 4) {
                // content is loaded, go ahead and change the state
                handleSuccess();
            } else {
                if (content.src.indexOf('m4a') > -1 || content.src.indexOf('ogg') > -1) {
                    content.muted = true;
                    content.addEventListener('playing', handleSuccess, false);
                    content.play();
                } else {
                    content.addEventListener('load', handleSuccess, false);
                }
                content.addEventListener('error', handleError, false);
            }
        });
    },

    loadContent(urls, callback) {
        const promises = urls.map((url) => {
            return this.loadItem(url, callback)
        });
        return Promise.all(promises);
    },

    // preload without caring about the result
    stuffContent(urls) {
        ContentCache.stuff(urls);
    },
};

export default ContentHelper;
