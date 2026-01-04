/**
 * Simple HTML renderer for React Native
 * Converts HTML to formatted Text components
 */

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Palette, Spacing } from '@/constants/theme';

interface HTMLRendererProps {
  html: string;
  baseStyle?: any;
  isYoruba?: boolean; // Flag to indicate if content is in Yoruba
  getScaledSize?: (baseSize: number) => number; // Function to scale font sizes
}

/**
 * Strips HTML tags and returns plain text
 */
export const stripHTML = (html: string): string => {
  if (!html) return '';
  
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<ol[^>]*>/gi, '')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<strong[^>]*>/gi, '')
    .replace(/<\/strong>/gi, '')
    .replace(/<b[^>]*>/gi, '')
    .replace(/<\/b>/gi, '')
    .replace(/<em[^>]*>/gi, '')
    .replace(/<\/em>/gi, '')
    .replace(/<i[^>]*>/gi, '')
    .replace(/<\/i>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<h1[^>]*>/gi, '\n\n')
    .replace(/<\/h1>/gi, '\n\n')
    .replace(/<h2[^>]*>/gi, '\n\n')
    .replace(/<\/h2>/gi, '\n\n')
    .replace(/<h3[^>]*>/gi, '\n\n')
    .replace(/<\/h3>/gi, '\n\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<[^>]+>/g, '') // Remove any remaining HTML tags
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove multiple consecutive newlines
    .trim();
};

/**
 * Parses HTML and returns React Native components
 */
export const parseHTML = (html: string): React.ReactNode[] => {
  if (!html) return [];
  
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Simple regex to find HTML tags
  const tagRegex = /<(\/?)([a-z][a-z0-9]*)[^>]*>/gi;
  let match;
  let lastIndex = 0;
  
  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[2].toLowerCase();
    const isClosing = match[1] === '/';
    const matchIndex = match.index;
    
    // Add text before this tag
    if (matchIndex > lastIndex) {
      const text = html.substring(lastIndex, matchIndex);
      if (text.trim()) {
        parts.push(text);
      }
    }
    
    // Handle specific tags
    if (tagName === 'br' && !isClosing) {
      parts.push('\n');
    } else if (tagName === 'p' && isClosing) {
      parts.push('\n\n');
    } else if (tagName === 'li' && !isClosing) {
      parts.push('• ');
    } else if (tagName === 'li' && isClosing) {
      parts.push('\n');
    } else if (tagName === 'ol' && isClosing) {
      parts.push('\n');
    } else if (tagName === 'ul' && isClosing) {
      parts.push('\n');
    }
    
    lastIndex = matchIndex + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < html.length) {
    const text = html.substring(lastIndex);
    if (text.trim()) {
      parts.push(text);
    }
  }
  
  // If no tags found, just strip HTML and return
  if (parts.length === 0) {
    return [stripHTML(html)];
  }
  
  return parts;
};

/**
 * Renders HTML content as formatted text with improved spacing
 */
export const HTMLRenderer: React.FC<HTMLRendererProps> = ({ html, baseStyle, isYoruba = false, getScaledSize }) => {
  if (!html) return null;
  
  // Helper to get scaled font size
  const getFontSize = (baseFontSize: number) => {
    return getScaledSize ? getScaledSize(baseFontSize) : baseFontSize;
  };
  
  // Auto-detect Yoruba if not explicitly set (check for Yoruba characters)
  const hasYorubaChars = /[ÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäåèéêëìíîïòóôõöùúûü]/.test(html);
  const isYorubaContent = isYoruba || hasYorubaChars;
  
  // Check if it contains HTML
  const hasHTML = /<[a-z][\s\S]*>/i.test(html);
  
  if (!hasHTML) {
    const scaledBaseStyle = baseStyle ? {
      ...baseStyle,
      fontSize: baseStyle.fontSize ? getFontSize(baseStyle.fontSize) : undefined,
    } : undefined;
    return <Text style={scaledBaseStyle}>{html}</Text>;
  }
  
  // For complex HTML, use stripped version with basic formatting
  const text = stripHTML(html);
  
  // Split by newlines and filter out excessive empty lines
  const lines = text.split('\n').filter((line, index, arr) => {
    // Remove multiple consecutive empty lines (keep max 1)
    if (line.trim() === '' && index > 0 && arr[index - 1].trim() === '') {
      return false;
    }
    return true;
  });
  
  return (
    <View>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        const isEmpty = trimmedLine === '';
        const isBullet = trimmedLine.startsWith('•');
        const prevLine = index > 0 ? lines[index - 1].trim() : '';
        const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';
        const prevPrevLine = index > 1 ? lines[index - 2].trim() : '';
        
        // Skip rendering empty lines (spacing handled by marginTop/marginBottom)
        if (isEmpty) {
          return null;
        }
        
        // Detect headings/subheadings more accurately
        // Headings are typically:
        // - Short lines (less than 80 chars)
        // - All uppercase or start with uppercase letter
        // - Followed by empty line or content
        // - Not ending with punctuation (except colon)
        // - Not starting with bullet
        const isShortLine = trimmedLine.length < 80;
        const isUppercase = trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 0;
        const startsWithUppercase = /^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ]/.test(trimmedLine);
        const endsWithColon = trimmedLine.endsWith(':');
        const hasNoEndPunctuation = !/[.!?]$/.test(trimmedLine);
        const isLikelyHeading = isShortLine && 
          (isUppercase || (startsWithUppercase && endsWithColon)) &&
          !isBullet &&
          hasNoEndPunctuation &&
          (prevLine === '' || prevPrevLine === ''); // Has space before it
        
        // Determine spacing (increased more for Yoruba content)
        let marginTop = 0;
        let marginBottom = isYorubaContent ? Spacing.md : Spacing.sm; // Yoruba: 14px, English: 10px
        
        // Add spacing before headings/subheadings
        if (isLikelyHeading && index > 0) {
          // If previous line was not empty, add more space before heading
          if (prevLine !== '') {
            marginTop = isYorubaContent ? Spacing.xl : Spacing.lg; // Yoruba: 28px, English: 20px
          } else {
            marginTop = isYorubaContent ? Spacing.lg : Spacing.md; // Yoruba: 20px, English: 14px
          }
          marginBottom = isYorubaContent ? Spacing.lg : Spacing.md; // Yoruba: 20px, English: 14px
        } else if (isBullet) {
          // List items: minimal spacing
          marginBottom = isYorubaContent ? 6 : 4; // Yoruba: 6px, English: 4px
          if (index > 0 && prevLine !== '' && !prevLine.startsWith('•')) {
            marginTop = isYorubaContent ? Spacing.sm : Spacing.xs; // Yoruba: 10px, English: 6px
          }
        } else {
          // Regular paragraph
          // Add small space if previous line was not empty (new paragraph)
          if (index > 0 && prevLine !== '' && !isLikelyHeading) {
            marginTop = isYorubaContent ? Spacing.md : Spacing.sm; // Yoruba: 14px, English: 10px
          }
          // Consistent spacing for paragraph lines
          if (nextLine === '') {
            marginBottom = isYorubaContent ? Spacing.md : Spacing.sm; // Yoruba: 14px, English: 10px
          } else {
            marginBottom = isYorubaContent ? Spacing.md : Spacing.sm; // Yoruba: 14px, English: 10px
          }
        }
        
        return (
          <Text
            key={index}
            style={[
              baseStyle,
              isBullet && { marginLeft: 16 },
              isLikelyHeading && { 
                fontWeight: '700', 
                fontSize: (baseStyle?.fontSize || 17) + 1, // Updated base from 16 to 17
                color: Palette.textDefault,
              },
              { 
                marginTop,
                marginBottom,
              },
            ]}
          >
            {trimmedLine}
          </Text>
        );
      })}
    </View>
  );
};
