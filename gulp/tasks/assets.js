/*
 * @title Assets
 * @description A task to copy assets.
 */

// Dependencies
import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';
import errorHandler from '../util/errorHandler.js';

// Config
import { paths } from '../config.js';

// Task
export function assets() {
  return src(paths.assets.src, { encoding: false })
    .pipe(plumber({ errorHandler }))
    .pipe(newer(paths.assets.dest))
    .pipe(dest(paths.assets.dest));
}
