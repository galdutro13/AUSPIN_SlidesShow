const router = require("express").Router();
const videoController = require("../controllers/videoController");

router
    .route("/videos")
    .post((req, res) => videoController.upload(req, res));

router
    .route("/videos")
    .get((req, res) => videoController.getListFiles(req, res));

router
    .route("/videos/:id")
    .get((req, res) => videoController.download(req, res));

module.exports = router;