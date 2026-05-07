export type FirebaseObj<T = Record<string, any>> = {
  [key: string]: T;
};

export const handleObj = <T extends Record<string, any>>(
  obj: FirebaseObj<T> | null,
): Array<T & { id: string }> => {
  if (!obj) {
    return [];
  }

  return Object.entries(obj).map(
    ([id, fields]) => ({ id, ...fields }) as T & { id: string },
  );
};

export const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
