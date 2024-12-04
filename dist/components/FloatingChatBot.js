var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Trash2 } from 'lucide-react';
import Draggable from 'react-draggable';
import { useChatCompletion } from '../hooks/useChatCompletion';
import { sanitizeText, scrapeDomForContext } from '../utils/domScraper';
var defaultTheme = {
    primary: 'bg-blue-600',
    background: 'bg-white',
    text: 'text-gray-900'
};
var CONFIG = {
    MAX_MESSAGES: 50,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    MAX_CONTEXT_LENGTH: 5000
};
var FloatingChatBot = function (_a) {
    var agentId = _a.agentId, agentAlias = _a.agentAlias, apiEndpoint = _a.apiEndpoint, apiKey = _a.apiKey, _b = _a.position, position = _b === void 0 ? 'bottom-right' : _b, _c = _a.theme, theme = _c === void 0 ? defaultTheme : _c;
    var _d = useState(false), isOpen = _d[0], setIsOpen = _d[1];
    var _e = useState(''), input = _e[0], setInput = _e[1];
    var chatContainerRef = useRef(null);
    var dragNodeRef = useRef(null);
    var _f = useState(true), isFloating = _f[0], setIsFloating = _f[1];
    var _g = useChatCompletion({
        agentId: agentId,
        agentAlias: agentAlias,
        apiEndpoint: apiEndpoint,
        apiKey: apiKey
    }), messages = _g.messages, isLoading = _g.isLoading, sendMessage = _g.sendMessage, clearMessages = _g.clearMessages, conversationId = _g.conversationId, addSystemMessage = _g.addSystemMessage;
    useEffect(function () {
        var interval = setInterval(function () {
            setIsFloating(function (prev) { return !prev; });
        }, 2000);
        return function () { return clearInterval(interval); };
    }, []);
    var scrollToBottom = useCallback(function () {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);
    useEffect(function () {
        var timeout = setTimeout(scrollToBottom, 100);
        return function () { return clearTimeout(timeout); };
    }, [messages, scrollToBottom]);
    var handleSend = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userMessage, _a, sanitizedMessage, isMessageSanitized, domContent, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!input.trim() || isLoading)
                        return [2 /*return*/];
                    userMessage = input.trim();
                    setInput('');
                    _a = sanitizeText(userMessage), sanitizedMessage = _a.text, isMessageSanitized = _a.sanitized;
                    if (isMessageSanitized) {
                        console.log('PII detected in user message. Message sanitized.');
                        addSystemMessage('Please note: Your message contained sensitive information that was removed for your security.');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    domContent = scrapeDomForContext();
                    if (domContent.error) {
                        console.error('Error scraping DOM:', domContent.error);
                        return [2 /*return*/];
                    }
                    // Send message with context
                    return [4 /*yield*/, sendMessage(sanitizedMessage, domContent.content)];
                case 2:
                    // Send message with context
                    _b.sent();
                    scrollToBottom();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('Error sending message:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleClearChat = function () {
        if (window.confirm('Are you sure you want to clear this conversation?')) {
            clearMessages();
        }
    };
    // Minimized chat button
    if (!isOpen) {
        return (React.createElement("div", { className: "fixed bottom-4 ".concat(position === 'bottom-right' ? 'right-4' : 'left-4', " z-[1000]") },
            React.createElement("button", { onClick: function () { return setIsOpen(true); }, className: "".concat(theme.primary, " rounded-full p-4 text-white shadow-lg hover:opacity-90 transition-opacity"), "aria-label": "Open chat" },
                React.createElement(MessageSquare, null))));
    }
    // Open chat window
    return (React.createElement("div", { className: "fixed bottom-0 right-0 z-[1000] w-screen h-screen pointer-events-none" },
        React.createElement(Draggable, { handle: ".drag-handle", bounds: "parent", nodeRef: dragNodeRef },
            React.createElement("div", { ref: dragNodeRef, className: "absolute bottom-4 right-4 pointer-events-auto" },
                React.createElement("div", { ref: chatContainerRef, className: "".concat(theme.background, " w-96 h-[500px] rounded-lg shadow-xl flex flex-col") },
                    React.createElement("div", { className: "".concat(theme.primary, " p-4 rounded-t-lg flex justify-between items-center cursor-move drag-handle") },
                        React.createElement("h3", { className: "text-white font-medium select-none" }, "Chat Assistant"),
                        React.createElement("div", { className: "flex items-center space-x-2" },
                            React.createElement("button", { onClick: handleClearChat, className: "text-white hover:opacity-90 transition-opacity p-1", "aria-label": "Clear chat" },
                                React.createElement(Trash2, { size: 18 })),
                            React.createElement("button", { onClick: function () { return setIsOpen(false); }, className: "text-white hover:opacity-90 transition-opacity p-1", "aria-label": "Close chat" },
                                React.createElement(X, { size: 20 })))),
                    React.createElement("div", { className: "flex-none px-4 py-2 text-xs text-gray-500" },
                        "Conversation ID: ",
                        conversationId),
                    React.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-4" },
                        messages.map(function (message, index) { return (React.createElement("div", { key: index, className: "".concat(message.role === 'user'
                                ? 'ml-auto bg-blue-100'
                                : 'mr-auto bg-gray-100', " p-3 rounded-lg max-w-[80%] ").concat(theme.text) }, message.content)); }),
                        isLoading && (React.createElement("div", { className: "mr-auto bg-gray-100 p-3 rounded-lg animate-pulse" }, "Thinking..."))),
                    React.createElement("div", { className: "p-4 border-t" },
                        React.createElement("div", { className: "flex space-x-2" },
                            React.createElement("input", { type: "text", value: input, onChange: function (e) { return setInput(e.target.value); }, onKeyPress: function (e) { return e.key === 'Enter' && handleSend(); }, placeholder: "Type your message...", className: "flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", disabled: isLoading }),
                            React.createElement("button", { onClick: handleSend, disabled: isLoading, className: "".concat(theme.primary, " p-2 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50"), "aria-label": "Send message" },
                                React.createElement(Send, { size: 20 })))))))));
};
export default FloatingChatBot;
