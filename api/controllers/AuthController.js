var passport = require("passport");

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var SECRET = 'shhhhhhared-secret'; 
var crypto = require('crypto');
var app = require('sails').express.app;
app.use(expressJwt({secret: SECRET}));
var Token = require('../../assets/lib/tokens');

// var iisBaseUrl = require('iis-baseurl_vk');
// app.use(iisBaseUrl());

module.exports = {
	login: function(req,res){
		try{
			if(req.user.adProfile){
				res.view("auth/loginWithAD");
			}else{
				res.view("auth/login");
			}
		}
		catch(ex){
			res.view("auth/login");
		}
	},

	process: function(req, res, next){
		passport.authenticate('local', function(err, user, info){
			console.log('user: ', user);
		  if ((err) || (!user)) {
			return res.redirect('/login');
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
	},


	logout: function (req,res){
		Token.decodeToken(req.user.profile, function(user){
			Users.update(
				{id: user.id},
				{activeDirectoryStatus: 0},
				function(err, updUser){
					if(err){
						console.log('update user error!');
					}
					req.logout();
					res.redirect('/');
				}
			);
		});
	},

	vkRequest: function(req, res, next){
		passport.authenticate('vkontakte', function(req, res, next){

		})(req, res, next);

	},

	vkAuth: function(req, res, next){
		//console.log('oauth.vk.com redirect to /auth/vkontakte...');
		passport.authenticate('vkontakte', { failureRedirect: '/login' }, function(userdata){
			var user = (
				null, 
				userdata
			);

			req.logIn(user, function(err){
				if(err){
					console.log('not correct');
				}
				return res.redirect('/');
			});
		})(req, res, next);
	},

	adLogin: function(req, res, next){
		if(req.user.adProfile && req.user.adProfile.userType == 'local' && req.user.adProfile.activeDirectoryStatus == '0'){
			Users.update(
				{id: req.user.adProfile.id},
				{activeDirectoryStatus: 1},
				function(err, updUser){
					if(err){
						console.log('update user error!');
					}
					req.logout();
					res.redirect('/');
				}
			);

		}else{
			res.redirect('/');
		}
		//next();
	},

	_config: {}
};