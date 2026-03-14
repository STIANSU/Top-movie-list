document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserStr = localStorage.getItem("loggedInUser");
    if (!loggedInUserStr) return window.location.href = "/"; 

    const user = JSON.parse(loggedInUserStr);
    document.getElementById("welcomeMessage").innerText = `Logget inn som: ${user.email}`;

    const watchlistForm = document.getElementById("watchlistForm");
    const watchedForm = document.getElementById("watchedForm");
    const moviesList = document.getElementById("moviesList");
    const watchlistList = document.getElementById("watchlistList");

    fetchMovies();

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
    });


    async function saveMovie(title, rating, comment, status, statusMsgEl) {
        try {
            statusMsgEl.innerText = "Lagrer...";
            const response = await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, title, rating, comment, status })
            });

            if (response.ok) {
                statusMsgEl.innerText = "Lagt til! 🍿";
                setTimeout(() => statusMsgEl.innerText = "", 3000);
                fetchMovies();
                return true; 
            } else {
                statusMsgEl.innerText = "Kunne ikke lagre filmen.";
                return false;
            }
        } catch (error) {
            statusMsgEl.innerText = "Serverfeil.";
            return false;
        }
    }

    watchlistForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("watchTitle").value;
        const comment = document.getElementById("watchComment").value;
        const msgDiv = document.getElementById("watchStatusMsg");
        const success = await saveMovie(title, null, comment, "watchlist", msgDiv);
        if (success) watchlistForm.reset(); 
    });

    watchedForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("seenTitle").value;
        const rating = document.getElementById("seenRating").value;
        const comment = document.getElementById("seenComment").value;
        const msgDiv = document.getElementById("seenStatusMsg");
        const success = await saveMovie(title, rating, comment, "watched", msgDiv);
        if (success) watchedForm.reset(); 
    });

    async function fetchMovies() {
        try {
            const response = await fetch(`/api/movies/${user.id}`);
            const movies = await response.json();
            
            moviesList.innerHTML = "";
            watchlistList.innerHTML = "";

            movies.forEach(movie => {
                const li = document.createElement("li");
                
                if (movie.status === "watchlist") {
                    li.innerHTML = `
                        <h3>${movie.title}</h3>
                        <p><em>"${movie.comment || 'Ingen kommentar'}"</em></p>
                        <button class="mark-seen-btn" data-id="${movie.id}" style="margin-top: 10px; background-color: #10b981;">✔️ Har sett denne nå!</button>
                    `;
                    watchlistList.appendChild(li);
                } else {
                    li.innerHTML = `
                        <h3>${movie.title} <span class="rating">⭐ ${movie.rating}/10</span></h3>
                        <p><em>"${movie.comment || 'Ingen kommentar'}"</em></p>
                    `;
                    moviesList.appendChild(li);
                }
            });

            document.querySelectorAll(".mark-seen-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const movieId = e.target.getAttribute("data-id");
                    const givenRating = prompt("Hvor mange stjerner gir du filmen (1-10)? ⭐");
                    
                    if (givenRating && givenRating >= 1 && givenRating <= 10) {
                        await fetch(`/api/movies/${movieId}/watched`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ rating: givenRating })
                        });
                        fetchMovies();
                    } else if (givenRating) {
                        alert("Du må skrive et tall mellom 1 og 10!");
                    }
                });
            });

        } catch (error) {
            console.error(error);
        }
    }

    document.getElementById("shareBtn").addEventListener("click", () => {
        const shareText = `Sjekk ut filmlisten min på FilmToppen!`;
        const shareUrl = window.location.href; 
        if (navigator.share) {
            navigator.share({ title: 'Min Filmliste', text: shareText, url: shareUrl }).catch(console.error);
        } else {
            window.location.href = `mailto:?subject=Min filmliste&body=${shareText} %0D%0A${shareUrl}`;
        }
    });
});