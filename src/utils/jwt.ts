import * as jwt from 'jsonwebtoken';

export const signToken  = (payload: any, secret: string, expiresIn: string) => {
    return  jwt.sign(payload, secret, {expiresIn});
}

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
}