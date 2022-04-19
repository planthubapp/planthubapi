const {SUCCESS,SERVER_CRASH,NOT_FOUND} = require('../utils/config').STATUS_CODES;
const uniqid = require('uniqid');
const messageBundle = require('../locales/en');
const plantOperations = require('../db/services/plant_crud');
var nodemailer = require('../utils/nodemailer');
const plantController = {
    add_plant(request,response){
        var category = request.body.Plant_category;
        category = category.split(' ');
        let PlantObject = {
            Plant_id:uniqid(category[0]),
            Plant_name:request.body.Plant_name,
            Plant_category:request.body.Plant_category,
            Plant_image:request.body.Plant_image,
            Plant_price:request.body.Plant_price,
            Plant_description:request.body.Plant_description,
            Plant_facts:request.body.Plant_facts,
            Genus:request.body.Genus,
            Use:request.body.Use,
            Water_Requirement:request.body.Water_Requirement,
            Fragrance:request.body.Fragrance,
            With_Pots:request.body.With_Pots,
            Sunlight_Requirement:request.body.Sunlight_Requirement,
            Size:request.body.Size,
        }
        // let PlantObject = request.body;
        var promise = plantOperations.add_plant(PlantObject);
        promise.then((doc)=>{
            response.status(SUCCESS).json({message:messageBundle['Plant.added'],doc:doc});
        }).catch((err)=>{
            response.status(SERVER_CRASH).json({message:messageBundle['Plant.failed'],ERROR:err})
        });
    },
    async view_plants_by_category(request,response){
        try{
            var category = request.query.category;
            var plants =await plantOperations.view_by_category(category);
            if(plants){
                response.status(SUCCESS).json({message:messageBundle["Plant.found"],AllPlants:plants});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle["Plant.notfound"]});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async update_plant(request,response){
        try{
            if(request.body.Plant_price>=0){
                var Plant_id=request.body.Plant_id;
                let plantObject={
                    Plant_name:request.body.Plant_name,
                    Plant_category:request.body.Plant_category,
                    Plant_image:request.body.Plant_image,
                    Plant_price:request.body.Plant_price,
                    Plant_description:request.body.Plant_description,
                    Plant_facts:request.body.Plant_facts,
                    Genus:request.body.Genus,
                    Use:request.body.Use,
                    Water_Requirement:request.body.Water_Requirement,
                    Fragrance:request.body.Fragrance,
                    With_Pots:request.body.With_Pots,
                    Sunlight_Requirement:request.body.Sunlight_Requirement,
                    Size:request.body.Size,
                };
                var plant = await plantOperations.update_plant(Plant_id,plantObject);
                if(plant.modifiedCount && plantObject){
                    response.status(SUCCESS).json({message:messageBundle["update.successful"],plant:plantObject});
                }
                else{
                    response.status(NOT_FOUND).json({message:messageBundle["update.unsuccessful"]});
                }
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle["Plant.wrong_price"]});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async direct_change(request, response){ //adding seller key & viewed count
        try{
            var change = await plantOperations.direct_change();
            if(change.modifiedCount){
                response.status(SUCCESS).json({message:messageBundle["update.successful"]});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle["update.unsuccessful"]});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    }
}
module.exports = plantController;