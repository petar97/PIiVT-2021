import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import Config from '../config/dev';
import ITokenData from '../components/auth/dto/ITokenData.interface';

type UserRole = "administrator";

interface TokenValidationInformation {
    isValid: boolean;
    data: any;
}

export default class AuthMiddleware {
    private static verifyAuthToken(req: Request, res: Response, next: NextFunction, allowedRoles: UserRole) {
        if (Config.auth.allowRequestsEvenWithoutValidTokens) {
            return next();
        }
        
        if (typeof req.headers.authorization !== "string") {
            return res.status(401).send("No auth token specified.");
        }

        const token: string = req.headers.authorization;

        const [ tokenType, tokenString ] = token.trim().split(" ");

        if ( tokenType !== "Bearer" ) {
            return res.status(401).send("Invalid auth token type specified.");
        }

        if ( typeof tokenString !== "string" || tokenString.length === 0 ) {
            return res.status(401).send("Invalid auth token length.");
        }
        const administratorTokenValidation = this.validateTokenAsTokenByRole(tokenString, "administrator");

        let result;

        if (administratorTokenValidation.isValid === false) {
            return res.status(401).send("Token validation error: " + 
                                        JSON.stringify(administratorTokenValidation) + " " + 
                                        JSON.stringify(administratorTokenValidation));
        }

        if (administratorTokenValidation.isValid) {
            result = administratorTokenValidation.data;
        }

        if (typeof result !== "object") {
            return res.status(401).send("Bad auth token data.");
        }

        const data: ITokenData = result as ITokenData;

        if (!allowedRoles.includes(data.role)) {
            return res.status(403).send("Access denied to this role.");
        }

        req.authorized = data;

        next();
    }

    private static validateTokenAsTokenByRole(tokenString: string, role: UserRole): TokenValidationInformation {
        try {
            const result = jwt.verify(tokenString, Config.auth[role].auth.public);
            return {
                isValid: true,
                data: result,
            };
        } catch (e) {
            return {
                isValid: false,
                data: e?.message,
            };
        }
    }

    public static getVerifier(allowedRoles: UserRole):
    (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.verifyAuthToken(req, res, next, allowedRoles);
        };
    }
}
