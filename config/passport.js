var passport    = require('passport'),
  	LocalStrategy = require('passport-local').Strategy,
  	VKontakteStrategy = require('passport-vkontakte').Strategy,
	util = require('util'),
	crypto = require('crypto'),
	// for ActiveDirectory
	cors = require('cors'),
	auth = require('../assets/lib/auth');
var iisBaseUrl = require('iis-baseurl_vk');

//Модуль условной аутентификация пользователей через AD

//Зависимости
var ip = require('ip');
var passport = require('passport');
var WindowsStrategy = require('passport-windowsauth');// Используем _предкомпилированную_ библиотеку passport-windowsauth
var options = require('../assets/lib/options');

var Token = require('../assets/lib/tokens');

var setupWindowsAuth = function (app) {
	for(var i in options.ldap) {
		// Общая настройка passport.js
		passport.use('ldap' + i, new WindowsStrategy(
			{ldap: options.ldap[i]},
			function (profile, next) {
				Users.findOne({externalID: profile.id}).done(function(err, regUser){
					if(!regUser){
						Users.create({displayname: profile.displayName, userType: 'local', externalID: profile.id, activeDirectoryStatus: '1'}).done(function(err, info){
							Token.readToken(
								info,
								next
							);
						});
					}else{
						if(regUser.activeDirectoryStatus == '1'){
							Token.readToken(
								regUser,
								next
							);
						}else{
							//go to auth form
							next(null, {guest: true, profile: false, adProfile: regUser});
						}
					}
				});
			}
		));
	}
};

passport.use(new VKontakteStrategy({
    clientID:     '4421326', // VK.com docs call it 'API ID'
    clientSecret: 'X7JbNzzIzQMFH5iSXCkg',
    callbackURL:  'http://si-sdiis/multilogin/auth/vkontakte'
  },
  function(accessToken, refreshToken, profile, next) {
  	//console.log('start reseive data from vk.com...');
  	//console.log('token: ', accessToken);
  	//console.log('profile: ', profile);
    //User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
	//var profile = userdata.profile;
	Users.findOne({externalID: profile.id}).done(function(err, regUser){
		if(!regUser){
			Users.create({displayname: profile.displayName, userType: 'vk', externalID: profile.id, activeDirectoryStatus: '0'}).done(function(err, info){
				Token.readToken(
					info,
					next
				);
			});
		}else{
			var user = (
				null, 
				{
					guest: true, 
					profile:  { 
						displayname: profile.displayName,
						userType: 'vk',
						externalID: profile.id,
						activeDirectoryStatus: '0',
						createdAt: '2014-06-28T10:12:03.471Z',
						updatedAt: '2014-06-28T10:12:03.471Z',
						id: regUser.id
					}
				}
			);
			//next({token: accessToken, profile: profile});
			Token.readToken(
				regUser,
				next
			);
		}
	});


    //return done({token: accessToken, profile: profile});
    //});
  }
));

module.exports = {
	express: {
		customMiddleware: function(app){

			app.enable('trust proxy');// Для правильного получения IP через iisnode
			
			app.use(iisBaseUrl());
		
			app.use(function (req, res, next) {
				res.set('Cache-Control', 'no-store');
				next();
			});
			
			app.use(cors({
			    origin: true,
			    headers: 'X-Requested-With',
			    credentials: true
			}));

			app.use(passport.initialize());
		  	app.use(passport.session());
			
			passport.serializeUser(function (user, done) {
				//console.log('serialize user: ', user);
				done(null, user);
			});

			passport.deserializeUser(function (user, done) {
				//console.log('deserialize user:', user);
				//Token.verifyToken(user, done);
				done(null, user);
			});
		
			setupWindowsAuth(app);


		}
	}
};