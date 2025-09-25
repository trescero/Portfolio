/*
 * @title Build
 * @description A task to compile production code.
 */

// Dependencies
import { series, parallel } from 'gulp';

// Tasks
import { clean } from './clean.js';
import { styles } from './styles.js';
import { scripts } from './scripts.js';
import { templates } from './templates.js';
import { assets } from './assets.js';

export const build = series(
  clean,
  parallel(styles, scripts, templates, assets)
);
