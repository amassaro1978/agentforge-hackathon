'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Code, 
  Sparkles, 
  Download, 
  Github, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Play,
  FileText,
  Shield,
  TrendingUp
} from 'lucide-react';

// AgentForge Web Interface - Hackathon Demo
export default function AgentForgeWebApp() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [skillDescription, setSkillDescription] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('openclaw');
  const [features, setFeatures] = useState<string[]>([]);
  const [generatedSkill, setGeneratedSkill] = useState(null);
  const [solanaEnabled, setSolanaEnabled] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const frameworks = [
    { id: 'openclaw', name: 'OpenClaw', icon: '🦞', desc: 'Modern AI agent platform' },
    { id: 'langchain', name: 'LangChain', icon: '🔗', desc: 'Python AI framework' },
    { id: 'autogen', name: 'AutoGen', icon: '🤖', desc: 'Multi-agent conversations' }
  ];

  const featureOptions = [
    'API Integration', 'Data Processing', 'Web Scraping', 'File Management',
    'Database Operations', 'Authentication', 'Notifications', 'Scheduling',
    'Image Processing', 'Text Analysis', 'Email Handling', 'Chat Integration'
  ];

  const generationSteps = [
    'Analyzing requirements...',
    'Generating skill structure...',
    'Creating code files...',
    'Adding security validation...',
    'Optimizing performance...',
    'Generating documentation...',
    'Running quality checks...',
    'Finalizing skill package...'
  ];

  // Demo data for hackathon presentation
  const demoSkills = [
    {
      name: 'solana-trading-bot',
      description: 'Autonomous trading bot with Jupiter DEX integration',
      framework: 'openclaw',
      features: ['Jupiter Integration', 'Risk Management', 'Portfolio Tracking'],
      scores: { quality: 95, security: 92, performance: 88 },
      generated: true
    },
    {
      name: 'ai-content-moderator',
      description: 'AI-powered content moderation with sentiment analysis',
      framework: 'langchain',
      features: ['Text Analysis', 'Sentiment Detection', 'Auto-moderation'],
      scores: { quality: 89, security: 95, performance: 92 },
      generated: true
    },
    {
      name: 'multi-agent-researcher',
      description: 'Collaborative research team using multiple AI agents',
      framework: 'autogen',
      features: ['Multi-agent Chat', 'Research Coordination', 'Report Generation'],
      scores: { quality: 92, security: 88, performance: 85 },
      generated: true
    }
  ];

  const startDemo = () => {
    setShowDemo(true);
    setSkillDescription('Create a Solana trading bot that autonomously manages a portfolio using Jupiter DEX');
    setSelectedFramework('openclaw');
    setFeatures(['API Integration', 'Data Processing', 'Authentication']);
    setSolanaEnabled(true);
    
    setTimeout(() => {
      startGeneration();
    }, 1000);
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate the generation process with realistic timing
    for (let i = 0; i < generationSteps.length; i++) {
      setGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Complete generation with mock result
    setGeneratedSkill({
      name: 'solana-portfolio-manager',
      description: skillDescription,
      framework: selectedFramework,
      features: features,
      scores: {
        quality: 94,
        security: 91,
        performance: 87
      },
      codeFiles: ['index.ts', 'solana-client.ts', 'jupiter-adapter.ts', 'portfolio-manager.ts'],
      testFiles: ['tests/integration.test.ts', 'tests/unit.test.ts'],
      dependencies: ['@solana/web3.js', '@jup-ag/core', 'typescript'],
      skillMd: `# Solana Portfolio Manager

An autonomous portfolio management skill for OpenClaw agents.

## Features
- Jupiter DEX integration for optimal swap routing
- Real-time portfolio tracking and rebalancing
- Risk management with configurable parameters
- Comprehensive logging and monitoring

## Installation
\`\`\`bash
npm install @solana/web3.js @jup-ag/core
\`\`\`

## Usage
\`\`\`typescript
import { PortfolioManager } from './portfolio-manager';

const manager = new PortfolioManager({
  rpcUrl: process.env.SOLANA_RPC_URL,
  walletPrivateKey: process.env.WALLET_PRIVATE_KEY
});

await manager.startAutonomousManagement();
\`\`\``,
      validationResult: {
        isValid: true,
        errors: [],
        warnings: ['Consider adding slippage protection'],
        suggestions: ['Add support for multiple DEXs', 'Implement stop-loss orders']
      }
    });

    setIsGenerating(false);
  };

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div 
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AgentForge
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Autonomous AI skill generation for the agent economy. Create production-ready skills 
            with security validation, performance optimization, and blockchain integration.
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <motion.button
              onClick={startDemo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Live Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              GitHub
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Code, label: 'Skills Generated', value: '1,247+', color: 'text-blue-600' },
              { icon: Shield, label: 'Security Score', value: '94%', color: 'text-green-600' },
              { icon: TrendingUp, label: 'Performance', value: '89%', color: 'text-purple-600' },
              { icon: Zap, label: 'Frameworks', value: '3+', color: 'text-orange-600' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Skill Generator
            </h2>

            {/* Skill Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Skill Description</label>
              <textarea
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="Describe what you want your AI agent to do..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>

            {/* Framework Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Framework</label>
              <div className="grid grid-cols-3 gap-2">
                {frameworks.map((fw) => (
                  <motion.button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedFramework === fw.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    disabled={isGenerating}
                  >
                    <div className="text-2xl mb-1">{fw.icon}</div>
                    <div className="text-sm font-medium">{fw.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Features</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {featureOptions.map((feature) => (
                  <label key={feature} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={features.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFeatures([...features, feature]);
                        } else {
                          setFeatures(features.filter(f => f !== feature));
                        }
                      }}
                      className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                      disabled={isGenerating}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            {/* Solana Integration */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  checked={solanaEnabled}
                  onChange={(e) => setSolanaEnabled(e.target.checked)}
                  className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                  disabled={isGenerating}
                />
                Enable Solana Integration
              </label>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={startGeneration}
              disabled={isGenerating || !skillDescription.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  {generationSteps[generationStep]}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Skill
                </>
              )}
            </motion.button>

            {/* Generation Progress */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                      animate={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Step {generationStep + 1} of {generationSteps.length}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {generatedSkill ? 'Generated Skill' : 'Preview'}
            </h2>

            <AnimatePresence mode="wait">
              {generatedSkill ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Skill Info */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">{generatedSkill.name}</h3>
                    </div>
                    <p className="text-sm text-green-700 mb-3">{generatedSkill.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {generatedSkill.features.map((feature, i) => (
                        <span key={i} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quality Scores */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">Quality Metrics</h4>
                    <ScoreBar label="Code Quality" score={generatedSkill.scores.quality} color="bg-blue-500" />
                    <ScoreBar label="Security" score={generatedSkill.scores.security} color="bg-green-500" />
                    <ScoreBar label="Performance" score={generatedSkill.scores.performance} color="bg-purple-500" />
                  </div>

                  {/* Files Generated */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Generated Files</h4>
                    <div className="space-y-1 text-sm">
                      <div className="text-purple-600">📄 SKILL.md</div>
                      {generatedSkill.codeFiles.map((file, i) => (
                        <div key={i} className="text-blue-600">📄 {file}</div>
                      ))}
                      {generatedSkill.testFiles.map((file, i) => (
                        <div key={i} className="text-green-600">🧪 {file}</div>
                      ))}
                    </div>
                  </div>

                  {/* Download Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Skill
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      Push to GitHub
                    </motion.button>
                  </div>

                  {/* Validation Results */}
                  {generatedSkill.validationResult.warnings.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Recommendations</span>
                      </div>
                      {generatedSkill.validationResult.warnings.map((warning, i) => (
                        <p key={i} className="text-xs text-orange-700">• {warning}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {showDemo ? 'Starting demo generation...' : 'Your generated skill will appear here'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Demo Skills Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Recently Generated Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoSkills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{skill.name}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {skill.framework}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
                <div className="space-y-2 text-xs">
                  <ScoreBar label="Quality" score={skill.scores.quality} color="bg-blue-400" />
                  <ScoreBar label="Security" score={skill.scores.security} color="bg-green-400" />
                  <ScoreBar label="Performance" score={skill.scores.performance} color="bg-purple-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
        >
          🏆 Colosseum Hackathon Entry
        </motion.div>
      </div>
    </div>
  );
}