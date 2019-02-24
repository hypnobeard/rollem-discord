import { BehaviorBase } from "./behavior-base";
import util from "util";
import { injectable } from "inversify";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";

// TODO: there's got to be a cleaner way to handle this, but this seems to make it more resilient.

/**
 * Causes this client to die when a disconnect event occurs.
 * When supervised, the process should be immediately restarted.
 */
@injectable()
export class DieOnDisconnectBehavior extends BehaviorBase {
  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { super(client, logger); }

  protected register() {
    this.client.on('disconnect', (f) => {
      this.logger.trackEvent("disconnect", { reason: util.inspect(f) });
      this.logger.flush();
      process.exit(1);
    });
  }
}