import NeuralHero from "./components/hero/NeuralHero.jsx";
import ArthurSections from "./components/sections/ArthurSections.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import arthurBresson from "./data/arthurBresson.js";

// Page unique : la hero (réseau de neurones) forme elle-même la navbar en
// bulles au scroll, il n'y a donc ni routeur ni navbar séparée.
function App() {
  return (
    <div className="ab-page">
      <NeuralHero profile={arthurBresson} />
      <ArthurSections profile={arthurBresson} />
      <ScrollToTop />
    </div>
  );
}

export default App;
