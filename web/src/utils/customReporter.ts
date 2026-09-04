import { Reporter } from '@playwright/test/reporter';

export default class CustomReporter implements Reporter {
  onStdOut(chunk: string | Buffer): void {
    process.stdout.write(chunk);
  }

  onStdErr(chunk: string | Buffer): void {
    process.stderr.write(chunk);
  }
}
