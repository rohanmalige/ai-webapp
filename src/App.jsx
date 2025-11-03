//I used reactbits to get my dynamic background https://reactbits.dev/backgrounds/color-bends
import "./index.css";
import ColorBends from "./components/ColorBends";
import TextType from './components/TextType';
function App() {
  return (
    <div className="app-container">
      {/* Animated background */}
      <div className="Background">
        <ColorBends
          colors={["#ff5c7a", "#ffff14ff", "#0044ffff"]}
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

      {/* Centered content */}
      <div className="app-content">
        <TextType 
          text={["Chat with our AI assistant."]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />

        <div className="button-group">
          <button className="hover-border">Chat Now</button>
          <button className="hover-border dark">Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default App;
