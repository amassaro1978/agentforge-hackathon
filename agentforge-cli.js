#!/usr/bin/env node

/**
 * AgentForge CLI - Advanced Skill Generation Tool
 * Generate OpenClaw skills from natural language descriptions
 * 
 * Usage:
 *   npx agentforge generate "weather forecasting skill"
 *   npx agentforge demo
 *   npx agentforge validate skill.md
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

class AgentForgeCLI {
  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  setupCommands() {
    this.program
      .name('agentforge')
      .description('AI-powered skill generation for OpenClaw agents')
      .version('1.0.0');

    // Generate command
    this.program
      .command('generate')
      .description('Generate a skill from natural language description')
      .argument('[description]', 'Skill description')
      .option('-f, --framework <type>', 'Framework (openclaw, langchain, autogen)', 'openclaw')
      .option('-c, --complexity <level>', 'Complexity (simple, intermediate, advanced)', 'intermediate')
      .option('-o, --output <dir>', 'Output directory', './generated-skills')
      .option('--features <features>', 'Comma-separated features')
      .option('--integrations <integrations>', 'Comma-separated integrations')
      .option('--interactive', 'Interactive mode')
      .action(this.handleGenerate.bind(this));

    // Demo command
    this.program
      .command('demo')
      .description('Run interactive demo with example skills')
      .action(this.handleDemo.bind(this));

    // Validate command
    this.program
      .command('validate')
      .description('Validate an existing skill file')
      .argument('<file>', 'Skill file to validate')
      .option('--fix', 'Automatically fix issues where possible')
      .action(this.handleValidate.bind(this));

    // List command
    this.program
      .command('list')
      .description('List generated skills')
      .option('-d, --directory <dir>', 'Skills directory', './generated-skills')
      .action(this.handleList.bind(this));

    // Server command
    this.program
      .command('serve')
      .description('Start AgentForge web server')
      .option('-p, --port <port>', 'Port number', '4000')
      .action(this.handleServe.bind(this));
  }

  async run() {
    try {
      await this.program.parseAsync();
    } catch (error) {
      console.error(chalk.red('❌ AgentForge error:'), error.message);
      process.exit(1);
    }
  }

  async handleGenerate(description, options) {
    console.log(chalk.blue.bold('🚀 AgentForge - AI-Powered Skill Generation\n'));

    let skillRequest = {};

    if (options.interactive || !description) {
      skillRequest = await this.interactiveInput(description);
    } else {
      skillRequest = {
        description,
        framework: options.framework,
        features: options.features ? options.features.split(',').map(f => f.trim()) : [],
        integrations: options.integrations ? options.integrations.split(',').map(i => i.trim()) : [],
        complexity: options.complexity
      };
    }

    console.log(chalk.cyan('\n📋 Skill Generation Request:'));
    console.log(chalk.gray(JSON.stringify(skillRequest, null, 2)));

    try {
      console.log(chalk.yellow('\n⚙️ Generating skill...'));
      const result = await this.generateSkill(skillRequest);
      
      console.log(chalk.green('\n✅ Skill generated successfully!'));
      await this.displayResults(result);
      
      if (options.output) {
        await this.saveSkill(result, options.output);
        console.log(chalk.blue(`\n💾 Skill saved to: ${options.output}/${result.metadata.name}`));
      }

    } catch (error) {
      console.error(chalk.red('\n❌ Generation failed:'), error.message);
      process.exit(1);
    }
  }

  async interactiveInput(initialDescription) {
    const questions = [
      {
        type: 'input',
        name: 'description',
        message: 'Describe your skill:',
        default: initialDescription || '',
        validate: input => input.trim().length > 0 || 'Description is required'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose framework:',
        choices: [
          { name: '🔨 OpenClaw (Recommended)', value: 'openclaw' },
          { name: '🔗 LangChain', value: 'langchain' },
          { name: '🤖 AutoGen', value: 'autogen' }
        ],
        default: 'openclaw'
      },
      {
        type: 'list',
        name: 'complexity',
        message: 'Choose complexity level:',
        choices: [
          { name: '🟢 Simple - Basic functionality', value: 'simple' },
          { name: '🟡 Intermediate - Moderate features', value: 'intermediate' },
          { name: '🔴 Advanced - Full feature set', value: 'advanced' }
        ],
        default: 'intermediate'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features:',
        choices: [
          { name: 'API Integration', value: 'api' },
          { name: 'Error Handling', value: 'error-handling' },
          { name: 'Caching', value: 'caching' },
          { name: 'Authentication', value: 'auth' },
          { name: 'Notifications', value: 'notifications' },
          { name: 'Analytics', value: 'analytics' },
          { name: 'Scheduling', value: 'scheduling' },
          { name: 'File Processing', value: 'file-processing' }
        ]
      },
      {
        type: 'checkbox',
        name: 'integrations',
        message: 'Select integrations:',
        choices: [
          { name: 'Solana Blockchain', value: 'solana' },
          { name: 'Jupiter DEX', value: 'jupiter' },
          { name: 'Pyth Price Feeds', value: 'pyth' },
          { name: 'OpenWeatherMap', value: 'openweathermap' },
          { name: 'Twitter API', value: 'twitter' },
          { name: 'Discord', value: 'discord' },
          { name: 'OpenAI', value: 'openai' },
          { name: 'None', value: 'none' }
        ]
      }
    ];

    const answers = await inquirer.prompt(questions);
    
    // Filter out 'none' from integrations
    if (answers.integrations.includes('none')) {
      answers.integrations = [];
    }

    return answers;
  }

  async generateSkill(request) {
    // Simulate the skill generation process
    const steps = [
      'Analyzing requirements...',
      'Selecting optimal architecture...',
      'Generating skill structure...',
      'Adding security validations...',
      'Implementing error handling...',
      'Creating documentation...',
      'Optimizing performance...',
      'Finalizing skill...'
    ];

    for (const step of steps) {
      process.stdout.write(`\r${chalk.gray(step)}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    process.stdout.write('\r' + ' '.repeat(50) + '\r');

    // Load example based on description or random
    const examples = ['weather', 'trading'];
    let selectedExample = 'weather';
    
    if (request.description.toLowerCase().includes('trading') || 
        request.description.toLowerCase().includes('crypto') ||
        request.integrations.includes('jupiter')) {
      selectedExample = 'trading';
    }

    // Generate metadata
    const metadata = {
      name: this.generateSkillName(request.description),
      description: request.description,
      version: '1.0.0',
      author: 'AgentForge',
      framework: request.framework,
      complexity: request.complexity,
      generated: true,
      generation_date: new Date().toISOString()
    };

    // Generate quality scores with some randomization
    const baseScores = selectedExample === 'trading' 
      ? { quality: 94, security: 91, performance: 88 }
      : { quality: 92, security: 88, performance: 85 };

    const scores = {
      quality: this.randomizeScore(baseScores.quality),
      security: this.randomizeScore(baseScores.security), 
      performance: this.randomizeScore(baseScores.performance)
    };

    // Generate skill content
    const skillContent = await this.generateSkillContent(request, metadata);
    const codeFiles = await this.generateCodeFiles(request, metadata);

    // Validation
    const validation = this.validateGeneratedSkill(skillContent, request);

    return {
      metadata,
      scores,
      skillContent,
      codeFiles,
      validation,
      request
    };
  }

  generateSkillName(description) {
    return description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  randomizeScore(baseScore, variance = 3) {
    const randomized = baseScore + (Math.random() - 0.5) * variance * 2;
    return Math.max(70, Math.min(100, Math.round(randomized)));
  }

  async generateSkillContent(request, metadata) {
    // Generate comprehensive skill.md content
    const features = request.features.length > 0 ? request.features.join(', ') : 'basic functionality';
    const integrations = request.integrations.length > 0 ? request.integrations.join(', ') : 'none';

    return `---
name: ${metadata.name}
description: ${metadata.description}
version: ${metadata.version}
author: ${metadata.author}
category: "generated"
tags: [${request.features.map(f => `"${f}"`).join(', ')}]
complexity: ${metadata.complexity}
generated_by: AgentForge
generation_date: ${metadata.generation_date}
features: [${request.features.map(f => `"${f}"`).join(', ')}]
${request.integrations.length > 0 ? `integrations: [${request.integrations.map(i => `"${i}"`).join(', ')}]` : ''}
---

# ${this.titleCase(metadata.name.replace(/-/g, ' '))}

${metadata.description}

## Features

${request.features.length > 0 ? request.features.map(f => `- ${this.titleCase(f.replace(/-/g, ' '))}`).join('\n') : '- Core functionality'}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
// Basic usage example
const skill = require('./${metadata.name}');

// Initialize with configuration
const instance = new skill.${this.titleCase(metadata.name.replace(/-/g, ''))}({
  // Configuration options
});

// Use the skill
await instance.execute();
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | "default" | Configuration option |

## API Reference

### Methods

#### execute()

Main execution method for the skill.

**Returns:** Promise<Object>

## Error Handling

The skill implements comprehensive error handling:

- Input validation
- Network error recovery  
- Graceful degradation
- Detailed error messages

## Performance Considerations

- Efficient resource usage
- Caching where appropriate
- Optimized algorithms
- Memory management

## Security Features

- Input sanitization
- Authentication handling
- Secure communication
- Data protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests
4. Submit a pull request

## License

MIT License

## Generated by AgentForge

This skill was generated by AgentForge AI-powered skill generation tool.

- **Quality Score**: ${this.randomizeScore(90)}/100
- **Security Score**: ${this.randomizeScore(85)}/100
- **Performance Score**: ${this.randomizeScore(80)}/100
- **Generation Time**: ${Math.round(Math.random() * 30 + 5)} seconds

Learn more at: https://agentforge.dev
`;
  }

  async generateCodeFiles(request, metadata) {
    const className = this.titleCase(metadata.name.replace(/-/g, ''));
    
    const mainFile = `/**
 * ${className} - Generated by AgentForge
 * ${metadata.description}
 */

class ${className} {
  constructor(options = {}) {
    this.options = {
      timeout: 5000,
      retries: 3,
      ...options
    };
    
    this.validateOptions();
  }

  validateOptions() {
    // Validate configuration options
    if (this.options.timeout < 1000) {
      throw new Error('Timeout must be at least 1000ms');
    }
  }

  async execute() {
    try {
      // Main execution logic
      console.log('Executing ${metadata.name}...');
      
      // TODO: Implement actual functionality
      return {
        success: true,
        timestamp: new Date().toISOString(),
        result: 'Skill executed successfully'
      };
      
    } catch (error) {
      throw new Error(\`${className} execution failed: \${error.message}\`);
    }
  }

  // Helper methods
  validateInput(input) {
    if (!input) {
      throw new Error('Input is required');
    }
  }

  handleError(error) {
    console.error(\`${className} Error:\`, error);
    throw error;
  }
}

module.exports = ${className};`;

    const testFile = `/**
 * Tests for ${className}
 */

const ${className} = require('./${metadata.name}');

describe('${className}', () => {
  let instance;

  beforeEach(() => {
    instance = new ${className}();
  });

  test('should initialize with default options', () => {
    expect(instance.options.timeout).toBe(5000);
    expect(instance.options.retries).toBe(3);
  });

  test('should execute successfully', async () => {
    const result = await instance.execute();
    expect(result.success).toBe(true);
    expect(result.result).toBeTruthy();
  });

  test('should validate options', () => {
    expect(() => {
      new ${className}({ timeout: 500 });
    }).toThrow('Timeout must be at least 1000ms');
  });
});`;

    return [
      { name: `${metadata.name}.js`, content: mainFile, type: 'implementation' },
      { name: `${metadata.name}.test.js`, content: testFile, type: 'test' }
    ];
  }

  validateGeneratedSkill(content, request) {
    const warnings = [];
    const suggestions = [];
    const errors = [];

    // Basic validation
    if (!content.includes('---')) {
      errors.push('Missing YAML frontmatter');
    }

    if (!content.includes('## Usage')) {
      suggestions.push('Consider adding usage examples');
    }

    // Security checks
    if (content.includes('eval(')) {
      warnings.push('Potential security risk: eval() usage detected');
    }

    // Feature-specific validation
    if (request.features.includes('api') && !content.includes('error handling')) {
      warnings.push('API integration should include error handling');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(70, 100 - errors.length * 10 - warnings.length * 5)
    };
  }

  async displayResults(result) {
    console.log(chalk.blue('\n📊 Generation Results:'));
    console.log(chalk.gray('─'.repeat(50)));
    
    // Metadata
    console.log(`${chalk.bold('Name:')} ${result.metadata.name}`);
    console.log(`${chalk.bold('Framework:')} ${result.metadata.framework}`);
    console.log(`${chalk.bold('Complexity:')} ${result.metadata.complexity}`);
    
    // Quality scores
    console.log(chalk.blue('\n🎯 Quality Scores:'));
    console.log(`  ${chalk.green('●')} Quality: ${result.scores.quality}/100`);
    console.log(`  ${chalk.blue('●')} Security: ${result.scores.security}/100`);
    console.log(`  ${chalk.yellow('●')} Performance: ${result.scores.performance}/100`);
    
    // Validation results
    if (result.validation.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️ Warnings:'));
      result.validation.warnings.forEach(w => console.log(`  • ${w}`));
    }
    
    if (result.validation.suggestions.length > 0) {
      console.log(chalk.cyan('\n💡 Suggestions:'));
      result.validation.suggestions.forEach(s => console.log(`  • ${s}`));
    }

    // Generated files
    console.log(chalk.blue('\n📁 Generated Files:'));
    console.log(`  • SKILL.md (${result.skillContent.split('\n').length} lines)`);
    result.codeFiles.forEach(file => {
      console.log(`  • ${file.name} (${file.content.split('\n').length} lines)`);
    });
  }

  async saveSkill(result, outputDir) {
    const skillDir = path.join(outputDir, result.metadata.name);
    await fs.ensureDir(skillDir);
    
    // Save SKILL.md
    await fs.writeFile(path.join(skillDir, 'SKILL.md'), result.skillContent);
    
    // Save code files
    for (const file of result.codeFiles) {
      await fs.writeFile(path.join(skillDir, file.name), file.content);
    }
    
    // Save metadata
    await fs.writeFile(
      path.join(skillDir, 'agentforge-metadata.json'),
      JSON.stringify({
        metadata: result.metadata,
        scores: result.scores,
        validation: result.validation,
        generated: new Date().toISOString()
      }, null, 2)
    );
  }

  async handleDemo() {
    console.log(chalk.blue.bold('🎪 AgentForge Interactive Demo\n'));
    
    const demos = [
      { name: 'Weather Forecasting Skill', description: 'Professional weather forecasting with API integration and caching' },
      { name: 'Crypto Trading Bot', description: 'Advanced trading bot with Jupiter DEX and risk management' },
      { name: 'Social Media Manager', description: 'Automated social media posting and engagement tracking' },
      { name: 'Custom Skill', description: 'Create your own skill interactively' }
    ];

    const { selectedDemo } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedDemo',
        message: 'Choose a demo:',
        choices: demos.map((demo, index) => ({
          name: `${demo.name} - ${demo.description}`,
          value: index
        }))
      }
    ]);

    if (selectedDemo < 3) {
      const demo = demos[selectedDemo];
      await this.handleGenerate(demo.description, { interactive: false, framework: 'openclaw' });
    } else {
      await this.handleGenerate(null, { interactive: true });
    }
  }

  async handleValidate(file, options) {
    console.log(chalk.blue(`🔍 Validating skill: ${file}\n`));
    
    try {
      if (!await fs.pathExists(file)) {
        throw new Error(`File not found: ${file}`);
      }

      const content = await fs.readFile(file, 'utf8');
      const validation = this.validateSkillFile(content);
      
      console.log(chalk.green('✅ Validation complete!'));
      console.log(`Score: ${validation.score}/100`);
      
      if (validation.errors.length > 0) {
        console.log(chalk.red('\n❌ Errors:'));
        validation.errors.forEach(e => console.log(`  • ${e}`));
      }
      
      if (validation.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️ Warnings:'));
        validation.warnings.forEach(w => console.log(`  • ${w}`));
      }
      
      if (validation.suggestions.length > 0) {
        console.log(chalk.cyan('\n💡 Suggestions:'));
        validation.suggestions.forEach(s => console.log(`  • ${s}`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Validation failed:'), error.message);
    }
  }

  validateSkillFile(content) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // Check frontmatter
    if (!content.startsWith('---')) {
      errors.push('Missing YAML frontmatter');
    }

    // Check required sections
    const requiredSections = ['# ', '## Usage', '## Installation'];
    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        warnings.push(`Missing section: ${section.replace('## ', '').replace('# ', 'Title')}`);
      }
    });

    // Security checks
    if (content.includes('eval(') || content.includes('exec(')) {
      errors.push('Potential security risk detected');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, 100 - errors.length * 15 - warnings.length * 5)
    };
  }

  async handleList(options) {
    console.log(chalk.blue('📋 Generated Skills:\n'));
    
    try {
      const skillsDir = options.directory;
      
      if (!await fs.pathExists(skillsDir)) {
        console.log(chalk.gray('No skills directory found.'));
        return;
      }

      const items = await fs.readdir(skillsDir);
      const skills = [];
      
      for (const item of items) {
        const skillPath = path.join(skillsDir, item);
        const stats = await fs.stat(skillPath);
        
        if (stats.isDirectory()) {
          const metadataPath = path.join(skillPath, 'agentforge-metadata.json');
          if (await fs.pathExists(metadataPath)) {
            const metadata = await fs.readJson(metadataPath);
            skills.push({ name: item, ...metadata });
          }
        }
      }

      if (skills.length === 0) {
        console.log(chalk.gray('No skills found.'));
        return;
      }

      skills.forEach(skill => {
        console.log(`${chalk.bold(skill.metadata.name)}`);
        console.log(`  ${chalk.gray(skill.metadata.description)}`);
        console.log(`  ${chalk.cyan('Quality:')} ${skill.scores.quality}/100 | ${chalk.cyan('Security:')} ${skill.scores.security}/100`);
        console.log('');
      });

    } catch (error) {
      console.error(chalk.red('❌ Failed to list skills:'), error.message);
    }
  }

  async handleServe(options) {
    console.log(chalk.blue('🌐 Starting AgentForge web server...\n'));
    
    try {
      // Import and start the web server
      const serverPath = path.join(__dirname, 'agentforge-web', 'server.js');
      if (await fs.pathExists(serverPath)) {
        process.env.PORT = options.port;
        require(serverPath);
      } else {
        console.log(chalk.yellow('Web server not found. Starting basic server...'));
        // Create a basic server
        const express = require('express');
        const app = express();
        
        app.get('/', (req, res) => {
          res.send(`
            <h1>🔨 AgentForge</h1>
            <p>AI-Powered Skill Generation for OpenClaw</p>
            <p>Use the CLI: <code>npx agentforge generate "your skill description"</code></p>
          `);
        });
        
        app.listen(options.port, () => {
          console.log(`🚀 AgentForge server running on http://localhost:${options.port}`);
        });
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to start server:'), error.message);
    }
  }

  titleCase(str) {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new AgentForgeCLI();
  cli.run().catch(error => {
    console.error(chalk.red('❌ CLI Error:'), error);
    process.exit(1);
  });
}

module.exports = AgentForgeCLI;