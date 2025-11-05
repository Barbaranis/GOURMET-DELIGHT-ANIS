// src/models/utilisateur.model.js


module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    mot_de_passe: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(
        'admin',
        'maitre_hotel',
        'chef_cuisine',
        'responsable_salle',
        'gestionnaire_contenu',
        'responsable_avis',
        'responsable_communication'
      ),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'utilisateurs',
    timestamps: false
  });


  // Associations si besoin plus tard :
  // Utilisateur.associate = (models) => {
  //   // Exemple : Utilisateur.hasMany(models.Reservation, { foreignKey: 'id_utilisateur' });
  // };


  return Utilisateur;
};



