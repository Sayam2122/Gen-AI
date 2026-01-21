# Prompt Mirror - AI Image Prompt Learning Game

**See → Decode → Recreate**

An interactive single-player web game that teaches AI image prompting through 12 progressive challenges. Players observe AI-generated images, extract key words, and discover how AI recreates images from their descriptions.

## � Live Demo

**Play Now**: [https://gen-ai-three-lake.vercel.app/](https://gen-ai-three-lake.vercel.app/)

## �🎮 Game Modes

### 📝 Levels 1-3: Core Prompt Mirror (Basic Mode)
Learn the fundamentals of AI prompting by describing images with exactly 5 words.
- **Level 1**: Mountain Sunset 🏔️
- **Level 2**: City Streets 🌆  
- **Level 3**: Underwater World 🐠

### ⏱️ Levels 4-6: Memory Challenge (Blind Mode)
Memorize the image in limited time (10s/8s/6s), then describe it from memory only.
- **Level 4**: Cozy Café ☕ (10 seconds)
- **Level 5**: Classic Library 📚 (8 seconds)
- **Level 6**: Modern Gallery 🎨 (6 seconds)

### 💭 Levels 7-9: Emotion Only Mode
Describe images using ONLY emotional adjectives - no objects, nouns, or physical descriptions allowed.
- **Level 7**: Lonely Beach 🏖️
- **Level 8**: Tense Meeting 💼
- **Level 9**: Joyful Celebration 🎉

### 🔍 Levels 10-12: Bias Spotter Mode
Identify where AI adds assumptions, gender bias, cultural bias, and stereotypes that weren't in the original prompt.
- **Level 10**: Doctor Visit 👨‍⚕️ (Gender Bias)
- **Level 11**: Female Chef 👩‍🍳 (Cultural Bias)
- **Level 12**: Lab Scientist 👨‍🔬 (Role Stereotype)

## 🚀 Getting Started

### 1. Quick Start
Simply open `index.html` in a modern web browser:

```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### 2. Development Setup
For live reloading during development:

1. Install VS Code's Live Server extension
2. Right-click `index.html` → "Open with Live Server"
3. Game will run at `http://localhost:5500`

## 🔑 API Configuration

### Current Setup
The game uses **two APIs** for full functionality:

1. **Pollinations.ai** - Free image generation (no API key needed)
2. **Google Gemini API** - AI-powered feedback and prompt enhancement

### API Key Setup

1. Create a `config.js` file (already included):
```javascript
const CONFIG = {
    GEMINI_API_KEY: 'YOUR_API_KEY_HERE',
    GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};
```

2. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. Create `.env` file (optional, for local environment variables):
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Note**: The `.env` file is git-ignored for security.

## 🎨 Design Theme

- **Background**: White with cyan gradient accents
- **Primary Color**: Cyan (#0277bd)
- **Secondary Colors**: #00bcd4, #4dd0e1, #b2ebf2, #e0f7fa
- **Typography**: Clean, modern sans-serif
- **Layout**: Card-based with smooth animations

## 📁 File Structure

```
module_2_activity_2/
├── index.html           # Main game structure (19 screens)
├── style.css            # White/cyan themed styling with animations
├── script.js            # Game logic (927 lines)
├── config.js            # API configuration
├── .env                 # Environment variables (git-ignored)
├── .gitignore          # Excludes .env and sensitive files
└── README.md            # This file
```

## 🎯 Features

✅ **12 Progressive Levels** with sequential unlocking  
✅ **4 Unique Game Modes** (Basic, Memory, Emotion, Bias Detection)  
✅ **Visual Level Selection Grid** with icons and progress tracking  
✅ **AI-Powered Learning Feedback** using Google Gemini  
✅ **Blind Mode Timer** with countdown (10s/8s/6s)  
✅ **Emotion-Only Validation** (70+ banned nouns)  
✅ **Bias Detection System** with side-by-side comparison  
✅ **Level Locking** - unlock levels by completing previous ones  
✅ **Progress Tracking** with skill unlocking  
✅ **Responsive Design** for all screen sizes  
✅ **Beautiful Animations** and smooth transitions  
✅ **Real Image Generation** via Pollinations.ai API

## 🔧 Key Game Mechanics

## 🔧 Key Game Mechanics

### Level Progression
- Levels unlock sequentially (complete Level 1 to unlock Level 2, etc.)
- Progress is tracked and displayed on the level selection screen
- 12 challenges total across 4 game modes

### Word Validation
- **Basic Mode**: Exactly 5 words required
- **Emotion Mode**: Only adjectives allowed (70+ nouns are blocked)
- **Memory Mode**: Must recall image details without seeing it
- **Bias Mode**: No word restrictions, focus on comparison

### Image Generation
```javascript
// Uses Pollinations.ai free API
const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true`;
```

### AI Feedback System
After each level, Google Gemini analyzes your words and provides:
- **Suggested Words**: Better alternatives for your prompts
- **Insights**: What you captured well vs. what was missed
- **Tips**: How to improve for future challenges

## 🎓 Learning Outcomes

Players will learn:
- ✅ How to write effective AI image prompts
- ✅ The importance of specific vs. vague keywords
- ✅ How AI interprets emotional language differently
- ✅ Common biases in AI image generation (gender, cultural, role stereotypes)
- ✅ The gap between human perception and AI interpretation
- ✅ Memory retention and visual detail observation

## � How to Play

1. **Select Level** - Choose from the visual grid (unlock by completing previous levels)
2. **Observe** - Study the AI-generated image carefully
3. **Extract** - Enter exactly 5 key words that capture the essence
4. **Generate** - AI recreates the image using only your words
5. **Compare** - See side-by-side what was preserved and lost
6. **Learn** - Get AI-powered feedback on your word choices
7. **Progress** - Advance to the next challenge!

### Special Modes:
- **Memory Challenge**: Click "I'm Ready" after studying the image, then describe from memory during countdown
- **Emotion Only**: Use ONLY adjectives describing mood/atmosphere (no objects!)
- **Bias Detection**: Compare images and identify what assumptions the AI added

## 🐛 Troubleshooting

### Images not generating?
- Check internet connection (Pollinations.ai requires online access)
- Try refreshing the page
- Check browser console for errors (F12)

### AI feedback not working?
- Verify your Gemini API key in `config.js`
- Ensure the API key is active and has quota
- Check if the key has proper permissions

### Levels not unlocking?
- Complete the previous level first
- Check `gameState.completedLevels` in console
- Progress is stored in browser session (clears on refresh)

## � Security Notes

- **Never commit `.env` files** to public repositories
- Use environment variables for production deployment
- Consider implementing a backend proxy for API calls in production
- The `.gitignore` file prevents accidental `.env` commits

## 📱 Browser Compatibility

- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (responsive design)

## 🚧 Future Enhancements

- [ ] Save game progress to localStorage
- [ ] Multiplayer mode with leaderboards
- [ ] More game modes (Style Transfer, Iteration Challenge)
- [ ] Difficulty settings (3/5/7 word modes)
- [ ] Export prompt improvement report
- [ ] Integration with DALL-E or Midjourney APIs
- [ ] Custom level creator

## 📊 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Image Generation**: Pollinations.ai API (free, no key required)
- **AI Feedback**: Google Gemini API (text generation)
- **Hosting**: Static files (can deploy to GitHub Pages, Netlify, Vercel)
- **Version Control**: Git + GitHub

## 📄 License

This project is for educational purposes. Feel free to modify, extend, and use for learning!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest new game modes or features
- Improve documentation
- Submit pull requests

## � Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the code comments in `script.js`
3. Open a GitHub Issue with details

---

**Enjoy mastering AI prompting!** 🎯✨

Made with ❤️ for AI learners everywhere
