import {LevelDb} from "level";
import {Poller} from "./polling/Poller";
import {Resonance} from "./resonance/Resonance";
import {Muffler} from "./muffler/Muffler";

export interface Secrets {
    db: LevelDb<string>,
    resonances: Resonance[],
    mufflers: Muffler[],
    pollers: Poller[],
}
