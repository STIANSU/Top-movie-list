import { createUser, deleteUser } from "./api.mjs";

export class UserForm extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch('UserForm.html');
            this.innerHTML = await response.text();
            this.setupEventListeners();
        } catch (error) {
            console.error("Feil ved lasting av mal:", error);
        }
    }

    setupEventListeners() {
        // Registrering
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
                
                // Test for sletting av ID, fjerner før siste innlevering ------------------------------
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