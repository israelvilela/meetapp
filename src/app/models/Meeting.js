import Sequelize, { Model } from 'sequelize';

class Meeting extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        formattedDate: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'organizer' });
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'file' });
    this.belongsToMany(models.User, {
      through: 'Registrations',
      as: 'meeting_register',
      foreignKey: 'meeting_id',
      otherKey: 'user_id',
    });
  }
}

export default Meeting;
