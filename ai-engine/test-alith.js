const AlithAgent = require('./AlithAgent');

const alith = new AlithAgent();

console.log('\n=== Testing Alith AI Agent ===\n');

// Test different types of inputs
const testInputs = [
  'Hello Alith',
  'Create a creative AI being',
  'Analyze current market trends',
  'How can I optimize my earnings?',
  'Suggest collaboration opportunities'
];

testInputs.forEach(input => {
  console.log(`USER: ${input}`);
  const response = alith.processNaturalLanguage(input);
  console.log(`ALITH: ${response.content}\n`);
  console.log('---\n');
});
