const COLORS_CHANNELS: Record<string, string> = {
  alpha: "#8118bf",
  beta: "#00a6ff",
  stable: "#67ea76",
  none: "#d32f2f",
};

export const getChannelColor = (channel: string) => {
  return COLORS_CHANNELS[channel] || COLORS_CHANNELS["none"];
};
