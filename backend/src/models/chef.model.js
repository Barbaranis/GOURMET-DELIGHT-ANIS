// src/models/chef.model.js


module.exports = (sequelize, DataTypes) => {
  const Chef = sequelize.define('Chef', {
    id_chef: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    specialite: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nombre d’années d’expérience'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'chefs',
    timestamps: false
  });


  return Chef;
};



