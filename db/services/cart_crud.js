const CartModel = require('../models/cart.js');
module.exports = {
    create_cart(cartObject){
        try{
            var add = CartModel.create(cartObject);
            return add;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async delete_user_cart(cart_id){
        try{
            var deleted = await CartModel.deleteOne(
                {
                    "cart_id":cart_id
                }
            );
            return deleted;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    }
}