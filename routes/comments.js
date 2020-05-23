var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleWare = require('../middleware');

// =============================+=============================== //
//					Comments  Routes                             //
//===============================================================//

// Comments Create Page
router.get('/new', middleWare.isLoggedIn, function(req, res) {
	//Find Campground id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//Comments Post page
router.post('/', middleWare.isLoggedIn, function(req, res) {
	//Look up campgrounds using id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			//Create new Comment in the campground
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'Something Went Wrong');
					console.log(err);
				} else {
					//addusername and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added Comment!');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//Edit- Route For Comments
router.get('/:comment_id/edit', middleWare.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
		}
	});
});
// UPDATE - ROute For the comment
router.put('/:comment_id', middleWare.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// Destroy - Route Deletes the comment this is nested in the campgrounds
router.delete('/:comment_id', middleWare.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment Deleted!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
