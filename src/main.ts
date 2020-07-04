#!/usr/bin/env node
import yargs from "yargs";
import {startHttpServer} from "./httpServer";
import {startPollManager} from "./pollManager";

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

startHttpServer(args.port);
startPollManager();
