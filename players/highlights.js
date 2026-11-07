document.querySelectorAll('.highlight-gallery').forEach((gallery) => {
    const list = gallery.querySelector('[data-highlight-list]');
    const options = Array.from(list.querySelectorAll('a[data-video-id]'));
    if (options.length === 0) return;

    const feature = gallery.querySelector('[data-highlight-feature]');
    const playerContainer = feature.querySelector('.aspect-video');
    const playButton = feature.querySelector('[data-highlight-play]');
    const caption = feature.querySelector('[data-highlight-caption]');
    const watchLink = feature.querySelector('[data-highlight-watch]');
    const emptyMessage = gallery.querySelector('[data-highlight-empty]');
    const choices = gallery.querySelector('[data-highlight-choices]');
    let selectedOption;

    function selectHighlight(option, loadVideo = false) {
        const videoId = option.dataset.videoId;
        const start = option.dataset.start || '0';
        const title = option.dataset.videoTitle || option.textContent.trim();
        if (!/^[\w-]{11}$/.test(videoId) || !/^\d+$/.test(start)) {
            console.error('Invalid highlight video ID or start time:', option.href);
            return false;
        }

        caption.textContent = `${loadVideo ? 'Now playing' : 'Selected'}: ${title}`;
        watchLink.href = option.href;
        options.forEach((item) => item.removeAttribute('aria-current'));
        option.setAttribute('aria-current', 'true');
        selectedOption = option;
        feature.hidden = false;
        if (choices) choices.hidden = false;
        if (emptyMessage) emptyMessage.hidden = true;

        if (loadVideo) {
            const iframe = playerContainer.querySelector('iframe') || document.createElement('iframe');
            iframe.className = 'h-full w-full';
            iframe.title = title;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?start=${start}&autoplay=1`;
            if (!iframe.isConnected) playerContainer.replaceChildren(iframe);
        }
        return true;
    }

    options.forEach((option) => {
        option.addEventListener('click', (event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            if (selectHighlight(option, true)) event.preventDefault();
        });
    });

    const initiallySelected = options.find((option) => option.getAttribute('aria-current') === 'true') || options[0];
    selectHighlight(initiallySelected);
    if (playButton) {
        playButton.addEventListener('click', () => selectHighlight(selectedOption, true));
    }
});
