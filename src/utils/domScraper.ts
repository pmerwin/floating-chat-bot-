const EXCLUDED_SELECTORS = [
    'button',
    'a',
    'input',
    'textarea',
    '[role="button"]',
    '[onclick]',
    '.floating-chat-bot',
    '.messages'
].join(',');

interface DOMResponse {
    title?: string;
    description?: string;
    content: string;
    sanitized?: boolean;
    error?: string;
    type?: string;
}

const cleanText = (text: string): string => {
    return text
        .replace(/[\t\n\r]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/[^\x20-\x7E]+/g, '')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\u2013|\u2014/g, '-')
        .trim();
};

export const scrapeDomForContext = (): DOMResponse => {
    try {
        const pageTitle = document.title.trim();
        const metaDescription = 
            document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';

        const elements = Array.from(
            document.querySelectorAll('main, article, section, div, p, h1, h2, h3, ul, ol, li')
        );

        let accumulatedContent = '';
        const MAX_ACCUMULATED_LENGTH = 10000;

        for (const el of elements) {
            if (
                el.nodeType === Node.ELEMENT_NODE &&
                el instanceof HTMLElement &&
                !el.matches(EXCLUDED_SELECTORS) &&
                (el as HTMLElement).offsetParent !== null
            ) {
                const text = el.innerText.trim();
                if (text.length > 30) {
                    accumulatedContent += `\n\n${text}`;
                    if (accumulatedContent.length > MAX_ACCUMULATED_LENGTH) break;
                }
            }
        }

        const contentArray = Array.from(accumulatedContent.split('\n\n'))
            .map((line) => cleanText(line))
            .filter(Boolean);

        const sanitizedContent = contentArray.join('\n\n');
        const finalContent = sanitizeText(sanitizedContent).text;

        const context = cleanText(
            [
                `Title: ${pageTitle}`,
                metaDescription && `Description: ${metaDescription}`,
                finalContent || 'No meaningful content found for this page.'
            ]
                .filter(Boolean)
                .join('\n\n')
        );

        return {
            title: pageTitle,
            description: metaDescription,
            content: context
        };
    } catch (error) {
        console.error('Scraping error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            details: String(error)
        });
        return {
            error: 'An error occurred while processing the page content.',
            type: 'processing_error',
            content: ''
        };
    }
};

export const sanitizeText = (text: string): { text: string; sanitized: boolean } => {
    const patterns = [
        {
            pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            type: 'EMAIL'
        },
        {
            pattern: /\b\d{10,11}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
            type: 'PHONE'
        },
        {
            pattern: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g,
            type: 'SSN'
        },
        {
            pattern: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
            type: 'CREDIT CARD'
        },
        {
            pattern: /\b(api[_\s-]*key|secret[_\s-]*key|private[_\s-]*key)[:\s]*['"]?\w+['"]?\b/gi,
            type: 'API KEY'
        }
    ];

    let sanitized = false;
    let result = text;

    for (const { pattern, type } of patterns) {
        const matches = result.match(pattern);
        if (matches) {
            console.log(`Detected and removed ${type}`);
        }
        result = result.replace(pattern, '[REDACTED]');
        if (matches) {
            sanitized = true;
        }
    }

    return { text: cleanText(result), sanitized };
};