/**
 * @format
 */
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto'; // 引入 url polyfill
import 'stream-http'; // 引入 stream polyfill
import 'https-browserify'; // 引入 https polyfill
import 'eventemitter3'; // 引入 eventemitter polyfill
import 'url-search-params-polyfill'; // 引入 url-search-params polyfill
import util from 'util';
import { Buffer } from 'buffer';
import assert from 'assert';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

global.assert = assert;
global.util = util;
global.Buffer = Buffer;

AppRegistry.registerComponent(appName, () => App);
