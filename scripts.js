// Atualizado scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const IPTV_URL = 'https://iptv-org.github.io/iptv/categories/movies.m3u';
    const moviesList = document.getElementById('movies-list');
    const mainContent = document.querySelector('.main-content');
    const movieTitle = document.getElementById('movie-title');

    async function loadIPTVList() {
        try {
            const response = await fetch(IPTV_URL);
            if (!response.ok) {
                throw new Error(`Erro ao carregar a lista: ${response.statusText}`);
            }
            const m3uContent = await response.text();
            const channels = parseM3U(m3uContent);
            displayChannelsInMenu(channels);
        } catch (error) {
            console.error('Erro ao carregar a lista IPTV:', error);
            moviesList.innerHTML = `<li>Erro ao carregar canais. Tente novamente mais tarde.</li>`;
        }
    }

    function parseM3U(m3uContent) {
        const channels = [];
        const lines = m3uContent.split('\n');
        let currentChannel = {};

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
                const info = line.split(',')[1];
                currentChannel.name = info || 'Canal sem nome';
            } else if (line && !line.startsWith('#')) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {};
            }
        });

        return channels;
    }

    function displayChannelsInMenu(channels) {
        moviesList.innerHTML = '';

        channels.forEach(channel => {
            const channelItem = document.createElement('li');
            channelItem.textContent = channel.name;
            channelItem.classList.add('channel-item');
            channelItem.addEventListener('click', () => playChannel(channel));
            moviesList.appendChild(channelItem);
        });
    }

    function playChannel(channel) {
        const videoElement = document.getElementById('movie-player');
        movieTitle.textContent = channel.name; // Atualiza o título

        videoElement.innerHTML = '';

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(channel.url);
            hls.attachMedia(videoElement);
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = channel.url;
        } else {
            alert('Seu navegador não suporta reprodução de vídeos neste formato.');
        }
    }

    loadIPTVList();
});
