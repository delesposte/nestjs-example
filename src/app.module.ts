import { Module } from '@nestjs/common';
import { FormatoModule } from './formato/formato.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    FormatoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
