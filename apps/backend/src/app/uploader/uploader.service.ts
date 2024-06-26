import 'multer';

import dayjs from 'dayjs';
import { ensureDir } from 'fs-extra';
import { randomUUID } from 'node:crypto';
import { createReadStream, existsSync, unlink } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { BackendConfig } from '@2299899-fit-friends/config';
import { AllowedImageFormat, CommonError } from '@2299899-fit-friends/consts';
import { Inject, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UploaderService {
  private readonly DATE_FORMAT = 'YYYY MM';

  constructor(
    @Inject(BackendConfig.KEY)
    private readonly config: ConfigType<typeof BackendConfig>
  ) {}

  private getFileExtension(filename: string): string {
    return filename.split('.').at(-1);
  }

  public getUploadDirectory(): string {
    return this.config.uploadDirectory;
  }

  public getPublicDirectory(): string {
    return this.config.publicDirectory;
  }

  public getSubDirectoryUpload(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  private async getFilePath(filename: string): Promise<string> {
    const uploadPath = join(this.config.uploadDirectory, this.getSubDirectoryUpload());
    await ensureDir(uploadPath);
    return join(uploadPath, filename);
  }

  public async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${randomUUID()}-${file.originalname}`;
    const uploadPath = await this.getFilePath(filename);
    await writeFile(uploadPath, file.buffer);
    return join(this.getSubDirectoryUpload(), filename);
  }

  public async getFile(relativeFilepath: string): Promise<StreamableFile> {
    const filepath = join(this.config.uploadDirectory, relativeFilepath);

    if (!existsSync(filepath)) {
      throw new NotFoundException(`${filepath}: ${CommonError.FileNotFound}`);
    }

    const file = new StreamableFile(createReadStream(filepath));
    return file;
  }

  public async getImageUrl(relativeFilepath: string): Promise<string> {
    const filepath = join(this.config.uploadDirectory, relativeFilepath);

    if (!existsSync(filepath)) {
      throw new NotFoundException(`${filepath}: ${CommonError.FileNotFound}`);
    }

    const extension = this.getFileExtension(relativeFilepath);
    const file = await readFile(filepath);
    return `data:${AllowedImageFormat[extension]};base64,${file.toString('base64')}`;
  }

  public async deleteFile(relativeFilepath: string): Promise<void> {
    const filepath = join(this.config.uploadDirectory, relativeFilepath);

    if (existsSync(filepath)) {
      unlink(filepath, (error) => error);
    }
  }
}
