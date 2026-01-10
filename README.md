# Prompt Mirror - AI Image Prompt Game

**See → Decode → Recreate**

An interactive web game where players observe AI-generated images, extract key words, and see how AI recreates the image from their descriptions.

## 🎮 Game Modes

### Level 1-3: Core Prompt Mirror
Learn the basics of AI prompting by describing images with exactly 5 words.

### Level 4-6: Blind Prompt Mode
Memorize the image in limited time, then describe it from memory only.

### Level 7-9: Emotion-Only Mode
Describe images using ONLY emotional words - no objects or nouns allowed.

### Level 10-12: Bias Spotter Mode
Identify where AI adds assumptions and stereotypes that weren't in the original prompt.

## 🚀 Getting Started

### 1. Open the Game
Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari).

### 2. Play Locally
No server required! The game runs entirely in your browser.

```bash
# Just open the file
start index.html  # Windows
open index.html   # Mac
xdg-open index.html  # Linux
```

### 3. Or Use Live Server
For development, you can use VS Code's Live Server extension:
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

## 🔑 API Integration

The game currently uses **placeholder images** for demonstration. To enable real AI image generation:

### Option 1: Use DALL-E API (Recommended)
1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Replace the `generateInitialImage()` function in `script.js`:

```javascript
async function generateInitialImage(prompt) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        })
    });
    
    const data = await response.json();
    gameState.originalImage = data.data[0].url;
    document.getElementById('original-image').src = gameState.originalImage;
    showScreen('observation-screen');
}
```

### Option 2: Use Stable Diffusion API
1. Get an API key from [Stability AI](https://platform.stability.ai/)
2. Update the API calls accordingly

### Option 3: Use Local Stable Diffusion
1. Run Stable Diffusion locally with API enabled
2. Point the fetch requests to `http://localhost:7860/api/`

## 🎨 Design Theme

- **Background**: White with cyan (#022c3a) shading
- **Primary Color**: Cyan (#022c3a)
- **Secondary Color**: Light Cyan (#00acc1)
- **Accents**: White backgrounds with gradient overlays

## 📁 File Structure

```
module_2_activity_2/
├── index.html      # Main game structure (19 screens)
├── style.css       # White/cyan themed styling
├── script.js       # Game logic and API integration
└── README.md       # This file
```

## 🎯 Features

✅ 12 Progressive Levels  
✅ 4 Unique Game Modes  
✅ Blind Mode Timer (10s, 8s, 6s)  
✅ Emotion-Only Validation  
✅ Bias Detection System  
✅ Progress Tracking  
✅ Skills Unlocking  
✅ Responsive Design  
✅ Beautiful Animations  

## 🔧 Customization

### Change Level Prompts
Edit the `levelConfig` object in `script.js`:

```javascript
const levelConfig = {
    1: { mode: 'core', prompt: 'Your custom prompt here', difficulty: 'easy' },
    // ... add more levels
};
```

### Adjust Timer Durations
Modify the `viewTime` property for blind mode levels:

```javascript
4: { mode: 'blind', prompt: '...', viewTime: 15 }, // 15 seconds instead of 10
```

### Change Color Scheme
Edit the CSS variables in `style.css`:

```css
/* Change these colors */
#022c3a → Your primary color
#00acc1 → Your secondary color
#e0f7fa → Your light accent
```

## 🎓 Learning Outcomes

Players will learn:
- How to write effective AI image prompts
- The importance of specific keywords
- How AI interprets emotional language
- Common biases in AI image generation
- The gap between description and recreation

## 🐛 Known Limitations

- Currently uses placeholder images (requires API integration for real generation)
- Google Gemini API key provided is for text generation, not image generation
- For production use, implement proper API key security (use backend proxy)

## 🚧 Future Enhancements

- [ ] Real-time image generation with DALL-E or Stable Diffusion
- [ ] Multiplayer mode
- [ ] Leaderboard system
- [ ] Save/load game progress
- [ ] More game modes (Style Transfer, Iteration Mode)
- [ ] AI-powered feedback on prompt quality

## 📝 Notes on API Key

The provided API key (`AIzaSyDRTLt6DaexbKZre6owW41-ggXusFa7zxg`) is for Google's Gemini API, which is primarily for **text generation**, not image generation.

For actual image generation, you'll need:
- **OpenAI DALL-E**: Best quality, paid API
- **Stable Diffusion**: Open source, free options available
- **Midjourney**: High quality, Discord-based

## 🎮 How to Play

1. **Observe** - Look carefully at the AI-generated image
2. **Extract** - Identify exactly 5 key words
3. **Generate** - AI recreates the image from your words
4. **Compare** - See what was preserved and what was lost
5. **Learn** - Understand how AI interprets your prompts

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License

This project is for educational purposes. Feel free to modify and extend!

---

**Enjoy playing Prompt Mirror!** 🎯✨
