const apiKey = '60e7f576'; // API
const noPoster = 'https://www.movienewsletters.net/photos/000000H1.jpg';

const moviesBox = document.querySelector('.movies');
const moviesList = document.getElementsByClassName('movie');
const search = document.getElementById('search');
const year = document.getElementById('year');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const notFoundElement = document.querySelector('.movies__not-found');
let debounseTime;

const getData = key => fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${key}&y=${year.value}`)
  .then(data => data.json())
  .then(data => data.Search)
  .catch(err => console.log(err));

function searchMovies() {
  debounseTime = Date.now();
  setTimeout(() => {
    if (Date.now() - debounseTime > 1000 && search.value.length > 2) {
      animationMovies();
      addMovies();
      notFoundMovies();
    };
    if (search.value.length < 3 && search.value.length > 0) {
      animationMovies();
      notFoundMovies();
    };
    if (search.value.length === 0) {
      animationMovies();
      notFoundMoviesHide();
    }
  }, 1000);
};

function addMovies() {
  if (search.value !== '') {
    notFoundMoviesHide();
    const key = search.value.replace(/ /g, '+').toLowerCase();
    getData(key).then(createMovieElements);
  }
}

function animationMovies() {
  const moviesList = document.querySelectorAll('.movie');
  moviesList.forEach((movie, index) => {
    setTimeout(() => {
      movie.offsetHeight;
      movie.classList.toggle('movie--hide');

      deleteMovie(movie)
    }, index * 100);
  })
};

function deleteMovie(movie) {
  if (movie.classList.contains('movie--hide')) {
    movie.addEventListener('transitionend', () => movie.remove());
  }
}

function createMovieElements(data) {
  data?.forEach(element => {
    const movie = createElement(element);
    moviesBox.append(movie);
  });
  animationMovies();
}


function createElement(element) {
  const movie = document.createElement('div');
  movie.classList.add('movie', 'movie--hide');
  movie.innerHTML = `
  <h3 class="movie__title">${element.Title}</h3>
  <p class="movie__year">Year: ${element.Year}</p>
  <img class="movie__poster" src="${element.Poster === 'N/A' ? noPoster : element.Poster}" alt="Poster of ${element.Title}">
  <p>ID: <span class="movie__id">${element.imdbID}</span></p>`;
  return movie
}

function resetMovies() {
  search.value = '';
  year.value = '';
  animationMovies();
}


function notFoundMovies() {
  setTimeout(() => {
    if (moviesList.length === 0) {
      notFoundElement.classList.add('movies__not-found--show');
    };
  }, 1500);
}

function notFoundMoviesHide() {
  notFoundElement.classList.remove('movies__not-found--show');
}

function openMovie(event) {
  const isMovie = event.target.classList.contains('movie') ? true : event.target.parentElement.classList.contains('movie');
  if (isMovie) {
    const clickElement = event.target.classList.contains('movie') ? event.target : event.target.parentElement;
    const movieId = clickElement.querySelector('.movie__id').textContent;
    window.open(`https://www.imdb.com/title/${movieId}`, '_blank');
  }
}

function init() {
  search.addEventListener('keyup', searchMovies);
  year.addEventListener('keyup', searchMovies);
  searchBtn.addEventListener('click', searchMovies);
  resetBtn.addEventListener('click', resetMovies);
  moviesBox.addEventListener('click', e => openMovie(e));
}

init()