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
};
