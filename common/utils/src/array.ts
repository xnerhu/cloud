export const substractArrays = (a: number[], b: number[]) =>
  a.map((x, i) => x - b[i]);

/**
 * Returns a copy of an array with swapped items
 */
export const arraySwap = <T = any>(array: T[], src: number, dst: number) => {
  const copy = array.slice();
  const tmp = copy[src];

  copy[src] = copy[dst];
  copy[dst] = tmp;

  return copy;
};
