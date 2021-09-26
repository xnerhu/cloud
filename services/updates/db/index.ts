import seed from "./seed";

const main = async () => {
  console.log("Seeding updates db");

  await seed();
};

main();
