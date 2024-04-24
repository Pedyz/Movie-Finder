// These are the DOM elements.
const input = document.getElementById('genresInput');
const button = document.getElementById('submitBtn');
const dataList = document.getElementById('genres');
const boxDiv = document.getElementById('box');

// Put your API key here.
const apiKey = yourApiKey;

const url = 'https://api.themoviedb.org/3';

// This function gets a list with all movies genres from the API.
const getMoviesGenres = async () => {
    const endPoint = '/genre/movie/list';
    const params = `?api_key=${apiKey}`;
    const urlToFetch = url + endPoint + params;

    try {
        const response = await fetch(urlToFetch);
        if(response.ok) {
            const jsonResponse = await response.json();
            const genres = jsonResponse.genres;
            return genres;
        };
    } catch(error) {
        console.log(error);
    };

};

// This function creates the list in the input.
const setGenreList = async () => {
    const genres = await getMoviesGenres();
    for (let i = 0; i < genres.length; i++) {
        const newOption = document.createElement('option');
        newOption.value = genres[i].name;
        dataList.appendChild(newOption);
    };
};

// This function gets the id of the genre that you selected on the input.
const getGenreId = async () => {
    const inputValue = input.value;
    const genres = await getMoviesGenres();
    const pickedGenre = [];
    for (let i = 0; i < genres.length; i++) {
        if (genres[i].name === inputValue) {
            pickedGenre.push(genres[i]);
        };
    };
    const genreId = pickedGenre[0].id;
    return genreId;
};

// This function gets a list of 20 movies with the genre that you selected.
const getMoviesByGenre = async () => {
    const inputValue = input.value;
    const genreId = await getGenreId();
    const endPoint = '/discover/movie';
    const params = `?api_key=${apiKey}&with_genres=${genreId}`;
    const urlToFetch = url + endPoint + params;
    try {

        const response = await fetch(urlToFetch);
        if(response.ok) {
            const jsonResponse = await response.json();
            const results = jsonResponse.results;
            return results 
        };

    } catch(error) {
        console.log(error);
    };
};

// This function selects a random movie in the movie list that you get using the function above. 
const getRandomMovieByGenre = async movieList => {
    const list = await movieList ;
    const randomNum = Math.floor(Math.random() * list.length);
    const movie = list[randomNum];
    return movie;
};

// This function updates the box that shows the movie, title and overview.
const updateMovieBox = async movie => {
    boxDiv.innerHTML = '';

    const movieImg = document.createElement('img');
    const movieObj = await movie;
    const endPoint = movieObj.poster_path;
    movieImg.src = 'http://image.tmdb.org/t/p/w500' + endPoint;
    
    const textDiv = document.createElement('div');
    textDiv.id = 'textDiv';

    const title = document.createElement('h2');
    title.textContent = movieObj.title;

    const overview = document.createElement('h3');
    overview.textContent = movieObj.overview;

    boxDiv.appendChild(movieImg);
    boxDiv.appendChild(textDiv);
    textDiv.appendChild(title);
    textDiv.appendChild(overview);
};

// This Event Listener calls the functions when you click the button.
button.addEventListener('click', () => {

    const randomMovie = getRandomMovieByGenre(getMoviesByGenre());
    updateMovieBox(randomMovie);

});

// Calling the function that puts the genre list in the input.
setGenreList();



