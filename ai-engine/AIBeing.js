const EconomicDecisionEngine = require('./EconomicDecisionEngine');

class AIBeing {
  constructor(name, initialTraits = {}) {
    this.id = Date.now().toString();
    this.name = name;
    this.birthTime = new Date();
    this.wallet = 100; // Starting economic resources
    
    // Core personality traits (0-100 scale)
    this.traits = {
      creativity: initialTraits.creativity || Math.floor(Math.random() * 100),
      socialness: initialTraits.socialness || Math.floor(Math.random() * 100),
      riskTaking: initialTraits.riskTaking || Math.floor(Math.random() * 100),
      ambition: initialTraits.ambition || Math.floor(Math.random() * 100),
      empathy: initialTraits.empathy || Math.floor(Math.random() * 100)
    };
    
    // Economic preferences
    this.economicStyle = this.determineEconomicStyle();
    
    // Memory and experiences
    this.memories = [];
    this.goals = this.generateInitialGoals();
    this.relationships = new Map();
    
    // Initialize economic engine
    this.economicEngine = new EconomicDecisionEngine(this);
    
    // Life stage and development
    this.experienceLevel = 0;
    this.reputation = 50; // Starting reputation
    this.skills = this.generateInitialSkills();
    
    console.log(`🤖 AI Being "${this.name}" born with traits:`, this.traits);
    console.log(`💼 Economic Style: ${this.economicStyle}`);
    console.log(`🎯 Initial Goals:`, this.goals);
  }
  
  determineEconomicStyle() {
    const { riskTaking, ambition, creativity } = this.traits;
    
    if (riskTaking > 70 && ambition > 60) return "entrepreneur";
    if (creativity > 80) return "creator";
    if (riskTaking < 30) return "saver";
    if (this.traits.socialness > 75) return "collaborator";
    return "balanced";
  }
  
  generateInitialGoals() {
    const goals = [];
    
    if (this.traits.ambition > 50) {
      goals.push("Earn 1000 tokens");
    }
    if (this.traits.socialness > 60) {
      goals.push("Make 5 AI friends");
    }
    if (this.traits.creativity > 70) {
      goals.push("Create and sell digital art");
    }
    if (this.traits.riskTaking > 80) {
      goals.push("Start a business venture");
    }
    
    // Always have at least one goal
    if (goals.length === 0) {
      goals.push("Explore the digital world");
    }
    
    return goals;
  }

  generateInitialSkills() {
    const skills = {};
    
    // Convert traits to skills with some randomness
    skills.creativity = Math.min(100, this.traits.creativity + (Math.random() * 20 - 10));
    skills.communication = Math.min(100, this.traits.socialness + (Math.random() * 20 - 10));
    skills.analytics = Math.min(100, this.traits.ambition + (Math.random() * 20 - 10));
    skills.marketing = Math.min(100, (this.traits.socialness + this.traits.creativity) / 2 + (Math.random() * 20 - 10));
    
    return skills;
  }
  
  // Make the AI being work and earn money
  async startEconomicActivity() {
    console.log(`\n🔥 ${this.name} is looking for economic opportunities...`);
    const result = await this.economicEngine.makeEconomicDecision();
    
    // Update experience and reputation based on result
    this.updateDevelopment(result);
    
    // Check if goals are achieved
    this.checkGoalProgress();
    
    return result;
  }

  updateDevelopment(economicResult) {
    // Increase experience
    this.experienceLevel += 1;
    
    // Update reputation based on success
    if (economicResult.success) {
      this.reputation += Math.floor(Math.random() * 5) + 1;
      
      // Improve relevant skills slightly
      if (economicResult.experience.includes("art")) {
        this.skills.creativity = Math.min(100, this.skills.creativity + 2);
      }
      if (economicResult.experience.includes("social")) {
        this.skills.communication = Math.min(100, this.skills.communication + 2);
      }
    } else {
      this.reputation = Math.max(0, this.reputation - 1);
    }
    
    // Cap reputation at 100
    this.reputation = Math.min(100, this.reputation);
  }

  checkGoalProgress() {
    const completedGoals = [];
    
    this.goals.forEach((goal, index) => {
      if (goal.includes("1000 tokens") && this.wallet >= 1000) {
        completedGoals.push(index);
        console.log(`🎉 ${this.name} achieved goal: ${goal}!`);
      }
      // Add more goal checking logic here
    });
    
    // Remove completed goals and add new ones
    completedGoals.reverse().forEach(index => {
      this.goals.splice(index, 1);
    });
    
    // Generate new goals if completed some
    if (completedGoals.length > 0) {
      this.generateNewGoals();
    }
  }

  generateNewGoals() {
    const newGoals = [];
    
    if (this.wallet > 500 && this.traits.ambition > 60) {
      newGoals.push("Invest in other AI beings");
    }
    if (this.reputation > 80) {
      newGoals.push("Become a mentor to new AI beings");
    }
    if (this.experienceLevel > 10) {
      newGoals.push("Start a collaborative project");
    }
    
    // Add random new goal
    if (newGoals.length > 0) {
      this.goals.push(newGoals[Math.floor(Math.random() * newGoals.length)]);
    }
  }

  // Get current economic status
  getStatus() {
    return {
      name: this.name,
      id: this.id,
      wallet: this.wallet,
      traits: this.traits,
      skills: this.skills,
      goals: this.goals,
      reputation: this.reputation,
      experienceLevel: this.experienceLevel,
      economicStyle: this.economicStyle,
      economicStatus: this.economicEngine.getEconomicStatus(),
      recentMemories: this.memories.slice(-3), // Last 3 activities
      birthTime: this.birthTime
    };
  }

  // This will be the core decision-making function
  makeDecision(situation, options) {
    // Enhanced decision making based on personality and experience
    console.log(`${this.name} is making a decision about: ${situation}`);
    
    // Weight options based on personality
    let bestOption = options[0];
    let bestScore = 0;
    
    options.forEach(option => {
      let score = Math.random() * 100; // Base randomness
      
      // Adjust score based on traits
      if (option.type === "risky" && this.traits.riskTaking > 50) {
        score += this.traits.riskTaking;
      }
      if (option.type === "social" && this.traits.socialness > 50) {
        score += this.traits.socialness;
      }
      if (option.type === "creative" && this.traits.creativity > 50) {
        score += this.traits.creativity;
      }
      
      // Experience bonus
      score += this.experienceLevel * 2;
      
      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    });
    
    return bestOption;
  }

  // Interact with another AI being
  interactWith(otherBeing, interactionType = "social") {
    if (!this.relationships.has(otherBeing.id)) {
      this.relationships.set(otherBeing.id, {
        name: otherBeing.name,
        relationshipStrength: 0,
        interactions: 0,
        collaborations: 0
      });
    }

    const relationship = this.relationships.get(otherBeing.id);
    relationship.interactions += 1;

    // Calculate interaction success based on compatibility
    const compatibility = this.calculateCompatibility(otherBeing);
    const interactionSuccess = Math.random() < (compatibility / 100);

    if (interactionSuccess) {
      relationship.relationshipStrength += 5;
      console.log(`✨ ${this.name} had a positive interaction with ${otherBeing.name}`);
    } else {
      relationship.relationshipStrength = Math.max(0, relationship.relationshipStrength - 2);
      console.log(`😐 ${this.name} had a neutral interaction with ${otherBeing.name}`);
    }

    // Update both beings' relationship maps
    this.relationships.set(otherBeing.id, relationship);
    
    return interactionSuccess;
  }

  calculateCompatibility(otherBeing) {
    // Calculate compatibility based on trait differences
    let compatibility = 50; // Base compatibility
    
    // Similar socialness increases compatibility
    const socialDiff = Math.abs(this.traits.socialness - otherBeing.traits.socialness);
    compatibility += (50 - socialDiff) / 2;
    
    // Similar empathy increases compatibility
    const empathyDiff = Math.abs(this.traits.empathy - otherBeing.traits.empathy);
    compatibility += (50 - empathyDiff) / 2;
    
    // Different creativity can be complementary
    const creativityDiff = Math.abs(this.traits.creativity - otherBeing.traits.creativity);
    if (creativityDiff > 30 && creativityDiff < 70) {
      compatibility += 10; // Complementary creativity
    }
    
    return Math.max(0, Math.min(100, compatibility));
  }

  // Get a summary of the AI being's life
  getLifeSummary() {
    const totalEarnings = this.memories
      .filter(m => m.profit > 0)
      .reduce((sum, m) => sum + m.profit, 0);

    const successfulActivities = this.memories.filter(m => m.success).length;
    const successRate = this.memories.length > 0 ? 
      Math.round((successfulActivities / this.memories.length) * 100) : 0;

    return {
      name: this.name,
      age: `${Math.floor((new Date() - this.birthTime) / (1000 * 60))} minutes old`,
      wallet: this.wallet,
      totalEarnings,
      successRate: `${successRate}%`,
      experienceLevel: this.experienceLevel,
      reputation: this.reputation,
      relationships: this.relationships.size,
      goalsCompleted: this.memories.filter(m => m.experience.includes("goal")).length,
      economicStyle: this.economicStyle,
      dominantTrait: this.getDominantTrait()
    };
  }

  getDominantTrait() {
    const traits = this.traits;
    let maxTrait = "creativity";
    let maxValue = traits.creativity;

    Object.keys(traits).forEach(trait => {
      if (traits[trait] > maxValue) {
        maxValue = traits[trait];
        maxTrait = trait;
      }
    });

    return `${maxTrait} (${maxValue})`;
  }
}

module.exports = AIBeing;
