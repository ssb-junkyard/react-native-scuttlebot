const path = require("path");
const execSync = require("child_process").execSync;
const fs = require("fs");

const innerBinsPath = path.join(__dirname, "node_modules/.bin/");
const outerBinsPath = path.join(__dirname, "../.bin/");
let noderifyBinPath = path.join(innerBinsPath, "noderify");
if (!fs.existsSync(noderifyBinPath)) {
  noderifyBinPath = path.join(outerBinsPath, "noderify");
}
let rnnodeBinPath = path.join(innerBinsPath, "react-native-node");
if (!fs.existsSync(rnnodeBinPath)) {
  rnnodeBinPath = path.join(outerBinsPath, "react-native-node");
}
const projectPath = path.join(__dirname, "../../");
const replacements =
  "--replace.chloride=sodium-browserify-tweetnacl " +
  "--replace.sodium-chloride=sodium-browserify-tweetnacl " +
  "--replace.node-extend=xtend " +
  "--replace.leveldown=@staltz/jsondown";
const ssbPeerPath = path.join(__dirname, "ssb-peer.js");
const bundleFilePath = path.join(__dirname, "bundle.js");
const bundleDirPath = path.join(projectPath, "background-bundled");

execSync(
  `${noderifyBinPath} ${replacements} ${ssbPeerPath} > ${bundleFilePath}`,
  { cwd: __dirname }
);
execSync(`mkdir -p ${bundleDirPath}`);
execSync(`cp ${bundleFilePath} ${bundleDirPath}/index.js`);
execSync(`${rnnodeBinPath} insert ${bundleDirPath}`, { cwd: projectPath });
execSync(`rm -rf ${bundleDirPath}`);
