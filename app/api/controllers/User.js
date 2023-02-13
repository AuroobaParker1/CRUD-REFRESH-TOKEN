const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');



module.exports = {
    create: function(req, res, next) {
        UserModel.create({ UserName: req.body.UserName, Password: req.body.Password, FirstName: req.body.FirstName,LastName: req.body.LastName }, function (err, result) {
            if (err){ 
                next(err);
            }
            else
                res.json({status: "success", message: "User added successfully!!!", data: null});  
        });
    },

    authenticate: function(req, res, next) {
        UserModel.findOne({UserName:req.body.UserName}, function(err, userInfo){
            if (err) {
             next(err);
            } else {
                if(bcrypt.compareSync(req.body.Password, userInfo.Password)) {
                    const token = jwt.sign({id: userInfo._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' },{data: new Date().getTime()/1000});
                    const rtoken = jwt.sign({id: userInfo._id}, process.env.REFRESH_TOKEN_SECRET , { expiresIn: '7d' },{data: new Date().getTime()}/1000);
                    res.cookie('jwt', rtoken, { httpOnly: true, 
                     });
                    res.cookie('acc', token, { httpOnly: true, 
                     });
                    res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
                }else{
                    res.json({status:"error", message: "Invalid UserName/password!!!", data:null});
                }
            }
        });
    },
    
    read: async function (req,res){
        {
            try {
                const user = await UserModel.find();
                res.status(200).json(user);
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    update : async function (req,res){
    

        
        await UserModel.findOneAndUpdate({UserName: req.body.UserName}, req.body, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `User not found.`
                });
            }else{
                res.send({ message: "User updated successfully." })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    },

    destroy: async function (req,res){
    await UserModel.findOneAndRemove({UserName: req.body.UserName}).then(data => {
        if (!data) {
          res.status(404).send({
            message: `User not found.`
          });
        } else {
          res.send({
            message: "User deleted successfully!"
          });
        }
    }).catch(err => {
        res.status(500).send({
          message: err.message
        });
    });
   
    },
}


