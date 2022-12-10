import { Injectable } from '@nestjs/common';
import fs from 'fs';
import Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  render<Placeholders extends Record<string, any>>(path: string, placeholders?: Placeholders): string {
    return this.compile(path)(placeholders);
  }

  compile(path: string): HandlebarsTemplateDelegate {
    const source = fs.readFileSync(path, 'utf8');

    if (!source) {
      throw new Error(`File not found: ${path}`);
    }

    return Handlebars.compile(source);
  }
}
