import user from "../do/user.mjs";
import { generateID } from "../do/user.mjs";

const temporaryUserStore = [];

export function createNewUser(email, passwordToken) {
    let newUser = user();
    newUser.id = generateID();
    newUser.email = email;
    newUser.token = passwordToken;
    
    temporaryUserStore.push(newUser);
    return newUser;
}

export function removeUser(id) {
    const index = temporaryUserStore.findIndex(u => u.id === id);
    if (index !== -1) {
        temporaryUserStore.splice(index, 1);
        return true; 
    }
    return false;
}