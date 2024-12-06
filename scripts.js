document.addEventListener('DOMContentLoaded', () => {
    const IPTV_URL = 'http://noxels.online:80/get.php?username=440086110&password=162067798&type=m3u_plus&output=mpegts'; // URL da sua lista
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
    function playChannel(channel) {
        mainContent.innerHTML = `
            <h2>${channel.name}</h2>
            <video controls autoplay>
                <source src="${channel.url}" type="application/x-mpegURL">
                Seu navegador não suporta este vídeo.
            </video>
            
        `;
    }

    // Inicializa o app
    loadIPTVList();
});
