var auth = require('../../assets/lib/auth');
//var passport = require('../../config/passport');

// Модуль условной аутентификация пользователей через AD

// Зависимости
var ip = require('ip');
var passport = require('passport');
// Используем _предкомпилированную_ библиотеку passport-windowsauth
var WindowsStrategy = require('passport-windowsauth');
// Настройки
var options = require('../../options');

// Подготовленные преобразованные диапазоны IP
var privIpIntRanges = [];

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

var stratArray = [];
// END activeDirectory


module.exports = function(req, res, next){

	// Подготовка диапазонов IP, преобразованных в целые числа
	for (var range in options.privIPs) {
		privIpIntRanges.push({
			start: ip.toLong(options.privIPs[range].start),
			end: ip.toLong(options.privIPs[range].end)
		});
	}

	stratArray = [];
	for(var i in options.ldap) {
		stratArray.push('ldap' + i);
	}

	if (req.user && req.user.profile) {
		//next();
		return next();
	} else {
		if (isPrivateIP(req.ip)) {
			// Если запрос приходит из интранета, запрашиваем windows-авторизацию
			passport.authenticate(stratArray)(req, res, next);
		} else {
			// Если запрос приходит из других сетей, считаем ползователя гостем
			res.redirect('/login');
		}
	}
}