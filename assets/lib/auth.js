// Модуль условной аутентификация пользователей через AD

// Зависимости
var ip = require('ip');
var passport = require('passport');
// Используем _предкомпилированную_ библиотеку passport-windowsauth
var WindowsStrategy = require('passport-windowsauth');
// Настройки
var options = require('./options');

// Подготовленные преобразованные диапазоны IP
var privIpIntRanges = [];

// Коллекция ldap
var middlewares = module.exports.middlewares = [];

// Попадает ли IP-адрес в один из указанных диапазонов
var isPrivateIP = function (ipAddr) {
	var intIpAddr = ip.toLong(ipAddr);
	var result = false;

	for (var range in privIpIntRanges) {
		if ((intIpAddr >= privIpIntRanges[range].start) && 
			(intIpAddr <= privIpIntRanges[range].end)) {

			result = true;
		}		
	}

	return result;
};

// Фабрика стратегий
var generateWindowsAuth = function (strategy) {
	return function (req, res, next) {
		if (req.user && req.user.profile) {
			next();
		} else {
			if (isPrivateIP(req.ip)) {
				// Если запрос приходит из интранета, запрашиваем windows-авторизацию
				(passport.authenticate(strategy)) (req, res, next);
			} else {
				// Если запрос приходит из других сетей, считаем ползователя гостем
				req.user = { guest: true };
				next();
			}
		}
	};
};

module.exports.setupWindowsAuth = function (app) {
	// Подготовка диапазонов IP, преобразованных в целые числа
	for (var range in options.privIPs) {
		privIpIntRanges.push({
			start: ip.toLong(options.privIPs[range].start),
			end: ip.toLong(options.privIPs[range].end)
		});
	}

	// Для правильного получения IP через iisnode
	app.enable('trust proxy');
	for(var i in options.ldap) {
		// Общая настройка passport.js
		passport.use('ldap' + i, new WindowsStrategy(
			{ldap: options.ldap[i]},
			function (profile, done) {
				done(null, {guest: false, profile: profile}); 
			}
		));
		middlewares.push(generateWindowsAuth('ldap' + i));
		console.log("add middlewares")
	}

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (userid, done) {
		done(null, userid);
	});

	app.use(passport.initialize());
};

module.exports.tryWindowsAuth = function (req, res, next) {
	next();
	// if (isPrivateIP(req.ip)) {
	// 	// Если запрос приходит из интранета, запрашиваем windows-авторизацию
	// 	(passport.authenticate('WindowsAuthentication')) (req, res, next);
	// } else {
	// 	// Если запрос приходит из других сетей, считаем ползователя гостем
	// 	req.user = {guest: true};
	// 	next();
	// }
};
