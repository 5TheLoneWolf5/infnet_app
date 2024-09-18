import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';

const queryUser = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS user (
                uid TEXT PRIMARY KEY NOT NULL, 
                email TEXT NOT NULL, 
                emailVerified TEXT,
                displayName TEXT, 
                photoURL TEXT, 
                username TEXT, 
                phoneNumber TEXT, 
                createdAt TEXT, 
                sync INTEGER
            );
        `
const queryItem = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS item (
                uid TEXT PRIMARY KEY NOT NULL, 
                title TEXT NOT NULL, 
                description TEXT,
                createdAt TEXT, 
                sync INTEGER
            );
        `;

const queryItemImage = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS item_image (
                uid TEXT PRIMARY KEY NOT NULL, 
                image TEXT NOT NULL, 
                itemUid TEXT NOT NULL,
                createdAt TEXT, 
                sync INTEGER,
                FOREIGN KEY(itemUid) REFERENCES item(uid)
            );
        `;

const verifyConnection = async () => {
    const airplaneMode = await Network.isAirplaneModeEnabledAsync();
    const network = await Network.getNetworkStateAsync();

    console.log(network);

    return network.isConnected && !airplaneMode;
}

const getDb = async () => {

    return await SQLite.openDatabaseAsync("receitas", {
        useNewConnection: true
    });
}

const generateUID = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        uid += chars[randomIndex];
    }
    return uid;
}

const createTables = async() => {
    try{
        const db = await getDb();
        await db.execAsync(queryUser);
        await db.execAsync(queryItem);
        await db.execAsync(queryItemImage);
        console.log("Tabelas criadas");
    }catch(err){
        console.error("Database error: ", err)
    }
}

const dropTable = async (table) => {
    try{
        const db = await getDb();
        await db.execAsync(`DROP TABLE ${table};`);
        console.log("Tabela deletada com sucesso");
    }catch(err){
        console.error("Database drop error: ", err)
    }
}

const update = async (table, data, id) => {
    try{
        console.log(data);
        const db = await getDb();
        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => v !== "");

        const columns = keys.filter((v) => v !== "").map((v, index) => `${v} = ?`).join(", ");

        const query = `UPDATE ${table} SET ${columns.substring(0, columns.length)} WHERE uid = '${id}'`;
        await db.runAsync(query, values);
        syncFirebase();
        console.log("Dado atualizado com sucesso")
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const drop = async (table, where) => {
    try{
        const db = await getDb();

        const query = `DELETE FROM ${table} where ${where};`
        await db.runAsync(query);

        const whereSplit = where.split("=");
        const field = whereSplit[0]
        const value = whereSplit[1].replace(/['"]+/g, '')
        await syncDropItem(field, value);
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const syncFirebase = async () => {
    const statusConnection = await verifyConnection();
    console.log(statusConnection);
    if(statusConnection) {
        console.log("Firebase");
    }
}

const syncDropItem = async (field, value) => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        console.log(field);
        console.log(value);
    }
}

const insert = async (table, data) => {
    try{
        const db = await getDb();

        if (data.uid === undefined || data.uid === null){
            data.uid = generateUID(28);
        }

        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => v !== "");

        const columns = keys.filter((k) => data[k] !== "").join(", ");
        const interrogations = values.filter((v) => v !== "").map(() => '?').join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${interrogations})`;

        await db.runAsync(query, values);
        await syncFirebase();
        console.log("Dado inserido com sucesso")
        return data.uid;
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const select = async (table, columns, where, many) => {
    try {
        const columnString = columns.join(", ");
        const whereString = where !== "" && where !== null && where !== undefined ? `where ${where}` : ""
;
        const db = await getDb();
        const query = `SELECT ${columnString} FROM ${table} ${whereString};`;

        if(many) {
            return await db.getAllAsync(query);
        }
        return await db.getFirstAsync(query);
    }catch (err){
        console.error("Error select:", err)
    }
}

export { insert, createTables, dropTable, select, update, drop }