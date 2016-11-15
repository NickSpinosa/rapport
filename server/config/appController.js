var gmail = require('./gmailController.js');
const auth0Utils = require('../utils/auth0_utils.js');
var dbModel = require('../db/dbModel.js');

module.exports.checkIfNewUser = function(req, res){
    var result = {
      username:'',
      email:'',
      newUser:null
    };
    auth0Utils.getUserIdFromToken(req.body.idToken)
      .then(userId => {
        auth0Utils.getAccesstoken()
          .then(accessToken => {
            auth0Utils.getUserAccessKeys(userId, accessToken)
              .then(userObj => {
                console.log("local gmail info",auth0Utils.getGmailInfo(userObj));
                // var gmailInfo = auth0Utils.getGmailInfo(userObj);
                var gmailInfo = {
                  name: 'Jesse Rocket',
                  email: 'jesse@teamrocket.com',
                  oauth: 'some secret oauth token'
                };
                //check if email address is in database
                  dbModel.gmail.emailExists(gmailInfo.email, function(bool){
                      //if yes
                          //getBasicUserData(email)
                      if(bool){
                        dbModel.users.getBasicUserData(gmailInfo.email, function(info){
                          res.status(200).send(info);
                        });
                      } else {
                      //if not
                          //save email, username, oauth token to db
                        result.username = gmailInfo.name;
                        result.email = gmailInfo.email;
                        result.newUser = true;
                        //saveNewUser
                        dbModel.users.saveNewUser(gmailInfo, function(saved){
                          if(saved){
                            res.status(200).send(result);
                          }
                          else {
                            res.status(200).send('error occured while trying to save new user');
                          }
                        });
                      }
                  });

                // console.log("exported gmailInfo", auth0Utils.gmailInfo);
                // gmail.getContactsWithAuth(gmailInfo);
              });
          });
      });
  };