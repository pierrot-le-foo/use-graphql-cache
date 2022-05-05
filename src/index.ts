import { ApolloCache } from "@apollo/client";
import { DocumentNode } from "graphql";
import { useCallback, useState } from "react";

interface Arguments<D extends Record<string, any>> {
  query: DocumentNode;
  data?: D;
  cache: ApolloCache<D>;
}

interface ReadCacheOptions {
  cache: ApolloCache<any>;
  query: DocumentNode;
  variables?: Record<string, any>;
}

interface UpdaterOptions {
  increment?: number;
}

type Updater<D extends Record<string, any>> = ((
  data: Partial<Record<keyof D, UpdaterOptions>>
) => void) & {
  increment(args: Partial<Record<keyof D, number>>): any;
};

function readCache({ cache, query, variables }: ReadCacheOptions) {
  try {
    return cache.readQuery({ query, variables });
  } catch (error) {
    return null;
  }
}

function updater(key: string, value: any) {}

export default function useGraphQL<D extends Record<string, any>>({
  query,
  data: originalData,
  cache,
}: Arguments<D>): {
  data: D;
  update: Updater<D>;
} {
  const [data, setData] = useState<D | null>(
    (readCache({ cache, query }) || originalData || null) as D
  );

  const update = () => {};

  update.increment = ((args) => {
    const nextData = { ...data };
    Object.keys(args).forEach((key) => {
      const step = args[key];
      nextData[key] += step;
    });
    cache.writeQuery({
      query,
      variables: {},
      data: nextData,
    });
    setData(nextData as D);
  }) as Updater<D>["increment"];

  return { data: data as D, update };
}
