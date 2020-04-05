import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { BoardGateway } from './board.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppGateway, AppService, BoardGateway]
})
export class AppModule {}
