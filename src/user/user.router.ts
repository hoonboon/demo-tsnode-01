import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { UserModel, UserAdd } from './user.model';
import { UserService } from './user.service';
import { matchedData } from 'express-validator/filter';

export const router = Router();
const userService = new UserService();

router.post('/register', [
    check('email')
        .isLength({ min: 1 }).trim().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format.')
        .custom(email => UserModel.find({ where: { email } }).then(u => !!!u)).withMessage('Email already registered.'),
    check('password')
        .isLength({ min: 8 }).trim().withMessage('Password must be equal or more than 8 characters.')
        .isAlphanumeric().withMessage('Only Alphanumeric characters are permitted.'),
    check('confirmPassword')
        .isLength({ min: 8 }).trim().withMessage('Password must be equal or more than 8 characters.')
        .custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Password does not match.'),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const payload = matchedData(req) as UserAdd;
    const user = userService.register(payload);

    return user.then(u => res.json(u));
});

router.post('/login', [
    check('email')
        .isLength({ min: 1 }).trim().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format.')
        .custom(email => UserModel.find({ where: { email } }).then(u => !!u)).withMessage('Invalid email or password.'),
    check('password')
        .isLength({ min: 1 }).trim().withMessage('Password is required')
        .custom((password, { req }) => {
            return UserModel.findOne({ where: { email: req.body.email } })
                .then(user => bcrypt.compare(password, user!.password))
        }).withMessage('Invalid email or password.'),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const payload = matchedData(req) as UserAdd;
    const token = userService.login(payload);

    return token.then(t => res.json(t));
});
