document.addEventListener('DOMContentLoaded', () => {
    const IPTV_URL = 'https://iptv-org.github.io/iptv/countries/br.m3u'; // URL da sua lista
    const moviesList = document.getElementById('movies-list'); // Menu lateral
    const mainContent = document.querySelector('.main-content'); // Área principal

    // Função para carregar a lista M3U
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

    // Função para analisar o conteúdo da lista M3U
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
                currentChannel = {}; // Reseta para o próximo canal
            }
        });

        return channels;
    }

    // Exibe os canais no menu lateral
    function displayChannelsInMenu(channels) {
        moviesList.innerHTML = ''; // Limpa o menu lateral

        channels.forEach(channel => {
            const channelItem = document.createElement('li');
            channelItem.textContent = channel.name;
            channelItem.classList.add('channel-item');
            channelItem.addEventListener('click', () => playChannel(channel));
            moviesList.appendChild(channelItem);
        });
    }

    // Reproduz o canal selecionado
   // Reproduz o canal selecionado
function playChannel(channel) {
    const videoElement = document.getElementById('movie-player');

    // Limpa o vídeo anterior
    videoElement.innerHTML = '';

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(channel.url); // Configura a URL do stream HLS
        hls.attachMedia(videoElement); // Conecta o HLS ao elemento de vídeo
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Suporte nativo (caso do Safari e outros navegadores com suporte HLS)
        videoElement.src = channel.url;
    } else {
        alert('Seu navegador não suporta reprodução de vídeos neste formato.');
    }
}   

    // Inicializa o app
    loadIPTVList();
});
