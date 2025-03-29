import axios from 'axios';

export async function getAIGuide(language: string): Promise<string> {
  const response = await axios.post('/api/ai/guide', { language });
  return response.data.guide;
}
