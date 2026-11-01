const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const reportPath = path.resolve('cypress/reports/index.html');
const isWindows = process.platform === 'win32';
const npmCliPath = process.env.npm_execpath;

if (!npmCliPath) {
    console.error('Run this script through npm: npm run test:open-report');
    process.exit(1);
}

const testProcess = spawn(process.execPath, [npmCliPath, 'test'], {
    stdio: 'inherit',
});

testProcess.on('error', (error) => {
    console.error(`Could not start the Cypress test command: ${error.message}`);
    process.exitCode = 1;
});

testProcess.on('close', (testExitCode) => {
    if (!existsSync(reportPath)) {
        console.error(`Cypress report was not generated at ${reportPath}`);
        process.exitCode = testExitCode || 1;
        return;
    }

    const openCommand = isWindows
        ? 'explorer.exe'
        : process.platform === 'darwin'
            ? 'open'
            : 'xdg-open';
    const openProcess = spawn(openCommand, [reportPath], {
        detached: true,
        stdio: 'ignore',
    });

    openProcess.on('error', (error) => {
        console.error(`Could not open the Cypress report: ${error.message}`);
        process.exitCode = testExitCode || 1;
    });
    openProcess.unref();
    process.exitCode = testExitCode || 0;
});
