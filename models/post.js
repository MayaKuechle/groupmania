'use strict';
module.exports = function(sequelize, DataTypes) {
    var posts = sequelize.define('posts', {
        title: DataTypes.STRING,
        content: DataTypes.STRING
        /*date_created: DataTypes.STRING,
        date_updated: DataTypes.STRING*/
    }, {});

    posts.associate = function(models) {
        posts.belongsTo(models.user, {as: 'user', foreignKey: 'user_id'})
    }
    
    return posts;
};