import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';
import { deleteData, getData, loadData, saveData, updateData } from "../firebase/realtime";

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
    const result = network.isConnected && !airplaneMode;
    
    return result;
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
    try {
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
    try {
        const db = await getDb();
        await db.execAsync(`DROP TABLE ${table};`);
        console.log("Tabela deletada com sucesso");
    } catch(err) {
        console.error("Database drop error: ", err)
    }
}

const update = async (table, data, uid, existsRemotely = false) => {
    try {

        if (!existsRemotely) {
            const sync = await syncFirebase(table, data, uid);
            data.sync = sync ? 1 : 0;
        }

        const db = await getDb();
        const keys = Object.keys(data);
        const values= Object.values(data); // filter((v) => v !== "");

        const columns = keys.filter((v) => v !== "").map((v, index) => `${v} = ?`).join(", ").toLowerCase();

        const query = `UPDATE ${table} SET ${columns.substring(0, columns.length)} WHERE uid = '${uid}'`;
        console.log(query, values);
        await db.runAsync(query, values);
        console.log("Dado atualizado com sucesso")
    } catch(err) {
        console.error("Error insert:", err)
        throw err;
    }
}

const drop = async (table, where) => {
    try {
        const db = await getDb();

        const query = `DELETE FROM ${table} WHERE ${where};`
        console.log("DELETE query: " + query);
        await db.runAsync(query);

        const whereSplit = where.split("=");
        const field = whereSplit[0]
        const value = whereSplit[1].replace(/['"]+/g, '').trim();

        await syncDropItem(table, value); // Value must be the same as the key of the row to be deleted. // No 'await'.

        // const sync = await syncDropItem(table, value);
        // data.sync = sync ? 1 : -1;

    } catch (err) {
        console.error("Error insert:", err)
        throw err;
    }
}

const syncFirebase = async (table, data, uid) => {

    const statusConnection = await verifyConnection();

    if(statusConnection) {
        updateData(table, data, uid);
    }

    return statusConnection;
}

const syncDropItem = async (table, uid) => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        await deleteData(table, uid);
    } else {
        setInterval(async () => {
            await syncDropItem(table, uid);
        }, 60000 * 2);
    }
}

const insert = async (table, data, existsRemotely = false) => {
    try{
        const db = await getDb();

        if (data.uid === undefined || data.uid === null){
            data.uid = generateUID(28);
        }

        if (!existsRemotely) {
            const sync = await syncFirebase(table, data, data.uid);
            data.sync = sync ? 1 : 0;
        }

        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => v !== "");

        const columns = keys.filter((k) => data[k] !== "").join(", ").toLowerCase();
        const interrogations = values.filter((v) => v !== "").map(() => '?').join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${interrogations})`;
        // console.log(query);
        await db.runAsync(query, values);
        console.log("Dado inserido com sucesso: " + query)
        return data.uid;
    } catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const select = async (table, columns, where, many) => {
    try {
        const columnString = columns === "*" ? "*" : columns.join(", ");
        const whereString = where !== "" && where !== null && where !== undefined ? `where ${where}` : "";
        const db = await getDb();
        const query = `SELECT ${columnString} FROM ${table} ${whereString};`;
        console.log(query);

        if(many) {
            return await db.getAllAsync(query);
        }
        return await db.getFirstAsync(query);
    } catch (err){
        console.error("Error select:", err)
    }
}

const syncLocalOnlyData = async () => {
    
    setInterval(async () => {
        if (await verifyConnection()) {

            const user = await select("user", "*", "sync = 0", false);
            const items = await select("item", "*", "sync = 0", true);
            const itemsImages = await select("item_image", "*", "sync = 0", true);
            // console.log(user, items, itemsImages);

            if (user) {
                if (Object.keys(user).length > 0) {
                    const obj = user;
                    // delete obj.sync;
                    await getData("user", obj.uid) ? await updateData("user", obj, obj.uid) : await saveData("user", obj, obj.uid);
                    await update("user", { ...user, sync: 1 }, user.uid);
                }
            }

            if (items?.length > 0) {
                for (let i = 0; i < items.length; i++) {
                    const obj = items;
                    // delete obj[i].sync;
                    await getData("item", obj[i].uid) ? await updateData("item", obj[i], obj[i].uid) : await saveData("item", obj[i], obj[i].uid);
                    await update("item", { ...items[i], sync: 1 }, items[i].uid);
                }
            }

            if (itemsImages?.length > 0) {
                for (let i = 0; i < itemsImages.length; i++) {
                    const obj = itemsImages;
                    // delete obj[i].sync;
                    await getData("item_image", obj[i].uid) ? await updateData("item_image", obj[i], obj[i].uid) : await saveData("item_image", obj[i], obj[i].uid);
                    await update("item_image", { ...itemsImages[i], sync: 1 }, itemsImages[i].uid);
                }
            }

        }

    }, 60000 * 2);
}

const populateLocalUser = async (uid) => { 

    const user = await getData("user", uid);

    if (user) {
        await select("user", ["uid"], `uid = '${user.uid}'`, false) ? await update("user", user, uid, true) : await insert("user", user, true);
    }

};

const populateLocalItems = async () => {

    const items = await loadData("item");

    if (items) {

        const itemKeys = Object.keys(items);
        // console.log(items);
        // I need to retrieve the uid inside the object.

        const verifyDelete = await select("item", ["uid"], "", true);

        for (let i = 0; i < verifyDelete.length; i++) {
            let exists = false;
            for (let key of itemKeys) {
                const itemObj = items[key];
                if (verifyDelete[i].uid === itemObj.uid) { 
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                drop("item", `uid = "${verifyDelete[i].uid}"`);
            } else {
                console.log("Item exists.");
            }
        }

        for(let key of itemKeys) {
            const item = items[key];
            await select("item", ["uid"], `uid = '${item.uid}'`, false) ? await update("item", item, item.uid, true) : await insert("item", item, true);
        }
    }

};

const populateLocalImages = async () => {

    const itemImages = await loadData("item_image");

    if (itemImages) {

        const itemImagesKeys = Object.keys(itemImages);

        const verifyDelete = await select("item_image", ["uid"], "", true);

        for (let i = 0; i < verifyDelete.length; i++) {
            let exists = false;
            for (let key of itemImagesKeys) {
                const itemObj = itemImages[key];
                if (verifyDelete[i].uid === itemObj.uid) { 
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                drop("item_image", `uid = "${verifyDelete[i].uid}"`);
            } else {
                console.log("Item_image exists.");
            }
        }
        
        for(let key of itemImagesKeys) {
            const itemImage = itemImages[key];
            await select("item_image", ["uid"], `uid = '${itemImage.uid}'`, false) ? await update("item_image", itemImage, itemImage.uid, true) : await insert("item_image", itemImage, true);
        }
    }

};

const populateAll = async (uidUser) => {
    await populateLocalUser(uidUser);
    await populateLocalItems();
    await populateLocalImages();
};

export {
    insert,
    createTables,
    dropTable,
    select,
    update,
    drop,
    populateLocalUser,
    populateLocalItems,
    populateLocalImages,
    populateAll,
    verifyConnection,
    syncLocalOnlyData,
    generateUID,
}