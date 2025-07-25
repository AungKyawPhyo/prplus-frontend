import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// ⛔ Old local backend
// const httpLink = createHttpLink({
//   uri: "http://localhost:8000/graphql",
// });

// ✅ Render backend URL
const httpLink = createHttpLink({
  uri: "https://prplus-backend.onrender.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;