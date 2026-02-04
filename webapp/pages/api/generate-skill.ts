import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description, framework, features, complexity, claudeModel } = req.body;

    if (!description || !framework) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate skill using Claude
    const prompt = `Generate a complete AI agent skill for the ${framework} framework.

Description: ${description}
Framework: ${framework}
Features: ${features?.join(', ') || 'basic functionality'}
Complexity: ${complexity || 'intermediate'}

Create a production-ready skill including:
1. Complete skill.md with proper metadata
2. Main implementation code 
3. TypeScript interfaces if needed
4. Error handling and validation
5. Usage examples
6. Solana integration if relevant

Format as a JSON response with:
- skillMd: the complete skill.md content
- codeFiles: array of {filename, content, type}
- metadata: {name, description, version, author, tags}
- dependencies: required packages
- generationStats: {model, timestamp}

Make it production-ready and follow best practices for ${framework}.`;

    console.log('🤖 Generating skill with Claude...');
    
    const completion = await anthropic.messages.create({
      model: claudeModel || 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = completion.content[0].type === 'text' ? completion.content[0].text : '';
    
    // Try to parse as JSON, fallback to text response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // If not JSON, create a structured response
      result = {
        skillMd: responseText,
        metadata: {
          name: description.split(' ').slice(0, 3).join('-').toLowerCase(),
          description: description,
          version: '1.0.0',
          author: 'AgentForge',
          tags: [framework, ...features?.slice(0, 3) || []]
        },
        codeFiles: [{
          filename: 'index.ts',
          content: responseText,
          type: 'typescript'
        }],
        dependencies: ['@anthropic-ai/sdk'],
        generationStats: {
          model: claudeModel || 'claude-3-haiku-20240307',
          timestamp: new Date().toISOString(),
          tokensUsed: completion.usage?.input_tokens || 0
        }
      };
    }

    console.log('✅ Skill generated successfully');
    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Error generating skill:', error);
    res.status(500).json({ 
      error: 'Failed to generate skill',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}