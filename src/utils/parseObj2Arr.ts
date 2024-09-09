// parseObj2Arr
export const parseObj2Arr = <T>(obj: Record<string, T>) => {
  return Object.entries(obj).map(([key, value]) => {
    return {
      key,
      ...value
    };
  });
};
