# AgentForge Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   cd webapp && npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run Web Interface**
   ```bash
   npm run webapp
   # Open http://localhost:3000
   ```

4. **Run CLI Tool**
   ```bash
   npm start
   ```

## Deployment Options

### Vercel (Recommended for Web App)
```bash
cd webapp
vercel --prod
```

### Docker
```bash
docker build -t agentforge .
docker run -p 3000:3000 agentforge
```

### Traditional Server
```bash
cd webapp
npm run build
npm start
```

## Environment Variables

- `OPENAI_API_KEY`: Required for skill generation
- `SOLANA_RPC_URL`: Solana RPC endpoint  
- `AGENTFORGE_OUTPUT_DIR`: Where to save generated skills

## Support

- Documentation: README.md
- Issues: GitHub repository
- Demo: Live web interface
