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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useCallback } from 'react';
import axios from 'axios';
var sendWithRetry = function (fn, retries, delay) {
    if (retries === void 0) { retries = 3; }
    if (delay === void 0) { delay = 1000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, fn()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    if (!(retries > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, sendWithRetry(fn, retries - 1, delay * 1.5)];
                case 4: throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
};
export var useChatCompletion = function (_a) {
    var agentId = _a.agentId, agentAlias = _a.agentAlias, apiEndpoint = _a.apiEndpoint, apiKey = _a.apiKey;
    var _b = useState([]), messages = _b[0], setMessages = _b[1];
    var _c = useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(function () {
        return sessionStorage.getItem('conversationId') ||
            "conv_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    }), conversationId = _d[0], setConversationId = _d[1];
    // Initialize conversation ID
    useState(function () {
        sessionStorage.setItem('conversationId', conversationId);
    });
    var sendMessage = useCallback(function (userMessage, context) {
        if (context === void 0) { context = ''; }
        return __awaiter(void 0, void 0, void 0, function () {
            var headers_1, response, assistantMessage_1, error_2, errorMessage_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ role: 'user', content: userMessage }], false); });
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        headers_1 = {
                            'Content-Type': 'application/json'
                        };
                        if (apiKey) {
                            headers_1['x-api-key'] = apiKey;
                        }
                        return [4 /*yield*/, sendWithRetry(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, axios.post(apiEndpoint, {
                                            agentId: agentId,
                                            agentAlias: agentAlias,
                                            message: userMessage,
                                            context: context,
                                            conversationId: conversationId
                                        }, { headers: headers_1 })];
                                });
                            }); })];
                    case 2:
                        response = _a.sent();
                        assistantMessage_1 = {
                            role: 'assistant',
                            content: response.data.completion || 'No response received'
                        };
                        setMessages(function (prev) {
                            var combined = __spreadArray(__spreadArray([], prev, true), [assistantMessage_1], false);
                            return combined.slice(-50); // Keep last 50 messages
                        });
                        return [2 /*return*/, assistantMessage_1];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error:', error_2);
                        errorMessage_1 = {
                            role: 'assistant',
                            content: 'Sorry, I encountered an error. Please try again.'
                        };
                        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [errorMessage_1], false); });
                        return [2 /*return*/, errorMessage_1];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [agentId, agentAlias, apiEndpoint, apiKey, conversationId]);
    var clearMessages = useCallback(function () {
        setMessages([]);
        // Generate new conversation ID when clearing
        var newId = "conv_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        sessionStorage.setItem('conversationId', newId);
        setConversationId(newId);
    }, []);
    var addSystemMessage = useCallback(function (content) {
        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ role: 'assistant', content: content }], false); });
    }, []);
    return {
        messages: messages,
        setMessages: setMessages,
        isLoading: isLoading,
        sendMessage: sendMessage,
        clearMessages: clearMessages,
        conversationId: conversationId,
        addSystemMessage: addSystemMessage
    };
};
