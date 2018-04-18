import * as jwt from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';
import { RequestHandler } from 'express';
import { UserService } from '../user/user.service';

const userService = new UserService();

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
    const header = headers.authorization as string;
    
    // not found
    if (!header) {
        return header;
    }

    return header.split(' ')[1];
}

export const tokenGuard: (() => RequestHandler) = (() => (req, res, next) => {
    const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || '';
    const hasAccess = userService.verifyToken(token);

    hasAccess.then(isValid => {
        if (!isValid) {
            return res.status(403).send({ message: 'Access Denied' });
        }

        next();
    });
});