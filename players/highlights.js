document.querySelectorAll('.highlight-gallery').forEach((gallery) => {
    const list = gallery.querySelector('[data-highlight-list]');
    const options = Array.from(list.querySelectorAll('a[data-video-id]'));
    if (options.length === 0) return;

    const feature = gallery.querySelector('[data-highlight-feature]');
    const iframe = feature.querySelector('iframe');
    const caption = feature.querySelector('[data-highlight-caption]');
    const watchLink = feature.querySelector('[data-highlight-watch]');
    const emptyMessage = gallery.querySelector('[data-highlight-empty]');
    const choices = gallery.querySelector('[data-highlight-choices]');

    function selectHighlight(option) {
        const videoId = option.dataset.videoId;
        const start = option.dataset.start || '0';
        const title = option.dataset.videoTitle || option.textContent.trim();
        if (!/^[\w-]{11}$/.test(videoId) || !/^\d+$/.test(start)) {
            console.error('Invalid highlight video ID or start time:', option.href);
            return false;
        }

        const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?start=${start}`;
        if (iframe.getAttribute('src') !== embedUrl) iframe.src = embedUrl;
        iframe.title = title;
        caption.textContent = `Now showing: ${title}`;
        watchLink.href = option.href;
        options.forEach((item) => item.removeAttribute('aria-current'));
        option.setAttribute('aria-current', 'true');
        feature.hidden = false;
        if (choices) choices.hidden = false;
        if (emptyMessage) emptyMessage.hidden = true;
        return true;
    }

    options.forEach((option) => {
        option.addEventListener('click', (event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            if (selectHighlight(option)) event.preventDefault();
        });
    });

    selectHighlight(options.find((option) => option.getAttribute('aria-current') === 'true') || options[0]);
});
