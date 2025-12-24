const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Message', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    channelId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'messages',
    timestamps: true
  });
};