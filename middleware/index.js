var Campground = require('../models/campground');
var Comment = require('../models/comment');

// All middle ware goes here
var middleWareObj = {};

middleWareObj.checkCampOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCamp) {
			if (err) {
				req.flash('error', 'Campground not found!');
				res.redirect('back');
			} else {
				// Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
				if (!foundCampground) {
					req.flash('error', 'Item not found.');
					return res.redirect('back');
				}
				// If the upper condition is true this will break out of the middleware and prevent the code below to crash our application

				//is the campgroundid associated with the user id?
				if (foundCamp.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You dont have permission to do that!');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be Logged in to Do that!');
		//else redirect
		res.redirect('back');
	}
};
middleWareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				// Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
				if (!foundComment) {
					req.flash('error', 'Item not found.');
					return res.redirect('back');
				}
				// If the upper condition is true this will break out of the middleware and prevent the code below to crash our application

				if (foundComment.author.id.equals(req.user._id)) {
					//console.log('A');
					next();
				} else {
					req.flash('error', 'You don"t have permission to do that!');
					//console.log('B');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('back');
	}
};
// The middle ware
middleWareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		//console.log('You are in');
		return next();
	}
	req.flash('error', 'You need to be Logged in to Do that!');
	//console.log('You are not logged in');
	res.redirect('/login');
};

module.exports = middleWareObj;
