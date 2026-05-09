const logo = document.getElementById('logo');
const homeView = document.getElementById('homeView');
const searchView = document.getElementById('searchView');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const explicitFilter = document.getElementById('explicitFilter');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const playlistContainer = document.getElementById('playlistContainer');
const modal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

let currentAudio = null;

function showHome() {
    homeView.style.display = 'flex';
    searchView.style.display = 'none';
    searchInput.value = '';
    resultsContainer.innerHTML = '';
}

function showResults() {
    homeView.style.display = 'none';
    searchView.style.display = 'flex';
}

function formatTime(millis) {
    if (!millis) return "N/A";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function playPreview(url, buttonElement) {
    if (currentAudio) {
        currentAudio.pause();
        document.querySelectorAll('.btn-play').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-play"></i> Play Preview';
        });
    }

    if (currentAudio && currentAudio.src === url) {
        currentAudio = null;
        return;
    }

    currentAudio = new Audio(url);
    currentAudio.play();
    buttonElement.innerHTML = '<i class="fas fa-pause"></i> Pause';

    currentAudio.onended = () => {
        buttonElement.innerHTML = '<i class="fas fa-play"></i> Play Preview';
        currentAudio = null;
    };
}

function renderResults(results) {
    resultsContainer.innerHTML = '';
    if(results.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        const imgUrl = item.artworkUrl100 || 'https://via.placeholder.com/130';
        const title = item.trackName || item.collectionName || item.artistName;
        
        card.innerHTML = `
            <img src="${imgUrl}" alt="Capa">
            <h3>${title}</h3>
            <p>${item.artistName || ''}</p>
        `;

        if (item.previewUrl) {
            const playBtn = document.createElement('button');
            playBtn.className = 'btn btn-play';
            playBtn.innerHTML = '<i class="fas fa-play"></i> Play Preview';
            playBtn.onclick = () => playPreview(item.previewUrl, playBtn);
            card.appendChild(playBtn);
        }

        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-details';
        detailsBtn.innerHTML = '<i class="fas fa-info-circle"></i> Detalhes';
        detailsBtn.onclick = () => openDetails(item);
        card.appendChild(detailsBtn);

        resultsContainer.appendChild(card);
    });
}

function openDetails(item) {
    const imgUrl = item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '400x400') : 'https://via.placeholder.com/400';
    const price = item.trackPrice ? `U$ ${item.trackPrice}` : (item.collectionPrice ? `U$ ${item.collectionPrice}` : 'Indisponível');
    
    modalBody.innerHTML = `
        <div class="modal-image-container">
            <img src="${imgUrl}" alt="Capa">
        </div>
        <div class="modal-info-container">
            <div class="modal-header">
                <h2>${item.trackName || item.collectionName || 'Desconhecido'}</h2>
                <p>${item.artistName || 'Artista desconhecido'}</p>
            </div>
            
            <div class="modal-grid">
                <div class="grid-item">
                    <span>Gênero</span>
                    <span>${item.primaryGenreName || 'N/A'}</span>
                </div>
                <div class="grid-item">
                    <span>Duração</span>
                    <span>${formatTime(item.trackTimeMillis)}</span>
                </div>
                <div class="grid-item">
                    <span>Preço</span>
                    <span>${price}</span>
                </div>
                <div class="grid-item">
                    <span>Conteúdo</span>
                    <span>${item.trackExplicitness === 'explicit' ? 'Explícito' : 'Livre'}</span>
                </div>
            </div>

            <div class="modal-actions">
                ${item.previewUrl ? `<button class="btn btn-play" id="modalPlayBtn"><i class="fas fa-play"></i> Play Preview</button>` : ''}
                <button class="btn btn-add" id="modalAddBtn"><i class="fas fa-plus"></i> Adicionar</button>
            </div>
        </div>
    `;

    if (item.previewUrl) {
        const modalPlayBtn = document.getElementById('modalPlayBtn');
        modalPlayBtn.onclick = () => playPreview(item.previewUrl, modalPlayBtn);
    }

    document.getElementById('modalAddBtn').onclick = () => {
        addToPlaylist(item);
        modal.style.display = 'none';
    };

    modal.style.display = 'flex';
}

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    if(playlist.length === 0) {
        playlistContainer.innerHTML = '<p>Sua playlist está vazia.</p>';
        return;
    }

    playlist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'playlist-item';
        const title = item.trackName || item.collectionName || item.artistName;
        
        div.innerHTML = `
            <div><strong>${title}</strong><br><small>${item.artistName || ''}</small></div>
            <label>
                <input type="checkbox" class="suggest-check" data-id="${item.uniqueId}" ${item.suggest ? 'checked' : ''}> Sugerir para a rádio
            </label>
            <button class="btn btn-remove" onclick="removeFromPlaylist(${item.uniqueId})"><i class="fas fa-trash"></i> Remover</button>
        `;
        playlistContainer.appendChild(div);
    });

    document.querySelectorAll('.suggest-check').forEach(check => {
        check.addEventListener('change', (e) => {
            toggleSuggest(Number(e.target.dataset.id), e.target.checked);
        });
    });
}

logo.addEventListener('click', showHome);

searchBtn.addEventListener('click', async () => {
    const term = searchInput.value.trim();
    if (!term) return;
    showResults();
    resultsContainer.innerHTML = '<p>Buscando...</p>';
    try {
        const data = await fetchiTunesData(term, typeFilter.value, explicitFilter.value);
        renderResults(data);
    } catch (e) {
        resultsContainer.innerHTML = '<p>Erro na busca.</p>';
    }
});

closeBtn.onclick = () => {
    modal.style.display = 'none';
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    }
};

renderPlaylist();