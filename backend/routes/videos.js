const router = require("express").Router();
const videoController = require("../controllers/videoController");

let routes = (app) => {
    router.post("/upload", videoController.upload);
    router.get("/files", videoController.getListFiles);
    router.get("/files/:name", videoController.download);
    app.use(router);
}

module.exports = routes;