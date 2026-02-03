/**
 * AgentForge Core - Enhanced Version
 * The autonomous development assistant for AI agents
 * 
 * IMPROVEMENTS MADE:
 * - Better error handling
 * - More robust YAML parsing
 * - Enhanced validation
 * - Solana integration improvements
 * - Template system enhancements
 */

import OpenAI from 'openai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Connection, PublicKey } from '@solana/web3.js';

// Enhanced interfaces
export interface SkillGenerationRequest {
  description: string;
  framework: 'openclaw' | 'langchain' | 'autogen';
  features: string[];
  integrations?: string[];
  complexity?: 'simple' | 'intermediate' | 'advanced';
  solanaFeatures?: SolanaIntegration[];
}

export interface SolanaIntegration {
  type: 'jupiter' | 'pyth' | 'metaplex' | 'serum' | 'mango';
  functionality: string[];
}

export interface GeneratedSkill {
  skillMd: string;
  metadata: SkillMetadata;
  codeFiles: CodeFile[];
  dependencies: string[];
  testFiles: TestFile[];
  validationResult: ValidationResult;
  solanaConfig?: SolanaConfig;
}

export interface SolanaConfig {
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  programs: ProgramConfig[];
  tokens: TokenConfig[];
}

export interface ProgramConfig {
  name: string;
  address: string;
  idl?: any;
}

export interface TokenConfig {
  symbol: string;
  mint: string;
  decimals: number;
}

export interface SkillMetadata {
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  homepage?: string;
  dependencies?: Record<string, string>;
  agentforge?: {
    generated: boolean;
    quality_score: number;
    complexity: string;
    features: string[];
  };
}

export interface CodeFile {
  filename: string;
  content: string;
  type: 'typescript' | 'javascript' | 'python' | 'rust' | 'markdown';
  purpose: 'main' | 'util' | 'test' | 'config' | 'type';
}

export interface TestFile {
  filename: string;
  content: string;
  type: 'unit' | 'integration' | 'e2e';
  coverage?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100 quality score
  security_score: number; // 0-100 security score
  performance_score: number; // 0-100 performance score
}

/**
 * Enhanced AgentForge Code Generation Engine
 */
export class AgentForgeEnhanced {
  private openai: OpenAI;
  private templates: Map<string, SkillTemplate> = new Map();
  private solanaConnection?: Connection;

  constructor(
    private config: {
      openaiApiKey: string;
      solanaRpcUrl?: string;
      outputDir?: string;
    }
  ) {
    this.openai = new OpenAI({ apiKey: config.openaiApiKey });
    
    if (config.solanaRpcUrl) {
      this.solanaConnection = new Connection(config.solanaRpcUrl);
    }
    
    this.initializeEnhancedTemplates();
  }

  /**
   * Generate a complete skill with enhanced features
   */
  async generateSkill(request: SkillGenerationRequest): Promise<GeneratedSkill> {
    try {
      console.log(`🚀 Generating ${request.framework} skill: ${request.description}`);
      
      // Pre-generation validation
      this.validateRequest(request);
      
      // Generate skill components in parallel for speed
      const [skillMd, solanaConfig] = await Promise.all([
        this.generateEnhancedSkillMd(request),
        request.integrations?.some(i => ['jupiter', 'pyth', 'metaplex'].includes(i)) 
          ? this.generateSolanaConfig(request) 
          : Promise.resolve(undefined)
      ]);
      
      // Parse metadata with enhanced parsing
      const metadata = await this.parseEnhancedMetadata(skillMd, request);
      
      // Generate supporting files
      const [codeFiles, testFiles] = await Promise.all([
        this.generateEnhancedCodeFiles(request, metadata),
        this.generateEnhancedTestFiles(request, metadata)
      ]);
      
      // Extract dependencies with version resolution
      const dependencies = await this.extractEnhancedDependencies(skillMd, codeFiles, request);
      
      // Enhanced validation with security and performance checks
      const validationResult = await this.enhancedValidation({
        skillMd,
        metadata,
        codeFiles,
        testFiles,
        dependencies,
        validationResult: { isValid: true, errors: [], warnings: [], suggestions: [], score: 0, security_score: 0, performance_score: 0 },
        solanaConfig
      });

      const result: GeneratedSkill = {
        skillMd,
        metadata,
        codeFiles,
        testFiles,
        dependencies,
        validationResult,
        solanaConfig
      };

      // Auto-save if output directory specified
      if (this.config.outputDir) {
        await this.saveSkillToDirectory(result);
      }

      return result;
      
    } catch (error) {
      console.error(`❌ Skill generation failed: ${error.message}`);
      throw new Error(`Skill generation failed: ${error.message}`);
    }
  }

  /**
   * Generate enhanced skill.md with better prompting
   */
  private async generateEnhancedSkillMd(request: SkillGenerationRequest): Promise<string> {
    const template = this.templates.get(request.framework);
    if (!template) {
      throw new Error(`Template not found for framework: ${request.framework}`);
    }

    const enhancedPrompt = this.buildEnhancedPrompt(request, template);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert AI agent developer and OpenClaw specialist. Your skills are:
          - Deep knowledge of OpenClaw architecture and best practices
          - Expertise in TypeScript, Node.js, and modern development patterns
          - Understanding of AI agent patterns and frameworks
          - Knowledge of Solana blockchain development when applicable
          - Security-first coding practices
          - Performance optimization techniques
          
          Generate production-ready, well-documented, and secure skills that follow all best practices.`
        },
        {
          role: "user", 
          content: enhancedPrompt
        }
      ],
      temperature: 0.2, // Lower for more consistent results
      max_tokens: 4096,
      top_p: 0.9
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    return this.postProcessSkillMd(content, request);
  }

  /**
   * Build enhanced generation prompt
   */
  private buildEnhancedPrompt(request: SkillGenerationRequest, template: SkillTemplate): string {
    const complexityGuidelines = {
      simple: "Focus on single responsibility, minimal dependencies, easy to understand",
      intermediate: "Include error handling, configuration options, moderate complexity",
      advanced: "Full feature set, comprehensive error handling, extensible architecture"
    };

    const frameworkSpecifics = {
      openclaw: "Use OpenClaw conventions, leverage available tools, integrate with OpenClaw ecosystem",
      langchain: "Follow LangChain patterns, use chains and agents appropriately",
      autogen: "Implement multi-agent conversation patterns, use AutoGen framework"
    };

    return `Generate a production-ready ${request.framework} skill for: "${request.description}"

REQUIREMENTS:
- Framework: ${request.framework}
- Features: ${request.features.join(', ')}
- Complexity: ${request.complexity || 'intermediate'}
- Integrations: ${request.integrations?.join(', ') || 'none'}

COMPLEXITY GUIDELINES:
${complexityGuidelines[request.complexity || 'intermediate']}

FRAMEWORK SPECIFICS:
${frameworkSpecifics[request.framework]}

MANDATORY REQUIREMENTS:
1. Include complete YAML frontmatter with all metadata
2. Provide comprehensive documentation with examples
3. Include proper error handling and edge cases
4. Add security considerations and best practices
5. Include performance considerations
6. Provide clear installation and usage instructions
7. Include troubleshooting section
8. Add links to relevant documentation

${request.integrations?.includes('solana') || request.integrations?.includes('jupiter') ? 
'SOLANA REQUIREMENTS:\n- Include proper wallet connection handling\n- Use recommended RPC providers\n- Include transaction error handling\n- Add slippage and fee considerations\n- Include network selection (mainnet/devnet)\n' : ''}

TEMPLATE STRUCTURE:
${template.content}

Generate the complete, production-ready skill.md file:`;
  }

  /**
   * Post-process generated skill content
   */
  private postProcessSkillMd(content: string, request: SkillGenerationRequest): string {
    // Ensure proper frontmatter format
    if (!content.startsWith('---')) {
      content = '---\n' + content;
    }

    // Add AgentForge metadata
    const lines = content.split('\n');
    const frontmatterEnd = lines.findIndex((line, i) => i > 0 && line === '---');
    
    if (frontmatterEnd > 0) {
      lines.splice(frontmatterEnd, 0, `generated_by: AgentForge`);
      lines.splice(frontmatterEnd + 1, 0, `generation_date: ${new Date().toISOString()}`);
      lines.splice(frontmatterEnd + 2, 0, `complexity: ${request.complexity || 'intermediate'}`);
      lines.splice(frontmatterEnd + 3, 0, `features: [${request.features.map(f => `"${f}"`).join(', ')}]`);
    }

    return lines.join('\n');
  }

  /**
   * Generate Solana configuration for blockchain integrations
   */
  private async generateSolanaConfig(request: SkillGenerationRequest): Promise<SolanaConfig> {
    const programs: ProgramConfig[] = [];
    const tokens: TokenConfig[] = [];

    // Add Jupiter program if trading features requested
    if (request.integrations?.includes('jupiter')) {
      programs.push({
        name: 'Jupiter V6',
        address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'
      });
    }

    // Add Pyth if price feeds needed
    if (request.integrations?.includes('pyth')) {
      programs.push({
        name: 'Pyth Oracle',
        address: 'FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH'
      });
    }

    return {
      network: 'devnet', // Start with devnet for safety
      programs,
      tokens
    };
  }

  /**
   * Enhanced metadata parsing with error recovery
   */
  private async parseEnhancedMetadata(skillMd: string, request: SkillGenerationRequest): Promise<SkillMetadata> {
    try {
      const frontmatterMatch = skillMd.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        throw new Error('No frontmatter found in generated skill');
      }

      const frontmatter = frontmatterMatch[1];
      
      // More robust YAML parsing
      const parseField = (field: string, defaultValue: string = '') => {
        const regex = new RegExp(`${field}:\\s*["']?([^"'\\n]+)["']?`, 'i');
        return frontmatter.match(regex)?.[1]?.trim() || defaultValue;
      };

      const name = parseField('name') || this.generateSkillName(request.description);
      const description = parseField('description') || request.description;
      const version = parseField('version', '1.0.0');
      
      return {
        name,
        description,
        version,
        author: 'AgentForge',
        tags: ['generated', 'agentforge', ...request.features],
        agentforge: {
          generated: true,
          quality_score: 0, // Will be filled by validation
          complexity: request.complexity || 'intermediate',
          features: request.features
        }
      };
    } catch (error) {
      console.warn('Metadata parsing failed, using defaults:', error.message);
      return {
        name: this.generateSkillName(request.description),
        description: request.description,
        version: '1.0.0',
        author: 'AgentForge',
        tags: ['generated', 'agentforge', ...request.features],
        agentforge: {
          generated: true,
          quality_score: 0,
          complexity: request.complexity || 'intermediate',
          features: request.features
        }
      };
    }
  }

  /**
   * Generate skill name from description
   */
  private generateSkillName(description: string): string {
    return description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  /**
   * Enhanced validation with security and performance checks
   */
  private async enhancedValidation(skill: GeneratedSkill): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let qualityScore = 100;
    let securityScore = 100;
    let performanceScore = 100;

    // Basic validation
    if (!skill.skillMd.includes('---')) {
      errors.push('Missing YAML frontmatter');
      qualityScore -= 20;
    }

    if (!skill.metadata.name) {
      errors.push('Missing skill name');
      qualityScore -= 15;
    }

    // Security validation
    const securityIssues = this.validateSecurity(skill.skillMd, skill.codeFiles);
    errors.push(...securityIssues.critical);
    warnings.push(...securityIssues.warnings);
    securityScore -= securityIssues.scoreDeduction;

    // Performance validation
    const performanceIssues = this.validatePerformance(skill.skillMd, skill.codeFiles);
    warnings.push(...performanceIssues.warnings);
    suggestions.push(...performanceIssues.suggestions);
    performanceScore -= performanceIssues.scoreDeduction;

    // Documentation quality
    const docScore = this.validateDocumentation(skill.skillMd);
    qualityScore += docScore.bonus;
    suggestions.push(...docScore.suggestions);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, qualityScore),
      security_score: Math.max(0, securityScore),
      performance_score: Math.max(0, performanceScore)
    };
  }

  /**
   * Security validation
   */
  private validateSecurity(skillMd: string, codeFiles: CodeFile[]): {
    critical: string[];
    warnings: string[];
    scoreDeduction: number;
  } {
    const critical: string[] = [];
    const warnings: string[] = [];
    let scoreDeduction = 0;

    const allContent = skillMd + codeFiles.map(f => f.content).join('\n');

    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: /eval\s*\(/, message: 'eval() usage detected - security risk', deduction: 30 },
      { pattern: /exec\s*\(/, message: 'exec() usage detected - potential command injection', deduction: 25 },
      { pattern: /innerHTML\s*=/, message: 'innerHTML usage - potential XSS risk', deduction: 15 },
      { pattern: /process\.env\.\w+/g, message: 'Environment variable usage without validation', deduction: 5 }
    ];

    dangerousPatterns.forEach(({ pattern, message, deduction }) => {
      if (pattern.test(allContent)) {
        critical.push(message);
        scoreDeduction += deduction;
      }
    });

    // Check for missing security practices
    if (!allContent.includes('try') && !allContent.includes('catch')) {
      warnings.push('No error handling detected');
      scoreDeduction += 10;
    }

    return { critical, warnings, scoreDeduction };
  }

  /**
   * Performance validation
   */
  private validatePerformance(skillMd: string, codeFiles: CodeFile[]): {
    warnings: string[];
    suggestions: string[];
    scoreDeduction: number;
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let scoreDeduction = 0;

    const allContent = skillMd + codeFiles.map(f => f.content).join('\n');

    // Check for performance issues
    if (allContent.includes('setInterval') && !allContent.includes('clearInterval')) {
      warnings.push('setInterval without clearInterval - potential memory leak');
      scoreDeduction += 10;
    }

    if (allContent.includes('setTimeout') && allContent.split('setTimeout').length > 5) {
      suggestions.push('Consider using async/await instead of multiple setTimeout calls');
    }

    return { warnings, suggestions, scoreDeduction };
  }

  /**
   * Documentation quality validation
   */
  private validateDocumentation(skillMd: string): {
    bonus: number;
    suggestions: string[];
  } {
    let bonus = 0;
    const suggestions: string[] = [];

    // Check for good documentation practices
    if (skillMd.includes('## Usage') || skillMd.includes('## Example')) {
      bonus += 5;
    }

    if (skillMd.includes('## Installation')) {
      bonus += 3;
    }

    if (skillMd.includes('## Troubleshooting') || skillMd.includes('## FAQ')) {
      bonus += 5;
    }

    if (skillMd.includes('```')) {
      bonus += 3; // Code examples
    }

    if (!skillMd.includes('##')) {
      suggestions.push('Consider adding section headers for better organization');
    }

    return { bonus, suggestions };
  }

  // Additional helper methods...
  private validateRequest(request: SkillGenerationRequest): void {
    if (!request.description?.trim()) {
      throw new Error('Skill description is required');
    }
    
    if (!['openclaw', 'langchain', 'autogen'].includes(request.framework)) {
      throw new Error(`Unsupported framework: ${request.framework}`);
    }
  }

  private async generateEnhancedCodeFiles(request: SkillGenerationRequest, metadata: SkillMetadata): Promise<CodeFile[]> {
    // Implementation for generating enhanced code files
    return [];
  }

  private async generateEnhancedTestFiles(request: SkillGenerationRequest, metadata: SkillMetadata): Promise<TestFile[]> {
    // Implementation for generating enhanced test files
    return [];
  }

  private async extractEnhancedDependencies(skillMd: string, codeFiles: CodeFile[], request: SkillGenerationRequest): Promise<string[]> {
    // Implementation for extracting enhanced dependencies
    return [];
  }

  private async saveSkillToDirectory(skill: GeneratedSkill): Promise<void> {
    if (!this.config.outputDir) return;
    
    const skillDir = path.join(this.config.outputDir, skill.metadata.name);
    await fs.ensureDir(skillDir);
    
    // Save skill.md
    await fs.writeFile(path.join(skillDir, 'SKILL.md'), skill.skillMd);
    
    // Save code files
    for (const file of skill.codeFiles) {
      await fs.writeFile(path.join(skillDir, file.filename), file.content);
    }
    
    // Save test files
    for (const file of skill.testFiles) {
      await fs.writeFile(path.join(skillDir, file.filename), file.content);
    }
    
    // Save metadata
    await fs.writeFile(
      path.join(skillDir, 'metadata.json'), 
      JSON.stringify(skill.metadata, null, 2)
    );
  }

  /**
   * Initialize enhanced skill templates
   */
  private initializeEnhancedTemplates(): void {
    this.templates.set('openclaw', {
      name: 'OpenClaw Skill Template',
      content: `---
name: skill-name
description: Brief description of what this skill does
version: 1.0.0
author: AgentForge
category: "general"
tags: ["tag1", "tag2"]
complexity: intermediate
requirements:
  node: ">=18.0.0"
  openclaw: ">=2.0.0"
dependencies: {}
---

# Skill Name

Brief description of the skill and its purpose.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
# Installation instructions
\`\`\`

## Usage

\`\`\`javascript
// Basic usage example
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | "default" | Description |

## API Reference

### Functions

#### functionName(param)

Description of the function.

**Parameters:**
- \`param\` (type): Description

**Returns:** Return type and description

**Example:**
\`\`\`javascript
// Example usage
\`\`\`

## Error Handling

Common errors and how to handle them.

## Performance Considerations

Tips for optimal performance.

## Security Notes

Security considerations and best practices.

## Troubleshooting

Common issues and solutions.

## Contributing

How to contribute to this skill.

## License

License information.
`
    });
  }
}

// Template interface
interface SkillTemplate {
  name: string;
  content: string;
}

export default AgentForgeEnhanced;