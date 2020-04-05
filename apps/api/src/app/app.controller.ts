import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { Message } from '@table-share/api-interfaces';
import { AppService } from './app.service';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('message')
  getMessage(): Message {
    return this.appService.getData();
  }

  @Put('message')
  @HttpCode(204)
  setMessage(@Body() message: Message): void {
    return this.appService.setData(message);
  }
}
