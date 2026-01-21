// Game State
const gameState = {
    currentLevel: 1,
    completedLevels: [],
    currentMode: '',
    originalImage: '',
    originalImageDescription: '',
    recreatedImage: '',
    userWords: [],
    timerInterval: null,
    imageViewTime: 10,
    selectedBias: null
};

// API Configuration - Now loaded from config.js
// Note: Google Gemini can generate detailed text descriptions
// We'll use it to create rich image descriptions and then use image generation services

// Level configurations
const levelConfig = {
    1: { mode: 'core', prompt: 'A peaceful mountain landscape at sunset', difficulty: 'easy' },
    2: { mode: 'core', prompt: 'A busy city street with people and cars', difficulty: 'medium' },
    3: { mode: 'core', prompt: 'An underwater scene with colorful coral and tropical fish', difficulty: 'hard' },
    4: { mode: 'blind', prompt: 'A cozy coffee shop interior with warm lighting', viewTime: 10 },
    5: { mode: 'blind', prompt: 'A vintage library with tall bookshelves', viewTime: 8 },
    6: { mode: 'blind', prompt: 'A modern art gallery with abstract paintings', viewTime: 6 },
    7: { mode: 'emotion', prompt: 'A lonely figure on an empty beach', difficulty: 'easy' },
    8: { mode: 'emotion', prompt: 'A tense meeting room atmosphere', difficulty: 'medium' },
    9: { mode: 'emotion', prompt: 'A joyful celebration with vibrant energy', difficulty: 'hard' },
    10: { mode: 'bias', prompt: 'A doctor examining a patient', biasType: 'gender' },
    11: { mode: 'bias', prompt: 'A female chef cooking in a restaurant', biasType: 'cultural' },
    12: { mode: 'bias', prompt: 'A scientist working in a laboratory', biasType: 'stereotype' }
};

// Initialize game
function initGame() {
    renderLevelGrid();
    updateProgressDisplay();
}

// Render Level Grid (new visual level selector)
function renderLevelGrid() {
    const levelsGrid = document.getElementById('levels-grid');
    levelsGrid.innerHTML = '';
    
    const levelIcons = {
        1: '🏔️', 2: '🌆', 3: '🐠',
        4: '☕', 5: '📚', 6: '🎨',
        7: '🏖️', 8: '💼', 9: '🎉',
        10: '👨‍⚕️', 11: '👨‍🍳', 12: '👨‍🔬'
    };
    
    const levelTitles = {
        1: 'Mountain Sunset', 2: 'City Streets', 3: 'Underwater World',
        4: 'Cozy Café', 5: 'Classic Library', 6: 'Modern Gallery',
        7: 'Lonely Beach', 8: 'Tense Meeting', 9: 'Joyful Celebration',
        10: 'Doctor Visit', 11: 'Chef at Work', 12: 'Lab Scientist'
    };
    
    const levelModes = {
        1: '📝 Basic', 2: '📝 Basic', 3: '📝 Basic',
        4: '⏱️ Memory', 5: '⏱️ Memory', 6: '⏱️ Memory',
        7: '💭 Emotion', 8: '💭 Emotion', 9: '💭 Emotion',
        10: '🔍 Bias', 11: '🔍 Bias', 12: '🔍 Bias'
    };
    
    for (let i = 1; i <= 12; i++) {
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';
        
        // Check if completed
        if (gameState.completedLevels.includes(i)) {
            levelCard.classList.add('completed');
        }
        
        // Lock mechanism - levels unlock only when previous level is completed
        const isLocked = i > 1 && !gameState.completedLevels.includes(i - 1);
        
        if (isLocked) {
            levelCard.classList.add('locked');
        }
        
        levelCard.innerHTML = `
            <div class="level-icon">${levelIcons[i]}</div>
            <div class="level-number">Challenge ${i}</div>
            <div class="level-title">${levelTitles[i]}</div>
            <div class="level-mode">${levelModes[i]}</div>
        `;
        
        // Add click handler after setting innerHTML
        if (!isLocked) {
            levelCard.onclick = () => startLevel(i);
        }
        
        levelsGrid.appendChild(levelCard);
    }
    
    // Update progress counter
    updateProgressCounter();
}

// Update progress counter in level select
function updateProgressCounter() {
    const completed = gameState.completedLevels.length;
    document.getElementById('progress-count').textContent = completed;
    
    const progressFill = document.getElementById('mini-progress');
    const percentage = (completed / 12) * 100;
    progressFill.style.width = percentage + '%';
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Render Level Select (old system - keeping for reference)
function renderLevelSelect() {
    // Levels 1-3 (Core)
    renderLevelButtons(1, 3, 'levels-1-3');
    // Levels 4-6 (Blind)
    renderLevelButtons(4, 6, 'levels-4-6');
    // Levels 7-9 (Emotion)
    renderLevelButtons(7, 9, 'levels-7-9');
    // Levels 10-12 (Bias)
    renderLevelButtons(10, 12, 'levels-10-12');
}

function renderLevelButtons(start, end, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = `Level ${i}`;
        
        if (gameState.completedLevels.includes(i)) {
            btn.classList.add('completed');
        }
        
        // Lock levels that aren't unlocked yet
        if (i > 1 && !gameState.completedLevels.includes(i - 1)) {
            btn.classList.add('locked');
            btn.disabled = true;
        } else {
            btn.onclick = () => startLevel(i);
        }
        
        container.appendChild(btn);
    }
}

// Start a Level
function startLevel(level) {
    gameState.currentLevel = level;
    const config = levelConfig[level];
    gameState.currentMode = config.mode;
    
    // Show appropriate intro screen for special modes (only on first level of that mode)
    if (level === 7) {
        showScreen('emotion-rules-screen');
        return;
    } else if (level === 10) {
        showScreen('bias-intro-screen');
        return;
    }
    
    // Generate initial image and show observation screen
    generateInitialImage(config.prompt);
}

// Start bias level after intro
function startBiasLevel() {
    const config = levelConfig[gameState.currentLevel];
    generateInitialImage(config.prompt);
}

// Generate Initial Image (simulated for now)
async function generateInitialImage(prompt) {
    const config = levelConfig[gameState.currentLevel];
    
    // Show loading
    showScreen('regeneration-screen');
    document.getElementById('regeneration-title').textContent = 'AI is generating the challenge image...';
    document.getElementById('prompt-display').textContent = 'Generating image...';
    
    try {
        // Use Imagen API through Google AI Studio or alternative image generation
        // For now, we'll use Pollinations.ai API which is free and works well with prompts
        const imageUrl = await generateImageWithPollinations(prompt);
        
        gameState.originalImage = imageUrl;
        gameState.originalImageDescription = prompt;
        
        // Preload the image before showing any screen
        await preloadImage(imageUrl);
        
        // Set the image
        document.getElementById('original-image').src = gameState.originalImage;
        
        // Configure screen based on mode
        if (config.mode === 'blind') {
            // Show blind mode warning first (image is already loaded)
            showBlindModeWarning(config.viewTime);
        } else {
            document.getElementById('blind-mode-warning').style.display = 'none';
            document.getElementById('observation-content').style.display = 'block';
            document.getElementById('timer-display').style.display = 'none';
            document.getElementById('observation-hint').textContent = 
                config.mode === 'emotion' 
                    ? 'Focus only on emotions, mood, and atmosphere - use adjectives only!' 
                    : 'Look for subject, action, environment, style, and mood.';
            showScreen('observation-screen');
        }
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Failed to generate image. Using placeholder instead.');
        
        // Fallback to placeholder
        gameState.originalImage = `https://via.placeholder.com/800x600/4dd0e1/ffffff?text=Challenge+${gameState.currentLevel}`;
        document.getElementById('original-image').src = gameState.originalImage;
        
        if (config.mode === 'blind') {
            showBlindModeWarning(config.viewTime);
        } else {
            document.getElementById('blind-mode-warning').style.display = 'none';
            document.getElementById('observation-content').style.display = 'block';
            document.getElementById('timer-display').style.display = 'none';
            showScreen('observation-screen');
        }
    }
}

// Preload image to ensure it's ready before showing
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
    });
}

// Show blind mode warning
function showBlindModeWarning(viewTime) {
    document.getElementById('blind-mode-warning').style.display = 'block';
    document.getElementById('observation-content').style.display = 'none';
    document.getElementById('time-limit').textContent = viewTime;
    gameState.imageViewTime = viewTime;
    showScreen('observation-screen');
}

// Start blind observation after user clicks ready
function startBlindObservation() {
    document.getElementById('blind-mode-warning').style.display = 'none';
    document.getElementById('observation-content').style.display = 'block';
    document.getElementById('timer-display').style.display = 'block';
    
    // Make sure the image is visible
    const imageElement = document.getElementById('original-image');
    imageElement.style.display = 'block';
    imageElement.style.visibility = 'visible';
    imageElement.style.opacity = '1';
    
    const config = levelConfig[gameState.currentLevel];
    setupBlindMode(config.viewTime);
}

// Generate image using Pollinations.ai API (free, no API key needed)
async function generateImageWithPollinations(prompt) {
    // Pollinations.ai provides free AI image generation
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000); // Random seed for variety
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true`;
}

// Alternative: Use Google Gemini to enhance prompts, then generate with Pollinations
async function enhancePromptWithGemini(basicPrompt) {
    try {
        const response = await fetch(`${CONFIG.GEMINI_IMAGE_API}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Create a detailed, visual image description (max 50 words) for this concept: "${basicPrompt}". Focus on visual details, colors, composition, lighting, and style. Make it suitable for an AI image generator.`
                    }]
                }]
            })
        });
        
        const data = await response.json();
        if (data.candidates && data.candidates[0]) {
            return data.candidates[0].content.parts[0].text.trim();
        }
    } catch (error) {
        console.error('Gemini API error:', error);
    }
    return basicPrompt; // Fallback to original prompt
}

function getModeDisplayName() {
    const modes = {
        'core': 'Core Prompt Mirror',
        'blind': 'Blind Prompt Mode',
        'emotion': 'Emotion-Only Mode',
        'bias': 'Bias Spotter Mode'
    };
    return modes[gameState.currentMode] || '';
}

// Get friendly stage name without revealing level numbers
function getStageDisplayName() {
    const level = gameState.currentLevel;
    if (level <= 3) return 'Getting Started';
    if (level <= 6) return 'Memory Challenge';
    if (level <= 9) return 'Emotional Journey';
    return 'Critical Thinking';
}

// Blind Mode Timer
function setupBlindMode(viewTime) {
    let timeLeft = viewTime;
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.style.display = 'block';
    timerDisplay.textContent = `${timeLeft}s`;
    
    gameState.timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            // Auto-advance to input screen
            goToExtraction();
        }
    }, 1000);
}

// Go to Extraction Screen
function goToExtraction() {
    // Clear timer if running
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Update display (hidden now)
    document.getElementById('input-level-display').textContent = getStageDisplayName();
    
    const config = levelConfig[gameState.currentLevel];
    
    // Show or hide reference image based on mode
    if (config.mode === 'blind') {
        document.getElementById('side-image').style.display = 'none';
        document.getElementById('image-placeholder').style.display = 'flex';
    } else {
        document.getElementById('side-image').style.display = 'block';
        document.getElementById('side-image').src = gameState.originalImage;
        document.getElementById('image-placeholder').style.display = 'none';
    }
    
    // Update rule badge for emotion mode
    if (config.mode === 'emotion') {
        document.getElementById('rule-badge').innerHTML = `
            <p>❌ No nouns (objects, people, places)</p>
            <p>✅ Adjectives only (emotions, feelings, moods)</p>
        `;
        document.getElementById('input-hint').textContent = 'Example: "Lonely", "Tense", "Peaceful", "Melancholic", "Joyful"';
    } else {
        document.getElementById('rule-badge').innerHTML = `
            <p>✓ Exactly 5 words</p>
            <p>✓ One word per box</p>
            <p>✓ No sentences</p>
        `;
        document.getElementById('input-hint').textContent = '';
    }
    
    // Clear previous inputs
    document.querySelectorAll('.word-input').forEach(input => {
        input.value = '';
    });
    
    showScreen('input-screen');
}

// Generate Image from User Words
async function generateImage() {
    // Collect user input
    const inputs = document.querySelectorAll('.word-input');
    gameState.userWords = Array.from(inputs).map(input => input.value.trim()).filter(word => word !== '');
    
    // Validate
    if (gameState.userWords.length !== 5) {
        alert('Please enter exactly 5 words!');
        return;
    }
    
    // Validate emotion mode
    const config = levelConfig[gameState.currentLevel];
    if (config.mode === 'emotion' && !validateEmotionWords(gameState.userWords)) {
        alert('Please use only emotional words (no nouns or objects)!');
        return;
    }
    
    // Show loading screen
    const wordCount = gameState.userWords.length;
    document.getElementById('regeneration-title').textContent = `AI is recreating the image using your ${wordCount} words.`;
    document.getElementById('prompt-display').textContent = gameState.userWords.join(', ');
    showScreen('regeneration-screen');
    
    try {
        // Generate image from user's 5 words
        const userPrompt = gameState.userWords.join(' ');
        
        // Optional: Use Gemini to enhance the 5-word prompt into a detailed description
        const enhancedPrompt = await enhancePromptWithGemini(userPrompt);
        console.log('Enhanced prompt:', enhancedPrompt);
        
        // Generate image using the enhanced prompt
        gameState.recreatedImage = await generateImageWithPollinations(enhancedPrompt);
        
        // Preload the recreated image before showing comparison
        await preloadImage(gameState.recreatedImage);
        
        // Go to appropriate comparison screen
        if (config.mode === 'bias') {
            showBiasDetection();
        } else {
            showComparison();
        }
    } catch (error) {
        console.error('Error generating recreated image:', error);
        
        // Fallback to placeholder
        gameState.recreatedImage = `https://via.placeholder.com/800x600/4dd0e1/ffffff?text=Recreated:+${gameState.userWords.join('+')}`;
        
        setTimeout(() => {
            if (config.mode === 'bias') {
                showBiasDetection();
            } else {
                showComparison();
            }
        }, 2000);
    }
}

function validateEmotionWords(words) {
    // Common nouns to reject (objects, people, places)
    const bannedNouns = [
        // People
        'person', 'people', 'man', 'woman', 'child', 'boy', 'girl', 'human', 'figure', 'someone',
        // Objects
        'car', 'house', 'tree', 'dog', 'cat', 'table', 'chair', 'book', 'phone', 'computer',
        'building', 'road', 'street', 'window', 'door', 'wall', 'floor', 'ceiling',
        // Places
        'beach', 'ocean', 'mountain', 'forest', 'city', 'town', 'room', 'office', 'home',
        'restaurant', 'shop', 'store', 'park', 'garden', 'lake', 'river',
        // Nature
        'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'sky', 'water', 'fire',
        'flower', 'grass', 'leaf', 'branch', 'rock', 'stone', 'sand',
        // Animals
        'bird', 'fish', 'animal', 'insect', 'butterfly', 'horse', 'cow'
    ];
    
    // Valid emotion/mood adjectives
    const validEmotionWords = [
        'happy', 'sad', 'angry', 'joyful', 'melancholic', 'peaceful', 'tense', 'anxious',
        'lonely', 'excited', 'calm', 'serene', 'cheerful', 'gloomy', 'mysterious', 'bright',
        'dark', 'warm', 'cold', 'cozy', 'uncomfortable', 'energetic', 'tired', 'lively',
        'quiet', 'loud', 'gentle', 'harsh', 'soft', 'intense', 'relaxed', 'stressed',
        'hopeful', 'desperate', 'confident', 'nervous', 'playful', 'serious', 'romantic',
        'dramatic', 'subtle', 'vibrant', 'dull', 'fresh', 'stale', 'clean', 'messy',
        'elegant', 'rough', 'smooth', 'chaotic', 'organized', 'wild', 'tame', 'fierce',
        'delicate', 'strong', 'weak', 'powerful', 'fragile', 'bold', 'timid', 'brave'
    ];
    
    for (let word of words) {
        const lowerWord = word.toLowerCase();
        
        // Check if it's a banned noun
        if (bannedNouns.includes(lowerWord)) {
            alert(`"${word}" is a noun! Use only adjectives that describe emotions, mood, or atmosphere.`);
            return false;
        }
        
        // Check if word ends with common noun suffixes (but not adjective suffixes)
        if (lowerWord.match(/ing$/) && !validEmotionWords.includes(lowerWord)) {
            // Allow -ing words that are adjectives like "striking", "captivating"
            const emotionalIng = ['striking', 'captivating', 'interesting', 'boring', 'exciting', 
                                 'relaxing', 'disturbing', 'soothing', 'overwhelming'];
            if (!emotionalIng.includes(lowerWord)) {
                alert(`"${word}" seems like a verb or noun. Use adjectives only - words that describe feelings!`);
                return false;
            }
        }
    }
    
    return true;
}

// Show Comparison Screen
function showComparison() {
    const config = levelConfig[gameState.currentLevel];
    
    // Hide level header, show stage name instead
    document.getElementById('comparison-level-display').textContent = getStageDisplayName();
    document.getElementById('original-comparison').src = gameState.originalImage;
    document.getElementById('recreated-comparison').src = gameState.recreatedImage;
    
    // Update reflection prompts based on mode
    const reflectionDiv = document.getElementById('reflection-prompts');
    
    if (config.mode === 'blind') {
        reflectionDiv.innerHTML = `
            <h3>Reflection:</h3>
            <p>• What did memory distort?</p>
            <p>• What did you assume incorrectly?</p>
            <p>• What details were preserved?</p>
        `;
    } else if (config.mode === 'emotion') {
        reflectionDiv.innerHTML = `
            <h3>Reflection:</h3>
            <p>• How did AI visualize emotion?</p>
            <p>• Did AI invent objects?</p>
            <p>• Which emotion translated best?</p>
        `;
    } else {
        reflectionDiv.innerHTML = `
            <h3>Reflection:</h3>
            <p>• What detail was lost?</p>
            <p>• What was preserved?</p>
            <p>• Which word mattered most?</p>
        `;
    }
    
    showScreen('comparison-screen');
}

// Next Level - Now goes to Learning Screen first
function nextLevel() {
    const config = levelConfig[gameState.currentLevel];
    
    // Skip learning screen for bias mode
    if (config.mode === 'bias') {
        proceedToNextChallenge();
        return;
    }
    
    // Show learning screen
    showLearningScreen();
}

// Show Learning Screen with AI Analysis
async function showLearningScreen() {
    showScreen('learning-screen');
    
    // Display user's words
    const userWordsContainer = document.getElementById('user-words-display');
    userWordsContainer.innerHTML = gameState.userWords.map(word => 
        `<span class="word-tag">${word}</span>`
    ).join('');
    
    // Set images
    document.getElementById('learning-original').src = gameState.originalImage;
    document.getElementById('learning-recreated').src = gameState.recreatedImage;
    
    // Get AI analysis using Gemini
    await getAIFeedback();
}

// Get AI Feedback using Gemini API
async function getAIFeedback() {
    const config = levelConfig[gameState.currentLevel];
    const originalPrompt = config.prompt;
    const userWords = gameState.userWords.join(', ');
    
    try {
        // Create detailed prompt for Gemini
        const analysisPrompt = `You are an AI prompt engineering teacher analyzing a student's image prompt.

ORIGINAL SCENE: "${originalPrompt}"
STUDENT'S 5 WORDS: "${userWords}"

Provide feedback in this EXACT format (don't add extra text or explanations):

SUGGESTED_WORDS: word1, word2, word3, word4, word5

INSIGHTS: Write 2-3 clear sentences explaining what the student did well and what they could improve. Focus on specific details about their word choices.

TIPS:
- First specific tip about word choice or description technique
- Second specific tip about capturing visual details
- Third specific tip about improving prompt effectiveness`;

        console.log('Sending request to Gemini API...');
        
        const response = await fetch(`${CONFIG.GEMINI_IMAGE_API}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: analysisPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Gemini API response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const feedbackText = data.candidates[0].content.parts[0].text;
            console.log('Feedback text:', feedbackText);
            parseFeedback(feedbackText);
        } else {
            console.warn('No valid candidates in response');
            showFallbackFeedback();
        }
    } catch (error) {
        console.error('Error getting AI feedback:', error);
        showFallbackFeedback();
    }
}

// Parse and display the feedback from Gemini
function parseFeedback(feedbackText) {
    console.log('Parsing feedback:', feedbackText);
    
    let successCount = 0;
    
    // Extract suggested words - try multiple patterns
    const suggestedMatch = feedbackText.match(/SUGGESTED_WORDS:\s*([^\n]+)/i);
    if (suggestedMatch) {
        const wordsLine = suggestedMatch[1].trim();
        // Remove any trailing periods or extra text
        const cleanWords = wordsLine.split(/[,\n]/)[0].split(',');
        const suggestedWords = cleanWords.map(w => w.trim()).filter(w => w.length > 0).slice(0, 5);
        
        if (suggestedWords.length > 0) {
            const suggestedContainer = document.getElementById('suggested-words-display');
            suggestedContainer.innerHTML = suggestedWords.map(word => 
                `<span class="word-tag suggested">${word}</span>`
            ).join('');
            successCount++;
        }
    }
    
    // Extract insights - be more flexible with the pattern
    const insightsMatch = feedbackText.match(/INSIGHTS:\s*([^]*?)(?=\n\s*TIPS:|$)/i);
    if (insightsMatch) {
        const insights = insightsMatch[1].trim();
        if (insights.length > 0) {
            document.getElementById('ai-insights').innerHTML = `<p>${insights}</p>`;
            successCount++;
        }
    }
    
    // Extract tips - handle various bullet formats
    const tipsMatch = feedbackText.match(/TIPS:\s*([^]*?)$/i);
    if (tipsMatch) {
        const tipsText = tipsMatch[1];
        // Match lines that start with -, •, *, or numbers
        const tips = tipsText.split('\n')
            .map(line => line.trim())
            .filter(line => line.match(/^[-•*\d][.)]\s*.+/))
            .map(line => line.replace(/^[-•*\d][.)]\s*/, '').trim())
            .filter(tip => tip.length > 0)
            .slice(0, 3);
        
        if (tips.length > 0) {
            const tipsContainer = document.getElementById('tips-list');
            tipsContainer.innerHTML = tips.map(tip => 
                `<div class="tip-item">${tip}</div>`
            ).join('');
            successCount++;
        }
    }
    
    // If parsing failed, show fallback
    if (successCount === 0) {
        console.warn('Could not parse feedback, using fallback');
        showFallbackFeedback();
    }
}

// Fallback feedback if API fails
function showFallbackFeedback() {
    const config = levelConfig[gameState.currentLevel];
    const originalPrompt = config.prompt;
    const mode = config.mode;
    
    console.log('Using fallback feedback');
    
    // Extract key concepts from original prompt for better fallback
    let fallbackWords = [];
    let specificInsights = '';
    let specificTips = [];
    
    // Level-specific feedback based on the actual prompts
    if (gameState.currentLevel === 1) {
        // "A peaceful mountain landscape at sunset"
        fallbackWords = ['peaceful', 'mountain', 'sunset', 'golden', 'majestic'];
        specificInsights = `For this mountain sunset scene, capturing the time of day (sunset) and mood (peaceful) are crucial. Your words "${gameState.userWords.join(', ')}" ${gameState.userWords.includes('sunset') || gameState.userWords.includes('peaceful') ? 'captured key elements!' : 'could be more specific about the lighting and atmosphere.'}`;
        specificTips = [
            '<strong>Time of Day:</strong> Words like "sunset", "dusk", or "golden hour" immediately set the lighting and mood',
            '<strong>Natural Elements:</strong> Mention "mountain", "landscape", or "peaks" to establish the setting clearly',
            '<strong>Mood Words:</strong> "Peaceful", "serene", or "tranquil" help convey the atmosphere of the scene'
        ];
    } else if (gameState.currentLevel === 2) {
        // "A busy city street with people and cars"
        fallbackWords = ['busy', 'urban', 'crowded', 'street', 'bustling'];
        specificInsights = `This urban scene requires words that convey activity and density. Your words "${gameState.userWords.join(', ')}" ${gameState.userWords.includes('busy') || gameState.userWords.includes('city') ? 'captured the urban setting!' : 'could emphasize the activity and city environment more.'}`;
        specificTips = [
            '<strong>Activity Level:</strong> Use "busy", "crowded", or "bustling" to show the energy of the scene',
            '<strong>Urban Context:</strong> Words like "city", "street", or "urban" establish the metropolitan setting',
            '<strong>Elements Present:</strong> Mentioning "people", "cars", or "traffic" adds important context about what\'s in the scene'
        ];
    } else if (gameState.currentLevel === 3) {
        // "An underwater scene with colorful coral and tropical fish"
        fallbackWords = ['underwater', 'colorful', 'coral', 'tropical', 'vibrant'];
        specificInsights = `This underwater scene needs words about location and colors. Your words "${gameState.userWords.join(', ')}" ${gameState.userWords.includes('underwater') || gameState.userWords.includes('coral') ? 'captured the underwater theme!' : 'could be more specific about the aquatic setting and marine life.'}`;
        specificTips = [
            '<strong>Environment:</strong> "Underwater", "ocean", or "reef" immediately tells AI the setting is aquatic',
            '<strong>Color Descriptions:</strong> "Colorful", "vibrant", or "turquoise" capture the vivid underwater palette',
            '<strong>Marine Life:</strong> Words like "coral", "fish", or "tropical" specify what creatures and plants are present'
        ];
    } else if (gameState.currentLevel === 4 || gameState.currentLevel === 5 || gameState.currentLevel === 6) {
        // Blind mode - memory-focused tips
        if (originalPrompt.includes('coffee')) {
            fallbackWords = ['cozy', 'warm', 'coffee', 'interior', 'ambient'];
            specificInsights = `In blind mode, you had to remember this cozy interior from memory. The key is capturing the atmosphere and defining features quickly.`;
            specificTips = [
                '<strong>First Impressions:</strong> Note the overall mood first - "cozy", "warm", or "intimate" for interior spaces',
                '<strong>Defining Features:</strong> What made it memorable? "Coffee shop", "shelves", "lighting" are key identifiers',
                '<strong>Atmosphere:</strong> Temperature words like "warm" or lighting words like "dim" or "golden" help recreate the feeling'
            ];
        } else if (originalPrompt.includes('library')) {
            fallbackWords = ['vintage', 'library', 'books', 'tall', 'shelves'];
            specificInsights = `From memory, focus on the most distinctive elements - the tall bookshelves and vintage character of this library.`;
            specificTips = [
                '<strong>Scale Words:</strong> "Tall", "grand", or "massive" convey the impressive size of elements',
                '<strong>Age/Style:</strong> "Vintage", "classic", or "old" capture the historical character',
                '<strong>Key Objects:</strong> "Books", "shelves", "library" are essential nouns that define the space'
            ];
        } else {
            fallbackWords = ['modern', 'gallery', 'art', 'spacious', 'white'];
            specificInsights = `Memory challenges require focusing on 2-3 most striking features. What stood out most to you?`;
            specificTips = [
                '<strong>Architectural Style:</strong> "Modern", "contemporary", or "minimalist" set the design tone',
                '<strong>Space Quality:</strong> "Spacious", "open", or "airy" describe the feel of the room',
                '<strong>Distinctive Elements:</strong> What was most memorable? Colors, objects, or unique features'
            ];
        }
    } else if (gameState.currentLevel >= 7 && gameState.currentLevel <= 9) {
        // Emotion mode
        if (originalPrompt.includes('lonely')) {
            fallbackWords = ['lonely', 'melancholic', 'isolated', 'quiet', 'somber'];
            specificInsights = `In emotion-only mode, you must describe feelings, not objects. Focus on isolation, solitude, and the emotional weight of the scene.`;
            specificTips = [
                '<strong>Primary Emotion:</strong> "Lonely", "isolated", or "solitary" capture the core feeling',
                '<strong>Mood Modifiers:</strong> "Melancholic", "pensive", or "reflective" add emotional depth',
                '<strong>Atmospheric Feelings:</strong> "Quiet", "still", or "empty" convey the emotional atmosphere without naming objects'
            ];
        } else if (originalPrompt.includes('tense')) {
            fallbackWords = ['tense', 'anxious', 'pressured', 'stressful', 'intense'];
            specificInsights = `Capture the stress and pressure of the moment using only emotional descriptors. Think about how the scene makes you feel.`;
            specificTips = [
                '<strong>Core Tension:</strong> "Tense", "stressful", or "pressured" establish the uncomfortable feeling',
                '<strong>Intensity Level:</strong> "Anxious", "nervous", or "uneasy" show the emotional charge',
                '<strong>Energy Quality:</strong> "Intense", "charged", or "tight" describe the emotional atmosphere'
            ];
        } else {
            fallbackWords = ['joyful', 'celebratory', 'energetic', 'euphoric', 'vibrant'];
            specificInsights = `Express pure joy and celebration through emotion words only. Focus on the positive energy and excitement.`;
            specificTips = [
                '<strong>Positive Emotions:</strong> "Joyful", "happy", or "delighted" capture the uplifting feeling',
                '<strong>Celebration Energy:</strong> "Celebratory", "festive", or "jubilant" convey the party atmosphere',
                '<strong>Vitality:</strong> "Energetic", "lively", or "vibrant" show the dynamic emotional quality'
            ];
        }
    } else {
        // Bias mode or general fallback
        fallbackWords = ['detailed', 'atmospheric', 'vivid', 'cinematic', 'striking'];
        specificInsights = `Your words "${gameState.userWords.join(', ')}" captured some elements. To improve, be more specific about colors, lighting, and composition.`;
        specificTips = [
            '<strong>Be Specific:</strong> Replace general words like "nice" with vivid descriptors like "golden", "dramatic", or "ethereal"',
            '<strong>Include Atmosphere:</strong> Mention lighting (sunset, dim, bright), mood (peaceful, tense, joyful), or time of day',
            '<strong>Visual Details Matter:</strong> Focus on what you can see - colors, textures, composition, and scale help AI understand better'
        ];
    }
    
    // Display suggested words
    document.getElementById('suggested-words-display').innerHTML = fallbackWords.map(word => 
        `<span class="word-tag suggested">${word}</span>`
    ).join('');
    
    // Display specific insights
    document.getElementById('ai-insights').innerHTML = `<p>${specificInsights}</p>`;
    
    // Display specific tips
    document.getElementById('tips-list').innerHTML = specificTips.map(tip => 
        `<div class="tip-item">${tip}</div>`
    ).join('');
}

// Proceed to Next Challenge
function proceedToNextChallenge() {
    // Mark current level as completed
    if (!gameState.completedLevels.includes(gameState.currentLevel)) {
        gameState.completedLevels.push(gameState.currentLevel);
        updateProgressDisplay();
    }
    
    // Check if all levels completed
    if (gameState.currentLevel === 12) {
        showScreen('progress-screen');
        return;
    }
    
    // Refresh the level grid and show it
    renderLevelGrid();
    showScreen('level-select-screen');
}

// Bias Detection
function showBiasDetection() {
    // Hide level number
    document.getElementById('bias-level-display').textContent = getStageDisplayName();
    document.getElementById('original-bias').src = gameState.originalImage;
    document.getElementById('recreated-bias').src = gameState.recreatedImage;
    
    // Reset selection
    gameState.selectedBias = null;
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    showScreen('bias-detection-screen');
}

function selectBias(type) {
    gameState.selectedBias = type;
    
    // Update button states
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Show feedback after brief delay
    setTimeout(() => {
        showBiasFeedback(type);
    }, 500);
}

function showBiasFeedback(selectedType) {
    const config = levelConfig[gameState.currentLevel];
    const actualBias = config.biasType || 'none';
    
    // Determine if correct - Gender bias can be detected as visual or stereotype
    let correct = false;
    if (actualBias === 'gender') {
        correct = (selectedType === 'visual' || selectedType === 'stereotype');
    } else {
        correct = (selectedType === actualBias);
    }
    
    document.getElementById('bias-detected').textContent = correct ? 'Yes' : 'Maybe';
    document.getElementById('bias-type').textContent = 
        correct ? formatBiasType(actualBias) : 'Review the comparison again';
    
    showScreen('bias-feedback-screen');
}

function formatBiasType(type) {
    const types = {
        'gender': 'Gender Bias',
        'cultural': 'Cultural Bias',
        'stereotype': 'Role Stereotype',
        'none': 'No Significant Bias'
    };
    return types[type] || type;
}

// Update Progress Display
function updateProgressDisplay() {
    const completed = gameState.completedLevels.length;
    document.getElementById('levels-completed').textContent = completed;
    
    const progressBar = document.getElementById('progress-bar');
    const percentage = (completed / 12) * 100;
    progressBar.style.width = percentage + '%';
    
    // Unlock skills based on progress
    if (completed >= 3) {
        document.getElementById('skill-observation').classList.add('unlocked');
    }
    if (completed >= 6) {
        document.getElementById('skill-memory').classList.add('unlocked');
    }
    if (completed >= 9) {
        document.getElementById('skill-emotion').classList.add('unlocked');
    }
    if (completed >= 12) {
        document.getElementById('skill-bias').classList.add('unlocked');
    }
    
    // Show progress screen at milestones (every 3 levels)
    if (completed > 0 && completed % 3 === 0 && completed < 12) {
        return true; // Signal to show progress
    }
    return false;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);
