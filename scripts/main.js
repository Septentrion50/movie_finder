class MovieFinder {
    constructor() {
        this.getUrl = '';
        this.lazy = document.querySelectorAll('.lazy');
        this.form = document.getElementById('search-movies-form');
        this.inputSearch = document.getElementById('movie-search');
        this.btnElt = document.getElementsByClassName('btn-modal');
        this.searchList = document.getElementById('search-list');
        this.poster = document.getElementById('poster');
        this.movieTitle = document.getElementById('movie-title');
        this.releaseDate = document.getElementById('release-date');
        this.plot = document.getElementById('plot');
    }

    async showMovies() {
        let data = await this.getData();
        await this.listData(data.Search);
        //console.log('==>', data);
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

    async observerElements() {
        const arr = document.querySelectorAll('.lazy');
        // const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        //     console.log(">>> 1 ");
        //     entries.forEach((entry) => {
        //         console.log(">>> 2 forEach");
        //         if (entry.isIntersecting) {
        //             const lazyImage = entry.target;
        //             console.log("lazy loading ", lazyImage);
        //             lazyImage.src = lazyImage.dataset.src;
        //             lazyImage.classList.remove("lazy");
        //             imgObserver.unobserve(lazyImage);
        //         }
        //     })
        // });
        // arr.forEach(v => {
        //     imageObserver.observe(v);
        // });
        const imageObserver = await new IntersectionObserver((entries, imgObserver) => {
            console.log(">>> 1 ");
            entries.forEach(entry => {
                console.log(">>> 2 forEach");
                if (entry.isIntersectionRatio > 0) {
                    const lazyItem = entry.target;
                    lazyItem.classList.remove('opacity-0');
                    console.log("lazy loading ", lazyItem);
                    imageObserver.unobserve(lazyImage);
                }
            })
        });
        arr.forEach(a => {
            console.log(">>> ",imageObserver);
            a.classList.add('opacity-0');
            imageObserver.observe(a);
        });
    }

    async listenReadMore() {
        //console.log('->', this.btnElt);
        this.searchList.addEventListener('click', async (e) => {
            e.preventDefault();
            if (e.target.classList.contains('btn-modal')) {
                const id = e.target.id;
                const movieData = await this.getModalData(id);
                this.populateModal(movieData);
                //console.log('->', movieData);
            }
        });
    }

    async listenQuery() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = this.inputSearch.value.split(' ');
            const query = val.join('+');
            this.getUrl = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey.omdb}&`;

            this.showMovies();
            this.listenReadMore();
        });
    }

    populateTemplate(data) {
        let content = `
            <li class="card lazy opacity-0">
                <img src="./img/placeholder.jpg" data-src="${data.Poster}.png" alt="${data.Title}" class="">
                <div class="card-body">
                    <h5 class="card-title">${data.Title}</h5>
                    <p class="card-text">${data.Year}</p>
                    <button type="button" data-bs-toggle="modal" data-bs-target="#infos-modal" class="btn btn-primary btn-modal" id="${data.imdbID}">Read More</button>
                </div>
            </li>
        `;
        return content;
    }

    populateModal(data) {
        this.poster.setAttribute('src', data.Poster);
        this.movieTitle.innerText = data.Title;
        this.releaseDate.innerText = data.Released;
        this.plot.innerText = data.Plot;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const movieFinder = new MovieFinder();
    movieFinder.listenQuery();
    movieFinder.observerElements();
});