export const validateMovie = (req, res, next) => {

    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ error: "Du må sende med en filmtittel!" });
    }

    next();
};