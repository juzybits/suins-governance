export const makeId = (...args: ReadonlyArray<unknown>): string =>
  args.join("-");
