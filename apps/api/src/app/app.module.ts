import { Module } from '@nestjs/common';
import { BoardGateway } from './board.gateway';
import { FilesController } from './files.controller';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [BoardGateway]
})
export class AppModule {}
