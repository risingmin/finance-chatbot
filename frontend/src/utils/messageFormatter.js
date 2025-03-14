/**
 * Formats chat messages with proper styling similar to ChatGPT
 * 
 * Handles:
 * - Lists (numbered and bullet)
 * - Headings
 * - Bold/Italic text
 * - Code blocks
 * - Newlines and paragraphs
 * - Indentation
 */
export const formatChatMessage = (text) => {
  if (!text) return '';
  
  // Replace single newlines between paragraphs with proper spacing
  let formattedText = text.replace(/\n\n/g, '</p><p>');
  
  // Format numbered lists
  formattedText = formattedText.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="numbered-item"><span class="list-number">$1.</span>$2</li>');
  
  // Format bullet lists
  formattedText = formattedText.replace(/^\s*[-•*]\s+(.+)$/gm, '<li class="bullet-item">$1</li>');
  
  // Format code blocks
  formattedText = formattedText.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Format inline code
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Format bold text
  formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Format italic text
  formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Format headings
  formattedText = formattedText.replace(/^#+\s+(.+)$/gm, '<h3>$1</h3>');
  
  // Group consecutive list items
  formattedText = formattedText.replace(/<li class="numbered-item">(.+?)<\/li>(\s*<li class="numbered-item">(.+?)<\/li>)+/g, 
    '<ol>$&</ol>').replace(/<\/li><ol>/g, '</li>').replace(/<\/ol>\s*<li/g, '</ol><li');
  
  formattedText = formattedText.replace(/<li class="bullet-item">(.+?)<\/li>(\s*<li class="bullet-item">(.+?)<\/li>)+/g, 
    '<ul>$&</ul>').replace(/<\/li><ul>/g, '</li>').replace(/<\/ul>\s*<li/g, '</ul><li');
  
  // Wrap in paragraphs if not already wrapped
  if (!formattedText.startsWith('<p>')) {
    formattedText = `<p>${formattedText}</p>`;
  }
  
  return formattedText;
};

/**
 * Helper function to safely insert HTML content
 */
export const createMarkup = (html) => {
  return { __html: html };
};
