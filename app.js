import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyChzBuusXMN7yOLOU1uYNDg1UyGEBZTbw4",
    authDomain: "soundsearch-68f70.firebaseapp.com",
    projectId: "soundsearch-68f70",
    storageBucket: "soundsearch-68f70.firebasestorage.app",
    messagingSenderId: "347335695662",
    appId: "1:347335695662:web:fd5517927a9eb4d2c8af3f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const logo = document.getElementById('logo');
const homeView = document.getElementById('homeView');
const searchView = document.getElementById('searchView');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const explicitFilter = document.getElementById('explicitFilter');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const playlistContainer = document.getElementById('playlistContainer');
const mobileTabs = document.getElementById('mobileTabs');
const playlistSection = document.querySelector('.playlist-section');
const openSuggestionModalBtn = document.getElementById('openSuggestionModalBtn');
const playlistFeedback = document.getElementById('playlistFeedback');
const suggestionForm = document.getElementById('suggestionForm');
const fullName = document.getElementById('fullName');
const studentId = document.getElementById('studentId');
const academicEmail = document.getElementById('academicEmail');
const choiceReason = document.getElementById('choiceReason');
const formFeedback = document.getElementById('formFeedback');
const modal = document.getElementById('detailsModal');
const suggestionModal = document.getElementById('suggestionModal');
const modalBody = document.getElementById('modalBody');
const detailsCloseBtn = document.getElementById('detailsCloseBtn');
const suggestionCloseBtn = document.getElementById('suggestionCloseBtn');

let currentAudio = null;
let activeMobileTab = 'results';

function isMobileLayout() {
    return window.innerWidth <= 860;
}

function updateMobileTabs() {
    if (!mobileTabs || !playlistSection) return;

    const isMobile = isMobileLayout();

    searchView.classList.toggle('is-mobile-layout', isMobile);

    resultsContainer.classList.toggle('mobile-only-hidden', isMobile && activeMobileTab !== 'results');
    playlistSection.classList.toggle('mobile-only-hidden', isMobile && activeMobileTab !== 'playlist');

    mobileTabs.querySelectorAll('.mobile-tab').forEach(button => {
        button.classList.toggle('is-active', button.dataset.tab === activeMobileTab);
    });
}

function setMobileTab(tab) {
    activeMobileTab = tab;
    updateMobileTabs();
}

function showHome() {
    homeView.style.display = 'flex';
    searchView.style.display = 'none';
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    setMobileTab('results');
}

function showResults() {
    homeView.style.display = 'none';
    searchView.style.display = 'flex';
    updateMobileTabs();
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

        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-add';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
        addBtn.onclick = () => addToPlaylist(item);
        card.appendChild(addBtn);

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
    openSuggestionModalBtn.disabled = playlist.length === 0;

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
            <label class="playlist-select">
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

window.renderPlaylist = renderPlaylist;

function getFieldErrorElement(fieldId) {
    return document.getElementById(fieldId + 'Error');
}

function setFieldError(field, message) {
    field.classList.add('input-error');
    getFieldErrorElement(field.id).textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('input-error');
    getFieldErrorElement(field.id).textContent = '';
}

function setFormFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = 'form-feedback';

    if (type) {
        formFeedback.classList.add(type === 'success' ? 'is-success' : 'is-error');
    }
}

function setPlaylistFeedback(message, type) {
    playlistFeedback.textContent = message;
    playlistFeedback.className = 'form-feedback';

    if (type) {
        playlistFeedback.classList.add(type === 'success' ? 'is-success' : 'is-error');
    }
}

function getSelectedTracks() {
    return playlist.filter(item => item.suggest);
}

function openSuggestionModal() {
    if (getSelectedTracks().length === 0) {
        setPlaylistFeedback('Selecione pelo menos uma música da playlist para enviar.', 'error');
        return;
    }

    setPlaylistFeedback('', '');
    setFormFeedback('', '');
    suggestionModal.style.display = 'flex';
}

function closeSuggestionModal() {
    suggestionModal.style.display = 'none';
}

function closeDetailsModal() {
    modal.style.display = 'none';
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
}

function validateFullName() {
    const value = fullName.value.trim();

    if (!value) {
        setFieldError(fullName, 'Informe o nome completo.');
        return false;
    }

    if (value.split(/\s+/).filter(Boolean).length < 2) {
        setFieldError(fullName, 'Digite pelo menos nome e sobrenome.');
        return false;
    }

    clearFieldError(fullName);
    return true;
}

function validateStudentId() {
    const value = studentId.value.trim();

    if (!value) {
        setFieldError(studentId, 'Informe a matrícula.');
        return false;
    }

    if (!/^\d+$/.test(value)) {
        setFieldError(studentId, 'A matrícula deve conter apenas números.');
        return false;
    }

    clearFieldError(studentId);
    return true;
}

function validateAcademicEmail() {
    const value = academicEmail.value.trim();

    if (!value) {
        setFieldError(academicEmail, 'Informe o e-mail académico.');
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldError(academicEmail, 'Informe um e-mail válido.');
        return false;
    }

    clearFieldError(academicEmail);
    return true;
}

function validateChoiceReason() {
    const value = choiceReason.value.trim();

    if (!value) {
        setFieldError(choiceReason, 'Informe a justificativa da escolha.');
        return false;
    }

    if (value.length < 15) {
        setFieldError(choiceReason, 'A justificativa deve ter pelo menos 15 caracteres.');
        return false;
    }

    clearFieldError(choiceReason);
    return true;
}

function validateSuggestionForm() {
    const isFullNameValid = validateFullName();
    const isStudentIdValid = validateStudentId();
    const isAcademicEmailValid = validateAcademicEmail();
    const isChoiceReasonValid = validateChoiceReason();

    return isFullNameValid && isStudentIdValid && isAcademicEmailValid && isChoiceReasonValid;
}

function resetSuggestionForm() {
    suggestionForm.reset();
    [fullName, studentId, academicEmail, choiceReason].forEach(clearFieldError);
}

function clearActivePlaylist() {
    playlist = [];
    savePlaylist();
}

function handleFieldInput(field, validateField) {
    field.addEventListener('input', () => {
        clearFieldError(field);

        if (formFeedback.textContent) {
            setFormFeedback('', '');
        }

        if (playlistFeedback.textContent) {
            setPlaylistFeedback('', '');
        }

        if (field.value.trim()) {
            validateField();
        }
    });
}

async function handleSearch() {
    const term = searchInput.value.trim();
    if (!term) return;

    showResults();
    setMobileTab('results');
    resultsContainer.innerHTML = '<p>Buscando...</p>';

    try {
        const data = await fetchiTunesData(term, typeFilter.value, explicitFilter.value);
        renderResults(data);
    } catch (e) {
        resultsContainer.innerHTML = '<p>Erro na busca.</p>';
    }
}

logo.addEventListener('click', showHome);

mobileTabs.querySelectorAll('.mobile-tab').forEach(button => {
    button.addEventListener('click', () => {
        setMobileTab(button.dataset.tab);
    });
});

openSuggestionModalBtn.addEventListener('click', openSuggestionModal);

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

handleFieldInput(fullName, validateFullName);
handleFieldInput(studentId, validateStudentId);
handleFieldInput(academicEmail, validateAcademicEmail);
handleFieldInput(choiceReason, validateChoiceReason);

suggestionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateSuggestionForm()) {
        setFormFeedback('Corrija os campos destacados para enviar suas sugestões.', 'error');
        return;
    }

    try {
        await addDoc(collection(db, 'sugestoes'), {
            fullName: fullName.value.trim(),
            studentId: studentId.value.trim(),
            academicEmail: academicEmail.value.trim(),
            choiceReason: choiceReason.value.trim(),
            tracks: getSelectedTracks(),
            createdAt: new Date()
        });

        clearActivePlaylist();
        resetSuggestionForm();
        setFormFeedback('Sugestões enviadas com sucesso para a coordenação da SoundSearch.', 'success');
        setPlaylistFeedback('Sugestões enviadas com sucesso.', 'success');
        closeSuggestionModal();
    } catch (error) {
        setFormFeedback('Não foi possível enviar suas sugestões no momento. Tente novamente.', 'error');
    }
});

detailsCloseBtn.onclick = closeDetailsModal;
suggestionCloseBtn.onclick = closeSuggestionModal;

window.onclick = (e) => {
    if (e.target === modal) {
        closeDetailsModal();
    }

    if (e.target === suggestionModal) {
        closeSuggestionModal();
    }
};

window.addEventListener('resize', updateMobileTabs);

updateMobileTabs();
renderPlaylist();