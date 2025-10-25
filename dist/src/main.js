"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
exports.createNestApp = createNestApp;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const server = (0, express_1.default)();
exports.server = server;
let nestApp = null;
async function createNestApp() {
    if (!nestApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
        }));
        if (process.env.LOCAL === 'true') {
            const config = new swagger_1.DocumentBuilder()
                .setTitle('Dokumentasi API CAB DINDIK WILAYAH II')
                .setDescription('Dokumentasi resmi API untuk sistem Backend Cabang Dinas Pendidikan Wilayah II Kabupaten Rejang Lebong')
                .setVersion('1.0')
                .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Bearer token',
            }, 'access-token')
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            server.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(document, {
                customCss: `.topbar { display: none }`,
                swaggerOptions: {
                    docExpansion: 'none',
                    defaultModelsExpandDepth: -1,
                },
            }));
        }
        await app.init();
        nestApp = app;
    }
    return nestApp;
}
if (process.env.LOCAL === 'true') {
    void createNestApp().then(() => {
        const port = Number(process.env.PORT) || 3000;
        server.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    });
}
//# sourceMappingURL=main.js.map