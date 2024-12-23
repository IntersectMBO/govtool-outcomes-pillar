import "./index.scss";

export type AppProps = {
  description: string;
};
function App({ description }: AppProps) {
  return (
    <div
      className="App"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <h1>govtool-outcomes-pillar-ui hel</h1>
      <p>{description}</p>
    </div>
  );
}

export default App;
