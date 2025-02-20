#!/usr/bin/env node

import { CliConfigOptions, CLI } from "@devhub/cli"

const isCi = process.env.IS_CI || false;

const options: CliConfigOptions = {
	commonConfigs: {} as any,
    debug: false,
    environment: 'development',
    isCi: !!isCi,
    mode: 'development',
    webpackConfigs: {
        development: {},
        production: {}
    }
} 

CLI(options);

