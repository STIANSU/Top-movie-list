document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserStr = localStorage.getItem("loggedInUser");
    if (!loggedInUserStr) return window.location.href = "/"; 

    const user = JSON.parse(loggedInUserStr);
    document.getElementById("welcomeMessage").innerText = `Logget inn som: ${user.email}`;

    const movieForm = document.getElementById("movieForm");
    const moviesList = document.getElementById("moviesList");
    const watchlistList = document.getElementById("watchlistList");
    const movieStatusMsg = document.getElementById("movieStatus");

    const statusSelect = document.getElementById("movieStatus");
    const ratingGroup = document.getElementById("movieRating").parentElement;
    
    statusSelect.addEventListener("change", (e) => {
        if (e.target.value === "watchlist") {
            ratingGroup.style.display = "none";
            document.getElementById("movieRating").required = false;
        } else {
            ratingGroup.style.display = "block";
            document.getElementById("movieRating").required = true;
        }
    });

    fetchMovies();

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
    });

    movieForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("movieTitle").value;
        const status = document.getElementById("movieStatus").value;
        const comment = document.getElementById("movieComment").value;
        const rating = status === "watched" ? document.getElementById("movieRating").value : null;

        try {
            const response = await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, title, rating, comment, status })
            });

            if (response.ok) {
                movieStatusMsg.innerText = "Suksess! 🍿";
                movieForm.reset();
                ratingGroup.style.display = "block";
                fetchMovies();
            } else {
                movieStatusMsg.innerText = "Kunne ikke lagre filmen.";
            }
        } catch (error) {
            movieStatusMsg.innerText = "Serverfeil.";
        }
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
                        <p><em>Notat: "${movie.comment || 'Ingen kommentar'}"</em></p>
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
});