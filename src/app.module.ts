import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { DateScalar } from './common/scalars/date.scalar';
import { CalendarModule } from './calendar/calendar.module';
import { DoctorModule } from './doctors/doctors.module';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { ProcessorsModule } from './processors/processors.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: 'schema.gql',
      subscription: true,
      graphiql: true,
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_HOST,
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
    ProcessorsModule,
    CalendarModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [DateScalar, AppResolver, AppService],
  exports: [DateScalar, RabbitMQModule],
})
export class AppModule {}
