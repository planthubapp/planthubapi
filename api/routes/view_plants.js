const express = require('express');
const router = express.Router();
const {view_plants_by_category} = require('../../controller/plant');
const {VIEW_PLANTS_BY_CATEGORY} = require('../../utils/config').ROUTES.PLANT;
router.get(VIEW_PLANTS_BY_CATEGORY,view_plants_by_category);
module.exports = router;