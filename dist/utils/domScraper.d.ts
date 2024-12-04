interface DOMResponse {
    title?: string;
    description?: string;
    content: string;
    sanitized?: boolean;
    error?: string;
    type?: string;
}
export declare const scrapeDomForContext: () => DOMResponse;
export declare const sanitizeText: (text: string) => {
    text: string;
    sanitized: boolean;
};
export {};
