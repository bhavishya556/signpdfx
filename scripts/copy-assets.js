'use strict';

const { copyFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const dest = join(__dirname, '..', 'dist', 'lib', 'helpers');
mkdirSync(dest, { recursive: true });
copyFileSync(
    join(__dirname, '..', 'lib', 'helpers', 'rootCAs.json'),
    join(dest, 'rootCAs.json'),
);
