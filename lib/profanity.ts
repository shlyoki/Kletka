const bannedWords = ['badword'];

export function isClean(text: string) {
  const lower = text.toLowerCase();
  return !bannedWords.some((word) => lower.includes(word));
}

export function sanitize(text: string) {
  if (!process.env.ENABLE_PROFANITY_FILTER || process.env.ENABLE_PROFANITY_FILTER === 'false') {
    return text;
  }
  let output = text;
  for (const word of bannedWords) {
    const regex = new RegExp(word, 'gi');
    output = output.replace(regex, '***');
  }
  return output;
}
