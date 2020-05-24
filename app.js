var port = process.env.PORT || 3000;
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

// Requiring All Routes
var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

//seedDB(); //Seed The data Base

//mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://ranjan:ranjan123@ranjan-lst5i.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
//mongoose.connect('mongodb://localhost:27017/yelp_camp_V10', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// PassPort Configuration

app.use(
	require('express-session')({
		secret: 'if you hont go for the gap, youre no longer a racing driver',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// ============================================================================= //
//                                                                               //
//                                Routing Starts Here                            //
//                                                                               //
// ============================================================================= //

app.listen(port, function() {
	console.log('Yelp Camp V12 Has started');
});
