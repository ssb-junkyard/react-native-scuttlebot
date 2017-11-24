#!/bin/sh
INNER_BINS="$(pwd)/node_modules/.bin"
OUTER_BINS="$(pwd)/../.bin"
NODERIFY="$INNER_BINS/noderify"
if [ ! -e "$NODERIFY" ]; then
  NODERIFY="$OUTER_BINS/noderify"
fi
RNNODE="$INNER_BINS/react-native-node"
if [ ! -e "$RNNODE" ]; then
  RNNODE="$OUTER_BINS/react-native-node"
fi
PATCH_SCUTTLEBOT_BIN="$(pwd)/patch-scuttlebot.js"
PROJECT="$(pwd)/../.."
ORIG="$(pwd)/rnnodeapp"
DEST="$PROJECT/rnnodeapp"

# Set up destination
rm -rf "$DEST";
mkdir -p "$DEST";
cp -r "$ORIG" "$DEST/../";

# Install dependencies there
cd "$DEST";
yarn;

# Setup native libraries and fix other libraries
PREBUILT_PATH_1="$DEST/node_modules/leveldown-android-prebuilt/compiled"
cp -R "$PREBUILT_PATH_1" "$DEST/";
node "$PATCH_SCUTTLEBOT_BIN" "$DEST";

# Minify the bundle
cd "$DEST";
$NODERIFY \
   --replace.chloride=sodium-browserify-tweetnacl \
   --replace.sodium-chloride=sodium-browserify-tweetnacl \
   --replace.node-extend=xtend \
   --replace.leveldown=leveldown-android-prebuilt \
   "$DEST/index.js" > "$DEST/_index.js";
rm "$DEST/index.js";
mv "$DEST/_index.js" "$DEST/index.js";

# Pre-insert clean up
rm -rf "$DEST/node_modules";

# Insert bundle into the project
cd $PROJECT;
$RNNODE insert "$DEST";

# Post-insert clean up
#`rm -rf ${dest}`
