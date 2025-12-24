const sequelize = require('../config/db');

const User = require('./user')(sequelize);
const Channel = require('./channel')(sequelize);
const Membership = require('./membership')(sequelize);
const Message = require('./message')(sequelize);

// Associations
User.belongsToMany(Channel, { through: Membership, foreignKey: 'userId' });
Channel.belongsToMany(User, { through: Membership, foreignKey: 'channelId' });

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Channel.hasMany(Message, { foreignKey: 'channelId' });
Message.belongsTo(Channel, { foreignKey: 'channelId' });

Membership.belongsTo(User, { foreignKey: 'userId' });
Membership.belongsTo(Channel, { foreignKey: 'channelId' });

User.hasMany(Membership, { foreignKey: 'userId' });
Channel.hasMany(Membership, { foreignKey: 'channelId' });


module.exports = {
  sequelize,
  User,
  Channel,
  Membership,
  Message
};