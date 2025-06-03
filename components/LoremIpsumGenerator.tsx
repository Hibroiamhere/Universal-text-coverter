
import React, { useState, useCallback } from 'react';
import { ConverterCard } from './ConverterCard';
import { ParagraphIcon, CopyIcon, CheckIcon } from './Icons';

const LOREM_IPSUM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
  'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure',
  'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSentence = (numWords: number): string => {
  let sentence = '';
  for (let i = 0; i < numWords; i++) {
    sentence += LOREM_IPSUM_WORDS[getRandomInt(0, LOREM_IPSUM_WORDS.length - 1)] + ' ';
  }
  sentence = sentence.trim();
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
};

const generateParagraph = (numSentences: number, avgWordsPerSentence: number): string => {
  let paragraph = '';
  for (let i = 0; i < numSentences; i++) {
    // Vary sentence length slightly around the average
    const wordsInSentence = getRandomInt(Math.max(3, avgWordsPerSentence - 2), avgWordsPerSentence + 2);
    paragraph += generateSentence(wordsInSentence) + ' ';
  }
  return paragraph.trim();
};

export const LoremIpsumGenerator: React.FC = () => {
  const [numParagraphs, setNumParagraphs] = useState<number>(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState<number>(5);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [outputText, setOutputText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateText = useCallback(() => {
    let result = '';
    const avgWordsPerSentence = 8; // Average words for more natural sentences

    for (let i = 0; i < numParagraphs; i++) {
      if (i === 0 && startWithLorem) {
        const firstSentenceWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
        let firstParagraph = firstSentenceWords.slice(0, Math.min(firstSentenceWords.length, avgWordsPerSentence)).join(' ') + '. ';
        if (sentencesPerParagraph > 1) {
           firstParagraph += generateParagraph(sentencesPerParagraph - 1, avgWordsPerSentence);
        }
        result += firstParagraph.trim();

      } else {
        result += generateParagraph(sentencesPerParagraph, avgWordsPerSentence);
      }
      if (i < numParagraphs - 1) {
        result += '\n\n'; // Add two newlines for paragraph break
      }
    }
    setOutputText(result);
  }, [numParagraphs, sentencesPerParagraph, startWithLorem]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again.');
    }
  }, [outputText]);

  return (
    <ConverterCard
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and layouts."
      icon={<ParagraphIcon className="h-8 w-8" />}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="num-paragraphs" className="block text-sm font-medium text-neutral">
            Number of Paragraphs: {numParagraphs}
          </label>
          <input
            type="range"
            id="num-paragraphs"
            min="1"
            max="20"
            value={numParagraphs}
            onChange={(e) => setNumParagraphs(parseInt(e.target.value))}
            className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label htmlFor="sentences-per-paragraph" className="block text-sm font-medium text-neutral">
            Sentences per Paragraph (approx): {sentencesPerParagraph}
          </label>
          <input
            type="range"
            id="sentences-per-paragraph"
            min="1"
            max="15"
            value={sentencesPerParagraph}
            onChange={(e) => setSentencesPerParagraph(parseInt(e.target.value))}
            className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="start-with-lorem"
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="start-with-lorem" className="ml-2 block text-sm text-neutral">
            Start with "Lorem ipsum dolor sit amet..."
          </label>
        </div>

        <button
          onClick={handleGenerateText}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Generate Text
        </button>

        {outputText && (
          <div>
            <label htmlFor="output-lorem-ipsum" className="block text-sm font-medium text-neutral">Generated Text</label>
            <div className="relative">
              <textarea
                id="output-lorem-ipsum"
                rows={10}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-primary focus:border-primary"
                value={outputText}
                readOnly
              />
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="absolute top-2 right-2 p-1.5 bg-gray-200 hover:bg-gray-300 rounded text-neutral"
                aria-label="Copy generated text"
              >
                {copied ? <CheckIcon className="h-5 w-5 text-success" /> : <CopyIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </ConverterCard>
  );
};
