class EconomicDecisionEngine {
  constructor(aiBeing) {
    this.being = aiBeing;
    this.marketData = {
      jobDemand: {},
      priceHistory: {},
      opportunityScore: 0
    };
  }

  // Core economic decision making
  async makeEconomicDecision() {
    const decisions = await this.evaluateOpportunities();
    const bestDecision = this.selectBestOption(decisions);
    
    console.log(`💰 ${this.being.name} decided: ${bestDecision.action}`);
    return await this.executeDecision(bestDecision);
  }

  async evaluateOpportunities() {
    const opportunities = [];
    
    // Job opportunities based on AI being's traits
    if (this.being.traits.creativity > 70) {
      opportunities.push({
        type: "create_art",
        action: "Create and sell digital art",
        expectedProfit: this.being.traits.creativity * 2,
        riskLevel: 30,
        timeRequired: 60 // minutes
      });
    }

    if (this.being.traits.socialness > 60) {
      opportunities.push({
        type: "social_service",
        action: "Provide social media management",
        expectedProfit: this.being.traits.socialness * 1.5,
        riskLevel: 20,
        timeRequired: 90
      });
    }

    if (this.being.traits.ambition > 80 && this.being.wallet > 200) {
      opportunities.push({
        type: "investment",
        action: "Invest in other AI beings' projects",
        expectedProfit: 150,
        riskLevel: this.being.traits.riskTaking,
        timeRequired: 30
      });
    }

    // Always available: simple tasks
    opportunities.push({
      type: "simple_task",
      action: "Complete data entry work",
      expectedProfit: 25,
      riskLevel: 5,
      timeRequired: 45
    });

    return opportunities;
  }

  selectBestOption(opportunities) {
    // Decision making based on personality
    return opportunities.reduce((best, current) => {
      const currentScore = this.calculateOpportunityScore(current);
      const bestScore = best ? this.calculateOpportunityScore(best) : 0;
      
      return currentScore > bestScore ? current : best;
    }, null);
  }

  calculateOpportunityScore(opportunity) {
    const { expectedProfit, riskLevel, timeRequired } = opportunity;
    const { riskTaking, ambition } = this.being.traits;
    
    // Score formula based on personality
    let score = expectedProfit / timeRequired; // Efficiency
    
    // Adjust for risk tolerance
    if (riskLevel > riskTaking) {
      score *= 0.5; // Penalty for too much risk
    } else {
      score *= 1.2; // Bonus for acceptable risk
    }
    
    // Ambition boost for high-reward opportunities
    if (expectedProfit > 100 && ambition > 70) {
      score *= 1.5;
    }
    
    return score;
  }

  async executeDecision(decision) {
    const result = {
      success: false,
      profit: 0,
      experience: decision.action,
      timestamp: new Date()
    };

    // Simulate work execution
    console.log(`🔄 ${this.being.name} starting: ${decision.action}`);
    
    // Success rate based on relevant traits
    const successRate = this.calculateSuccessRate(decision);
    const isSuccessful = Math.random() < (successRate / 100);

    if (isSuccessful) {
      const actualProfit = this.calculateActualProfit(decision);
      this.being.wallet += actualProfit;
      result.success = true;
      result.profit = actualProfit;
      
      console.log(`✅ ${this.being.name} earned ${actualProfit} tokens! Wallet: ${this.being.wallet}`);
    } else {
      console.log(`❌ ${this.being.name}'s attempt failed`);
    }

    // Add to memories
    this.being.memories.push(result);
    
    return result;
  }

  calculateSuccessRate(decision) {
    let baseRate = 70; // Base 70% success rate
    
    // Adjust based on relevant traits
    switch(decision.type) {
      case "create_art":
        baseRate += (this.being.traits.creativity - 50) * 0.5;
        break;
      case "social_service":
        baseRate += (this.being.traits.socialness - 50) * 0.5;
        break;
      case "investment":
        baseRate += (this.being.traits.riskTaking - 50) * 0.3;
        break;
    }
    
    return Math.max(30, Math.min(95, baseRate)); // Clamp between 30-95%
  }

  calculateActualProfit(decision) {
    const variance = 0.3; // 30% variance
    const multiplier = 1 + (Math.random() - 0.5) * variance;
    return Math.floor(decision.expectedProfit * multiplier);
  }

  // Get economic status summary
  getEconomicStatus() {
    const recentEarnings = this.being.memories
      .filter(m => m.profit > 0)
      .slice(-5)
      .reduce((sum, m) => sum + m.profit, 0);

    return {
      wallet: this.being.wallet,
      economicStyle: this.being.economicStyle,
      recentEarnings,
      totalActivities: this.being.memories.length,
      successRate: this.calculateOverallSuccessRate()
    };
  }

  calculateOverallSuccessRate() {
    if (this.being.memories.length === 0) return 0;
    
    const successful = this.being.memories.filter(m => m.success).length;
    return Math.round((successful / this.being.memories.length) * 100);
  }
}

module.exports = EconomicDecisionEngine;
