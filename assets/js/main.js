const apiKey = '60e7f576'; // API ключ
const noPoster = 'https://www.movienewsletters.net/photos/000000H1.jpg'; // посилання на зображення без постеру

const moviesBox = document.querySelector('.movies'); // контейнер з фильмами
const moviesList = document.getElementsByClassName('movie'); // всі фильми
const search = document.getElementById('search'); // пошук
const year = document.getElementById('year'); // рік
const searchBtn = document.getElementById('search-btn'); // пошук
const resetBtn = document.getElementById('reset-btn'); // скидує пошук
const notFoundElement = document.querySelector('.movies__not-found'); // немає фільмів
let debounseTime; // змінна для створення затримки між натисканням клавішами

// функція запиту даних з API
const getData = key => fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${key}&y=${year.value}`)
  .then(data => data.json())
  .then(data => data.Search)
  .catch(err => console.log(err));

// функція пошуку фільмів
function searchMovies() {
  debounseTime = Date.now();
  setTimeout(() => {
    if (Date.now() - debounseTime > 1000 && search.value.length >= 3) {
      animationMovies(); // анімація
      addMovies(); // додавання
      notFoundMovies(); // якщо немає фільмів
    };
    if (search.value.length < 3) {
      animationMovies(); // анімація
      notFoundMoviesHide(); // якщо немає фільмів, прибрати елемент
    };
  }, 1000); // час анімації
};

// функція додавання фільмів
function addMovies() {
  notFoundMoviesHide();
  const key = search.value.trim().replace(/ /g, '+').toLowerCase();
  getData(key).then(createMovieElements);
}

// функція анімації
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

// функція видалення елементів
function deleteMovie(movie) {
  if (movie.classList.contains('movie--hide')) {
    movie.addEventListener('transitionend', () => movie.remove());
  }
}

// функція створення массиву елементів
function createMovieElements(data) {
  console.log(data)
  data?.forEach(element => {
    const movie = createElement(element);
    moviesBox.prepend(movie);
  });
  animationMovies();
}


// функція створення елементу
function createElement(element) {
  const movie = document.createElement('div');
  movie.classList.add('movie', 'movie--hide');
  movie.innerHTML = `
  <h3 class="movie__title">${element.Title}</h3>
  <p class="movie__info">Year: ${element.Year}. Type: ${element.Type}</p>
  <img class="movie__poster" src="${element.Poster === 'N/A' ? noPoster : element.Poster}" alt="Poster of ${element.Title}">
  <p class="movie__id">ID: <span class="element__id">${element.imdbID}</span></p>`;
  return movie
}

// функція скидує пошук
function resetMovies() {
  search.value = '';
  year.value = '';
  animationMovies();
}

// функція якщо немає фільмів, додає оповіщення
function notFoundMovies() {
  setTimeout(() => {
    if (moviesList.length === 0) {
      notFoundElement.classList.add('movies__not-found--show');
    };
  }, 1500);
}

// функція приховування оповіщення
function notFoundMoviesHide() {
  notFoundElement.classList.remove('movies__not-found--show');
}

// функція відкриття фільму на іншому сайті
function openMovie(event) {
  const isMovie = event.target.classList.contains('movie') ? true : event.target.parentElement.classList.contains('movie');
  if (isMovie) {
    const clickElement = event.target.classList.contains('movie') ? event.target : event.target.parentElement;
    const movieId = clickElement.querySelector('.element__id').textContent;
    window.open(`https://www.imdb.com/title/${movieId}`, '_blank');
  }
}

// функція ініціалізації прослуговування
function init() {
  search.addEventListener('keyup', searchMovies);
  year.addEventListener('keyup', searchMovies);
  searchBtn.addEventListener('click', searchMovies);
  resetBtn.addEventListener('click', resetMovies);
  moviesBox.addEventListener('click', e => openMovie(e));
}

// ініціалізація
init()