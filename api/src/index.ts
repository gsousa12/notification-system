import { environment } from "./configurations/global-configs";
import { buildApp } from "./server";

const app = buildApp();

const start = async () => {
  try {
    await app.listen({ port: environment.port });
    console.log(`Server running on http://localhost:${environment.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
