class MovieFinder {
    constructor() {
        //this.getUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=${apiKey.omdb}`;
        this.getUrl = `http://www.omdbapi.com/?s=potter&type=movie&apikey=${apiKey.omdb}&`;
        this.postUrl = `http://img.omdbapi.com/?apikey=${apiKey.omdb}&`;
        this.btnElt = document.querySelectorAll('.btn-modal');
        this.searchList = document.getElementById('search-list');
        this.movieTitle = document.getElementById('movie-title');
        this.releaseDate = document.getElementById('release-date');
        this.plot = document.getElementById('plot');
    }

    async showMovie() {
        let data = await this.getData();
        await this.listData(data.Search);
        console.log('==>', data);
    }

    async getData() {
        let result = '';
        const data = await fetch(this.getUrl)
            .then(res => res.json())
            .then(res => result = res)
            .catch(err => console.error('Error =>', err));
        return result;
    }

    async getModalData(imdb) {
        let url = `http://www.omdbapi.com/?i=${imdb}&apikey=${apiKey.omdb}`;
        let result = '';
        const data = await fetch(url)
            .then(res => res.json())
            .then(res => result = res)
            .catch(err => console.error('Error =>', err));
        return result;
    }

    async listData(data) {
        this.searchList.innerHTML = '';
        await data.map(record => {
            this.searchList.innerHTML += this.populateTemplate(record);
        });
    }

    populateTemplate(data) {
        let content = `
            <li class="card">
                <img src="${data.Poster}.png" alt="${data.Title}">
                <div class="card-body">
                    <h5 class="card-title">${data.Title}</h5>
                    <p class="card-text">${data.Year}</p>
                    <a href="#" class="btn btn-primary btn-modal" id="${data.imdbID}">Read More</a>
                </div>
            </li>
        `;
        return content;
    }

    populateModal(data) {
        this.btnElt.forEach(btn => {
            btnElt.addEventListener('click', (e) => {
                e.preventDefault();
            });
        })
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const movieFinder = new MovieFinder();
    movieFinder.showMovie();
});