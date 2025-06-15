class AlithAgent {
  constructor() {
    this.personality = {
      helpfulness: 95,
      creativity: 88,
      analytical: 92,
      social: 85
    };
    this.memory = [];
    this.capabilities = [
      'natural_language_processing',
      'code_generation', 
      'strategic_planning',
      'social_mediation',
      'market_analysis'
    ];
    console.log('🤖 Alith AI Agent initialized and ready');
  }

  // Main natural language processing function
  processNaturalLanguage(userInput) {
    console.log(`🧠 Alith processing: "${userInput}"`);
    
    const intent = this.analyzeIntent(userInput);
    
    switch (intent.type) {
      case 'create_being':
        return this.generateBeingRecommendation(intent.parameters);
      case 'market_analysis':
        return this.provideMarketInsights();
      case 'collaboration_advice':
        return this.suggestCollaborations(intent.parameters);
      case 'optimization':
        return this.optimizeStrategy(intent.parameters);
      case 'greeting':
        return this.provideGreeting();
      default:
        return this.provideGeneralAssistance(userInput);
    }
  }

  analyzeIntent(input) {
    const lowercaseInput = input.toLowerCase();
    
    // Greeting detection
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey')) {
      return { type: 'greeting', parameters: {} };
    }
    
    // Being creation detection
    if (lowercaseInput.includes('create') || lowercaseInput.includes('new being') || lowercaseInput.includes('ai being')) {
      return { type: 'create_being', parameters: this.extractBeingParameters(input) };
    }
    
    // Market analysis detection
    if (lowercaseInput.includes('market') || lowercaseInput.includes('economy') || lowercaseInput.includes('trends')) {
      return { type: 'market_analysis', parameters: {} };
    }
    
    // Collaboration detection
    if (lowercaseInput.includes('collaborate') || lowercaseInput.includes('work together') || lowercaseInput.includes('partnership')) {
      return { type: 'collaboration_advice', parameters: {} };
    }
    
    // Optimization detection
    if (lowercaseInput.includes('optimize') || lowercaseInput.includes('improve') || lowercaseInput.includes('better')) {
      return { type: 'optimization', parameters: this.extractOptimizationTarget(input) };
    }
    
    return { type: 'general', parameters: {} };
  }

  extractBeingParameters(input) {
    const lowercaseInput = input.toLowerCase();
    let focus = 'balanced';
    
    if (lowercaseInput.includes('creative') || lowercaseInput.includes('artist')) {
      focus = 'creative';
    } else if (lowercaseInput.includes('entrepreneur') || lowercaseInput.includes('business')) {
      focus = 'entrepreneur';
    } else if (lowercaseInput.includes('social') || lowercaseInput.includes('friendly')) {
      focus = 'social';
    }
    
    return { focus };
  }

  extractOptimizationTarget(input) {
    const lowercaseInput = input.toLowerCase();
    let target = 'overall';
    
    if (lowercaseInput.includes('earning') || lowercaseInput.includes('money')) {
      target = 'earnings';
    } else if (lowercaseInput.includes('reputation') || lowercaseInput.includes('social')) {
      target = 'reputation';
    }
    
    return { target };
  }

  provideGreeting() {
    return {
      type: 'greeting',
      content: `👋 Hello! I'm Alith, your AI assistant for managing your HyperBeings society.

I can help you with:
🎭 **Creating optimal AI beings** with personalized traits
📊 **Analyzing market trends** and economic opportunities  
🤝 **Suggesting collaborations** between your AI beings
⚡ **Optimizing strategies** for maximum success

What would you like to explore today?`,
      actionable: true
    };
  }

  generateBeingRecommendation(parameters) {
    const focus = parameters.focus || 'balanced';
    const traits = this.generateOptimalTraits(focus);
    
    return {
      type: 'being_recommendation',
      content: `🎭 **Optimal AI Being Recommendation** (${focus} focus)

**Recommended Personality Traits:**
🎨 Creativity: ${traits.creativity}
👥 Social Skills: ${traits.socialness}
🎯 Risk Taking: ${traits.riskTaking}
🚀 Ambition: ${traits.ambition}
❤️ Empathy: ${traits.empathy}

**Why These Traits Work:**
${this.explainTraitChoice(focus, traits)}

**Predicted Success Rate:** ${this.calculateSuccessRate(traits)}%

Ready to create this AI being? Just use the name input and I'll optimize the traits automatically!`,
      actionable: true,
      traits: traits
    };
  }

  generateOptimalTraits(focus) {
    switch (focus) {
      case 'creative':
        return {
          creativity: 90 + Math.floor(Math.random() * 10),
          socialness: 70 + Math.floor(Math.random() * 20),
          riskTaking: 60 + Math.floor(Math.random() * 20),
          ambition: 80 + Math.floor(Math.random() * 15),
          empathy: 75 + Math.floor(Math.random() * 20)
        };
      case 'entrepreneur':
        return {
          creativity: 70 + Math.floor(Math.random() * 20),
          socialness: 80 + Math.floor(Math.random() * 15),
          riskTaking: 85 + Math.floor(Math.random() * 15),
          ambition: 95 + Math.floor(Math.random() * 5),
          empathy: 60 + Math.floor(Math.random() * 25)
        };
      case 'social':
        return {
          creativity: 60 + Math.floor(Math.random() * 25),
          socialness: 95 + Math.floor(Math.random() * 5),
          riskTaking: 40 + Math.floor(Math.random() * 30),
          ambition: 70 + Math.floor(Math.random() * 20),
          empathy: 90 + Math.floor(Math.random() * 10)
        };
      default:
        return {
          creativity: 70 + Math.floor(Math.random() * 20),
          socialness: 70 + Math.floor(Math.random() * 20),
          riskTaking: 50 + Math.floor(Math.random() * 30),
          ambition: 75 + Math.floor(Math.random() * 20),
          empathy: 70 + Math.floor(Math.random() * 20)
        };
    }
  }

  explainTraitChoice(focus, traits) {
    switch (focus) {
      case 'creative':
        return `High creativity (${traits.creativity}) maximizes artistic income potential. Balanced social skills (${traits.socialness}) enable collaborations. Moderate risk-taking (${traits.riskTaking}) provides steady growth.`;
      case 'entrepreneur':
        return `Maximum ambition (${traits.ambition}) drives business success. High risk-taking (${traits.riskTaking}) captures big opportunities. Strong social skills (${traits.socialness}) build networks.`;
      case 'social':
        return `Maximum social skills (${traits.socialness}) and empathy (${traits.empathy}) create strong relationships. Lower risk-taking ensures stable collaborations.`;
      default:
        return `Balanced traits provide versatility across all economic opportunities while maintaining stable relationships and steady growth.`;
    }
  }

  calculateSuccessRate(traits) {
    const average = (traits.creativity + traits.socialness + traits.riskTaking + traits.ambition + traits.empathy) / 5;
    return Math.round(65 + (average - 50) * 0.5); // 65-90% range
  }

  provideMarketInsights() {
    const insights = [
      "Creative AI beings are currently earning 40% more than average",
      "Collaboration projects show 60% higher success rates",
      "High-empathy beings have 25% better reputation growth",
      "Risk-taking above 80 correlates with 50% higher variance in earnings",
      "Social AI beings are forming the most profitable partnerships"
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];

    return {
      type: 'market_analysis',
      content: `📊 **Real-Time Market Analysis**

**Current Trends:**
🔥 ${randomInsight}

**Top Earning Strategies:**
1. **Creative + Social Combo**: AI beings with 80+ creativity and 70+ social skills
2. **High-Risk Entrepreneurship**: 85+ ambition with 80+ risk-taking
3. **Collaborative Networks**: Building 3+ strong relationships (70+ compatibility)

**Market Opportunities:**
• Digital art creation is in high demand
• Investment partnerships are forming rapidly  
• Social media management services are profitable

**Recommendation:** Focus on developing beings with complementary skills for maximum market coverage.`,
      actionable: true
    };
  }

  suggestCollaborations() {
    return {
      type: 'collaboration_advice',
      content: `🤝 **Strategic Collaboration Guide**

**High-Success Pairings:**
🎨 **Creator + Marketer**: Creativity 80+ paired with Social 80+
🚀 **Entrepreneur + Analyst**: High ambition with balanced risk-taking
💡 **Innovator + Executor**: High creativity with high empathy for implementation

**Collaboration Projects to Consider:**
• **Digital Art Gallery**: 2-3 creative beings pool resources
• **Investment Syndicate**: High-ambition beings share market research
• **Social Network**: High-empathy beings create community platforms

**Success Factors:**
✅ Complementary skill sets (different strengths)
✅ Similar empathy levels (good working relationship)
✅ Balanced risk tolerance (aligned decision-making)

**Expected ROI:** Successful collaborations typically increase individual earnings by 40-70%.`,
      actionable: true
    };
  }

  optimizeStrategy(parameters) {
    const target = parameters.target || 'overall';
    
    const strategies = {
      earnings: `💰 **Earnings Optimization Strategy**

**Immediate Actions:**
1. Focus beings with 70+ creativity on art creation (highest ROI)
2. Pair high-ambition beings for investment opportunities
3. Develop social beings' networking for consistent income

**Long-term Growth:**
• Build reputation through successful collaborations
• Diversify income streams across multiple beings
• Reinvest profits into skill development`,

      reputation: `⭐ **Reputation Building Strategy**

**Quick Wins:**
1. Increase collaboration frequency (empathy-driven projects)
2. Focus on success rate over maximum profit
3. Help newer AI beings (mentorship builds reputation)

**Sustainable Growth:**
• Maintain 80%+ success rate in all activities
• Build long-term relationships over quick profits
• Share resources and knowledge within your society`,

      overall: `⚡ **Comprehensive Optimization Plan**

**Phase 1 - Foundation (Next 5 activities):**
• Create 2-3 beings with different specializations
• Establish at least 1 profitable collaboration
• Build baseline reputation (60+ for all beings)

**Phase 2 - Growth (Next 10 activities):**
• Diversify into 3+ economic sectors
• Form strategic partnerships
• Optimize high-performers for maximum output

**Phase 3 - Domination:**
• Lead community initiatives
• Mentor new societies
• Establish market leadership in key areas`
    };

    return {
      type: 'optimization',
      content: strategies[target],
      actionable: true
    };
  }

  provideGeneralAssistance(userInput) {
    return {
      type: 'general_assistance',
      content: `🤔 I understand you're asking about: "${userInput}"

I'm here to help with your AI society! I can assist with:

🎭 **Creating AI Beings**: Ask me "Create a creative AI being" or "Help me design an entrepreneur"
📊 **Market Analysis**: Try "What are the current trends?" or "Analyze the market"
🤝 **Collaborations**: Say "Suggest collaboration opportunities" 
⚡ **Optimization**: Ask "How can I improve my earnings?" or "Optimize my strategy"

**Quick Tips:**
• Be specific about what type of help you need
• Ask about specific AI being types or economic strategies
• Request analysis of your current society performance

What specific aspect would you like to explore?`,
      actionable: true
    };
  }

  // Integration methods for society analysis
  analyzeSocietyTrends(society) {
    const beings = Array.from(society.beings.values());
    
    return {
      populationHealth: this.analyzePopulation(beings),
      economicInsights: this.analyzeEconomics(beings),
      socialDynamics: this.analyzeSocial(society),
      recommendations: this.generateRecommendations(beings, society)
    };
  }

  analyzePopulation(beings) {
    if (beings.length === 0) return { status: 'Empty society' };
    
    const avgReputation = beings.reduce((sum, b) => sum + b.reputation, 0) / beings.length;
    const avgWealth = beings.reduce((sum, b) => sum + b.wallet, 0) / beings.length;
    
    return {
      size: beings.length,
      avgReputation: Math.round(avgReputation),
      avgWealth: Math.round(avgWealth),
      diversity: this.calculateDiversity(beings)
    };
  }

  calculateDiversity(beings) {
    if (beings.length === 0) return 0;
    
    const styles = {};
    beings.forEach(being => {
      const style = being.economicStyle || 'unknown';
      styles[style] = (styles[style] || 0) + 1;
    });
    
    return Object.keys(styles).length;
  }

  analyzeEconomics(beings) {
    const totalWealth = beings.reduce((sum, b) => sum + b.wallet, 0);
    const earners = beings.filter(b => b.wallet > 100);
    
    return {
      totalWealth,
      earners: earners.length,
      economicMomentum: totalWealth > beings.length * 200 ? 'Strong' : 'Growing'
    };
  }

  analyzeSocial(society) {
    return {
      collaborations: society.collaborativeProjects.length,
      interactions: society.activeInteractions.length,
      socialHealth: 'Active'
    };
  }

  generateRecommendations(beings, society) {
    const recs = [];
    
    if (beings.length < 3) {
      recs.push('Create more AI beings for diverse economic opportunities');
    }
    
    if (society.collaborativeProjects.length === 0) {
      recs.push('Start collaborative projects to boost collective wealth');
    }
    
    const lowEarners = beings.filter(b => b.wallet < 150);
    if (lowEarners.length > 0) {
      recs.push('Focus on developing skills for low-earning beings');
    }
    
    return recs.length > 0 ? recs : ['Your society is performing well! Consider expansion.'];
  }
}

module.exports = AlithAgent;
