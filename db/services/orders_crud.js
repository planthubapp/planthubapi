const OrderModel = require('../models/orders.js');
module.exports ={
    async user_acc_deleted(user_id){
        try{
            var update = await OrderModel.updateMany(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "ACC_DELETED":"this user's account has been deleted"
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    }
}