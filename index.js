const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src='${imgSrc}' />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '45d33aa',
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie, rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '45d33aa',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieDetailsTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {

    const leftSideStats = document.querySelectorAll('#left-summary .notification');

    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStatsElement, index) => {
        const rightStatsElement = rightSideStats[index];

        const leftSideValue = +leftStatsElement.dataset.value;
        const rightSideValue = +rightStatsElement.dataset.value;

        if (leftSideValue > rightSideValue) {
            rightStatsElement.classList.remove('is-primary');
            rightStatsElement.classList.add('is-warning');
        } else if (leftSideValue < rightSideValue) {
            leftStatsElement.classList.remove('is-primary');
            leftStatsElement.classList.add('is-warning');
        }
    })
};

const movieDetailsTemplate = (movieDetails) => {
    let dollars = +movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '');
    let metaScore = +movieDetails.Metascore;
    let imdbRating = +movieDetails.imdbRating;
    let imdbVotes = +movieDetails.imdbVotes.replace(/,/g, '');

    dollars = isNaN(dollars) ? 0 : dollars;
    metaScore = isNaN(metaScore) ? 0 : metaScore;
    imdbRating = isNaN(imdbRating) ? 0 : imdbRating;
    imdbVotes = isNaN(imdbVotes) ? 0 : imdbVotes;

    return `
        <article class="media">
            <figure class="mdeia-left">
                <p class="image">
                    <img src="${movieDetails.Poster}">
                </p>
            <figure/>
            <div class="media-content">
                <div class="content">
                <h1>${movieDetails.Title}</h1>
                <h4>${movieDetails.Genre}</h4>
                <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box-Office</p>
        </article>
        
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}