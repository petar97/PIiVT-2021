import { Algorithm } from "jsonwebtoken";

interface TokenKeyOptions {
    private: string;
    public: string;
    duration: number;
}

interface TokenOptions {
    auth: TokenKeyOptions;
    refresh:TokenKeyOptions;
    issuer: string;
    algorithm: Algorithm;
}

export default interface IConfig {
    server: {
        port: number,
        static: {
            route: string,
            path: string,
            index: boolean,
            dotfiles: "deny" | "allow",
            cacheControl: boolean,
            maxAge: number,
            etag: boolean,
        }
    },
    database: {
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        charset: string,
        timezone: string,
    },
    fileUpload: {
        maxSize: number;
        maxFiles: number;
        timeout: number;
        temporaryDirectory: string;
        uploadDestinationDirectory: string;
        photos: {
            limits: {
                minWidth: number;
                maxWidth: number;
                minHeight: number;
                maxHeight: number;
            },
            resizes: {
                sufix: string;
                width: number;
                hieght: number;
                fit: "cover"|"contain";
            }[],
        },
    },
    auth: {
        administrator: TokenOptions,
    },
};
