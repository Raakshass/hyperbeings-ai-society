const AIBeing = require('./AIBeing');
const SocietyManager = require('./SocietyManager');

async function testSociety() {
  console.log("🌟 Testing AI Society System\n");
  
  const society = new SocietyManager();
  
  // Create diverse AI beings
  const alice = new AIBeing("Alice", { creativity: 85, socialness: 90, ambition: 80 });
  const bob = new AIBeing("Bob", { riskTaking: 90, ambition: 85, empathy: 60 });
  const charlie = new AIBeing("Charlie", { creativity: 95, empathy: 85, socialness: 70 });
  const diana = new AIBeing("Diana", { ambition: 95, riskTaking: 30, socialness: 80 });
  
  // Add beings to society
  society.addBeing(alice);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  society.addBeing(bob);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  society.addBeing(charlie);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  society.addBeing(diana);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run 3 society simulation steps
  for (let i = 1; i <= 3; i++) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🔄 SOCIETY SIMULATION STEP ${i}`);
    console.log(`${'='.repeat(50)}`);
    
    await society.simulateSocietyStep();
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Final overview
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📋 FINAL SOCIETY OVERVIEW`);
  console.log(`${'='.repeat(50)}`);
  
  const overview = society.getSocietyOverview();
  console.log("\n🏆 Society Overview:", overview);
  
  console.log("\n👥 All Beings Final Status:");
  const allStatus = society.getAllBeingsStatus();
  allStatus.forEach(status => {
    console.log(`\n${status.name}:`, status);
  });
}

testSociety().catch(console.error);
