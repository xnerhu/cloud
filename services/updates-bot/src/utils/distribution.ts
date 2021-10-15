export const getOSEmoji = (os: string) => {
  switch (os) {
    case "windows":
      return "🪟";
    case "apple":
      return "🍏";
    case "linux":
      return "🐧";
  }

  return "";
};
