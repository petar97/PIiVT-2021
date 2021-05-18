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
    }
};
