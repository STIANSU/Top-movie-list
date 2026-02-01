import express from "express"
const contentRouter = express.Router();

contentRouter.use(express.json());

contentRouter.get('/', (req, res, next) => {

    res.json({});
    next();
})

contentRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;

    next();
});

contentRouter.post("/", (req, res, next) => {

    const contentId = req.body.id;
    const content = req.body.content;

    next();
});

contentRouter.patch("/", (req, res, next) => {

    const contentId = req.body.id;
    const content = req.body.content;

    next();
});

contentRouter.delete("/", (req, res, next) => {

    let conntentID = req.body.contentId;

    next();

});


export default contentRouter;