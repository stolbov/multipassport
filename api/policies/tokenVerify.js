var Token = require('../../assets/lib/tokens');

module.exports = function(req, res, next){
	console.log('VERIFY TOKEN...');
	Token.verifyToken(req.user, function(verify){
		if(verify){
			next();
		}else{
			req.user = false;
			req.logout();
			res.redirect('/');
		}
	});
	//res.redirect('/test');
}