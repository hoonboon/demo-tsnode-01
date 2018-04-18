import * as Sequelize from 'sequelize';
import { sequelize as sqlzInst } from '../resources/db/sequalize';

export interface UserAdd {
    email: string;
    password: string;
}

export interface UserView {
    id: number;
    email: string;
}

export function getUserViewAttr(): string[] {
    return ['id', 'email'];
}

export interface User extends Sequelize.Model<User, UserAdd> {
    id: number;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export const UserModel = sqlzInst.define<User, UserAdd>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
});
