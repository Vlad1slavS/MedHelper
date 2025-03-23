import "./App.css";
import Chat from "./components/Chat";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <>
      <div className="container">
        <TopBar></TopBar>
        <Chat></Chat>
      </div>
    </>
  );
}
