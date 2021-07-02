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
    .option("host", {
            alias: "h",
            description: "The host to bind the HTTP server to",
            requiresArg: true,
            string: true,
            default: "localhost"
    })
    .version(false)
    .parseSync();

startHttpServer(args.port, args.host);
startPollManager();
