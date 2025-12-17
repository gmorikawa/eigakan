export enum DatabaseConnectionState {
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    DISCONNECTING = "DISCONNECTING",
    DISCONNECTED = "DISCONNECTED",
    ERROR = "ERROR"
}

export interface DatabaseClient {
    state: DatabaseConnectionState;
    query: (text: string, params?: any[]) => Promise<any[]>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}