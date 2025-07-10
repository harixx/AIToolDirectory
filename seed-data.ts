import { db } from './server/db';
import { categories, tools } from './shared/schema';

async function seedData() {
  try {
    console.log('Adding sample data...');

    // Sample tools data
    const sampleTools = [
      {
        name: 'ChatGPT',
        slug: 'chatgpt',
        shortDescription: 'Advanced conversational AI that can help with writing, analysis, coding, and creative tasks',
        longDescription: 'ChatGPT is OpenAI\'s flagship conversational AI model that can engage in natural language conversations, help with writing tasks, provide explanations, assist with coding, and much more. It\'s trained on diverse internet text and can adapt to various communication styles and tasks.',
        website: 'https://chat.openai.com',
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
        pricingModel: 'Freemium',
        difficultyLevel: 'Beginner',
        categoryId: 3, // AI Code Tools
        keyFeatures: JSON.stringify([
          'Natural language conversations',
          'Code generation and debugging',
          'Writing assistance',
          'Data analysis',
          'Creative writing',
          'Problem solving'
        ]),
        targetAudience: JSON.stringify([
          'Developers',
          'Content creators',
          'Students',
          'Business professionals',
          'Researchers'
        ]),
        integrations: JSON.stringify([
          'OpenAI API',
          'Third-party plugins',
          'Browser extensions',
          'Mobile apps'
        ]),
        easeOfUseScore: 4.8,
        featuresScore: 4.9,
        supportScore: 4.2,
        pricingScore: 4.0,
        integrationScore: 4.6,
        overallScore: 4.5,
        status: 'live',
        isVerified: true,
        isFeatured: true,
        views: 15420
      },
      {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        shortDescription: 'AI pair programmer that helps you write code faster with intelligent suggestions',
        longDescription: 'GitHub Copilot is an AI coding assistant that provides intelligent code suggestions directly in your editor. Powered by OpenAI Codex, it helps developers write code faster by suggesting whole lines or blocks of code as you type.',
        website: 'https://github.com/features/copilot',
        featuredImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
        pricingModel: 'Paid',
        difficultyLevel: 'Intermediate',
        categoryId: 3, // AI Code Tools
        keyFeatures: JSON.stringify([
          'Code completion',
          'Multi-language support',
          'Context-aware suggestions',
          'Documentation generation',
          'Code refactoring',
          'Test case generation'
        ]),
        targetAudience: JSON.stringify([
          'Software developers',
          'DevOps engineers',
          'Data scientists',
          'Web developers',
          'Mobile developers'
        ]),
        integrations: JSON.stringify([
          'Visual Studio Code',
          'JetBrains IDEs',
          'Neovim',
          'Visual Studio',
          'Xcode'
        ]),
        easeOfUseScore: 4.7,
        featuresScore: 4.8,
        supportScore: 4.4,
        pricingScore: 3.8,
        integrationScore: 4.9,
        overallScore: 4.5,
        status: 'live',
        isVerified: true,
        isFeatured: true,
        views: 12850
      },
      {
        name: 'Midjourney',
        slug: 'midjourney',
        shortDescription: 'AI image generation tool that creates stunning artwork from text descriptions',
        longDescription: 'Midjourney is an independent research lab that produces an AI program that creates images from textual descriptions. It\'s known for producing high-quality, artistic images with a distinctive style.',
        website: 'https://midjourney.com',
        featuredImage: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=300&fit=crop',
        pricingModel: 'Freemium',
        difficultyLevel: 'Beginner',
        categoryId: 2, // AI Image Tools
        keyFeatures: JSON.stringify([
          'Text-to-image generation',
          'High-quality artwork',
          'Style variations',
          'Upscaling capabilities',
          'Community gallery',
          'Discord integration'
        ]),
        targetAudience: JSON.stringify([
          'Digital artists',
          'Content creators',
          'Marketers',
          'Game developers',
          'Social media managers'
        ]),
        integrations: JSON.stringify([
          'Discord Bot',
          'Web interface',
          'API access',
          'Mobile apps'
        ]),
        easeOfUseScore: 4.3,
        featuresScore: 4.7,
        supportScore: 4.0,
        pricingScore: 3.9,
        integrationScore: 4.2,
        overallScore: 4.2,
        status: 'live',
        isVerified: true,
        isFeatured: true,
        views: 18200
      },
      {
        name: 'Stable Diffusion',
        slug: 'stable-diffusion',
        shortDescription: 'Open-source AI image generator that runs locally with full control and customization',
        longDescription: 'Stable Diffusion is a deep learning, text-to-image model that can generate detailed images from text descriptions. It\'s open-source and can be run locally, giving users full control over the generation process.',
        website: 'https://stability.ai/stablediffusion',
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        pricingModel: 'Free',
        difficultyLevel: 'Expert',
        categoryId: 2, // AI Image Tools
        keyFeatures: JSON.stringify([
          'Open-source model',
          'Local installation',
          'Customizable parameters',
          'Multiple interfaces',
          'Community models',
          'Commercial use allowed'
        ]),
        targetAudience: JSON.stringify([
          'AI researchers',
          'Technical artists',
          'Developers',
          'Students',
          'Open-source enthusiasts'
        ]),
        integrations: JSON.stringify([
          'Automatic1111',
          'ComfyUI',
          'InvokeAI',
          'DiffusionBee',
          'Hugging Face'
        ]),
        easeOfUseScore: 3.2,
        featuresScore: 4.8,
        supportScore: 4.5,
        pricingScore: 5.0,
        integrationScore: 4.7,
        overallScore: 4.4,
        status: 'live',
        isVerified: true,
        isFeatured: true,
        views: 9630
      },
      {
        name: 'Cursor',
        slug: 'cursor',
        shortDescription: 'AI-powered code editor built for productivity with intelligent code completion',
        longDescription: 'Cursor is an AI-first code editor designed to make you extraordinarily productive. It combines the familiar VS Code interface with powerful AI capabilities for code generation, editing, and debugging.',
        website: 'https://cursor.sh',
        featuredImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
        pricingModel: 'Freemium',
        difficultyLevel: 'Intermediate',
        categoryId: 3, // AI Code Tools
        keyFeatures: JSON.stringify([
          'AI code completion',
          'Natural language editing',
          'Code generation',
          'Debugging assistance',
          'Multi-file editing',
          'VS Code compatibility'
        ]),
        targetAudience: JSON.stringify([
          'Software developers',
          'Full-stack developers',
          'Frontend developers',
          'Backend developers',
          'Startup founders'
        ]),
        integrations: JSON.stringify([
          'VS Code extensions',
          'Git integration',
          'Terminal',
          'Multiple language servers'
        ]),
        easeOfUseScore: 4.6,
        featuresScore: 4.7,
        supportScore: 4.3,
        pricingScore: 4.1,
        integrationScore: 4.8,
        overallScore: 4.5,
        status: 'live',
        isVerified: true,
        isFeatured: true,
        views: 7420
      },
      {
        name: 'Claude',
        slug: 'claude',
        shortDescription: 'Constitutional AI assistant focused on being helpful, harmless, and honest',
        longDescription: 'Claude is an AI assistant created by Anthropic. It\'s designed to be helpful, harmless, and honest, with strong capabilities in analysis, writing, math, coding, and creative tasks.',
        website: 'https://claude.ai',
        featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        pricingModel: 'Freemium',
        difficultyLevel: 'Beginner',
        categoryId: 3, // AI Code Tools
        keyFeatures: JSON.stringify([
          'Long-form conversations',
          'Code analysis',
          'Research assistance',
          'Writing help',
          'Mathematical reasoning',
          'Document analysis'
        ]),
        targetAudience: JSON.stringify([
          'Researchers',
          'Writers',
          'Students',
          'Analysts',
          'Developers'
        ]),
        integrations: JSON.stringify([
          'Web interface',
          'API access',
          'Third-party tools'
        ]),
        easeOfUseScore: 4.7,
        featuresScore: 4.6,
        supportScore: 4.4,
        pricingScore: 4.2,
        integrationScore: 4.1,
        overallScore: 4.4,
        status: 'live',
        isVerified: true,
        isFeatured: false,
        views: 5280
      },
      {
        name: 'Runway ML',
        slug: 'runway-ml',
        shortDescription: 'AI video generation and editing platform for creative professionals',
        longDescription: 'Runway ML is an applied AI research company that develops creative tools for video, image, and audio generation. It offers a suite of AI-powered tools for content creation and editing.',
        website: 'https://runwayml.com',
        featuredImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
        pricingModel: 'Freemium',
        difficultyLevel: 'Intermediate',
        categoryId: 1, // AI Video Tools
        keyFeatures: JSON.stringify([
          'AI video generation',
          'Video editing tools',
          'Green screen removal',
          'Object removal',
          'Style transfer',
          'Audio generation'
        ]),
        targetAudience: JSON.stringify([
          'Video editors',
          'Content creators',
          'Filmmakers',
          'Social media managers',
          'Marketing professionals'
        ]),
        integrations: JSON.stringify([
          'Adobe Premiere',
          'After Effects',
          'Photoshop',
          'Web browser'
        ]),
        easeOfUseScore: 4.0,
        featuresScore: 4.5,
        supportScore: 4.1,
        pricingScore: 3.7,
        integrationScore: 4.3,
        overallScore: 4.1,
        status: 'live',
        isVerified: true,
        isFeatured: false,
        views: 6150
      },
      {
        name: 'Perplexity AI',
        slug: 'perplexity-ai',
        shortDescription: 'AI-powered search engine that provides accurate answers with sources',
        longDescription: 'Perplexity AI is an AI-powered search engine that provides accurate, real-time answers to questions with proper citations and sources. It combines the power of large language models with web search.',
        website: 'https://perplexity.ai',
        featuredImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop',
        pricingModel: 'Freemium',
        difficultyLevel: 'Beginner',
        categoryId: 3, // AI Code Tools
        keyFeatures: JSON.stringify([
          'Real-time search',
          'Source citations',
          'Follow-up questions',
          'Multiple search modes',
          'Academic papers',
          'Mobile app'
        ]),
        targetAudience: JSON.stringify([
          'Researchers',
          'Students',
          'Journalists',
          'Professionals',
          'Anyone seeking information'
        ]),
        integrations: JSON.stringify([
          'Web interface',
          'Mobile apps',
          'Browser extensions',
          'API access'
        ]),
        easeOfUseScore: 4.8,
        featuresScore: 4.4,
        supportScore: 4.2,
        pricingScore: 4.3,
        integrationScore: 4.0,
        overallScore: 4.3,
        status: 'live',
        isVerified: true,
        isFeatured: false,
        views: 8920
      }
    ];

    // Insert sample tools
    for (const tool of sampleTools) {
      await db.insert(tools).values(tool);
    }

    console.log(`Added ${sampleTools.length} sample tools successfully!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();