type callFn = (...args: any[]) => Promise<any>;

/**
 *
 * The callback will be called at 0 time
 */
class SmartAsyncInterval {
  callBack: callFn;
  delayMs: number;
  running: boolean;

  constructor(callBack: callFn, delayMs: number) {
    this.callBack = callBack;
    this.delayMs = delayMs;
    this.running = false;
  }

  async cycle() {
    await this.callBack();
    await this.delay(this.delayMs);
    if (this.running) this.cycle();
  }

  delay(ms: number) {
    return new Promise((res) => setTimeout(() => res(true), ms));
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.cycle();
  }

  stop() {
    if (this.running) this.running = false;
  }
}

export default SmartAsyncInterval;
