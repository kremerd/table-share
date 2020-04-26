import { Controller, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE } from '@table-share/api-interfaces';
import { generateRandomId } from '@table-share/util';
import { Response } from 'express';
import { MulterFile } from './multer-file';

@Controller('/files')
export class FilesController {

  files = new Map<string, MulterFile>();

  @Get(':id')
  getFile(@Param('id') id: string, @Res() res: Response): void {
    const file = this.files.get(id);
    if (file) {
      res.contentType(file.mimetype)
        .end(file.buffer);
    } else {
      res.sendStatus(404);
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 100))
  uploadFile(@UploadedFiles() files: MulterFile[]): number[] {
    return files.map(file => this.saveFileAndReturnId(file));
  }

  private saveFileAndReturnId(file: MulterFile): number {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Maximum file size exceeded');
    }

    const id = generateRandomId();
    this.files.set('' + id, file);
    return id;
  }

}
