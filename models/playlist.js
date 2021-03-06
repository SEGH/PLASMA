// Playlist model
module.exports = function(sequelize, DataTypes) {
  var Playlist = sequelize.define("Playlist", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Playlist.associate = function(models) {
    Playlist.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  
  Playlist.associate = function(models) {
    Playlist.belongsToMany(models.Song, {
      through: models.PlaylistSong
    });
  };

  return Playlist;
};
