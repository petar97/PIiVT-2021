import IConfig from './IConfig.interface';

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
};

export default Config;