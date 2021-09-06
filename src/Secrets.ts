import {LevelDb} from "level";
import {Poller} from "./polling/Poller";
import {Resonance} from "./resonance/Resonance";
import {OrganPipe} from "./organpipe/OrganPipe";

export interface Secrets {
    db: LevelDb<string>,
    resonances: Resonance[],
    organPipes: OrganPipe[],
    pollers: Poller[],
}
