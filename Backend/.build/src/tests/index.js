"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testRegistration_1 = require("./testRegistration");
const testLogin_1 = require("./testLogin");
const testSummary_1 = require("./testSummary");
const testMatthu_1 = require("./testMatthu");
const testTwin_1 = require("./testTwin");
const testArena_1 = require("./testArena");
const testGroups_1 = require("./testGroups");
const args = process.argv.slice(2);
const testName = args[0];
if (!testName) {
    console.error('Please provide a test name to run. Available tests: registration');
    process.exit(1);
}
async function run() {
    switch (testName) {
        case 'registration':
            console.log('Running Registration Test...');
            await (0, testRegistration_1.testRegistration)();
            break;
        case 'login':
            console.log('Running Login Test...');
            await (0, testLogin_1.testLogin)();
            break;
        case 'summary':
            console.log('Running Summary Test...');
            await (0, testSummary_1.testSummary)();
            break;
        case 'matthu':
            console.log('Running Matthu Test...');
            await (0, testMatthu_1.testMatthu)();
            break;
        case 'twin':
            console.log('Running Twin Test...');
            await (0, testTwin_1.testTwin)();
            break;
        case 'arena':
            console.log('Running Arena Test...');
            await (0, testArena_1.testArena)();
            break;
        case 'groups':
            console.log('Running Groups Test...');
            await (0, testGroups_1.testGroups)();
            break;
        default:
            console.error(`Unknown test: ${testName}`);
            process.exit(1);
    }
}
run().catch(err => {
    console.error('Test Runner Failed:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map