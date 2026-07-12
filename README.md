# unwrap.

An interactive, cinematic birthday card experience built with React, TypeScript, Tailwind CSS, and Framer Motion. 

Allows users to create a personalized link containing the recipient's and sender's names, skip the generator to directly load the surprise, and experience a step-by-step birthday journey.

## Features

- **Personalization Form**: A premium midnight-styled generator screen to configure Recipient and Sender names.
- **Link Sharing**: Generates unique URLs (`?to=Sarah&from=Seenu`) with built-in clipboard copying feedback.
- **Cinematic Prologue**: Welcomes the recipient with custom greeting transitions.
- **Biometric Scanner Simulation**: A press-and-hold fingerprint verification phase featuring vertical lasers, success ring loading, and an emerald-green confirmation pulse.
- **Lucky Balloon Pop**: A vector-based popping game to charge up the party energy.
- **Interactive Blow-Out Wicks**: Cake-blowing wicks reacting to tap signals or sound triggers.
- **Magical Gift Reveal**: A 3D-styled absolute layout containing ribbon drag gestures, lid animations, rising golden stars, and morphing cake icons.
- **Final Message Greeting Card**: A staggered typography layout showing personalized wishes from the sender with replay loops.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS
- **Animations**: Framer Motion
- **Sound System**: Browser Web Audio API (Synthesizing chimes, pops, and fanfares)

## Get Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
