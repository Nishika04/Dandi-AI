export async function POST(request) {
  const VALID_API_KEY = process.env.GITHUB_SUMMARIZER_API_KEY || 'your-secret-api-key'; // Set your key in env
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey || apiKey !== VALID_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Success response (expand logic as needed)
  return new Response(JSON.stringify({ message: 'API key validated. Ready for summarization.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 