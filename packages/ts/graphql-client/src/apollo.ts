import { ApolloClient, InMemoryCache } from "@apollo/client";

const GRAPHQL_API_URL =
  import.meta.env.VITE_GRAPHQL_API_URL || "http://localhost:8000/graphql";

if (!GRAPHQL_API_URL) {
  throw new Error("VITE_GRAPHQL_API_URL is not defined");
}
export const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache(),
});
