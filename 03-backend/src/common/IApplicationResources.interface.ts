import * as mysql2 from 'mysql2/promise';

export default interface IApplicationResources {
    dbConnection: mysql2.Connection
}
