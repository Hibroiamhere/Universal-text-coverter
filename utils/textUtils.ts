
import { CaseType } from '../types';

export const transformText = (text: string, caseType: CaseType): string => {
  switch (caseType) {
    case CaseType.Uppercase:
      return text.toUpperCase();
    case CaseType.Lowercase:
      return text.toLowerCase();
    case CaseType.TitleCase:
      return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    case CaseType.SentenceCase:
      return text.toLowerCase().replace(/(^\w|\.\s*\w)/gm, char => char.toUpperCase());
    default:
      return text;
  }
};
    