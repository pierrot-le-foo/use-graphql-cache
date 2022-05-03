# use-graphql

React hook around apollo cache

```jsx
import { gql, ApolloClient, ApolloProvider } from "@apollo/client";
import { buildSchema } from "graphql";
import useGraphQLCache from "use-graphql-cache";

const cache = new InMemoryCache();

const schema = buildSchema(`
  type Query {
    counter: Int!
  }
`);

const query = gql`
  query {
    counter
  }
`;

const client = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Counter />
    </ApolloProvider>
  );
}

function Counter() {
  const {
    data: { counter },
    update,
  } = useGraphQLCache({ query, data: { counter: 0 } });

  return (
    <button onClick={() => update({ counter: { increment: 1 } })}>
      {counter}
    </button>
  );
}
```
