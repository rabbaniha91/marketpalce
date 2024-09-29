const uncaughError = () => {
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGH EXCEPTION Shuting down ...");
    console.log(err.name + " " + err.message);
    process.exit(1);
  });
};

const unhandledError = (server) => {
  process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection shuting down ...");
    console.log(err.name + " " + err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};
