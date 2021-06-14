

var express = require("express");
var mongoose = require("mongoose");
const GameInfo = require('./models/gameInfo');
const GameSettings = require('./models/gameSettings');
const UserJS = require('./user');
const User = require("./models/user");

let myDatabase = function() {
}



myDatabase.prototype.postStudent = function(student,res) {
  console.log(" post Driver = " + student.driver);
    let obj = {ident:student.ident,name:student.name, grade: student.grade,volleyball:student.volleyball
      ,basketball:student.basketball,soccer:student.soccer,driver:student.driver
    };
    Info.create(student,function(error,info) { // this mongoose call will create the student document in the infos collection
        if (error) {
            return res.json({retVal:false});
        }
        return res.json({retVal:true});
    });
}
// myDatabase.prototype.postGame = function(game,res) {
//   console.log(" host name = " + game.hostName);
//     GameSettings.create(game,function(error,info) { // this mongoose call will create the student document in the infos collection
//         if (error) {
//             return res.json({retVal:false});
//         }
//         return res.json({retVal:true});
//     });
// }

myDatabase.prototype.getUser = function(ident,res) { // geting the stuent info - called on document.ready and in the read function on student sessions and admin
  User.find({ident:ident},function(error,user) { //doing a find on the students id - the unique identifier
      if (error) {
          return res.json({retVal:null});
      }
      else if (user == null) {
          return res.json({retVal:null});
      }

      if (user.length == 1)
      { //vv this returns the userdb stored info
        console.log(" name = " + user[0].username);
        return res.json({ retVal: new UserJS(ident,user[0].username)});
      }
      else
          return res.json({retVal:null});

   });

}



myDatabase.prototype.putStudent = function(student,res) { // called on student and admin sessions
//  let obj = {ident:student.ident,name:student.name,grade:student.grade,volleyball:student.volleyball
//,basketball:student.basketball,soccer:student.soccer};
 // finding the sudent w matching ident and changing all info
 console.log(" Put Driver = " + student.driver);
  Info.findOneAndUpdate({ident:student.ident},{name:student.name,grade:student.grade,volleyball:student.volleyball
,basketball:student.basketball,soccer:student.soccer,driver:student.driver},function(error,oldStudent) {
    if (error) {
      return res.json({retVal:false});
    }
    else if (oldStudent == null) {
      return res.json({retVal:false});
    }
    return res.json({retVal:true});
  });

}

myDatabase.prototype.deleteStudent = function(ident,res) {
    Info.remove({ident:ident},function(error,removed) {
        if (error) {
            return res.json({retVal:false});
        }
        if (removed.result.n == 0)
          return res.json({retVal:false});
        User.remove({ident:ident},function(error,removed) {
            if (error) {
                return res.json({retVal:false});
            }
            if (removed.result.n == 0)
              return res.json({retVal:false});
        return res.json({retVal:true});
        });
    });
}


module.exports = myDatabase;
