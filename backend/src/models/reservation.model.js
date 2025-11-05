// src/models/reservation.model.js


module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id_reservation: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { isEmail: true }
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    heure: {
      type: DataTypes.TIME,
      allowNull: false
    },
    nb_personnes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'confirmee', 'refusee'),
      defaultValue: 'en_attente'
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true
      // L'association sera faite plus bas
    }
  }, {
    tableName: 'reservations',
    timestamps: false
  });


  // Association Sequelize définie ici
  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Utilisateur, {
      foreignKey: 'id_utilisateur',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });


    models.Utilisateur.hasMany(Reservation, {
      foreignKey: 'id_utilisateur',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };


  return Reservation;
};

