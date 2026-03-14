document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserStr = localStorage.getItem("loggedInUser");
    if (!loggedInUserStr) {
        window.location.href = "/"; 
        return;
    }

    const user = JSON.parse(loggedInUserStr);
    document.getElementById("welcomeMessage").innerText = `Logget inn som: ${user.email}`;

    const movieForm = document.getElementById("movieForm");
    const moviesList = document.getElementById("moviesList");
    const movieStatus = document.getElementById("movieStatus");
    const logoutBtn = document.getElementById("logoutBtn");
    const shareBtn = document.getElementById("shareBtn");

    fetchMovies();

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
    });

    movieForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const title = document.getElementById("movieTitle").value;
        const rating = document.getElementById("movieRating").value;
        const comment = document.getElementById("movieComment").value;

        try {
            const response = await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    title: title,
                    rating: rating,
                    comment: comment
                })
            });

            if (response.ok) {
                movieStatus.innerText = "Film lagret! 🍿";
                movieForm.reset();
                fetchMovies();
            } else {
                movieStatus.innerText = "Kunne ikke lagre filmen.";
            }
        } catch (error) {
            movieStatus.innerText = "Klarte ikke koble til serveren.";
        }
    });


    async function fetchMovies() {
        try {
            const response = await fetch(`/api/movies/${user.id}`);
            if (!response.ok) throw new Error("Feil ved henting");
            const movies = await response.json();
            moviesList.innerHTML = "";
            if (movies.length === 0) {
                moviesList.innerHTML = "<p>Du har ikke lagt til noen filmer enda.</p>";
                return;
            }

            movies.forEach(movie => {
                const li = document.createElement("li");
                li.style.borderBottom = "1px solid #ccc";
                li.style.padding = "10px 0";
                li.innerHTML = `
                    <h3>${movie.title} <span style="font-size: 0.8em; color: #666;">(Terningkast: ${movie.rating}/10)</span></h3>
                    <p><em>"${movie.comment || 'Ingen kommentar'}"</em></p>
                `;
                moviesList.appendChild(li);
            });
        } catch (error) {
            console.error("Hentefeil:", error);
            moviesList.innerHTML = "<p style='color:red;'>Kunne ikke laste filmene dine.</p>";
        }
    }

    shareBtn.addEventListener("click", () => {
        const shareText = `Sjekk ut filmlisten min på FilmToppen!`;
        const shareUrl = window.location.href; 
        if (navigator.share) {
            navigator.share({
                title: 'Min Filmliste',
                text: shareText,
                url: shareUrl
            }).catch(console.error);
        } else {
            window.location.href = `mailto:?subject=Min filmliste&body=${shareText} %0D%0A${shareUrl}`;
        }
    });
});