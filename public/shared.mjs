document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');

    const welcomeMessage = document.getElementById("welcomeMessage");
    const moviesList = document.getElementById("moviesList");
    const watchlistList = document.getElementById("watchlistList");

    if (!userId) {
        welcomeMessage.innerText = "Ugyldig lenke. Fant ingen bruker-ID.";
        return;
    }

    try {
        const response = await fetch(`/api/movies/${userId}`);
        
        if (!response.ok) {
            welcomeMessage.innerText = "Fant ikke listen.";
            return;
        }

        const movies = await response.json();
        
        if (movies.length === 0) {
            welcomeMessage.innerText = "Denne listen er tom.";
            return;
        }

        welcomeMessage.innerText = `Viser filmlisten til en venn!`;

        moviesList.innerHTML = "";
        watchlistList.innerHTML = "";

        movies.forEach(movie => {
            const li = document.createElement("li");
            const contentHTML = `
                <div>
                    <h3>${movie.title} ${movie.status === 'watched' ? `<span class="rating">⭐ ${movie.rating}/10</span>` : ''}</h3>
                    <p><em>"${movie.comment || 'Ingen kommentar'}"</em></p>
                </div>
            `;

            li.innerHTML = contentHTML;

            if (movie.status === "watchlist") {
                watchlistList.appendChild(li);
            } else {
                moviesList.appendChild(li);
            }
        });

    } catch (error) {
        console.error(error);
        welcomeMessage.innerText = "Kunne ikke laste listen.";
    }
});