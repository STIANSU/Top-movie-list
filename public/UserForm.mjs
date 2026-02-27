import { createUser, deleteUser } from "./api.mjs";

export class UserForm extends HTMLElement {
    constructor() {
        super();
    }

async connectedCallback() {
        try {
            const response = await fetch("./UserForm.html");
            if (!response.ok) {
                throw new Error(`Fant ikke UserForm.html (Status: ${response.status})`);
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
        this.querySelector("#registerForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const user = {
                email: form.querySelector("#email").value,
                password: form.querySelector("#password").value
            };

            const response = await createUser(user);
            if (response.user && response.user.id) {
                this.showStatus(`Suksess! Bruker opprettet.`);

                // Test for sletting av ID, fjerner før aller siste innlevering ------------------------------
                this.querySelector("#deleteId").value = response.user.id;
            } else {
                this.showStatus(response.message || response.error);
            }
        });
                //--------------------------------------------------------------------------------------
        
        this.querySelector("#deleteForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = this.querySelector("#deleteId").value;
            const response = await deleteUser(id);
            this.showStatus(response.message || response.error);
        });
    }

    showStatus(msg) {
        this.querySelector("#statusMessage").innerText = msg;
    }
}

customElements.define("user-form", UserForm);