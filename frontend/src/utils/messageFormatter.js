/**
 * This file contains functions that format chat messages with styling
 * to make them look nicer, like in ChatGPT.
 */

/**
 * Formats plain text into HTML with styling
 * 
 * @param {string} text - The raw text message from the chatbot
 * @return {string} - HTML formatted text ready for display
 */
export const formatChatMessage = (text) => {
  // If there's no text, return empty string
  if (!text) return '';
  
  // Step 1: Start with the original text
  let formattedText = text;
  
  // Step 2: Create paragraphs by replacing double line breaks
  // Example: "Hello\n\nWorld" becomes "<p>Hello</p><p>World</p>"
  formattedText = formattedText.replace(/\n\n/g, '</p><p>');
  
  // Step 2.5: Handle inline numbered lists (e.g., "1. Item one 2. Item two")
  // First, add line breaks before numbered items that aren't at the start of a line
  formattedText = formattedText.replace(/(\S)\s+(\d+)\.\s+/g, '$1\n$2. ');
  
  // Step 3: Format numbered lists (like "1. Item one")
  // This finds lines that start with a number followed by a period and adds HTML list formatting
  formattedText = formattedText.replace(
    /^\s*(\d+)\.\s+(.+)$/gm, 
    '<li class="numbered-item"><span class="list-number">$1.</span>$2</li>'
  );
  
  // Step 4: Format bullet lists (like "- Item one" or "• Item one")
  formattedText = formattedText.replace(
    /^\s*[-•*]\s+(.+)$/gm, 
    '<li class="bullet-item">$1</li>'
  );
  
  // Step 5: Format code blocks (text between triple backticks ```code```)
  formattedText = formattedText.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Step 6: Format inline code (text between single backticks `code`)
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Step 7: Format bold text (text between double asterisks **bold**)
  formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Step 8: Format italic text (text between single asterisks *italic*)
  formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Step 9: Format headings (lines starting with #)
  formattedText = formattedText.replace(/^#+\s+(.+)$/gm, '<h3>$1</h3>');
  
  // Step 10: Group consecutive numbered list items into an ordered list
  // This is more complex, but it basically finds sequences of numbered items
  // and wraps them in <ol> tags (ordered list)
  formattedText = formattedText.replace(
    /<li class="numbered-item">(.+?)<\/li>(\s*<li class="numbered-item">(.+?)<\/li>)+/g, 
    '<ol>$&</ol>'
  );
  formattedText = formattedText.replace(/<\/li><ol>/g, '</li>');
  formattedText = formattedText.replace(/<\/ol>\s*<li/g, '</ol><li');
  
  // Step 11: Group consecutive bullet list items into an unordered list
  // Similar to above, but for bullet points using <ul> tags (unordered list)
  formattedText = formattedText.replace(
    /<li class="bullet-item">(.+?)<\/li>(\s*<li class="bullet-item">(.+?)<\/li>)+/g, 
    '<ul>$&</ul>'
  );
  formattedText = formattedText.replace(/<\/li><ul>/g, '</li>');
  formattedText = formattedText.replace(/<\/ul>\s*<li/g, '</ul><li');
  
  // Step 12: Wrap the whole text in paragraph tags if not already wrapped
  if (!formattedText.startsWith('<p>')) {
    formattedText = `<p>${formattedText}</p>`;
  }
  
  return formattedText;
};

/**
 * Helper function that lets us safely insert HTML content into React
 * 
 * @param {string} html - The HTML string to be inserted
 * @return {Object} - Object with __html property that React's dangerouslySetInnerHTML accepts
 */
export const createMarkup = (html) => {
  return { __html: html };
};
