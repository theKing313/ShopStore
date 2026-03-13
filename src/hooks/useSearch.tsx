import { useMemo, useState } from "react";
import useDebounce from "./useDebounce";

export default function useSearch<T extends { name: string }>(items: T[]) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return items;

    return items.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [items, debouncedSearch]);

  return {
    search,
    setSearch,
    filteredProducts,
  };
}
