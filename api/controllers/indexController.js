var passport = require("passport");
var Token = require('../../assets/lib/tokens');

module.exports = {
	index: function(req,res){
		console.log('get user data: ', req.user);
		console.log('');
		console.log('-------------------------------------------');
		console.log('');
		var userData = {};
		Token.decodeToken(req.user.profile, function(user){
			if(!user.displayname){
				user.displayname = 'anonimous';
			}
			res.view('home/index', {user: user});
		});

	},

  _config: {}
};