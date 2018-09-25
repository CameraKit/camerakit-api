import * as Joi from 'joi';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      TYPEORM_CONNECTION: Joi.string().default('postgres'),
      TYPEORM_URL: Joi.string(),
      TYPEORM_ENTITIES: Joi.string().default('src/**/*.entity.ts'),
      TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
      TYPEORM_DATABASE: Joi.string().default('postgres'),
      SERVER_PORT: Joi.number().default(3001),
      PASSPORT_AUTH_SECRET: Joi.string(),
      STRIPE_PUBLISHABLE_API_KEY: Joi.string(),
      STRIPE_SECRET_API_KEY: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get typeormConnection(): string {
    return String(this.envConfig.TYPEORM_CONNECTION);
  }
  get typeormUrl(): string {
    return String(this.envConfig.TYPEORM_URL);
  }
  get typeormEntities(): string {
    return String(this.envConfig.TYPEORM_ENTITIES);
  }
  get typeormSynchronize(): boolean {
    return Boolean(this.envConfig.TYPEORM_SYNCHRONIZE);
  }
  get serverPort(): number {
    return Number(this.envConfig.SERVER_PORT);
  }
  get passportAuthSecret(): string {
    return String(this.envConfig.PASSPORT_AUTH_SECRET);
  }
  get stripePublishableApiKey(): string {
    return String(this.envConfig.STRIPE_PUBLISHABLE_API_KEY);
  }
  get stripeSecretApiKey(): string {
    return String(this.envConfig.STRIPE_SECRET_API_KEY);
  }
}