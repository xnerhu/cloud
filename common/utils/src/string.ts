const HASH_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const makeId = (length = 12) => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += HASH_CHARACTERS.charAt(
      Math.floor(Math.random() * HASH_CHARACTERS.length),
    );
  }

  return result;
};

export const capitalizeFirstLetter = (str: string) => {
  return str[0].toUpperCase() + str.substring(1).toLowerCase();
};

export const replaceAll = (
  str: string,
  find: string,
  replace: string,
  options = "gi",
) => {
  find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(find, options), replace);
};

export const hashCode = (str: string) => {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return hash;
};
