import {Request} from "koa";
import {OrganPipeData, OrganPipe, OrganPipeResult} from "./OrganPipe";
import {getEvent} from "../util/github";

export interface GitHubOrganPipeData extends OrganPipeData {
    readonly publicHookTarget: string;
    readonly hiddenHookTarget: string;
}

export class GitHubOrganPipe extends OrganPipe<GitHubOrganPipeData> {
    override async determinePipe(req: Request): Promise<OrganPipeResult | "ignored"> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = req.body as any;
        if (!("repository" in body)) {
            return "ignored";
        }
        const repository: Repository = body.repository;
        if (repository.full_name === "EngineHub/CommandHelper") {
            return "ignored";
        }
        const hidden = repository.private || (repository.visibility && repository.visibility !== "public");
        return {
            config: {
                data: body,
                headers: {
                    "X-GitHub-Event": getEvent(req),
                },
            },
            target: hidden ? this.data.hiddenHookTarget : this.data.publicHookTarget
        };
    }
}

interface Repository {
    full_name: string,
    private: boolean,
    // This property isn't fully here yet, but I'm supporting it for when it is.
    visibility?: "public" | "private" | "internal",
}
