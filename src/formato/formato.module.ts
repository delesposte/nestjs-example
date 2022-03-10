import { Module } from '@nestjs/common';
import { FormatoService } from './formato.service';
import { FormatoController } from './formato.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formato } from './entities/formato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formato])],
  controllers: [FormatoController],
  providers: [FormatoService],
})
export class FormatoModule {}
