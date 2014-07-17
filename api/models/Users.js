var bcrypt = require('bcrypt-nodejs');

module.exports = {
  attributes: {
    displayname: {
      type: 'string',
      required: true
    },
    userType: {
      type: 'string'
    },
    externalID: {
      type: 'string'
    },
    activeDirectoryStatus: {
      type: 'string'
    },

    //Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();
      // Remove the password object value
      delete obj.password;
      // return the new object without password
      return obj;
    }
  },

  // beforeCreate: function(user, cb) {
  //   bcrypt.genSalt(10, function(err, salt) {
  //     bcrypt.hash(user.password, salt, function(err, hash) {
  //       if (err) {
  //         console.log(err);
  //         cb(err);
  //       }else{
  //         user.password = hash;
  //         cb(null, user);
  //       }
  //     });
  //   });
  // }
};