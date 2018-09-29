module.exports = function(sequelize, DataTypes){
    let Products = sequelize.define('Products', {
        name: DataTypes.STRING
    });

    Products.associate = function (models) {
        Products.hasMany(models.product_category);
        Products.hasMany(models.subproduct);
    };

    return Products;
};