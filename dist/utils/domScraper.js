var EXCLUDED_SELECTORS = [
    'button',
    'a',
    'input',
    'textarea',
    '[role="button"]',
    '[onclick]',
    '.floating-chat-bot',
    '.messages'
].join(',');
var cleanText = function (text) {
    return text
        .replace(/[\t\n\r]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/[^\x20-\x7E]+/g, '')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\u2013|\u2014/g, '-')
        .trim();
};
export var scrapeDomForContext = function () {
    var _a, _b;
    try {
        var pageTitle = document.title.trim();
        var metaDescription = ((_b = (_a = document.querySelector('meta[name="description"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) === null || _b === void 0 ? void 0 : _b.trim()) || '';
        var elements = Array.from(document.querySelectorAll('main, article, section, div, p, h1, h2, h3, ul, ol, li'));
        var accumulatedContent = '';
        var MAX_ACCUMULATED_LENGTH = 10000;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var el = elements_1[_i];
            if (el.nodeType === Node.ELEMENT_NODE &&
                el instanceof HTMLElement &&
                !el.matches(EXCLUDED_SELECTORS) &&
                el.offsetParent !== null) {
                var text = el.innerText.trim();
                if (text.length > 30) {
                    accumulatedContent += "\n\n".concat(text);
                    if (accumulatedContent.length > MAX_ACCUMULATED_LENGTH)
                        break;
                }
            }
        }
        var contentArray = Array.from(accumulatedContent.split('\n\n'))
            .map(function (line) { return cleanText(line); })
            .filter(Boolean);
        var sanitizedContent = contentArray.join('\n\n');
        var finalContent = sanitizeText(sanitizedContent).text;
        var context = cleanText([
            "Title: ".concat(pageTitle),
            metaDescription && "Description: ".concat(metaDescription),
            finalContent || 'No meaningful content found for this page.'
        ]
            .filter(Boolean)
            .join('\n\n'));
        return {
            title: pageTitle,
            description: metaDescription,
            content: context
        };
    }
    catch (error) {
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
export var sanitizeText = function (text) {
    var patterns = [
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
    var sanitized = false;
    var result = text;
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
        var _a = patterns_1[_i], pattern = _a.pattern, type = _a.type;
        var matches = result.match(pattern);
        if (matches) {
            console.log("Detected and removed ".concat(type));
        }
        result = result.replace(pattern, '[REDACTED]');
        if (matches) {
            sanitized = true;
        }
    }
    return { text: cleanText(result), sanitized: sanitized };
};
