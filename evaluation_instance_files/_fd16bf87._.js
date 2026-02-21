(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * Set NEXT_PUBLIC_API_URL environment variable to point to Flask backend.
 * Defaults to http://localhost:5000 for development.
 */ __turbopack_context__.s([
    "API_CONFIG",
    ()=>API_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_CONFIG = {
    // Flask backend URL - can be overridden with NEXT_PUBLIC_API_URL env var
    baseUrl: ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000',
    // API endpoints
    endpoints: {
        runPipeline: '/api/run-pipeline',
        health: '/health',
        versions: '/api/versions',
        versionDialogues: (id)=>"/api/versions/".concat(id, "/dialogues"),
        versionCompare: '/api/versions/compare',
        versionTag: (id)=>"/api/versions/".concat(id, "/tag"),
        versionExport: (id)=>"/api/versions/".concat(id, "/export"),
        humanEvalTasks: '/api/human-evaluation/tasks',
        humanEvalTasksBatch: '/api/human-evaluation/tasks/batch',
        humanEvalTask: (id)=>"/api/human-evaluation/tasks/".concat(id),
        humanEvalAnnotate: '/api/human-evaluation/annotate',
        humanEvalDialogueAnnotations: (dialogueId)=>"/api/human-evaluation/dialogues/".concat(dialogueId, "/annotations"),
        humanEvalAgreement: '/api/human-evaluation/agreement',
        humanEvalStatistics: '/api/human-evaluation/statistics',
        humanEvalExport: '/api/human-evaluation/export'
    },
    // WebSocket URL - returns the base URL for socket.io connection
    getSocketUrl: ()=>{
        try {
            // If baseUrl is already a full URL, extract origin
            if (API_CONFIG.baseUrl.startsWith('http://') || API_CONFIG.baseUrl.startsWith('https://')) {
                const url = new URL(API_CONFIG.baseUrl);
                return url.origin;
            }
            // Otherwise, assume http://localhost:5000
            return API_CONFIG.baseUrl;
        } catch (error) {
            console.error('Error parsing socket URL:', error);
            return 'http://localhost:5000';
        }
    },
    // Get full URL for an endpoint
    getUrl: (endpoint)=>{
        return "".concat(API_CONFIG.baseUrl).concat(endpoint);
    },
    // Check if backend is available (with timeout to avoid hanging)
    checkHealth: async ()=>{
        const url = API_CONFIG.getUrl(API_CONFIG.endpoints.health);
        const timeoutMs = 5000;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), timeoutMs);
            const response = await fetch(url, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            // Network error, connection refused, or timeout - backend likely not running or wrong URL
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn('Backend health check failed (is it running at %s?):', url, error);
            }
            return false;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ExperienceGenerator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExperienceGenerator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ExperienceGenerator(param) {
    let { experiences = [], autoStart = false, onLog, onComplete } = param;
    _s();
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [generatedExperiences, setGeneratedExperiences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(experiences);
    const [selectedExperience, setSelectedExperience] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentTask, setCurrentTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Update local state when experiences prop changes (from socket events)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExperienceGenerator.useEffect": ()=>{
            if (experiences.length > 0) {
                setGeneratedExperiences(experiences);
                setProgress(100);
                setIsGenerating(false);
                onComplete(experiences);
            } else if (experiences.length === 0 && generatedExperiences.length > 0) {
                // Reset when experiences are cleared
                setGeneratedExperiences([]);
                setProgress(0);
            }
        }
    }["ExperienceGenerator.useEffect"], [
        experiences,
        onComplete
    ]);
    const generateExperiences = async ()=>{
        setIsGenerating(true);
        setProgress(0);
        setCurrentTask('Initializing experience generator...');
        setGeneratedExperiences([]);
        try {
            // Simulate the experience generation process
            const steps = [
                'Analyzing domain and task requirements...',
                'Generating diverse personas...',
                'Creating realistic situations...',
                'Defining clear objectives...',
                'Crafting conversation starters...',
                'Applying constraints and guidelines...',
                'Finalizing experience blueprints...'
            ];
            for(let i = 0; i < steps.length; i++){
                setCurrentTask(steps[i]);
                setProgress((i + 1) / steps.length * 100);
                await new Promise((resolve)=>setTimeout(resolve, 800));
            }
            // Call the Flask backend directly - only send num_experiences, backend handles domain selection
            const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.runPipeline), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    num_experiences: 1
                })
            });
            if (!response.ok) {
                throw new Error('Failed to generate experiences');
            }
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setGeneratedExperiences(data.experiences);
                setProgress(100);
                onLog === null || onLog === void 0 ? void 0 : onLog({
                    status: 'success',
                    message: "Generated ".concat(data.experiences.length, " experiences successfully.")
                });
                onComplete(data.experiences);
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Experience generation error:', error);
            onLog === null || onLog === void 0 ? void 0 : onLog({
                status: 'error',
                message: "Experience generation failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'Unknown error', ". Using mock data fallback.")
            });
            // Fallback to mock data if API fails
            const mockExperiences = [
                {
                    experience_id: 'exp_001',
                    domain: 'healthcare',
                    task: 'diagnose_fever',
                    personas: [
                        {
                            role: 'doctor',
                            name: 'Dr. Sarah Chen',
                            traits: [
                                'calm',
                                'analytical',
                                'empathetic'
                            ],
                            memory: [
                                'worked 10y in ER'
                            ]
                        },
                        {
                            role: 'patient',
                            name: 'Alex Rodriguez',
                            traits: [
                                'worried',
                                'cooperative',
                                'detailed'
                            ],
                            memory: []
                        }
                    ],
                    situation: 'Patient reports fever and cough symptoms for 3 days',
                    goal: 'Doctor identifies likely cause and recommends appropriate tests or treatment',
                    constraints: {
                        max_turns: 10,
                        max_tokens_per_turn: 60
                    },
                    conversation_starter: 'I have had fever for three days and it\'s not improving.'
                },
                {
                    experience_id: 'exp_002',
                    domain: 'customer_support',
                    task: 'refund_request',
                    personas: [
                        {
                            role: 'customer_service_agent',
                            name: 'Jennifer Walsh',
                            traits: [
                                'patient',
                                'solution-oriented',
                                'professional'
                            ],
                            memory: []
                        },
                        {
                            role: 'customer',
                            name: 'Michael Thompson',
                            traits: [
                                'frustrated',
                                'determined',
                                'polite'
                            ],
                            memory: []
                        }
                    ],
                    situation: 'Customer received a defective electronic device and wants a refund',
                    goal: 'Agent processes refund and maintains customer satisfaction',
                    constraints: {
                        max_turns: 10,
                        max_tokens_per_turn: 60
                    },
                    conversation_starter: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.'
                }
            ];
            setGeneratedExperiences(mockExperiences);
            setProgress(100);
            onComplete(mockExperiences);
        } finally{
            setIsGenerating(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-6 h-6 text-cyan-400"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white",
                                    children: "Experience Generation"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    isGenerating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: currentTask
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400 font-semibold",
                                        children: [
                                            Math.round(progress),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: "".concat(progress, "%")
                                    },
                                    className: "bg-gradient-to-r from-cyan-400 to-purple-600 h-3 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            generatedExperiences.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-lg font-semibold text-white flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                className: "w-5 h-5 text-green-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            "Generated Experiences (",
                            generatedExperiences.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this),
                    generatedExperiences.map((experience, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: -20
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: index * 0.1
                            },
                            className: "bg-white/5 rounded-xl border border-white/20 overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 cursor-pointer hover:bg-white/10 transition-colors",
                                    onClick: ()=>setSelectedExperience(selectedExperience === index ? null : index),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 rounded-full ".concat(experience.domain === 'healthcare' ? 'bg-red-400' : experience.domain === 'customer_support' ? 'bg-blue-400' : experience.domain === 'education' ? 'bg-green-400' : 'bg-purple-400')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                className: "font-semibold text-white",
                                                                children: [
                                                                    experience.personas[0].name,
                                                                    " & ",
                                                                    experience.personas[1].name
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                lineNumber: 263,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-300",
                                                                children: experience.task.replace('_', ' ').toUpperCase()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                lineNumber: 256,
                                                columnNumber: 19
                                            }, this),
                                            selectedExperience === index ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "w-5 h-5 text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                lineNumber: 268,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "w-5 h-5 text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                lineNumber: 270,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                        lineNumber: 255,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    children: selectedExperience === index && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            height: 0,
                                            opacity: 0
                                        },
                                        animate: {
                                            height: 'auto',
                                            opacity: 1
                                        },
                                        exit: {
                                            height: 0,
                                            opacity: 0
                                        },
                                        className: "border-t border-white/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid md:grid-cols-2 gap-4",
                                                    children: experience.personas.map((persona, pIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white/5 rounded-lg p-3 border border-white/10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                            className: "w-4 h-4 text-cyan-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 289,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold text-white",
                                                                            children: persona.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded capitalize",
                                                                            children: persona.role
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 291,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 288,
                                                                    columnNumber: 21
                                                                }, this),
                                                                persona.memory && persona.memory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-300 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-cyan-400",
                                                                            children: "Memory:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 297,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " ",
                                                                        persona.memory.join(', ')
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 296,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-1",
                                                                    children: persona.traits.map((trait, tIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded",
                                                                            children: trait
                                                                        }, tIndex, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 302,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 300,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, pIndex, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid md:grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white/5 rounded-lg p-3 border border-white/10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                            className: "w-4 h-4 text-purple-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 315,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold text-white",
                                                                            children: "Situation"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 316,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 314,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-300",
                                                                    children: experience.situation
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 318,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white/5 rounded-lg p-3 border border-white/10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                                            className: "w-4 h-4 text-green-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 322,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-semibold text-white",
                                                                            children: "Goal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 323,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 321,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-300",
                                                                    children: experience.goal
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 325,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white/5 rounded-lg p-3 border border-white/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                    className: "w-4 h-4 text-pink-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-white",
                                                                    children: "Conversation Starter"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-300 italic",
                                                            children: [
                                                                "“",
                                                                experience.conversation_starter,
                                                                "”"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white/5 rounded-lg p-3 border border-white/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                    className: "w-4 h-4 text-yellow-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 341,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-white",
                                                                    children: "Constraints"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 342,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 340,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-gray-300",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-cyan-400",
                                                                            children: "Max Turns:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 346,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        experience.constraints.max_turns
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 345,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-gray-300",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-cyan-400",
                                                                            children: "Max Tokens:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                            lineNumber: 349,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        experience.constraints.max_tokens_per_turn
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                                    lineNumber: 348,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                            lineNumber: 283,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                        lineNumber: 277,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExperienceGenerator.tsx",
                                    lineNumber: 275,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, experience.experience_id, true, {
                            fileName: "[project]/app/components/ExperienceGenerator.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ExperienceGenerator.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ExperienceGenerator.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
_s(ExperienceGenerator, "2/IUhU9ZHrgGWux2/CHVdA+sCho=");
_c = ExperienceGenerator;
var _c;
__turbopack_context__.k.register(_c, "ExperienceGenerator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/MultiAgentSimulator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MultiAgentSimulator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function MultiAgentSimulator(param) {
    let { experiences = [], conversations: propConversations = [], autoStart = false, onLog, onComplete } = param;
    _s();
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(propConversations);
    const [isSimulating, setIsSimulating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedConversation, setSelectedConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [simulationProgress, setSimulationProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentTurn, setCurrentTurn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Update local state when conversations prop changes (from socket events)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MultiAgentSimulator.useEffect": ()=>{
            if (propConversations.length > 0) {
                setConversations(propConversations);
                setSimulationProgress(100);
                setIsSimulating(false);
                onComplete(propConversations);
            } else if (propConversations.length === 0 && conversations.length > 0) {
                // Reset when conversations are cleared
                setConversations([]);
                setSimulationProgress(0);
            }
        }
    }["MultiAgentSimulator.useEffect"], [
        propConversations,
        onComplete
    ]);
    const mockConversations = [
        {
            conv_id: 'goalconvo_001_001',
            domain: 'healthcare',
            task: 'diagnose_fever',
            experience_id: 'exp_001',
            personas: [
                {
                    role: 'doctor',
                    name: 'Dr. Sarah Chen',
                    traits: [
                        'calm',
                        'analytical',
                        'empathetic'
                    ],
                    memory: [
                        'worked 10y in ER'
                    ]
                },
                {
                    role: 'patient',
                    name: 'Alex Rodriguez',
                    traits: [
                        'worried',
                        'cooperative',
                        'detailed'
                    ],
                    memory: []
                }
            ],
            situation: 'Patient reports fever and cough symptoms for 3 days',
            goal: 'Doctor identifies likely cause and recommends appropriate tests or treatment',
            constraints: {
                max_turns: 10,
                max_tokens_per_turn: 60
            },
            conversation_starter: 'I have had fever for three days and it\'s not improving.',
            turns: [
                {
                    turn_id: 1,
                    speaker: 'patient',
                    text: 'I have had fever for three days and it\'s not improving.'
                },
                {
                    turn_id: 2,
                    speaker: 'doctor',
                    text: 'I understand you\'re concerned. When did the symptoms start exactly, and have you taken any medication?'
                },
                {
                    turn_id: 3,
                    speaker: 'patient',
                    text: 'It started on Monday evening. I took some ibuprofen yesterday, but the fever came back this morning.'
                },
                {
                    turn_id: 4,
                    speaker: 'doctor',
                    text: 'Based on your symptoms, this could be a viral infection. I recommend getting a COVID test and monitoring your temperature. If it persists beyond 5 days, please come in for further evaluation.'
                }
            ],
            task_success: true,
            judge_score: 4.1,
            mtld: 82.3,
            provenance: {
                generator_model: 'gpt-4o-mini',
                prompt_version: 'agent_prompt_v1',
                temperature: 0.6,
                shot_ids: [
                    'shot_001'
                ],
                timestamp: '2024-01-15T10:05:00Z'
            }
        },
        {
            conv_id: 'goalconvo_001_002',
            domain: 'customer_support',
            task: 'refund_request',
            experience_id: 'exp_002',
            personas: [
                {
                    role: 'customer_service_agent',
                    name: 'Jennifer Walsh',
                    traits: [
                        'patient',
                        'solution-oriented',
                        'professional'
                    ],
                    memory: []
                },
                {
                    role: 'customer',
                    name: 'Michael Thompson',
                    traits: [
                        'frustrated',
                        'determined',
                        'polite'
                    ],
                    memory: []
                }
            ],
            situation: 'Customer received a defective electronic device and wants a refund',
            goal: 'Agent processes refund and maintains customer satisfaction',
            constraints: {
                max_turns: 10,
                max_tokens_per_turn: 60
            },
            conversation_starter: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.',
            turns: [
                {
                    turn_id: 1,
                    speaker: 'customer',
                    text: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.'
                },
                {
                    turn_id: 2,
                    speaker: 'customer_service_agent',
                    text: 'I\'m sorry to hear about the issue with your device. Could you please describe the specific problem you\'re experiencing?'
                },
                {
                    turn_id: 3,
                    speaker: 'customer',
                    text: 'The screen won\'t turn on even though I charged it overnight. The charging light doesn\'t come on either.'
                },
                {
                    turn_id: 4,
                    speaker: 'customer_service_agent',
                    text: 'I understand. This sounds like a hardware issue. I\'ll process your return authorization right away. You should receive a prepaid return label within 24 hours, and your refund will be processed once we receive the item.'
                }
            ],
            task_success: true,
            judge_score: 4.3,
            mtld: 78.9,
            provenance: {
                generator_model: 'gpt-4o-mini',
                prompt_version: 'agent_prompt_v1',
                temperature: 0.6,
                shot_ids: [
                    'shot_002'
                ],
                timestamp: '2024-01-15T14:05:00Z'
            }
        }
    ];
    const startSimulation = async ()=>{
        setIsSimulating(true);
        setSimulationProgress(0);
        setConversations([]);
        setCurrentTurn(0);
        try {
            // Simulate conversation generation process
            const steps = [
                'Initializing agents...',
                'Setting up conversation context...',
                'Generating first responses...',
                'Processing agent interactions...',
                'Monitoring goal progress...',
                'Completing conversations...'
            ];
            for(let i = 0; i < steps.length; i++){
                await new Promise((resolve)=>setTimeout(resolve, 1000));
                setSimulationProgress((i + 1) / steps.length * 100);
            }
            // Component now only displays data from props (populated via socket events)
            // No API calls - data comes from GoalConvoDashboard via socket events
            setIsSimulating(false);
        } catch (error) {
            console.error('Multi-agent simulation error:', error);
            setIsSimulating(false);
        }
    };
    const formatTimestamp = (timestamp)=>{
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                    className: "w-6 h-6 text-purple-400"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white",
                                    children: "Multi-Agent Simulation"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    isSimulating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: "Simulation Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-purple-400 font-semibold",
                                        children: [
                                            Math.round(simulationProgress),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                lineNumber: 291,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: "".concat(simulationProgress, "%")
                                    },
                                    className: "bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 296,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                lineNumber: 295,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                        lineNumber: 286,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this),
            conversations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-lg font-semibold text-white flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                className: "w-5 h-5 text-green-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this),
                            "Generated Conversations (",
                            conversations.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this),
                    conversations.map((conversation, index)=>{
                        var _conversation_mtld, _conversation_judge_score, _conversation_judge_score1, _conversation_mtld1;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: -20
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: index * 0.1
                            },
                            className: "bg-white/5 rounded-xl border border-white/20 overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 cursor-pointer hover:bg-white/10 transition-colors",
                                    onClick: ()=>setSelectedConversation(selectedConversation === index ? null : index),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 rounded-full ".concat(conversation.task_success ? 'bg-green-400' : 'bg-red-400')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                className: "font-semibold text-white",
                                                                children: conversation.conv_id
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 336,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-300",
                                                                children: [
                                                                    conversation.turns.length,
                                                                    " turns • MTLD: ",
                                                                    (_conversation_mtld = conversation.mtld) === null || _conversation_mtld === void 0 ? void 0 : _conversation_mtld.toFixed(1)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 337,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 rounded text-xs font-semibold ".concat(conversation.task_success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'),
                                                        children: conversation.task_success ? 'Success' : 'Failed'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-300",
                                                        children: [
                                                            "Judge: ",
                                                            (_conversation_judge_score = conversation.judge_score) === null || _conversation_judge_score === void 0 ? void 0 : _conversation_judge_score.toFixed(1)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                lineNumber: 342,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                        lineNumber: 330,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 326,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    animate: {
                                        height: selectedConversation === index ? 'auto' : 0,
                                        opacity: selectedConversation === index ? 1 : 0
                                    },
                                    className: "border-t border-white/20 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 space-y-3 max-h-96 overflow-y-auto",
                                            children: conversation.turns.map((turn, turnIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    initial: {
                                                        opacity: 0,
                                                        y: 10
                                                    },
                                                    animate: {
                                                        opacity: 1,
                                                        y: 0
                                                    },
                                                    transition: {
                                                        delay: turnIndex * 0.1
                                                    },
                                                    className: "flex gap-3 ".concat(turn.speaker_role === 'patient' || turn.speaker_role === 'customer' ? 'justify-start' : 'justify-end'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-w-md p-3 rounded-lg ".concat(turn.speaker_role === 'patient' || turn.speaker_role === 'customer' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-purple-500/20 border border-purple-400/30'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    turn.speaker_role === 'patient' || turn.speaker_role === 'customer' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                        className: "w-4 h-4 text-blue-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 29
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                                        className: "w-4 h-4 text-purple-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-white text-sm",
                                                                        children: turn.speaker
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                        lineNumber: 388,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    turn.timestamp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-gray-400",
                                                                        children: formatTimestamp(turn.timestamp)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                        lineNumber: 390,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 382,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-200",
                                                                children: turn.text
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 395,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 23
                                                    }, this)
                                                }, turn.turn_id, false, {
                                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                    lineNumber: 366,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-4 pb-4 border-t border-white/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-4 gap-4 pt-3 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-gray-400",
                                                                children: "Total Turns"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 405,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-white font-semibold",
                                                                children: conversation.turns.length
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-gray-400",
                                                                children: "Judge Score"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-white font-semibold",
                                                                children: (_conversation_judge_score1 = conversation.judge_score) === null || _conversation_judge_score1 === void 0 ? void 0 : _conversation_judge_score1.toFixed(1)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-gray-400",
                                                                children: "MTLD"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 413,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-white font-semibold",
                                                                children: (_conversation_mtld1 = conversation.mtld) === null || _conversation_mtld1 === void 0 ? void 0 : _conversation_mtld1.toFixed(1)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 414,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-gray-400",
                                                                children: "Model"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 417,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-white font-semibold text-xs",
                                                                children: conversation.provenance.generator_model
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                                lineNumber: 418,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                        lineNumber: 416,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                            lineNumber: 402,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, conversation.conv_id, true, {
                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                            lineNumber: 319,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                lineNumber: 308,
                columnNumber: 9
            }, this),
            isSimulating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.9
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                className: "bg-white/5 rounded-xl p-4 border border-white/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-cyan-400",
                                    children: conversations.length
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 437,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Conversations"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 438,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                            lineNumber: 436,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-purple-400",
                                    children: currentTurn
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 441,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Current Turn"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 442,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                            lineNumber: 440,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-green-400",
                                    children: [
                                        Math.round(simulationProgress),
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 445,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Progress"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                            lineNumber: 444,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                    lineNumber: 435,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/MultiAgentSimulator.tsx",
                lineNumber: 430,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/MultiAgentSimulator.tsx",
        lineNumber: 255,
        columnNumber: 5
    }, this);
}
_s(MultiAgentSimulator, "UJO176iI46hr7INR6I96nlqdiZQ=");
_c = MultiAgentSimulator;
var _c;
__turbopack_context__.k.register(_c, "MultiAgentSimulator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/PostProcessor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PostProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function PostProcessor(param) {
    let { conversations = [], filteredConversations: propFilteredConversations = [], autoStart = false, onLog, onComplete } = param;
    _s();
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filteredConversations, setFilteredConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(propFilteredConversations);
    const [processingStep, setProcessingStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        total: 0,
        kept: 0,
        removed: 0,
        modified: 0
    });
    // Update local state when filteredConversations prop changes (from socket events)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PostProcessor.useEffect": ()=>{
            if (propFilteredConversations.length > 0) {
                setFilteredConversations(propFilteredConversations);
                setProgress(100);
                setIsProcessing(false);
                // Calculate stats from filtered conversations
                const kept = propFilteredConversations.filter({
                    "PostProcessor.useEffect": (fc)=>fc.status === 'kept'
                }["PostProcessor.useEffect"]).length;
                const removed = propFilteredConversations.filter({
                    "PostProcessor.useEffect": (fc)=>fc.status === 'removed'
                }["PostProcessor.useEffect"]).length;
                const modified = propFilteredConversations.filter({
                    "PostProcessor.useEffect": (fc)=>fc.status === 'modified'
                }["PostProcessor.useEffect"]).length;
                setStats({
                    total: propFilteredConversations.length,
                    kept,
                    removed,
                    modified
                });
                onComplete(propFilteredConversations);
            } else if (propFilteredConversations.length === 0 && filteredConversations.length > 0) {
                // Reset when filtered conversations are cleared
                setFilteredConversations([]);
                setProgress(0);
                setStats({
                    total: 0,
                    kept: 0,
                    removed: 0,
                    modified: 0
                });
            }
        }
    }["PostProcessor.useEffect"], [
        propFilteredConversations,
        onComplete
    ]);
    const mockFilteredResults = [
        {
            id: 'filtered_001',
            original_id: 'goalconvo_001_001',
            status: 'kept',
            reason: 'High quality conversation with successful task completion',
            score: 0.95,
            metadata: {
                similarity_score: 0.12,
                fluency_score: 0.98,
                coherence_score: 0.96,
                task_success_score: 0.94
            }
        },
        {
            id: 'filtered_002',
            original_id: 'goalconvo_001_002',
            status: 'kept',
            reason: 'Excellent customer service interaction',
            score: 0.92,
            metadata: {
                similarity_score: 0.08,
                fluency_score: 0.95,
                coherence_score: 0.93,
                task_success_score: 0.89
            }
        }
    ];
    const startProcessing = async ()=>{
        setIsProcessing(true);
        setProgress(0);
        setFilteredConversations([]);
        setStats({
            total: 0,
            kept: 0,
            removed: 0,
            modified: 0
        });
        try {
            const steps = [
                'Analyzing conversation quality...',
                'Checking for duplicates...',
                'Evaluating task success...',
                'Assessing fluency and coherence...',
                'Applying filtering criteria...',
                'Finalizing filtered dataset...'
            ];
            for(let i = 0; i < steps.length; i++){
                setProcessingStep(steps[i]);
                setProgress((i + 1) / steps.length * 100);
                // Simulate processing time
                await new Promise((resolve)=>setTimeout(resolve, 1200));
                // Update stats as we process
                if (i === 2) {
                    setStats((prev)=>({
                            ...prev,
                            total: 2
                        }));
                }
                if (i === 4) {
                    setStats((prev)=>({
                            ...prev,
                            kept: 2
                        }));
                }
            }
            // Component now only displays data from props (populated via socket events)
            // No API calls - data comes from GoalConvoDashboard via socket events
            setIsProcessing(false);
        } catch (error) {
            console.error('Post-processing error:', error);
            setIsProcessing(false);
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'kept':
                return 'text-green-400 bg-green-500/20 border-green-400/30';
            case 'removed':
                return 'text-red-400 bg-red-500/20 border-red-400/30';
            case 'modified':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
        }
    };
    const getStatusIcon = (status)=>{
        switch(status){
            case 'kept':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/app/components/PostProcessor.tsx",
                    lineNumber: 183,
                    columnNumber: 27
                }, this);
            case 'removed':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/app/components/PostProcessor.tsx",
                    lineNumber: 184,
                    columnNumber: 30
                }, this);
            case 'modified':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/app/components/PostProcessor.tsx",
                    lineNumber: 185,
                    columnNumber: 31
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/app/components/PostProcessor.tsx",
                    lineNumber: 186,
                    columnNumber: 23
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                    className: "w-6 h-6 text-pink-400"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white",
                                    children: "Post-Processing & Filtering"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/PostProcessor.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: processingStep
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-pink-400 font-semibold",
                                        children: [
                                            Math.round(progress),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: "".concat(progress, "%")
                                    },
                                    className: "bg-gradient-to-r from-pink-400 to-red-600 h-3 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/PostProcessor.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            stats.total > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "grid grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-xl p-4 border border-white/20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-cyan-400",
                                children: stats.total
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-400",
                                children: "Total Conversations"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-xl p-4 border border-white/20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-green-400",
                                children: stats.kept
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-400",
                                children: "Kept"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-xl p-4 border border-white/20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-red-400",
                                children: stats.removed
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-400",
                                children: "Removed"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 259,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-xl p-4 border border-white/20 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-yellow-400",
                                children: stats.modified
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-400",
                                children: "Modified"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/PostProcessor.tsx",
                lineNumber: 244,
                columnNumber: 9
            }, this),
            filteredConversations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-lg font-semibold text-white flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                className: "w-5 h-5 text-green-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this),
                            "Filtered Results"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    filteredConversations.map((result, index)=>{
                        var _this, _this1, _this2, _this3, _this4, _this5;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: -20
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: index * 0.1
                            },
                            className: "rounded-xl border p-4 ".concat(getStatusColor(result.status)),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                getStatusIcon(result.status),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-white",
                                                    children: result.original_id
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/PostProcessor.tsx",
                                            lineNumber: 289,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-gray-300",
                                                    children: "Score:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold ".concat((_this = result.score * 100) === null || _this === void 0 ? void 0 : _this.toFixed(0)),
                                                    children: [
                                                        (_this1 = result.score * 100) === null || _this1 === void 0 ? void 0 : _this1.toFixed(0),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/PostProcessor.tsx",
                                            lineNumber: 293,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 mb-3",
                                    children: result.reason
                                }, void 0, false, {
                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                    lineNumber: 301,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                                    children: [
                                        result.metadata.similarity_score !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-400 mb-1",
                                                    children: "Similarity"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-semibold ".concat(result.metadata.similarity_score < 0.3 ? 'text-green-400' : 'text-red-400'),
                                                    children: [
                                                        (_this2 = result.metadata.similarity_score * 100) === null || _this2 === void 0 ? void 0 : _this2.toFixed(1),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/PostProcessor.tsx",
                                            lineNumber: 306,
                                            columnNumber: 19
                                        }, this),
                                        result.metadata.fluency_score !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-400 mb-1",
                                                    children: "Fluency"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-semibold ".concat(result.metadata.fluency_score > 0.8 ? 'text-green-400' : 'text-yellow-400'),
                                                    children: [
                                                        (_this3 = result.metadata.fluency_score * 100) === null || _this3 === void 0 ? void 0 : _this3.toFixed(1),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/PostProcessor.tsx",
                                            lineNumber: 316,
                                            columnNumber: 19
                                        }, this),
                                        result.metadata.coherence_score !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-400 mb-1",
                                                    children: "Coherence"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-semibold ".concat(result.metadata.coherence_score > 0.8 ? 'text-green-400' : 'text-yellow-400'),
                                                    children: [
                                                        (_this4 = result.metadata.coherence_score * 100) === null || _this4 === void 0 ? void 0 : _this4.toFixed(1),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/PostProcessor.tsx",
                                            lineNumber: 326,
                                            columnNumber: 19
                                        }, this),
                                        result.metadata.task_success_score !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-400 mb-1",
                                                    children: "Task Success"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-semibold ".concat(result.metadata.task_success_score > 0.8 ? 'text-green-400' : 'text-yellow-400'),
                                                    children: [
                                                        (_this5 = result.metadata.task_success_score * 100) === null || _this5 === void 0 ? void 0 : _this5.toFixed(1),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/PostProcessor.tsx",
                                            lineNumber: 336,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/PostProcessor.tsx",
                                    lineNumber: 304,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, result.id, true, {
                            fileName: "[project]/app/components/PostProcessor.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/PostProcessor.tsx",
                lineNumber: 270,
                columnNumber: 9
            }, this),
            filteredConversations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                className: "w-5 h-5 text-cyan-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this),
                            "Quality Metrics Overview"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 358,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-green-400",
                                        children: filteredConversations.filter((c)=>c.status === 'kept').length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 365,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-400",
                                        children: "High Quality"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 368,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: [
                                            "Score ",
                                            '>',
                                            " 90%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 369,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 364,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-yellow-400",
                                        children: filteredConversations.filter((c)=>c.status === 'modified').length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-400",
                                        children: "Needs Review"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: "Score 70-90%"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 371,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-cyan-400",
                                        children: [
                                            Math.round(filteredConversations.reduce((acc, c)=>acc + c.score, 0) / filteredConversations.length * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-400",
                                        children: "Avg Score"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 382,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 378,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-purple-400",
                                        children: filteredConversations.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-400",
                                        children: "Total Filtered"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/PostProcessor.tsx",
                                        lineNumber: 388,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/PostProcessor.tsx",
                                lineNumber: 384,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/PostProcessor.tsx",
                        lineNumber: 363,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/PostProcessor.tsx",
                lineNumber: 353,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/PostProcessor.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
_s(PostProcessor, "rwsd8+whPrSM1WIJ9wWS1ksZPOU=");
_c = PostProcessor;
var _c;
__turbopack_context__.k.register(_c, "PostProcessor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Evaluator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Evaluator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Evaluator(param) {
    let { dataset = [], metrics: propMetrics, autoStart = false, onLog, onComplete } = param;
    var _metrics_comprehensive_metrics, _metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore, _metrics_comprehensive_metrics_bertscore_similarity_target_score, _metrics_comprehensive_metrics1, _metrics_comprehensive_metrics_lexical_diversity_combined, _metrics_comprehensive_metrics_lexical_diversity_target_diversity, _metrics_comprehensive_metrics_lexical_diversity_distinct_1, _metrics_comprehensive_metrics_lexical_diversity_distinct_2, _metrics_comprehensive_metrics2, _metrics_comprehensive_metrics_response_time_avg_response_time, _metrics_comprehensive_metrics_response_time, _metrics_comprehensive_metrics3, _metrics_comprehensive_metrics_response_time_target_time, _metrics_comprehensive_metrics_response_time1, _metrics_comprehensive_metrics4, _metrics_comprehensive_metrics_response_time2, _metrics_comprehensive_metrics5, _metrics_comprehensive_metrics_response_time_avg_response_time1, _metrics_comprehensive_metrics_response_time3, _metrics_comprehensive_metrics6, _metrics_comprehensive_metrics_response_time_avg_time_per_turn, _metrics_comprehensive_metrics_response_time_min_response_time, _metrics_comprehensive_metrics_response_time_max_response_time, _this, _this1, _this2, _this3, _this4, _this5, _metrics_categories_lexical_diversity, _metrics_categories_conversation_length_avg_turns, _metrics_categories_conversation_length_std_dev, _metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore1, _metrics_comprehensive_metrics_bertscore_similarity_target_score1, _metrics_comprehensive_metrics_bertscore_similarity_std_bertscore, _metrics_comprehensive_metrics_lexical_diversity_combined1, _metrics_comprehensive_metrics_lexical_diversity_target_diversity1, _metrics_comprehensive_metrics_lexical_diversity_distinct_11, _metrics_comprehensive_metrics_lexical_diversity_distinct_21, _metrics_comprehensive_metrics_lexical_diversity_combined2, _metrics_comprehensive_metrics_lexical_diversity_real_diversity_combined, _metrics_comprehensive_metrics_lexical_diversity_diversity_ratio, _metrics_comprehensive_metrics_response_time_avg_response_time2, _metrics_comprehensive_metrics_response_time4, _metrics_comprehensive_metrics7, _metrics_comprehensive_metrics_response_time_target_time1, _metrics_comprehensive_metrics_response_time_avg_time_per_turn1, _metrics_comprehensive_metrics_response_time_min_response_time1, _metrics_comprehensive_metrics_response_time_max_response_time1, _metrics_comprehensive_metrics_response_time_std_response_time, _metrics_comprehensive_metrics_goal_completion_rate_overall_gcr, _metrics_comprehensive_metrics_task_success_rate_overall_tsr, _metrics_comprehensive_metrics_bleu_score_average_bleu, _metrics_comprehensive_metrics_bleu_score_std_bleu, _this6, _metrics_comprehensive_metrics_llm_judge, _metrics_comprehensive_metrics_llm_judge_overall_scores_task_success_mean, _metrics_comprehensive_metrics_llm_judge_overall_scores_coherence_mean, _metrics_comprehensive_metrics_llm_judge_overall_scores_diversity_mean, _metrics_comprehensive_metrics_llm_judge_overall_scores_fluency_mean, _metrics_comprehensive_metrics_llm_judge_overall_scores_groundedness_mean, _metrics_comprehensive_metrics_dialogue_length_avg_turns, _metrics_comprehensive_metrics_dialogue_length_std_turns, _metrics_comprehensive_metrics_dialogue_length_avg_words, _metrics_comprehensive_metrics_dialogue_length_avg_chars, _metrics_comprehensive_metrics8, _metrics_comprehensive_metrics_goal_completion_rate_overall_gcr1, _metrics_comprehensive_metrics9, _metrics_comprehensive_metrics_bleu_score_average_bleu1, _metrics_comprehensive_metrics10, _this7;
    _s();
    const [isEvaluating, setIsEvaluating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(propMetrics || null);
    const [evaluationStep, setEvaluationStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Update local state when metrics prop changes (from socket events)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Evaluator.useEffect": ()=>{
            if (propMetrics) {
                setMetrics(propMetrics);
                setProgress(100);
                setIsEvaluating(false);
                onComplete(propMetrics);
            } else if (!propMetrics && metrics) {
                // Reset when metrics are cleared
                setMetrics(null);
                setProgress(0);
            }
        }
    }["Evaluator.useEffect"], [
        propMetrics,
        onComplete
    ]);
    const mockMetrics = {
        overall_score: 0.89,
        diversity_score: 0.85,
        coherence_score: 0.92,
        task_success_rate: 0.87,
        fluency_score: 0.91,
        groundedness_score: 0.88,
        categories: {
            lexical_diversity: 78.5,
            conversation_length: {
                avg_turns: 6.8,
                std_dev: 2.1
            },
            domain_distribution: {
                healthcare: 45,
                customer_support: 35,
                education: 20
            },
            task_success_by_domain: {
                healthcare: 0.92,
                customer_support: 0.85,
                education: 0.83
            }
        }
    };
    const startEvaluation = async ()=>{
        setIsEvaluating(true);
        setProgress(0);
        setMetrics(null);
        try {
            const steps = [
                'Analyzing lexical diversity (MTLD)...',
                'Evaluating conversation coherence...',
                'Assessing task success rates...',
                'Measuring fluency and naturalness...',
                'Checking groundedness in personas...',
                'Computing domain distribution...',
                'Generating final evaluation report...'
            ];
            for(let i = 0; i < steps.length; i++){
                setEvaluationStep(steps[i]);
                setProgress((i + 1) / steps.length * 100);
                await new Promise((resolve)=>setTimeout(resolve, 1500));
            }
            // Component now only displays data from props (populated via socket events)
            // No API calls - data comes from GoalConvoDashboard via socket events
            setIsEvaluating(false);
        } catch (error) {
            console.error('Evaluation error:', error);
            onLog === null || onLog === void 0 ? void 0 : onLog({
                status: 'error',
                message: "Evaluation failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'Unknown error', ". Using mock evaluation metrics.")
            });
            // Fallback to mock data if API fails
            setMetrics(mockMetrics);
            setIsEvaluating(false);
            onComplete(mockMetrics);
        } finally{
            setIsEvaluating(false);
        }
    };
    const getScoreColor = (score)=>{
        if (score >= 0.9) return 'text-green-400 bg-green-500/20 border-green-400/30';
        if (score >= 0.8) return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
        if (score >= 0.7) return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
        return 'text-red-400 bg-red-500/20 border-red-400/30';
    };
    const getScoreIcon = (score)=>{
        if (score >= 0.9) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/app/components/Evaluator.tsx",
            lineNumber: 223,
            columnNumber: 30
        }, this);
        if (score >= 0.8) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/app/components/Evaluator.tsx",
            lineNumber: 224,
            columnNumber: 30
        }, this);
        if (score >= 0.7) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/app/components/Evaluator.tsx",
            lineNumber: 225,
            columnNumber: 30
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/app/components/Evaluator.tsx",
            lineNumber: 226,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                    className: "w-6 h-6 text-cyan-400"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Evaluator.tsx",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white",
                                    children: "Evaluation Framework"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Evaluator.tsx",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Evaluator.tsx",
                            lineNumber: 234,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    isEvaluating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300",
                                        children: evaluationStep
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400 font-semibold",
                                        children: [
                                            Math.round(progress),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: "".concat(progress, "%")
                                    },
                                    className: "bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Evaluator.tsx",
                                    lineNumber: 271,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 270,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Evaluator.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            metrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "space-y-6",
                children: [
                    ((_metrics_comprehensive_metrics = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics === void 0 ? void 0 : _metrics_comprehensive_metrics.bertscore_similarity) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border-2 border-blue-400/50 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                className: "w-8 h-8 text-blue-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 293,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: "BERTScore Semantic Similarity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-300",
                                                        children: "Measures semantic similarity to MultiWOZ reference dialogues"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 294,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 292,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-4xl font-bold text-blue-400",
                                                children: (_metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore = metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore) === null || _metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore === void 0 ? void 0 : _metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore.toFixed(3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 300,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-300",
                                                children: [
                                                    "Target: ",
                                                    (_metrics_comprehensive_metrics_bertscore_similarity_target_score = metrics.comprehensive_metrics.bertscore_similarity.target_score) === null || _metrics_comprehensive_metrics_bertscore_similarity_target_score === void 0 ? void 0 : _metrics_comprehensive_metrics_bertscore_similarity_target_score.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 303,
                                                columnNumber: 19
                                            }, this),
                                            metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore >= metrics.comprehensive_metrics.bertscore_similarity.target_score ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-sm font-semibold mt-1",
                                                children: "✅ Above Target"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 307,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-yellow-400 text-sm font-semibold mt-1",
                                                children: "⚠️ Below Target"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 309,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 299,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 291,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-blue-400 to-cyan-600 h-4 rounded-full transition-all duration-500",
                                    style: {
                                        width: "".concat(metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore / metrics.comprehensive_metrics.bertscore_similarity.target_score * 100, "%")
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Evaluator.tsx",
                                    lineNumber: 314,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 313,
                                columnNumber: 15
                            }, this),
                            metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 grid grid-cols-2 md:grid-cols-5 gap-3",
                                children: Object.entries(metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores).map((param)=>{
                                    let [domain, stats] = param;
                                    var _stats_mean;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 capitalize mb-1",
                                                children: domain
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 323,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-white",
                                                children: (_stats_mean = stats.mean) === null || _stats_mean === void 0 ? void 0 : _stats_mean.toFixed(3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 324,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "n=",
                                                    stats.count
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 325,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, domain, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 322,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 320,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 290,
                        columnNumber: 13
                    }, this),
                    ((_metrics_comprehensive_metrics1 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics1 === void 0 ? void 0 : _metrics_comprehensive_metrics1.lexical_diversity) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-purple-400/50 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                className: "w-8 h-8 text-purple-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 338,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: "Lexical Diversity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-300",
                                                        children: "Measures vocabulary richness using Distinct-1 and Distinct-2 metrics"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 339,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 337,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-4xl font-bold text-purple-400",
                                                children: (_metrics_comprehensive_metrics_lexical_diversity_combined = metrics.comprehensive_metrics.lexical_diversity.combined) === null || _metrics_comprehensive_metrics_lexical_diversity_combined === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_combined.toFixed(3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 345,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-300",
                                                children: [
                                                    "Target: ",
                                                    (_metrics_comprehensive_metrics_lexical_diversity_target_diversity = metrics.comprehensive_metrics.lexical_diversity.target_diversity) === null || _metrics_comprehensive_metrics_lexical_diversity_target_diversity === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_target_diversity.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this),
                                            metrics.comprehensive_metrics.lexical_diversity.combined >= metrics.comprehensive_metrics.lexical_diversity.target_diversity ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-sm font-semibold mt-1",
                                                children: "✅ Above Target"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 352,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-yellow-400 text-sm font-semibold mt-1",
                                                children: "⚠️ Below Target"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 354,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 344,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 336,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 rounded-lg p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mb-1",
                                                children: "Distinct-1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 360,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-purple-300",
                                                children: (_metrics_comprehensive_metrics_lexical_diversity_distinct_1 = metrics.comprehensive_metrics.lexical_diversity.distinct_1) === null || _metrics_comprehensive_metrics_lexical_diversity_distinct_1 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_distinct_1.toFixed(3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 361,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 mt-1",
                                                children: "Unique unigrams / Total"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 359,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 rounded-lg p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mb-1",
                                                children: "Distinct-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 367,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-pink-300",
                                                children: (_metrics_comprehensive_metrics_lexical_diversity_distinct_2 = metrics.comprehensive_metrics.lexical_diversity.distinct_2) === null || _metrics_comprehensive_metrics_lexical_diversity_distinct_2 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_distinct_2.toFixed(3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 368,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 mt-1",
                                                children: "Unique bigrams / Total"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 371,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 366,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 358,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-purple-400 to-pink-600 h-4 rounded-full transition-all duration-500",
                                    style: {
                                        width: "".concat(Math.min(metrics.comprehensive_metrics.lexical_diversity.combined / metrics.comprehensive_metrics.lexical_diversity.target_diversity * 100, 100), "%")
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Evaluator.tsx",
                                    lineNumber: 375,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 374,
                                columnNumber: 15
                            }, this),
                            metrics.comprehensive_metrics.lexical_diversity.domain_diversity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 grid grid-cols-2 md:grid-cols-5 gap-3",
                                children: Object.entries(metrics.comprehensive_metrics.lexical_diversity.domain_diversity).map((param)=>{
                                    let [domain, stats] = param;
                                    var _stats_combined, _stats_distinct_1;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 capitalize mb-1",
                                                children: domain
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 384,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-white",
                                                children: (_stats_combined = stats.combined) === null || _stats_combined === void 0 ? void 0 : _stats_combined.toFixed(3)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 385,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "D-1: ",
                                                    (_stats_distinct_1 = stats.distinct_1) === null || _stats_distinct_1 === void 0 ? void 0 : _stats_distinct_1.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 386,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, domain, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 383,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 381,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 335,
                        columnNumber: 13
                    }, this),
                    ((_metrics_comprehensive_metrics2 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics2 === void 0 ? void 0 : _metrics_comprehensive_metrics2.response_time) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border-2 border-green-400/50 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "w-8 h-8 text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 399,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: "Response Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-300",
                                                        children: "Measures dialogue generation time per dialogue"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 400,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 398,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-4xl font-bold text-green-400",
                                                children: [
                                                    (_metrics_comprehensive_metrics3 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics3 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time = _metrics_comprehensive_metrics3.response_time) === null || _metrics_comprehensive_metrics_response_time === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time_avg_response_time = _metrics_comprehensive_metrics_response_time.avg_response_time) === null || _metrics_comprehensive_metrics_response_time_avg_response_time === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_avg_response_time.toFixed(2),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 406,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-300",
                                                children: [
                                                    "Target: ",
                                                    (_metrics_comprehensive_metrics_response_time_target_time = metrics.comprehensive_metrics.response_time.target_time) === null || _metrics_comprehensive_metrics_response_time_target_time === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_target_time.toFixed(1),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            ((_metrics_comprehensive_metrics4 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics4 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time1 = _metrics_comprehensive_metrics4.response_time) === null || _metrics_comprehensive_metrics_response_time1 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time1.avg_response_time) <= ((_metrics_comprehensive_metrics5 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics5 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time2 = _metrics_comprehensive_metrics5.response_time) === null || _metrics_comprehensive_metrics_response_time2 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time2.target_time) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-sm font-semibold mt-1",
                                                children: "✅ Within Target"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 413,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-yellow-400 text-sm font-semibold mt-1",
                                                children: "⚠️ Above Target"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 415,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 405,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 397,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 rounded-lg p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mb-1",
                                                children: "Average"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 421,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-green-300",
                                                children: [
                                                    (_metrics_comprehensive_metrics6 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics6 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time3 = _metrics_comprehensive_metrics6.response_time) === null || _metrics_comprehensive_metrics_response_time3 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time_avg_response_time1 = _metrics_comprehensive_metrics_response_time3.avg_response_time) === null || _metrics_comprehensive_metrics_response_time_avg_response_time1 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_avg_response_time1.toFixed(2),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 422,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 420,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 rounded-lg p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mb-1",
                                                children: "Per Turn"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 427,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-emerald-300",
                                                children: [
                                                    (_metrics_comprehensive_metrics_response_time_avg_time_per_turn = metrics.comprehensive_metrics.response_time.avg_time_per_turn) === null || _metrics_comprehensive_metrics_response_time_avg_time_per_turn === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_avg_time_per_turn.toFixed(3),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 428,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 426,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 rounded-lg p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mb-1",
                                                children: "Min"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 433,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-green-200",
                                                children: [
                                                    (_metrics_comprehensive_metrics_response_time_min_response_time = metrics.comprehensive_metrics.response_time.min_response_time) === null || _metrics_comprehensive_metrics_response_time_min_response_time === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_min_response_time.toFixed(2),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 434,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 432,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 rounded-lg p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 mb-1",
                                                children: "Max"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 439,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-green-200",
                                                children: [
                                                    (_metrics_comprehensive_metrics_response_time_max_response_time = metrics.comprehensive_metrics.response_time.max_response_time) === null || _metrics_comprehensive_metrics_response_time_max_response_time === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_max_response_time.toFixed(2),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 440,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 438,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 419,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white/20 rounded-full h-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-green-400 to-emerald-600 h-4 rounded-full transition-all duration-500",
                                    style: {
                                        width: "".concat(Math.min(metrics.comprehensive_metrics.response_time.target_time / Math.max(metrics.comprehensive_metrics.response_time.avg_response_time, 0.1) * 100, 100), "%")
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Evaluator.tsx",
                                    lineNumber: 446,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 445,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 text-sm text-gray-400",
                                children: [
                                    metrics.comprehensive_metrics.response_time.dialogues_with_timing,
                                    " / ",
                                    metrics.comprehensive_metrics.response_time.total_dialogues,
                                    " dialogues with timing data"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 451,
                                columnNumber: 15
                            }, this),
                            metrics.comprehensive_metrics.response_time.domain_response_times && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 grid grid-cols-2 md:grid-cols-5 gap-3",
                                children: Object.entries(metrics.comprehensive_metrics.response_time.domain_response_times).map((param)=>{
                                    let [domain, stats] = param;
                                    var _stats_mean;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400 capitalize mb-1",
                                                children: domain
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 458,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-white",
                                                children: [
                                                    (_stats_mean = stats.mean) === null || _stats_mean === void 0 ? void 0 : _stats_mean.toFixed(2),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 459,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "n=",
                                                    stats.count
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 460,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, domain, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 457,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 455,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 396,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 ".concat(getScoreColor(metrics.overall_score)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            getScoreIcon(metrics.overall_score),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: "Overall Score"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            (_this = metrics.overall_score * 100) === null || _this === void 0 ? void 0 : _this.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 475,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 470,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 ".concat(getScoreColor(metrics.diversity_score)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            getScoreIcon(metrics.diversity_score),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: "Diversity"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 483,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            (_this1 = metrics.diversity_score * 100) === null || _this1 === void 0 ? void 0 : _this1.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 485,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 480,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 ".concat(getScoreColor(metrics.coherence_score)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            getScoreIcon(metrics.coherence_score),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: "Coherence"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 493,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 491,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            (_this2 = metrics.coherence_score * 100) === null || _this2 === void 0 ? void 0 : _this2.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 495,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 490,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 ".concat(getScoreColor(metrics.task_success_rate)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            getScoreIcon(metrics.task_success_rate),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: "Task Success"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 503,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 501,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            (_this3 = metrics.task_success_rate * 100) === null || _this3 === void 0 ? void 0 : _this3.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 500,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 ".concat(getScoreColor(metrics.fluency_score)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            getScoreIcon(metrics.fluency_score),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: "Fluency"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 513,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 511,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            (_this4 = metrics.fluency_score * 100) === null || _this4 === void 0 ? void 0 : _this4.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 515,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 510,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 ".concat(getScoreColor(metrics.groundedness_score)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-2",
                                        children: [
                                            getScoreIcon(metrics.groundedness_score),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: "Groundedness"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 523,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 521,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: [
                                            (_this5 = metrics.groundedness_score * 100) === null || _this5 === void 0 ? void 0 : _this5.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 525,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 520,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 469,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                className: "w-5 h-5 text-purple-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 536,
                                                columnNumber: 17
                                            }, this),
                                            "Lexical Diversity"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300",
                                                        children: "MTLD Score"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-white",
                                                        children: (_metrics_categories_lexical_diversity = metrics.categories.lexical_diversity) === null || _metrics_categories_lexical_diversity === void 0 ? void 0 : _metrics_categories_lexical_diversity.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 542,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 540,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full bg-white/20 rounded-full h-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gradient-to-r from-purple-400 to-pink-600 h-2 rounded-full",
                                                    style: {
                                                        width: "".concat(metrics.categories.lexical_diversity / 100 * 100, "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                    lineNumber: 545,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 544,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400",
                                                children: "Higher MTLD indicates greater lexical diversity and richness in vocabulary"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 550,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 539,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 534,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                className: "w-5 h-5 text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 559,
                                                columnNumber: 17
                                            }, this),
                                            "Conversation Statistics"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 558,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300",
                                                        children: "Average Turns"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 564,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-white",
                                                        children: (_metrics_categories_conversation_length_avg_turns = metrics.categories.conversation_length.avg_turns) === null || _metrics_categories_conversation_length_avg_turns === void 0 ? void 0 : _metrics_categories_conversation_length_avg_turns.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 565,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 563,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300",
                                                        children: "Standard Deviation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-white",
                                                        children: (_metrics_categories_conversation_length_std_dev = metrics.categories.conversation_length.std_dev) === null || _metrics_categories_conversation_length_std_dev === void 0 ? void 0 : _metrics_categories_conversation_length_std_dev.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 569,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400",
                                                children: "Balanced conversation lengths indicate natural dialogue patterns"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 571,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 562,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 557,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 532,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-xl p-6 border border-white/20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                        className: "w-5 h-5 text-cyan-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 581,
                                        columnNumber: 15
                                    }, this),
                                    "Domain Distribution"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 580,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
                                children: Object.entries(metrics.categories.domain_distribution).map((param)=>{
                                    let [domain, percentage] = param;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-white mb-1 capitalize",
                                                children: domain.replace('_', ' ')
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 588,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-cyan-400",
                                                children: [
                                                    percentage,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 589,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, domain, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 587,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 585,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: Object.entries(metrics.categories.domain_distribution).map((param)=>{
                                    let [domain, percentage] = param;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-24 text-sm text-gray-300 capitalize",
                                                children: domain.replace('_', ' ')
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 597,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 bg-white/20 rounded-full h-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full",
                                                    style: {
                                                        width: "".concat(percentage, "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 598,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 text-sm font-semibold text-white text-right",
                                                children: [
                                                    percentage,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 604,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, domain, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 596,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 594,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 579,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-xl p-6 border border-white/20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        className: "w-5 h-5 text-green-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 613,
                                        columnNumber: 15
                                    }, this),
                                    "Task Success by Domain"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 612,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: Object.entries(metrics.categories.task_success_by_domain).map((param)=>{
                                    let [domain, successRate] = param;
                                    var _this;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-lg p-4 border ".concat(getScoreColor(successRate)),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-2",
                                                children: [
                                                    getScoreIcon(successRate),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-white capitalize",
                                                        children: domain.replace('_', ' ')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 622,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 620,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-white",
                                                children: [
                                                    (_this = successRate * 100) === null || _this === void 0 ? void 0 : _this.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 624,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-300",
                                                children: "Success Rate"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 627,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, domain, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 619,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 617,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 611,
                        columnNumber: 11
                    }, this),
                    metrics.comprehensive_metrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-white mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                        className: "w-6 h-6 text-cyan-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 637,
                                        columnNumber: 17
                                    }, this),
                                    "Comprehensive Evaluation Metrics"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 636,
                                columnNumber: 15
                            }, this),
                            metrics.comprehensive_metrics.bertscore_similarity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-blue-400/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                className: "w-5 h-5 text-blue-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 645,
                                                columnNumber: 21
                                            }, this),
                                            "BERTScore Semantic Similarity"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 644,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300",
                                                        children: "Overall BERTScore"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 650,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-3xl font-bold text-blue-400",
                                                                children: (_metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore1 = metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore) === null || _metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore1 === void 0 ? void 0 : _metrics_comprehensive_metrics_bertscore_similarity_overall_bertscore1.toFixed(3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 652,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400 ml-2",
                                                                children: [
                                                                    "/ ",
                                                                    (_metrics_comprehensive_metrics_bertscore_similarity_target_score1 = metrics.comprehensive_metrics.bertscore_similarity.target_score) === null || _metrics_comprehensive_metrics_bertscore_similarity_target_score1 === void 0 ? void 0 : _metrics_comprehensive_metrics_bertscore_similarity_target_score1.toFixed(2),
                                                                    " target"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 655,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 651,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 649,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-400",
                                                children: [
                                                    "Std Dev: ",
                                                    (_metrics_comprehensive_metrics_bertscore_similarity_std_bertscore = metrics.comprehensive_metrics.bertscore_similarity.std_bertscore) === null || _metrics_comprehensive_metrics_bertscore_similarity_std_bertscore === void 0 ? void 0 : _metrics_comprehensive_metrics_bertscore_similarity_std_bertscore.toFixed(3)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 660,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full bg-white/20 rounded-full h-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gradient-to-r from-blue-400 to-cyan-600 h-3 rounded-full transition-all duration-500",
                                                    style: {
                                                        width: "".concat(Math.min(metrics.comprehensive_metrics.bertscore_similarity.overall_bertscore / metrics.comprehensive_metrics.bertscore_similarity.target_score * 100, 100), "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                    lineNumber: 664,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 663,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400 mt-2",
                                                children: metrics.comprehensive_metrics.bertscore_similarity.note || "Measures semantic similarity to MultiWOZ reference dialogues"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 669,
                                                columnNumber: 21
                                            }, this),
                                            metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-semibold text-gray-300",
                                                        children: "By Domain:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 674,
                                                        columnNumber: 25
                                                    }, this),
                                                    Object.entries(metrics.comprehensive_metrics.bertscore_similarity.domain_bertscores).map((param)=>{
                                                        let [domain, stats] = param;
                                                        var _stats_mean, _stats_std;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-center text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400 capitalize",
                                                                    children: domain
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-white",
                                                                            children: (_stats_mean = stats.mean) === null || _stats_mean === void 0 ? void 0 : _stats_mean.toFixed(3)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 679,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "±",
                                                                                (_stats_std = stats.std) === null || _stats_std === void 0 ? void 0 : _stats_std.toFixed(3)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 680,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "(n=",
                                                                                stats.count,
                                                                                ")"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 681,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 678,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, domain, true, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 676,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 673,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 648,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 643,
                                columnNumber: 17
                            }, this),
                            metrics.comprehensive_metrics.lexical_diversity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-purple-400/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                className: "w-5 h-5 text-purple-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 695,
                                                columnNumber: 21
                                            }, this),
                                            "Lexical Diversity"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 694,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Combined Score"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 701,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-3xl font-bold text-purple-400",
                                                                children: (_metrics_comprehensive_metrics_lexical_diversity_combined1 = metrics.comprehensive_metrics.lexical_diversity.combined) === null || _metrics_comprehensive_metrics_lexical_diversity_combined1 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_combined1.toFixed(3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 702,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: [
                                                                    "Target: ",
                                                                    (_metrics_comprehensive_metrics_lexical_diversity_target_diversity1 = metrics.comprehensive_metrics.lexical_diversity.target_diversity) === null || _metrics_comprehensive_metrics_lexical_diversity_target_diversity1 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_target_diversity1.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 705,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Distinct-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 710,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-purple-300",
                                                                children: (_metrics_comprehensive_metrics_lexical_diversity_distinct_11 = metrics.comprehensive_metrics.lexical_diversity.distinct_1) === null || _metrics_comprehensive_metrics_lexical_diversity_distinct_11 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_distinct_11.toFixed(3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 711,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: "Unique unigrams / Total"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 714,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 709,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Distinct-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 717,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-pink-300",
                                                                children: (_metrics_comprehensive_metrics_lexical_diversity_distinct_21 = metrics.comprehensive_metrics.lexical_diversity.distinct_2) === null || _metrics_comprehensive_metrics_lexical_diversity_distinct_21 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_distinct_21.toFixed(3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 718,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: "Unique bigrams / Total"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 721,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 699,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full bg-white/20 rounded-full h-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full transition-all duration-500",
                                                    style: {
                                                        width: "".concat(Math.min(metrics.comprehensive_metrics.lexical_diversity.combined / metrics.comprehensive_metrics.lexical_diversity.target_diversity * 100, 100), "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 724,
                                                columnNumber: 21
                                            }, this),
                                            metrics.comprehensive_metrics.lexical_diversity.real_diversity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4 mt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: "Synthetic Diversity:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 732,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-semibold text-white",
                                                        children: (_metrics_comprehensive_metrics_lexical_diversity_combined2 = metrics.comprehensive_metrics.lexical_diversity.combined) === null || _metrics_comprehensive_metrics_lexical_diversity_combined2 === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_combined2.toFixed(3)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 733,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: "Real (MultiWOZ) Diversity:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 736,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-semibold text-white",
                                                        children: (_metrics_comprehensive_metrics_lexical_diversity_real_diversity_combined = metrics.comprehensive_metrics.lexical_diversity.real_diversity.combined) === null || _metrics_comprehensive_metrics_lexical_diversity_real_diversity_combined === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_real_diversity_combined.toFixed(3)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 737,
                                                        columnNumber: 25
                                                    }, this),
                                                    metrics.comprehensive_metrics.lexical_diversity.diversity_ratio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400",
                                                                children: "Diversity Ratio:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 742,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-semibold text-purple-400",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics_lexical_diversity_diversity_ratio = metrics.comprehensive_metrics.lexical_diversity.diversity_ratio) === null || _metrics_comprehensive_metrics_lexical_diversity_diversity_ratio === void 0 ? void 0 : _metrics_comprehensive_metrics_lexical_diversity_diversity_ratio.toFixed(2),
                                                                    "x"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 743,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 731,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400 mt-2",
                                                children: metrics.comprehensive_metrics.lexical_diversity.note || "Measures vocabulary richness using Distinct-1 and Distinct-2 metrics"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 750,
                                                columnNumber: 21
                                            }, this),
                                            metrics.comprehensive_metrics.lexical_diversity.domain_diversity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-semibold text-gray-300",
                                                        children: "By Domain:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 755,
                                                        columnNumber: 25
                                                    }, this),
                                                    Object.entries(metrics.comprehensive_metrics.lexical_diversity.domain_diversity).map((param)=>{
                                                        let [domain, stats] = param;
                                                        var _stats_combined, _stats_distinct_1, _stats_distinct_2;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-center text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400 capitalize",
                                                                    children: domain
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 758,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-white",
                                                                            children: [
                                                                                "Combined: ",
                                                                                (_stats_combined = stats.combined) === null || _stats_combined === void 0 ? void 0 : _stats_combined.toFixed(3)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 760,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "D-1: ",
                                                                                (_stats_distinct_1 = stats.distinct_1) === null || _stats_distinct_1 === void 0 ? void 0 : _stats_distinct_1.toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 761,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "D-2: ",
                                                                                (_stats_distinct_2 = stats.distinct_2) === null || _stats_distinct_2 === void 0 ? void 0 : _stats_distinct_2.toFixed(2)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 762,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 759,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, domain, true, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 757,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 754,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 698,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 693,
                                columnNumber: 17
                            }, this),
                            metrics.comprehensive_metrics.response_time && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-green-400/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "w-5 h-5 text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 776,
                                                columnNumber: 21
                                            }, this),
                                            "Response Time"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 775,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Average Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 782,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-3xl font-bold text-green-400",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics7 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics7 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time4 = _metrics_comprehensive_metrics7.response_time) === null || _metrics_comprehensive_metrics_response_time4 === void 0 ? void 0 : (_metrics_comprehensive_metrics_response_time_avg_response_time2 = _metrics_comprehensive_metrics_response_time4.avg_response_time) === null || _metrics_comprehensive_metrics_response_time_avg_response_time2 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_avg_response_time2.toFixed(2),
                                                                    "s"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 783,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: [
                                                                    "Target: ",
                                                                    (_metrics_comprehensive_metrics_response_time_target_time1 = metrics.comprehensive_metrics.response_time.target_time) === null || _metrics_comprehensive_metrics_response_time_target_time1 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_target_time1.toFixed(1),
                                                                    "s"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 786,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 781,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Per Turn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 791,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-emerald-400",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics_response_time_avg_time_per_turn1 = metrics.comprehensive_metrics.response_time.avg_time_per_turn) === null || _metrics_comprehensive_metrics_response_time_avg_time_per_turn1 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_avg_time_per_turn1.toFixed(3),
                                                                    "s"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 792,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: "Average per turn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 795,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 790,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Min Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 798,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-green-300",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics_response_time_min_response_time1 = metrics.comprehensive_metrics.response_time.min_response_time) === null || _metrics_comprehensive_metrics_response_time_min_response_time1 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_min_response_time1.toFixed(2),
                                                                    "s"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 799,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 797,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white/10 rounded-lg p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-400 mb-2",
                                                                children: "Max Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 804,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-green-300",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics_response_time_max_response_time1 = metrics.comprehensive_metrics.response_time.max_response_time) === null || _metrics_comprehensive_metrics_response_time_max_response_time1 === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_max_response_time1.toFixed(2),
                                                                    "s"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 805,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 780,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-400",
                                                children: [
                                                    "Std Dev: ",
                                                    (_metrics_comprehensive_metrics_response_time_std_response_time = metrics.comprehensive_metrics.response_time.std_response_time) === null || _metrics_comprehensive_metrics_response_time_std_response_time === void 0 ? void 0 : _metrics_comprehensive_metrics_response_time_std_response_time.toFixed(3),
                                                    "s"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 810,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full bg-white/20 rounded-full h-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full transition-all duration-500",
                                                    style: {
                                                        width: "".concat(Math.min(metrics.comprehensive_metrics.response_time.target_time / Math.max(metrics.comprehensive_metrics.response_time.avg_response_time, 0.1) * 100, 100), "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                    lineNumber: 814,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 813,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400 mt-2",
                                                children: metrics.comprehensive_metrics.response_time.note || "Measures dialogue generation time in seconds"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 819,
                                                columnNumber: 21
                                            }, this),
                                            metrics.comprehensive_metrics.response_time.domain_response_times && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-semibold text-gray-300",
                                                        children: "By Domain:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 824,
                                                        columnNumber: 25
                                                    }, this),
                                                    Object.entries(metrics.comprehensive_metrics.response_time.domain_response_times).map((param)=>{
                                                        let [domain, stats] = param;
                                                        var _stats_mean, _stats_min, _stats_max;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-center text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400 capitalize",
                                                                    children: domain
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 827,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-white",
                                                                            children: [
                                                                                "Avg: ",
                                                                                (_stats_mean = stats.mean) === null || _stats_mean === void 0 ? void 0 : _stats_mean.toFixed(2),
                                                                                "s"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 829,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "Min: ",
                                                                                (_stats_min = stats.min) === null || _stats_min === void 0 ? void 0 : _stats_min.toFixed(2),
                                                                                "s"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 830,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "Max: ",
                                                                                (_stats_max = stats.max) === null || _stats_max === void 0 ? void 0 : _stats_max.toFixed(2),
                                                                                "s"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 831,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-500",
                                                                            children: [
                                                                                "(n=",
                                                                                stats.count,
                                                                                ")"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 832,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 828,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, domain, true, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 826,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 823,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 779,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 774,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    metrics.comprehensive_metrics.goal_completion_rate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                        className: "w-5 h-5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Goal Completion Rate (GCR)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 846,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300",
                                                                children: "Overall GCR"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 852,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl font-bold text-green-400",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics_goal_completion_rate_overall_gcr = metrics.comprehensive_metrics.goal_completion_rate.overall_gcr) === null || _metrics_comprehensive_metrics_goal_completion_rate_overall_gcr === void 0 ? void 0 : _metrics_comprehensive_metrics_goal_completion_rate_overall_gcr.toFixed(1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 853,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 851,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: [
                                                            metrics.comprehensive_metrics.goal_completion_rate.completed_count,
                                                            " / ",
                                                            metrics.comprehensive_metrics.goal_completion_rate.total_count,
                                                            " dialogues completed"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 857,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-white/20 rounded-full h-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full",
                                                            style: {
                                                                width: "".concat(metrics.comprehensive_metrics.goal_completion_rate.overall_gcr, "%")
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 861,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 860,
                                                        columnNumber: 23
                                                    }, this),
                                                    metrics.comprehensive_metrics.goal_completion_rate.domain_gcr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-semibold text-gray-300",
                                                                children: "By Domain:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 868,
                                                                columnNumber: 27
                                                            }, this),
                                                            Object.entries(metrics.comprehensive_metrics.goal_completion_rate.domain_gcr).map((param)=>{
                                                                let [domain, stats] = param;
                                                                var _stats_percentage;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-400 capitalize",
                                                                            children: domain
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 871,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-white",
                                                                            children: [
                                                                                (_stats_percentage = stats.percentage) === null || _stats_percentage === void 0 ? void 0 : _stats_percentage.toFixed(1),
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 872,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, domain, true, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 870,
                                                                    columnNumber: 29
                                                                }, this);
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 867,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 850,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 845,
                                        columnNumber: 19
                                    }, this),
                                    metrics.comprehensive_metrics.task_success_rate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        className: "w-5 h-5 text-blue-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 884,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Task Success Rate (TSR)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 883,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300",
                                                                children: "Overall TSR"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 889,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl font-bold text-blue-400",
                                                                children: [
                                                                    (_metrics_comprehensive_metrics_task_success_rate_overall_tsr = metrics.comprehensive_metrics.task_success_rate.overall_tsr) === null || _metrics_comprehensive_metrics_task_success_rate_overall_tsr === void 0 ? void 0 : _metrics_comprehensive_metrics_task_success_rate_overall_tsr.toFixed(1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 890,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 888,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: [
                                                            metrics.comprehensive_metrics.task_success_rate.successful_count,
                                                            " / ",
                                                            metrics.comprehensive_metrics.task_success_rate.total_count,
                                                            " dialogues successful"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 894,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-white/20 rounded-full h-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full",
                                                            style: {
                                                                width: "".concat(metrics.comprehensive_metrics.task_success_rate.overall_tsr, "%")
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 898,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 897,
                                                        columnNumber: 23
                                                    }, this),
                                                    metrics.comprehensive_metrics.task_success_rate.domain_tsr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-semibold text-gray-300",
                                                                children: "By Domain:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 905,
                                                                columnNumber: 27
                                                            }, this),
                                                            Object.entries(metrics.comprehensive_metrics.task_success_rate.domain_tsr).map((param)=>{
                                                                let [domain, stats] = param;
                                                                var _stats_percentage;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-gray-400 capitalize",
                                                                            children: domain
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 908,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-white",
                                                                            children: [
                                                                                (_stats_percentage = stats.percentage) === null || _stats_percentage === void 0 ? void 0 : _stats_percentage.toFixed(1),
                                                                                "%"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                                            lineNumber: 909,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, domain, true, {
                                                                    fileName: "[project]/app/components/Evaluator.tsx",
                                                                    lineNumber: 907,
                                                                    columnNumber: 29
                                                                }, this);
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 904,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 887,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 882,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 843,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    metrics.comprehensive_metrics.bleu_score && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                        className: "w-5 h-5 text-purple-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 924,
                                                        columnNumber: 23
                                                    }, this),
                                                    "BLEU Score"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 923,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300",
                                                                children: "Average BLEU"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 929,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl font-bold text-purple-400",
                                                                children: (_metrics_comprehensive_metrics_bleu_score_average_bleu = metrics.comprehensive_metrics.bleu_score.average_bleu) === null || _metrics_comprehensive_metrics_bleu_score_average_bleu === void 0 ? void 0 : _metrics_comprehensive_metrics_bleu_score_average_bleu.toFixed(3)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 930,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 928,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: [
                                                            "Std Dev: ",
                                                            (_metrics_comprehensive_metrics_bleu_score_std_bleu = metrics.comprehensive_metrics.bleu_score.std_bleu) === null || _metrics_comprehensive_metrics_bleu_score_std_bleu === void 0 ? void 0 : _metrics_comprehensive_metrics_bleu_score_std_bleu.toFixed(3)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 934,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-white/20 rounded-full h-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full",
                                                            style: {
                                                                width: "".concat(metrics.comprehensive_metrics.bleu_score.average_bleu * 100, "%")
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 938,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 937,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-400 mt-2",
                                                        children: "Measures fluency by comparing to MultiWOZ reference dialogues"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 943,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 927,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 922,
                                        columnNumber: 19
                                    }, this),
                                    metrics.comprehensive_metrics.repetition_rate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                        className: "w-5 h-5 text-yellow-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 953,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Repetition Rate"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 952,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300",
                                                                children: "Overall Rate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 958,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl font-bold text-yellow-400",
                                                                children: [
                                                                    (_this6 = metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate * 100) === null || _this6 === void 0 ? void 0 : _this6.toFixed(1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 959,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 957,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-400",
                                                        children: "Lower is better (indicates more diverse dialogue)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 963,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-white/20 rounded-full h-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gradient-to-r from-yellow-400 to-orange-600 h-3 rounded-full",
                                                            style: {
                                                                width: "".concat(metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate * 100, "%")
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Evaluator.tsx",
                                                            lineNumber: 967,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 966,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-400 mt-2",
                                                        children: "Measures redundancy across dialogue turns"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 972,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 956,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 951,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 920,
                                columnNumber: 15
                            }, this),
                            ((_metrics_comprehensive_metrics_llm_judge = metrics.comprehensive_metrics.llm_judge) === null || _metrics_comprehensive_metrics_llm_judge === void 0 ? void 0 : _metrics_comprehensive_metrics_llm_judge.overall_scores) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                className: "w-5 h-5 text-cyan-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 984,
                                                columnNumber: 21
                                            }, this),
                                            "LLM-as-a-Judge Evaluation"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 983,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-5 gap-4",
                                        children: [
                                            metrics.comprehensive_metrics.llm_judge.overall_scores.task_success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border p-4 ".concat(getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.task_success.mean / 100)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Task Success"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 990,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_llm_judge_overall_scores_task_success_mean = metrics.comprehensive_metrics.llm_judge.overall_scores.task_success.mean) === null || _metrics_comprehensive_metrics_llm_judge_overall_scores_task_success_mean === void 0 ? void 0 : _metrics_comprehensive_metrics_llm_judge_overall_scores_task_success_mean.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 991,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: "/ 100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 994,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 989,
                                                columnNumber: 23
                                            }, this),
                                            metrics.comprehensive_metrics.llm_judge.overall_scores.coherence && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border p-4 ".concat(getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.coherence.mean / 100)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Coherence"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 999,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_llm_judge_overall_scores_coherence_mean = metrics.comprehensive_metrics.llm_judge.overall_scores.coherence.mean) === null || _metrics_comprehensive_metrics_llm_judge_overall_scores_coherence_mean === void 0 ? void 0 : _metrics_comprehensive_metrics_llm_judge_overall_scores_coherence_mean.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1000,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: "/ 100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1003,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 998,
                                                columnNumber: 23
                                            }, this),
                                            metrics.comprehensive_metrics.llm_judge.overall_scores.diversity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border p-4 ".concat(getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.diversity.mean / 100)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Diversity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1008,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_llm_judge_overall_scores_diversity_mean = metrics.comprehensive_metrics.llm_judge.overall_scores.diversity.mean) === null || _metrics_comprehensive_metrics_llm_judge_overall_scores_diversity_mean === void 0 ? void 0 : _metrics_comprehensive_metrics_llm_judge_overall_scores_diversity_mean.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1009,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: "/ 100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1012,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 23
                                            }, this),
                                            metrics.comprehensive_metrics.llm_judge.overall_scores.fluency && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border p-4 ".concat(getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.fluency.mean / 100)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Fluency"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1017,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_llm_judge_overall_scores_fluency_mean = metrics.comprehensive_metrics.llm_judge.overall_scores.fluency.mean) === null || _metrics_comprehensive_metrics_llm_judge_overall_scores_fluency_mean === void 0 ? void 0 : _metrics_comprehensive_metrics_llm_judge_overall_scores_fluency_mean.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1018,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: "/ 100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1021,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1016,
                                                columnNumber: 23
                                            }, this),
                                            metrics.comprehensive_metrics.llm_judge.overall_scores.groundedness && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border p-4 ".concat(getScoreColor(metrics.comprehensive_metrics.llm_judge.overall_scores.groundedness.mean / 100)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Groundedness"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1026,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_llm_judge_overall_scores_groundedness_mean = metrics.comprehensive_metrics.llm_judge.overall_scores.groundedness.mean) === null || _metrics_comprehensive_metrics_llm_judge_overall_scores_groundedness_mean === void 0 ? void 0 : _metrics_comprehensive_metrics_llm_judge_overall_scores_groundedness_mean.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1027,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: "/ 100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1030,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1025,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 987,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 mt-4",
                                        children: "Expert LLM evaluation on a 0-100 scale for each quality dimension"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 1034,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 p-4 rounded-lg bg-white/5 border border-white/10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-white mb-2",
                                                children: "Score drill-down: how each dimension contributes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1038,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "text-xs text-gray-400 space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "text-gray-300",
                                                                children: "Task Success"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 1040,
                                                                columnNumber: 27
                                                            }, this),
                                                            " — Whether the user goal was fulfilled (85+ = goal achieved or user satisfied)."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1040,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "text-gray-300",
                                                                children: "Coherence"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 1041,
                                                                columnNumber: 27
                                                            }, this),
                                                            " — Turns are logical and context-aware; conversation flows naturally."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1041,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "text-gray-300",
                                                                children: "Diversity"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 1042,
                                                                columnNumber: 27
                                                            }, this),
                                                            " — Phrasing is varied and non-repetitive across turns."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1042,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "text-gray-300",
                                                                children: "Fluency"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 1043,
                                                                columnNumber: 27
                                                            }, this),
                                                            " — Grammar and language are natural with no obvious errors."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1043,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "text-gray-300",
                                                                children: "Groundedness"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                                lineNumber: 1044,
                                                                columnNumber: 27
                                                            }, this),
                                                            " — Responses stay on topic and avoid fabrication."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1044,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1039,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 mt-2",
                                                children: "Overall quality is a combination of these dimensions; low scores in one (e.g. Task Success) can pull down the aggregate."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1046,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 982,
                                columnNumber: 17
                            }, this),
                            metrics.comprehensive_metrics.dialogue_length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 rounded-xl p-6 border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                className: "w-5 h-5 text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1055,
                                                columnNumber: 21
                                            }, this),
                                            "Dialogue Length Statistics"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 1054,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Avg Turns"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1060,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_dialogue_length_avg_turns = metrics.comprehensive_metrics.dialogue_length.avg_turns) === null || _metrics_comprehensive_metrics_dialogue_length_avg_turns === void 0 ? void 0 : _metrics_comprehensive_metrics_dialogue_length_avg_turns.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1061,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1059,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Std Dev"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1066,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_dialogue_length_std_turns = metrics.comprehensive_metrics.dialogue_length.std_turns) === null || _metrics_comprehensive_metrics_dialogue_length_std_turns === void 0 ? void 0 : _metrics_comprehensive_metrics_dialogue_length_std_turns.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1067,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1065,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Avg Words"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1072,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_dialogue_length_avg_words = metrics.comprehensive_metrics.dialogue_length.avg_words) === null || _metrics_comprehensive_metrics_dialogue_length_avg_words === void 0 ? void 0 : _metrics_comprehensive_metrics_dialogue_length_avg_words.toFixed(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1073,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1071,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-300 mb-1",
                                                        children: "Avg Chars"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1078,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xl font-bold text-white",
                                                        children: (_metrics_comprehensive_metrics_dialogue_length_avg_chars = metrics.comprehensive_metrics.dialogue_length.avg_chars) === null || _metrics_comprehensive_metrics_dialogue_length_avg_chars === void 0 ? void 0 : _metrics_comprehensive_metrics_dialogue_length_avg_chars.toFixed(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1079,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1077,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 1058,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 1053,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 635,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl p-6 border border-cyan-400/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-semibold text-white mb-3",
                                children: "Evaluation Summary"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 1091,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300 mb-2",
                                                children: "The GoalConvo system demonstrates strong performance across all evaluated metrics:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1094,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "space-y-1 text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• High lexical diversity indicating rich vocabulary usage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1098,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Excellent coherence scores showing natural conversation flow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1099,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Strong task success rates across all domains"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1100,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Good balance of conversation lengths"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1101,
                                                        columnNumber: 19
                                                    }, this),
                                                    ((_metrics_comprehensive_metrics8 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics8 === void 0 ? void 0 : _metrics_comprehensive_metrics8.goal_completion_rate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            "• Goal Completion Rate: ",
                                                            (_metrics_comprehensive_metrics_goal_completion_rate_overall_gcr1 = metrics.comprehensive_metrics.goal_completion_rate.overall_gcr) === null || _metrics_comprehensive_metrics_goal_completion_rate_overall_gcr1 === void 0 ? void 0 : _metrics_comprehensive_metrics_goal_completion_rate_overall_gcr1.toFixed(1),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1103,
                                                        columnNumber: 21
                                                    }, this),
                                                    ((_metrics_comprehensive_metrics9 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics9 === void 0 ? void 0 : _metrics_comprehensive_metrics9.bleu_score) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            "• BLEU Score: ",
                                                            (_metrics_comprehensive_metrics_bleu_score_average_bleu1 = metrics.comprehensive_metrics.bleu_score.average_bleu) === null || _metrics_comprehensive_metrics_bleu_score_average_bleu1 === void 0 ? void 0 : _metrics_comprehensive_metrics_bleu_score_average_bleu1.toFixed(3)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1106,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1097,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 1093,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300 mb-2",
                                                children: "Areas for potential improvement:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "space-y-1 text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Further domain diversification"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1115,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Enhanced persona complexity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1116,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• More sophisticated goal detection"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1117,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Advanced filtering mechanisms"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1118,
                                                        columnNumber: 19
                                                    }, this),
                                                    ((_metrics_comprehensive_metrics10 = metrics.comprehensive_metrics) === null || _metrics_comprehensive_metrics10 === void 0 ? void 0 : _metrics_comprehensive_metrics10.repetition_rate) && metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate > 0.15 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            "• Reduce repetition rate (currently ",
                                                            (_this7 = metrics.comprehensive_metrics.repetition_rate.overall_repetition_rate * 100) === null || _this7 === void 0 ? void 0 : _this7.toFixed(1),
                                                            "%)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/Evaluator.tsx",
                                                        lineNumber: 1120,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Evaluator.tsx",
                                                lineNumber: 1114,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Evaluator.tsx",
                                        lineNumber: 1110,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Evaluator.tsx",
                                lineNumber: 1092,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Evaluator.tsx",
                        lineNumber: 1090,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Evaluator.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Evaluator.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_s(Evaluator, "nTzWAeZnE3Tzq6AfPn1wCPRwIAo=");
_c = Evaluator;
var _c;
__turbopack_context__.k.register(_c, "Evaluator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Versions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Versions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-compare.js [app-client] (ecmascript) <export default as GitCompare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-down.js [app-client] (ecmascript) <export default as FileDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Versions() {
    _s();
    const [versions, setVersions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [compareA, setCompareA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [compareB, setCompareB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [compareResult, setCompareResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tagVersionId, setTagVersionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [tagInput, setTagInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [exportVersionId, setExportVersionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [exportFormat, setExportFormat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('json');
    const [expandedId, setExpandedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dialoguesPreview, setDialoguesPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const fetchVersions = async ()=>{
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versions));
            const data = await res.json();
            if (res.ok) {
                setVersions(data.versions || data || []);
            } else {
                setMessage({
                    type: 'error',
                    text: data.error || 'Failed to load versions'
                });
            }
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Versions.useEffect": ()=>{
            fetchVersions();
        }
    }["Versions.useEffect"], []);
    const runCompare = async ()=>{
        if (!compareA || !compareB) {
            setMessage({
                type: 'error',
                text: 'Select both versions to compare'
            });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versionCompare), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version_1: compareA,
                    version_2: compareB
                })
            });
            const data = await res.json();
            if (res.ok) {
                setCompareResult(data);
            } else {
                setMessage({
                    type: 'error',
                    text: data.error || 'Compare failed'
                });
            }
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const addTag = async ()=>{
        if (!tagVersionId || !tagInput.trim()) {
            setMessage({
                type: 'error',
                text: 'Select version and enter tag'
            });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versionTag(tagVersionId)), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tags: [
                        tagInput.trim()
                    ]
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: 'Tag added'
                });
                setTagInput('');
                fetchVersions();
            } else {
                setMessage({
                    type: 'error',
                    text: data.error || 'Tag failed'
                });
            }
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const runExport = async ()=>{
        if (!exportVersionId) {
            setMessage({
                type: 'error',
                text: 'Select a version to export'
            });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versionExport(exportVersionId)), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    format: exportFormat
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: data.message || "Exported to ".concat(data.output_path || 'file')
                });
            } else {
                setMessage({
                    type: 'error',
                    text: data.error || 'Export failed'
                });
            }
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const loadDialoguesPreview = async (versionId)=>{
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versionDialogues(versionId)) + '?limit=5');
            const data = await res.json();
            if (res.ok) setDialoguesPreview(data.dialogues || []);
        } catch (e) {
            setDialoguesPreview([]);
        }
    };
    const toggleExpand = (versionId)=>{
        if (expandedId === versionId) {
            setExpandedId(null);
            setDialoguesPreview([]);
        } else {
            setExpandedId(versionId);
            loadDialoguesPreview(versionId);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                        className: "w-6 h-6 text-cyan-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Versions.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-white",
                        children: "Dataset Versions"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Versions.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: fetchVersions,
                        disabled: loading,
                        className: "ml-auto px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50",
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Versions.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Versions.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded-lg text-sm ".concat(message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'),
                children: message.text
            }, void 0, false, {
                fileName: "[project]/app/components/Versions.tsx",
                lineNumber: 169,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-white/10 rounded-xl border border-white/20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-white font-semibold mb-3",
                                children: "List"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Versions.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 max-h-96 overflow-y-auto",
                                children: [
                                    loading && versions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400",
                                        children: "Loading..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 182,
                                        columnNumber: 50
                                    }, this),
                                    !loading && versions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400 text-sm",
                                        children: "No versions yet. Run the pipeline to create a version."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    versions.map((v)=>{
                                        var _v_dialogue_count;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between cursor-pointer",
                                                    onClick: ()=>toggleExpand(v.version_id),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white font-medium",
                                                                    children: v.version_id
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/Versions.tsx",
                                                                    lineNumber: 196,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400 text-sm ml-2",
                                                                    children: [
                                                                        "(",
                                                                        (_v_dialogue_count = v.dialogue_count) !== null && _v_dialogue_count !== void 0 ? _v_dialogue_count : 0,
                                                                        " dialogues)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/Versions.tsx",
                                                                    lineNumber: 197,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "w-5 h-5 text-gray-400 transition-transform ".concat(expandedId === v.version_id ? 'rotate-180' : '')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 199,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/Versions.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 17
                                                }, this),
                                                v.tags && v.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-1 mt-2",
                                                    children: v.tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs bg-cyan-500/30 text-cyan-100 px-2 py-0.5 rounded",
                                                            children: t
                                                        }, t, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Versions.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 19
                                                }, this),
                                                expandedId === v.version_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 pt-3 border-t border-white/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400 mb-2",
                                                            children: "Preview (first 5 dialogues):"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                            className: "text-xs text-gray-300 overflow-auto max-h-40 bg-black/20 p-2 rounded",
                                                            children: JSON.stringify(dialoguesPreview, null, 1)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/Versions.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, v.version_id, true, {
                                            fileName: "[project]/app/components/Versions.tsx",
                                            lineNumber: 187,
                                            columnNumber: 15
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Versions.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Versions.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-white/10 rounded-xl border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-white font-semibold mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompare$3e$__["GitCompare"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 228,
                                                columnNumber: 15
                                            }, this),
                                            " Compare"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: compareA,
                                                onChange: (e)=>setCompareA(e.target.value),
                                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Version A"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 17
                                                    }, this),
                                                    versions.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: v.version_id,
                                                            children: v.version_id
                                                        }, v.version_id, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: compareB,
                                                onChange: (e)=>setCompareB(e.target.value),
                                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Version B"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 17
                                                    }, this),
                                                    versions.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: v.version_id,
                                                            children: v.version_id
                                                        }, v.version_id, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 248,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 241,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: runCompare,
                                                disabled: loading || !compareA || !compareB,
                                                className: "px-4 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg hover:bg-cyan-500/50 disabled:opacity-50",
                                                children: "Compare"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 251,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    compareResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "text-xs text-gray-300 mt-2 p-2 bg-black/20 rounded overflow-auto max-h-48",
                                        children: JSON.stringify(compareResult, null, 2)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Versions.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-white/10 rounded-xl border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-white font-semibold mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 268,
                                                columnNumber: 15
                                            }, this),
                                            " Tag"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: tagVersionId,
                                                onChange: (e)=>setTagVersionId(e.target.value),
                                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select version"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 17
                                                    }, this),
                                                    versions.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: v.version_id,
                                                            children: v.version_id
                                                        }, v.version_id, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 271,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: tagInput,
                                                onChange: (e)=>setTagInput(e.target.value),
                                                placeholder: "e.g. baseline",
                                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 w-32"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 281,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: addTag,
                                                disabled: loading || !tagVersionId || !tagInput.trim(),
                                                className: "px-4 py-2 bg-purple-500/30 text-purple-100 rounded-lg hover:bg-purple-500/50 disabled:opacity-50",
                                                children: "Add tag"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 288,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Versions.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-white/10 rounded-xl border border-white/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-white font-semibold mb-3 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__["FileDown"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 300,
                                                columnNumber: 15
                                            }, this),
                                            " Export"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: exportVersionId,
                                                onChange: (e)=>setExportVersionId(e.target.value),
                                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select version"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 17
                                                    }, this),
                                                    versions.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: v.version_id,
                                                            children: v.version_id
                                                        }, v.version_id, false, {
                                                            fileName: "[project]/app/components/Versions.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 303,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: exportFormat,
                                                onChange: (e)=>setExportFormat(e.target.value),
                                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "json",
                                                        children: "JSON"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "jsonl",
                                                        children: "JSONL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "hf",
                                                        children: "HuggingFace"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "rasa",
                                                        children: "Rasa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/Versions.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 313,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: runExport,
                                                disabled: loading || !exportVersionId,
                                                className: "px-4 py-2 bg-green-500/30 text-green-100 rounded-lg hover:bg-green-500/50 disabled:opacity-50",
                                                children: "Export"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Versions.tsx",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Versions.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Versions.tsx",
                                lineNumber: 298,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Versions.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Versions.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Versions.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s(Versions, "fIiBRlM4CmisNvCoQa77EkIPnrk=");
_c = Versions;
var _c;
__turbopack_context__.k.register(_c, "Versions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/HumanEvaluation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HumanEvaluation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-down.js [app-client] (ecmascript) <export default as FileDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const DIMENSIONS = [
    {
        id: 'coherence',
        label: 'Coherence'
    },
    {
        id: 'naturalness',
        label: 'Naturalness'
    },
    {
        id: 'task_success',
        label: 'Task Success'
    },
    {
        id: 'fluency',
        label: 'Fluency'
    },
    {
        id: 'relevance',
        label: 'Relevance'
    },
    {
        id: 'overall_quality',
        label: 'Overall Quality'
    }
];
const ANNOTATOR_STORAGE_KEY = 'goalconvo_annotator_id';
function HumanEvaluation() {
    _s();
    const [annotatorId, setAnnotatorId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTaskId, setSelectedTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [taskDetail, setTaskDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dimensions, setDimensions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Object.fromEntries(DIMENSIONS.map({
        "HumanEvaluation.useState": (d)=>[
                d.id,
                3
            ]
    }["HumanEvaluation.useState"])));
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [taskCompleted, setTaskCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [agreementDialogueId, setAgreementDialogueId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [agreementDimension, setAgreementDimension] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overall_quality');
    const [agreementResult, setAgreementResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [versions, setVersions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedVersionId, setSelectedVersionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [versionDialogues, setVersionDialogues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [creatingTasks, setCreatingTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HumanEvaluation.useEffect": ()=>{
            const stored = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem(ANNOTATOR_STORAGE_KEY) : "TURBOPACK unreachable";
            if (stored) setAnnotatorId(stored);
        }
    }["HumanEvaluation.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HumanEvaluation.useEffect": ()=>{
            if (annotatorId && "object" !== 'undefined') {
                localStorage.setItem(ANNOTATOR_STORAGE_KEY, annotatorId);
            }
        }
    }["HumanEvaluation.useEffect"], [
        annotatorId
    ]);
    const fetchTasks = async ()=>{
        if (!annotatorId) {
            setMessage({
                type: 'error',
                text: 'Set Annotator ID first'
            });
            return;
        }
        setLoading(true);
        try {
            const url = "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalTasks), "?assigned_to=").concat(encodeURIComponent(annotatorId));
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) setTasks(data.tasks || []);
            else setMessage({
                type: 'error',
                text: data.error || 'Failed to load tasks'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const fetchTaskDetail = async (taskId)=>{
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalTask(taskId)));
            const data = await res.json();
            if (res.ok) {
                setSelectedTaskId(taskId);
                setTaskDetail({
                    dialogue_data: data.dialogue_data || {}
                });
                setDimensions(Object.fromEntries(DIMENSIONS.map((d)=>[
                        d.id,
                        3
                    ])));
                setComments('');
                setTaskCompleted(true);
            } else setMessage({
                type: 'error',
                text: data.error || 'Failed to load task'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const submitAnnotation = async ()=>{
        if (!selectedTaskId || !annotatorId) {
            setMessage({
                type: 'error',
                text: 'Task and Annotator ID required'
            });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalAnnotate), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_id: selectedTaskId,
                    annotator_id: annotatorId,
                    dimensions,
                    comments: comments || undefined,
                    task_completed: taskCompleted
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: 'Annotation submitted'
                });
                setSelectedTaskId(null);
                setTaskDetail(null);
                fetchTasks();
            } else setMessage({
                type: 'error',
                text: data.error || 'Submit failed'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const fetchStats = async ()=>{
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalStatistics));
            const data = await res.json();
            if (res.ok) setStats(data);
            else setMessage({
                type: 'error',
                text: data.error || 'Failed to load statistics'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const fetchAgreement = async ()=>{
        if (!agreementDialogueId) {
            setMessage({
                type: 'error',
                text: 'Enter a dialogue ID'
            });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalAgreement), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dialogue_id: agreementDialogueId,
                    dimension: agreementDimension
                })
            });
            const data = await res.json();
            if (res.ok) setAgreementResult(data);
            else setMessage({
                type: 'error',
                text: data.error || 'Agreement failed'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const fetchVersions = async ()=>{
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versions));
            const data = await res.json();
            if (res.ok) setVersions(data.versions || data || []);
            else setMessage({
                type: 'error',
                text: data.error || 'Failed to load versions'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const loadDialoguesForVersion = async ()=>{
        if (!selectedVersionId) {
            setMessage({
                type: 'error',
                text: 'Select a version first'
            });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.versionDialogues(selectedVersionId)));
            const data = await res.json();
            if (res.ok) {
                const list = data.dialogues || data || [];
                setVersionDialogues(list.map((d)=>({
                        dialogue_id: d.dialogue_id || d.id || '',
                        dialogue_data: {
                            goal: d.goal,
                            domain: d.domain,
                            turns: d.turns || []
                        }
                    })));
                setMessage({
                    type: 'success',
                    text: "Loaded ".concat(list.length, " dialogues")
                });
            } else setMessage({
                type: 'error',
                text: data.error || 'Failed to load dialogues'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    const createTasksFromVersionDialogues = async ()=>{
        if (!annotatorId) {
            setMessage({
                type: 'error',
                text: 'Set Annotator ID first'
            });
            return;
        }
        if (versionDialogues.length === 0) {
            setMessage({
                type: 'error',
                text: 'Load dialogues from a version first'
            });
            return;
        }
        setCreatingTasks(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalTasksBatch), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dialogues: versionDialogues,
                    assigned_to: annotatorId
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: "Created ".concat(data.count || 0, " tasks")
                });
                fetchTasks();
            } else setMessage({
                type: 'error',
                text: data.error || 'Create tasks failed'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setCreatingTasks(false);
        }
    };
    const exportEvaluations = async ()=>{
        setLoading(true);
        try {
            const res = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.humanEvalExport), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: "Exported to ".concat(data.output_path || 'file')
                });
            } else setMessage({
                type: 'error',
                text: data.error || 'Export failed'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: e.message
            });
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                        className: "w-6 h-6 text-cyan-400"
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-white",
                        children: "Human Evaluation"
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/HumanEvaluation.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded-lg text-sm ".concat(message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'),
                children: message.text
            }, void 0, false, {
                fileName: "[project]/app/components/HumanEvaluation.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white/5 rounded-xl border border-white/10 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-1 min-w-[200px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "w-5 h-5 text-gray-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 286,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: annotatorId,
                                        onChange: (e)=>setAnnotatorId(e.target.value),
                                        placeholder: "Annotator ID (saved in browser)",
                                        className: "flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: fetchVersions,
                                    disabled: loading,
                                    className: "px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/HumanEvaluation.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, this),
                                        " Load versions"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/HumanEvaluation.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedVersionId,
                                onChange: (e)=>setSelectedVersionId(e.target.value),
                                className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select version"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this),
                                    versions.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: v.version_id,
                                            children: [
                                                v.version_id,
                                                " ",
                                                v.dialogue_count != null ? "(".concat(v.dialogue_count, ")") : ''
                                            ]
                                        }, v.version_id, true, {
                                            fileName: "[project]/app/components/HumanEvaluation.tsx",
                                            lineNumber: 313,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 306,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: loadDialoguesForVersion,
                                disabled: loading || !selectedVersionId,
                                className: "px-4 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg hover:bg-cyan-500/50 disabled:opacity-50",
                                children: "Load dialogues"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-400",
                                children: [
                                    versionDialogues.length,
                                    " loaded"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: createTasksFromVersionDialogues,
                                disabled: creatingTasks || versionDialogues.length === 0 || !annotatorId,
                                className: "flex items-center gap-1 px-4 py-2 bg-green-500/30 text-green-100 rounded-lg hover:bg-green-500/50 disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 331,
                                        columnNumber: 13
                                    }, this),
                                    " Create tasks for me"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchTasks,
                                disabled: loading || !annotatorId,
                                className: "px-4 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg hover:bg-cyan-500/50 disabled:opacity-50",
                                children: "Load my tasks"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchStats,
                                disabled: loading,
                                className: "px-4 py-2 bg-purple-500/30 text-purple-100 rounded-lg hover:bg-purple-500/50 disabled:opacity-50",
                                children: "Statistics"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: exportEvaluations,
                                disabled: loading,
                                className: "px-4 py-2 bg-green-500/30 text-green-100 rounded-lg hover:bg-green-500/50 disabled:opacity-50 flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDown$3e$__["FileDown"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 354,
                                        columnNumber: 13
                                    }, this),
                                    " Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/HumanEvaluation.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this),
            stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                className: "p-4 bg-white/10 rounded-xl border border-white/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-white font-semibold mb-2 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, this),
                            " Overall statistics"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 365,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "text-xs text-gray-300 overflow-auto max-h-48",
                        children: JSON.stringify(stats, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 368,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/HumanEvaluation.tsx",
                lineNumber: 360,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-white/10 rounded-xl border border-white/20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-white font-semibold mb-3",
                                children: [
                                    "My tasks (",
                                    tasks.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 376,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 max-h-64 overflow-y-auto",
                                children: [
                                    tasks.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400 text-sm",
                                        children: "Create tasks from Versions (load dialogues, then create tasks for this annotator)."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, this),
                                    tasks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ".concat(selectedTaskId === t.task_id ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/20 hover:bg-white/10'),
                                            onClick: ()=>fetchTaskDetail(t.task_id),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white text-sm truncate flex-1",
                                                    children: t.dialogue_id
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/HumanEvaluation.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs px-2 py-0.5 rounded ".concat(t.status === 'completed' ? 'bg-green-500/30' : 'bg-yellow-500/30'),
                                                    children: t.status
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/HumanEvaluation.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "w-4 h-4 text-gray-400 ml-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/HumanEvaluation.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, t.task_id, true, {
                                            fileName: "[project]/app/components/HumanEvaluation.tsx",
                                            lineNumber: 382,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-white/10 rounded-xl border border-white/20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-white font-semibold mb-3",
                                children: "Inter-annotator agreement"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: agreementDialogueId,
                                        onChange: (e)=>setAgreementDialogueId(e.target.value),
                                        placeholder: "Dialogue ID",
                                        className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 w-40"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 402,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: agreementDimension,
                                        onChange: (e)=>setAgreementDimension(e.target.value),
                                        className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm",
                                        children: DIMENSIONS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: d.id,
                                                children: d.label
                                            }, d.id, false, {
                                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                                lineNumber: 415,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: fetchAgreement,
                                        disabled: loading,
                                        className: "px-3 py-2 bg-cyan-500/30 text-cyan-100 rounded-lg text-sm hover:bg-cyan-500/50 disabled:opacity-50",
                                        children: "Compute"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 418,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 401,
                                columnNumber: 11
                            }, this),
                            agreementResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-xs text-gray-300 mt-2 p-2 bg-black/20 rounded overflow-auto max-h-32",
                                children: JSON.stringify(agreementResult, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 427,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/HumanEvaluation.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this),
            taskDetail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "p-6 bg-white/10 rounded-xl border border-cyan-400/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-white font-semibold mb-2",
                        children: "Dialogue"
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 440,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-sm mb-2",
                        children: [
                            "Goal: ",
                            taskDetail.dialogue_data.goal || '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 441,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 mb-6 max-h-48 overflow-y-auto",
                        children: (taskDetail.dialogue_data.turns || []).map((turn, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-2 rounded-lg text-sm ".concat(turn.role === 'User' ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'bg-purple-500/10 border-l-2 border-purple-400'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-gray-300",
                                        children: [
                                            turn.role,
                                            ":"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 450,
                                        columnNumber: 17
                                    }, this),
                                    " ",
                                    turn.text
                                ]
                            }, i, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 444,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 442,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-white font-semibold mb-3",
                        children: "Rate 1–5"
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 454,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-4",
                        children: DIMENSIONS.map((d)=>{
                            var _dimensions_d_id, _dimensions_d_id1;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm text-gray-300 mb-1",
                                        children: d.label
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 458,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 1,
                                        max: 5,
                                        step: 0.5,
                                        value: (_dimensions_d_id = dimensions[d.id]) !== null && _dimensions_d_id !== void 0 ? _dimensions_d_id : 3,
                                        onChange: (e)=>setDimensions((prev)=>({
                                                    ...prev,
                                                    [d.id]: parseFloat(e.target.value)
                                                })),
                                        className: "w-full accent-cyan-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 459,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-white ml-1",
                                        children: (_dimensions_d_id1 = dimensions[d.id]) !== null && _dimensions_d_id1 !== void 0 ? _dimensions_d_id1 : 3
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 468,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, d.id, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 457,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 455,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm text-gray-300 mb-1",
                                children: "Comments (optional)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 473,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: comments,
                                onChange: (e)=>setComments(e.target.value),
                                rows: 2,
                                className: "w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm",
                                placeholder: "Optional notes"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 474,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 472,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-2 text-sm text-gray-300 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: taskCompleted,
                                onChange: (e)=>setTaskCompleted(e.target.checked)
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this),
                            "Task completed by user in dialogue"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 482,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: submitAnnotation,
                                disabled: loading,
                                className: "flex items-center gap-2 px-4 py-2 bg-green-500/50 text-white rounded-lg hover:bg-green-500/70 disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                                        lineNumber: 496,
                                        columnNumber: 15
                                    }, this),
                                    " Submit annotation"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setSelectedTaskId(null);
                                    setTaskDetail(null);
                                },
                                className: "px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/components/HumanEvaluation.tsx",
                                lineNumber: 498,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/HumanEvaluation.tsx",
                        lineNumber: 490,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/HumanEvaluation.tsx",
                lineNumber: 435,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/HumanEvaluation.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
_s(HumanEvaluation, "fm6ZtI1hEkwHy1y2nopRPvB4158=");
_c = HumanEvaluation;
var _c;
__turbopack_context__.k.register(_c, "HumanEvaluation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/GoalConvoDashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GoalConvoDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExperienceGenerator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExperienceGenerator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$MultiAgentSimulator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/MultiAgentSimulator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PostProcessor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/PostProcessor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Evaluator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Evaluator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Versions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Versions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HumanEvaluation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/HumanEvaluation.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function GoalConvoDashboard() {
    var _steps_Math_min, _steps_Math_min1, _steps_Math_min2, _steps_Math_min3;
    _s();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pipelineRunId, setPipelineRunId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pipelineData, setPipelineData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        experiences: [],
        conversations: [],
        filteredConversations: [],
        dataset: [],
        evaluations: null
    });
    const [requestLogs, setRequestLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])());
    // Pipeline configuration state
    const [selectedDomains, setSelectedDomains] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        'hotel'
    ]);
    const [numDialogues, setNumDialogues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    // Ablation / experiment options (optional)
    const [experimentTag, setExperimentTag] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [ablationQualityJudgeOff, setAblationQualityJudgeOff] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ablationFewShot, setAblationFewShot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [ablationTemperature, setAblationTemperature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Top-level tabs: Pipeline | Versions | Human Evaluation
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pipeline');
    // Live dialogue viewer (during pipeline run)
    const [liveDialogue, setLiveDialogue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Evaluation step: live sub-step messages (e.g. "Computing BERTScore...")
    const [evaluationStepMessages, setEvaluationStepMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Backend connection status
    const [backendConnected, setBackendConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backendCheckInProgress, setBackendCheckInProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Available domains
    const availableDomains = [
        'hotel',
        'restaurant',
        'taxi',
        'train',
        'attraction'
    ];
    // Check backend health on mount and periodically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoalConvoDashboard.useEffect": ()=>{
            const checkBackendHealth = {
                "GoalConvoDashboard.useEffect.checkBackendHealth": async ()=>{
                    setBackendCheckInProgress(true);
                    try {
                        const isHealthy = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].checkHealth();
                        setBackendConnected(isHealthy);
                        if (isHealthy) {
                            console.log('✅ Backend is healthy');
                        } else {
                            console.warn('⚠️ Backend health check failed');
                        }
                    } catch (error) {
                        console.error('❌ Backend health check error:', error);
                        setBackendConnected(false);
                    } finally{
                        setBackendCheckInProgress(false);
                    }
                }
            }["GoalConvoDashboard.useEffect.checkBackendHealth"];
            // Check immediately
            checkBackendHealth();
            // Check every 10 seconds
            const healthCheckInterval = setInterval(checkBackendHealth, 10000);
            return ({
                "GoalConvoDashboard.useEffect": ()=>clearInterval(healthCheckInterval)
            })["GoalConvoDashboard.useEffect"];
        }
    }["GoalConvoDashboard.useEffect"], []);
    // Setup WebSocket connection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoalConvoDashboard.useEffect": ()=>{
            const socketUrl = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getSocketUrl();
            console.log('🔌 Connecting to WebSocket:', socketUrl);
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(socketUrl, {
                transports: [
                    'websocket',
                    'polling'
                ],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                timeout: 20000
            });
            socketRef.current = socket;
            // Connection status tracking
            socket.on('connect', {
                "GoalConvoDashboard.useEffect": ()=>{
                    console.log('✅ WebSocket connected:', socket.id);
                    setBackendConnected(true);
                    addRequestLog({
                        stepId: 'connection',
                        stepName: 'WebSocket Connection',
                        endpoint: '/socket',
                        status: 'success',
                        message: "Connected to pipeline server (ID: ".concat(socket.id, ")")
                    });
                    // Join session immediately after connection
                    socket.emit('join_session', {
                        session_id: sessionIdRef.current
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('disconnect', {
                "GoalConvoDashboard.useEffect": (reason)=>{
                    console.log('❌ WebSocket disconnected:', reason);
                    setBackendConnected(false);
                    addRequestLog({
                        stepId: 'connection',
                        stepName: 'WebSocket Connection',
                        endpoint: '/socket',
                        status: 'error',
                        message: "Disconnected: ".concat(reason)
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('connect_error', {
                "GoalConvoDashboard.useEffect": (error)=>{
                    console.error('❌ WebSocket connection error:', error);
                    setBackendConnected(false);
                    const currentSocketUrl = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getSocketUrl();
                    addRequestLog({
                        stepId: 'connection',
                        stepName: 'WebSocket Connection',
                        endpoint: '/socket',
                        status: 'error',
                        message: "Connection error: ".concat(error.message, ". Make sure the backend server is running on ").concat(currentSocketUrl)
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('reconnect', {
                "GoalConvoDashboard.useEffect": (attemptNumber)=>{
                    console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
                    addRequestLog({
                        stepId: 'connection',
                        stepName: 'WebSocket Connection',
                        endpoint: '/socket',
                        status: 'success',
                        message: "Reconnected after ".concat(attemptNumber, " attempts")
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            // Server confirmation events
            socket.on('connected', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    console.log('✅ Server confirmed connection:', data);
                    addRequestLog({
                        stepId: 'connection',
                        stepName: 'WebSocket Connection',
                        endpoint: '/socket',
                        status: 'success',
                        message: "Server confirmed: ".concat(data.message || 'Connected')
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('joined', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    console.log('✅ Joined session:', data);
                    addRequestLog({
                        stepId: 'connection',
                        stepName: 'Session Join',
                        endpoint: '/socket',
                        status: 'success',
                        message: "Joined session: ".concat(data.session_id || 'unknown')
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            // Pipeline events
            socket.on('pipeline_start', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    var _data_data;
                    console.log('Pipeline started:', data);
                    addRequestLog({
                        stepId: 'pipeline',
                        stepName: 'Pipeline Start',
                        endpoint: '/api/run-pipeline',
                        status: 'success',
                        message: ((_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.message) || 'Pipeline started'
                    });
                    setIsRunning(true);
                    setCurrentStep(0);
                    setEvaluationStepMessages([]);
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('step_start', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    console.log('Step started:', data);
                    const stepData = data.data || {};
                    const stepName = stepData.step_name || stepData.step || 'Unknown Step';
                    addRequestLog({
                        stepId: stepData.step || 'unknown',
                        stepName: stepName,
                        endpoint: '/api/run-pipeline',
                        status: 'success',
                        message: stepData.message || "".concat(stepName, " started")
                    });
                    // Update current step: backend has 5 steps (incl. saving); UI has 4 (Dataset Construction commented out).
                    // Map backend step to frontend index 0–3 so Evaluation (UI index 3) gets the circling border.
                    const stepMap = {
                        'experience_generation': 0,
                        'dialogue_simulation': 1,
                        'quality_filtering': 2,
                        'saving': 3,
                        'evaluation': 3
                    };
                    if (stepData.step && stepMap[stepData.step] !== undefined) {
                        setCurrentStep(stepMap[stepData.step]);
                    }
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('step_data', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    var _data_data, _stepData_data, _stepData_data1;
                    console.log('Step data received:', data);
                    const stepData = data.data || {};
                    const step = ((_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.step) || stepData.step || 'unknown';
                    // Only process events for the current session
                    const eventSessionId = data.session_id;
                    if (eventSessionId && eventSessionId !== sessionIdRef.current) {
                        console.log("Ignoring step_data event for different session: ".concat(eventSessionId, " (current: ").concat(sessionIdRef.current, ")"));
                        return;
                    }
                    // Update pipeline data based on step
                    if (step === 'experience_generation' && ((_stepData_data = stepData.data) === null || _stepData_data === void 0 ? void 0 : _stepData_data.experience)) {
                        const exp = stepData.data.experience;
                        const userPersona = exp.user_persona;
                        const userPersonaName = typeof userPersona === 'string' ? userPersona : userPersona && typeof userPersona === 'object' && 'name' in userPersona ? String(userPersona.name || 'User') : 'User';
                        const experience = {
                            experience_id: exp.experience_id || "exp_".concat(Date.now()),
                            domain: exp.domain || 'unknown',
                            task: exp.goal || exp.task || '',
                            personas: [
                                {
                                    role: 'user',
                                    name: userPersonaName,
                                    traits: [],
                                    memory: []
                                },
                                {
                                    role: 'assistant',
                                    name: 'SupportBot',
                                    traits: [
                                        'helpful',
                                        'professional'
                                    ],
                                    memory: []
                                }
                            ],
                            situation: exp.context || '',
                            goal: exp.goal || '',
                            constraints: {
                                max_turns: 10,
                                max_tokens_per_turn: 100
                            },
                            conversation_starter: exp.first_utterance || ''
                        };
                        setPipelineData({
                            "GoalConvoDashboard.useEffect": (prev)=>{
                                // Check if this experience already exists (prevent duplicates)
                                const existingIndex = prev.experiences.findIndex({
                                    "GoalConvoDashboard.useEffect.existingIndex": (e)=>e.experience_id === experience.experience_id
                                }["GoalConvoDashboard.useEffect.existingIndex"]);
                                if (existingIndex >= 0) {
                                    console.log("Experience ".concat(experience.experience_id, " already exists, skipping duplicate"));
                                    return prev; // Don't add duplicate
                                }
                                return {
                                    ...prev,
                                    experiences: [
                                        ...prev.experiences,
                                        experience
                                    ]
                                };
                            }
                        }["GoalConvoDashboard.useEffect"]);
                    }
                    if (step === 'dialogue_simulation' && ((_stepData_data1 = stepData.data) === null || _stepData_data1 === void 0 ? void 0 : _stepData_data1.dialogue)) {
                        var _turnsArray_, _dial_metadata, _dial_metadata1, _dial_metadata2, _dial_metadata3;
                        const dial = stepData.data.dialogue;
                        console.log('Processing dialogue:', dial);
                        console.log('Dialogue turns:', dial.turns);
                        // Convert backend dialogue format to frontend conversation format
                        // Ensure turns is an array
                        let turnsArray = [];
                        if (Array.isArray(dial.turns)) {
                            turnsArray = dial.turns;
                        } else if (dial.turns && typeof dial.turns === 'object') {
                            // If turns is an object, try to convert it
                            turnsArray = Object.values(dial.turns);
                        }
                        console.log('Processed turns array:', turnsArray);
                        const dialUserPersona = dial.user_persona;
                        const dialUserPersonaName = typeof dialUserPersona === 'string' ? dialUserPersona : dialUserPersona && typeof dialUserPersona === 'object' && 'name' in dialUserPersona ? String(dialUserPersona.name || 'User') : 'User';
                        const conversation = {
                            conv_id: dial.dialogue_id || "conv_".concat(Date.now()),
                            domain: dial.domain || 'unknown',
                            task: dial.goal || '',
                            experience_id: dial.experience_id || '',
                            personas: [
                                {
                                    role: 'user',
                                    name: dialUserPersonaName,
                                    traits: [],
                                    memory: []
                                },
                                {
                                    role: 'assistant',
                                    name: 'SupportBot',
                                    traits: [
                                        'helpful',
                                        'professional'
                                    ],
                                    memory: []
                                }
                            ],
                            situation: dial.context || '',
                            goal: dial.goal || '',
                            constraints: {
                                max_turns: 10,
                                max_tokens_per_turn: 100
                            },
                            conversation_starter: ((_turnsArray_ = turnsArray[0]) === null || _turnsArray_ === void 0 ? void 0 : _turnsArray_.text) || '',
                            turns: turnsArray.map({
                                "GoalConvoDashboard.useEffect": (turn, idx)=>({
                                        turn_id: idx + 1,
                                        speaker: turn.role === 'User' ? 'user' : 'assistant',
                                        text: turn.text || ''
                                    })
                            }["GoalConvoDashboard.useEffect"]),
                            task_success: ((_dial_metadata = dial.metadata) === null || _dial_metadata === void 0 ? void 0 : _dial_metadata.quality_score) > 0.7 || false,
                            judge_score: (((_dial_metadata1 = dial.metadata) === null || _dial_metadata1 === void 0 ? void 0 : _dial_metadata1.quality_score) || 0) * 5,
                            mtld: 0,
                            provenance: {
                                generator_model: ((_dial_metadata2 = dial.metadata) === null || _dial_metadata2 === void 0 ? void 0 : _dial_metadata2.model_version) || 'unknown',
                                prompt_version: 'v1',
                                temperature: 0.7,
                                shot_ids: [],
                                timestamp: ((_dial_metadata3 = dial.metadata) === null || _dial_metadata3 === void 0 ? void 0 : _dial_metadata3.generated_at) || new Date().toISOString()
                            }
                        };
                        console.log('Adding conversation to pipeline data:', conversation);
                        setPipelineData({
                            "GoalConvoDashboard.useEffect": (prev)=>{
                                // Check if this conversation already exists (prevent duplicates)
                                const existingIndex = prev.conversations.findIndex({
                                    "GoalConvoDashboard.useEffect.existingIndex": (c)=>c.conv_id === conversation.conv_id
                                }["GoalConvoDashboard.useEffect.existingIndex"]);
                                if (existingIndex >= 0) {
                                    console.log("Conversation ".concat(conversation.conv_id, " already exists, skipping duplicate"));
                                    return prev; // Don't add duplicate
                                }
                                const updated = {
                                    ...prev,
                                    conversations: [
                                        ...prev.conversations,
                                        conversation
                                    ]
                                };
                                console.log('Updated pipeline data conversations count:', updated.conversations.length);
                                return updated;
                            }
                        }["GoalConvoDashboard.useEffect"]);
                    }
                    if (step === 'quality_filtering' && stepData.data) {
                        const filterData = stepData.data;
                        addRequestLog({
                            stepId: 'quality_filtering',
                            stepName: 'Quality Filtering',
                            endpoint: '/api/run-pipeline',
                            status: 'success',
                            message: "Accepted: ".concat(filterData.accepted || 0, ", Rejected: ").concat(filterData.rejected || 0)
                        });
                    }
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('live_dialogue', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    const payload = data.data || {};
                    if (data.session_id && data.session_id !== sessionIdRef.current) return;
                    setLiveDialogue({
                        current_turns: Array.isArray(payload.current_turns) ? payload.current_turns : [],
                        step_message: payload.step_message || 'Generating...',
                        dialogue_index: payload.dialogue_index,
                        total_dialogues: payload.total_dialogues,
                        goal: payload.goal
                    });
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('log', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    console.log('Log received:', data);
                    const logData = data.data || {};
                    const step = logData.step || 'pipeline';
                    const message = logData.message || '';
                    addRequestLog({
                        stepId: step,
                        stepName: step,
                        endpoint: '/api/run-pipeline',
                        status: logData.level === 'error' ? 'error' : 'success',
                        message
                    });
                    if (step === 'evaluation' && message) {
                        setEvaluationStepMessages({
                            "GoalConvoDashboard.useEffect": (prev)=>[
                                    ...prev.slice(-14),
                                    message
                                ]
                        }["GoalConvoDashboard.useEffect"]);
                    }
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('pipeline_complete', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    console.log('Pipeline completed:', data);
                    // Only process events for the current session
                    const eventSessionId = data.session_id;
                    if (eventSessionId && eventSessionId !== sessionIdRef.current) {
                        console.log("Ignoring pipeline_complete event for different session: ".concat(eventSessionId, " (current: ").concat(sessionIdRef.current, ")"));
                        return;
                    }
                    const completeData = data.data || {};
                    addRequestLog({
                        stepId: 'pipeline',
                        stepName: 'Pipeline Complete',
                        endpoint: '/api/run-pipeline',
                        status: 'success',
                        message: completeData.message || 'Pipeline completed successfully'
                    });
                    // Store evaluation metrics if available
                    if (completeData.evaluation) {
                        console.log('Evaluation metrics received:', completeData.evaluation);
                        setPipelineData({
                            "GoalConvoDashboard.useEffect": (prev)=>({
                                    ...prev,
                                    evaluations: completeData.evaluation
                                })
                        }["GoalConvoDashboard.useEffect"]);
                    }
                    if (completeData.final_data) {
                        // Update with final statistics
                        console.log('Final data:', completeData.final_data);
                    }
                    setLiveDialogue(null);
                    setIsRunning(false);
                    setCurrentStep(3); // Evaluation is at UI index 3 (Dataset Construction step commented out)
                }
            }["GoalConvoDashboard.useEffect"]);
            socket.on('pipeline_error', {
                "GoalConvoDashboard.useEffect": (data)=>{
                    console.error('Pipeline error:', data);
                    const errorData = data.data || {};
                    addRequestLog({
                        stepId: 'pipeline',
                        stepName: 'Pipeline Error',
                        endpoint: '/api/run-pipeline',
                        status: 'error',
                        message: errorData.message || 'Pipeline failed'
                    });
                    setLiveDialogue(null);
                    setIsRunning(false);
                }
            }["GoalConvoDashboard.useEffect"]);
            // Cleanup on unmount
            return ({
                "GoalConvoDashboard.useEffect": ()=>{
                    console.log('Cleaning up WebSocket connection');
                    socket.disconnect();
                }
            })["GoalConvoDashboard.useEffect"];
        }
    }["GoalConvoDashboard.useEffect"], []);
    // Debug: Log when pipeline state changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoalConvoDashboard.useEffect": ()=>{
            console.log('Pipeline state changed:', {
                isRunning,
                currentStep,
                pipelineRunId
            });
        }
    }["GoalConvoDashboard.useEffect"], [
        isRunning,
        currentStep,
        pipelineRunId
    ]);
    const addRequestLog = (entry)=>{
        const timestamp = new Date().toISOString();
        const id = "".concat(timestamp, "-").concat(Math.random().toString(36).slice(2, 8));
        setRequestLogs((prev)=>[
                {
                    id,
                    timestamp,
                    ...entry
                },
                ...prev
            ].slice(0, 50));
    };
    const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GoalConvoDashboard.useMemo[steps]": ()=>[
                {
                    id: 'experience',
                    name: 'Experience Generation',
                    description: 'Create structured blueprints with personas, situations, and goals',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 608,
                        columnNumber: 13
                    }, this),
                    status: 'pending',
                    progress: 0,
                    component: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExperienceGenerator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        experiences: pipelineData.experiences,
                        autoStart: false,
                        onComplete: {
                            "GoalConvoDashboard.useMemo[steps]": (data)=>handleStepComplete(0, data)
                        }["GoalConvoDashboard.useMemo[steps]"],
                        onLog: {
                            "GoalConvoDashboard.useMemo[steps]": (log)=>addRequestLog({
                                    stepId: 'experience',
                                    stepName: 'Experience Generation',
                                    endpoint: '/api/run-pipeline',
                                    ...log
                                })
                        }["GoalConvoDashboard.useMemo[steps]"]
                    }, "experience-".concat(pipelineRunId, "-").concat(currentStep), false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 612,
                        columnNumber: 9
                    }, this)
                },
                {
                    id: 'simulation',
                    name: 'Multi-Agent Simulation',
                    description: 'Generate natural dialogues through LLM agent interactions',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 632,
                        columnNumber: 13
                    }, this),
                    status: 'pending',
                    progress: 0,
                    component: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$MultiAgentSimulator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        experiences: pipelineData.experiences,
                        conversations: pipelineData.conversations,
                        autoStart: false,
                        onComplete: {
                            "GoalConvoDashboard.useMemo[steps]": (data)=>handleStepComplete(1, data)
                        }["GoalConvoDashboard.useMemo[steps]"],
                        onLog: {
                            "GoalConvoDashboard.useMemo[steps]": (log)=>addRequestLog({
                                    stepId: 'simulation',
                                    stepName: 'Multi-Agent Simulation',
                                    endpoint: '/api/run-pipeline',
                                    ...log
                                })
                        }["GoalConvoDashboard.useMemo[steps]"]
                    }, "simulation-".concat(pipelineRunId, "-").concat(currentStep), false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 636,
                        columnNumber: 9
                    }, this)
                },
                {
                    id: 'postprocessing',
                    name: 'Post-Processing',
                    description: 'Filter, deduplicate, and ensure quality of generated dialogues',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 657,
                        columnNumber: 13
                    }, this),
                    status: 'pending',
                    progress: 0,
                    component: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PostProcessor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        conversations: pipelineData.conversations,
                        filteredConversations: pipelineData.filteredConversations,
                        autoStart: false,
                        onComplete: {
                            "GoalConvoDashboard.useMemo[steps]": (data)=>handleStepComplete(2, data)
                        }["GoalConvoDashboard.useMemo[steps]"],
                        onLog: {
                            "GoalConvoDashboard.useMemo[steps]": (log)=>addRequestLog({
                                    stepId: 'postprocessing',
                                    stepName: 'Post-Processing',
                                    endpoint: '/api/run-pipeline',
                                    ...log
                                })
                        }["GoalConvoDashboard.useMemo[steps]"]
                    }, "postprocessor-".concat(pipelineRunId, "-").concat(currentStep), false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 661,
                        columnNumber: 9
                    }, this)
                },
                // {
                //   id: 'dataset',
                //   name: 'Dataset Construction',
                //   description: 'Compile high-quality dialogues into structured dataset',
                //   icon: <Database className="w-6 h-6" />,
                //   status: 'pending',
                //   progress: 0,
                //   component: (
                //     <DatasetConstructor
                //       key={`dataset-${pipelineRunId}-${currentStep}`}
                //       filteredConversations={pipelineData.filteredConversations}
                //       dataset={pipelineData.dataset}
                //       conversations={pipelineData.conversations}
                //       autoStart={false}
                //       onComplete={(data) => handleStepComplete(3, data)}
                //       onLog={(log) =>
                //         addRequestLog({
                //           stepId: 'dataset',
                //           stepName: 'Dataset Construction',
                //           endpoint: '/api/run-pipeline',
                //           ...log,
                //         })
                //       }
                //     />
                //   )
                // },
                {
                    id: 'evaluation',
                    name: 'Evaluation',
                    description: 'Assess quality, diversity, and downstream task performance',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 708,
                        columnNumber: 13
                    }, this),
                    status: 'pending',
                    progress: 0,
                    component: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Evaluator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        dataset: pipelineData.dataset,
                        autoStart: isRunning && currentStep === 3,
                        onComplete: {
                            "GoalConvoDashboard.useMemo[steps]": (data)=>handleStepComplete(4, data)
                        }["GoalConvoDashboard.useMemo[steps]"],
                        onLog: {
                            "GoalConvoDashboard.useMemo[steps]": (log)=>addRequestLog({
                                    stepId: 'evaluation',
                                    stepName: 'Evaluation',
                                    endpoint: '/api/pipeline/evaluator',
                                    ...log
                                })
                        }["GoalConvoDashboard.useMemo[steps]"]
                    }, "evaluator-".concat(pipelineRunId, "-").concat(currentStep), false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 712,
                        columnNumber: 9
                    }, this)
                }
            ]
    }["GoalConvoDashboard.useMemo[steps]"], [
        isRunning,
        currentStep,
        pipelineData,
        pipelineRunId
    ]);
    const normalizeExperiencePersonaName = (name)=>{
        if (typeof name === 'string') return name;
        if (name && typeof name === 'object' && 'name' in name) return String(name.name || 'User');
        return 'User';
    };
    const handleStepComplete = (stepIndex, data)=>{
        const newPipelineData = {
            ...pipelineData
        };
        switch(stepIndex){
            case 0:
                {
                    const raw = data.map((exp)=>{
                        const personas = exp.personas && exp.personas.length >= 2 ? exp.personas.map((p)=>({
                                ...p,
                                name: normalizeExperiencePersonaName(p.name),
                                traits: Array.isArray(p.traits) ? p.traits : [],
                                memory: Array.isArray(p.memory) ? p.memory : []
                            })) : [
                            {
                                role: 'user',
                                name: normalizeExperiencePersonaName(exp.user_persona),
                                traits: [],
                                memory: []
                            },
                            {
                                role: 'assistant',
                                name: 'SupportBot',
                                traits: [
                                    'helpful',
                                    'professional'
                                ],
                                memory: []
                            }
                        ];
                        var _situation, _ref, _conversation_starter, _ref1, _exp_goal, _ref2, _exp_task, _ref3, _ref4, _exp_constraints;
                        return {
                            ...exp,
                            situation: (_ref = (_situation = exp.situation) !== null && _situation !== void 0 ? _situation : exp.context) !== null && _ref !== void 0 ? _ref : '',
                            conversation_starter: (_ref1 = (_conversation_starter = exp.conversation_starter) !== null && _conversation_starter !== void 0 ? _conversation_starter : exp.first_utterance) !== null && _ref1 !== void 0 ? _ref1 : '',
                            goal: (_ref2 = (_exp_goal = exp.goal) !== null && _exp_goal !== void 0 ? _exp_goal : exp.goal) !== null && _ref2 !== void 0 ? _ref2 : '',
                            task: (_ref4 = (_ref3 = (_exp_task = exp.task) !== null && _exp_task !== void 0 ? _exp_task : exp.task) !== null && _ref3 !== void 0 ? _ref3 : exp.goal) !== null && _ref4 !== void 0 ? _ref4 : '',
                            constraints: (_exp_constraints = exp.constraints) !== null && _exp_constraints !== void 0 ? _exp_constraints : {
                                max_turns: 10,
                                max_tokens_per_turn: 100
                            },
                            personas
                        };
                    });
                    newPipelineData.experiences = raw;
                    break;
                }
            case 1:
                newPipelineData.conversations = data;
                break;
            case 2:
                newPipelineData.filteredConversations = data;
                break;
            case 3:
                newPipelineData.dataset = data;
                break;
            case 4:
                newPipelineData.evaluations = data;
                break;
        }
        setPipelineData(newPipelineData);
        if (stepIndex < steps.length - 1) {
            setCurrentStep(stepIndex + 1);
        }
    };
    const runPipeline = async ()=>{
        console.log('Run Pipeline clicked');
        // Validate configuration
        if (selectedDomains.length === 0) {
            alert('Please select at least one domain');
            return;
        }
        if (numDialogues < 1) {
            alert('Number of dialogues must be at least 1');
            return;
        }
        // Check backend connection before starting
        if (!backendConnected) {
            const isHealthy = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].checkHealth();
            if (!isHealthy) {
                const errorMsg = "Backend server is not accessible at ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].baseUrl, ". Please ensure the backend server is running.\n\nTo start the backend:\ncd goalconvo-2\n./start_backend.sh");
                alert(errorMsg);
                addRequestLog({
                    stepId: 'pipeline',
                    stepName: 'Pipeline Start',
                    endpoint: '/api/run-pipeline',
                    status: 'error',
                    message: "Backend server not accessible at ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].baseUrl)
                });
                return;
            }
            setBackendConnected(true);
        }
        // Generate new session ID FIRST (before resetting state)
        const newSessionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        sessionIdRef.current = newSessionId;
        // Reset state completely
        setRequestLogs([]);
        setPipelineRunId((prev)=>prev + 1);
        setCurrentStep(0);
        setIsRunning(false); // Ensure running state is reset
        setPipelineData({
            experiences: [],
            conversations: [],
            filteredConversations: [],
            dataset: [],
            evaluations: null
        });
        try {
            var _socketRef_current;
            // Number of dialogues is per domain; total = perDomain × domain count
            const domainCount = selectedDomains.length > 0 ? selectedDomains.length : availableDomains.length;
            const totalDialogues = numDialogues * domainCount;
            // Build request body (ablation overrides)
            const pipelineBody = {
                num_dialogues: totalDialogues,
                domains: selectedDomains.length > 0 ? selectedDomains : undefined,
                session_id: sessionIdRef.current
            };
            if (experimentTag.trim()) pipelineBody.experiment_tag = experimentTag.trim();
            if (ablationQualityJudgeOff || ablationFewShot.trim() || ablationTemperature.trim()) {
                const overrides = {};
                if (ablationQualityJudgeOff) overrides.quality_judge = false;
                const few = parseInt(ablationFewShot.trim(), 10);
                if (ablationFewShot.trim() && !Number.isNaN(few)) overrides.few_shot_examples = few;
                const temp = parseFloat(ablationTemperature.trim());
                if (ablationTemperature.trim() && !Number.isNaN(temp)) overrides.temperature = temp;
                if (Object.keys(overrides).length > 0) pipelineBody.overrides = overrides;
            }
            // Call the new unified pipeline API
            const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].getUrl(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].endpoints.runPipeline), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pipelineBody)
            });
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Pipeline start failed: ".concat(response.statusText);
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('Pipeline started:', data);
            // Join session via WebSocket if connected
            if ((_socketRef_current = socketRef.current) === null || _socketRef_current === void 0 ? void 0 : _socketRef_current.connected) {
                socketRef.current.emit('join_session', {
                    session_id: sessionIdRef.current
                });
            } else {
                console.warn('WebSocket not connected, attempting to reconnect...');
                // Try to reconnect if not connected
                if (socketRef.current) {
                    socketRef.current.connect();
                }
            }
            addRequestLog({
                stepId: 'pipeline',
                stepName: 'Pipeline Start',
                endpoint: '/api/run-pipeline',
                status: 'success',
                message: data.message || 'Pipeline started successfully'
            });
            setIsRunning(true);
            setEvaluationStepMessages([]);
        } catch (error) {
            console.error('Failed to start pipeline:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // Provide helpful error message for network errors
            let userMessage = errorMessage;
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                userMessage = "Cannot connect to backend server at ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].baseUrl, ". Please ensure:\n1. Backend server is running (cd goalconvo-2 && ./start_backend.sh)\n2. Backend is accessible at ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].baseUrl, "\n3. No firewall is blocking the connection");
            }
            addRequestLog({
                stepId: 'pipeline',
                stepName: 'Pipeline Start',
                endpoint: '/api/run-pipeline',
                status: 'error',
                message: userMessage
            });
            alert("Failed to start pipeline:\n\n".concat(userMessage));
        }
    };
    const resetPipeline = ()=>{
        console.log('Reset Pipeline clicked');
        setIsRunning(false);
        setCurrentStep(0);
        setPipelineRunId(0);
        setRequestLogs([]);
        setPipelineData({
            experiences: [],
            conversations: [],
            filteredConversations: [],
            dataset: [],
            evaluations: {
                overall_score: 0,
                diversity_score: 0,
                coherence_score: 0,
                task_success_rate: 0,
                fluency_score: 0,
                groundedness_score: 0,
                categories: {
                    lexical_diversity: 0,
                    conversation_length: {
                        avg_turns: 0,
                        std_dev: 0
                    },
                    domain_distribution: {},
                    task_success_by_domain: {}
                }
            }
        });
    };
    const downloadDialoguesJSON = ()=>{
        if (pipelineData.conversations.length === 0) {
            alert('No dialogues available to download');
            return;
        }
        // Prepare dialogues data for download
        const dialoguesData = {
            metadata: {
                generated_at: new Date().toISOString(),
                total_dialogues: pipelineData.conversations.length,
                total_turns: pipelineData.conversations.reduce((sum, conv)=>{
                    var _conv_turns;
                    return sum + (((_conv_turns = conv.turns) === null || _conv_turns === void 0 ? void 0 : _conv_turns.length) || 0);
                }, 0),
                domains: [
                    ...new Set(pipelineData.conversations.map((c)=>c.domain))
                ],
                pipeline_run_id: pipelineRunId
            },
            dialogues: pipelineData.conversations.map((conv)=>{
                var _conv_personas_find, _conv_personas, _conv_turns, _conv_turns1, _conv_provenance, _conv_provenance1;
                return {
                    dialogue_id: conv.conv_id,
                    domain: conv.domain,
                    goal: conv.goal || conv.task,
                    context: conv.situation,
                    user_persona: ((_conv_personas = conv.personas) === null || _conv_personas === void 0 ? void 0 : (_conv_personas_find = _conv_personas.find((p)=>p.role === 'user')) === null || _conv_personas_find === void 0 ? void 0 : _conv_personas_find.name) || 'General user',
                    turns: ((_conv_turns = conv.turns) === null || _conv_turns === void 0 ? void 0 : _conv_turns.map((turn)=>({
                            role: turn.speaker === 'user' ? 'User' : 'SupportBot',
                            text: turn.text,
                            turn_id: turn.turn_id
                        }))) || [],
                    metadata: {
                        num_turns: ((_conv_turns1 = conv.turns) === null || _conv_turns1 === void 0 ? void 0 : _conv_turns1.length) || 0,
                        task_success: conv.task_success,
                        quality_score: conv.judge_score ? conv.judge_score / 5 : 0,
                        generated_at: ((_conv_provenance = conv.provenance) === null || _conv_provenance === void 0 ? void 0 : _conv_provenance.timestamp) || new Date().toISOString(),
                        model_version: ((_conv_provenance1 = conv.provenance) === null || _conv_provenance1 === void 0 ? void 0 : _conv_provenance1.generator_model) || 'unknown'
                    }
                };
            })
        };
        // Create and download JSON file
        const jsonString = JSON.stringify(dialoguesData, null, 2);
        const blob = new Blob([
            jsonString
        ], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "goalconvo-dialogues-".concat(new Date().toISOString().split('T')[0], ".json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const domainPillColors = {
        hotel: 'bg-amber-500/25 border-amber-400/50 text-amber-200 hover:bg-amber-500/35',
        restaurant: 'bg-rose-500/25 border-rose-400/50 text-rose-200 hover:bg-rose-500/35',
        taxi: 'bg-sky-500/25 border-sky-400/50 text-sky-200 hover:bg-sky-500/35',
        train: 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/35',
        attraction: 'bg-violet-500/25 border-violet-400/50 text-violet-200 hover:bg-violet-500/35'
    };
    var _steps_Math_min_component;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-canvas max-w-7xl mx-auto px-4 py-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit shadow-lg shadow-black/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('pipeline'),
                        className: "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ".concat(activeTab === 'pipeline' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25' : 'text-gray-400 hover:text-white hover:bg-white/10'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1021,
                                columnNumber: 11
                            }, this),
                            " Pipeline"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1013,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('versions'),
                        className: "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ".concat(activeTab === 'versions' ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' : 'text-gray-400 hover:text-white hover:bg-white/10'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1031,
                                columnNumber: 11
                            }, this),
                            " Versions"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1023,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('human-eval'),
                        className: "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ".concat(activeTab === 'human-eval' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25' : 'text-gray-400 hover:text-white hover:bg-white/10'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1041,
                                columnNumber: 11
                            }, this),
                            " Human Evaluation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1033,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                lineNumber: 1012,
                columnNumber: 7
            }, this),
            activeTab === 'versions' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Versions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                    lineNumber: 1047,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                lineNumber: 1046,
                columnNumber: 9
            }, this),
            activeTab === 'human-eval' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HumanEvaluation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                    lineNumber: 1053,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                lineNumber: 1052,
                columnNumber: 9
            }, this),
            activeTab === 'pipeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 shadow-xl shadow-black/20 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1065,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent mb-2",
                                                        children: "Pipeline Control"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1069,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300",
                                                        children: "Manage the entire GoalConvo generation pipeline"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1070,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mt-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-2.5 h-2.5 rounded-full ".concat(backendConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]', " ").concat(backendCheckInProgress ? 'animate-pulse' : '')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1072,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-gray-400",
                                                                children: backendCheckInProgress ? 'Checking...' : backendConnected ? 'Backend Connected' : 'Backend Disconnected'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1073,
                                                                columnNumber: 15
                                                            }, this),
                                                            !backendConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-amber-300 ml-2",
                                                                children: [
                                                                    "(",
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].baseUrl,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1077,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1071,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1068,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                        whileHover: {
                                                            scale: 1.03
                                                        },
                                                        whileTap: {
                                                            scale: 0.98
                                                        },
                                                        onClick: runPipeline,
                                                        disabled: isRunning || !backendConnected,
                                                        className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                                                        title: !backendConnected ? 'Backend server is not connected. Please start the backend server first.' : '',
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1092,
                                                                columnNumber: 15
                                                            }, this),
                                                            isRunning ? 'Running...' : 'Run Pipeline'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1084,
                                                        columnNumber: 13
                                                    }, this),
                                                    pipelineData.conversations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                        whileHover: {
                                                            scale: 1.03
                                                        },
                                                        whileTap: {
                                                            scale: 0.98
                                                        },
                                                        onClick: downloadDialoguesJSON,
                                                        className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all",
                                                        title: "Download ".concat(pipelineData.conversations.length, " dialogue(s) as JSON"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1103,
                                                                columnNumber: 17
                                                            }, this),
                                                            "Download Dialogues (",
                                                            pipelineData.conversations.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1096,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                        whileHover: {
                                                            scale: 1.03
                                                        },
                                                        whileTap: {
                                                            scale: 0.98
                                                        },
                                                        onClick: resetPipeline,
                                                        className: "flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1113,
                                                                columnNumber: 15
                                                            }, this),
                                                            "Reset"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1107,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1083,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1067,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 gap-4 mb-6 p-5 bg-white/5 rounded-xl border border-white/10 shadow-inner",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-cyan-200 mb-2",
                                                                children: "Dialogues per domain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1124,
                                                                columnNumber: 13
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "1",
                                                                    max: "100",
                                                                    value: numDialogues,
                                                                    onChange: (e)=>setNumDialogues(Math.max(1, parseInt(e.target.value) || 1)),
                                                                    disabled: isRunning,
                                                                    className: "flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    placeholder: "Per domain"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                    lineNumber: 1128,
                                                                    columnNumber: 15
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1127,
                                                                columnNumber: 13
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-400 mt-1.5",
                                                                children: [
                                                                    numDialogues,
                                                                    " per domain → ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-cyan-300 font-medium",
                                                                        children: [
                                                                            numDialogues * (selectedDomains.length || availableDomains.length),
                                                                            " total"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1140,
                                                                        columnNumber: 43
                                                                    }, this),
                                                                    (selectedDomains.length || availableDomains.length) > 0 && " across ".concat(selectedDomains.length || availableDomains.length, " domain(s)")
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1139,
                                                                columnNumber: 13
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1123,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-violet-200 mb-2",
                                                                children: "Select Domains"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1145,
                                                                columnNumber: 13
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: availableDomains.map((domain)=>{
                                                                    var _domainPillColors_domain;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ".concat(selectedDomains.includes(domain) ? (_domainPillColors_domain = domainPillColors[domain]) !== null && _domainPillColors_domain !== void 0 ? _domainPillColors_domain : 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10 hover:text-gray-200', " ").concat(isRunning ? 'opacity-50 cursor-not-allowed' : ''),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: selectedDomains.includes(domain),
                                                                                onChange: (e)=>{
                                                                                    if (isRunning) return;
                                                                                    if (e.target.checked) {
                                                                                        setSelectedDomains([
                                                                                            ...selectedDomains,
                                                                                            domain
                                                                                        ]);
                                                                                    } else {
                                                                                        setSelectedDomains(selectedDomains.filter((d)=>d !== domain));
                                                                                    }
                                                                                },
                                                                                disabled: isRunning,
                                                                                className: "w-4 h-4 rounded focus:ring-2 focus:ring-offset-0 focus:ring-cyan-400"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1158,
                                                                                columnNumber: 19
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm font-medium capitalize",
                                                                                children: domain
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1172,
                                                                                columnNumber: 19
                                                                            }, this)
                                                                        ]
                                                                    }, domain, true, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1150,
                                                                        columnNumber: 17
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1148,
                                                                columnNumber: 13
                                                            }, this),
                                                            selectedDomains.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-amber-300 mt-2",
                                                                children: "⚠️ Please select at least one domain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1177,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1144,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1122,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0,
                                                    y: 10
                                                },
                                                animate: {
                                                    opacity: 1,
                                                    y: 0
                                                },
                                                className: "bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col max-h-[11.7rem] shadow-inner",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-semibold text-white",
                                                                        children: "Request Log"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1189,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-400",
                                                                        children: "Latest API calls across the pipeline"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1190,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1188,
                                                                columnNumber: 13
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-gray-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10",
                                                                children: [
                                                                    requestLogs.length,
                                                                    " events"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1192,
                                                                columnNumber: 13
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1187,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 space-y-2 overflow-y-auto",
                                                        children: requestLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400",
                                                            children: "No requests yet. Run the pipeline to see activity."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                            lineNumber: 1199,
                                                            columnNumber: 15
                                                        }, this) : requestLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-xl border px-3 py-2 text-xs flex flex-col gap-1 ".concat(log.status === 'success' ? 'border-emerald-400/50 bg-gradient-to-r from-emerald-500/15 to-teal-500/10' : 'border-rose-400/50 bg-gradient-to-r from-rose-500/15 to-pink-500/10'),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-white",
                                                                                children: log.stepName
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1213,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-300",
                                                                                children: new Date(log.timestamp).toLocaleTimeString()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1216,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1212,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] text-cyan-200",
                                                                                children: log.endpoint
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1221,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] font-semibold px-2 py-0.5 rounded-full ".concat(log.status === 'success' ? 'bg-emerald-500/40 text-emerald-100' : 'bg-rose-500/40 text-rose-100'),
                                                                                children: log.status.toUpperCase()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1224,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1220,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[11px] text-gray-100 line-clamp-2",
                                                                        children: log.message
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1234,
                                                                        columnNumber: 19
                                                                    }, this)
                                                                ]
                                                            }, log.id, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1204,
                                                                columnNumber: 17
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1197,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1182,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1120,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-4 gap-4 mb-6",
                                        children: steps.map((step, index)=>{
                                            const isActive = isRunning && index === currentStep;
                                            const stepAccents = [
                                                {
                                                    border: 'amber',
                                                    bg: 'amber-500/20',
                                                    icon: 'text-amber-400'
                                                },
                                                {
                                                    border: 'cyan',
                                                    bg: 'cyan-500/20',
                                                    icon: 'text-cyan-400'
                                                },
                                                {
                                                    border: 'rose',
                                                    bg: 'rose-500/20',
                                                    icon: 'text-rose-400'
                                                },
                                                {
                                                    border: 'emerald',
                                                    bg: 'emerald-500/20',
                                                    icon: 'text-emerald-400'
                                                }
                                            ];
                                            const accent = stepAccents[index % stepAccents.length];
                                            const gradient = index === 0 ? 'conic-gradient(from 0deg, #fbbf24, #fb7185, #22d3ee, #fbbf24)' : index === 1 ? 'conic-gradient(from 0deg, #22d3ee, #a78bfa, #34d399, #22d3ee)' : index === 2 ? 'conic-gradient(from 0deg, #fb7185, #a78bfa, #fbbf24, #fb7185)' : 'conic-gradient(from 0deg, #34d399, #22d3ee, #a78bfa, #34d399)';
                                            const boxContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-2 text-xl ".concat(!isActive ? accent.icon : ''),
                                                        children: [
                                                            step.icon,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg font-semibold text-white",
                                                                children: step.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1319,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1317,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-white/20 rounded-full h-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                            initial: {
                                                                width: 0
                                                            },
                                                            animate: {
                                                                width: "".concat(step.progress, "%")
                                                            },
                                                            className: "h-2 rounded-full transition-all",
                                                            style: {
                                                                backgroundColor: index < currentStep ? 'rgb(52 211 153)' : index === 0 ? 'rgb(251 191 36 / 0.9)' : index === 1 ? 'rgb(34 211 238 / 0.9)' : index === 2 ? 'rgb(251 113 133 / 0.9)' : 'rgb(52 211 153 / 0.9)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                            lineNumber: 1322,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1321,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0.5
                                                },
                                                animate: {
                                                    opacity: index <= currentStep ? 1 : 0.6,
                                                    scale: isActive ? 1.03 : 1
                                                },
                                                className: isActive ? 'relative rounded-xl p-[3px] overflow-hidden min-h-[80px]' : "p-3 rounded-xl border transition-all ".concat(index < currentStep ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/20 bg-white/5 hover:border-white/30'),
                                                children: isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-0 rounded-xl animate-spin",
                                                            style: {
                                                                background: gradient
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                            lineNumber: 1355,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative m-[3px] rounded-[10px] bg-slate-900/95 p-3 min-h-[80px] flex flex-col",
                                                            children: boxContent
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                            lineNumber: 1359,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true) : boxContent
                                            }, step.id, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1336,
                                                columnNumber: 15
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1298,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1066,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1060,
                        columnNumber: 7
                    }, this),
                    isRunning && liveDialogue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            height: 0
                        },
                        animate: {
                            opacity: 1,
                            height: 'auto'
                        },
                        className: "bg-gradient-to-br from-cyan-500/10 to-violet-500/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-cyan-400/40 shadow-lg shadow-cyan-500/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-2 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1381,
                                        columnNumber: 13
                                    }, this),
                                    "Live dialogue",
                                    liveDialogue.dialogue_index != null && liveDialogue.total_dialogues != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400 font-normal",
                                        children: [
                                            "(dialogue ",
                                            liveDialogue.dialogue_index,
                                            " of ",
                                            liveDialogue.total_dialogues,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1384,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1380,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-cyan-200 mb-4",
                                children: liveDialogue.step_message
                            }, void 0, false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1389,
                                columnNumber: 11
                            }, this),
                            liveDialogue.goal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400 mb-3 truncate",
                                title: liveDialogue.goal,
                                children: [
                                    "Goal: ",
                                    liveDialogue.goal
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1391,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 max-h-64 overflow-y-auto rounded-xl bg-black/25 p-3 border border-white/5",
                                children: liveDialogue.current_turns.map((turn, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm p-3 rounded-xl ".concat(turn.role === 'User' ? 'bg-gradient-to-r from-cyan-500/25 to-teal-500/20 text-left border-l-2 border-cyan-400' : 'bg-gradient-to-r from-violet-500/25 to-purple-500/20 text-left ml-4 border-l-2 border-violet-400'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-gray-300",
                                                children: [
                                                    turn.role,
                                                    ": "
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1403,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white",
                                                children: turn.text || ''
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1404,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1395,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1393,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1375,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: !isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    x: 20
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                exit: {
                                    opacity: 0,
                                    x: -20
                                },
                                transition: {
                                    duration: 0.5
                                },
                                className: "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl lg:col-span-2",
                                children: pipelineData.evaluations != null && typeof pipelineData.evaluations === 'object' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Evaluator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    dataset: pipelineData.dataset,
                                    metrics: pipelineData.evaluations,
                                    autoStart: false,
                                    onComplete: (metrics)=>{
                                        console.log('Evaluation complete:', metrics);
                                    },
                                    onLog: (log)=>addRequestLog({
                                            stepId: 'evaluation',
                                            stepName: 'Evaluation',
                                            endpoint: '/api/run-pipeline',
                                            status: log.status,
                                            message: log.message
                                        })
                                }, "evaluator-".concat(pipelineRunId), false, {
                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                    lineNumber: 1424,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center py-14 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-5 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-violet-500/20 to-rose-500/20 mb-5 shadow-lg border border-white/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                className: "w-14 h-14 text-cyan-300"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1445,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                            lineNumber: 1444,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold bg-gradient-to-r from-cyan-200 to-violet-200 bg-clip-text text-transparent mb-2",
                                            children: "Evaluation"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                            lineNumber: 1447,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 max-w-md",
                                            children: pipelineData.dataset.length > 0 ? 'Run the pipeline to see evaluation results here. Results will appear after the run completes.' : 'Run the pipeline to generate dialogues and see evaluation results here.'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                            lineNumber: 1448,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                    lineNumber: 1443,
                                    columnNumber: 17
                                }, this)
                            }, "evaluation-panel", false, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1415,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    x: 20
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                exit: {
                                    opacity: 0,
                                    x: -20
                                },
                                transition: {
                                    duration: 0.5
                                },
                                className: "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl lg:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4 mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-gradient-to-br from-cyan-500 via-teal-500 to-violet-600 rounded-xl shadow-lg",
                                                children: (_steps_Math_min = steps[Math.min(currentStep, steps.length - 1)]) === null || _steps_Math_min === void 0 ? void 0 : _steps_Math_min.icon
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1466,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-2xl font-bold text-white mb-1",
                                                        children: (_steps_Math_min1 = steps[Math.min(currentStep, steps.length - 1)]) === null || _steps_Math_min1 === void 0 ? void 0 : _steps_Math_min1.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300",
                                                        children: (_steps_Math_min2 = steps[Math.min(currentStep, steps.length - 1)]) === null || _steps_Math_min2 === void 0 ? void 0 : _steps_Math_min2.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1473,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1469,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1465,
                                        columnNumber: 15
                                    }, this),
                                    currentStep === 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 text-cyan-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1480,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Evaluation in progress"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1481,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1479,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl bg-black/20 border border-white/10 overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "px-4 py-2 text-xs font-medium text-gray-400 border-b border-white/10 bg-white/5",
                                                        children: "Current step"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1484,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "max-h-64 overflow-y-auto py-2 divide-y divide-white/5",
                                                        children: evaluationStepMessages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "px-4 py-2 text-gray-500 text-sm",
                                                            children: "Waiting for evaluation steps…"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                            lineNumber: 1489,
                                                            columnNumber: 25
                                                        }, this) : evaluationStepMessages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "px-4 py-2 text-sm text-gray-300 flex items-center gap-2",
                                                                children: [
                                                                    i === evaluationStepMessages.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1494,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-block w-1.5 h-1.5 rounded-full bg-green-500/60"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1496,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    msg
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1492,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1487,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1483,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1478,
                                        columnNumber: 17
                                    }, this) : (_steps_Math_min_component = (_steps_Math_min3 = steps[Math.min(currentStep, steps.length - 1)]) === null || _steps_Math_min3 === void 0 ? void 0 : _steps_Math_min3.component) !== null && _steps_Math_min_component !== void 0 ? _steps_Math_min_component : null
                                ]
                            }, currentStep, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1457,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                            lineNumber: 1413,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1412,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.8
                        },
                        className: "mt-8 grid grid-cols-1 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-amber-500/15 to-orange-500/10 backdrop-blur-md rounded-xl p-5 border border-amber-400/20 card-hover",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-amber-300 font-semibold mb-1",
                                        children: "Experiences"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1521,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white",
                                        children: pipelineData.experiences.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1522,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1520,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-cyan-500/15 to-teal-500/10 backdrop-blur-md rounded-xl p-5 border border-cyan-400/20 card-hover",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-cyan-300 font-semibold mb-1",
                                        children: "Conversations"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1525,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white",
                                        children: pipelineData.conversations.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1526,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1524,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-rose-500/15 to-pink-500/10 backdrop-blur-md rounded-xl p-5 border border-rose-400/20 card-hover",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-rose-300 font-semibold mb-1",
                                        children: "Filtered"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1529,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white",
                                        children: pipelineData.filteredConversations.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1530,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1528,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-emerald-500/15 to-green-500/10 backdrop-blur-md rounded-xl p-5 border border-emerald-400/20 card-hover",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-emerald-300 font-semibold mb-1",
                                        children: "Dataset Size"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1533,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-white",
                                        children: pipelineData.dataset.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1534,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1532,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1514,
                        columnNumber: 7
                    }, this),
                    !isRunning && (pipelineData.experiences.length > 0 || pipelineData.conversations.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 30
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 1,
                            duration: 0.5
                        },
                        className: "mt-8 space-y-6",
                        children: [
                            pipelineData.experiences.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-amber-500/15 via-cyan-500/10 to-violet-500/15 backdrop-blur-md rounded-2xl p-6 border border-amber-400/30 shadow-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                                className: "w-6 h-6 text-amber-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1550,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-bold bg-gradient-to-r from-amber-200 to-cyan-200 bg-clip-text text-transparent",
                                                children: "Generated Experiences"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1551,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-auto px-3 py-1.5 bg-amber-500/30 text-amber-100 rounded-full text-sm font-semibold border border-amber-400/30",
                                                children: [
                                                    pipelineData.experiences.length,
                                                    " ",
                                                    pipelineData.experiences.length === 1 ? 'Experience' : 'Experiences'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1552,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1549,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: pipelineData.experiences.map((experience, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0,
                                                    scale: 0.95
                                                },
                                                animate: {
                                                    opacity: 1,
                                                    scale: 1
                                                },
                                                transition: {
                                                    delay: idx * 0.1
                                                },
                                                className: "bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-amber-400/50 transition-all card-hover",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm font-semibold text-cyan-400 mb-1",
                                                                        children: experience.domain.toUpperCase()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1568,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-bold text-white mb-2",
                                                                        children: experience.task || experience.goal
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1571,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1567,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-400 bg-white/10 px-2 py-1 rounded",
                                                                children: [
                                                                    "#",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1575,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1566,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "Goal:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1582,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-white mt-1",
                                                                        children: experience.goal
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1583,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1581,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "Situation:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1586,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-white/90 mt-1 line-clamp-2",
                                                                        children: experience.situation
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1587,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1585,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400",
                                                                        children: "Starter:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1590,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-cyan-200 mt-1 italic",
                                                                        children: [
                                                                            '"',
                                                                            experience.conversation_starter,
                                                                            '"'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                        lineNumber: 1591,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1589,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1580,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, experience.experience_id || idx, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1559,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1557,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1548,
                                columnNumber: 13
                            }, this),
                            pipelineData.conversations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-rose-500/15 backdrop-blur-md rounded-2xl p-6 border border-violet-400/30 shadow-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                className: "w-6 h-6 text-violet-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1604,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-bold bg-gradient-to-r from-violet-200 to-rose-200 bg-clip-text text-transparent",
                                                children: "Generated Dialogues"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1605,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-auto px-3 py-1.5 bg-violet-500/30 text-violet-100 rounded-full text-sm font-semibold border border-violet-400/30",
                                                children: [
                                                    pipelineData.conversations.length,
                                                    " ",
                                                    pipelineData.conversations.length === 1 ? 'Dialogue' : 'Dialogues'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1606,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1603,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: pipelineData.conversations.map((conversation, idx)=>{
                                            var _conversation_turns, _conversation_judge_score;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0,
                                                    x: -20
                                                },
                                                animate: {
                                                    opacity: 1,
                                                    x: 0
                                                },
                                                transition: {
                                                    delay: idx * 0.1
                                                },
                                                className: "bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-violet-400/50 transition-all card-hover",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between mb-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-semibold text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full",
                                                                            children: conversation.domain.toUpperCase()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1623,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-gray-400",
                                                                            children: [
                                                                                ((_conversation_turns = conversation.turns) === null || _conversation_turns === void 0 ? void 0 : _conversation_turns.length) || 0,
                                                                                " turns"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1626,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        conversation.task_success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs bg-green-500/30 text-green-100 px-2 py-1 rounded-full",
                                                                            children: "✓ Task Success"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1630,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                    lineNumber: 1622,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-white mb-1",
                                                                    children: conversation.task || conversation.goal
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                    lineNumber: 1635,
                                                                    columnNumber: 25
                                                                }, this),
                                                                conversation.judge_score && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 mt-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-gray-400",
                                                                            children: "Quality Score:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1640,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1 bg-white/20 rounded-full h-2 max-w-[200px]",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full",
                                                                                style: {
                                                                                    width: "".concat(conversation.judge_score / 5 * 100, "%")
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                                lineNumber: 1642,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1641,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-white font-semibold",
                                                                            children: [
                                                                                (_conversation_judge_score = conversation.judge_score) === null || _conversation_judge_score === void 0 ? void 0 : _conversation_judge_score.toFixed(1),
                                                                                "/5.0"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1647,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                    lineNumber: 1639,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                            lineNumber: 1621,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1620,
                                                        columnNumber: 21
                                                    }, this),
                                                    conversation.turns && conversation.turns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 space-y-2 max-h-60 overflow-y-auto",
                                                        children: [
                                                            conversation.turns.slice(0, 4).map((turn, turnIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-3 p-2 rounded-lg ".concat(turn.speaker === 'user' ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'bg-purple-500/10 border-l-2 border-purple-400'),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-semibold min-w-[60px] ".concat(turn.speaker === 'user' ? 'text-cyan-300' : 'text-purple-300'),
                                                                            children: turn.speaker === 'user' ? '👤 User' : '🤖 Bot'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1667,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-white/90 flex-1",
                                                                            children: turn.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                            lineNumber: 1672,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, turnIdx, true, {
                                                                    fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                    lineNumber: 1659,
                                                                    columnNumber: 27
                                                                }, this)),
                                                            conversation.turns.length > 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-center text-xs text-gray-400 pt-2",
                                                                children: [
                                                                    "+ ",
                                                                    conversation.turns.length - 4,
                                                                    " more turns"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                                lineNumber: 1676,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                        lineNumber: 1657,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, conversation.conv_id || idx, true, {
                                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                                lineNumber: 1613,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                        lineNumber: 1611,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                                lineNumber: 1602,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
                        lineNumber: 1540,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/GoalConvoDashboard.tsx",
        lineNumber: 1010,
        columnNumber: 5
    }, this);
}
_s(GoalConvoDashboard, "QOphC6zj0BOho3rIiMwQsSfgwm4=");
_c = GoalConvoDashboard;
var _c;
__turbopack_context__.k.register(_c, "GoalConvoDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$GoalConvoDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/GoalConvoDashboard.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-20",
                style: {
                    backgroundImage: "radial-gradient(circle at 25% 25%, #9C92AC 2px, transparent 2px),\n                         radial-gradient(circle at 75% 75%, #9C92AC 1px, transparent 1px)",
                    backgroundSize: '60px 60px'
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].header, {
                        initial: {
                            opacity: 0,
                            y: -20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.8
                        },
                        className: "text-center py-8 px-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                                className: "text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4",
                                initial: {
                                    scale: 0.8,
                                    opacity: 0
                                },
                                animate: {
                                    scale: 1,
                                    opacity: 1
                                },
                                transition: {
                                    delay: 0.2,
                                    duration: 0.6
                                },
                                children: "GoalConvo"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 22,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                                className: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto",
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: 1
                                },
                                transition: {
                                    delay: 0.4,
                                    duration: 0.8
                                },
                                children: "Multi-Agent LLM System for Generating Task-Oriented Dialogues"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.6,
                            duration: 0.8
                        },
                        className: "px-4 pb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$GoalConvoDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_fd16bf87._.js.map