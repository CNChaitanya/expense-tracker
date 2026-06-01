export const fetchAIResponse = async (messages: any[], financialSummary: string) => {
  const apiKey = localStorage.getItem('exp-anthropic-key');
  if (!apiKey) {
    throw new Error("API Key not found. Please enter it in Settings.");
  }

  const systemPrompt = `You are FinanceAI, a personal financial advisor and coach integrated into ExpTracker, an expense tracking app. You have access to the user's financial summary: ${financialSummary}. Be concise, friendly, and practical. Use ₹ for amounts. Give specific actionable advice based on their actual data. Topics you help with: budgeting, saving strategies, investment basics, reducing expenses, financial goals, understanding spending patterns. Keep responses under 200 words unless the user asks for detailed explanation.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true'
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "AI response failed");
  }

  const data = await response.json();
  return data.content[0].text;
};
