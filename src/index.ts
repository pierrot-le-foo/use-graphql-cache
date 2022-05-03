import { DocumentNode } from "graphql";
import { useCallback, useState } from "react";

interface Arguments<D extends Record<string, any>> {
  query: DocumentNode;
  data?: D;
}

interface Updater<D extends Record<string, any>> {
  filter?: Partial<D>;
  setter?: Partial<D>;
}

export default function useGraphQL<D extends Record<string, any>>({
  query,
  data: originalData,
}: Arguments<D>): {
  data: D;
  update: (data: Partial<Record<keyof D, Updater<D>>>) => void;
} {
  const [data, setData] = useState<D | null>(originalData || null);

  const update = useCallback(() => {}, [data]);

  return { data: data as D, update };
}
