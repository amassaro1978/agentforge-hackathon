/**
 * AgentForge Core - Code Generation Engine
 * The autonomous development assistant for AI agents
 */

import OpenAI from 'openai';

// Core interfaces for AgentForge
export interface SkillGenerationRequest {
  description: string;
  framework: 'openclaw' | 'langchain' | 'autogen';
  features: string[];
  integrations?: string[];
  complexity?: 'simple' | 'intermediate' | 'advanced';
}

export interface GeneratedSkill {
  skillMd: string;
  metadata: SkillMetadata;
  codeFiles: CodeFile[];
  dependencies: string[];
  testFiles: TestFile[];
  validationResult: ValidationResult;
}

export interface SkillMetadata {
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  homepage?: string;
  dependencies?: Record<string, string>;
}

export interface CodeFile {
  filename: string;
  content: string;
  type: 'typescript' | 'javascript' | 'python' | 'rust' | 'markdown';
}

export interface TestFile {
  filename: string;
  content: string;
  type: 'unit' | 'integration' | 'e2e';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number; // 0-100 quality score
}

/**
 * Core code generation engine for AgentForge
 */
export class AgentForgeCodeGen {
  private openai: OpenAI;
  private templates: Map<string, string> = new Map();

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.initializeTemplates();
  }

  /**
   * Generate a complete skill from natural language description
   */
  async generateSkill(request: SkillGenerationRequest): Promise<GeneratedSkill> {
    try {
      console.log(`🔥 Generating ${request.framework} skill: ${request.description}`);
      
      // Generate the skill.md file
      const skillMd = await this.generateSkillMd(request);
      
      // Parse metadata from generated skill
      const metadata = this.parseSkillMetadata(skillMd);
      
      // Generate supporting code files
      const codeFiles = await this.generateCodeFiles(request, metadata);
      
      // Generate test files
      const testFiles = await this.generateTestFiles(request, metadata);
      
      // Extract dependencies
      const dependencies = this.extractDependencies(skillMd, codeFiles);
      
      // Validate the generated skill
      const validationResult = await this.validateSkill({
        skillMd,
        metadata,
        codeFiles,
        testFiles,
        dependencies,
        validationResult: { isValid: true, errors: [], warnings: [], suggestions: [], score: 0 }
      });

      return {
        skillMd,
        metadata,
        codeFiles,
        testFiles,
        dependencies,
        validationResult
      };
      
    } catch (error) {
      throw new Error(`Skill generation failed: ${error.message}`);
    }
  }

  /**
   * Generate the main skill.md file
   */
  private async generateSkillMd(request: SkillGenerationRequest): Promise<string> {
    const prompt = this.buildSkillGenerationPrompt(request);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI agent developer. Generate high-quality, production-ready OpenClaw skills."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return response.choices[0].message.content || '';
  }

  /**
   * Build the prompt for skill generation
   */
  private buildSkillGenerationPrompt(request: SkillGenerationRequest): string {
    const template = this.templates.get(request.framework) || this.templates.get('openclaw')!;
    
    return `Generate a complete OpenClaw skill.md file for: "${request.description}"

Requirements:
- Framework: ${request.framework}
- Features: ${request.features.join(', ')}
- Complexity: ${request.complexity || 'intermediate'}
${request.integrations ? `- Integrations: ${request.integrations.join(', ')}` : ''}

The skill should:
1. Include proper YAML frontmatter with name, description, metadata
2. Be production-ready and well-documented
3. Include example usage and clear instructions
4. Follow OpenClaw skill conventions
5. Include error handling and best practices
6. Be immediately usable by other agents

Template structure:
${template}

Generate the complete skill.md file:`;
  }

  /**
   * Generate supporting code files
   */
  private async generateCodeFiles(request: SkillGenerationRequest, metadata: SkillMetadata): Promise<CodeFile[]> {
    if (request.complexity === 'simple') {
      return []; // Simple skills are self-contained in skill.md
    }

    const files: CodeFile[] = [];

    // Generate main implementation file if needed
    if (request.features.includes('api') || request.features.includes('complex-logic')) {
      const implPrompt = `Generate a TypeScript implementation file for the ${metadata.name} skill.
      
Description: ${metadata.description}
Features: ${request.features.join(', ')}

Create a well-structured, documented TypeScript file with:
- Clear interface definitions
- Error handling
- Type safety
- Modular design
- Best practices

Generate the implementation:`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: implPrompt }],
        temperature: 0.3,
        max_tokens: 3000
      });

      files.push({
        filename: `${metadata.name.toLowerCase().replace(/\s+/g, '-')}.ts`,
        content: response.choices[0].message.content || '',
        type: 'typescript'
      });
    }

    return files;
  }

  /**
   * Generate test files
   */
  private async generateTestFiles(request: SkillGenerationRequest, metadata: SkillMetadata): Promise<TestFile[]> {
    const testPrompt = `Generate comprehensive test cases for the ${metadata.name} skill.

Description: ${metadata.description}
Features: ${request.features.join(', ')}

Create Jest/TypeScript test file with:
- Unit tests for core functionality
- Edge case testing
- Error condition testing
- Integration tests if applicable
- Clear test descriptions

Generate the test file:`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: testPrompt }],
      temperature: 0.3,
      max_tokens: 2000
    });

    return [{
      filename: `${metadata.name.toLowerCase().replace(/\s+/g, '-')}.test.ts`,
      content: response.choices[0].message.content || '',
      type: 'unit'
    }];
  }

  /**
   * Parse skill metadata from skill.md frontmatter
   */
  private parseSkillMetadata(skillMd: string): SkillMetadata {
    const frontmatterMatch = skillMd.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error('No frontmatter found in generated skill');
    }

    // Simple YAML parsing (would use proper YAML parser in production)
    const frontmatter = frontmatterMatch[1];
    const name = frontmatter.match(/name:\s*(.+)/)?.[1]?.trim() || 'unnamed-skill';
    const description = frontmatter.match(/description:\s*(.+)/)?.[1]?.trim() || '';
    const version = frontmatter.match(/version:\s*(.+)/)?.[1]?.trim() || '1.0.0';
    
    return {
      name,
      description,
      version,
      author: 'AgentForge',
      tags: ['generated', 'agentforge']
    };
  }

  /**
   * Extract dependencies from generated code
   */
  private extractDependencies(skillMd: string, codeFiles: CodeFile[]): string[] {
    const deps = new Set<string>();
    
    // Extract from skill.md
    const importMatches = skillMd.matchAll(/import.*from ['"]([^'"]+)['"]/g);
    for (const match of importMatches) {
      deps.add(match[1]);
    }
    
    // Extract from code files
    for (const file of codeFiles) {
      const fileImports = file.content.matchAll(/import.*from ['"]([^'"]+)['"]/g);
      for (const match of fileImports) {
        deps.add(match[1]);
      }
    }
    
    return Array.from(deps);
  }

  /**
   * Validate the generated skill
   */
  async validateSkill(skill: GeneratedSkill): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check for required components
    if (!skill.skillMd.includes('---')) {
      errors.push('Missing YAML frontmatter');
      score -= 20;
    }

    if (!skill.metadata.name) {
      errors.push('Missing skill name');
      score -= 15;
    }

    if (!skill.metadata.description) {
      warnings.push('Missing or empty description');
      score -= 5;
    }

    // Check for best practices
    if (!skill.skillMd.includes('## Usage') && !skill.skillMd.includes('## Example')) {
      suggestions.push('Consider adding usage examples');
      score -= 10;
    }

    if (skill.dependencies.length === 0 && skill.codeFiles.length > 0) {
      warnings.push('No dependencies detected but code files present');
    }

    // Security check (basic)
    if (skill.skillMd.includes('eval(') || skill.skillMd.includes('exec(')) {
      errors.push('Potential security risk: eval/exec usage detected');
      score -= 30;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score)
    };
  }

  /**
   * Initialize skill templates for different frameworks
   */
  private initializeTemplates(): void {
    this.templates.set('openclaw', `---
name: skill-name
description: Brief description of what this skill does
version: 1.0.0
metadata: 
  category: "general"
  tags: ["tag1", "tag2"]
---

# Skill Name

Brief description of the skill and its purpose.

## Usage

Instructions on how to use this skill.

## Example

\`\`\`javascript
// Example usage
\`\`\`

## API Reference

Document any functions, endpoints, or interfaces.

## Error Handling

How errors are handled and common issues.
`);

    // Add more templates for other frameworks as needed
    this.templates.set('langchain', '<!-- LangChain skill template -->');
    this.templates.set('autogen', '<!-- AutoGen skill template -->');
  }
}

/**
 * CLI interface for AgentForge
 */
export class AgentForgeCLI {
  private codeGen: AgentForgeCodeGen;

  constructor(openaiApiKey: string) {
    this.codeGen = new AgentForgeCodeGen(openaiApiKey);
  }

  /**
   * Generate a skill from command line
   */
  async generateSkillCommand(
    description: string,
    options: {
      framework?: string;
      features?: string[];
      output?: string;
      complexity?: string;
    } = {}
  ): Promise<void> {
    try {
      console.log('🔨 AgentForge - Generating skill...');
      
      const request: SkillGenerationRequest = {
        description,
        framework: (options.framework as any) || 'openclaw',
        features: options.features || ['basic'],
        complexity: (options.complexity as any) || 'intermediate'
      };

      const skill = await this.codeGen.generateSkill(request);
      
      // Output results
      console.log('\n✅ Skill generated successfully!');
      console.log(`📝 Name: ${skill.metadata.name}`);
      console.log(`📄 Description: ${skill.metadata.description}`);
      console.log(`🔢 Quality Score: ${skill.validationResult.score}/100`);
      
      if (skill.validationResult.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        skill.validationResult.warnings.forEach(w => console.log(`  - ${w}`));
      }
      
      if (skill.validationResult.suggestions.length > 0) {
        console.log('\n💡 Suggestions:');
        skill.validationResult.suggestions.forEach(s => console.log(`  - ${s}`));
      }

      // Save to file if output specified
      if (options.output) {
        await this.saveSkillToFile(skill, options.output);
        console.log(`\n💾 Saved to: ${options.output}`);
      }
      
    } catch (error) {
      console.error('❌ Generation failed:', error.message);
    }
  }

  /**
   * Save generated skill to file
   */
  private async saveSkillToFile(skill: GeneratedSkill, outputPath: string): Promise<void> {
    // In a real implementation, would use fs.writeFileSync
    console.log(`Saving skill to ${outputPath}...`);
  }
}

// Export main classes
export default AgentForgeCodeGen;