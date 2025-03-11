const router = require('express').Router();
const auth = require('../middleware/auth')


router.use(require('./users'));
router.use(auth,require('./income'));
router.use(auth,require('./expense'));


module.exports = router;