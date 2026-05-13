import iconv from 'iconv-lite';
import chardet from 'chardet';

export const removeSpecialCharacters = (string: string) => {
  return string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
};

export const getKeyFromVal = (obj, val) =>
  Object.keys(obj).find((k) => obj[k] === val);

export const containsDuplicates = (array) => {
  if (array.length !== new Set(array).size) {
    return true;
  }
  return false;
};

export const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
};

export const convertMsToHM = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)}H ${padTo2Digits(minutes)}M`;
};

/**
 * Properly decode filename to handle multiple languages including Japanese, English, etc.
 * @param filename Raw filename from multer upload
 * @returns Properly decoded UTF-8 filename
 */
export const decodeFilename = (filename: string): string => {
  try {
    // First, try to detect the encoding
    const detectedEncoding = chardet.detect(Buffer.from(filename, 'binary'));

    // If detected as UTF-8 or undefined (likely UTF-8), try UTF-8 first
    if (!detectedEncoding || detectedEncoding.toLowerCase().includes('utf-8')) {
      try {
        return Buffer.from(filename, 'binary').toString('utf8');
      } catch {
        // If UTF-8 fails, continue to other encodings
      }
    }

    // Try common encodings that browsers might use
    const encodings = [
      'utf8',
      'latin1',
      'cp932',
      'shift_jis',
      'euc-jp',
      'iso-8859-1'
    ];

    for (const encoding of encodings) {
      try {
        const decoded = iconv.decode(Buffer.from(filename, 'binary'), encoding);
        // Basic validation: check if result contains valid characters
        if (decoded && decoded.length > 0 && !decoded.includes('\ufffd')) {
          return decoded;
        }
      } catch {
        // Continue to next encoding
      }
    }

    // Fallback: try UTF-8 directly (handles most modern cases)
    return Buffer.from(filename, 'binary').toString('utf8');
  } catch {
    return filename;
  }
};

/**
 * Convert newline characters to <br> tags for HTML rendering (e.g., in emails).
 * @param text Text to convert
 * @returns Text with newlines replaced by <br> tags, or empty string if input is falsy
 */
export const convertNewlineToBr = (text: string | undefined | null): string => {
  return text?.replace(/\n/g, '<br>') || '';
};

/**
 * Normalize text for Unicode consistency in database searches.
 * This handles Japanese katakana with dakuten and other Unicode
 * normalization issues that prevent accurate matching.
 *
 * Uses NFC (Normalization Form Canonical Composed) which provides
 * coverage for the most common normalization issues:
 * - Katakana with dakuten: ド → ド
 * - Latin accents: e + ´ → é
 * - Hangul: Composed vs decomposed forms
 *
 * @param text Text to normalize for search
 * @returns Normalized text, or empty string if input is falsy
 */
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  try {
    return text.normalize('NFC');
  } catch {
    return text;
  }
};
