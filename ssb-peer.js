var fs = require("fs");
var path = require("path");
var ssbKeys = require("ssb-keys");
var serveBlobs = require("./serve-blobs");

var config = require("ssb-config/inject")();

const filesPath = path.join(__dirname, "/files/");

if (!fs.existsSync(path.join(filesPath, ".ssb"))) {
  fs.mkdirSync(path.join(filesPath, ".ssb"));
}
const secretPath = path.join(filesPath, ".ssb/secret");
const keys = (() => {
  if (fs.existsSync(secretPath)) {
    const fileContents = fs.readFileSync(secretPath, "ascii");
    return JSON.parse(fileContents);
  } else {
    const generatedKeys = ssbKeys.generate();
    const fileContents = JSON.stringify(generatedKeys, null, 2);
    fs.writeFileSync(secretPath, fileContents, "ascii");
    return generatedKeys;
  }
})();

var manifest = {
  auth: "async",
  address: "sync",
  manifest: "sync",
  get: "async",
  createFeedStream: "source",
  createLogStream: "source",
  messagesByType: "source",
  createHistoryStream: "source",
  createUserStream: "source",
  links: "source",
  relatedMessages: "async",
  add: "async",
  publish: "async",
  getAddress: "sync",
  getLatest: "async",
  latest: "source",
  latestSequence: "async",
  whoami: "sync",
  usage: "sync",
  plugins: {
    install: "source",
    uninstall: "source",
    enable: "async",
    disable: "async"
  },
  gossip: {
    peers: "sync",
    add: "sync",
    remove: "sync",
    ping: "duplex",
    connect: "async",
    changes: "source",
    reconnect: "sync"
  },
  // friends: {
  //   all: "async",
  //   hops: "async",
  //   createFriendStream: "source",
  //   get: "sync"
  // },
  replicate: {
    changes: "source",
    upto: "source"
  },
  blobs: {
    get: "source",
    getSlice: "source",
    add: "sink",
    rm: "async",
    ls: "source",
    has: "async",
    size: "async",
    meta: "async",
    want: "async",
    push: "async",
    changes: "source",
    createWants: "source"
  },
  invite: {
    create: "async",
    accept: "async",
    use: "async"
  },
  block: {
    isBlocked: "sync"
  },
  private: {
    publish: "async",
    unbox: "sync"
  }
};

var createSbot = require("scuttlebot/index")
  .use(require("scuttlebot/plugins/plugins"))
  .use(require("scuttlebot/plugins/master"))
  .use(require("scuttlebot/plugins/gossip"))
  .use(require("scuttlebot/plugins/replicate"))
  .use(require("ssb-friends"))
  .use(require("ssb-blobs"))
  .use(require("ssb-backlinks"))
  .use(require("ssb-private"))
  .use(require("ssb-about"))
  .use(require("ssb-contacts"))
  .use(require("ssb-query"))
  .use(require("scuttlebot/plugins/invite"))
  .use(require("scuttlebot/plugins/block"))
  .use(require("scuttlebot/plugins/local"))
  .use(require("scuttlebot/plugins/logging"));

// add third-party plugins
require("scuttlebot/plugins/plugins").loadUserPlugins(createSbot, config);

// start server
config.keys = keys;
config.path = path.join(__dirname, "/files/.ssb");
var sbot = createSbot(config);
serveBlobs(sbot);
