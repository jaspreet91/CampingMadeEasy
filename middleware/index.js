var Campground = require("../models/campground");
var Comment = require("../models/comment");
//var Comment = require("../models/campground");

//all middleware go here
var middlewareObj={};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }else{
                //does user owned campground?
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("back");
               }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err ||!foundComment){
                console.log(err);
                res.redirect("back");
            }else{
                //does user owned comment?
               if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                   //console.log(err);
                   next();
               }else{
                   req.flash("error", "You don't have permission to do that.");
                   res.redirect("back");
               }
            }
        });
    }else{
        res.redirect("back");
        }
    }
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;