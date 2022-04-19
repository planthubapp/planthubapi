const {Schema,SchemaTypes} = require('../connect');
const {USERS} = require('../../utils/config').SCHEMAS;
const mongoose = require('../connect');
const userSchema = new Schema({
    emailid:{type:SchemaTypes.String,required:true,unique:true,index:true},
    password:{type:SchemaTypes.String,required:true,min:3,max:25},
    name:{type:SchemaTypes.String,required:true,index:true},
    user_id:{type:SchemaTypes.String,required:true,unique:true,index:true},
    profile_pic:{type:SchemaTypes.Buffer},
    isSeller:{type:SchemaTypes.String},
    address:{
        Houseno:{type:SchemaTypes.String,required:true},
        City:{type:SchemaTypes.String,required:true},
        State:{type:SchemaTypes.String,required:true},
        Pincode:{type:SchemaTypes.Number,required:true},
        Landmark:{type:SchemaTypes.String,required:true}
    },
    account_activated:{type:SchemaTypes.Boolean,required:true},
    key:{type:SchemaTypes.Number,required:true}
},
{
    timestamps:true        //this will add time in data object when the user is created in database
});
const UserModel = mongoose.model(USERS,userSchema);
module.exports = UserModel;