const express = require('express');
const router = express.Router();
const {direct_change} = require('../../controller/plant');
const {DIRECT_CHANGE} = require('../../utils/config').ROUTES.PLANT;
router.get(DIRECT_CHANGE,direct_change);
module.exports = router;