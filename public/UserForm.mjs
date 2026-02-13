// Dette er "UI"-laget vårt.
import { createUser, deleteUser } from "./api.mjs";

export class UserForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
this.innerHTML = `
            <div class="form-container">
                <h3>Registrer ny bruker</h3>
                
                <form id="registerForm">
                    <input type="email" id="email" placeholder="E-post" required>
                    <input type="password" id="password" placeholder="Passord" required>
                    
                    <label style="display:block; margin: 10px 0;">
                        <input type="checkbox" id="tos" required> Jeg har lest og godtar
                        <a href="/TOS.md" target="_blank">brukervilkår.</a>
                    </label>    

                    <button type="submit">Opprett bruker</button>
                </form>

                <hr>
                
                <h3>Slett bruker</h3>
                <form id="deleteForm">
                    <input type="text" id="deleteId" placeholder="Bruker ID">
                    <button type="submit">Slett</button>
                </form>
                
                <div id="statusMessage"></div>
            </div>
        `;

        this.setupEventListeners();
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
        this.showStatus(`Suksess! ID er: ${response.user.id} (*Test* Kopier denne for å slette)`);

        console.log("Ny bruker ID:", response.user.id);
    } else {
        this.showStatus(response.message || response.error);
    }
});


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