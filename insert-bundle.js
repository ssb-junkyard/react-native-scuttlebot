const path = require("path");
const execSync = require("child_process").execSync;
const fs = require("fs");

// Define constants
const innerBinsPath = path.join(__dirname, "node_modules/.bin/");
const outerBinsPath = path.join(__dirname, "../.bin/");
let noderify = path.join(innerBinsPath, "noderify");
if (!fs.existsSync(noderify)) {
  noderify = path.join(outerBinsPath, "noderify");
}
let rnnode = path.join(innerBinsPath, "react-native-node");
if (!fs.existsSync(rnnode)) {
  rnnode = path.join(outerBinsPath, "react-native-node");
}
const projectPath = path.join(__dirname, "../../");
const orig = path.join(__dirname, "rnnodeapp");
const dest = path.join(projectPath, "rnnodeapp");

// Set up destination directory
execSync(`rm -rf ${dest}`);
execSync(`mkdir -p ${dest}`);
execSync(`cp -r ${orig} ${dest}/../`);

// Install dependencies there
execSync(`cd ${dest}`);
execSync(`npm install`);
execSync(`cd ..`);

// Minify the bundle
const replacements =
  "--replace.chloride=sodium-browserify-tweetnacl " +
  "--replace.sodium-chloride=sodium-browserify-tweetnacl " +
  "--replace.node-extend=xtend " +
  "--replace.leveldown=leveldown-android-prebuilt " +
  "";
execSync(
  `${noderify} ${replacements} ${orig}/index.js > ${dest}/_index.js`,
  { cwd: __dirname }
);
execSync(`rm ${dest}/index.js`);
execSync(`mv ${dest}/_index.js ${dest}/index.js`);

// Setup native libraries
const leveldownPrebuiltPath = path.join(
  dest,
  "node_modules/leveldown-android-prebuilt/compiled"
);
execSync(`cp -R ${leveldownPrebuiltPath} ${dest}/`);

// Pre-insert clean up
execSync(`rm -rf ${dest}/node_modules`);

// Insert bundle into the project
execSync(`${rnnode} insert ${dest}`, { cwd: projectPath });

// Post-insert clean up
//execSync(`rm -rf ${dest}`);
