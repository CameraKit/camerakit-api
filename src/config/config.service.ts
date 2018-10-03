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
      TYPEORM_HOST: Joi.string(),
      TYPEORM_USERNAME: Joi.string(),
      TYPEORM_PASSWORD: Joi.string(),
      TYPEORM_DATABASE: Joi.string().default('postgres'),
      TYPEORM_PORT: Joi.number().default(5432),
      TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
      TYPEORM_LOGGING: Joi.boolean().default(true),
      TYPEORM_ENTITIES: Joi.string().default('src/**/*.entity.ts'),
      SERVER_PORT: Joi.number().default(3001),
      ALLOWED_ORIGINS: Joi.string(),
      ALLOWED_METHODS: Joi.string(),
      PASSPORT_AUTH_SECRET: Joi.string(),
      STRIPE_PUBLISHABLE_API_KEY: Joi.string(),
      STRIPE_SECRET_API_KEY: Joi.string(),
      AWS_SES_ACCESS_KEY_ID: Joi.string(),
      AWS_SES_SECRET_ACCESS_KEY: Joi.string(),
      AWS_SES_REGION: Joi.string()
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

  get databaseConfig(): object {
    return {
      type: this.typeormConnection,
      host: this.typeormHost,
      port: this.typeormPort,
      username: this.typeormUsername,
      password: this.typeormPassword,
      database: this.typeormDatabase,
      synchronize: this.typeormSynchronize,
      logging: this.typeormLogging,
      entities: [this.typeormEntities],
      extra: {
        ssl: true,
      },
    }
  }
  get typeormConnection(): string {
    return String(this.envConfig.TYPEORM_CONNECTION);
  }
  get typeormHost(): string {
    return String(this.envConfig.TYPEORM_HOST);
  }
  get typeormUsername(): string {
    return String(this.envConfig.TYPEORM_USERNAME);
  }
  get typeormPassword(): string {
    return String(this.envConfig.TYPEORM_PASSWORD);
  }
  get typeormDatabase(): string {
    return String(this.envConfig.TYPEORM_DATABASE);
  }
  get typeormPort(): number {
    return Number(this.envConfig.TYPEORM_PORT);
  }
  get typeormSynchronize(): boolean {
    return Boolean(this.envConfig.TYPEORM_SYNCHRONIZE);
  }
  get typeormLogging(): boolean {
    return Boolean(this.envConfig.TYPEORM_LOGGING);
  }
  get typeormEntities(): string {
    return String(this.envConfig.TYPEORM_ENTITIES);
  }
  get serverPort(): number {
    return Number(this.envConfig.SERVER_PORT);
  }
  get allowedOrigins(): Array<string> {
    return this.envConfig.ALLOWED_ORIGINS.split(',').map(_=>_.trim());
  }
  get allowedMethods(): string {
    return String(this.envConfig.ALLOWED_METHODS);
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
  get awsSesAccessKey(): string {
    return String(this.envConfig.AWS_SES_ACCESS_KEY_ID);
  }
  get awsSesSecretAccessKey(): string {
    return String(this.envConfig.AWS_SES_SECRET_ACCESS_KEY);
  }
  get awsSesRegion(): string {
    return String(this.envConfig.AWS_SES_REGION);
  }
}