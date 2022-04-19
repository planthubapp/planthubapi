const {Schema,SchemaTypes} = require('../connect');
const {PLANT} = require('../../utils/config').SCHEMAS;
const mongoose = require('../connect');
// const Plant_img = new Schema({
//     "LxH":{type:SchemaTypes.String,required:true},
//     "Lx1.5H":{type:SchemaTypes.String,required:true},
//     "2LxH":{type:SchemaTypes.String,required:true}
// });
// const Plant_keys = new Schema({
    // Genus:{type:SchemaTypes.String,required:true},
    // Use:{type:SchemaTypes.String,required:true},
    // Water_Requirement:{type:SchemaTypes.String,required:true},
    // Fragrance:{type:SchemaTypes.String,required:true},
    // With_Pots:{type:SchemaTypes.String,required:true},
    // Sunlight_Requirement:{type:SchemaTypes.String,required:true},
    // Size:{type:SchemaTypes.String,required:true},
// });
const plantSchema = new Schema({
    Plant_id:{type:SchemaTypes.String,required:true,unique:true,index:true},
    Plant_name:{type:SchemaTypes.String,required:true,index:true},
    Plant_category:{type:SchemaTypes.String,required:true,index:true},
    "Plant_image.LxH":{type:SchemaTypes.String,required:true},
    "Plant_image.Lx2H":{type:SchemaTypes.String,required:true},
    "Plant_image.2LxH":{type:SchemaTypes.String,required:true},
    Plant_price:{type:SchemaTypes.Number,required:true},
    Plant_description:{type:SchemaTypes.String,required:true},
    Plant_facts:{type:SchemaTypes.Array,required:true},
    Genus:{type:SchemaTypes.String,required:true},
    Use:{type:SchemaTypes.String,required:true},
    Water_Requirement:{type:SchemaTypes.String,required:true},
    Fragrance:{type:SchemaTypes.String,required:true},
    With_Pots:{type:SchemaTypes.String,required:true},
    Sunlight_Requirement:{type:SchemaTypes.String,required:true},
    Size:{type:SchemaTypes.String,required:true},
    Seller:{type:SchemaTypes.String,required:true},
    no_of_times_viewed:{type:SchemaTypes.Number,required:true},
    comments:{type:SchemaTypes.Array}
},
{
    timestamps:true         //this will add time in data object when the plant is created in database
});
const PlantModel = mongoose.model(PLANT,plantSchema);
module.exports = PlantModel;