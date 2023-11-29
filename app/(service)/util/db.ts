export const textArray = (arr: string[]) => {
  return `{${arr.map((element) => `"${element}"`).join(',')}}`;
};
