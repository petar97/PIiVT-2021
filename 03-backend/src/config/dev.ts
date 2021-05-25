import IConfig from '../common/IConfig.interface';

const Config: IConfig = {
    server: {
        port: 40080,
        static: {
            route: "/static",
            path: "./static/",
            index: false,
            dotfiles: "deny",
            cacheControl: false,
            maxAge: 360000,
            etag: false,
        }
    },
    database: {
        host: "localhost",
        port: 3000,
        user: "root",
        password: "root",
        database: "aplikacija",
        charset: "utf8",
        timezone: "+01:00",
    },
};

export default Config;