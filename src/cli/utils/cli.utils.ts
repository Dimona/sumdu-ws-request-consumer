import { performance } from 'perf_hooks';
import { Presets, SingleBar } from 'cli-progress';
import { default as colors } from 'colors';

export class CliUtils {
  static async getScripTime(func: () => void): Promise<number> {
    const timeStart = performance.now();
    await func();
    const timeEnd = performance.now();

    return timeEnd - timeStart;
  }

  static msToStringTime(duration: number, digits = 3): string {
    const milliseconds = Math.round((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const sHours = hours < 10 ? `0${hours}` : hours;
    const sMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const sSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${sHours}:${sMinutes}:${sSeconds}.${milliseconds}`;
  }

  static initProgressbar(color: colors.Color = colors.yellow) {
    return new SingleBar(
      {
        format: ` ${color('{bar}')} ${color('{percentage}% | {value}/{total}')}`,
        barCompleteChar: '\u25A0',
        barIncompleteChar: '-',
      },
      Presets.rect,
    );
  }
}
