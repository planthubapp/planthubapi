const express = require('express');
const router = express.Router();
const {add_plant,update_plant} = require('../../controller/plant');
const {ADD_PLANT,UPDATE_PLANT} = require('../../utils/config').ROUTES.PLANT;
router.post(ADD_PLANT,add_plant);
router.post(UPDATE_PLANT,update_plant);
module.exports = router;