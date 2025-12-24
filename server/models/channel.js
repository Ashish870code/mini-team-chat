const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Channel', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'channels',
    timestamps: true
  });
};