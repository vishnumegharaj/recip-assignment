const {createBulkUser, BulkUpdate} = require('../controllers/auth');
const router = require('express').Router();

router.post('/bulk-create', createBulkUser);
router.put('/bulk-update', BulkUpdate);

module.exports = router;