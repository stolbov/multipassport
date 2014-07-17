module.exports = {
  attributes: {
    token: {
      type: 'string'
    },
    userId: {
      type: 'string'
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