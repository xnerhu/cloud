import { capitalizeFirstLetter } from "@common/utils";

export const getOSEmoji = (os: string) => {
  switch (os) {
    case "windows":
      return "🪟";
    case "macos":
      return "🍏";
    case "linux":
      return "🐧";
  }

  return "";
};

export const formatPlatform = (os: string) => {
  if (os === "macos") {
    return "macOS";
  }

  return capitalizeFirstLetter(os);
};
