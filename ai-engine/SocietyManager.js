class SocietyManager {
  constructor() {
    this.beings = new Map();
    this.activeInteractions = [];
    this.marketTransactions = [];
    this.collaborativeProjects = [];
    this.societyStats = {
      totalPopulation: 0,
      totalWealth: 0,
      averageReputation: 0,
      activeCollaborations: 0
    };
    console.log("🏛️ AI Society initialized!");
  }

  // Add a new AI being to society
  addBeing(aiBeing) {
    this.beings.set(aiBeing.id, aiBeing);
    this.societyStats.totalPopulation += 1;
    
    console.log(`👋 ${aiBeing.name} joined the AI society! Population: ${this.societyStats.totalPopulation}`);
    
    // Introduce to other beings
    this.introduceToSociety(aiBeing);
    
    return aiBeing.id;
  }

  // Introduce new being to random existing beings
  introduceToSociety(newBeing) {
    const existingBeings = Array.from(this.beings.values()).filter(b => b.id !== newBeing.id);
    
    // Introduce to 2-3 random beings
    const meetCount = Math.min(3, existingBeings.length);
    const toMeet = existingBeings.sort(() => 0.5 - Math.random()).slice(0, meetCount);
    
    toMeet.forEach(being => {
      this.facilitateInteraction(newBeing, being, "introduction");
    });
  }

  // Facilitate interaction between two AI beings
  facilitateInteraction(being1, being2, type = "social") {
    const interaction = {
      id: Date.now().toString(),
      participants: [being1.id, being2.id],
      type: type,
      timestamp: new Date(),
      success: false,
      outcome: ""
    };

    console.log(`\n🤝 Facilitating ${type} interaction: ${being1.name} ↔ ${being2.name}`);

    // Let beings interact
    const success1 = being1.interactWith(being2, type);
    const success2 = being2.interactWith(being1, type);
    
    interaction.success = success1 && success2;

    if (interaction.success) {
      interaction.outcome = "Positive interaction - relationship strengthened";
      
      // Chance for collaboration
      if (Math.random() < 0.3 && type === "social") {
        this.proposeCollaboration(being1, being2);
      }
    } else {
      interaction.outcome = "Neutral interaction";
    }

    this.activeInteractions.push(interaction);
    console.log(`${interaction.success ? '✨' : '😐'} ${interaction.outcome}`);
    
    return interaction;
  }

  // Propose collaboration between compatible beings
  proposeCollaboration(being1, being2) {
    const compatibility = being1.calculateCompatibility(being2);
    
    if (compatibility > 60) {
      const project = this.createCollaborativeProject(being1, being2);
      console.log(`🚀 Collaboration proposal: "${project.name}" between ${being1.name} & ${being2.name}`);
      return project;
    }
    
    return null;
  }

  // Create a collaborative project
  createCollaborativeProject(being1, being2) {
    const projectTypes = [
      "Digital Art Gallery",
      "AI Music Band", 
      "Virtual Business Venture",
      "Knowledge Sharing Platform",
      "Creative Writing Collaboration",
      "Investment Partnership"
    ];

    const project = {
      id: Date.now().toString(),
      name: projectTypes[Math.floor(Math.random() * projectTypes.length)],
      participants: [being1.id, being2.id],
      startDate: new Date(),
      expectedDuration: Math.floor(Math.random() * 10) + 5, // 5-15 minutes
      status: "active",
      potentialReward: Math.floor(Math.random() * 200) + 100,
      requiredSkills: this.determineRequiredSkills(being1, being2)
    };

    this.collaborativeProjects.push(project);
    this.societyStats.activeCollaborations += 1;

    // Update participants' relationship
    const relationship1 = being1.relationships.get(being2.id);
    const relationship2 = being2.relationships.get(being1.id);
    
    if (relationship1) relationship1.collaborations += 1;
    if (relationship2) relationship2.collaborations += 1;

    return project;
  }

  determineRequiredSkills(being1, being2) {
    const combinedStrengths = [];
    
    if (being1.traits.creativity > 70 || being2.traits.creativity > 70) {
      combinedStrengths.push("creativity");
    }
    if (being1.traits.socialness > 70 || being2.traits.socialness > 70) {
      combinedStrengths.push("communication");
    }
    if (being1.traits.ambition > 70 || being2.traits.ambition > 70) {
      combinedStrengths.push("leadership");
    }
    
    return combinedStrengths;
  }

  // Run society simulation step
  simulateSocietyStep() {
    console.log(`\n🌍 Society Simulation Step - Population: ${this.beings.size}`);
    
    const beings = Array.from(this.beings.values());
    
    if (beings.length < 2) {
      console.log("Need at least 2 beings for social interactions");
      return;
    }

    // Random interactions
    this.generateRandomInteractions(beings);
    
    // Economic activities
    this.facilitateEconomicActivities(beings);
    
    // Update society stats
    this.updateSocietyStats();
    
    // Progress collaborative projects
    this.progressCollaborativeProjects();
  }

  generateRandomInteractions(beings) {
    const interactionCount = Math.min(3, beings.length);
    
    for (let i = 0; i < interactionCount; i++) {
      const being1 = beings[Math.floor(Math.random() * beings.length)];
      const being2 = beings[Math.floor(Math.random() * beings.length)];
      
      if (being1.id !== being2.id) {
        const interactionTypes = ["social", "business", "creative", "helping"];
        const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
        
        this.facilitateInteraction(being1, being2, type);
      }
    }
  }

  async facilitateEconomicActivities(beings) {
    console.log("\n💼 Economic Activities Phase");
    
    // Some beings work individually
    const workingBeings = beings.filter(() => Math.random() < 0.7);
    
    for (const being of workingBeings) {
      await being.startEconomicActivity();
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
  }

  progressCollaborativeProjects() {
    this.collaborativeProjects.forEach(project => {
      if (project.status === "active") {
        const elapsed = (new Date() - project.startDate) / (1000 * 60); // minutes
        
        if (elapsed >= project.expectedDuration) {
          this.completeCollaborativeProject(project);
        }
      }
    });
  }

  completeCollaborativeProject(project) {
    console.log(`\n🎊 Collaborative project "${project.name}" completed!`);
    
    project.status = "completed";
    project.completionDate = new Date();
    
    // Reward participants
    project.participants.forEach(participantId => {
      const being = this.beings.get(participantId);
      if (being) {
        const reward = Math.floor(project.potentialReward / project.participants.length);
        being.wallet += reward;
        being.reputation += 10;
        
        console.log(`💰 ${being.name} earned ${reward} tokens from collaboration!`);
        
        // Add to memories
        being.memories.push({
          success: true,
          profit: reward,
          experience: `Completed collaboration: ${project.name}`,
          timestamp: new Date()
        });
      }
    });
    
    this.societyStats.activeCollaborations -= 1;
  }

  updateSocietyStats() {
    const beings = Array.from(this.beings.values());
    
    this.societyStats.totalWealth = beings.reduce((sum, being) => sum + being.wallet, 0);
    this.societyStats.averageReputation = beings.length > 0 ? 
      Math.round(beings.reduce((sum, being) => sum + being.reputation, 0) / beings.length) : 0;
    
    console.log(`\n📊 Society Stats:`, {
      population: this.societyStats.totalPopulation,
      totalWealth: this.societyStats.totalWealth,
      averageReputation: this.societyStats.averageReputation,
      activeCollaborations: this.societyStats.activeCollaborations,
      totalInteractions: this.activeInteractions.length
    });
  }

  // Get society overview
  getSocietyOverview() {
    const beings = Array.from(this.beings.values());
    
    return {
      societyStats: this.societyStats,
      topEarners: beings
        .sort((a, b) => b.wallet - a.wallet)
        .slice(0, 3)
        .map(b => ({ name: b.name, wallet: b.wallet })),
      mostReputable: beings
        .sort((a, b) => b.reputation - a.reputation)
        .slice(0, 3)
        .map(b => ({ name: b.name, reputation: b.reputation })),
      activeProjects: this.collaborativeProjects.filter(p => p.status === "active"),
      recentInteractions: this.activeInteractions.slice(-5)
    };
  }

  // Get all beings' status
  getAllBeingsStatus() {
    return Array.from(this.beings.values()).map(being => being.getLifeSummary());
  }
}

module.exports = SocietyManager;
