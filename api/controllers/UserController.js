/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  	create: function(req, res, next){
  		// var username = req.query.username,
  		// 	password = req.query.password;
  		//console.log(JSON.stringify(req.body));
  		User.create(req.body).done(function(err, item){
  			if(err){
  				return res.send(500, err);
  			}else{
  				return res.json(item);
  			}
  		});
  	},
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
