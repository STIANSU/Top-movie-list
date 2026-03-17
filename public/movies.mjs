document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserStr = localStorage.getItem("loggedInUser");
    if (!loggedInUserStr) {
        window.location.href = "/";
        return;
    }

    let user;
    try {
        user = JSON.parse(loggedInUserStr);
    } catch (e) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
        return;
    }

    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage && user && user.email) {
        welcomeMessage.innerText = `Logget inn som: ${user.email}`;
    }

    const watchlistForm = document.getElementById("watchlistForm");
    const watchedForm = document.getElementById("watchedForm");
    const moviesList = document.getElementById("moviesList");
    const watchlistList = document.getElementById("watchlistList");
    const logoutBtn = document.getElementById("logoutBtn");
    const shareBtn = document.getElementById("shareBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "/";
        });
    }

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

    if (watchlistForm) {
        watchlistForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const title = document.getElementById("watchTitle").value;
            const comment = document.getElementById("watchComment").value;
            const msgDiv = document.getElementById("watchStatusMsg");
            
            const success = await saveMovie(title, null, comment, "watchlist", msgDiv);
            if (success) watchlistForm.reset();
        });
    }

    if (watchedForm) {
        watchedForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const title = document.getElementById("seenTitle").value;
            const rating = document.getElementById("seenRating").value;
            const comment = document.getElementById("seenComment").value;
            const msgDiv = document.getElementById("seenStatusMsg");
            
            const success = await saveMovie(title, rating, comment, "watched", msgDiv);
            if (success) watchedForm.reset();
        });
    }

    async function fetchMovies() {
        if (!moviesList || !watchlistList) return;
        
        try {
            const response = await fetch(`/api/movies/${user.id}`);
            const movies = await response.json();
            
            moviesList.innerHTML = "";
            watchlistList.innerHTML = "";

            movies.forEach(movie => {
                const li = document.createElement("li");
                const contentHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3>${movie.title} ${movie.status === 'watched' ? `<span class="rating">⭐ ${movie.rating}/10</span>` : ''}</h3>
                            <p><em>"${movie.comment || 'Ingen kommentar'}"</em></p>
                        </div>
                        <button class="delete-btn" data-id="${movie.id}" style="background-color: #ef4444; padding: 6px 10px; font-size: 1rem; border-radius: 8px;">🗑️</button>
                    </div>
                `;

                if (movie.status === "watchlist") {
                    li.innerHTML = contentHTML + `
                        <button class="mark-seen-btn" data-id="${movie.id}" data-oldcomment="${movie.comment || ''}" style="margin-top: 15px; width: 100%; background-color: #10b981;">✔️ Har sett denne nå!</button>
                    `;
                    watchlistList.appendChild(li);
                } else {
                    li.innerHTML = contentHTML;
                    moviesList.appendChild(li);
                }
            });

            document.querySelectorAll(".mark-seen-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const movieId = e.target.getAttribute("data-id");
                    const oldComment = e.target.getAttribute("data-oldcomment");
                    const givenRating = prompt("Hvor mange stjerner gir du filmen (1-10)? ⭐");
                    
                    if (!givenRating || givenRating < 1 || givenRating > 10) {
                        if (givenRating) alert("Du må skrive et tall mellom 1 og 10!");
                        return; 
                    }

                    let newComment = prompt(`Hva syntes du om filmen?\n\nLa boksen stå tom hvis du vil beholde det gamle notatet: "${oldComment}"`);
                    if (newComment === null || newComment.trim() === "") {
                        newComment = oldComment; 
                    }

                    await fetch(`/api/movies/${movieId}/watched`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ rating: givenRating, comment: newComment })
                    });
                    fetchMovies();
                });
            });

            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    if (confirm("Er du sikker på at du vil slette denne filmen fra listen din? 🗑️")) {
                        const movieId = e.currentTarget.getAttribute("data-id");
                        await fetch(`/api/movies/${movieId}`, {
                            method: "DELETE"
                        });
                        fetchMovies();
                    }
                });
            });

        } catch (error) {
            console.error(error);
        }
    }

if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            const shareText = `Sjekk ut filmlisten min på FilmToppen!`;
            const shareUrl = `${window.location.origin}/shared.html?user=${user.id}`; 
            if (navigator.share) {
                navigator.share({ title: 'Min Filmliste', text: shareText, url: shareUrl }).catch(console.error);
            } else {
                window.location.href = `mailto:?subject=Min filmliste&body=${shareText} %0D%0A${shareUrl}`;
            }
        });
    }

    fetchMovies();
});