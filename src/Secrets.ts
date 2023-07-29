import {Level} from "level";
import {Poller} from "./polling/Poller";
import {Resonance} from "./resonance/Resonance";
import {OrganPipe} from "./organpipe/OrganPipe";
import {LatestVersions} from "./polling/MinecraftVersionManifestPoller";

export interface Secrets {
    db: Level<string, LatestVersions>,
    resonances: Resonance[],
    organPipes: OrganPipe[],
    pollers: Poller[],
}
