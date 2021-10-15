export const handleNodeErrors = () => {
  const onError = (err: Error) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  };

  process.on("uncaughtException", onError);
  process.on("unhandledRejection", onError);
};
