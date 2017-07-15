# Scuttlebot for React Native apps

## install

`npm install --save react-native-scuttlebot`

## usage

In your React Native application (e.g. index.android.js):

```js
import Scuttlebot from 'react-native-scuttlebot';

// ...

// When you're ready, this will spawn a node.js process in the background:
Scuttlebot.start();
```

You must also "install" the background process into the native application. This step is **important** and is enough to do once in the terminal:

```
react-native-scuttlebot insert
```

