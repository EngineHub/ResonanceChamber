import {Request} from "koa";
import {Muffler} from "./Muffler";
import {AxiosRequestConfig} from "axios";
import {getEvent} from "../util/github";

export class GitHubMuffler extends Muffler {
    override async muffle(req: Request): Promise<AxiosRequestConfig | "ignored"> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = req.body as any;
        if (!("repository" in body)) {
            return "ignored";
        }
        const repository: Repository = body.repository;
        if (repository.full_name === "EngineHub/CommandHelper") {
            return "ignored";
        }
        if (repository.private || (repository.visibility && repository.visibility !== "public")) {
            return "ignored";
        }
        return {
            data: body,
            headers: {
                "X-GitHub-Event": getEvent(req),
            },
        };
    }
}

interface Repository {
    full_name: string,
    private: boolean,
    // This property isn't fully here yet, but I'm supporting it for when it is.
    visibility?: "public" | "private" | "internal",
}
