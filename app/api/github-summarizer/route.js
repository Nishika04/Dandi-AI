export async function POST(request) {
  const VALID_API_KEY = process.env.GITHUB_SUMMARIZER_API_KEY || 'your-secret-api-key';
  const apiKey = request.headers.get('x-api-key');

  // Debug logging for API key comparison
  console.log('Received API key:', apiKey);
  console.log('Expected API key:', VALID_API_KEY);

  if (!apiKey || apiKey !== VALID_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const githubUrl = body.githubUrl;
    if (!githubUrl) {
      return new Response(JSON.stringify({ error: 'Missing githubUrl in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const readmeContent = await getReadmeContent(githubUrl);
    if (!readmeContent) {
      return new Response(JSON.stringify({ error: 'Could not fetch README.md from the repository' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use the summarizerChain to get the summary and cool_facts
    const result = await summarizerChain.invoke({ readmeContent });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
// If an unexpected error occurs during API key validation, handle it gracefully
export async function middleware(request) {
  try {
    const VALID_API_KEY = process.env.GITHUB_SUMMARIZER_API_KEY || 'your-secret-api-key';
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey || apiKey !== VALID_API_KEY) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Continue to next handler or logic if needed
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
async function getReadmeContent(githubUrl) {
  // Extract owner and repo from the GitHub URL
  // Example: https://github.com/owner/repo
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/i);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    const owner = match[1];
    const repo = match[2];

    // Try to fetch the README from the main branch, then fallback to master if not found
    const branches = ['main', 'master'];
    let response, readmeUrl;
    for (const branch of branches) {
      readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      response = await fetch(readmeUrl);
      if (response.ok) {
        return await response.text();
      }
    }
    throw new Error('README.md not found in main or master branch');
  } catch (error) {
    return null; // or throw error if you want to propagate
  }
}
async function getAndLogReadmeContent(githubUrl) {
  const content = await getReadmeContent(githubUrl);
  console.log('Fetched README content:', content);
  return content;
}
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Define strict schema for the output
const repoSummarySchema = z.object({
  summary: z.string().describe("A concise summary of the repository based on its README"),
  cool_facts: z
    .array(z.string())
    .describe("A list of 3-5 interesting or unique facts about the repository"),
});

// Prompt template
const summarizerPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Summarize this GitHub repository from its README file content. " +
      "Return your answer as an object with two fields: 'summary' (a concise summary string) and 'cool_facts' (an array of 3-5 interesting facts about the repository).",
  ],
  ["human", "{readmeContent}"],
]);

// LLM instance (ensure your environment has the right API key)
const llm = new ChatOpenAI({
  temperature: 0.2,
  model: "gpt-3.5-turbo", // or another model you have access to
});

// Bind the schema to the model for strict structured output
const llmWithStructuredOutput = llm.withStructuredOutput(repoSummarySchema, {
  name: "repo_summary",
  strict: true,
});

// The chain: prompt -> llmWithStructuredOutput
const summarizerChain = summarizerPrompt.pipe(llmWithStructuredOutput);

// Usage example:
// const result = await summarizerChain.invoke({ readmeContent: "README CONTENT HERE" });
// result.summary -> string
// result.cool_facts -> array of strings

