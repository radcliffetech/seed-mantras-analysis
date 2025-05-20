import "./tailwind.css";

import { ApolloProvider } from "@apollo/client";
import App from "./App";
import ReactDOM from "react-dom/client";
import { client } from "./apollo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
