const API_BASE = "/user"; 


async function makeRequest(method, body = null) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(API_BASE, options);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Noe gikk galt" };
    }
}


export const createUser = (user) => makeRequest("POST", user);
export const deleteUser = (id) => makeRequest("DELETE", { id });