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
    fileUpload: {
        maxSize: 5 * 1024 * 1024,
        maxFiles: 5,
        timeout: 60000,
        temporaryDirectory: '../temp/',
        uploadDestinationDirectory: 'static/uploads/',
    },
};

export default Config;