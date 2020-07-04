import {LevelDb} from "level";
import {Poller} from "./polling/Poller";
import {Resonance} from "./resonance/Resonance";

export interface Secrets {
    db: LevelDb<string>
    resonances: Resonance[]
    pollers: Poller[]
}
