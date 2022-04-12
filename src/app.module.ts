import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONNECTION_STRING } from './common/config';
import { UsersModule } from './users/users.module';


const modules = [UsersModule];

@Module({
  imports: [
    ...modules,
    MongooseModule.forRoot(MONGO_CONNECTION_STRING)
  ],
})
export class AppModule { }
