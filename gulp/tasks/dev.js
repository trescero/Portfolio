/*
 * @title Dev
 * @description A task to generate a development environment,
 * start the server and watch for changes.
 */

// Dependencies
import { series } from 'gulp';

// Tasks
import { build } from './build.js';
import { watch } from './watch.js';

export const dev = series(build, watch);
