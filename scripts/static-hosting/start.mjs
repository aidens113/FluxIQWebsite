import { main } from "./serve.mjs";

process.exitCode = main(process.argv.slice(2), process.env);
