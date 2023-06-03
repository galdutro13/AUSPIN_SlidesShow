const router = require("express").Router();

const depoimentoController = require("../controllers/depoimentoController");

router
    .route("/depoimentos")
    .post((req, res) => depoimentoController.create(req, res));


router
    .route("/depoimentos")
    .get((req, res) => depoimentoController.getAll(req, res));

router
    .route("/depoimentos/:id")
    .get((req, res) => depoimentoController.get(req, res));

router
    .route("/depoimentos/:id")
    .delete((req, res) => depoimentoController.delete(req, res));

router
    .route("/depoimentos/:id")
    .put((req, res) => depoimentoController.update(req, res));

module.exports = router;