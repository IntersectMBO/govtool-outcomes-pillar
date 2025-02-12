import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*", 
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Authorization,Content-Type",
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap().then();
