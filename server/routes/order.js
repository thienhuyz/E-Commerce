const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// router.post('/', verifyAccessToken, ctrls.createOrder)
// router.post('/status/:oid', [verifyAccessToken, isAdmin], ctrls.updateStatus)
// router.get('/', [verifyAccessToken], ctrls.getUserOrder)
// router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrders)

router.post("/", ctrls.createOrder);
router.post("/status/:oid", ctrls.updateStatus);
router.get("/", ctrls.getUserOrder);
router.get("/admin", ctrls.getOrders);

module.exports = router;
