var fs = require("fs");
var path = require("path");

var scuttlebotPathHere = path.join(__dirname, "./node_modules/scuttlebot");
var scuttlebotPathAbove = path.join(__dirname, "../scuttlebot");

var existsHere = fs.existsSync(scuttlebotPathHere);
var existsAbove = fs.existsSync(scuttlebotPathAbove);

if (existsHere) {
  patchApidocsFile(scuttlebotPathHere);
}
if (existsAbove) {
  patchApidocsFile(scuttlebotPathAbove);
}
if (!existsHere && !existsAbove) {
  throw new Error("Cannot find file scuttlebot/lib/apidocs.js to patch");
}

function patchApidocsFile(scuttlebotPath) {
  var apidocsPath = path.join(scuttlebotPath, "./lib/apidocs.js");
  var prevContent = fs.readFileSync(apidocsPath, "utf-8");

  var dirname = path.dirname(apidocsPath);

  function readMarkdownCompileTime(relPath) {
    return fs
      .readFileSync(path.join(dirname, relPath), "utf-8")
      .replace(/\`\`\`/g, "")
      .replace(/\`/g, '"');
  }

  var nextContent = prevContent
    .replace(
      `fs.readFileSync(path.join(__dirname, '../api.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../api.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/block.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/block.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/friends.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/friends.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/gossip.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/gossip.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/invite.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/invite.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/plugins.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/plugins.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/private.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/private.md")}\``
    )
    .replace(
      `fs.readFileSync(path.join(__dirname, '../plugins/replicate.md'), 'utf-8')`,
      `\`${readMarkdownCompileTime("../plugins/replicate.md")}\``
    );

  fs.writeFileSync(apidocsPath, nextContent, "utf-8");
}
