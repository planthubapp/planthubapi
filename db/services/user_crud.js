const UserModel = require('../models/user');
const encryption = require('../../utils/encrypt');
module.exports = {
    async find_by_email(email){
        try{
            var user = await UserModel.findOne(
                {
                    "emailid":email
                }
            );
            if(user){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    register(userObject){
        try{
            userObject.password = encryption.generateHash(userObject.password);
            userObject.old_pass = userObject.password;
            let promise = UserModel.create(userObject);
            return promise;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async activate_acc(key){
        try{
            var doc = await UserModel.updateOne(
                {
                    "key":key
                },
                {
                    $set:{
                        "account_activated":1
                    }
                }
            );
            return doc;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_by_key(key){
        try{
            var user = await UserModel.findOne(
                {
                    "key":key
                },
                {
                    "_id":0,
                    "emailid":1,
                    "user_id":1
                }
            );
            if(user){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async login({email,pwd}){
        try{
            var doc= await UserModel.findOne({"emailid":email});
            if(doc){
                if(encryption.comapreHash(doc.password,pwd)){
                    return doc;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async check_old_pass(email,pass){
        try{
            var doc= await UserModel.findOne({"emailid":email});
            if(doc){
                if(encryption.comapreHash(doc.old_pass,pass)){
                    return doc;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async save_key(email,otp){
        try{
            var saved = await UserModel.updateOne(
                {
                    "emailid":email
                },
                {
                    $set:{
                        "key":otp
                    }
                }
            );
            return saved;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async uncheck_otp(user_id){
        try{
            var checked = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "otp_checked":0
                    }
                }
            );
            return checked;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async verify_otp(user_id,otp){
        try{
            var found = await UserModel.findOne(
                {
                    "user_id":user_id,
                    "key":otp
                },
                {
                    "_id":1
                }
            );
            if(found){
                return found;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async otp_checked(user_id){
        try{
            var checked = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "otp_checked":1
                    }
                }
            );
            return checked;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async save_old_pass(email){
        try{
            var find = await UserModel.findOne(
                {
                    "emailid":email
                },
                {
                    "_id":0,
                    "password":1
                }
            );
            var old_pass = find.password;
            var saved = await UserModel.updateOne(
                {
                    "emailid":email
                },
                {
                    $set:{
                        "old_pass":old_pass
                    }
                }
            );
            return saved;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_pass(user_id,pass){
        try{
            pass = encryption.generateHash(pass);
            var update = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "password":pass
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async view_my_account(userid){
        try{
            var user = await UserModel.findOne(
                {
                    "user_id":userid
                },
                {
                    "_id":0,
                    "address":1,
                    "emailid":1,
                    "name":1,
                    "intersted_id":1,
                    "two_factor_auth":1
                }
            );
            if(user){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async activate_two_factor_auth(user_id){
        try{
            var activate = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "two_factor_auth":1
                    }
                }
            );
            return activate;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async deactivate_two_factor_auth(doc){
        try{
            var activate = await UserModel.updateOne(
                {
                    "user_id":doc.user_id
                },
                {
                    $set:{
                        "two_factor_auth":0
                    }
                }
            );
            return activate;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_pass_for_recovery(admin_id,pass){
        try{
            pass = encryption.generateHash(pass);
            var update = await UserModel.updateOne(
                {
                    "admin_id":admin_id
                },
                {
                    $set:{
                        "password":pass
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_pass_by_email(email,new_pass){
        try{
            new_pass = encryption.generateHash(new_pass);
            var update = await UserModel.updateOne(
                {
                    "emailid":email
                },
                {
                    $set:{
                        "password":new_pass
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_name(user_id,name){
        try{
            var update = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "name":name
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_email(user_id,email){
        try{
            var update = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "emailid":email
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_pass(doc,old_pass,new_pass){
        try{
            if(encryption.comapreHash(doc.password,old_pass)){
                var new_pass = encryption.generateHash(new_pass);
                var update = await UserModel.updateOne(
                    {
                        "user_id":doc.user_id
                    },
                    {
                        $set:{
                            "password":new_pass
                        }
                    }
                );
                return update;
            }
            else{
                return false;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async update_address(user_id,Houseno,City,State,Pincode,Landmark){
        try{
            var update = await UserModel.updateOne(
                {
                    "user_id":user_id
                },
                {
                    $set:{
                        "address.Houseno":Houseno,
                        "address.City":City,
                        "address.State":State,
                        "address.Pincode":Pincode,
                        "address.Landmark":Landmark
                    }
                }
            );
            return update;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async delete_user(doc,pass){
        try{
            if(encryption.comapreHash(doc.password,pass)){
                var deleted = await UserModel.deleteOne(
                    {
                        "user_id":doc.user_id
                    }
                );
                return deleted;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_all(){
        try{
            var allusers = await UserModel.find(
                {

                },
                {
                    "_id":0,
                    "name":1,
                    "emailid":1,
                    "user_id":1,
                    "account_activated":1,
                }
            );
            if(allusers.length!=0){
                return allusers;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_user(user_id){
        try{
            var user = await UserModel.findOne(
                {
                    "user_id":user_id
                }
            );
            if(user){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_by_name(name){
        try{
            var user = await UserModel.find(
                {
                    "name":new RegExp(".*"+name+".*","i")
                },
                {
                    "_id":0,
                    "name":1,
                    "emailid":1,
                    "user_id":1,
                    "account_activated":1,
                }
            );
            if(user.length!=0){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_by_pincode(pincode){
        try{
            var user = await UserModel.find(
                {
                    "address.Pincode":pincode
                },
                {
                    "_id":0,
                    "name":1,
                    "emailid":1,
                    "user_id":1,
                    "account_activated":1,
                }
            );
            if(user.length!=0){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_by_city(city){
        try{
            var user = await UserModel.find(
                {
                    "address.City":new RegExp(".*"+city+".*","i")
                },
                {
                    "_id":0,
                    "name":1,
                    "emailid":1,
                    "user_id":1,
                    "account_activated":1,
                }
            );
            if(user.length!=0){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async find_by_state(state){
        try{
            var user = await UserModel.find(
                {
                    "address.State":new RegExp(".*"+state+".*","i")
                },
                {
                    "_id":0,
                    "name":1,
                    "emailid":1,
                    "user_id":1,
                    "account_activated":1,
                }
            );
            if(user.length!=0){
                return user;
            }
            else{
                return null;
            }
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async delete_any_user(user_id){
        try{
            var deleted = await UserModel.deleteOne(
                {
                    "user_id":user_id
                }
            );
            return deleted;
        }
        catch(err){
            console.log("ERROR is : ",err);
        }
    },
    async get_emails(){
        try{
            var emails = await UserModel.find(
                {

                },
                {
                    "_id":0,
                    "emailid":1
                }
            );
            if(emails.length!=0){
                return emails;
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