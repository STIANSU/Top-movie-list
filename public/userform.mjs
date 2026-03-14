import { createUser, deleteUser } from "./api.mjs";

export class userform extends HTMLElement {
    constructor() {
        super();
    }

async connectedCallback() {
        try {
            const response = await fetch("userform.html");
            if (!response.ok) {
                throw new Error(`Fant ikke userform.html (Status: ${response.status})`);
            }
            const html = await response.text();
            this.innerHTML = html;
            this.setupEventListeners();
        } catch (err) {
            this.innerHTML = `<p style="color:red">Feil ved lasting av skjema: ${err.message}</p>`;
            console.error(err);
        }
    }

    setupEventListeners() {
        const regForm = this.querySelector("#registerForm");
        const delForm = this.querySelector("#deleteForm");
        const loginForm = this.querySelector("#loginForm");
        if (regForm) {
            regForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const user = {
                    email: regForm.querySelector("#email").value,
                    password: regForm.querySelector("#password").value
                };
                const response = await createUser(user);
                if (response && response.user && response.user.id) {
                    this.showStatus(`Suksess! Bruker opprettet.`);
                } else {
                    this.showStatus("Kunne ikke opprette bruker.");
                }
            });
        }
        
        if (delForm) {
            delForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const id = delForm.querySelector("#deleteId").value;
                const response = await deleteUser(id);
                this.showStatus(response.message || response.error);
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const credentials = {
                    email: loginForm.querySelector("#loginEmail").value,
                    password: loginForm.querySelector("#loginPassword").value
                };
                try {
                    const response = await fetch("/user/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials)
                    });
                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                        this.showStatus(`Velkommen tilbake, ${data.user.email}! Laster inn filmene dine...`);
                        setTimeout(() => {
                            window.location.href = "/movies.html"; 
                        }, 1500);
                    } else {
                        this.showStatus(data.error || "Feil ved innlogging");
                    }
                } catch (err) {
                    this.showStatus("Kunne ikke koble til serveren.");
                }
            });
        }
    }

    showStatus(msg) {
        const statusEl = this.querySelector("#statusMessage");
        if (statusEl) statusEl.innerText = msg;
    }
}

customElements.define("user-form", userform);