# Golf Course Architect AI

**Golf Course Architect AI** is a modern, AI-powered web application that helps users visualize golf course designs on any landscape. Built with React, Vite, and Google's Gemini AI, it offers a seamless experience for exploring various architectural styles and getting personalized design recommendations.

## ✨ Features

- **Gemini 3 Visual Intelligence**: Uses the latest Gemini 3 model for precise landscape analysis and hyper-realistic golf course rendering.
- **Real-time "Thinking" Engine**: See the AI's internal reasoning process in real-time as it crafts your new course design.
- **Interactive Style Selection**: Instantly switch between curated golf course styles like Parkland, Links, Sandbelt, and Desert.
- **Refinement Suite**: Fine-tune your results with natural language instructions or reference design elements.
- **Session History**: Keep track of all your transformations in a persistent local collection.

## 📸 Screenshots

### Application Interface
![Golf Course Architect AI UI](public/images/optimized/ui-screenshot.jpg)

### Sample Designs
<div align="center">
  <img src="public/images/optimized/women/wolf-cut-balayage.jpg" width="30%" alt="Parkland Style" />
  <img src="public/images/optimized/men/modern-mullet.jpg" width="30%" alt="Links Style" />
  <img src="public/images/optimized/women/glass-bob.jpg" width="30%" alt="Sandbelt Style" />
</div>

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **AI Integration**: Google Generative AI (Gemini 3 Pro + Flash Lite)
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/flyinmryan/golf-course-architect-ai.git
   cd golf-course-architect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📄 License

This project is licensed under the MIT License.

---
