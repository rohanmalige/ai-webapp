//I used reactbits to get my dynamic background https://reactbits.dev/backgrounds/color-bends

import { useState } from "react";
import ColorBends from "./components/ColorBends";
import TextType from "./components/TextType";
import ChatBox from "./components/ChatBox";
import "./index.css";

function App() {
  return (
    <div className="app-container">
      {/* Background animation */}
      <div className="Background">
        <ColorBends
          colors={["#f6002dff", "#ffff00ff", "#002487ff","#610489ff"]}
          rotation={45}
          speed={0.3}
          scale={1.2}
          frequency={1.4}
          warpStrength={1}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
        />
      </div>

      {/* Foreground content */}
      <div className="foreground chat-active">

        <div className="heading-section">
          <TextType
            text={["Chat with our AI assistant."]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            startOnVisible={false}
          />
        </div>

        {/* Floating chat box */}
        <ChatBox />
      </div>
    </div>
  );
}

export default App;