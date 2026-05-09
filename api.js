async function fetchiTunesData(term, entity, explicit) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&explicit=${explicit}&limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}