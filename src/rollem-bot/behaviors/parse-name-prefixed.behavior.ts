import { RollBehaviorBase } from "./roll-behavior-base";
import { RollemParser } from "@language/rollem";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { Injectable } from "injection-js";

/**
 * Parses things with the following prefixes:
 *  - The bot's name
 *  - &
 *  - r
 * 
 * Parses `[inline rolls]`
 */
@Injectable()
export class ParseNamePrefixedBehavior extends RollBehaviorBase {
  constructor(
    parser: RollemParser,
    config: Config,
    client: Client,
    logger: Logger,
  ) { super(parser, config, client, logger); }

  protected register() {
    // TODO: Split this up. Combine common bail rules.
    // inline and convenience messaging
    this.client.on('message', message => {
      // avoid doing insane things
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }

      var content = message.content.trim();

      // ignore the dice requirement with name prefixed strings
      var match = content.match(this.config.mentionRegex);
      if (match) {
        var subMessage = content.substring(match[0].length);
        let hasPrefix = true;
        let requireDice = false;
        var lines = this.rollMany(subMessage, hasPrefix, requireDice);
        var replied = this.replyAndLog(message, 'name-prefixed parse', lines);
      }
    });
  }
}