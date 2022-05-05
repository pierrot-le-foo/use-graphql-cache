# use-graphql-cache

React hook around apollo cache.

```jsx
import { gql, ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { buildSchema } from "graphql";
import SchemaLink from "apollo-schema-link";

const cache = new InMemoryCache();

const schema = buildSchema(`
  type Query {
    counter: Int!
  }
`);

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

import useGraphQLCache from "use-graphql-cache";
import { gql, useApolloClient } from "@apollo/client";

const query = gql`
  query {
    counter
  }
`;

function Counter() {
  const { cache } = useApolloClient();

  const {
    data: { counter },
    update,
  } = useGraphQLCache({ cache, query, data: { counter: 0 } });

  return (
    <button onClick={() => update({ counter: { increment: 1 } })}>
      {counter}
    </button>
  );
}

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/userEvent";

describe("Counter", () => {
  beforeAll(() => {
    render(<Counter />);
  });

  afterAll(cleanup)

  it("should have counter equals 0", () => {
    expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument();
  });

  it("should click on button", async () => {
    await userEvent.click(screen.getByRole("button"));
  });

  it("should have counter equals 1", () => {
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
  });
});
```
