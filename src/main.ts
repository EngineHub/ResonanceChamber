#!/usr/bin/env node
import yargs from "yargs";
import {startHttpServer} from "./httpServer";

const args = yargs
    .option("port", {
        alias: "p",
        description: "The port to bind the HTTP server to",
        requiresArg: true,
        number: true,
        default: 8593
    })
    .version(false)
    .parse();


async function main(): Promise<void> {
    startHttpServer(args.port);
}

main().catch(err => console.error(err));
