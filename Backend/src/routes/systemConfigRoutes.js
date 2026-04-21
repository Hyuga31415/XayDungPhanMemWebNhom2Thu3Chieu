const express = require('express');
const router = express.Router();
const controller = require('../controllers/systemConfigController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/rbac');

router.use(verifyToken);

router.get('/', permit('payroll:config'), controller.getConfigs);
router.put('/', permit('payroll:config'), controller.updateConfigs);

module.exports = router;
