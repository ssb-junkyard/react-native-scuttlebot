const path = require("path");
const execSync = require("child_process").execSync;

const projectPath = path.join(__dirname, "../../");
const noderifyBinPath = path.join(__dirname, "./node_modules/.bin/noderify");
const rnnodeBinPath = path.join(
  __dirname,
  "./node_modules/.bin/react-native-node"
);
const replacements =
  "--replace.chloride=sodium-browserify-tweetnacl " +
  "--replace.sodium-chloride=sodium-browserify-tweetnacl " +
  "--replace.node-extend=xtend " +
  "--replace.leveldown=memdown";
const ssbPeerPath = path.join(__dirname, "./ssb-peer.js");
const bundleFilePath = path.join(__dirname, "./bundle.js");
const bundleDirPath = path.join(__dirname, "../../background-bundled");

execSync(
  `${noderifyBinPath} ${replacements} ${ssbPeerPath} > ${bundleFilePath}`,
  { cwd: __dirname }
);
execSync(`mkdir -p ${bundleDirPath}`);
execSync(`cp ${bundleFilePath} ${bundleDirPath}/index.js`);
execSync(`${rnnodeBinPath} insert ${bundleDirPath}`, { cwd: projectPath });
execSync(`rm -rf ${bundleDirPath}`);
