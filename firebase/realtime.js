import { get, getDatabase, ref, remove, set, update } from "firebase/database";

const db = getDatabase();

const saveData = async (table, data, uid) => {
    console.log(table, data, uid);
    set(ref(db, `${table}/` + uid), data);
}

const updateData = async (table, data, uid) => {
    // console.log(table, data, uid);
    const updates = {};
    updates[`/${table}/${uid}`] = data;
    update(ref(db), updates);
}

const loadData = async (table) => {
    const snapshot = await get(ref(db, table));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

const getData = async (table, uid) => {
    const snapshot = await get(ref(db, `${table}/` + uid));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

const deleteData = async (table, uid) => {
    await remove(ref(db, `${table}/${uid}`))
        .then(() => console.log(`${table}/${uid}`))
        .catch((e) => console.log(e.message));

    // const updates = {};
    // updates[`/${table}/` + uid] = null;
    // update(ref(db), updates);
}

export {
    saveData,
    updateData,
    loadData,
    getData,
    deleteData
}