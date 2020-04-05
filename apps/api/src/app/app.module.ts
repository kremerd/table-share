import { Module } from '@nestjs/common';
import { BoardGateway } from './board.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [BoardGateway]
})
export class AppModule {}
