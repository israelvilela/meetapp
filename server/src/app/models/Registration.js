import { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
        modelName: 'registrations',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'userRegistration',
    });
    this.belongsTo(models.Meeting, {
      foreignKey: 'meeting_id',
      targetKey: 'id',
      as: 'meetingRegistration',
    });
  }
}

export default Registration;
