import level, {LevelDb} from "level";

export function createLevelDb(location: string): LevelDb<string> {
    return level(location, {
        valueEncoding: "json",
    });
}

export function getOrDefault<V>(db: LevelDb<string, V>, key: string): Promise<V | undefined>
export function getOrDefault<D, V>(db: LevelDb<string, V>, key: string, def: D): Promise<V | D>

export async function getOrDefault(db: LevelDb<string>, key: string, def?: unknown): Promise<unknown> {
    try {
        return await db.get(key);
    } catch (e) {
        if (e.type === "NotFoundError") {
            return def;
        }
        throw e;
    }
}
