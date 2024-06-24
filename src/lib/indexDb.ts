import { openDB } from "idb";
export const TRIP_STORE = "trips";
export const SYNC = "back-sync";

const dbPromise = openDB("posts-store", 4, {
	upgrade: (db) => {
		if (!db.objectStoreNames.contains(TRIP_STORE)) {
			db.createObjectStore(TRIP_STORE, { keyPath: "id" });
		}
		if (!db.objectStoreNames.contains(SYNC)) {
			db.createObjectStore(SYNC, { keyPath: "id" });
		}
	},
});
export function writeData(st: string, data: unknown) {
	console.log(data);
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.put(data);
		return tx.done;
	});
}
export function readAllData(st: string) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readonly");
		const store = tx.objectStore(st);
		return store.getAll();
	});
}

export function clearAllData(st: string) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.clear();
		return tx.done;
	});
}

export function deleteItem(st: string, id: string) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.delete(id);
		return tx.done;
	});
}
