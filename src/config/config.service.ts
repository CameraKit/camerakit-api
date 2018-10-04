import * as Joi from 'joi';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    let config;
    if(fs.existsSync(filePath)) { // Look for the specified file first
      config = dotenv.parse(fs.readFileSync(filePath));
    } else { // Fallback to checking if they are defined in the process.env already
      config = [
        'TYPEORM_CONNECTION',
        'TYPEORM_HOST',
        'TYPEORM_USERNAME',
        'TYPEORM_PASSWORD',
        'TYPEORM_DATABASE',
        'TYPEORM_PORT',
        'TYPEORM_SYNCHRONIZE',
        'TYPEORM_LOGGING',
        'TYPEORM_ENTITIES',
        'SERVER_PORT',
        'ALLOWED_ORIGINS',
        'ALLOWED_METHODS',
        'PASSPORT_AUTH_SECRET',
        'STRIPE_PUBLISHABLE_API_KEY',
        'STRIPE_SECRET_API_KEY',
        'AWS_SES_ACCESS_KEY_ID',
        'AWS_SES_SECRET_ACCESS_KEY',
        'AWS_SES_REGION'
      ].reduce((acc, val) => (acc[val] = process.env[val], acc), {});
    }
    this.envConfig = this.validateInput(config);
  }

  // Check if the incoming object conforms to rules. Omission of 
  // required() variables will not let the app function correctly
  // and will throw an error
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      TYPEORM_CONNECTION: Joi.string().default('postgres'),
      TYPEORM_HOST: Joi.string().required(),
      TYPEORM_USERNAME: Joi.string().required(),
      TYPEORM_PASSWORD: Joi.string().required(),
      TYPEORM_DATABASE: Joi.string().default('postgres'),
      TYPEORM_PORT: Joi.number().default(5432),
      TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
      TYPEORM_LOGGING: Joi.boolean().default(true),
      TYPEORM_ENTITIES: Joi.string().default('src/**/*.entity.ts'),
      SERVER_PORT: Joi.number().default(3001),
      ALLOWED_ORIGINS: Joi.string().required(),
      ALLOWED_METHODS: Joi.string().required(),
      PASSPORT_AUTH_SECRET: Joi.string().required(),
      STRIPE_PUBLISHABLE_API_KEY: Joi.string().required(),
      STRIPE_SECRET_API_KEY: Joi.string().required(),
      AWS_SES_ACCESS_KEY_ID: Joi.string().required(),
      AWS_SES_SECRET_ACCESS_KEY: Joi.string().required(),
      AWS_SES_REGION: Joi.string().required()
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