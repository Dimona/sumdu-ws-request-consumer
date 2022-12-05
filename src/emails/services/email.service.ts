import { Injectable } from '@nestjs/common';
import fs from 'fs';
import Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  compile<Placeholders extends Record<string, any>>(path: string, placeholders?: Placeholders): string {
    const source = fs.readFileSync(path, 'utf8');

    if (!source) {
      throw new Error(`File not found: ${path}`);
    }

    return Handlebars.compile(source)(placeholders);
  }
}
