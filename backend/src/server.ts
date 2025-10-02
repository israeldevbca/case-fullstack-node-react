import { buildApp } from "./app";
const port = Number(process.env.PORT) || 3001;
buildApp().then(app => app.listen({ port, host: "0.0.0.0" }));
