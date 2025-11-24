import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export class User extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;

  async checkPassword(plain: string) {
    return bcrypt.compare(plain, this.password);
  }
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName:  { type: DataTypes.STRING, allowNull: false },
    email:     { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password:  { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  User.beforeCreate(async (user: User) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  return User;
};
