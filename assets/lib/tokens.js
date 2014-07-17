var expressJwt = require('express-jwt'),
	jwt = require('jsonwebtoken'),
	crypto = require('crypto');

var SECRET = 'shhhhhhared-secret',
	TOKEN = false,
	USER = false; 

var readToken = function(user, next){
	console.log('token get user: ', user);
	Tokens.findOne({userId: user.id}).done(function(err, token){
		USER = user;
		if(err){
			console.log('error toker');
			return next();
		}
		if(!token){
			console.log('add token...');
			TOKEN = createToken();
			console.log('new token: ', TOKEN);
			Tokens.create({token: TOKEN, userId: user.id}).done(function(err, token){
				if(USER.userType == 'local'){
					next(null, {guest: false, profile: token, adProfile: user});
				}else{
					next({guest: false, profile: token, adProfile: false});
				}
			});
		}else{
			tokenUpdater(token, function(verifToken){
				if(USER.userType == 'local'){
					next(null, {guest: false, profile: verifToken.token, adProfile: user});
				}else{
					next({guest: false, profile: verifToken.token, adProfile: false});
				}				
			});
		}
	});
}

var tokenUpdater = function(token, next){
	//console.log('Find old token: ', token.token);
	jwt.verify(token.token, SECRET, function(err, decoded){
		//console.log('Verified errors: ', err);
		if(decoded == undefined){
			console.log('update token...');
			Tokens.update(
				{id: token.id},
				{token: createToken()},
				function(err, token){
					if(err){
						console.log('update token error!');
					}
					next(token[0]);
				}
			);
		}else{
			console.log('Token is valid');
			next(token);
		}
	})
}
/*
var verifyToken_ = function(token, next){
	jwt.verify(token.token, SECRET, function(err, decoded){
		console.log('Verified errors: ', err);
		if(decoded == undefined){
			console.log('update token...');
			if(token.id){
				Tokens.update(
					{id: token.id},
					{token: createToken()},
					function(err, token){
						if(err){
							console.log('update token error!');
						}else{
							next(null, {guest: false, profile: USER});
						}
					}
				);
			}else{
				console.log('update token error 2!')
			}
		}else{
			console.log('Token exp: ', new Date(decoded.exp*1000));
			next(null, {guest: false, profile: USER});
		}
	});
}
*/
var createToken = function(){
	return jwt.sign(USER, SECRET, { expiresInMinutes: 1 });
}

var verifyToken = function(user, next){
	jwt.verify(user.profile, SECRET, function(err, decoded){
		console.log('Verified errors: ', err);
		if(decoded !== undefined){
			console.log('Token exp: ', new Date(decoded.exp*1000));
			next(true);
		}else{
			console.log('No token or token expired!');
			next(false);
		}
		// next(null, user);
	});
}


var decodeToken = function(token, next) {
	jwt.verify(token, SECRET, function(err, decoded){
		if(decoded !== undefined){
			next(decoded);
		}else{
			next(false);
		}
	});
}

module.exports = {
	readToken: readToken,
	verifyToken: verifyToken,
	decodeToken: decodeToken
};