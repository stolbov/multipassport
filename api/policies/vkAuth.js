module.exports = function(req, res, next){
	//console.log('test user to vk: ', req.user);
	if(req.user.guest && !req.user.profile){
		console.log('go to auth form...');
		res.redirect('/login');
	}else{
		//console.log('next...');
		next();
	}
}