/**
 * Sentiment Analysis for Judge Comments
 * This analyzes judge feedback/comments and provides objective sentiment scoring
 */

/**
 * Simple sentiment analysis based on keyword matching and patterns
 * For production, you would use a proper ML model (e.g., VADER, TextBlob, or custom trained model)
 */
export function analyzeSentiment(comment) {
  if (!comment || comment.trim().length === 0) {
    return {
      score: 0,
      label: 'neutral',
      confidence: 0,
      breakdown: {},
    };
  }

  const text = comment.toLowerCase();
  
  // Positive keywords
  const positiveKeywords = [
    'excellent', 'great', 'good', 'amazing', 'impressive', 'outstanding',
    'innovative', 'creative', 'well-designed', 'polished', 'professional',
    'strong', 'solid', 'promising', 'potential', 'impressive', 'exceptional',
    'thoughtful', 'comprehensive', 'clear', 'effective', 'successful',
    'love', 'enjoy', 'fantastic', 'wonderful', 'brilliant', 'superb',
  ];

  // Negative keywords
  const negativeKeywords = [
    'poor', 'weak', 'bad', 'terrible', 'disappointing', 'lacking',
    'confusing', 'unclear', 'incomplete', 'missing', 'needs improvement',
    'problem', 'issue', 'concern', 'worried', 'unsure', 'questionable',
    'unpolished', 'rough', 'inconsistent', 'weak', 'limited',
    'hate', 'dislike', 'disappointed', 'frustrated', 'confused',
  ];

  // Count positive and negative matches
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      positiveCount++;
    }
  });

  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      negativeCount++;
    }
  });

  // Calculate sentiment score (-1 to 1)
  const totalMatches = positiveCount + negativeCount;
  let sentimentScore = 0;
  
  if (totalMatches > 0) {
    sentimentScore = (positiveCount - negativeCount) / Math.max(totalMatches, 5);
    sentimentScore = Math.max(-1, Math.min(1, sentimentScore)); // Clamp to -1 to 1
  }

  // Determine label
  let label = 'neutral';
  if (sentimentScore > 0.2) {
    label = 'positive';
  } else if (sentimentScore < -0.2) {
    label = 'negative';
  }

  // Calculate confidence based on keyword density
  const wordCount = text.split(/\s+/).length;
  const keywordDensity = totalMatches / Math.max(wordCount, 1);
  const confidence = Math.min(keywordDensity * 10, 1); // Confidence from 0 to 1

  return {
    score: Math.round(sentimentScore * 100) / 100,
    label,
    confidence: Math.round(confidence * 100) / 100,
    breakdown: {
      positiveMatches: positiveCount,
      negativeMatches: negativeCount,
      totalWords: wordCount,
    },
  };
}

/**
 * Analyze multiple comments and aggregate sentiment
 */
export function aggregateSentiment(comments) {
  if (!comments || comments.length === 0) {
    return {
      averageScore: 0,
      label: 'neutral',
      totalComments: 0,
    };
  }

  const sentiments = comments
    .filter(c => c && c.trim().length > 0)
    .map(analyzeSentiment);

  if (sentiments.length === 0) {
    return {
      averageScore: 0,
      label: 'neutral',
      totalComments: 0,
    };
  }

  const averageScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
  
  let label = 'neutral';
  if (averageScore > 0.2) {
    label = 'positive';
  } else if (averageScore < -0.2) {
    label = 'negative';
  }

  return {
    averageScore: Math.round(averageScore * 100) / 100,
    label,
    totalComments: sentiments.length,
    breakdown: {
      positive: sentiments.filter(s => s.label === 'positive').length,
      negative: sentiments.filter(s => s.label === 'negative').length,
      neutral: sentiments.filter(s => s.label === 'neutral').length,
    },
  };
}

/**
 * Enhanced sentiment analysis with context awareness
 * This can be replaced with a proper ML model
 */
export async function advancedSentimentAnalysis(comment) {
  // For now, use the simple analysis
  // In production, this would call an ML model API or use a library like:
  // - @aws-sdk/client-comprehend (AWS Comprehend)
  // - @google-cloud/language (Google Cloud Natural Language)
  // - Or a custom trained model
  
  return analyzeSentiment(comment);
}

