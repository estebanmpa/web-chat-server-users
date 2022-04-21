import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './common/configuration';
import { UsersModule } from './users/users.module';


const modules = [UsersModule];

@Module({
  imports: [
    ...modules,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return { uri: configService.get('database.connectionString') };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule { }
