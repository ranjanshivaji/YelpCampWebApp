var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleWare = require('../middleware');

//INDEX - Show All campgrounds
router.get('/', function(req, res) {
	//Get all Campgrounds from db
	Campground.find({}, function(err, allCamps) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgnds: allCamps });
		}
	});
});

//CREATE -Add new Campgrounds to Database
router.post('/', middleWare.isLoggedIn, function(req, res) {
	//Get data from Form and add to Campgnds Array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampGrnd = { name: name, image: image, description: desc, author: author };
	//Create a new Campground and save to database
	Campground.create(newCampGrnd, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//console.log(newlyCreated);
			//redirect back to campgrounds(get) Page
			res.redirect('/campgrounds');
		}
	});
});

//NEW - Show Form to create noe campground
router.get('/new', middleWare.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

//SHOW - Shows more Info. About one campground
router.get('/:id', function(req, res) {
	//Find Capmground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCamp) {
		if (err || !foundCamp) {
			req.flash('error', 'Camp Ground Not Found');
			res.redirect('back');
		} else {
			//console.log(foundCamp);
			//Render Show template with that campground
			res.render('campgrounds/show', { campground: foundCamp });
		}
	});
});

//Edit CampGround Route
router.get('/:id/edit', middleWare.checkCampOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCamp) {
		if (err) {
			req.flash('error', 'Campground not found!');
		}
		res.render('campgrounds/edit', { camp: foundCamp });
	});
});

// Update Campgroud Route
router.put('/:id', middleWare.checkCampOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			//otherwise redirect
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//Destroy Campground Route
router.delete('/:id', middleWare.checkCampOwnership, async (req, res) => {
	try {
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		res.redirect('/campgrounds');
	} catch (error) {
		console.log(error.message);
		res.redirect('/campgrounds');
	}
});

module.exports = router;
