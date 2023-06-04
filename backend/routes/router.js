const router = require("express").Router();
const depoimentosRouter = require("./depoimentos");
const videosRouter = require("./videos");

router.use("/", depoimentosRouter);
router.use("/", videosRouter);

module.exports = router;