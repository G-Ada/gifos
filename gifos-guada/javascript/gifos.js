function getSearchResults(search) {
    const found =
    fetch('http://api.giphy.com/v1/gifs/search?q=' + search +
    '&api_key=' + oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe)
    .then((response) => {
    return response.json()
    }).then(data => {
    return data
    })
    .catch((error) => {
    return error
    })
    return found
    }
    