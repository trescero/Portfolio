/*
 * @title Server
 * @description A task to initialise a local server.
 */

import os from 'os';

// Dependencies
import browserSync from 'browser-sync';

// Config
import { paths, browsers } from '../config.js';

export function serve(cb) {
  browserSync.init({
    server: {
      baseDir: [paths.dest],
    },
    ghostMode: false,
    notify: false,
    browser: browsers,
  });
  cb();
}

export function reload(cb) {
  browserSync.reload();
  cb();
}
