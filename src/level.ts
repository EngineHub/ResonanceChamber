import {Level} from "level";

export function createLevelDb<T>(location: string): Level<string, T> {
    return new Level(location, {
        valueEncoding: "json",
    });
}

export function getOrDefault<V>(db: Level<string, V>, key: string): Promise<V | undefined>
export function getOrDefault<D, V>(db: Level<string, V>, key: string, def: D): Promise<V | D>

export async function getOrDefault(db: Level<string, unknown>, key: string, def?: unknown): Promise<unknown> {
    try {
        return await db.get(key);
    } catch (e) {
        if ((e as {type?: string}).type === "NotFoundError") {
            return def;
        }
        throw e;
    }
}
