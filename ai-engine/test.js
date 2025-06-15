const AIBeing = require('./AIBeing');

// Create and test an AI being
async function testAIBeing() {
  const alice = new AIBeing("Alice", { creativity: 85, ambition: 90 });
  
  console.log("Initial Status:", alice.getStatus());
  
  // Make Alice work 3 times
  for (let i = 0; i < 3; i++) {
    await alice.startEconomicActivity();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  }
  
  console.log("Final Status:", alice.getStatus());
}

testAIBeing().catch(console.error);
