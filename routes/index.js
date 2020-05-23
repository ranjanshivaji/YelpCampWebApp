var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Landing Page //Root Route
router.get('/', function(req, res) {
	res.render('landing');
});

// ================================//
// AUTH ROUTES
//========================================//

// Render Register form page
router.get('/register', function(req, res) {
	res.render('register');
});
// Handeling the Signup/ Register Logic
router.post('/register', function(req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash('error', err.message);
			//console.log(err);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Welcome To YelpCamp ' + user.username);
			res.redirect('/campgrounds');
		});
	});
});

//Login Section
//Login Form
router.get('/login', function(req, res) {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login' }),
	function(req, res) {}
);

/// logOut Route
router.get('/logout', function(req, res) {
	req.logOut();
	req.flash('success', 'Logged you Out!');
	res.redirect('/campgrounds');
});

module.exports = router;
