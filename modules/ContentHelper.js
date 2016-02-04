import ContentCache from './ContentCache';

const ContentHelper = {
    loadItem(url) {
        const content = ContentCache.get(url);

        return new Promise((resolve, reject) => {
            const handleSuccess = () => {
                if (content.src.indexOf('m4a') > -1 || content.src.indexOf('ogg') > -1) {
                    content.muted = false;
                    content.pause();
                    content.removeEventListener('playing', handleSuccess, false);
                }
                resolve(content);
            };
            const handleError = () => {
                console.error('Content failed', content);
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

    loadContent(urls) {
        const promises = urls.map(this.loadItem.bind(this));
        return Promise.all(promises);
    },

    // preload without caring about the result
    stuffContent(urls) {
        ContentCache.stuff(urls);
    },
};

export default ContentHelper;
