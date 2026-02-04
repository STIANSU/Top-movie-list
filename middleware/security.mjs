import { createHmac } from 'node:crypto';

function securityAudit(req, res, next) {
    if (req.method.toUpperCase() === "POST") {
        if (req.body && req.body.password) {
            const psw = req.body.password;
            req.body.password = "";
            
            const secret = process.env.SECRET || "VerySuperDuperSecret";
            req.token = createSecurePassToken(psw, secret);
        }
    }
    next();
}

function createSecurePassToken(psw, secret) {
    return {
        psw: hashPassword(psw, secret),
        timestamp: Date.now()
    };
}

function hashPassword(psw, secret) {
    const hmac = createHmac("sha256", secret);
    hmac.update(psw);
    return hmac.digest("hex");
}

export default securityAudit;