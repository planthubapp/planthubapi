const PlantModel = require("../models/plant");
module.exports = {
    add_plant(PlantObject){
        try{
            let promise = PlantModel.create(PlantObject);
            return promise;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async view_by_category(category){       //by find()
        try{
            var plants = await PlantModel.find(
                {
                    "Plant_category":new RegExp(".*"+category+".*","i"),
                },
                {
                    "_id":0,
                    "Plant_id":1,
                    "Plant_name":1,
                    "Plant_facts":1,
                    "Plant_image":1
                }
            );
            if(plants.length!=0){
                return plants;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_plant(plant_id,plant){
        try{
            var update = await PlantModel.updateOne(
                {
                    "Plant_id":plant_id
                },
                {
                    $set:{
                        Plant_name:plant.Plant_name,
                        Plant_category:plant.Plant_category,
                        Plant_image:plant.Plant_image,
                        Plant_price:plant.Plant_price,
                        Plant_description:plant.Plant_description,
                        Plant_facts:plant.Plant_facts,
                        Genus:plant.Genus,
                        Use:plant.Use,
                        Water_Requirement:plant.Water_Requirement,
                        Fragrance:plant.Fragrance,
                        With_Pots:plant.With_Pots,
                        Sunlight_Requirement:plant.Sunlight_Requirement,
                        Size:plant.Size,
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async direct_change(){
        try{
            var change = await PlantModel.updateMany(
                {
                    
                },
                {
                    $set:{
                        Seller:"Plant Hub",
                        no_of_times_viewed:0
                    }
                }
            );
            if(change.modifiedCount){
                return change;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    }
}