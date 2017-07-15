#!/usr/bin/env node
const path = require("path");
const execSync = require("child_process").execSync;

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .example("$0 insert")
  .command({
    command: "insert",
    aliases: ["i"],
    desc:
      "Bundle and insert Scuttlebot as a background service into the " +
      "mobile app project"
  })
  .demandCommand(1, "ERROR: You need to run a command, e.g. insert")
  .help().argv;

if (argv._[0] === "insert") {
  const noderifyBinPath = path.join(
    process.cwd(),
    "./node_modules/.bin/noderify"
  );
  const rnnodeBinPath = path.join(
    process.cwd(),
    "./node_modules/react-native-scuttlebot/node_modules/.bin/react-native-node"
  );
  const replacements =
    "--replace.chloride=sodium-browserify-tweetnacl " +
    "--replace.sodium-chloride=sodium-browserify-tweetnacl " +
    "--replace.node-extend=xtend " +
    "--replace.leveldown=memdown";
  const ssbPeerPath = path.join(__dirname, "./ssb-peer.js");
  const bundleFilePath = path.join(__dirname, "./bundle.js");
  const bundleDirPath = path.join(process.cwd(), "./background-bundled");

  execSync(
    `${noderifyBinPath} ${replacements} ${ssbPeerPath} > ${bundleFilePath}`,
    { cwd: __dirname }
  );
  execSync(`mkdir -p ${bundleDirPath}`);
  execSync(`cp ${bundleFilePath} ${bundleDirPath}/index.js`);
  execSync(`${rnnodeBinPath} insert ${bundleDirPath}`);
  execSync(`rm -rf ${bundleDirPath}`);
}
