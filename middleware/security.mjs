import { createHmac } from 'node:crypto';

function securityAudit(req, res, next) {
    
    if (req.method.toUpperCase() === "POST") {
        if (req.body && req.body.password) {
            let psw = req.body.password;
            
            
            req.body.password = ""; 
            
            
            const secret = process.env.SECRET || "min_super_hemmelige_kode_123";
            
            let securityToken = createSecurePassToken(psw, secret);
            req.token = securityToken;
            
            console.log("Passord er nå hashet og lagret i req.token");
        }
    }
    

    next();
}

function createSecurePassToken(psw, secret) {
    return {
        psw: hashPassword(psw, secret),
        timestamp: Date.now()
    }
}

function hashPassword(psw, secret) {
    const hmac = createHmac("sha256", secret);
    hmac.update(psw);
    return hmac.digest("hex");
}

export default securityAudit;