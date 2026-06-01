

export const parseMarkdown = (text: string) => {
  if (!text) return null;

  // Split into lines
  const lines = text.split('\n');
  
  return lines.map((line, i) => {
    let content: any = line;

    // Bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    if (boldRegex.test(line)) {
      const parts = line.split(boldRegex);
      content = parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-black text-white">{part}</strong> : part);
    }

    // Italic *text*
    const italicRegex = /\*(.*?)\*/g;
    if (typeof content === 'string' && italicRegex.test(content)) {
       const parts = content.split(italicRegex);
       content = parts.map((part, j) => j % 2 === 1 ? <em key={j} className="italic opacity-80">{part}</em> : part);
    }

    // Lists
    if (line.trim().startsWith('- ')) {
       return <li key={i} className="ml-4 list-disc text-sm">{content.replace('- ', '')}</li>;
    }

    return <p key={i} className="text-sm leading-relaxed">{content}</p>;
  });
};
