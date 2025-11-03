//I used reactbits to get my dynamic background https://reactbits.dev/backgrounds/color-bends
import ColorBends from "./components/ColorBends";
import "./index.css";

function App() {
  return (
    <div className="app-container">
      {/* Background */}
      <div className="Background">
        <ColorBends
          colors={["#ff5c7a", "#ffff14ff", "#00fff7ff","#001affff","#00ff44ff"]}
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

      {/* Centered box */}
      <div className="app-content">
        <h1>Welcome </h1>
        <p style={{ textAlign: "center", color: "#333" }}>
          layout with dynamic background. pretty cool
        </p>
      </div>
    </div>
  );
}

export default App;
