const uniqueValidator = require('mongoose-unique-validator');

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        date_created: DataTypes.STRING,
        date_updated: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                //associations can be defined here
            }
        }
    });
    return user;
};

userSchema.plugin(uniqueValidator);