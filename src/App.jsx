import useLenis from "./hooks/useLenis";
import TelescopeScene from "./components/TelescopeScene";
import "./App.css";

function App() {
  const lenisRef = useLenis();

  return (
    <div className="app">
      <TelescopeScene lenisRef={lenisRef} />
    </div>
  );
}

export default App;
