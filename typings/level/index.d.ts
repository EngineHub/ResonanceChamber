import EncodingDown from "encoding-down";
import {LevelDb} from "level";
import {CodecOptions} from "level-codec";
import {LevelUp} from "levelup";

declare function level<K, V>(location: string, options?: CodecOptions): LevelDb<K, V>;

declare namespace level {

    type LevelDb<K = unknown, V = unknown> = LevelUp<EncodingDown<K, V>>;

}

export = level;
