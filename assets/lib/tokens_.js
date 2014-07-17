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
				//verifyToken(token, next);
				if(USER.userType == 'local'){
					next(null, {guest: false, profile: token});
				}else{
					next({guest: false, profile: token});
				}
			});
		}else{
			console.log('Find token: ', token.token);
			//console.log('>', createToken());
			if(USER.userType == 'local'){
				next(null, {guest: false, profile: token.token,});
			}else{
				next({guest: false, profile: token.token});
			}
			//verifyToken(token, next);
		}
	});
}

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

var createToken = function(){
	return jwt.sign(USER, SECRET, { expiresInMinutes: 300 });
}

var verifyToken = function(user, next){
	jwt.verify(user.profile, SECRET, function(err, decoded){
		console.log('Verified errors: ', err);
		if(decoded !== undefined){
			console.log('Token exp: ', new Date(decoded.exp*1000));
			next(null, user);
		}else{
			console.log('No token or token expired!');
			var reconnect = require('../../assets/lib/tokensVerify');
			reconnect();
			//next(null, user);
		}
		//next(null, user);
	});
}

module.exports = {
	readToken: readToken,
	verifyToken: verifyToken
};