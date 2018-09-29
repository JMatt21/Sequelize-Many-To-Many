module.exports = function (sequelize, DataTypes) {
    let subproduct = sequelize.define('subproduct', {});

    subproduct.associate = function (models) {
        subproduct.belongsTo(models.Products, {

        });
        subproduct.belongsTo(models.Products, {
            as: "Subproduct", foriegnKey: "SubproductId"
        });
    };

    return subproduct;
};