// src/models/avis.model.js


module.exports = (sequelize, DataTypes) => {
  const Avis = sequelize.define('Avis', {
    id_avis: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    commentaire: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    note: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    valide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'avis',
    timestamps: false
  });


  // Association
  Avis.associate = (models) => {
    Avis.belongsTo(models.Utilisateur, {
      foreignKey: 'id_utilisateur',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    models.Utilisateur.hasMany(Avis, {
      foreignKey: 'id_utilisateur',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };


  return Avis;
};

