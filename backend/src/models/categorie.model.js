// src/models/categorie.model.js




module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "Nom de la catégorie (Entrées, Plats, Desserts, etc.)"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'categories',
    timestamps: false
  });


  // 🔗 Associations
  Categorie.associate = (models) => {
    Categorie.hasMany(models.Plat, {
      foreignKey: 'id_categorie',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };


  return Categorie;
};

