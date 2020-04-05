import { Injectable } from '@nestjs/common';
import { Message } from '@table-share/api-interfaces';

@Injectable()
export class AppService {
  private message: string = 'Welcome to api!';

  getData(): Message {
    return { message: this.message };
  }

  setData(message: Message): void {
    this.message = message.message;
  }
}
