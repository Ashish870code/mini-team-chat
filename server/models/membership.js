const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Membership = sequelize.define('Membership', {

    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    channelId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  }, {
    tableName: 'memberships',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId', 'channelId'] }
    ]
  });

  return Membership;
};