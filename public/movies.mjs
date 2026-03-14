async function fetchMovies() {
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