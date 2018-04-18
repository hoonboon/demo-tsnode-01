import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as Bluebird from "bluebird";
import { UserAdd, UserView, User, UserModel, getUserViewAttr } from './user.model';

export class UserService {
    private readonly _saltRounds: number = 12;
    private readonly _jwtSecretKey: string = 'myLittleSecret123';

    getUserById(id: number) {
        return UserModel.findById(
            id, 
            { attributes: getUserViewAttr() }
        ) as Bluebird<UserView>;
    }

    register({ email, password }: UserAdd) {
        return bcrypt.hash(password, this._saltRounds)
            .then(hash => {
                return UserModel.create({ email, password: hash })
                    .then(u => this.getUserById(u.id));
            });
    }

    login({ email }: UserAdd) {
        return UserModel.findOne({ where: { email } })
            .then(u => {
                const { id, email } = u!;
                return { token: jwt.sign({ id, email }, this._jwtSecretKey) };
            });
    }

    verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this._jwtSecretKey, (err, decoded) => {
                if (err) {
                    resolve(false);
                    return;
                }

                let u = UserModel.findById(decoded['id']);
                resolve(true);
                return;
            });
        }) as Promise<boolean>;
    }
}