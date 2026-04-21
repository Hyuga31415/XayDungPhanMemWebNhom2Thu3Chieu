const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/rbac');

router.use(verifyToken);

// Read: cho Admin/HR để dùng cho form nhân viên, nhưng màn quản lý FE chỉ mở cho Admin
router.get('/', permit('position:read'), positionController.getAllPositions);
router.get('/:id', permit('position:read'), positionController.getPositionById);

// Write: chỉ Admin
router.post('/', permit('position:write'), positionController.createPosition);
router.put('/:id', permit('position:write'), positionController.updatePosition);
router.delete('/:id', permit('position:write'), positionController.deletePosition);

module.exports = router;
