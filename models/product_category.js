module.exports = function (sequelize, DataTypes) {
    let product_category = sequelize.define('product_category', {});

    product_category.associate = function (models) {
        product_category.belongsTo(models.Products, {

        });
        product_category.belongsTo(models.Categories, {

        });
    };

    return product_category;
};