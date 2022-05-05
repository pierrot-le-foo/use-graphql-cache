# use-graphql-cache

React hook around apollo cache.

```jsx
import React from "react";
import {
  gql,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useApolloClient,
  ApolloCache,
} from "@apollo/client";
import { buildSchema } from "graphql";

import useGraphQLCache from "use-graphql-cache";

import "@testing-library/react/dont-cleanup-after-each";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SchemaLink from "apollo-schema-link";

type Int = number;

interface Query {
  counter: Int;
}

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
  const { cache } = useApolloClient();

  const {
    data: { counter },
    update,
  } = useGraphQLCache<Pick<Query, "counter">>({
    cache: cache as ApolloCache<Pick<Query, "counter">>,
    query,
    data: { counter: 0 },
  });

  return (
    <button onClick={() => update.increment({ counter: 1 })}>{counter}</button>
  );
}

describe("Counter", () => {
  beforeAll(() => {
    render(<App />);
  });

  afterAll(cleanup);

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
