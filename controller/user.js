const {SUCCESS,SERVER_CRASH,NOT_FOUND} = require('../utils/config').STATUS_CODES;
var sendmail = require('../utils/nodemailer');
const uniqid = require('uniqid');
const messageBundle = require('../locales/en');
const emailBundle = require('../locales/mailcontent');
const userOperations = require('../db/services/user_crud.js');
const jwt = require('../utils/token');
const encryption = require('../utils/encrypt');
const otp_generate = require('otp-generator');
const cartOperations = require('../db/services/cart_crud.js');
const orderOperations = require('../db/services/orders_crud.js');
const userController = {
    async check_email(request,response){
        try{
            var email = request.body.email;
            var check = await userOperations.find_by_email(email);
            if(check==null){
                response.status(SUCCESS).json({message:messageBundle['successful']});
            }
            else{
                response.status(SERVER_CRASH).json({message:messageBundle['email.already_used']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    register(request,response){
        var full_name = request.body.name;
        var fname = full_name.split(" ");
        var user_id = uniqid(fname[0]);
        var key_=otp_generate.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
        let userObject={
            emailid:request.body.email,
            password:request.body.pwd,
            name:request.body.name,
            user_id:user_id,
            //profile_pic:
            address:{
                Houseno:request.body.address.Houseno,
                City:request.body.address.City,
                State:request.body.address.State,
                Pincode:request.body.address.Pincode,
                Landmark:request.body.address.Landmark
            },
            account_activated:false,
            key:key_
        }
        var promise = userOperations.register(userObject);
        promise.then((doc)=>{
            sendmail(request.body.email,emailBundle['registersuccessfull.sub'],emailBundle['registersuccessfull.body']+key_);
            let object = {
                cart_id : user_id
            }
            cartOperations.create_cart(object);
            response.status(SUCCESS).json({message:messageBundle['register.welcome'],doc:doc});
        }).catch((err)=>{
            response.status(SERVER_CRASH).json({message:messageBundle['register.fail'],err:err})
        });
    },
    async activate_acc(request,response){
        try{
            var email = request.body.email;
            var otp = request.body.otp;
            var activate = await userOperations.acctivate_acc(email,otp);
            if(activate.modifiedCount && otp && email){
                sendmail(email,emailBundle['activatesuccessfull.sub'],emailBundle['activatesuccessfull.body']);
                response.status(SUCCESS).json({message:messageBundle['activate.successful']});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['activate.unsuccessful']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async login(request,response){
        try{
            var user = request.body;
            var doc = await userOperations.login(user);
            if(doc){
               if(doc.account_activated){
                    token = jwt.generateToken(doc);
                    sendmail(user.email,emailBundle['login.sub'],emailBundle['login.body']);
                    response.status(SUCCESS).json({message:messageBundle['login.welcome'],name:doc.name,token:token});
               }
               else{
                response.status(NOT_FOUND).json({message:messageBundle['account.not_activated']});
               }
            }    
            else{
                response.status(NOT_FOUND).json({message:messageBundle['login.invaliduser']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async forgot_pass(request,response){
        try{
            var email = request.body.email;
            var user = await userOperations.find_by_email(email);
            if(user){
                var otp = otp_generate.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
                var save_key = await userOperations.save_key(email,otp);
                if(save_key.modifiedCount){
                    sendmail(email,emailBundle['forgot_pass.sub'],emailBundle['forgot_pass.body']+otp);
                    response.status(SUCCESS).json({message:messageBundle['forgotpass.success']});
                }
                else{
                    response.status(NOT_FOUND).json({message:messageBundle['forgotpass.fail']});
                }
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['email.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async acc_recover(request,response){
        try{
            var email = request.body.email;
            var otp = request.body.otp;
            var verify = await userOperations.verify_otp(email,otp);
            if(verify){
                var update_pass = await userOperations.update_pass_by_email(email,password);
                if(update_pass.modifiedCount){
                    sendmail(user.emailid,emailBundle['account_recover.sub'],emailBundle['account_recover.body']);
                    response.status(SUCCESS).json({message:messageBundle['acc_recovery.success']});
                }
                else{
                    response.status(SERVER_CRASH).json({message:messageBundle['acc_recovery.fail']});
                }
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['acc_recovery.fail']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_my_account(request,response){
        try{
            var token = request.headers['authorization'];
            var doc=jwt.getdoc(token);
            var user  = await userOperations.view_my_account(doc.user_id);
            if(user){
                response.status(SUCCESS).json({message:messageBundle['user.found'],user:user});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['user.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async update_name(request,response){
        try{
            var name = request.body.name;
            var token = request.headers['authorization'];
            var doc=jwt.getdoc(token);
            var updated = await userOperations.update_name(doc.user_id,name);
            if(updated.modifiedCount && name){
                doc.name = name;
                var new_token = jwt.generateToken(doc);
                response.status(SUCCESS).json({message:messageBundle['update.successful'],name:name,token:new_token});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['update.unsuccessful']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async update_email(request,response){
        try{
            var email = request.body.email;
            var token = request.headers['authorization'];
            var doc=jwt.getdoc(token);
            var updated = await userOperations.update_email(doc.user_id,email);
            if(updated.modifiedCount && email){
                doc.emailid = email;
                var new_token = jwt.generateToken(doc);
                sendmail(email,emailBundle['emailupdated.sub'],emailBundle['emailupdated.body']);
                response.status(SUCCESS).json({message:messageBundle['update.successful'],email:email,token:new_token});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['update.unsuccessful']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async update_password(request,response){
        try{
            var old_pass = request.body.old_pass;
            var new_pass = request.body.new_pass;
            var token = request.headers['authorization'];
            var doc=jwt.getdoc(token);
            var save_old_pass = await userOperations.save_old_pass(doc.emailid);
            var updated = await userOperations.update_pass(doc,old_pass,new_pass);
            if(updated && old_pass && new_pass && save_old_pass.modifiedCount){
                doc.password = encryption.generateHash(new_pass);
                var new_token = jwt.generateToken(doc);
                sendmail(doc.emailid,emailBundle['passwordchanged.sub'],emailBundle['passwordchanged.body']);
                response.status(SUCCESS).json({message:messageBundle['update.successful'],token:new_token});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['update.unsuccessful'],Error:"Old Passowrd was wrong"});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async update_address(request,response){
        try{
            var Houseno = request.body.Houseno;
            var City = request.body.City;
            var State = request.body.State;
            var Pincode = request.body.Pincode;
            var Landmark = request.body.Landmark
            var token = request.headers['authorization'];
            var doc=jwt.getdoc(token);
            var updated = await userOperations.update_address(doc.user_id,Houseno,City,State,Pincode,Landmark);
            if(updated.modifiedCount){
                response.status(SUCCESS).json({message:messageBundle['update.successful']});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['update.unsuccessful']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async delete_user(request,response){
        try{
            var token = request.headers['authorization'];
            var doc=jwt.getdoc(token);
            var pass = request.body.pwd;
            let obj = {
                email : doc.emailid,
                pwd : pass
            }
            var deletedby = "SELF_USER"
            var find = await userOperations.login(obj);
            var deleted = await userOperations.delete_user(doc,pass);
            if(deleted.deletedCount){
                deleted_userController.add_to_deleted(find,deletedby);
                cartOperations.delete_user_cart(find.user_id);
                orderOperations.user_acc_deleted(find.user_id);
                sendmail(doc.emailid,emailBundle['acc_deleted.sub'],emailBundle['acc_deleted.body']);
                response.status(SUCCESS).json({message:messageBundle['delete.successful']});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['delete.unsuccessful']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_all(request,response){
        try{
            var allusers = await userOperations.find_all();
            if(allusers){
                response.status(SUCCESS).json({message:messageBundle['users.viewall'],AllUsers:allusers});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['users.viewall'],AllUsers:allusers});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_by_user_id(request,response){
        try{
            var user_id = request.body.user_id;
            var user = await userOperations.find_user(user_id);
            if(user){
                response.status(SUCCESS).json({message:messageBundle['users.viewall'],user:user});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['users.viewall']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_by_emailid(request,response){
        try{
            var email = request.body.email;
            var user = await userOperations.find_by_email(email);
            if(user){
                response.status(SUCCESS).json({message:messageBundle['user.found'],AllUsers:user});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['user.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_by_name(request,response){
        try{
            var name = request.body.name;
            var allusers = await userOperations.find_by_name(name);
            if(allusers){
                response.status(SUCCESS).json({message:messageBundle['user.found'],AllUsers:allusers});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['user.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_by_pincode(request,response){
        try{
            var pincode = request.query.pincode;
            var allusers = await userOperations.find_by_pincode(pincode);
            if(allusers){
                response.status(SUCCESS).json({message:messageBundle['user.found'],AllUsers:allusers});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['user.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async view_by_city(request,response){
        try{
            var city = request.query.city;
            var allusers = await userOperations.find_by_city(city);
            if(allusers){
                response.status(SUCCESS).json({message:messageBundle['user.found'],AllUsers:allusers});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['user.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },async view_by_state(request,response){
        try{
            var state = request.query.state;
            var allusers = await userOperations.find_by_state(state);
            if(allusers){
                response.status(SUCCESS).json({message:messageBundle['user.found'],AllUsers:allusers});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['user.notfound']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
    async delete_any_user(request,response){
        try{
            var user_id = request.body.user_id;
            var find = await userOperations.find_user(user_id);
            var token = request.headers['authorization'];
            var admin = jwt.getdoc(token)
            let deletedby = {
                name : admin.name,
                email : admin.emailid,
                admin_id : admin.admin_id
            }
            var deleted = await userOperations.delete_any_user(user_id);
            if(deleted.deletedCount){
                sendmail(find.emailid,emailBundle['acc_deletedbyadmin.sub'],emailBundle['acc_deletedbyadmin.body']);
                deleted_userController.add_to_deleted(find,deletedby);
                cartOperations.delete_user_cart(user_id);
                orderOperations.user_acc_deleted(user_id);
                response.status(SUCCESS).json({message:messageBundle['delete.successful']});
            }
            else{
                response.status(NOT_FOUND).json({message:messageBundle['delete.unsuccessful']});
            }
        }
        catch(err){
            response.status(SERVER_CRASH).json({message:messageBundle['unsuccessful'],ERROR:err});
        }
    },
};
module.exports = userController;