Middleware Dokumentasjon

Prosjektet benytter to sentrale middlewares for å sikre dataintegritet og sikkerhet.

Validerings-Middleware (Film)
Sjekker at alle `POST`-forespørsler til `/api/movies` inneholder en tittel.
Logikk: Hvis `req.body.title` mangler eller er tom, returneres en `400 Bad Request`.
Formål: Hindre korrupte data i filmoversikten.

Security Audit (Passord)
Prosesserer alle `POST`-forespørsler til `/user`.
Logikk: Fanger opp råpassordet, genererer en SHA-256 hash (HMAC), og lagrer denne i `req.token`.
Sikkerhet: Den sletter det originale passordet fra `req.body` før forespørselen går videre til rute-handleren.