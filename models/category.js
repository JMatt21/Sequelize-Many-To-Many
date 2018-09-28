module.exports = function(sequelize, DataTypes){
    let Categories = sequelize.define('Categories', {
        name: DataTypes.STRING
    });

    Categories.associate = function (models) {
        Categories.hasMany(models.product_category);
    };

    return Categories;
};