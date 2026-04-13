const {createBulkUser, bulkUpdateUsers} = require('../controllers/auth');
const router = require('express').Router();

router.post('/bulk-create', createBulkUser);
router.put('/bulk-update', bulkUpdateUsers);

module.exports = router;