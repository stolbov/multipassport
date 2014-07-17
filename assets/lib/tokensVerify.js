module.exports = function(req, res, next){
	console.log('Reconnect now!');
	//req.logout();
	res.redirect('/test');
}
