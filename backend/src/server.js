const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import our AI society system
const AIBeing = require('../../ai-engine/AIBeing');
const SocietyManager = require('../../ai-engine/SocietyManager');
const AlithAgent = require('../../ai-engine/AlithAgent');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI Society and Alith
const society = new SocietyManager();
const alith = new AlithAgent();
let simulationRunning = false;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current society state
  socket.emit('society-update', society.getSocietyOverview());
  socket.emit('beings-update', society.getAllBeingsStatus());

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle client requests
  socket.on('create-being', (data) => {
    try {
      const newBeing = new AIBeing(data.name, data.traits);
      society.addBeing(newBeing);
      
      // Broadcast updates
      io.emit('society-update', society.getSocietyOverview());
      io.emit('beings-update', society.getAllBeingsStatus());
      io.emit('new-being', newBeing.getStatus());
      
      console.log('New AI being created:', data.name);
    } catch (error) {
      console.error('Error creating being:', error);
      socket.emit('error', { message: 'Failed to create AI being' });
    }
  });

  socket.on('start-simulation', () => {
    if (!simulationRunning) {
      startSimulation();
      console.log('Simulation started by client:', socket.id);
    }
  });

  socket.on('stop-simulation', () => {
    simulationRunning = false;
    console.log('Simulation stopped by client:', socket.id);
  });
});

// REST API Routes
app.get('/api/society', (req, res) => {
  try {
    const overview = society.getSocietyOverview();
    res.json(overview);
  } catch (error) {
    console.error('Error getting society overview:', error);
    res.status(500).json({ error: 'Failed to get society overview' });
  }
});

app.get('/api/beings', (req, res) => {
  try {
    const beings = society.getAllBeingsStatus();
    res.json(beings);
  } catch (error) {
    console.error('Error getting beings status:', error);
    res.status(500).json({ error: 'Failed to get beings status' });
  }
});

app.post('/api/beings', (req, res) => {
  try {
    const { name, traits } = req.body;
    
    if (!name || !traits) {
      return res.status(400).json({ error: 'Name and traits are required' });
    }
    
    const newBeing = new AIBeing(name, traits);
    const beingId = society.addBeing(newBeing);
    
    // Broadcast real-time update
    io.emit('society-update', society.getSocietyOverview());
    io.emit('beings-update', society.getAllBeingsStatus());
    
    res.json({ 
      success: true,
      id: beingId, 
      being: newBeing.getStatus() 
    });
  } catch (error) {
    console.error('Error creating being via API:', error);
    res.status(500).json({ error: 'Failed to create AI being' });
  }
});

// Alith AI Routes
app.post('/api/alith/process', (req, res) => {
  console.log('Alith processing request:', req.body);
  
  const { userInput } = req.body;
  
  if (!userInput || typeof userInput !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid user input required' 
    });
  }

  try {
    const response = alith.processNaturalLanguage(userInput.trim());
    console.log('Alith response generated:', response.type);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Alith processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Alith processing failed',
      message: error.message
    });
  }
});

app.get('/api/alith/analyze-society', (req, res) => {
  try {
    const analysis = alith.analyzeSocietyTrends(society);
    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Society analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Society analysis failed',
      message: error.message
    });
  }
});

app.post('/api/alith/mentor/:beingId', (req, res) => {
  const { beingId } = req.params;
  const { beingData } = req.body;
  
  if (!beingData) {
    return res.status(400).json({
      success: false,
      error: 'Being data required for mentorship'
    });
  }
  
  try {
    const advice = alith.mentorAIBeing(beingData);
    res.json({
      success: true,
      beingId: beingId,
      advice: advice,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Mentorship error:', error);
    res.status(500).json({
      success: false,
      error: 'Mentorship failed',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    services: {
      society: society ? 'ready' : 'not ready',
      alith: alith ? 'ready' : 'not ready',
      simulation: simulationRunning ? 'running' : 'stopped'
    }
  });
});

// Simulation function
async function startSimulation() {
  simulationRunning = true;
  console.log('Starting real-time AI society simulation...');

  while (simulationRunning) {
    try {
      if (society.beings.size > 0) {
        await society.simulateSocietyStep();
        
        // Broadcast updates to all connected clients
        io.emit('society-update', society.getSocietyOverview());
        io.emit('beings-update', society.getAllBeingsStatus());
      }
      
      // Wait 5 seconds between simulation steps
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Simulation step error:', error);
      // Continue simulation even if one step fails
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('Simulation stopped');
}

// Create some initial AI beings for demo
async function initializeDemoSociety() {
  console.log('Initializing demo AI society...');
  
  try {
    const alice = new AIBeing("Alice", { 
      creativity: 85, 
      socialness: 90, 
      ambition: 80,
      riskTaking: 45,
      empathy: 75
    });
    
    const bob = new AIBeing("Bob", { 
      riskTaking: 90, 
      ambition: 85, 
      empathy: 60,
      creativity: 70,
      socialness: 65
    });
    
    society.addBeing(alice);
    society.addBeing(bob);
    
    console.log('Demo society initialized with Alice and Bob');
    console.log('Alith AI Agent ready for natural language interactions');
  } catch (error) {
    console.error('Error initializing demo society:', error);
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`HyperBeings API server running on port ${PORT}`);
  console.log(`Socket.IO server ready for real-time connections`);
  console.log(`Alith AI Agent integrated and ready`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  
  // Initialize demo society
  initializeDemoSociety();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
