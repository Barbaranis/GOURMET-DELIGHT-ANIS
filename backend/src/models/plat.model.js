// src/models/plat.model.js


module.exports = (sequelize, DataTypes) => {
  const Plat = sequelize.define('Plat', {
    id_plat: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_categorie: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'plats',
    timestamps: false,
  });


  // Associations
  Plat.associate = (models) => {
    Plat.belongsTo(models.Categorie, {
      foreignKey: 'id_categorie',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };


  return Plat;
};







