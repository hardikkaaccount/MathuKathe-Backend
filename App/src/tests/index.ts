import { testRegistration } from './testRegistration';
import { testLogin } from './testLogin';
import { testSummary } from './testSummary';
import { testMatthu } from './testMatthu';
import { testTwin } from './testTwin';
import { testArena } from './testArena';
import { testGroups } from './testGroups';

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
            await testRegistration();
            break;
        case 'login':
            console.log('Running Login Test...');
            await testLogin();
            break;
        case 'summary':
            console.log('Running Summary Test...');
            await testSummary();
            break;
        case 'matthu':
            console.log('Running Matthu Test...');
            await testMatthu();
            break;
        case 'twin':
            console.log('Running Twin Test...');
            await testTwin();
            break;
        case 'arena':
            console.log('Running Arena Test...');
            await testArena();
            break;
        case 'groups':
            console.log('Running Groups Test...');
            await testGroups();
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