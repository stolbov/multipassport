var passport = require("passport");

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var SECRET = 'shhhhhhared-secret'; 
var crypto = require('crypto');
var app = require('sails').express.app;
app.use(expressJwt({secret: SECRET}));

module.exports = {
  login: function(req,res){
	if(!req.isAuthenticated()){
		res.view("auth/login");
	}else{
		res.redirect('/');
	}
  },

  process_first: function(req,res, next){
	/*
	passport.authenticate('local', function(err, user, info){
		//console.log(user);
	  if ((err) || (!user)) {
		res.redirect('/login');
		return;
	  }
	  req.logIn(user, function(err){
		//console.log(err);
		if (err){
			console.log('not correct')
			//return res.redirect('/login');
			return next(err);
		}
		return res.redirect('/');
	  });
	})(req, res, next);
	*/
	/*
	passport.authenticate(
		'bearer', 
		{ session: false }, 
		function(err, user, info) {
			console.log('2u:',user)
			req.logIn(user, function(err){
				//console.log(err);
				if (err){
					console.log('not correct')
					//return res.redirect('/login');
					return next(err);
				}
				return res.redirect('/');
		  	});
		}
	)(req, res, next);
	*/
	//passport.authenticate('local')(req, res, next);
	passport.authenticate('bearer', { session: true })(req, res, next);
  },

  process: function(req, res, next){
	  // Authenticate using HTTP Bearer credentials, with session support disabled.
	  passport.authenticate('bearer', { session: false }, function(err, user){

		crypto.randomBytes(48, function(ex, buf) {
		  var token = buf.toString('hex');
		  console.log('token', token);
		});
	  	console.log('err', err);
	  	console.log('user', user);
	    //res.json({ username: req.user.username, email: req.user.email });
	    return res.send('bearer');
	  })(req, res, next);
	},
	process_: function(req, res, next){
		passport.authenticate('bearer', { session: false }),
		  function(req, res) {
		    return res.send('bearer!');
		  }
	},

	process_simpl: function(req, res, next){
		passport.authenticate('bearer', {session: false})(req, res, next);
	},

	process2: function(req, res, next){
		var username = req.body.username,
			passw = req.body.password;

		crypto.randomBytes(48, function(ex, buf) {
		  var token = buf.toString('hex');
		  console.log(token);
		});
		var profile = {
			username: username
		};
		var token = jwt.sign(profile, SECRET, { expiresInMinutes: 60*5 });
		res.json({ token: token });
	},

	processLocal: function(req, res, next){
		passport.authenticate('local')(req, res, next);
	},

	logout: function (req,res){
		req.logout();
		res.send('logout successful');
	},
_config: {}
};