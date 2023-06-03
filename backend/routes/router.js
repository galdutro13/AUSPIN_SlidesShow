const router = require("express").Router();

const depoimentosRouter = require("./depoimentos");

router.use("/", depoimentosRouter);

module.exports = router;