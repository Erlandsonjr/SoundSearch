let playlist = JSON.parse(localStorage.getItem('soundsearch_playlist')) || [];

function savePlaylist() {
    localStorage.setItem('soundsearch_playlist', JSON.stringify(playlist));
    renderPlaylist();
}

function addToPlaylist(track) {
    const id = track.trackId || track.collectionId || track.artistId;
    if (!playlist.some(item => (item.trackId || item.collectionId || item.artistId) === id)) {
        playlist.push({ ...track, suggest: false, uniqueId: id });
        savePlaylist();
    }
}

function removeFromPlaylist(id) {
    playlist = playlist.filter(item => item.uniqueId !== id);
    savePlaylist();
}

function toggleSuggest(id, isChecked) {
    const index = playlist.findIndex(item => item.uniqueId === id);
    if (index !== -1) {
        playlist[index].suggest = isChecked;
        savePlaylist();
    }
}