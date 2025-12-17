import pg from "pg";
import { type DatabaseClient, DatabaseConnectionState } from "../client.js";

export class PostgresClient implements DatabaseClient {
    private client: pg.Client;
    private _state: DatabaseConnectionState;

    public get state(): DatabaseConnectionState {
        return this._state;
    }
    
    constructor(host: string, port: number, user: string, password: string, database: string) {
        this._state = DatabaseConnectionState.DISCONNECTED;

        this.client = new pg.Client({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
    }

    public async query(text: string, params?: any[]): Promise<any[]> {
        return this.client.query(text, params)
            .then(res => res.rows);
    }

    public async connect(): Promise<void> {
        this._state = DatabaseConnectionState.CONNECTING;
        await this.client.connect();
        this._state = DatabaseConnectionState.CONNECTED;
    }

    public async disconnect(): Promise<void> {
        this._state = DatabaseConnectionState.DISCONNECTING;
        await this.client.end();
        this._state = DatabaseConnectionState.DISCONNECTED;
    }
}