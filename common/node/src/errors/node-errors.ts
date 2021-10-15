export const handleNodeErrors = () => {
  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err}`);
    process.exit(1);
  });
};
