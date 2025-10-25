import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
declare const server: import("express-serve-static-core").Express;
export declare function createNestApp(): Promise<INestApplication<any>>;
export { server };
