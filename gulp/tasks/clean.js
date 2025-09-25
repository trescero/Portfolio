/*
 * @title Clean
 * @description A task to delete the output directory.
 */

// Dependencies
import { deleteAsync } from 'del';

// Config
import { paths } from '../config.js';

// Task
export async function clean() {
  await deleteAsync([paths.dest]);
}
