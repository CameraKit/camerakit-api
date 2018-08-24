import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { ProductModule } from './products/product.module';

@Module({
  imports: [TypeOrmModule.forRoot(), GraphQLModule, UserModule, AuthModule, ProductModule], // get config from ormconfig.json,
})

export class AppModule {
  constructor(private readonly connection: Connection, private readonly graphQLFactory: GraphQLFactory) { }

  configureGraphQl(app: any, path: string) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    const schema = this.graphQLFactory.createSchema({ typeDefs });

    const server = new ApolloServer({ schema });
    server.applyMiddleware({ app, path });
  }
}
