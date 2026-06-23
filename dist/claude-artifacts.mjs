#!/usr/bin/env node
import { createRequire as __createRequire } from 'node:module';
const require = __createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports) {
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message2) {
        super(message2);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message2) {
        super(1, "commander.invalidArgument", message2);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports.CommanderError = CommanderError2;
    exports.InvalidArgumentError = InvalidArgumentError2;
  }
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.endsWith("...")) {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _collectValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        previous.push(value);
        return previous;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._collectValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports.Argument = Argument2;
    exports.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.minWidthToWrap = 40;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
       * and just before calling `formatHelp()`.
       *
       * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
       *
       * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
       */
      prepareContext(contextOptions) {
        this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description)
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description)
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args ? " " + args : "");
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleSubcommandTerm(helper.subcommandTerm(command))
            )
          );
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleArgumentTerm(helper.argumentTerm(argument))
            )
          );
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          const extraDescription = `(${extraInfo.join(", ")})`;
          if (option.description) {
            return `${option.description} ${extraDescription}`;
          }
          return extraDescription;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
          );
        }
        if (extraInfo.length > 0) {
          const extraDescription = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescription}`;
          }
          return extraDescription;
        }
        return argument.description;
      }
      /**
       * Format a list of items, given a heading and an array of formatted items.
       *
       * @param {string} heading
       * @param {string[]} items
       * @param {Help} helper
       * @returns string[]
       */
      formatItemList(heading, items, helper) {
        if (items.length === 0) return [];
        return [helper.styleTitle(heading), ...items, ""];
      }
      /**
       * Group items by their help group heading.
       *
       * @param {Command[] | Option[]} unsortedItems
       * @param {Command[] | Option[]} visibleItems
       * @param {Function} getGroup
       * @returns {Map<string, Command[] | Option[]>}
       */
      groupItems(unsortedItems, visibleItems, getGroup) {
        const result = /* @__PURE__ */ new Map();
        unsortedItems.forEach((item) => {
          const group = getGroup(item);
          if (!result.has(group)) result.set(group, []);
        });
        visibleItems.forEach((item) => {
          const group = getGroup(item);
          if (!result.has(group)) {
            result.set(group, []);
          }
          result.get(group).push(item);
        });
        return result;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth ?? 80;
        function callFormatItem(term, description) {
          return helper.formatItem(term, termWidth, description, helper);
        }
        let output = [
          `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
          ""
        ];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.boxWrap(
              helper.styleCommandDescription(commandDescription),
              helpWidth
            ),
            ""
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return callFormatItem(
            helper.styleArgumentTerm(helper.argumentTerm(argument)),
            helper.styleArgumentDescription(helper.argumentDescription(argument))
          );
        });
        output = output.concat(
          this.formatItemList("Arguments:", argumentList, helper)
        );
        const optionGroups = this.groupItems(
          cmd.options,
          helper.visibleOptions(cmd),
          (option) => option.helpGroupHeading ?? "Options:"
        );
        optionGroups.forEach((options, group) => {
          const optionList = options.map((option) => {
            return callFormatItem(
              helper.styleOptionTerm(helper.optionTerm(option)),
              helper.styleOptionDescription(helper.optionDescription(option))
            );
          });
          output = output.concat(this.formatItemList(group, optionList, helper));
        });
        if (helper.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return callFormatItem(
              helper.styleOptionTerm(helper.optionTerm(option)),
              helper.styleOptionDescription(helper.optionDescription(option))
            );
          });
          output = output.concat(
            this.formatItemList("Global Options:", globalOptionList, helper)
          );
        }
        const commandGroups = this.groupItems(
          cmd.commands,
          helper.visibleCommands(cmd),
          (sub) => sub.helpGroup() || "Commands:"
        );
        commandGroups.forEach((commands, group) => {
          const commandList = commands.map((sub) => {
            return callFormatItem(
              helper.styleSubcommandTerm(helper.subcommandTerm(sub)),
              helper.styleSubcommandDescription(helper.subcommandDescription(sub))
            );
          });
          output = output.concat(this.formatItemList(group, commandList, helper));
        });
        return output.join("\n");
      }
      /**
       * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
       *
       * @param {string} str
       * @returns {number}
       */
      displayWidth(str) {
        return stripColor(str).length;
      }
      /**
       * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
       *
       * @param {string} str
       * @returns {string}
       */
      styleTitle(str) {
        return str;
      }
      styleUsage(str) {
        return str.split(" ").map((word) => {
          if (word === "[options]") return this.styleOptionText(word);
          if (word === "[command]") return this.styleSubcommandText(word);
          if (word[0] === "[" || word[0] === "<")
            return this.styleArgumentText(word);
          return this.styleCommandText(word);
        }).join(" ");
      }
      styleCommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleOptionDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleSubcommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleArgumentDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleDescriptionText(str) {
        return str;
      }
      styleOptionTerm(str) {
        return this.styleOptionText(str);
      }
      styleSubcommandTerm(str) {
        return str.split(" ").map((word) => {
          if (word === "[options]") return this.styleOptionText(word);
          if (word[0] === "[" || word[0] === "<")
            return this.styleArgumentText(word);
          return this.styleSubcommandText(word);
        }).join(" ");
      }
      styleArgumentTerm(str) {
        return this.styleArgumentText(str);
      }
      styleOptionText(str) {
        return str;
      }
      styleArgumentText(str) {
        return str;
      }
      styleSubcommandText(str) {
        return str;
      }
      styleCommandText(str) {
        return str;
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      /**
       * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
       *
       * @param {string} str
       * @returns {boolean}
       */
      preformatted(str) {
        return /\n[^\S\r\n]/.test(str);
      }
      /**
       * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
       *
       * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
       *   TTT  DDD DDDD
       *        DD DDD
       *
       * @param {string} term
       * @param {number} termWidth
       * @param {string} description
       * @param {Help} helper
       * @returns {string}
       */
      formatItem(term, termWidth, description, helper) {
        const itemIndent = 2;
        const itemIndentStr = " ".repeat(itemIndent);
        if (!description) return itemIndentStr + term;
        const paddedTerm = term.padEnd(
          termWidth + term.length - helper.displayWidth(term)
        );
        const spacerWidth = 2;
        const helpWidth = this.helpWidth ?? 80;
        const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
        let formattedDescription;
        if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
          formattedDescription = description;
        } else {
          const wrappedDescription = helper.boxWrap(description, remainingWidth);
          formattedDescription = wrappedDescription.replace(
            /\n/g,
            "\n" + " ".repeat(termWidth + spacerWidth)
          );
        }
        return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
      }
      /**
       * Wrap a string at whitespace, preserving existing line breaks.
       * Wrapping is skipped if the width is less than `minWidthToWrap`.
       *
       * @param {string} str
       * @param {number} width
       * @returns {string}
       */
      boxWrap(str, width) {
        if (width < this.minWidthToWrap) return str;
        const rawLines = str.split(/\r\n|\n/);
        const chunkPattern = /[\s]*[^\s]+/g;
        const wrappedLines = [];
        rawLines.forEach((line) => {
          const chunks = line.match(chunkPattern);
          if (chunks === null) {
            wrappedLines.push("");
            return;
          }
          let sumChunks = [chunks.shift()];
          let sumWidth = this.displayWidth(sumChunks[0]);
          chunks.forEach((chunk) => {
            const visibleWidth2 = this.displayWidth(chunk);
            if (sumWidth + visibleWidth2 <= width) {
              sumChunks.push(chunk);
              sumWidth += visibleWidth2;
              return;
            }
            wrappedLines.push(sumChunks.join(""));
            const nextChunk = chunk.trimStart();
            sumChunks = [nextChunk];
            sumWidth = this.displayWidth(nextChunk);
          });
          wrappedLines.push(sumChunks.join(""));
        });
        return wrappedLines.join("\n");
      }
    };
    function stripColor(str) {
      const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
      return str.replace(sgrPattern, "");
    }
    exports.Help = Help2;
    exports.stripColor = stripColor;
  }
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
        this.helpGroupHeading = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _collectValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        previous.push(value);
        return previous;
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._collectValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as an object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        if (this.negate) {
          return camelcase(this.name().replace(/^no-/, ""));
        }
        return camelcase(this.name());
      }
      /**
       * Set the help group heading.
       *
       * @param {string} heading
       * @return {Option}
       */
      helpGroup(heading) {
        this.helpGroupHeading = heading;
        return this;
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key2) => {
          if (this.positiveOptions.has(key2)) {
            this.dualOptions.add(key2);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const shortFlagExp = /^-[^-]$/;
      const longFlagExp = /^--[^-]/;
      const flagParts = flags.split(/[ |,]+/).concat("guard");
      if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
      if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
      if (!shortFlag && shortFlagExp.test(flagParts[0]))
        shortFlag = flagParts.shift();
      if (!shortFlag && longFlagExp.test(flagParts[0])) {
        shortFlag = longFlag;
        longFlag = flagParts.shift();
      }
      if (flagParts[0].startsWith("-")) {
        const unsupportedFlag = flagParts[0];
        const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
        if (/^-[^-][^-]/.test(unsupportedFlag))
          throw new Error(
            `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
          );
        if (shortFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many short flags`);
        if (longFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many long flags`);
        throw new Error(`${baseError}
- unrecognised flag format`);
      }
      if (shortFlag === void 0 && longFlag === void 0)
        throw new Error(
          `option creation failed due to no flags found in '${flags}'.`
        );
      return { shortFlag, longFlag };
    }
    exports.Option = Option2;
    exports.DualOptions = DualOptions;
  }
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0) return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports.suggestSimilar = suggestSimilar;
  }
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports) {
    var EventEmitter2 = __require("node:events").EventEmitter;
    var childProcess = __require("node:child_process");
    var path10 = __require("node:path");
    var fs2 = __require("node:fs");
    var process3 = __require("node:process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2, stripColor } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter2 {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = false;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._savedState = null;
        this._outputConfiguration = {
          writeOut: (str) => process3.stdout.write(str),
          writeErr: (str) => process3.stderr.write(str),
          outputError: (str, write) => write(str),
          getOutHelpWidth: () => process3.stdout.isTTY ? process3.stdout.columns : void 0,
          getErrHelpWidth: () => process3.stderr.isTTY ? process3.stderr.columns : void 0,
          getOutHasColors: () => useColor() ?? (process3.stdout.isTTY && process3.stdout.hasColors?.()),
          getErrHasColors: () => useColor() ?? (process3.stderr.isTTY && process3.stderr.hasColors?.()),
          stripColor: (str) => stripColor(str)
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
        this._helpGroupHeading = void 0;
        this._defaultCommandGroup = void 0;
        this._defaultOptionGroup = void 0;
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // change how output being written, defaults to stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // change how output being written for errors, defaults to writeErr
       *     outputError(str, write) // used for displaying errors and not used for displaying help
       *     // specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // color support, currently only used with Help
       *     getOutHasColors()
       *     getErrHasColors()
       *     stripColor() // used to remove ANSI escape codes if output does not have colors
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        this._outputConfiguration = {
          ...this._outputConfiguration,
          ...configuration
        };
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom argument processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, parseArg, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof parseArg === "function") {
          argument.default(defaultValue).argParser(parseArg);
        } else {
          argument.default(parseArg);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names.trim().split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument?.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`
          );
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          if (enableOrNameAndArgs && this._defaultCommandGroup) {
            this._initCommandGroup(this._getHelpCommand());
          }
          return this;
        }
        const nameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        if (enableOrNameAndArgs || description) this._initCommandGroup(helpCommand);
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        this._initCommandGroup(helpCommand);
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message2) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message2));
        }
        process3.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message2 = `${invalidArgumentMessage} ${err.message}`;
            this.error(message2, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this._initOptionGroup(option);
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find(
          (name) => this._findCommand(name)
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
          );
        }
        this._initCommandGroup(command);
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._collectValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config2, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config2.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values"
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key2) {
        if (this._storeOptionsAsProperties) {
          return this[key2];
        }
        return this._optionValues[key2];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key2, value) {
        return this.setOptionValueWithSource(key2, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key2, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key2] = value;
        } else {
          this._optionValues[key2] = value;
        }
        this._optionValueSources[key2] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key2) {
        return this._optionValueSources[key2];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key2) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key2) !== void 0) {
            source = cmd.getOptionValueSource(key2);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process3.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process3.execArgv ?? [];
          if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process3.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process3.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      _prepareForParse() {
        if (this._savedState === null) {
          this.saveStateBeforeParse();
        } else {
          this.restoreStateBeforeParse();
        }
      }
      /**
       * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state saved.
       */
      saveStateBeforeParse() {
        this._savedState = {
          // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
          _name: this._name,
          // option values before parse have default values (including false for negated options)
          // shallow clones
          _optionValues: { ...this._optionValues },
          _optionValueSources: { ...this._optionValueSources }
        };
      }
      /**
       * Restore state before parse for calls after the first.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state restored.
       */
      restoreStateBeforeParse() {
        if (this._storeOptionsAsProperties)
          throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
        this._name = this._savedState._name;
        this._scriptPath = null;
        this.rawArgs = [];
        this._optionValues = { ...this._savedState._optionValues };
        this._optionValueSources = { ...this._savedState._optionValueSources };
        this.args = [];
        this.processedArgs = [];
      }
      /**
       * Throw if expected executable is missing. Add lots of help for author.
       *
       * @param {string} executableFile
       * @param {string} executableDir
       * @param {string} subcommandName
       */
      _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
        if (fs2.existsSync(executableFile)) return;
        const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
        throw new Error(executableMissing);
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path10.resolve(baseDir, baseName);
          if (fs2.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path10.extname(baseName))) return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs2.existsSync(`${localBin}${ext}`)
          );
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs2.realpathSync(this._scriptPath);
          } catch {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path10.resolve(
            path10.dirname(resolvedScriptPath),
            executableDir
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path10.basename(
              this._scriptPath,
              path10.extname(this._scriptPath)
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path10.extname(executableFile));
        let proc;
        if (process3.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process3.execArgv).concat(args);
            proc = childProcess.spawn(process3.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          this._checkForMissingExecutable(
            executableFile,
            executableDir,
            subcommand._name
          );
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process3.execArgv).concat(args);
          proc = childProcess.spawn(process3.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process3.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process3.exit(code);
          } else {
            exitCallback(
              new CommanderError2(
                code,
                "commander.executeSubCommandAsync",
                "(close)"
              )
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            this._checkForMissingExecutable(
              executableFile,
              executableDir,
              subcommand._name
            );
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process3.exit(1);
          } else {
            const wrappedError = new CommanderError2(
              1,
              "commander.executeSubCommandAsync",
              "(error)"
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        subCommand._prepareForParse();
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand"
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise?.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown
          );
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(
            promiseChain,
            () => this._actionHandler(this.processedArgs)
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent?.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name)
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Side effects: modifies command by storing options. Does not reset state if called again.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} args
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(args) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        const negativeNumberArg = (arg) => {
          if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg)) return false;
          return !this._getCommandAndAncestors().some(
            (cmd) => cmd.options.map((opt) => opt.short).some((short) => /^-\d$/.test(short))
          );
        };
        let activeVariadicOption = null;
        let activeGroup = null;
        let i = 0;
        while (i < args.length || activeGroup) {
          const arg = activeGroup ?? args[i++];
          activeGroup = null;
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args.slice(i));
            break;
          }
          if (activeVariadicOption && (!maybeOption(arg) || negativeNumberArg(arg))) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args[i++];
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (i < args.length && (!maybeOption(args[i]) || negativeNumberArg(args[i]))) {
                  value = args[i++];
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                activeGroup = `-${arg.slice(2)}`;
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (dest === operands && maybeOption(arg) && !(this.commands.length === 0 && negativeNumberArg(arg))) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              unknown.push(...args.slice(i));
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg, ...args.slice(i));
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg, ...args.slice(i));
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg, ...args.slice(i));
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key2 = this.options[i].attributeName();
            result[key2] = key2 === this._versionOptionName ? this._version : this[key2];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message2, errorOptions) {
        this._outputConfiguration.outputError(
          `${message2}
`,
          this._outputConfiguration.writeErr
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config2 = errorOptions || {};
        const exitCode = config2.exitCode || 1;
        const code = config2.code || "commander.error";
        this._exit(exitCode, code, message2);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process3.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
              this.getOptionValueSource(optionKey)
            )) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process3.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter(
          (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option
          )
        ).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              "implied"
            );
          });
        });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message2 = `error: missing required argument '${name}'`;
        this.error(message2, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message2 = `error: option '${option.flags}' argument missing`;
        this.error(message2, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message2 = `error: required option '${option.flags}' not specified`;
        this.error(message2, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName()
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName()
          );
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage2 = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message2 = `error: ${getErrorMessage2(option)} cannot be used with ${getErrorMessage2(conflictingOption)}`;
        this.error(message2, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message2 = `error: unknown option '${flag}'${suggestion}`;
        this.error(message2, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message2 = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message2, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias()) candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message2 = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message2, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases2) {
        if (aliases2 === void 0) return this._aliases;
        aliases2.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set/get the help group heading for this subcommand in parent command's help.
       *
       * @param {string} [heading]
       * @return {Command | string}
       */
      helpGroup(heading) {
        if (heading === void 0) return this._helpGroupHeading ?? "";
        this._helpGroupHeading = heading;
        return this;
      }
      /**
       * Set/get the default help group heading for subcommands added to this command.
       * (This does not override a group set directly on the subcommand using .helpGroup().)
       *
       * @example
       * program.commandsGroup('Development Commands:);
       * program.command('watch')...
       * program.command('lint')...
       * ...
       *
       * @param {string} [heading]
       * @returns {Command | string}
       */
      commandsGroup(heading) {
        if (heading === void 0) return this._defaultCommandGroup ?? "";
        this._defaultCommandGroup = heading;
        return this;
      }
      /**
       * Set/get the default help group heading for options added to this command.
       * (This does not override a group set directly on the option using .helpGroup().)
       *
       * @example
       * program
       *   .optionsGroup('Development Options:')
       *   .option('-d, --debug', 'output extra debugging')
       *   .option('-p, --profile', 'output profiling information')
       *
       * @param {string} [heading]
       * @returns {Command | string}
       */
      optionsGroup(heading) {
        if (heading === void 0) return this._defaultOptionGroup ?? "";
        this._defaultOptionGroup = heading;
        return this;
      }
      /**
       * @param {Option} option
       * @private
       */
      _initOptionGroup(option) {
        if (this._defaultOptionGroup && !option.helpGroupHeading)
          option.helpGroup(this._defaultOptionGroup);
      }
      /**
       * @param {Command} cmd
       * @private
       */
      _initCommandGroup(cmd) {
        if (this._defaultCommandGroup && !cmd.helpGroup())
          cmd.helpGroup(this._defaultCommandGroup);
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path10.basename(filename, path10.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path11) {
        if (path11 === void 0) return this._executableDir;
        this._executableDir = path11;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        const context = this._getOutputContext(contextOptions);
        helper.prepareContext({
          error: context.error,
          helpWidth: context.helpWidth,
          outputHasColors: context.hasColors
        });
        const text4 = helper.formatHelp(this, helper);
        if (context.hasColors) return text4;
        return this._outputConfiguration.stripColor(text4);
      }
      /**
       * @typedef HelpContext
       * @type {object}
       * @property {boolean} error
       * @property {number} helpWidth
       * @property {boolean} hasColors
       * @property {function} write - includes stripColor if needed
       *
       * @returns {HelpContext}
       * @private
       */
      _getOutputContext(contextOptions) {
        contextOptions = contextOptions || {};
        const error3 = !!contextOptions.error;
        let baseWrite;
        let hasColors;
        let helpWidth;
        if (error3) {
          baseWrite = (str) => this._outputConfiguration.writeErr(str);
          hasColors = this._outputConfiguration.getErrHasColors();
          helpWidth = this._outputConfiguration.getErrHelpWidth();
        } else {
          baseWrite = (str) => this._outputConfiguration.writeOut(str);
          hasColors = this._outputConfiguration.getOutHasColors();
          helpWidth = this._outputConfiguration.getOutHelpWidth();
        }
        const write = (str) => {
          if (!hasColors) str = this._outputConfiguration.stripColor(str);
          return baseWrite(str);
        };
        return { error: error3, write, hasColors, helpWidth };
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const outputContext = this._getOutputContext(contextOptions);
        const eventContext = {
          error: outputContext.error,
          write: outputContext.write,
          command: this
        };
        this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
        this.emit("beforeHelp", eventContext);
        let helpInformation = this.helpInformation({ error: outputContext.error });
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        outputContext.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", eventContext);
        this._getCommandAndAncestors().forEach(
          (command) => command.emit("afterAllHelp", eventContext)
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            if (this._helpOption === null) this._helpOption = void 0;
            if (this._defaultOptionGroup) {
              this._initOptionGroup(this._getHelpOption());
            }
          } else {
            this._helpOption = null;
          }
          return this;
        }
        this._helpOption = this.createOption(
          flags ?? "-h, --help",
          description ?? "display help for command"
        );
        if (flags || description) this._initOptionGroup(this._helpOption);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        this._initOptionGroup(option);
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = Number(process3.exitCode ?? 0);
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * // Do a little typing to coordinate emit and listener for the help text events.
       * @typedef HelpTextEventContext
       * @type {object}
       * @property {boolean} error
       * @property {Command} command
       * @property {function} write
       */
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text4) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text4 === "function") {
            helpStr = text4({ error: context.error, command: context.command });
          } else {
            helpStr = text4;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    function useColor() {
      if (process3.env.NO_COLOR || process3.env.FORCE_COLOR === "0" || process3.env.FORCE_COLOR === "false")
        return false;
      if (process3.env.FORCE_COLOR || process3.env.CLICOLOR_FORCE !== void 0)
        return true;
      return void 0;
    }
    exports.Command = Command2;
    exports.useColor = useColor;
  }
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports.program = new Command2();
    exports.createCommand = (name) => new Command2(name);
    exports.createOption = (flags, description) => new Option2(flags, description);
    exports.createArgument = (name, description) => new Argument2(name, description);
    exports.Command = Command2;
    exports.Option = Option2;
    exports.Argument = Argument2;
    exports.Help = Help2;
    exports.CommanderError = CommanderError2;
    exports.InvalidArgumentError = InvalidArgumentError2;
    exports.InvalidOptionArgumentError = InvalidArgumentError2;
  }
});

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap2 = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap2;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key2, node, visitor, path10) {
      const ctrl = callVisitor(key2, node, visitor, path10);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key2, path10, ctrl);
        return visit_(key2, ctrl, visitor, path10);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path10 = Object.freeze(path10.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path10);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path10 = Object.freeze(path10.concat(node));
          const ck = visit_("key", node.key, visitor, path10);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path10);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key2, node, visitor, path10) {
      const ctrl = await callVisitor(key2, node, visitor, path10);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key2, path10, ctrl);
        return visitAsync_(key2, ctrl, visitor, path10);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path10 = Object.freeze(path10.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path10);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path10 = Object.freeze(path10.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path10);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path10);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key2, node, visitor, path10) {
      if (typeof visitor === "function")
        return visitor(key2, node, path10);
      if (identity.isMap(node))
        return visitor.Map?.(key2, node, path10);
      if (identity.isSeq(node))
        return visitor.Seq?.(key2, node, path10);
      if (identity.isPair(node))
        return visitor.Pair?.(key2, node, path10);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key2, node, path10);
      if (identity.isAlias(node))
        return visitor.Alias?.(key2, node, path10);
      return void 0;
    }
    function replaceNode(key2, path10, node) {
      const parent = path10[path10.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key2] = node;
      } else if (identity.isPair(parent)) {
        if (key2 === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error3) {
            onError(String(error3));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root2) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root2, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error3 = new Error("Failed to resolve repeated object (this should not happen)");
              error3.source = source;
              throw error3;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key2, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key2, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path10, value) {
      let v = value;
      for (let i = path10.length - 1; i >= 0; --i) {
        const k = path10[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path10) => path10 == null || typeof path10 === "object" && !!path10[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path10, value) {
        if (isEmptyPath(path10))
          this.add(value);
        else {
          const [key2, ...rest] = path10;
          const node = this.get(key2, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key2, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key2}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path10) {
        const [key2, ...rest] = path10;
        if (rest.length === 0)
          return this.delete(key2);
        const node = this.get(key2, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key2}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path10, keepScalar) {
        const [key2, ...rest] = path10;
        const node = this.get(key2, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path10) {
        const [key2, ...rest] = path10;
        if (rest.length === 0)
          return this.has(key2);
        const node = this.get(key2, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path10, value) {
        const [key2, ...rest] = path10;
        if (rest.length === 0) {
          this.set(key2, value);
        } else {
          const node = this.get(key2, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key2, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key2}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text4, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text4;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text4.length <= endStep)
        return text4;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text4, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text4[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text4[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text4, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text4[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text4[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text4;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text4;
      if (onFold)
        onFold();
      let res = text4.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text4.length;
        if (fold === 0)
          res = `
${indent}${text4.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text4[fold]}\\`;
          res += `
${indent}${text4.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text4, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text4[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text4[++i];
        } else {
          do {
            ch = text4[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text4[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify3(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify3;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify3 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key: key2, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key2) && key2.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key2) || !identity.isNode(key2) && typeof key2 === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key2 || keyComment && value == null && !ctx.inFlow || identity.isCollection(key2) || (identity.isScalar(key2) ? key2.type === Scalar.Scalar.BLOCK_FOLDED || key2.type === Scalar.Scalar.BLOCK_LITERAL : typeof key2 === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify3.stringify(key2, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify3.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn2(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn2;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key2) => (merge.identify(key2) || identity.isScalar(key2) && (!key2.type || key2.type === Scalar.Scalar.PLAIN) && merge.identify(key2.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key2, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key2))
            map.set(key2, value2);
        } else if (map instanceof Set) {
          map.add(key2);
        } else if (!Object.prototype.hasOwnProperty.call(map, key2)) {
          Object.defineProperty(map, key2, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log2 = require_log();
    var merge = require_merge();
    var stringify3 = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key: key2, value }) {
      if (identity.isNode(key2) && key2.addToJSMap)
        key2.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key2))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key2, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key2, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key2, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key2) && ctx?.doc) {
        const strCtx = stringify3.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key2.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log2.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key2, value, ctx) {
      const k = createNode.createNode(key2, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key2, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key2;
        this.value = value;
      }
      clone(schema) {
        let { key: key2, value } = this;
        if (identity.isNode(key2))
          key2 = key2.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key2, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify3 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify4(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify3.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify3.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key2) {
      const k = identity.isScalar(key2) ? key2.value : key2;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key2 || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key2, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key2, value);
          else if (Array.isArray(replacer) && !replacer.includes(key2))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key2, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key2, value] of obj)
            add(key2, value);
        } else if (obj && typeof obj === "object") {
          for (const key2 of Object.keys(obj))
            add(key2, obj[key2]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key2) {
        const it = findPair(this.items, key2);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key2, keepScalar) {
        const it = findPair(this.items, key2);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key2) {
        return !!findPair(this.items, key2);
      }
      set(key2, value) {
        this.add(new Pair.Pair(key2, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key2) {
        const idx = asItemIndex(key2);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key2, keepScalar) {
        const idx = asItemIndex(key2);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key2) {
        const idx = asItemIndex(key2);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key2, value) {
        const idx = asItemIndex(key2);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key2}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key2 = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key2, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key2) {
      let idx = identity.isScalar(key2) ? key2.value : key2;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key2, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key2 = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key2 = keys[0];
              value = it[key2];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key2 = it;
          }
          pairs2.items.push(Pair.createPair(key2, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key2, value;
          if (identity.isPair(pair)) {
            key2 = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key2, ctx);
          } else {
            key2 = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key2))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key2, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key: key2 } of pairs$1.items) {
          if (identity.isScalar(key2)) {
            if (seenKeys.includes(key2.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key2.value}`);
            } else {
              seenKeys.push(key2.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key2) {
        let pair;
        if (identity.isPair(key2))
          pair = key2;
        else if (key2 && typeof key2 === "object" && "key" in key2 && "value" in key2 && key2.value === null)
          pair = new Pair.Pair(key2.key, null);
        else
          pair = new Pair.Pair(key2, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key2, keepPair) {
        const pair = YAMLMap.findPair(this.items, key2);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key2, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key2);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key2));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key2) => key2 !== "yaml11").map((key2) => JSON.stringify(key2)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key2) => JSON.stringify(key2)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify3 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify3.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify3.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify3.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path10, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path10, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key2, value, options = {}) {
        const k = this.createNode(key2, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key2) {
        return assertCollection(this.contents) ? this.contents.delete(key2) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path10) {
        if (Collection.isEmptyPath(path10)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path10) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key2, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key2, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path10, keepScalar) {
        if (Collection.isEmptyPath(path10))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path10, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key2) {
        return identity.isCollection(this.contents) ? this.contents.has(key2) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path10) {
        if (Collection.isEmptyPath(path10))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path10) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key2, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key2], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key2, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path10, value) {
        if (Collection.isEmptyPath(path10)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path10), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path10, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message2) {
        super();
        this.name = name;
        this.code = code;
        this.message = message2;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message2) {
        super("YAMLParseError", pos, code, message2);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message2) {
        super("YAMLWarning", pos, code, message2);
      }
    };
    var prettifyError = (src, lc) => (error3) => {
      if (error3.pos[0] === -1)
        return;
      error3.linePos = error3.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error3.linePos[0];
      error3.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error3.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error3.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key2) {
      if (!key2)
        return null;
      switch (key2.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key2.source.includes("\n"))
            return true;
          if (key2.end) {
            for (const st of key2.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key2.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key: key2, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key2 ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key2) {
            if (key2.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key2 && key2.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key2)) {
            onError(key2 ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key2 ? composeNode(ctx, key2, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key2, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key2 || key2.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap2 = fc.start.source === "{";
      const fcName = isMap2 ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key: key2, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key2 ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap2 && ctx.options.strict && utilContainsNewline.containsNewline(key2))
            onError(
              key2,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap2 && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key2 ? composeNode(ctx, key2, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key2))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap2 && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap2) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap2 ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message2 = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message2);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message2 = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message2);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message2 = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message2);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message2 = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message2);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error3 = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error3 === -1)
            error3 = offset + i;
        }
      }
      if (error3 !== -1)
        onError(error3, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message2 = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message2);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message2 = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message2);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + match[1];
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error3) {
        const msg = error3 instanceof Error ? error3.message : String(error3);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error3) {
            const message2 = error3 instanceof Error ? error3.message : String(error3);
            onError(token, "RESOURCE_EXHAUSTION", message2);
          }
          break;
        default: {
          const message2 = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message2);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message2, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message2));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message2));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message2, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message2, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error3 = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error3);
            else
              this.doc.errors.push(error3);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message2) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message2);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message2);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key2 of Object.keys(token))
          if (key2 !== "type" && key2 !== "offset")
            delete token[key2];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key2 of Object.keys(token))
            if (key2 !== "type" && key2 !== "offset")
              delete token[key2];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify3 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key: key2, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key2)
        res += stringifyToken(key2);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify3;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path10) => {
      let item = cst;
      for (const [field, index] of path10) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path10) => {
      const parent = visit.itemAtPath(cst, path10.slice(0, -1));
      const field = path10[path10.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path10, item, visitor) {
      let ctrl = visitor(item, path10);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path10.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path10);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path10) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter2 = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter2;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message2 = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message: message2, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error3) {
        const token = error3 ?? this.stack.pop();
        if (!token) {
          const message2 = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message: message2 };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key2 = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key: key2, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs2 = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs2, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs2);
              } else {
                Object.assign(it, { key: fs2, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs2 = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs2, sep: [] });
              else if (it.sep)
                this.stack.push(fs2);
              else
                Object.assign(it, { key: fs2, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log2 = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument4(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse3(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument4(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log2.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify3(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse3;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument4;
    exports.stringify = stringify3;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// node_modules/ignore/index.js
var require_ignore = __commonJS({
  "node_modules/ignore/index.js"(exports, module) {
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define = (object, key2, value) => Object.defineProperty(object, key2, { value });
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var RETURN_FALSE = () => false;
    var sanitizeRange = (range) => range.replace(
      REGEX_REGEXP_RANGE,
      (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
    );
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        // remove BOM
        // TODO:
        // Other similar zero-width characters?
        /^\uFEFF/,
        () => EMPTY
      ],
      // > Trailing spaces are ignored unless they are quoted with backslash ("\")
      [
        // (a\ ) -> (a )
        // (a  ) -> (a)
        // (a ) -> (a)
        // (a \ ) -> (a  )
        /((?:\\\\)*?)(\\?\s+)$/,
        (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)
      ],
      // replace (\ ) with ' '
      // (\ ) -> ' '
      // (\\ ) -> '\\ '
      // (\\\ ) -> '\\ '
      [
        /(\\+?)\s/g,
        (_, m1) => {
          const { length } = m1;
          return m1.slice(0, length - length % 2) + SPACE;
        }
      ],
      // Escape metacharacters
      // which is written down by users but means special for regular expressions.
      // > There are 12 characters with special meanings:
      // > - the backslash \,
      // > - the caret ^,
      // > - the dollar sign $,
      // > - the period or dot .,
      // > - the vertical bar or pipe symbol |,
      // > - the question mark ?,
      // > - the asterisk or star *,
      // > - the plus sign +,
      // > - the opening parenthesis (,
      // > - the closing parenthesis ),
      // > - and the opening square bracket [,
      // > - the opening curly brace {,
      // > These special characters are often called "metacharacters".
      [
        /[\\$.|*+(){^]/g,
        (match) => `\\${match}`
      ],
      [
        // > a question mark (?) matches a single character
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      // leading slash
      [
        // > A leading slash matches the beginning of the pathname.
        // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
        // A leading slash matches the beginning of the pathname
        /^\//,
        () => "^"
      ],
      // replace special metacharacter slash after the leading slash
      [
        /\//g,
        () => "\\/"
      ],
      [
        // > A leading "**" followed by a slash means match in all directories.
        // > For example, "**/foo" matches file or directory "foo" anywhere,
        // > the same as pattern "foo".
        // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
        // >   under directory "foo".
        // Notice that the '*'s have been replaced as '\\*'
        /^\^*\\\*\\\*\\\//,
        // '**/foo' <-> 'foo'
        () => "^(?:.*\\/)?"
      ],
      // starting
      [
        // there will be no leading '/'
        //   (which has been replaced by section "leading slash")
        // If starts with '**', adding a '^' to the regular expression also works
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      // two globstars
      [
        // Use lookahead assertions so that we could match more than one `'/**'`
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        // Zero, one or several directories
        // should not use '*', or it will be replaced by the next replacer
        // Check if it is not the last `'/**'`
        (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      // normal intermediate wildcards
      [
        // Never replace escaped '*'
        // ignore rule '\*' will match the path '*'
        // 'abc.*/' -> go
        // 'abc.*'  -> skip this rule,
        //    coz trailing single wildcard will be handed by [trailing wildcard]
        /(^|[^\\]+)(\\\*)+(?=.+)/g,
        // '*.js' matches '.js'
        // '*.js' doesn't match 'abc'
        (_, p1, p2) => {
          const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
          return p1 + unescaped;
        }
      ],
      [
        // unescape, revert step 3 except for back slash
        // For example, if a user escape a '\\*',
        // after step 3, the result will be '\\\\\\*'
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        // '\\\\' -> '\\'
        /\\\\/g,
        () => ESCAPE
      ],
      [
        // > The range notation, e.g. [a-zA-Z],
        // > can be used to match one of the characters in a range.
        // `\` is escaped by step 3
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
      ],
      // ending
      [
        // 'js' will not match 'js.'
        // 'ab' will not match 'abc'
        /(?:[^*])$/,
        // WTF!
        // https://git-scm.com/docs/gitignore
        // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
        // which re-fixes #24, #38
        // > If there is a separator at the end of the pattern then the pattern
        // > will only match directories, otherwise the pattern can match both
        // > files and directories.
        // 'js*' will not match 'a.js'
        // 'js/' will not match 'a.js'
        // 'js' will match 'a.js' and 'a.js/'
        (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
      ],
      // trailing wildcard
      [
        /(\^|\\\/)?\\\*$/,
        (_, p1) => {
          const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
          return `${prefix}(?=$|\\/$)`;
        }
      ]
    ];
    var regexCache = /* @__PURE__ */ Object.create(null);
    var makeRegex = (pattern, ignoreCase) => {
      let source = regexCache[pattern];
      if (!source) {
        source = REPLACERS.reduce(
          (prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)),
          pattern
        );
        regexCache[pattern] = source;
      }
      return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
    };
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
    var IgnoreRule = class {
      constructor(origin, pattern, negative, regex) {
        this.origin = origin;
        this.pattern = pattern;
        this.negative = negative;
        this.regex = regex;
      }
    };
    var createRule = (pattern, ignoreCase) => {
      const origin = pattern;
      let negative = false;
      if (pattern.indexOf("!") === 0) {
        negative = true;
        pattern = pattern.substr(1);
      }
      pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regex = makeRegex(pattern, ignoreCase);
      return new IgnoreRule(
        origin,
        pattern,
        negative,
        regex
      );
    };
    var throwError = (message2, Ctor) => {
      throw new Ctor(message2);
    };
    var checkPath = (path10, originalPath, doThrow) => {
      if (!isString(path10)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path10) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path10)) {
        const r = "`path.relative()`d";
        return doThrow(
          `path should be a ${r} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path10) => REGEX_TEST_INVALID_PATH.test(path10);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p) => p;
    var Ignore = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define(this, KEY_IGNORE, true);
        this._rules = [];
        this._ignoreCase = ignoreCase;
        this._allowRelativePaths = allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      _addPattern(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules);
          this._added = true;
          return;
        }
        if (checkPattern(pattern)) {
          const rule = createRule(pattern, this._ignoreCase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      // @param {Array<string> | string | Ignore} pattern
      add(pattern) {
        this._added = false;
        makeArray(
          isString(pattern) ? splitPattern(pattern) : pattern
        ).forEach(this._addPattern, this);
        if (this._added) {
          this._initCache();
        }
        return this;
      }
      // legacy
      addPattern(pattern) {
        return this.add(pattern);
      }
      //          |           ignored : unignored
      // negative |   0:0   |   0:1   |   1:0   |   1:1
      // -------- | ------- | ------- | ------- | --------
      //     0    |  TEST   |  TEST   |  SKIP   |    X
      //     1    |  TESTIF |  SKIP   |  TEST   |    X
      // - SKIP: always skip
      // - TEST: always test
      // - TESTIF: only test if checkUnignored
      // - X: that never happen
      // @param {boolean} whether should check if the path is unignored,
      //   setting `checkUnignored` to `false` could reduce additional
      //   path matching.
      // @returns {TestResult} true if a file is ignored
      _testOne(path10, checkUnignored) {
        let ignored = false;
        let unignored = false;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule.regex.test(path10);
          if (matched) {
            ignored = !negative;
            unignored = negative;
          }
        });
        return {
          ignored,
          unignored
        };
      }
      // @returns {TestResult}
      _test(originalPath, cache, checkUnignored, slices) {
        const path10 = originalPath && checkPath.convert(originalPath);
        checkPath(
          path10,
          originalPath,
          this._allowRelativePaths ? RETURN_FALSE : throwError
        );
        return this._t(path10, cache, checkUnignored, slices);
      }
      _t(path10, cache, checkUnignored, slices) {
        if (path10 in cache) {
          return cache[path10];
        }
        if (!slices) {
          slices = path10.split(SLASH);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path10] = this._testOne(path10, checkUnignored);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path10] = parent.ignored ? parent : this._testOne(path10, checkUnignored);
      }
      ignores(path10) {
        return this._test(path10, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path10) => !this.ignores(path10);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      // @returns {TestResult}
      test(path10) {
        return this._test(path10, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore(options);
    var isPathValid = (path10) => checkPath(path10 && checkPath.convert(path10), path10, RETURN_FALSE);
    factory.isPathValid = isPathValid;
    factory.default = factory;
    module.exports = factory;
    if (
      // Detect `process` so that it can run in browsers.
      typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")
    ) {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path10) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path10) || isNotRelative(path10);
    }
  }
});

// node_modules/toolcraft/dist/cli.js
import { access as access2, lstat as lstat3, readFile as readFile3, rename as rename3, unlink as unlink3, writeFile as writeFile4 } from "node:fs/promises";
import path9 from "node:path";

// node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = import_index.default;

// node_modules/toolcraft/node_modules/toolcraft-design/dist/internal/color-support.js
function supportsColor(env = process.env, stream = process.stdout) {
  if (env.FORCE_COLOR !== void 0 && env.FORCE_COLOR !== "0") {
    return true;
  }
  if (env.NO_COLOR !== void 0) {
    return false;
  }
  if (stream.isTTY !== true) {
    return false;
  }
  return typeof env.TERM === "string" && env.TERM.length > 0 && env.TERM !== "dumb";
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/color.js
var reset = "\x1B[0m";
var ansiStyles = {
  reset: { open: reset },
  bold: { open: "\x1B[1m" },
  dim: { open: "\x1B[2m" },
  italic: { open: "\x1B[3m" },
  underline: { open: "\x1B[4m" },
  inverse: { open: "\x1B[7m" },
  strikethrough: { open: "\x1B[9m" },
  black: { open: "\x1B[30m" },
  red: { open: "\x1B[31m" },
  green: { open: "\x1B[32m" },
  yellow: { open: "\x1B[33m" },
  blue: { open: "\x1B[34m" },
  magenta: { open: "\x1B[35m" },
  cyan: { open: "\x1B[36m" },
  white: { open: "\x1B[37m" },
  gray: { open: "\x1B[90m" },
  magentaBright: { open: "\x1B[95m" },
  cyanBright: { open: "\x1B[96m" },
  bgRed: { open: "\x1B[41m" },
  bgGreen: { open: "\x1B[42m" },
  bgYellow: { open: "\x1B[43m" },
  bgBlue: { open: "\x1B[44m" },
  bgMagenta: { open: "\x1B[45m" }
};
var styleNames = Object.keys(ansiStyles);
function replaceAll(value, search, replacement) {
  return value.split(search).join(replacement);
}
function applyStyles(text4, styles) {
  if (!supportsColor() || styles.length === 0) {
    return text4;
  }
  const open = styles.map((style) => style.open).join("");
  const output = text4.includes(reset) ? replaceAll(text4, reset, `${reset}${open}`) : text4;
  return `${open}${output}${reset}`;
}
function clampRgb(value) {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(255, Math.max(0, Math.round(value)));
}
function hexChannel(value, offset) {
  return Number.parseInt(value.slice(offset, offset + 2), 16);
}
function normalizeHex(value) {
  const normalized = value.startsWith("#") ? value.slice(1) : value;
  if (normalized.length !== 3 && normalized.length !== 6 || Array.from(normalized).some((char) => !"0123456789abcdefABCDEF".includes(char))) {
    throw new Error(`Invalid hexadecimal color: ${value}`);
  }
  if (normalized.length === 3) {
    const red = normalized[0];
    const green = normalized[1];
    const blue = normalized[2];
    return [
      Number.parseInt(`${red}${red}`, 16),
      Number.parseInt(`${green}${green}`, 16),
      Number.parseInt(`${blue}${blue}`, 16)
    ];
  }
  return [
    hexChannel(normalized, 0),
    hexChannel(normalized, 2),
    hexChannel(normalized, 4)
  ];
}
function rgbStyle(red, green, blue) {
  return {
    open: `\x1B[38;2;${clampRgb(red)};${clampRgb(green)};${clampRgb(blue)}m`
  };
}
function bgRgbStyle(red, green, blue) {
  return {
    open: `\x1B[48;2;${clampRgb(red)};${clampRgb(green)};${clampRgb(blue)}m`
  };
}
function createColor(styles = []) {
  const builder = ((text4) => applyStyles(String(text4), styles));
  for (const name of styleNames) {
    Object.defineProperty(builder, name, {
      configurable: true,
      enumerable: true,
      get: () => createColor([...styles, ansiStyles[name]])
    });
  }
  builder.hex = (value) => {
    const [red, green, blue] = normalizeHex(value);
    return createColor([...styles, rgbStyle(red, green, blue)]);
  };
  builder.rgb = (red, green, blue) => createColor([...styles, rgbStyle(red, green, blue)]);
  builder.bgHex = (value) => {
    const [red, green, blue] = normalizeHex(value);
    return createColor([...styles, bgRgbStyle(red, green, blue)]);
  };
  builder.bgRgb = (red, green, blue) => createColor([...styles, bgRgbStyle(red, green, blue)]);
  return builder;
}
var color = createColor();

// node_modules/toolcraft/node_modules/toolcraft-design/dist/tokens/brand.js
var brands = {
  purple: { name: "purple", primary: "#a200ff" },
  blue: { name: "blue", primary: "#2f6fed" },
  green: { name: "green", primary: "#1f9d57" }
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/internal/theme-state.js
var defaults = {
  brand: "purple",
  label: "Poe"
};
var config = { ...defaults };
var revision = 0;
var brandConfigured = false;
function configureTheme(patch) {
  if (patch.brand !== void 0 && !Object.hasOwn(brands, patch.brand)) {
    throw new Error(`Unknown brand: ${patch.brand}`);
  }
  config = {
    brand: patch.brand ?? config.brand,
    label: patch.label ?? config.label
  };
  if (patch.brand !== void 0) {
    brandConfigured = true;
  }
  revision += 1;
}
function getThemeConfig() {
  return { ...config };
}
function getThemeRevision() {
  return revision;
}
function isThemeBrandConfigured() {
  return brandConfigured;
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/tokens/colors.js
var brand = brands.purple.primary;
function withStyles(palette, styles) {
  return Object.defineProperty(palette, "styles", {
    value: styles,
    enumerable: false
  });
}
function brandColor(activeBrand, purple) {
  return activeBrand.name === "purple" ? purple : color.hex(activeBrand.primary);
}
function brandBackground(activeBrand, purple) {
  return activeBrand.name === "purple" ? purple : color.bgHex(activeBrand.primary);
}
function createPalette(activeBrand, mode) {
  const isPurple = activeBrand.name === "purple";
  if (mode === "light") {
    const active2 = color.hex(activeBrand.primary);
    const prompt2 = isPurple ? color.hex("#006699") : active2;
    const number2 = isPurple ? color.hex("#0077cc") : active2;
    return withStyles({
      header: (text4) => active2.bold(text4),
      divider: (text4) => color.hex("#666666")(text4),
      prompt: (text4) => prompt2.bold(text4),
      number: (text4) => number2.bold(text4),
      intro: (text4) => color.bgHex(activeBrand.primary).white(` ${getThemeConfig().label} - ${text4} `),
      get resolvedSymbol() {
        return active2("\u25C7");
      },
      get errorSymbol() {
        return color.hex("#cc0000")("\u25A0");
      },
      accent: (text4) => prompt2.bold(text4),
      muted: (text4) => color.hex("#666666")(text4),
      success: (text4) => color.hex("#008800")(text4),
      warning: (text4) => color.hex("#cc6600")(text4),
      error: (text4) => color.hex("#cc0000")(text4),
      info: (text4) => active2(text4),
      badge: (text4) => color.bgHex("#cc6600").white(` ${text4} `)
    }, {
      accent: { fg: isPurple ? "#006699" : activeBrand.primary, bold: true },
      muted: { fg: "#666666" },
      success: { fg: "#008800" },
      warning: { fg: "#cc6600" },
      error: { fg: "#cc0000" },
      info: { fg: activeBrand.primary }
    });
  }
  const active = brandColor(activeBrand, color.magenta);
  const activeBright = brandColor(activeBrand, color.magentaBright);
  const activeBackground = brandBackground(activeBrand, color.bgMagenta);
  const prompt = isPurple ? color.cyan : active;
  const number = isPurple ? color.cyanBright : active;
  return withStyles({
    header: (text4) => activeBright.bold(text4),
    divider: (text4) => color.dim(text4),
    prompt: (text4) => prompt(text4),
    number: (text4) => number(text4),
    intro: (text4) => activeBackground.white(` ${getThemeConfig().label} - ${text4} `),
    get resolvedSymbol() {
      return active("\u25C7");
    },
    get errorSymbol() {
      return color.red("\u25A0");
    },
    accent: (text4) => prompt(text4),
    muted: (text4) => color.dim(text4),
    success: (text4) => color.green(text4),
    warning: (text4) => color.yellow(text4),
    error: (text4) => color.red(text4),
    info: (text4) => active(text4),
    badge: (text4) => color.bgYellow.black(` ${text4} `)
  }, {
    accent: { fg: isPurple ? "cyan" : activeBrand.primary, bold: true },
    muted: { dim: true },
    success: { fg: "green" },
    warning: { fg: "yellow" },
    error: { fg: "red" },
    info: { fg: isPurple ? "magenta" : activeBrand.primary }
  });
}
var dark = createPalette(brands.purple, "dark");
var light = createPalette(brands.purple, "light");

// node_modules/toolcraft/node_modules/toolcraft-design/dist/tokens/typography.js
var typography = {
  bold: (text4) => color.bold(text4),
  dim: (text4) => color.dim(text4),
  italic: (text4) => color.italic(text4),
  underline: (text4) => color.underline(text4),
  strikethrough: (text4) => color.strikethrough(text4)
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/tokens/widths.js
var widths = {
  header: 60,
  helpColumn: 24,
  maxLine: 80
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/internal/output-format.js
import { AsyncLocalStorage } from "node:async_hooks";
var VALID_FORMATS = /* @__PURE__ */ new Set(["terminal", "markdown", "json"]);
var formatStorage = new AsyncLocalStorage();
var cached;
function resolveOutputFormat(env = process.env) {
  const scoped = formatStorage.getStore();
  if (scoped) {
    return scoped;
  }
  if (cached) {
    return cached;
  }
  const raw = env.OUTPUT_FORMAT?.toLowerCase();
  cached = VALID_FORMATS.has(raw) ? raw : "terminal";
  return cached;
}
function resetOutputFormatCache() {
  cached = void 0;
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/internal/theme-detect.js
function detectThemeFromEnv(env) {
  const apple = env.APPLE_INTERFACE_STYLE;
  if (typeof apple === "string") {
    return apple.toLowerCase() === "dark" ? "dark" : "light";
  }
  const vscodeKind = env.VSCODE_COLOR_THEME_KIND;
  if (typeof vscodeKind === "string") {
    const normalized = vscodeKind.toLowerCase();
    if (normalized.includes("light")) {
      return "light";
    }
    if (normalized.includes("dark")) {
      return "dark";
    }
  }
  const colorFGBG = env.COLORFGBG;
  if (typeof colorFGBG === "string") {
    const parts = colorFGBG.split(";").map((part) => Number.parseInt(part, 10));
    const background = parts.at(-1);
    if (Number.isFinite(background)) {
      return background >= 8 ? "light" : "dark";
    }
  }
  return void 0;
}
function resolveThemeName(env = process.env) {
  const raw = (env.POE_CODE_THEME ?? env.POE_THEME)?.toLowerCase();
  if (raw === "light" || raw === "dark") {
    return raw;
  }
  const detected = detectThemeFromEnv(env);
  if (detected) {
    return detected;
  }
  return "dark";
}
var themeCache = /* @__PURE__ */ new Map();
var cachedRevision = -1;
function getTheme(env) {
  const themeName = resolveThemeName(env);
  const config2 = getThemeConfig();
  const requestedBrand = env?.POE_BRAND?.toLowerCase();
  const activeBrandName = !isThemeBrandConfigured() && requestedBrand && Object.hasOwn(brands, requestedBrand) ? requestedBrand : config2.brand;
  const revision2 = getThemeRevision();
  if (revision2 !== cachedRevision) {
    themeCache.clear();
    cachedRevision = revision2;
  }
  const cacheKey = `${activeBrandName}:${themeName}`;
  const cachedTheme = themeCache.get(cacheKey);
  if (cachedTheme) {
    return cachedTheme;
  }
  const activeBrand = brands[activeBrandName];
  const theme = activeBrandName === "purple" ? themeName === "light" ? light : dark : createPalette(activeBrand, themeName);
  themeCache.set(cacheKey, theme);
  return theme;
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/text.js
function renderMarkdownInline(content) {
  return content.replaceAll("\r\n", " ").replaceAll("\n", " ").replaceAll("\r", " ");
}
function renderMarkdownCode(content) {
  const value = renderMarkdownInline(content);
  let longestRun = 0;
  let currentRun = 0;
  for (const char of value) {
    if (char === "`") {
      currentRun += 1;
      longestRun = Math.max(longestRun, currentRun);
      continue;
    }
    currentRun = 0;
  }
  const delimiter = "`".repeat(longestRun + 1);
  const paddedValue = value.startsWith("`") || value.endsWith("`") ? ` ${value} ` : value;
  return `${delimiter}${paddedValue}${delimiter}`;
}
function renderMarkdownLink(content) {
  const value = renderMarkdownInline(content);
  const label = value.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
  const url = value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
  return `[${label}](${url})`;
}
var text = {
  intro(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `**${content}**`;
    return getTheme().intro(content);
  },
  heading(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `## ${content}`;
    return getTheme().header(content);
  },
  section(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `**${content}**`;
    return typography.bold(content);
  },
  sectionHeader(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `## ${content}`;
    return typography.bold(content.toUpperCase());
  },
  command(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return renderMarkdownCode(content);
    return getTheme().accent(content);
  },
  argument(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `<${content}>`;
    return getTheme().muted(content);
  },
  option(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return renderMarkdownCode(content);
    return color.yellow(content);
  },
  example(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return renderMarkdownCode(content);
    return getTheme().muted(content);
  },
  usageCommand(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return renderMarkdownCode(content);
    return color.green(content);
  },
  link(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return renderMarkdownLink(content);
    return getTheme().accent(content);
  },
  muted(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `*${content}*`;
    return getTheme().muted(content);
  },
  error(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `**${content}**`;
    return getTheme().error(content);
  },
  badge(content) {
    const format = resolveOutputFormat();
    if (format === "json")
      return content;
    if (format === "markdown")
      return `[${content}]`;
    return getTheme().badge(content);
  },
  selectLabel(label, detail) {
    if (!detail) {
      return label;
    }
    const format = resolveOutputFormat();
    if (format !== "terminal") {
      return `${label} \u2014 ${detail}`;
    }
    return `${label} ${typography.dim("\u2014")} ${typography.dim(detail)}`;
  }
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/symbols.js
var symbols = {
  get info() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "info";
    if (format === "markdown")
      return "(i)";
    return color.magenta("\u25CF");
  },
  get success() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "success";
    if (format === "markdown")
      return "[ok]";
    return color.magenta("\u25C6");
  },
  get resolved() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "resolved";
    if (format === "markdown")
      return ">";
    return getTheme().resolvedSymbol;
  },
  get errorResolved() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "error";
    if (format === "markdown")
      return "[!]";
    return getTheme().errorSymbol;
  },
  get bar() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "";
    if (format === "markdown")
      return "|";
    return "\u2502";
  },
  cornerTopRight: "\u256E",
  cornerBottomRight: "\u256F",
  get warning() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "warning";
    if (format === "markdown")
      return "[!]";
    return "\u25B2";
  },
  get active() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "active";
    if (format === "markdown")
      return "[x]";
    return "\u25C6";
  },
  get inactive() {
    const format = resolveOutputFormat();
    if (format === "json")
      return "inactive";
    if (format === "markdown")
      return "[ ]";
    return "\u25CB";
  }
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/internal/strip-ansi.js
function stripAnsi(value) {
  let output = "";
  let index = 0;
  while (index < value.length) {
    const char = value[index];
    if (char === "\x1B") {
      index = skipEscapeSequence(value, index);
      continue;
    }
    if (char === "\x9B") {
      index = skipCsiSequence(value, index + 1);
      continue;
    }
    output += char;
    index += char.length;
  }
  return output;
}
function skipEscapeSequence(value, index) {
  const next = value[index + 1];
  if (next === "[") {
    return skipCsiSequence(value, index + 2);
  }
  if (next === "]") {
    return skipOscSequence(value, index + 2);
  }
  return Math.min(value.length, index + 2);
}
function skipCsiSequence(value, index) {
  while (index < value.length) {
    const codePoint = value.charCodeAt(index);
    index += 1;
    if (codePoint >= 64 && codePoint <= 126) {
      break;
    }
  }
  return index;
}
function skipOscSequence(value, index) {
  while (index < value.length) {
    if (value[index] === "\x07") {
      return index + 1;
    }
    if (value[index] === "\x1B" && value[index + 1] === "\\") {
      return index + 2;
    }
    index += 1;
  }
  return index;
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/primitives/log.js
function renderMarkdownInline2(value) {
  return stripAnsi(value).replaceAll("\r\n", " ").replaceAll("\n", " ").replaceAll("\r", " ");
}
function writeTerminalMessage(msg, { symbol: symbol2 = color.gray("\u2502"), secondarySymbol = color.gray("\u2502"), spacing: spacing2 = 1, withGuide = true } = {}) {
  const lines = [];
  const showGuide = withGuide !== false;
  const contentLines = msg.split("\n");
  const prefix = showGuide ? `${symbol2}  ` : "";
  const continuationPrefix = showGuide ? `${secondarySymbol}  ` : "";
  const emptyGuide = showGuide ? secondarySymbol : "";
  for (let index = 0; index < spacing2; index += 1) {
    lines.push(emptyGuide);
  }
  if (contentLines.length === 0) {
    process.stdout.write("\n");
    return;
  }
  const [firstLine = "", ...continuationLines] = contentLines;
  if (firstLine.length > 0) {
    lines.push(`${prefix}${firstLine}`);
  } else {
    lines.push(showGuide ? symbol2 : "");
  }
  for (const line of continuationLines) {
    if (line.length > 0) {
      lines.push(`${continuationPrefix}${line}`);
      continue;
    }
    lines.push(emptyGuide);
  }
  process.stdout.write(`${lines.join("\n")}
`);
}
function message(msg, options) {
  const format = resolveOutputFormat();
  if (format === "markdown") {
    process.stdout.write(`- ${renderMarkdownInline2(msg)}
`);
    return;
  }
  if (format === "json") {
    process.stdout.write(`${JSON.stringify({ level: "message", message: stripAnsi(msg) })}
`);
    return;
  }
  writeTerminalMessage(msg, options);
}
function info(msg) {
  const format = resolveOutputFormat();
  if (format === "markdown") {
    process.stdout.write(`- **info:** ${renderMarkdownInline2(msg)}
`);
    return;
  }
  if (format === "json") {
    process.stdout.write(`${JSON.stringify({ level: "info", message: stripAnsi(msg) })}
`);
    return;
  }
  message(msg, { symbol: symbols.info });
}
function success(msg) {
  const format = resolveOutputFormat();
  if (format === "markdown") {
    process.stdout.write(`- **success:** ${renderMarkdownInline2(msg)}
`);
    return;
  }
  if (format === "json") {
    process.stdout.write(`${JSON.stringify({ level: "success", message: stripAnsi(msg) })}
`);
    return;
  }
  message(msg, { symbol: symbols.success });
}
function warn(msg) {
  const format = resolveOutputFormat();
  if (format === "markdown") {
    process.stdout.write(`- **warning:** ${renderMarkdownInline2(msg)}
`);
    return;
  }
  if (format === "json") {
    process.stdout.write(`${JSON.stringify({ level: "warn", message: stripAnsi(msg) })}
`);
    return;
  }
  message(msg, { symbol: color.yellow("\u25B2") });
}
function error(msg) {
  const format = resolveOutputFormat();
  if (format === "markdown") {
    process.stdout.write(`- **error:** ${renderMarkdownInline2(msg)}
`);
    return;
  }
  if (format === "json") {
    process.stdout.write(`${JSON.stringify({ level: "error", message: stripAnsi(msg) })}
`);
    return;
  }
  message(msg, { symbol: color.red("\u25A0") });
}
var log = {
  info,
  success,
  message,
  warn,
  error
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/logger.js
function createLogger(emitter) {
  const emit = (level, message2) => {
    if (emitter) {
      emitter(message2);
      return;
    }
    if (level === "success") {
      log.success(message2);
      return;
    }
    if (level === "warn") {
      log.warn(message2);
      return;
    }
    if (level === "error") {
      log.error(message2);
      return;
    }
    log.info(message2);
  };
  return {
    info(message2) {
      emit("info", message2);
    },
    success(message2) {
      emit("success", message2);
    },
    warn(message2) {
      emit("warn", message2);
    },
    error(message2) {
      emit("error", message2);
    },
    resolved(label, value) {
      if (emitter) {
        emitter(`${label}: ${value}`);
        return;
      }
      log.message(`${label}
   ${value}`, { symbol: symbols.resolved });
    },
    errorResolved(label, value) {
      if (emitter) {
        emitter(`${label}: ${value}`);
        return;
      }
      log.message(`${label}
   ${value}`, { symbol: symbols.errorResolved });
    },
    message(message2, symbol2) {
      if (emitter) {
        emitter(message2);
        return;
      }
      log.message(message2, { symbol: symbol2 ?? color.gray("\u2502") });
    }
  };
}
var logger = createLogger();

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/help-formatter.js
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function normalizeInline(value) {
  return value.replaceAll("\r\n", " ").replaceAll("\n", " ").replaceAll("\r", " ");
}
function readControlSequence(value, index) {
  if (value[index] !== "\x1B") {
    return void 0;
  }
  if (value[index + 1] === "[") {
    let nextIndex = index + 2;
    while (nextIndex < value.length) {
      const code = value.charCodeAt(nextIndex);
      nextIndex += 1;
      if (code >= 64 && code <= 126) {
        return nextIndex;
      }
    }
    return value.length;
  }
  if (value[index + 1] === "]") {
    let nextIndex = index + 2;
    while (nextIndex < value.length) {
      if (value[nextIndex] === "\x07") {
        return nextIndex + 1;
      }
      if (value[nextIndex] === "\x1B" && value[nextIndex + 1] === "\\") {
        return nextIndex + 2;
      }
      nextIndex += 1;
    }
    return value.length;
  }
  return index + 1;
}
function isWideCodePoint(codePoint) {
  return codePoint >= 4352 && codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || codePoint >= 11904 && codePoint <= 42191 && codePoint !== 12351 || codePoint >= 44032 && codePoint <= 55203 || codePoint >= 63744 && codePoint <= 64255 || codePoint >= 65040 && codePoint <= 65049 || codePoint >= 65072 && codePoint <= 65135 || codePoint >= 65280 && codePoint <= 65376 || codePoint >= 65504 && codePoint <= 65510 || codePoint >= 9728 && codePoint <= 10175 || codePoint >= 127744 && codePoint <= 129791 || codePoint >= 131072 && codePoint <= 262141;
}
function clusterWidth(cluster) {
  const codePoints = Array.from(cluster).map((char) => char.codePointAt(0) ?? 0);
  if (codePoints.some((codePoint) => codePoint === 8205 || codePoint >= 65024 && codePoint <= 65039)) {
    return 2;
  }
  return codePoints.reduce((width, codePoint) => {
    if (codePoint === 0 || codePoint < 32 || codePoint >= 127 && codePoint < 160) {
      return width;
    }
    return width + (isWideCodePoint(codePoint) ? 2 : 1);
  }, 0);
}
function visibleWidth(value) {
  let width = 0;
  let index = 0;
  while (index < value.length) {
    const nextIndex = readControlSequence(value, index);
    if (nextIndex !== void 0) {
      index = nextIndex;
      continue;
    }
    const segment = graphemeSegmenter.segment(value.slice(index))[Symbol.iterator]().next().value;
    const cluster = segment?.segment ?? "";
    width += clusterWidth(cluster);
    index += cluster.length || 1;
  }
  return width;
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function padEndVisible(value, width) {
  return value + " ".repeat(Math.max(0, width - visibleWidth(value)));
}
function isWhitespace(char) {
  return char === " " || char === "\n" || char === "	" || char === "\r";
}
function splitWords(value) {
  const words = [];
  let word = "";
  for (const char of value) {
    if (isWhitespace(char)) {
      if (word) {
        words.push(word);
        word = "";
      }
      continue;
    }
    word += char;
  }
  if (word) {
    words.push(word);
  }
  return words;
}
function wrapWords(value, width) {
  const words = splitWords(value);
  if (words.length === 0) {
    return [""];
  }
  const lines = [];
  let line = "";
  for (const word of words) {
    if (!line) {
      line = word;
      continue;
    }
    if (visibleWidth(line) + 1 + visibleWidth(word) <= width) {
      line += ` ${word}`;
      continue;
    }
    lines.push(line);
    line = word;
  }
  lines.push(line);
  return lines;
}
function validateLayoutValue(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a finite non-negative number.`);
  }
}
function formatColumns(opts) {
  const rows = opts.rows.map((row) => ({
    left: normalizeInline(row.left),
    right: row.right
  }));
  if (rows.length === 0) {
    return "";
  }
  const totalWidth = opts.totalWidth ?? process.stdout.columns ?? 100;
  const minLeftWidth = opts.minLeftWidth ?? 12;
  const maxLeftWidth = opts.maxLeftWidth ?? 32;
  const gap = opts.gap ?? 3;
  const indent = opts.indent ?? 2;
  validateLayoutValue(totalWidth, "totalWidth");
  validateLayoutValue(minLeftWidth, "minLeftWidth");
  validateLayoutValue(maxLeftWidth, "maxLeftWidth");
  validateLayoutValue(gap, "gap");
  validateLayoutValue(indent, "indent");
  const maxLeftContentWidth = Math.max(...rows.map((row) => visibleWidth(row.left)));
  const leftWidth = clamp(maxLeftContentWidth + gap, minLeftWidth, maxLeftWidth);
  const rightWidth = Math.max(20, totalWidth - leftWidth - indent);
  const firstIndent = " ".repeat(indent);
  const continuationIndent = " ".repeat(indent + leftWidth);
  return rows.flatMap((row) => {
    if (row.right.length === 0) {
      return [`${firstIndent}${row.left}`];
    }
    const rightLines = wrapWords(row.right, rightWidth);
    if (visibleWidth(row.left) > leftWidth) {
      return [
        `${firstIndent}${row.left}`,
        ...rightLines.map((line) => `${continuationIndent}${line}`)
      ];
    }
    const firstLine = `${firstIndent}${padEndVisible(row.left, leftWidth)}${rightLines[0]}`;
    const continuationLines = rightLines.slice(1).map((line) => `${continuationIndent}${line}`);
    return [firstLine, ...continuationLines];
  }).join("\n");
}
function formatCommandList(commands) {
  return formatColumns({
    rows: commands.map((cmd) => ({
      left: text.command(cmd.name),
      right: cmd.description
    }))
  });
}
function formatOptionList(options) {
  return formatColumns({
    rows: options.map((opt) => ({
      left: text.option(opt.flags),
      right: opt.description
    }))
  });
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/help-formatter-plain.js
var help_formatter_plain_exports = {};
__export(help_formatter_plain_exports, {
  formatColumns: () => formatColumns2,
  formatCommandList: () => formatCommandList2,
  formatOptionList: () => formatOptionList2,
  stripAnsi: () => stripAnsi2
});
function stripAnsi2(value) {
  let output = "";
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "\x1B") {
      if (value[index + 1] === "[") {
        index += 2;
        while (index < value.length) {
          const code = value.charCodeAt(index);
          if (code >= 64 && code <= 126) {
            break;
          }
          index += 1;
        }
      }
      continue;
    }
    output += value[index];
  }
  return output;
}
function toAscii(value) {
  let output = "";
  const stripped = stripAnsi2(value);
  for (let index = 0; index < stripped.length; index += 1) {
    const code = stripped.charCodeAt(index);
    output += code <= 127 ? stripped[index] : "?";
  }
  return output;
}
function clamp2(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function padEndVisible2(value, width) {
  return value + " ".repeat(Math.max(0, width - value.length));
}
function isWhitespace2(char) {
  return char === " " || char === "\n" || char === "	" || char === "\r";
}
function splitWords2(value) {
  const words = [];
  let word = "";
  for (const char of value) {
    if (isWhitespace2(char)) {
      if (word) {
        words.push(word);
        word = "";
      }
      continue;
    }
    word += char;
  }
  if (word) {
    words.push(word);
  }
  return words;
}
function wrapWords2(value, width) {
  const words = splitWords2(value);
  if (words.length === 0) {
    return [""];
  }
  const lines = [];
  let line = "";
  for (const word of words) {
    if (!line) {
      line = word;
      continue;
    }
    if (line.length + 1 + word.length <= width) {
      line += ` ${word}`;
      continue;
    }
    lines.push(line);
    line = word;
  }
  lines.push(line);
  return lines;
}
function formatColumns2(opts) {
  const rows = opts.rows.map((row) => ({
    left: toAscii(row.left),
    right: toAscii(row.right)
  }));
  if (rows.length === 0) {
    return "";
  }
  const totalWidth = opts.totalWidth ?? process.stdout.columns ?? 100;
  const minLeftWidth = opts.minLeftWidth ?? 12;
  const maxLeftWidth = opts.maxLeftWidth ?? 32;
  const gap = opts.gap ?? 3;
  const indent = opts.indent ?? 2;
  const maxLeftContentWidth = Math.max(...rows.map((row) => row.left.length));
  const leftWidth = clamp2(maxLeftContentWidth + gap, minLeftWidth, maxLeftWidth);
  const rightWidth = Math.max(20, totalWidth - leftWidth - indent);
  const firstIndent = " ".repeat(indent);
  const continuationIndent = " ".repeat(indent + leftWidth);
  return rows.flatMap((row) => {
    if (row.right.length === 0) {
      return [`${firstIndent}${row.left}`];
    }
    const rightLines = wrapWords2(row.right, rightWidth);
    if (row.left.length > leftWidth) {
      return [
        `${firstIndent}${row.left}`,
        ...rightLines.map((line) => `${continuationIndent}${line}`)
      ];
    }
    const firstLine = `${firstIndent}${padEndVisible2(row.left, leftWidth)}${rightLines[0]}`;
    const continuationLines = rightLines.slice(1).map((line) => `${continuationIndent}${line}`);
    return [firstLine, ...continuationLines];
  }).join("\n");
}
function formatCommandList2(commands) {
  return formatColumns2({
    rows: commands.map((cmd) => ({
      left: cmd.name,
      right: cmd.description
    }))
  });
}
function formatOptionList2(options) {
  return formatColumns2({
    rows: options.map((opt) => ({
      left: opt.flags,
      right: opt.description
    }))
  });
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/table.js
var reset2 = "\x1B[0m";
var ellipsis = "\u2026";
var graphemeSegmenter2 = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function getCell(row, name) {
  return Object.prototype.hasOwnProperty.call(row, name) ? row[name] ?? "" : "";
}
function renderMarkdownCell(value) {
  return stripAnsi(value).replaceAll("\r\n", " ").replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("|", "\\|");
}
function isAnsiSequence(value, index) {
  return value[index] === "\x1B" && value[index + 1] === "[";
}
function readAnsiSequence(value, index) {
  let nextIndex = index + 2;
  while (nextIndex < value.length && value[nextIndex] !== "m") {
    nextIndex += 1;
  }
  if (nextIndex < value.length) {
    nextIndex += 1;
  }
  return { sequence: value.slice(index, nextIndex), nextIndex };
}
function isCombiningCodePoint(codePoint) {
  return codePoint >= 768 && codePoint <= 879 || codePoint >= 6832 && codePoint <= 6911 || codePoint >= 7616 && codePoint <= 7679 || codePoint >= 8400 && codePoint <= 8447 || codePoint >= 65056 && codePoint <= 65071;
}
function isWideCodePoint2(codePoint) {
  return codePoint >= 4352 && codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || codePoint >= 11904 && codePoint <= 42191 && codePoint !== 12351 || codePoint >= 44032 && codePoint <= 55203 || codePoint >= 63744 && codePoint <= 64255 || codePoint >= 65040 && codePoint <= 65049 || codePoint >= 65072 && codePoint <= 65135 || codePoint >= 65280 && codePoint <= 65376 || codePoint >= 65504 && codePoint <= 65510 || codePoint >= 9728 && codePoint <= 10175 || codePoint >= 127744 && codePoint <= 129791 || codePoint >= 131072 && codePoint <= 262141;
}
function isEmojiClusterCodePoint(codePoint) {
  return codePoint >= 127462 && codePoint <= 127487 || codePoint >= 127744 && codePoint <= 129791 || codePoint >= 9728 && codePoint <= 10175;
}
function codePointWidth(char) {
  const codePoint = char.codePointAt(0) ?? 0;
  if (codePoint === 0 || codePoint < 32 || codePoint >= 127 && codePoint < 160) {
    return 0;
  }
  if (codePoint === 8205 || codePoint >= 65024 && codePoint <= 65039 || isCombiningCodePoint(codePoint)) {
    return 0;
  }
  return isWideCodePoint2(codePoint) ? 2 : 1;
}
function readPrintableCluster(value, index) {
  const nextAnsiIndex = value.indexOf("\x1B[", index);
  const plainText = value.slice(index, nextAnsiIndex === -1 ? void 0 : nextAnsiIndex);
  const firstSegment = graphemeSegmenter2.segment(plainText)[Symbol.iterator]().next().value;
  return firstSegment?.segment ?? Array.from(plainText)[0] ?? "";
}
function clusterWidth2(cluster) {
  const codePoints = Array.from(cluster).map((char) => char.codePointAt(0) ?? 0);
  const isEmojiCluster = codePoints.length > 1 && codePoints.some((codePoint) => codePoint === 8205 || codePoint >= 65024 && codePoint <= 65039 || isEmojiClusterCodePoint(codePoint));
  if (isEmojiCluster) {
    return 2;
  }
  return codePoints.reduce((width, codePoint) => width + codePointWidth(String.fromCodePoint(codePoint)), 0);
}
function displayWidth(value) {
  let width = 0;
  let index = 0;
  while (index < value.length) {
    if (isAnsiSequence(value, index)) {
      index = readAnsiSequence(value, index).nextIndex;
      continue;
    }
    const cluster = readPrintableCluster(value, index);
    width += clusterWidth2(cluster);
    index += cluster.length;
  }
  return width;
}
function truncateToWidth(value, width) {
  if (displayWidth(value) <= width) {
    return value;
  }
  if (width <= 0) {
    return "";
  }
  const targetWidth = width <= 1 ? 0 : width - displayWidth(ellipsis);
  let output = "";
  let currentWidth = 0;
  let index = 0;
  let sawAnsi = false;
  while (index < value.length) {
    if (isAnsiSequence(value, index)) {
      const ansi = readAnsiSequence(value, index);
      sawAnsi = true;
      output += ansi.sequence;
      index = ansi.nextIndex;
      continue;
    }
    const cluster = readPrintableCluster(value, index);
    const width2 = clusterWidth2(cluster);
    if (currentWidth + width2 > targetWidth) {
      break;
    }
    output += cluster;
    currentWidth += width2;
    index += cluster.length;
  }
  return `${output}${ellipsis}${sawAnsi ? reset2 : ""}`;
}
function padCell(value, width, alignment) {
  const visibleWidth2 = displayWidth(value);
  const padding = Math.max(0, width - visibleWidth2);
  if (alignment === "right") {
    return `${" ".repeat(padding)}${value}`;
  }
  if (alignment === "center") {
    const left = Math.floor(padding / 2);
    const right = padding - left;
    return `${" ".repeat(left)}${value}${" ".repeat(right)}`;
  }
  return `${value}${" ".repeat(padding)}`;
}
function getAlignment(column) {
  const alignment = column.alignment;
  return alignment === "right" || alignment === "center" ? alignment : "left";
}
function getColumnWidth(column) {
  if (!Number.isFinite(column.maxLen) || column.maxLen <= 0) {
    throw new Error("maxLen must be a positive finite number.");
  }
  const configuredMin = column.minLen;
  const minWidth = Math.max(1, configuredMin ?? 1);
  return Math.max(minWidth, column.maxLen);
}
function computeColumns(columns) {
  return columns.map((column) => ({
    name: column.name,
    title: column.title,
    alignment: getAlignment(column),
    width: getColumnWidth(column)
  }));
}
function renderBorder(columns, theme, parts) {
  const horizontal = theme.muted("\u2500");
  const segments = columns.map((column) => horizontal.repeat(column.width + 2));
  return [
    theme.muted(parts.left),
    segments.join(theme.muted(parts.mid)),
    theme.muted(parts.right)
  ].join("");
}
function renderTerminalRow(values, columns, theme) {
  const vertical = theme.muted("\u2502");
  const cells = values.map((value, index) => {
    const column = columns[index];
    const truncated = truncateToWidth(value, column.width);
    return ` ${padCell(truncated, column.width, column.alignment)} `;
  });
  return `${vertical}${cells.join(vertical)}${vertical}`;
}
function wrapDetailValue(value, width) {
  const lines = [];
  for (const paragraph of value.split("\n")) {
    let line = "";
    for (const rawWord of paragraph.split(" ")) {
      const words = [];
      let word = rawWord;
      while (displayWidth(word) > width) {
        let chunk = "";
        let index = 0;
        while (index < word.length) {
          const cluster = readPrintableCluster(word, index);
          if (displayWidth(`${chunk}${cluster}`) > width) {
            break;
          }
          chunk += cluster;
          index += cluster.length;
        }
        words.push(chunk);
        word = word.slice(chunk.length);
      }
      words.push(word);
      for (const word2 of words) {
        if (line.length === 0) {
          line = word2;
          continue;
        }
        if (displayWidth(`${line} ${word2}`) <= width) {
          line = `${line} ${word2}`;
          continue;
        }
        lines.push(line);
        line = word2;
      }
    }
    lines.push(line);
  }
  return lines.length > 0 ? lines : [""];
}
function renderTableTerminal(options) {
  const { theme, columns, rows } = options;
  const computedColumns = computeColumns(columns);
  if (options.variant === "detail") {
    const labelColumn = computedColumns[0];
    const valueColumn = computedColumns[1];
    if (!labelColumn || !valueColumn) {
      return "";
    }
    const detailLabelWidth = widths.helpColumn + 12;
    const labelWidth = Math.min(labelColumn.width, detailLabelWidth);
    const valueWidth = Math.max(20, (options.maxWidth ?? widths.maxLine) - labelWidth - 2);
    const continuation = " ".repeat(labelWidth + 2);
    return rows.flatMap((row) => {
      const label = truncateToWidth(getCell(row, labelColumn.name), labelWidth);
      const values = wrapDetailValue(getCell(row, valueColumn.name), valueWidth);
      if (values.length === 1 && values[0] === "") {
        return [theme.header(label)];
      }
      return [
        `${theme.muted(padCell(label, labelWidth, "left"))}  ${values[0] ?? ""}`,
        ...values.slice(1).map((value) => `${continuation}${value}`)
      ];
    }).join("\n");
  }
  const separatorOptions = options;
  const includeRowSeparators = separatorOptions.rowSeparator === true || separatorOptions.rowSeparators === true;
  const top = renderBorder(computedColumns, theme, { left: "\u250C", mid: "\u252C", right: "\u2510" });
  const header = renderTerminalRow(computedColumns.map((column) => theme.header(column.title)), computedColumns, theme);
  const headerBottom = renderBorder(computedColumns, theme, { left: "\u251C", mid: "\u253C", right: "\u2524" });
  const bottom = renderBorder(computedColumns, theme, { left: "\u2514", mid: "\u2534", right: "\u2518" });
  const renderedRows = [];
  for (const [index, row] of rows.entries()) {
    if (includeRowSeparators && index > 0) {
      renderedRows.push(headerBottom);
    }
    renderedRows.push(renderTerminalRow(computedColumns.map((column) => getCell(row, column.name)), computedColumns, theme));
  }
  return [top, header, headerBottom, ...renderedRows, bottom].join("\n");
}
function renderTableMarkdown(options) {
  const { columns, rows } = options;
  const header = `| ${columns.map((c) => renderMarkdownCell(c.title)).join(" | ")} |`;
  const separator = `| ${columns.map((c) => {
    const alignment = getAlignment(c);
    if (alignment === "right") {
      return "---:";
    }
    if (alignment === "center") {
      return ":---:";
    }
    return ":---";
  }).join(" | ")} |`;
  const dataRows = rows.map((row) => `| ${columns.map((c) => renderMarkdownCell(getCell(row, c.name))).join(" | ")} |`);
  return [header, separator, ...dataRows].join("\n");
}
function renderTableJson(options) {
  const { columns, rows } = options;
  const cleaned = rows.map((row) => {
    const obj = /* @__PURE__ */ Object.create(null);
    for (const col of columns) {
      obj[col.name] = stripAnsi(getCell(row, col.name));
    }
    return obj;
  });
  return JSON.stringify(cleaned, null, 2);
}
function renderTable(options) {
  const format = resolveOutputFormat();
  switch (format) {
    case "markdown":
      return renderTableMarkdown(options);
    case "json":
      return renderTableJson(options);
    default:
      return renderTableTerminal(options);
  }
}

// node_modules/fast-string-truncated-width/dist/utils.js
var getCodePointsLength = /* @__PURE__ */ (() => {
  const SURROGATE_PAIR_RE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return (input) => {
    let surrogatePairsNr = 0;
    SURROGATE_PAIR_RE.lastIndex = 0;
    while (SURROGATE_PAIR_RE.test(input)) {
      surrogatePairsNr += 1;
    }
    return input.length - surrogatePairsNr;
  };
})();
var isFullWidth = (x) => {
  return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
var isWideNotCJKTNotEmoji = (x) => {
  return x === 8987 || x === 9001 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};

// node_modules/fast-string-truncated-width/dist/index.js
var ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y;
var CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var CJKT_WIDE_RE = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/yu;
var TAB_RE = /\t{1,1000}/y;
var EMOJI_RE = new RegExp("[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F\\u20E3?))*", "yu");
var LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var MODIFIER_RE = new RegExp("\\p{M}+", "gu");
var NO_TRUNCATION = { limit: Infinity, ellipsis: "" };
var getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? "";
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION, widthOptions).width : 0);
  const ANSI_WIDTH = 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
  const TAB_WIDTH = widthOptions.tabWidth ?? 8;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? FULL_WIDTH_WIDTH;
  const PARSE_BLOCKS = [
    [LATIN_RE, REGULAR_WIDTH],
    [ANSI_RE, ANSI_WIDTH],
    [CONTROL_RE, CONTROL_WIDTH],
    [TAB_RE, TAB_WIDTH],
    [EMOJI_RE, EMOJI_WIDTH],
    [CJKT_WIDE_RE, WIDE_WIDTH]
  ];
  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;
  outer: while (true) {
    if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
      const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
      lengthExtra = 0;
      for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
        const codePoint = char.codePointAt(0) || 0;
        if (isFullWidth(codePoint)) {
          widthExtra = FULL_WIDTH_WIDTH;
        } else if (isWideNotCJKTNotEmoji(codePoint)) {
          widthExtra = WIDE_WIDTH;
        } else {
          widthExtra = REGULAR_WIDTH;
        }
        if (width + widthExtra > truncationLimit) {
          truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
        }
        if (width + widthExtra > LIMIT) {
          truncationEnabled = true;
          break outer;
        }
        lengthExtra += char.length;
        width += widthExtra;
      }
      unmatchedStart = unmatchedEnd = 0;
    }
    if (index >= length) {
      break outer;
    }
    for (let i = 0, l = PARSE_BLOCKS.length; i < l; i++) {
      const [BLOCK_RE, BLOCK_WIDTH] = PARSE_BLOCKS[i];
      BLOCK_RE.lastIndex = index;
      if (BLOCK_RE.test(input)) {
        lengthExtra = BLOCK_RE === CJKT_WIDE_RE ? getCodePointsLength(input.slice(index, BLOCK_RE.lastIndex)) : BLOCK_RE === EMOJI_RE ? 1 : BLOCK_RE.lastIndex - index;
        widthExtra = lengthExtra * BLOCK_WIDTH;
        if (width + widthExtra > truncationLimit) {
          truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / BLOCK_WIDTH));
        }
        if (width + widthExtra > LIMIT) {
          truncationEnabled = true;
          break outer;
        }
        width += widthExtra;
        unmatchedStart = indexPrev;
        unmatchedEnd = index;
        index = indexPrev = BLOCK_RE.lastIndex;
        continue outer;
      }
    }
    index += 1;
  }
  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };
};
var dist_default = getStringTruncatedWidth;

// node_modules/fast-string-width/dist/index.js
var NO_TRUNCATION2 = {
  limit: Infinity,
  ellipsis: "",
  ellipsisWidth: 0
};
var fastStringWidth = (input, options = {}) => {
  return dist_default(input, NO_TRUNCATION2, options).width;
};
var dist_default2 = fastStringWidth;

// node_modules/fast-wrap-ansi/lib/main.js
var ESC = "\x1B";
var CSI = "\x9B";
var END_CODE = 39;
var ANSI_ESCAPE_BELL = "\x07";
var ANSI_CSI = "[";
var ANSI_OSC = "]";
var ANSI_SGR_TERMINATOR = "m";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
var GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
var getClosingCode = (openingCode) => {
  if (openingCode >= 30 && openingCode <= 37)
    return 39;
  if (openingCode >= 90 && openingCode <= 97)
    return 39;
  if (openingCode >= 40 && openingCode <= 47)
    return 49;
  if (openingCode >= 100 && openingCode <= 107)
    return 49;
  if (openingCode === 1 || openingCode === 2)
    return 22;
  if (openingCode === 3)
    return 23;
  if (openingCode === 4)
    return 24;
  if (openingCode === 7)
    return 27;
  if (openingCode === 8)
    return 28;
  if (openingCode === 9)
    return 29;
  if (openingCode === 0)
    return 0;
  return void 0;
};
var wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
var wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
var wrapWord = (rows, word, columns) => {
  const characters = word[Symbol.iterator]();
  let isInsideEscape = false;
  let isInsideLinkEscape = false;
  let lastRow = rows.at(-1);
  let visible = lastRow === void 0 ? 0 : dist_default2(lastRow);
  let currentCharacter = characters.next();
  let nextCharacter = characters.next();
  let rawCharacterIndex = 0;
  while (!currentCharacter.done) {
    const character = currentCharacter.value;
    const characterLength = dist_default2(character);
    if (visible + characterLength <= columns) {
      rows[rows.length - 1] += character;
    } else {
      rows.push(character);
      visible = 0;
    }
    if (character === ESC || character === CSI) {
      isInsideEscape = true;
      isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
    }
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL) {
          isInsideEscape = false;
          isInsideLinkEscape = false;
        }
      } else if (character === ANSI_SGR_TERMINATOR) {
        isInsideEscape = false;
      }
    } else {
      visible += characterLength;
      if (visible === columns && !nextCharacter.done) {
        rows.push("");
        visible = 0;
      }
    }
    currentCharacter = nextCharacter;
    nextCharacter = characters.next();
    rawCharacterIndex += character.length;
  }
  lastRow = rows.at(-1);
  if (!visible && lastRow !== void 0 && lastRow.length && rows.length > 1) {
    rows[rows.length - 2] += rows.pop();
  }
};
var stringVisibleTrimSpacesRight = (string) => {
  const words = string.split(" ");
  let last = words.length;
  while (last) {
    if (dist_default2(words[last - 1])) {
      break;
    }
    last--;
  }
  if (last === words.length) {
    return string;
  }
  return words.slice(0, last).join(" ") + words.slice(last).join("");
};
var exec = (string, columns, options = {}) => {
  if (options.trim !== false && string.trim() === "") {
    return "";
  }
  let returnValue = "";
  let escapeCode;
  let escapeUrl;
  const words = string.split(" ");
  let rows = [""];
  let rowLength = 0;
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    if (options.trim !== false) {
      const row = rows.at(-1) ?? "";
      const trimmed = row.trimStart();
      if (row.length !== trimmed.length) {
        rows[rows.length - 1] = trimmed;
        rowLength = dist_default2(trimmed);
      }
    }
    if (index !== 0) {
      if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
        rows.push("");
        rowLength = 0;
      }
      if (rowLength || options.trim === false) {
        rows[rows.length - 1] += " ";
        rowLength++;
      }
    }
    const wordLength = dist_default2(word);
    if (options.hard && wordLength > columns) {
      const remainingColumns = columns - rowLength;
      const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
      const breaksStartingNextLine = Math.floor((wordLength - 1) / columns);
      if (breaksStartingNextLine < breaksStartingThisLine) {
        rows.push("");
      }
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    if (rowLength + wordLength > columns && rowLength && wordLength) {
      if (options.wordWrap === false && rowLength < columns) {
        wrapWord(rows, word, columns);
        rowLength = dist_default2(rows.at(-1) ?? "");
        continue;
      }
      rows.push("");
      rowLength = 0;
    }
    if (rowLength + wordLength > columns && options.wordWrap === false) {
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    rows[rows.length - 1] += word;
    rowLength += wordLength;
  }
  if (options.trim !== false) {
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  }
  const preString = rows.join("\n");
  let inSurrogate = false;
  for (let i = 0; i < preString.length; i++) {
    const character = preString[i];
    returnValue += character;
    if (!inSurrogate) {
      inSurrogate = character >= "\uD800" && character <= "\uDBFF";
      if (inSurrogate) {
        continue;
      }
    } else {
      inSurrogate = false;
    }
    if (character === ESC || character === CSI) {
      GROUP_REGEX.lastIndex = i + 1;
      const groupsResult = GROUP_REGEX.exec(preString);
      const groups = groupsResult?.groups;
      if (groups?.code !== void 0) {
        const code = Number.parseFloat(groups.code);
        escapeCode = code === END_CODE ? void 0 : code;
      } else if (groups?.uri !== void 0) {
        escapeUrl = groups.uri.length === 0 ? void 0 : groups.uri;
      }
    }
    if (preString[i + 1] === "\n") {
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink("");
      }
      const closingCode = escapeCode ? getClosingCode(escapeCode) : void 0;
      if (escapeCode && closingCode) {
        returnValue += wrapAnsiCode(closingCode);
      }
    } else if (character === "\n") {
      if (escapeCode && getClosingCode(escapeCode)) {
        returnValue += wrapAnsiCode(escapeCode);
      }
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink(escapeUrl);
      }
    }
  }
  return returnValue;
};
var CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options) {
  return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options)).join("\n");
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/components/detail-card.js
function wrap(value, width) {
  return wrapAnsi(value, Math.max(1, width), { hard: true, trim: true }).split("\n");
}
function renderRows(rows, theme, width) {
  if (rows.length === 0)
    return [];
  const labelWidth = Math.max(...rows.map((row) => dist_default2(row.label)));
  const valueWidth = Math.max(20, width - labelWidth - 2);
  const continuation = " ".repeat(labelWidth + 2);
  return rows.flatMap((row) => {
    const values = wrap(row.value, valueWidth);
    return [
      `${theme.muted(row.label.padEnd(labelWidth))}  ${values[0] ?? ""}`,
      ...values.slice(1).map((value) => `${continuation}${value}`)
    ];
  });
}
function renderDetailCard(options) {
  const width = options.width ?? widths.maxLine;
  const identity = [
    options.theme.header(options.title),
    options.subtitle ? options.theme.muted(options.subtitle) : void 0
  ].filter((value) => value !== void 0).join("  ");
  const hero = options.badges?.length ? `${identity}
${options.theme.muted(options.badges.map((badge) => badge[0] + badge.slice(1).toLowerCase()).join(" \xB7 "))}` : identity;
  const blocks = [hero];
  for (const prose of options.prose ?? []) {
    blocks.push(prose.title ? [options.theme.header(prose.title), wrap(prose.value, width).join("\n")].join("\n") : wrap(prose.value, width).join("\n"));
  }
  for (const section of options.sections ?? []) {
    if (section.rows.length === 0)
      continue;
    const rows = renderRows(section.rows, options.theme, width);
    blocks.push(section.title ? [options.theme.header(section.title), ...rows].join("\n") : rows.join("\n"));
  }
  return blocks.join("\n\n");
}

// node_modules/toolcraft/node_modules/@poe-code/frontmatter/dist/parse.js
var import_yaml = __toESM(require_dist(), 1);

// node_modules/toolcraft/node_modules/@poe-code/frontmatter/dist/stringify.js
var import_yaml2 = __toESM(require_dist(), 1);

// node_modules/toolcraft/node_modules/toolcraft-design/dist/terminal-markdown/parser/block.js
var SOURCE_OFFSETS = Symbol("sourceOffsets");

// node_modules/toolcraft/node_modules/toolcraft-design/dist/dashboard/terminal-width.js
var graphemeSegmenter3 = new Intl.Segmenter(void 0, { granularity: "grapheme" });

// node_modules/toolcraft/node_modules/toolcraft-design/dist/acp/writer.js
import { AsyncLocalStorage as AsyncLocalStorage2 } from "node:async_hooks";
var storage = new AsyncLocalStorage2();

// node_modules/toolcraft/node_modules/toolcraft-design/dist/explorer/state.js
var REGION_HEADER = 1 << 0;
var REGION_LIST = 1 << 1;
var REGION_DETAIL = 1 << 2;
var REGION_FOOTER = 1 << 3;
var REGION_MODAL = 1 << 4;
var REGION_TOAST = 1 << 5;
var REGION_ALL = REGION_HEADER | REGION_LIST | REGION_DETAIL | REGION_FOOTER | REGION_MODAL | REGION_TOAST;

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/glyphs.js
function supportsUnicode() {
  if (!process.platform.startsWith("win")) {
    return process.env.TERM !== "linux";
  }
  return Boolean(process.env.CI || process.env.WT_SESSION || process.env.TERMINUS_SUBLIME || process.env.ConEmuTask === "{cmd::Cmder}" || process.env.TERM_PROGRAM === "Terminus-Sublime" || process.env.TERM_PROGRAM === "vscode" || process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty" || process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm");
}
var UNICODE = supportsUnicode();
function glyph(unicode, ascii) {
  return UNICODE ? unicode : ascii;
}
var GLYPHS = {
  stepActive: glyph("\u25C6", "*"),
  stepCancel: glyph("\u25A0", "x"),
  stepError: glyph("\u25B2", "x"),
  stepSubmit: glyph("\u25C7", "o"),
  barStart: glyph("\u250C", "T"),
  bar: glyph("\u2502", "|"),
  barEnd: glyph("\u2514", "-"),
  radioActive: glyph("\u25CF", ">"),
  radioInactive: glyph("\u25CB", " "),
  checkboxActive: glyph("\u25FB", "[ ]"),
  checkboxSelected: glyph("\u25FC", "[+]"),
  checkboxInactive: glyph("\u25FB", "[ ]"),
  passwordMask: glyph("\u2022", "*"),
  ellipsis: "..."
};
function symbol(state) {
  if (state === "cancel")
    return color.red(GLYPHS.stepCancel);
  if (state === "error")
    return color.yellow(GLYPHS.stepError);
  if (state === "submit")
    return color.green(GLYPHS.stepSubmit);
  return color.cyan(GLYPHS.stepActive);
}
function symbolBar(state) {
  if (state === "cancel")
    return color.red(GLYPHS.bar);
  if (state === "error")
    return color.yellow(GLYPHS.bar);
  if (state === "submit")
    return color.green(GLYPHS.bar);
  return color.cyan(GLYPHS.bar);
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/core.js
import { EventEmitter } from "node:events";
import * as readline from "node:readline";

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/cancel-symbol.js
var CANCEL = Symbol.for("poe.cancel");
function isCancel(value) {
  return value === CANCEL;
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/keys.js
var aliases = {
  k: "up",
  j: "down",
  h: "left",
  l: "right"
};
var keyActions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  space: "space",
  return: "enter",
  enter: "enter",
  escape: "cancel"
};
function mapKey(name, char) {
  if (char === "") {
    return "cancel";
  }
  if (char === " ") {
    return "space";
  }
  if (!name) {
    return void 0;
  }
  return keyActions[name] ?? aliases[name];
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/wrap.js
function getColumns(output) {
  return Math.max(1, output.columns ?? 80);
}
function getRows(output) {
  return Math.max(1, output.rows ?? 20);
}
function wrapFrame(output, frame) {
  return wrapAnsi(frame, getColumns(output), { hard: true, trim: false });
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/core.js
var cursor = {
  hide: "\x1B[?25l",
  show: "\x1B[?25h",
  move: (x, y) => {
    let output = "";
    if (x < 0)
      output += `\x1B[${-x}D`;
    if (x > 0)
      output += `\x1B[${x}C`;
    if (y < 0)
      output += `\x1B[${-y}A`;
    if (y > 0)
      output += `\x1B[${y}B`;
    return output;
  }
};
var erase = {
  down: "\x1B[J"
};
var Prompt = class extends EventEmitter {
  state = "initial";
  value;
  error = "";
  userInput = "";
  _cursor = 0;
  input;
  output;
  renderFrame;
  validate;
  signal;
  trackValue;
  previousFrame = "";
  readlineInterface;
  abortListener;
  closed = false;
  constructor(opts, trackValue = true) {
    super();
    this.input = opts.input ?? process.stdin;
    this.output = opts.output ?? process.stdout;
    this.renderFrame = opts.render;
    this.validate = opts.validate;
    this.signal = opts.signal;
    this.value = opts.initialValue;
    this.trackValue = trackValue;
    this.userInput = opts.initialUserInput ?? "";
    this._cursor = this.userInput.length;
  }
  get cursor() {
    return this._cursor;
  }
  prompt() {
    if (this.signal?.aborted) {
      this.state = "cancel";
      return Promise.resolve(CANCEL);
    }
    if (this.input.isTTY !== true) {
      return this.promptNonTty();
    }
    return new Promise((resolve2) => {
      const onSubmit = (value) => resolve2(value);
      const onCancel = () => resolve2(CANCEL);
      this.once("submit", onSubmit);
      this.once("cancel", onCancel);
      this.abortListener = () => {
        this.state = "cancel";
        this.emit("finalize");
        this.render();
        this.close();
      };
      this.signal?.addEventListener("abort", this.abortListener, { once: true });
      this.readlineInterface = readline.createInterface({
        input: this.input,
        output: void 0,
        tabSize: 2,
        prompt: "",
        escapeCodeTimeout: 50,
        terminal: true
      });
      readline.emitKeypressEvents(this.input, this.readlineInterface);
      this.readlineInterface.prompt();
      this.input.on("keypress", this.onKeypress);
      if (this.input.setRawMode) {
        this.input.setRawMode(true);
      }
      this.output.on("resize", this.render);
      this.render();
    });
  }
  promptNonTty() {
    return Promise.reject(new Error("Interactive prompt requires a TTY. Set POE_NO_PROMPT=1 to accept defaults non-interactively."));
  }
  readNonTtyLine() {
    return new Promise((resolve2) => {
      const rl = readline.createInterface({ input: this.input, terminal: false });
      let settled = false;
      const settle = (value) => {
        if (settled) {
          return;
        }
        settled = true;
        rl.close();
        resolve2(value);
      };
      rl.once("line", settle);
      rl.once("close", () => settle(rl.line));
    });
  }
  setValue(value) {
    this.value = value;
    this.emit("value", value);
  }
  setError(message2) {
    this.error = message2;
  }
  setUserInput(value) {
    this.userInput = value;
    this._cursor = Math.min(this._cursor, this.userInput.length);
    this.emit("userInput", this.userInput);
  }
  clearUserInput() {
    this.userInput = "";
    this._cursor = 0;
    this.emit("userInput", this.userInput);
  }
  onKeypress = (char, key2 = {}) => {
    let action = mapKey(key2.name, char);
    if (this.trackValue && char && char >= " " && key2.name !== "return" && key2.name !== "enter" && key2.name !== "escape") {
      action = void 0;
    }
    if (this.trackValue && action !== "enter") {
      this.updateTrackedInput(char, key2, action);
    }
    if (this.state === "error") {
      this.state = "active";
      this.error = "";
    }
    if (!this.trackValue && action) {
      this.emit("cursor", action);
    } else if (this.trackValue && action && action !== "enter") {
      this.emit("cursor", action);
    }
    if (char && /^[yn]$/i.test(char)) {
      this.emit("confirm", char.toLowerCase() === "y");
    }
    if (char) {
      this.emit("key", char.toLowerCase(), key2);
    }
    if (action === "enter") {
      const error3 = this.validate?.(this.value);
      if (error3) {
        this.error = error3 instanceof Error ? error3.message : error3;
        this.state = "error";
      } else {
        this.state = "submit";
      }
    }
    if (action === "cancel") {
      this.state = "cancel";
    }
    if (this.state === "submit" || this.state === "cancel") {
      this.emit("finalize");
    }
    this.render();
    if (this.state === "submit" || this.state === "cancel") {
      this.close();
    }
  };
  updateTrackedInput(char, key2, action) {
    if (key2.ctrl) {
      if (key2.name === "a") {
        this._cursor = 0;
        return;
      }
      if (key2.name === "e") {
        this._cursor = this.userInput.length;
        return;
      }
      if (key2.name === "u") {
        this.userInput = this.userInput.slice(this._cursor);
        this._cursor = 0;
        this.emit("userInput", this.userInput);
        return;
      }
      if (key2.name === "k") {
        this.userInput = this.userInput.slice(0, this._cursor);
        this.emit("userInput", this.userInput);
        return;
      }
    }
    if (action === "left") {
      this._cursor = Math.max(0, this._cursor - 1);
      return;
    }
    if (action === "right") {
      this._cursor = Math.min(this.userInput.length, this._cursor + 1);
      return;
    }
    if (action === "cancel" || action === "up" || action === "down" || action === "space") {
      return;
    }
    if (key2.name === "backspace" || char === "\b" || char === "\x7F") {
      if (this._cursor > 0) {
        this.userInput = `${this.userInput.slice(0, this._cursor - 1)}${this.userInput.slice(this._cursor)}`;
        this._cursor -= 1;
        this.emit("userInput", this.userInput);
      }
      return;
    }
    if (key2.name === "delete") {
      if (this._cursor < this.userInput.length) {
        this.userInput = `${this.userInput.slice(0, this._cursor)}${this.userInput.slice(this._cursor + 1)}`;
        this.emit("userInput", this.userInput);
      }
      return;
    }
    if (!char || char < " " || key2.ctrl) {
      return;
    }
    this.userInput = `${this.userInput.slice(0, this._cursor)}${char}${this.userInput.slice(this._cursor)}`;
    this._cursor += char.length;
    this.emit("userInput", this.userInput);
  }
  render = () => {
    if (this.closed) {
      return;
    }
    const frame = wrapFrame(this.output, this.renderFrame(this) ?? "");
    if (frame === this.previousFrame) {
      return;
    }
    if (!this.previousFrame) {
      this.output.write(`${cursor.hide}${frame}`);
      this.previousFrame = frame;
      if (this.state === "initial") {
        this.state = "active";
      }
      return;
    }
    const previousLineCount = this.previousFrame.split("\n").length - 1;
    this.output.write(`${cursor.move(-999, -previousLineCount)}${erase.down}${frame}`);
    this.previousFrame = frame;
  };
  close() {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.input.removeListener("keypress", this.onKeypress);
    this.output.removeListener("resize", this.render);
    if (this.abortListener) {
      this.signal?.removeEventListener("abort", this.abortListener);
    }
    this.output.write(`${cursor.show}
`);
    if (!process.platform.startsWith("win") && this.input.setRawMode) {
      this.input.setRawMode(false);
    }
    this.readlineInterface?.close();
    this.input.unpipe?.();
    if (this.state === "cancel") {
      this.emit("cancel");
    } else {
      this.emit("submit", this.value);
    }
    this.removeAllListeners();
  }
};

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/confirm.js
var ConfirmPrompt = class extends Prompt {
  constructor(opts) {
    super({
      ...opts,
      initialValue: opts.initialValue ?? true,
      render: (prompt) => renderConfirmPrompt(prompt, opts)
    }, false);
    this.on("confirm", (value) => {
      this.setValue(value);
      this.state = "submit";
      this.emit("finalize");
      this.render();
      this.close();
    });
    this.on("cursor", (action) => {
      if (action === "up" || action === "down" || action === "left" || action === "right") {
        this.setValue(!this.value);
      }
    });
  }
  promptNonTty() {
    if (process.env.POE_NO_PROMPT === "1") {
      return Promise.resolve(this.value ?? true);
    }
    return super.promptNonTty();
  }
};
function choices(value) {
  const yes = value ? `${color.green(GLYPHS.radioActive)} ${color.bold("Yes")}` : `${color.dim(GLYPHS.radioInactive)} ${color.dim("Yes")}`;
  const no = value ? `${color.dim(GLYPHS.radioInactive)} ${color.dim("No")}` : `${color.green(GLYPHS.radioActive)} ${color.bold("No")}`;
  return `${yes} ${color.dim("/")} ${no}`;
}
function renderConfirmPrompt(prompt, opts) {
  if (prompt.state === "submit") {
    return `${color.gray(GLYPHS.barStart)} ${symbol(prompt.state)} ${opts.message}
${color.gray(GLYPHS.bar)}  ${color.dim(prompt.value ? "Yes" : "No")}
${color.green(GLYPHS.barEnd)}`;
  }
  if (prompt.state === "cancel") {
    return `${color.gray(GLYPHS.barStart)} ${symbol(prompt.state)} ${opts.message}
${color.gray(GLYPHS.bar)}  ${color.dim.strikethrough(prompt.value ? "Yes" : "No")}
${color.red(GLYPHS.barEnd)}`;
  }
  return `${color.gray(GLYPHS.barStart)} ${symbol(prompt.state)} ${opts.message}
${symbolBar(prompt.state)}  ${choices(prompt.value)}
${color.cyan(GLYPHS.barEnd)}`;
}
function confirmPrompt(opts) {
  return new ConfirmPrompt(opts).prompt();
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/pagination.js
function countLines(values) {
  return values.reduce((sum, value) => sum + value.split("\n").length, 0);
}
function trimToRows(values, cursorOffset, rows, hasTop, hasBottom) {
  const output = [...values];
  while (countLines(output) > rows && output.length > 1) {
    const removeFromTop = hasTop && cursorOffset > 0;
    const removeFromBottom = hasBottom && cursorOffset < output.length - 1;
    if (removeFromTop) {
      output.shift();
      cursorOffset -= 1;
    } else if (removeFromBottom) {
      output.pop();
    } else {
      output.pop();
    }
  }
  return output;
}
function limitOptions(opts) {
  const { cursor: cursor2, options, style, output, maxItems = Number.POSITIVE_INFINITY, columnPadding = 0, rowPadding = 4 } = opts;
  if (options.length === 0) {
    return [];
  }
  const columns = Math.max(1, getColumns(output) - columnPadding);
  const rowBudget = Math.max(getRows(output) - rowPadding, 0);
  const visibleCount = Math.max(Math.min(maxItems, rowBudget), 5);
  const cappedVisibleCount = Math.min(visibleCount, options.length);
  let start = 0;
  if (cursor2 >= cappedVisibleCount - 3) {
    start = Math.max(Math.min(cursor2 - cappedVisibleCount + 3, options.length - cappedVisibleCount), 0);
  }
  const hasTopMarker = cappedVisibleCount < options.length && start > 0;
  const hasBottomMarker = cappedVisibleCount < options.length && start + cappedVisibleCount < options.length;
  const visible = options.slice(start, start + cappedVisibleCount).map((option, index) => wrapAnsi(style(option, start + index === cursor2), columns, { hard: true, trim: false }));
  const trimmed = trimToRows(visible, Math.max(cursor2 - start, 0), Math.max(rowBudget - Number(hasTopMarker) - Number(hasBottomMarker), 1), hasTopMarker, hasBottomMarker);
  if (hasTopMarker) {
    trimmed.unshift(color.dim(GLYPHS.ellipsis));
  }
  if (hasBottomMarker) {
    trimmed.push(color.dim(GLYPHS.ellipsis));
  }
  return trimmed;
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/select.js
var SelectPrompt = class extends Prompt {
  options;
  constructor(opts) {
    if (opts.options.length === 0) {
      throw new Error("Select prompt requires at least one option.");
    }
    if (opts.options.every((option) => option.disabled)) {
      throw new Error("Select prompt requires at least one enabled option.");
    }
    const initialIndex = Math.max(opts.options.findIndex((option) => option.value === opts.initialValue), 0);
    const cursor2 = findNonDisabled(initialIndex, 1, opts.options);
    super({
      ...opts,
      initialValue: opts.options[cursor2]?.value,
      render: (prompt) => renderSelectPrompt(prompt, opts)
    }, false);
    this.options = opts.options;
    this._cursor = cursor2;
    this.setValue(this.options[this._cursor]?.value);
    this.on("cursor", (action) => {
      if (action === "up" || action === "left") {
        this._cursor = findNonDisabled(this._cursor - 1, -1, this.options);
      } else if (action === "down" || action === "right") {
        this._cursor = findNonDisabled(this._cursor + 1, 1, this.options);
      }
      this.setValue(this.options[this._cursor]?.value);
    });
  }
  get visibleOptions() {
    return this.options;
  }
  promptNonTty() {
    if (process.env.POE_NO_PROMPT === "1") {
      return Promise.resolve(this.value);
    }
    return super.promptNonTty();
  }
};
function findNonDisabled(start, direction, options) {
  if (options.every((option) => option.disabled)) {
    return start;
  }
  let index = start;
  for (let checked = 0; checked < options.length; checked += 1) {
    index = (index + options.length) % options.length;
    if (!options[index]?.disabled) {
      return index;
    }
    index += direction;
  }
  return start;
}
function renderOption(option, active, submitted, cancelled) {
  const hint = option.hint ? color.dim(` (${option.hint})`) : "";
  if (submitted)
    return color.dim(option.label);
  if (cancelled)
    return color.dim.strikethrough(option.label);
  if (option.disabled)
    return `${color.gray(GLYPHS.radioInactive)} ${color.gray.strikethrough(option.label)}${hint}`;
  if (active)
    return `${color.green(GLYPHS.radioActive)} ${option.label}${hint}`;
  return `${color.dim(GLYPHS.radioInactive)} ${color.dim(option.label)}${hint}`;
}
function renderSelectPrompt(prompt, opts) {
  if (prompt.state === "submit" || prompt.state === "cancel") {
    const option = prompt.visibleOptions[prompt.cursor];
    const rendered = option ? renderOption(option, false, prompt.state === "submit", prompt.state === "cancel") : "";
    const end = prompt.state === "submit" ? color.green(GLYPHS.barEnd) : color.red(GLYPHS.barEnd);
    return `${color.gray(GLYPHS.barStart)} ${symbol(prompt.state)} ${opts.message}
${color.gray(GLYPHS.bar)}  ${rendered}
${end}`;
  }
  const lines = limitOptions({
    cursor: prompt.cursor,
    options: prompt.visibleOptions,
    output: opts.output ?? process.stdout,
    maxItems: opts.maxItems,
    columnPadding: 3,
    style: (option, active) => renderOption(option, active, false, false)
  }).map((line) => `${color.cyan(GLYPHS.bar)}  ${line}`);
  return `${color.gray(GLYPHS.barStart)} ${symbol(prompt.state)} ${opts.message}
${lines.join("\n")}
${color.cyan(GLYPHS.barEnd)}`;
}
function selectPrompt(opts) {
  return new SelectPrompt(opts).prompt();
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/interactive/text.js
var TextPrompt = class extends Prompt {
  constructor(opts) {
    const initialUserInput = opts.initialValue ?? "";
    super({
      ...opts,
      initialValue: initialUserInput,
      initialUserInput,
      render: (prompt) => renderTextPrompt(prompt, opts),
      validate: opts.validate
    });
    this.on("userInput", (value) => this.setValue(value));
    this.on("finalize", () => {
      if (this.state === "submit") {
        this.setValue(this.value || opts.defaultValue || "");
      }
    });
  }
  get userInputWithCursor() {
    if (this.state === "submit") {
      return this.userInput;
    }
    const before = this.userInput.slice(0, this.cursor);
    const current = this.userInput[this.cursor];
    const after = this.userInput.slice(this.cursor + 1);
    if (current) {
      return `${before}${color.inverse(current)}${after}`;
    }
    return `${before}${color.inverse("\u2588")}`;
  }
  promptNonTty() {
    return this.readNonTtyLine();
  }
};
function renderHeader2(prompt, message2) {
  return `${color.gray(GLYPHS.barStart)} ${symbol(prompt.state)} ${message2}`;
}
function renderTextPrompt(prompt, opts) {
  const value = prompt.value ?? "";
  if (prompt.state === "submit") {
    return `${renderHeader2(prompt, opts.message)}
${color.gray(GLYPHS.bar)}  ${color.dim(value)}
${color.green(GLYPHS.barEnd)}`;
  }
  if (prompt.state === "cancel") {
    return `${renderHeader2(prompt, opts.message)}
${color.gray(GLYPHS.bar)}  ${color.dim.strikethrough(value)}
${color.red(GLYPHS.barEnd)}`;
  }
  const input = prompt.userInput.length > 0 ? prompt.userInputWithCursor : opts.placeholder ? `${color.inverse(opts.placeholder[0] ?? " ")}${color.dim(opts.placeholder.slice(1))}` : color.inverse("_");
  if (prompt.state === "error") {
    return `${renderHeader2(prompt, opts.message)}
${symbolBar(prompt.state)}  ${input}
${color.yellow(GLYPHS.barEnd)}  ${color.yellow(prompt.error)}`;
  }
  return `${renderHeader2(prompt, opts.message)}
${symbolBar(prompt.state)}  ${input}
${color.cyan(GLYPHS.barEnd)}`;
}
function textPrompt(opts) {
  return new TextPrompt(opts).prompt();
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/primitives/cancel.js
function cancel(msg = "") {
  if (resolveOutputFormat() !== "terminal") {
    return;
  }
  process.stdout.write(`${color.gray("\u2514")}  ${color.red(msg)}

`);
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/primitives/note.js
function getVisibleWidth(value) {
  return stripAnsi(value).length;
}
function renderTerminalNote(message2, title) {
  const contentLines = ["", ...message2.split("\n"), ""];
  const visibleTitle = stripAnsi(title ?? "");
  const contentWidth = Math.max(visibleTitle.length, ...contentLines.map((line) => getVisibleWidth(line))) + 2;
  const titleLine = `${color.green("\u25C7")}  ${color.reset(title ?? "")} ${color.gray(`${"\u2500".repeat(Math.max(contentWidth - visibleTitle.length - 1, 1))}\u256E`)}`;
  const content = contentLines.map((line) => {
    const padding = " ".repeat(contentWidth - getVisibleWidth(line));
    return `${color.gray("\u2502")}  ${line}${padding}${color.gray("\u2502")}`;
  });
  const bottom = color.gray(`\u251C${"\u2500".repeat(contentWidth + 2)}\u256F`);
  return [color.gray("\u2502"), titleLine, ...content, bottom].join("\n");
}
function note(message2, title) {
  const format = resolveOutputFormat();
  const strippedMessage = stripAnsi(message2);
  const strippedTitle = stripAnsi(title ?? "").replaceAll("\r\n", " ").replaceAll("\n", " ").replaceAll("\r", " ");
  if (format === "markdown") {
    const lines = strippedMessage.split("\n");
    const heading = strippedTitle ? `> **${strippedTitle}**
` : "";
    const body = lines.map((line) => `> ${line}`).join("\n");
    process.stdout.write(`${heading}${body}
`);
    return;
  }
  if (format === "json") {
    process.stdout.write(`${JSON.stringify({
      type: "note",
      title: strippedTitle,
      message: strippedMessage
    })}
`);
    return;
  }
  process.stdout.write(`${renderTerminalNote(message2, title)}
`);
}

// node_modules/toolcraft/node_modules/toolcraft-design/dist/static/spinner.js
var SPINNER_FRAMES = Object.freeze(["\u25D2", "\u25D0", "\u25D3", "\u25D1"]);

// node_modules/toolcraft/node_modules/toolcraft-design/dist/prompts/index.js
async function select(opts) {
  return selectPrompt(opts);
}
async function text2(opts) {
  return textPrompt(opts);
}
async function confirm(opts) {
  return confirmPrompt(opts);
}

// node_modules/toolcraft/dist/index.js
import { fileURLToPath as fileURLToPath2 } from "node:url";

// node_modules/toolcraft/dist/user-error.js
var UserError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    this.name = "UserError";
  }
};
var ToolcraftBugError = class extends Error {
  constructor(message2) {
    super(message2);
    this.name = "ToolcraftBugError";
  }
};

// node_modules/toolcraft/dist/human-in-loop/types.js
var ApprovalDeclinedError = class extends UserError {
  reason;
  approvalId;
  commandPath;
  constructor(options) {
    super(options.reason === void 0 ? "Declined." : `Declined: ${options.reason}`);
    this.name = "ApprovalDeclinedError";
    this.reason = options.reason;
    this.approvalId = options.approvalId;
    this.commandPath = options.commandPath;
  }
};

// node_modules/toolcraft/dist/human-in-loop/config.js
function validateHumanInLoopOnDefine(config2) {
  const label = Array.isArray(config2.children) ? "group" : "command";
  if (config2.confirm === true && config2.humanInLoop !== void 0 && config2.humanInLoop !== null) {
    throw new Error(`${label} '${config2.name}': use either confirm or humanInLoop, not both`);
  }
  if (config2.humanInLoop === void 0 || config2.humanInLoop === null) {
    return;
  }
  if (config2.humanInLoop.mode !== "sync" && config2.humanInLoop.mode !== "async") {
    throw new Error(`${label} '${config2.name}': humanInLoop.mode must be "sync" or "async"`);
  }
  if (typeof config2.humanInLoop.message !== "function") {
    throw new Error(`${label} '${config2.name}': humanInLoop.message must be a function`);
  }
}
function mergeHumanInLoopFromGroup(groupHumanInLoop, childHumanInLoop) {
  if (childHumanInLoop !== void 0) {
    return childHumanInLoop;
  }
  return groupHumanInLoop;
}

// node_modules/toolcraft/dist/suggest.js
function suggest(input, candidates, opts = {}) {
  if (input.length === 0) {
    return [];
  }
  const max = opts.max ?? 3;
  const threshold = opts.threshold ?? Math.max(1, Math.floor(input.length / 4));
  return candidates.map((candidate) => ({
    candidate,
    distance: damerauLevenshtein(input, candidate)
  })).filter(({ distance }) => distance <= threshold).sort((left, right) => {
    if (left.distance !== right.distance) {
      return left.distance - right.distance;
    }
    return left.candidate.localeCompare(right.candidate);
  }).slice(0, max).map(({ candidate }) => candidate);
}
function damerauLevenshtein(left, right) {
  const distances = Array.from({ length: left.length + 1 }, () => Array.from({ length: right.length + 1 }, () => 0));
  for (let row = 0; row <= left.length; row += 1) {
    distances[row][0] = row;
  }
  for (let column = 0; column <= right.length; column += 1) {
    distances[0][column] = column;
  }
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
      const deletion = distances[row - 1][column] + 1;
      const insertion = distances[row][column - 1] + 1;
      const substitution = distances[row - 1][column - 1] + substitutionCost;
      distances[row][column] = Math.min(deletion, insertion, substitution);
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
        distances[row][column] = Math.min(distances[row][column], distances[row - 2][column - 2] + 1);
      }
    }
  }
  return distances[left.length][right.length];
}

// node_modules/toolcraft-schema/dist/json.js
function Json() {
  return {
    kind: "json"
  };
}

// node_modules/toolcraft-schema/dist/oneof.js
function assertValidBranches(branches, discriminator) {
  if (Object.keys(branches).length === 0) {
    throw new Error("OneOf schema requires at least one branch");
  }
  for (const [branchName, branch] of Object.entries(branches)) {
    if (Object.prototype.hasOwnProperty.call(branch.shape, discriminator)) {
      throw new Error(`OneOf branch "${branchName}" must not declare discriminator field "${discriminator}".`);
    }
  }
}
function OneOf(config2) {
  assertValidBranches(config2.branches, config2.discriminator);
  return {
    kind: "oneOf",
    discriminator: config2.discriminator,
    branches: config2.branches
  };
}

// node_modules/toolcraft-schema/dist/record.js
function Record(value) {
  return {
    kind: "record",
    value
  };
}

// node_modules/toolcraft-schema/dist/union.js
function isOptionalSchema(schema) {
  return schema.kind === "optional";
}
function getRequiredKeys(schema) {
  return Object.keys(schema.shape).filter((key2) => !isOptionalSchema(schema.shape[key2])).sort();
}
function getRequiredKeyFingerprint(schema) {
  return getRequiredKeys(schema).join("+");
}
function assertUniqueRequiredKeyFingerprints(branches) {
  const fingerprints = /* @__PURE__ */ new Map();
  branches.forEach((branch, index) => {
    const requiredKeys = getRequiredKeys(branch);
    const fingerprint = JSON.stringify(requiredKeys);
    const existing = fingerprints.get(fingerprint);
    if (existing === void 0) {
      fingerprints.set(fingerprint, {
        display: requiredKeys.join("+"),
        indices: [index]
      });
      return;
    }
    existing.indices.push(index);
  });
  for (const { display, indices } of fingerprints.values()) {
    if (indices.length > 1) {
      throw new Error(`Union branches [${indices.join(", ")}] share required-key fingerprint "${display}". Each branch must require a distinct set of keys.`);
    }
  }
}
function assertValidBranches2(branches) {
  if (branches.length === 0) {
    throw new Error("Union schema requires at least one branch");
  }
  assertUniqueRequiredKeyFingerprints(branches);
}
function Union(branches) {
  assertValidBranches2(branches);
  return {
    kind: "union",
    branches
  };
}

// node_modules/toolcraft-schema/dist/validate.js
var missingValue = Symbol("missingValue");
function validate(schema, value) {
  const state = { issues: [] };
  const result = walkSchema(schema, value, [], state);
  if (state.issues.length > 0) {
    return { ok: false, issues: state.issues };
  }
  return { ok: true, value: result.present ? result.value : void 0 };
}
function walkSchema(schema, value, path10, state) {
  if (schema.kind === "optional") {
    return walkOptional(schema, value, path10, state);
  }
  if (value === missingValue) {
    addIssue(state, path10, expectedFor(schema), "missing", `Expected ${expectedFor(schema)} at ${formatPath(path10)}`);
    return { present: false };
  }
  if (value === null && schema.nullable === true) {
    return { present: true, value };
  }
  switch (schema.kind) {
    case "string":
      return walkString(schema, value, path10, state);
    case "number":
      return walkNumber(schema, value, path10, state);
    case "boolean":
      return walkBoolean(value, path10, state);
    case "enum":
      return walkEnum(schema, value, path10, state);
    case "array":
      return walkArray(schema, value, path10, state);
    case "object":
      return walkObject(schema, value, path10, state);
    case "oneOf":
      return walkOneOf(schema, value, path10, state);
    case "union":
      return walkUnion(schema, value, path10, state);
    case "record":
      return walkRecord(schema, value, path10, state);
    case "json":
      return walkJson(value, path10, state);
  }
}
function walkOptional(schema, value, path10, state) {
  if (value === missingValue || value === void 0) {
    const defaultValue = getDefault(schema.inner);
    if (defaultValue.present) {
      return walkSchema(schema.inner, cloneDefault(defaultValue.value), path10, state);
    }
    return { present: false };
  }
  return walkSchema(schema.inner, value, path10, state);
}
function walkString(schema, value, path10, state) {
  if (typeof value !== "string") {
    addExpectedIssue(state, path10, "string", value);
    return { present: true, value };
  }
  if (schema.minLength !== void 0 && value.length < schema.minLength) {
    const expected = `string with length at least ${schema.minLength}`;
    addIssue(state, path10, expected, `string with length ${value.length}`, `Expected ${expected} at ${formatPath(path10)}`);
  }
  if (schema.maxLength !== void 0 && value.length > schema.maxLength) {
    const expected = `string with length at most ${schema.maxLength}`;
    addIssue(state, path10, expected, `string with length ${value.length}`, `Expected ${expected} at ${formatPath(path10)}`);
  }
  if (schema.pattern !== void 0) {
    const pattern = compilePattern(schema.pattern);
    if (pattern === void 0 || !pattern.test(value)) {
      const expected = `string matching pattern ${schema.pattern}`;
      addIssue(state, path10, expected, value, `Expected ${expected} at ${formatPath(path10)}`);
    }
  }
  return { present: true, value };
}
function walkNumber(schema, value, path10, state) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    addExpectedIssue(state, path10, schema.jsonType === "integer" ? "integer" : "number", value);
    return { present: true, value };
  }
  if (schema.jsonType === "integer" && !Number.isInteger(value)) {
    addExpectedIssue(state, path10, "integer", value);
  }
  if (schema.minimum !== void 0 && value < schema.minimum) {
    const expected = `number greater than or equal to ${schema.minimum}`;
    addIssue(state, path10, expected, String(value), `Expected ${expected} at ${formatPath(path10)}`);
  }
  if (schema.maximum !== void 0 && value > schema.maximum) {
    const expected = `number less than or equal to ${schema.maximum}`;
    addIssue(state, path10, expected, String(value), `Expected ${expected} at ${formatPath(path10)}`);
  }
  return { present: true, value };
}
function walkBoolean(value, path10, state) {
  if (typeof value !== "boolean") {
    addExpectedIssue(state, path10, "boolean", value);
  }
  return { present: true, value };
}
function walkEnum(schema, value, path10, state) {
  if (!schema.values.includes(value)) {
    const expected = `one of ${schema.values.join(", ")}`;
    addIssue(state, path10, expected, receivedValue(value), `Expected ${expected} at ${formatPath(path10)}`);
  }
  return { present: true, value };
}
function walkArray(schema, value, path10, state) {
  if (!Array.isArray(value)) {
    addExpectedIssue(state, path10, "array", value);
    return { present: true, value };
  }
  if (schema.minItems !== void 0 && value.length < schema.minItems) {
    const expected = `array with at least ${schema.minItems} items`;
    addIssue(state, path10, expected, `array with ${value.length} items`, `Expected ${expected} at ${formatPath(path10)}`);
  }
  if (schema.maxItems !== void 0 && value.length > schema.maxItems) {
    const expected = `array with at most ${schema.maxItems} items`;
    addIssue(state, path10, expected, `array with ${value.length} items`, `Expected ${expected} at ${formatPath(path10)}`);
  }
  const nextValue = value.map((item, index) => {
    const result = walkSchema(schema.item, item, [...path10, String(index)], state);
    return result.present ? result.value : item;
  });
  return { present: true, value: nextValue };
}
function walkObject(schema, value, path10, state, injectedProperties = {}) {
  if (!isPlainRecord(value)) {
    addExpectedIssue(state, path10, "object", value);
    return { present: true, value };
  }
  const nextValue = {};
  const allowedKeys = /* @__PURE__ */ new Set([...Object.keys(schema.shape), ...Object.keys(injectedProperties)]);
  for (const [key2, propertySchema] of Object.entries(schema.shape)) {
    const propertyValue = Object.hasOwn(value, key2) ? value[key2] : missingValue;
    const result = walkSchema(propertySchema, propertyValue, [...path10, key2], state);
    if (result.present) {
      setOwnValue(nextValue, key2, result.value);
    }
  }
  for (const [key2, injectedValue] of Object.entries(injectedProperties)) {
    if (Object.hasOwn(value, key2)) {
      setOwnValue(nextValue, key2, value[key2]);
    } else {
      setOwnValue(nextValue, key2, injectedValue);
    }
  }
  for (const [key2, propertyValue] of Object.entries(value)) {
    if (allowedKeys.has(key2)) {
      continue;
    }
    if (schema.additionalProperties === true) {
      setOwnValue(nextValue, key2, propertyValue);
    } else {
      addUnexpectedPropertyIssue(state, [...path10, key2]);
    }
  }
  return { present: true, value: nextValue };
}
function walkOneOf(schema, value, path10, state) {
  if (!isPlainRecord(value)) {
    addExpectedIssue(state, path10, "object", value);
    return { present: true, value };
  }
  const discriminatorValue = value[schema.discriminator];
  const discriminatorPath = [...path10, schema.discriminator];
  const branchValues = Object.keys(schema.branches);
  const expected = `one of ${branchValues.join(", ")}`;
  if (!Object.hasOwn(value, schema.discriminator)) {
    addIssueWithMessage(state, discriminatorPath, expected, "missing", `Missing discriminator "${schema.discriminator}" at ${formatPath(path10)}. Expected one of: ${branchValues.join(", ")}.`);
    return { present: true, value };
  }
  if (typeof discriminatorValue !== "string" || !Object.hasOwn(schema.branches, discriminatorValue)) {
    addIssueWithMessage(state, discriminatorPath, expected, receivedValue(discriminatorValue), `Expected ${expected} at ${formatPath(discriminatorPath)}, got ${formatReceivedDiscriminator(discriminatorValue)}`);
    return { present: true, value };
  }
  return walkObject(schema.branches[discriminatorValue], value, path10, state, {
    [schema.discriminator]: discriminatorValue
  });
}
function walkUnion(schema, value, path10, state) {
  if (isPlainRecord(value)) {
    const candidateBranches = schema.branches.filter((branch) => hasRequiredKeys(branch, value));
    if (candidateBranches.length === 1) {
      return walkObject(candidateBranches[0], value, path10, state);
    }
  }
  const matches = [];
  for (const branch of schema.branches) {
    const branchState = { issues: [] };
    const result = walkObject(branch, value, path10, branchState);
    if (branchState.issues.length === 0 && result.present) {
      matches.push({ fingerprint: getRequiredKeyFingerprint(branch), value: result.value });
    }
  }
  if (matches.length === 1) {
    return { present: true, value: matches[0].value };
  }
  if (matches.length === 0) {
    const branchDescriptions = schema.branches.map((branch) => getRequiredKeyFingerprint(branch));
    addIssueWithMessage(state, path10, "exactly one union branch", "0 matching branches", `No union branch matched at ${formatPath(path10)}. Tried ${schema.branches.length} branches. Expected one of: ${branchDescriptions.join(" | ")}.`);
    return { present: true, value };
  }
  addIssueWithMessage(state, path10, "exactly one union branch", `${matches.length} matching branches`, `Expected exactly one union branch at ${formatPath(path10)}, but matched more than one branch: ${matches.map((match) => match.fingerprint).join(" | ")}`);
  return { present: true, value };
}
function hasRequiredKeys(schema, value) {
  for (const [key2, propertySchema] of Object.entries(schema.shape)) {
    if (propertySchema.kind !== "optional" && !Object.hasOwn(value, key2)) {
      return false;
    }
  }
  return true;
}
function walkRecord(schema, value, path10, state) {
  if (!isPlainRecord(value)) {
    addExpectedIssue(state, path10, "object", value);
    return { present: true, value };
  }
  const nextValue = {};
  for (const [key2, propertyValue] of Object.entries(value)) {
    const result = walkSchema(schema.value, propertyValue, [...path10, key2], state);
    if (result.present) {
      setOwnValue(nextValue, key2, result.value);
    }
  }
  return { present: true, value: nextValue };
}
function walkJson(value, path10, state) {
  if (isJsonValue(value)) {
    return { present: true, value };
  }
  addExpectedIssue(state, path10, "JSON value", value);
  return { present: true, value };
}
function getDefault(schema) {
  if (schema.default !== void 0) {
    return { present: true, value: schema.default };
  }
  if (schema.kind === "optional") {
    return getDefault(schema.inner);
  }
  return { present: false };
}
function isPlainRecord(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function isJsonValue(value, ancestors = /* @__PURE__ */ new Set()) {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return typeof value !== "number" || Number.isFinite(value);
  }
  if (Array.isArray(value)) {
    if (ancestors.has(value)) {
      return false;
    }
    ancestors.add(value);
    const result = value.every((item) => isJsonValue(item, ancestors));
    ancestors.delete(value);
    return result;
  }
  if (isPlainRecord(value)) {
    if (ancestors.has(value)) {
      return false;
    }
    ancestors.add(value);
    const result = Object.values(value).every((item) => isJsonValue(item, ancestors));
    ancestors.delete(value);
    return result;
  }
  return false;
}
function cloneDefault(value) {
  return structuredClone(value);
}
function setOwnValue(target, key2, value) {
  Object.defineProperty(target, key2, {
    configurable: true,
    enumerable: true,
    writable: true,
    value
  });
}
function expectedFor(schema) {
  switch (schema.kind) {
    case "string":
      return "string";
    case "number":
      return schema.jsonType === "integer" ? "integer" : "number";
    case "boolean":
      return "boolean";
    case "enum":
      return `one of ${schema.values.join(", ")}`;
    case "array":
      return "array";
    case "object":
    case "oneOf":
    case "record":
      return "object";
    case "union":
      return "exactly one union branch";
    case "json":
      return "JSON value";
    case "optional":
      return expectedFor(schema.inner);
  }
}
function addExpectedIssue(state, path10, expected, value) {
  addIssue(state, path10, expected, receivedType(value), `Expected ${expected} at ${formatPath(path10)}`);
}
function addUnexpectedPropertyIssue(state, path10) {
  addIssue(state, path10, "no additional properties", "unknown property", `Unexpected property ${formatPath(path10)}`);
}
function addIssue(state, path10, expected, received, _message) {
  state.issues.push({
    path: path10,
    expected,
    received,
    message: formatIssueMessage(expected, path10, received)
  });
}
function addIssueWithMessage(state, path10, expected, received, message2) {
  state.issues.push({
    path: path10,
    expected,
    received,
    message: message2
  });
}
function formatIssueMessage(expected, path10, received) {
  return `Expected ${expected} at ${formatPath(path10)}, got ${received}`;
}
function formatPath(path10) {
  return path10.length === 0 ? "value" : path10.join(".");
}
function compilePattern(pattern) {
  try {
    return new RegExp(pattern);
  } catch {
    return void 0;
  }
}
function receivedType(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return "integer";
  }
  return typeof value;
}
function receivedValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (value === void 0) {
    return "undefined";
  }
  return String(value);
}
function formatReceivedDiscriminator(value) {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  return receivedValue(value);
}

// node_modules/toolcraft-schema/dist/index.js
function assertValidEnumValues(values) {
  if (values.length === 0) {
    throw new Error("Enum schema requires at least one value");
  }
  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) {
    throw new Error("Enum schema values must be unique");
  }
  if (values.some((value) => typeof value === "number" && !Number.isFinite(value))) {
    throw new Error("Enum schema numeric values must be finite");
  }
}
function assertNonNegativeInteger(value, name) {
  if (value !== void 0 && (!Number.isInteger(value) || value < 0)) {
    throw new Error(`${name} must be a non-negative integer`);
  }
}
function assertFiniteNumber(value, name) {
  if (value !== void 0 && !Number.isFinite(value)) {
    throw new Error(`${name} must be finite`);
  }
}
function assertMinMaxOrder(minimum, maximum, minimumName, maximumName) {
  if (minimum !== void 0 && maximum !== void 0 && minimum > maximum) {
    throw new Error(`${minimumName} must be less than or equal to ${maximumName}`);
  }
}
function assertValidDefault(schema) {
  if (schema.default === void 0) {
    return;
  }
  const result = validate(schema, schema.default);
  if (!result.ok) {
    throw new Error(`default must satisfy schema: ${result.issues[0]?.message ?? "invalid default"}`);
  }
}
function assertPattern(pattern) {
  if (pattern === void 0) {
    return;
  }
  try {
    new RegExp(pattern);
  } catch {
    throw new Error("pattern must be a valid regular expression");
  }
}
var S = {
  String(options = {}) {
    assertNonNegativeInteger(options.minLength, "minLength");
    assertNonNegativeInteger(options.maxLength, "maxLength");
    assertMinMaxOrder(options.minLength, options.maxLength, "minLength", "maxLength");
    assertPattern(options.pattern);
    const schema = {
      kind: "string",
      ...options
    };
    assertValidDefault(schema);
    return schema;
  },
  Number(options = {}) {
    assertFiniteNumber(options.minimum, "minimum");
    assertFiniteNumber(options.maximum, "maximum");
    assertMinMaxOrder(options.minimum, options.maximum, "minimum", "maximum");
    assertFiniteNumber(options.default, "default");
    if (options.jsonType === "integer" && options.default !== void 0 && !Number.isInteger(options.default)) {
      throw new Error("default must be an integer");
    }
    const schema = {
      kind: "number",
      ...options
    };
    assertValidDefault(schema);
    return schema;
  },
  Boolean(options = {}) {
    const schema = {
      kind: "boolean",
      ...options
    };
    assertValidDefault(schema);
    return schema;
  },
  Enum(values, options = {}) {
    assertValidEnumValues(values);
    if (options.jsonType === "integer" && values.some((value) => typeof value !== "number" || !Number.isInteger(value))) {
      throw new Error("Integer enum values must be integers");
    }
    const schema = {
      kind: "enum",
      values,
      ...options
    };
    assertValidDefault(schema);
    return schema;
  },
  Array(item, options = {}) {
    assertNonNegativeInteger(options.minItems, "minItems");
    assertNonNegativeInteger(options.maxItems, "maxItems");
    assertMinMaxOrder(options.minItems, options.maxItems, "minItems", "maxItems");
    const schema = {
      kind: "array",
      item,
      ...options
    };
    assertValidDefault(schema);
    return schema;
  },
  Object(shape, options = {}) {
    const schema = {
      kind: "object",
      shape,
      ...options
    };
    assertValidDefault(schema);
    return schema;
  },
  Optional(inner) {
    return {
      kind: "optional",
      inner
    };
  },
  OneOf,
  Union,
  Record,
  Json
};

// node_modules/toolcraft/dist/package-metadata.js
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
function pathFromInput(from) {
  if (from instanceof URL) {
    return fileURLToPath(from);
  }
  if (from.startsWith("file:")) {
    return fileURLToPath(from);
  }
  return path.resolve(from);
}
function getSearchDirectory(from) {
  const resolved = pathFromInput(from);
  try {
    return statSync(resolved).isDirectory() ? resolved : path.dirname(resolved);
  } catch {
    return path.dirname(resolved);
  }
}
function readPackageMetadata(packageJsonPath) {
  const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const metadata = { path: packageJsonPath };
  if (typeof parsed.name === "string") {
    metadata.name = parsed.name;
  }
  if (typeof parsed.version === "string") {
    metadata.version = parsed.version;
  }
  return metadata;
}
function findPackageMetadata(from) {
  let current = getSearchDirectory(from);
  while (true) {
    const packageJsonPath = path.join(current, "package.json");
    if (existsSync(packageJsonPath)) {
      return readPackageMetadata(packageJsonPath);
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return void 0;
    }
    current = parent;
  }
}
function findEntrypointPackageMetadata(entrypoint) {
  if (entrypoint === void 0 || entrypoint.length === 0) {
    return void 0;
  }
  if (!path.isAbsolute(entrypoint) && !entrypoint.startsWith("file:")) {
    return void 0;
  }
  return findPackageMetadata(entrypoint);
}

// node_modules/toolcraft/dist/index.js
var commandConfigSymbol = Symbol("toolcraft.command.config");
var groupConfigSymbol = Symbol("toolcraft.group.config");
var commandSourcePathSymbol = Symbol("toolcraft.command.sourcePath");
function cloneScope(scope) {
  return scope === void 0 ? void 0 : [...scope];
}
function cloneSecretDefinition(secret) {
  return {
    env: secret.env,
    description: secret.description,
    optional: secret.optional
  };
}
function cloneSecrets(secrets) {
  if (secrets === void 0) {
    return {};
  }
  return Object.fromEntries(Object.entries(secrets).map(([key2, secret]) => [key2, cloneSecretDefinition(secret)]));
}
function cloneRequires(requires) {
  if (requires === void 0) {
    return void 0;
  }
  return {
    auth: requires.auth,
    apiVersion: requires.apiVersion,
    check: requires.check
  };
}
function cloneStringArray(values) {
  return values === void 0 ? void 0 : [...values];
}
function cloneCommandExamples(examples) {
  return (examples ?? []).map((example) => ({
    title: example.title,
    params: { ...example.params }
  }));
}
function cloneStringRecord(values) {
  return values === void 0 ? void 0 : { ...values };
}
function cloneMcpServerConfig(config2) {
  if (config2 === void 0) {
    return void 0;
  }
  if (config2.transport === "stdio") {
    return {
      transport: "stdio",
      command: config2.command,
      args: cloneStringArray(config2.args),
      env: cloneStringRecord(config2.env)
    };
  }
  return {
    transport: "http",
    url: config2.url,
    headers: cloneStringRecord(config2.headers)
  };
}
function cloneRenameMap(rename4) {
  return rename4 === void 0 ? void 0 : { ...rename4 };
}
function validateRenameMap(rename4) {
  if (rename4 === void 0) {
    return;
  }
  const seenTargets = /* @__PURE__ */ new Map();
  for (const [upstreamName, targetPath] of Object.entries(rename4)) {
    if (targetPath.length === 0) {
      throw new UserError(`Invalid rename target for upstream tool "${upstreamName}": path cannot be empty.`);
    }
    if (targetPath.split(".").some((segment) => segment.length === 0)) {
      throw new UserError(`Invalid rename target for upstream tool "${upstreamName}": "${targetPath}" contains an empty segment.`);
    }
    const existingUpstreamName = seenTargets.get(targetPath);
    if (existingUpstreamName !== void 0) {
      throw new UserError(`Duplicate rename target "${targetPath}" for upstream tools "${existingUpstreamName}" and "${upstreamName}".`);
    }
    seenTargets.set(targetPath, upstreamName);
  }
}
function parseStackPath(candidate) {
  if (candidate.startsWith("file://")) {
    try {
      return fileURLToPath2(candidate);
    } catch {
      return void 0;
    }
  }
  if (candidate.startsWith("/")) {
    return candidate;
  }
  return void 0;
}
function extractStackPath(line) {
  const trimmed = line.trim();
  const fileIndex = trimmed.indexOf("file://");
  if (fileIndex >= 0) {
    const location2 = trimmed.slice(fileIndex);
    const separatorIndex2 = location2.lastIndexOf(":");
    const previousSeparatorIndex2 = separatorIndex2 >= 0 ? location2.lastIndexOf(":", separatorIndex2 - 1) : -1;
    const candidate2 = separatorIndex2 >= 0 && previousSeparatorIndex2 >= 0 ? location2.slice(0, previousSeparatorIndex2) : location2;
    return parseStackPath(candidate2);
  }
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex < 0) {
    return void 0;
  }
  const location = trimmed.slice(slashIndex);
  const separatorIndex = location.lastIndexOf(":");
  const previousSeparatorIndex = separatorIndex >= 0 ? location.lastIndexOf(":", separatorIndex - 1) : -1;
  const candidate = separatorIndex >= 0 && previousSeparatorIndex >= 0 ? location.slice(0, previousSeparatorIndex) : location;
  return parseStackPath(candidate);
}
function inferCommandSourcePath() {
  const stack = new Error().stack;
  if (typeof stack !== "string") {
    return void 0;
  }
  for (const line of stack.split("\n").slice(1)) {
    const candidate = extractStackPath(line);
    if (candidate === void 0) {
      continue;
    }
    if (candidate.includes("/packages/toolcraft/src/index.ts") || candidate.includes("/packages/toolcraft/dist/index.js") || candidate.includes("/node_modules/toolcraft/dist/index.js")) {
      continue;
    }
    return candidate;
  }
  return void 0;
}
function composeChecks(parentCheck, childCheck) {
  if (parentCheck === void 0) {
    return childCheck;
  }
  if (childCheck === void 0) {
    return parentCheck;
  }
  return async (ctx) => {
    const parentResult = await parentCheck(ctx);
    if (!parentResult.ok) {
      return parentResult;
    }
    return childCheck(ctx);
  };
}
function mergeRequires(parent, child) {
  if (parent === void 0 && child === void 0) {
    return void 0;
  }
  const merged = {
    auth: child?.auth ?? parent?.auth,
    apiVersion: child?.apiVersion ?? parent?.apiVersion,
    check: composeChecks(parent?.check, child?.check)
  };
  if (merged.auth === void 0 && merged.apiVersion === void 0 && merged.check === void 0) {
    return void 0;
  }
  return merged;
}
function parseSimpleSemver(value) {
  const parts = value.split(".");
  if (parts.length !== 3) {
    return void 0;
  }
  const parsed = parts.map((part) => {
    if (part.length === 0) {
      return Number.NaN;
    }
    for (const char of part) {
      if (char < "0" || char > "9") {
        return Number.NaN;
      }
    }
    return Number(part);
  });
  if (parsed.some((part) => !Number.isInteger(part) || part < 0)) {
    return void 0;
  }
  return parsed;
}
function parseMinimumApiVersion(requirement) {
  if (!requirement.startsWith(">=")) {
    return void 0;
  }
  return parseSimpleSemver(requirement.slice(2).trim());
}
function compareSemver(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] === right[index]) {
      continue;
    }
    return left[index] > right[index] ? 1 : -1;
  }
  return 0;
}
function resolveCommandSecrets(command, env = process.env) {
  const secrets = {};
  for (const [name, secret] of Object.entries(command.secrets)) {
    const value = env[secret.env];
    if (value === void 0 && secret.optional !== true) {
      const details = secret.description ? `
  ${secret.description}` : "";
      const candidates = Object.keys(env).filter((candidate) => candidate !== secret.env && env[candidate] !== void 0);
      const suggestions = suggestSecretEnv(secret.env, candidates);
      const suggestionLine = suggestions.length > 0 ? `
Did you mean: ${suggestions.join(", ")}?` : "";
      throw new UserError(`Missing required secret ${secret.env}${details}${suggestionLine}`);
    }
    Object.defineProperty(secrets, name, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  return secrets;
}
function suggestSecretEnv(input, candidates) {
  const directSuggestions = suggest(input, candidates);
  if (!input.includes("_")) {
    return directSuggestions;
  }
  const inputParts = input.split("_");
  const firstPart = inputParts[0];
  const lastPart = inputParts[inputParts.length - 1];
  const relatedCandidates = candidates.filter((candidate) => {
    const candidateParts = candidate.split("_");
    return candidateParts[0] === firstPart && candidateParts[candidateParts.length - 1] === lastPart;
  });
  const expandedSuggestions = suggest(input, relatedCandidates, {
    threshold: Math.max(4, Math.floor(input.length / 4))
  });
  return [.../* @__PURE__ */ new Set([...directSuggestions, ...expandedSuggestions])].slice(0, 3);
}
async function assertCommandRequirements(command, context, options = {}) {
  const requires = command.requires;
  if (requires === void 0) {
    return;
  }
  const env = options.env ?? process.env;
  const authEnvVar = options.authEnvVar ?? "POE_API_KEY";
  if (requires.auth === true && env[authEnvVar] === void 0) {
    throw new UserError(`Command "${command.name}" requires authentication.
  Run 'poe-code login' first.`);
  }
  if (requires.apiVersion !== void 0) {
    const minimumVersion = parseMinimumApiVersion(requires.apiVersion);
    if (minimumVersion === void 0) {
      throw new UserError(`Command "${command.name}" has invalid apiVersion requirement "${requires.apiVersion}". Expected format ">=X.Y.Z".`);
    }
    if (options.apiVersion === void 0) {
      throw new UserError(`Command "${command.name}" requires API version ${requires.apiVersion}, but no runner API version was provided.`);
    }
    const runnerVersion = parseSimpleSemver(options.apiVersion);
    if (runnerVersion === void 0) {
      throw new UserError(`Command "${command.name}" requires API version ${requires.apiVersion}, but runner API version "${options.apiVersion}" is not valid semver.`);
    }
    if (compareSemver(runnerVersion, minimumVersion) < 0) {
      throw new UserError(`Command "${command.name}" requires API version ${requires.apiVersion}, but runner API version is ${options.apiVersion}.`);
    }
  }
  const checkResult = await requires.check?.(context);
  if (checkResult && !checkResult.ok) {
    throw new UserError(checkResult.message ?? "Command precondition failed.");
  }
}
function mergeSecrets(parent, child) {
  return cloneSecrets({
    ...parent,
    ...child
  });
}
function resolveCommandScope(ownScope, inheritedScope) {
  return cloneScope(ownScope ?? inheritedScope) ?? ["cli", "sdk"];
}
function resolveGroupScope(ownScope, inheritedScope) {
  return cloneScope(ownScope ?? inheritedScope);
}
function createBaseCommand(config2) {
  const command = {
    kind: "command",
    name: config2.name,
    description: config2.description,
    hidden: config2.hidden ?? false,
    examples: cloneCommandExamples(config2.examples),
    aliases: [...config2.aliases ?? []],
    positional: [...config2.positional ?? []],
    params: config2.params,
    result: config2.result,
    secrets: cloneSecrets(config2.secrets),
    scope: resolveCommandScope(config2.scope, void 0),
    confirm: config2.confirm ?? false,
    humanInLoop: config2.humanInLoop,
    requires: cloneRequires(config2.requires),
    handler: config2.handler,
    render: config2.render
  };
  Object.defineProperty(command, commandConfigSymbol, {
    value: {
      scope: cloneScope(config2.scope),
      hidden: config2.hidden ?? false,
      examples: cloneCommandExamples(config2.examples),
      result: config2.result,
      humanInLoop: config2.humanInLoop,
      secrets: cloneSecrets(config2.secrets),
      requires: cloneRequires(config2.requires),
      sourcePath: inferCommandSourcePath()
    }
  });
  return command;
}
function createBaseGroup(config2) {
  const group = {
    kind: "group",
    name: config2.name,
    description: config2.description,
    aliases: [...config2.aliases ?? []],
    scope: resolveGroupScope(config2.scope, void 0),
    humanInLoop: config2.humanInLoop,
    secrets: cloneSecrets(config2.secrets),
    requires: cloneRequires(config2.requires),
    children: [],
    default: void 0
  };
  Object.defineProperty(group, groupConfigSymbol, {
    value: {
      mcp: cloneMcpServerConfig(config2.mcp),
      scope: cloneScope(config2.scope),
      humanInLoop: config2.humanInLoop,
      secrets: cloneSecrets(config2.secrets),
      tools: cloneStringArray(config2.tools),
      rename: cloneRenameMap(config2.rename),
      requires: cloneRequires(config2.requires),
      children: [...config2.children],
      default: config2.default
    }
  });
  return group;
}
function getInternalCommandConfig(command) {
  return command[commandConfigSymbol];
}
function getInternalGroupConfig(group) {
  return group[groupConfigSymbol];
}
function materializeCommand(command, inherited) {
  const internal = getInternalCommandConfig(command);
  const materialized = {
    kind: "command",
    name: command.name,
    description: command.description,
    hidden: internal.hidden,
    examples: cloneCommandExamples(internal.examples),
    aliases: [...command.aliases],
    positional: [...command.positional],
    params: command.params,
    result: internal.result,
    secrets: mergeSecrets(inherited.secrets, internal.secrets),
    scope: resolveCommandScope(internal.scope, inherited.scope),
    confirm: command.confirm,
    humanInLoop: mergeHumanInLoopFromGroup(inherited.humanInLoop, internal.humanInLoop),
    requires: mergeRequires(inherited.requires, internal.requires),
    handler: command.handler,
    render: command.render
  };
  Object.defineProperty(materialized, commandConfigSymbol, {
    value: {
      scope: cloneScope(internal.scope),
      hidden: internal.hidden,
      examples: cloneCommandExamples(internal.examples),
      result: internal.result,
      humanInLoop: internal.humanInLoop,
      secrets: cloneSecrets(internal.secrets),
      requires: cloneRequires(internal.requires),
      sourcePath: internal.sourcePath
    }
  });
  Object.defineProperty(materialized, commandSourcePathSymbol, {
    value: internal.sourcePath
  });
  return materialized;
}
function mergeInheritedMetadata(group, inherited) {
  return {
    scope: resolveGroupScope(group.scope, inherited.scope),
    humanInLoop: mergeHumanInLoopFromGroup(inherited.humanInLoop, group.humanInLoop),
    secrets: mergeSecrets(inherited.secrets, group.secrets),
    requires: mergeRequires(inherited.requires, group.requires)
  };
}
function materializeGroup(group, inherited) {
  const internal = getInternalGroupConfig(group);
  const mergedInherited = mergeInheritedMetadata(internal, inherited);
  const materializedChildren = internal.children.map((child) => materializeNode(child, mergedInherited));
  let defaultChild;
  if (internal.default !== void 0) {
    const defaultIndex = internal.children.indexOf(internal.default);
    if (defaultIndex === -1) {
      throw new ToolcraftBugError(`Default command "${internal.default.name}" must be listed in children.`);
    }
    const resolvedDefault = materializedChildren[defaultIndex];
    if (resolvedDefault?.kind !== "command") {
      throw new ToolcraftBugError(`Default child "${internal.default.name}" must be a command.`);
    }
    defaultChild = resolvedDefault;
  }
  const materialized = {
    kind: "group",
    name: group.name,
    description: group.description,
    aliases: [...group.aliases],
    scope: mergedInherited.scope,
    humanInLoop: mergedInherited.humanInLoop,
    secrets: mergedInherited.secrets,
    requires: mergedInherited.requires,
    children: materializedChildren,
    default: defaultChild
  };
  Object.defineProperty(materialized, groupConfigSymbol, {
    value: {
      mcp: cloneMcpServerConfig(internal.mcp),
      scope: cloneScope(internal.scope),
      humanInLoop: internal.humanInLoop,
      secrets: cloneSecrets(internal.secrets),
      tools: cloneStringArray(internal.tools),
      rename: cloneRenameMap(internal.rename),
      requires: cloneRequires(internal.requires),
      children: [...internal.children],
      default: internal.default
    }
  });
  return materialized;
}
function materializeNode(node, inherited) {
  if (node.kind === "command") {
    return materializeCommand(node, inherited);
  }
  return materializeGroup(node, inherited);
}
function defineCommand(config2) {
  validateHumanInLoopOnDefine(config2);
  return materializeCommand(createBaseCommand(config2), {
    scope: void 0,
    humanInLoop: void 0,
    secrets: {},
    requires: void 0
  });
}
function defineGroup(config2) {
  validateRenameMap(config2.rename);
  validateHumanInLoopOnDefine(config2);
  return materializeGroup(createBaseGroup(config2), {
    scope: void 0,
    humanInLoop: void 0,
    secrets: {},
    requires: void 0
  });
}
function getCommandSourcePath(command) {
  return command[commandSourcePathSymbol];
}

// node_modules/toolcraft/dist/error-codes.js
function hasOwnErrorCode(error3, code) {
  return typeof error3 === "object" && error3 !== null && Object.prototype.hasOwnProperty.call(error3, "code") && error3.code === code;
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/open.js
import * as fsPromises from "node:fs/promises";

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/state-machine.js
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStateList(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function hasVisibleName(value) {
  return value.trim().length > 0;
}
function canFireFromState(event, fromState) {
  if (event.from === "*") {
    return event.to !== fromState;
  }
  return event.from.includes(fromState);
}
function validateMachine(machine) {
  if (!isRecord(machine)) {
    throw new TypeError("State machine must be an object.");
  }
  if (!hasOwnRecordField(machine, "states") || !isStateList(machine.states)) {
    throw new TypeError("State machine states must be a string array.");
  }
  const states = new Set(machine.states);
  if (machine.states.some((state) => !hasVisibleName(state))) {
    throw new Error("State names must not be empty.");
  }
  if (!hasOwnRecordField(machine, "initial") || typeof machine.initial !== "string") {
    throw new TypeError("State machine initial must be a string.");
  }
  if (!states.has(machine.initial)) {
    throw new Error(`Initial state "${machine.initial}" is not declared.`);
  }
  if (!hasOwnRecordField(machine, "events") || !isRecord(machine.events)) {
    throw new TypeError("State machine events must be an object.");
  }
  for (const [eventName, event] of Object.entries(machine.events)) {
    if (!hasVisibleName(eventName)) {
      throw new Error("Event names must not be empty.");
    }
    if (!isRecord(event)) {
      throw new TypeError(`Event "${eventName}" must be an object.`);
    }
    if (!hasOwnRecordField(event, "from") || event.from !== "*" && !isStateList(event.from)) {
      throw new TypeError(`Event "${eventName}" has an invalid "from" definition.`);
    }
    if (!hasOwnRecordField(event, "to") || typeof event.to !== "string") {
      throw new TypeError(`Event "${eventName}" target state must be a string.`);
    }
    if (!states.has(event.to)) {
      throw new Error(`Event "${eventName}" references unknown target state "${event.to}".`);
    }
    if (event.from !== "*") {
      for (const fromState of event.from) {
        if (!states.has(fromState)) {
          throw new Error(`Event "${eventName}" references unknown source state "${fromState}".`);
        }
      }
    }
  }
}
function hasOwnRecordField(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2);
}
function eventsFromState(machine, fromState) {
  const events = [];
  for (const [eventName, event] of Object.entries(machine.events)) {
    if (canFireFromState(event, fromState)) {
      events.push(eventName);
    }
  }
  return events;
}
function findEvent(machine, fromState, eventName) {
  const event = Object.prototype.hasOwnProperty.call(machine.events, eventName) ? machine.events[eventName] : void 0;
  if (event === void 0) {
    return void 0;
  }
  return canFireFromState(event, fromState) ? event : void 0;
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/types.js
var TaskNotFoundError = class extends Error {
  constructor(message2 = "Task not found.") {
    super(message2);
    this.name = "TaskNotFoundError";
  }
};
var TaskAlreadyExistsError = class extends Error {
  constructor(message2 = "Task already exists.") {
    super(message2);
    this.name = "TaskAlreadyExistsError";
  }
};
var InvalidTransitionError = class extends Error {
  task;
  event;
  to;
  reason;
  constructor(messageOrOptions = "Invalid task transition.") {
    const options = typeof messageOrOptions === "string" ? {
      reason: messageOrOptions
    } : messageOrOptions;
    super(options.reason);
    this.name = "InvalidTransitionError";
    this.task = options.task;
    this.event = options.event;
    this.to = options.to;
    this.reason = options.reason;
  }
};
var MalformedTaskError = class extends Error {
  constructor(message2 = "Malformed task.") {
    super(message2);
    this.name = "MalformedTaskError";
  }
};
var OrderMismatchError = class extends Error {
  missing;
  extra;
  constructor(options) {
    const parts = [];
    if (options.missing.length > 0) {
      parts.push(`missing ${options.missing.map((id) => `"${id}"`).join(", ")}`);
    }
    if (options.extra.length > 0) {
      parts.push(`extra ${options.extra.map((id) => `"${id}"`).join(", ")}`);
    }
    super(`reorder requires the exact set of active task ids: ${parts.join("; ")}.`);
    this.name = "OrderMismatchError";
    this.missing = options.missing;
    this.extra = options.extra;
  }
};
var AnchorNotFoundError = class extends Error {
  anchor;
  constructor(anchor) {
    super(`Anchor task "${anchor}" not found.`);
    this.name = "AnchorNotFoundError";
    this.anchor = anchor;
  }
};

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/gh-issues-client.js
import { text as text3 } from "node:stream/consumers";

// node_modules/toolcraft/node_modules/@poe-code/process-runner/dist/docker/build-context.js
var import_ignore = __toESM(require_ignore(), 1);

// node_modules/toolcraft/node_modules/@poe-code/process-runner/dist/host/host-runner.js
import { spawn as spawnChildProcess } from "node:child_process";
function createHostRunner(options = {}) {
  const runnerOptions = normalizeHostRunnerOptions(options);
  const detachedByDefault = runnerOptions.detached === true;
  return {
    name: "host",
    exec(inputSpec) {
      const spec = normalizeRunSpec(inputSpec);
      if (spec.signal?.aborted === true) {
        return {
          pid: null,
          stdin: null,
          stdout: null,
          stderr: null,
          result: Promise.resolve({ exitCode: 1 }),
          kill() {
          }
        };
      }
      const stdinMode = spec.stdin ?? "ignore";
      const stdoutMode = spec.stdout ?? "pipe";
      const stderrMode = spec.stderr ?? "pipe";
      const killProcessGroup = detachedByDefault || spec.killProcessGroup === true;
      const stdio = stdinMode === "inherit" && stdoutMode === "inherit" && stderrMode === "inherit" ? "inherit" : [stdinMode, stdoutMode, stderrMode];
      const child = spawnChildProcess(spec.command, spec.args ?? [], createNullRecord({
        cwd: spec.cwd,
        env: spec.env,
        stdio,
        ...killProcessGroup ? { detached: true } : {}
      }));
      if (killProcessGroup) {
        child.unref();
      }
      const kill = (signal) => {
        if (killProcessGroup && process.platform !== "win32" && child.pid !== void 0) {
          process.kill(-child.pid, signal);
          return;
        }
        child.kill(signal);
      };
      let settled = false;
      let resolveResult = null;
      const result = new Promise((resolve2) => {
        resolveResult = resolve2;
      });
      const cleanupAbort = bindAbortSignal(spec.signal, () => {
        try {
          kill("SIGTERM");
        } catch {
          return;
        }
      });
      child.once("close", (code) => {
        if (settled)
          return;
        settled = true;
        cleanupAbort();
        resolveResult?.({ exitCode: code ?? 1 });
      });
      child.once("error", () => {
        if (settled)
          return;
        settled = true;
        cleanupAbort();
        resolveResult?.({ exitCode: 1 });
      });
      return {
        pid: child.pid ?? null,
        stdin: child.stdin,
        stdout: child.stdout,
        stderr: child.stderr,
        result,
        kill
      };
    }
  };
}
function normalizeHostRunnerOptions(options) {
  return createNullRecord({
    ...optionalOwnProperty(options, "detached")
  });
}
function normalizeRunSpec(spec) {
  return createNullRecord({
    command: getOwnProperty(spec, "command"),
    ...optionalOwnProperty(spec, "args"),
    ...optionalOwnProperty(spec, "cwd"),
    ...optionalOwnProperty(spec, "env"),
    ...optionalOwnProperty(spec, "stdin"),
    ...optionalOwnProperty(spec, "stdout"),
    ...optionalOwnProperty(spec, "stderr"),
    ...optionalOwnProperty(spec, "tty"),
    ...optionalOwnProperty(spec, "signal"),
    ...optionalOwnProperty(spec, "killProcessGroup")
  });
}
function optionalOwnProperty(value, name) {
  const property = getOwnProperty(value, name);
  return property === void 0 ? {} : { [name]: property };
}
function getOwnProperty(value, name) {
  return hasOwnProperty(value, name) ? value[name] : void 0;
}
function hasOwnProperty(value, name) {
  return Object.prototype.hasOwnProperty.call(value, name);
}
function createNullRecord(value) {
  return Object.assign(/* @__PURE__ */ Object.create(null), value);
}
function bindAbortSignal(signal, onAbort) {
  if (signal === void 0) {
    return () => {
    };
  }
  if (signal.aborted) {
    onAbort();
    return () => {
    };
  }
  signal.addEventListener("abort", onAbort, { once: true });
  return () => {
    signal.removeEventListener("abort", onAbort);
  };
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/gh-issues-client.js
var DEFAULT_ENDPOINT = "https://api.github.com/graphql";
var USER_AGENT = "poe-code-task-list/0.0.1";
var AUTH_ERROR = "gh auth token failed; install gh, run 'gh auth login', or pass auth: { token }";
function createGhClient(options) {
  const fetchImpl = options.fetch ?? fetch;
  const endpoint = options.endpoint || DEFAULT_ENDPOINT;
  return {
    async graphql(query, variables) {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.token}`,
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT
        },
        body: JSON.stringify({ query, variables })
      });
      const body = await response.text();
      if (response.status !== 200) {
        throw new Error(`GitHub GraphQL request failed with status ${response.status}: ${body}`);
      }
      const parsed = JSON.parse(body);
      if (parsed.data !== void 0 && parsed.data !== null) {
        return parsed.data;
      }
      const firstError = parsed.errors?.[0];
      if (firstError !== void 0) {
        throw new Error(firstError.message ?? "GitHub GraphQL request failed");
      }
      return parsed.data;
    }
  };
}
async function resolveAuth(options) {
  if (options.explicitToken !== void 0) {
    return options.explicitToken;
  }
  const runner = options.runner ?? createHostRunner();
  const handle = runner.exec({
    command: "gh",
    args: ["auth", "token"],
    stdout: "pipe",
    stderr: "pipe"
  });
  const [stdout, , result] = await Promise.all([
    handle.stdout === null ? Promise.resolve("") : text3(handle.stdout),
    handle.stderr === null ? Promise.resolve("") : text3(handle.stderr),
    handle.result
  ]);
  const token = stdout.trim();
  if (result.exitCode !== 0 || token.length === 0) {
    throw new Error(AUTH_ERROR);
  }
  return token;
}
function resolveEndpoint(options = {}) {
  const env = options.env ?? process.env;
  const host = env.GH_HOST;
  if (host !== void 0 && host !== "" && host !== "github.com") {
    return `https://${host}/api/graphql`;
  }
  return DEFAULT_ENDPOINT;
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/utils.js
import { randomUUID } from "node:crypto";
import path2 from "node:path";
function compareCreated(left, right) {
  const leftCreated = typeof left.raw.created === "string" ? left.raw.created : "";
  const rightCreated = typeof right.raw.created === "string" ? right.raw.created : "";
  if (leftCreated === "" && rightCreated === "") {
    return left.task.qualifiedId.localeCompare(right.task.qualifiedId);
  }
  if (leftCreated === "")
    return 1;
  if (rightCreated === "")
    return -1;
  return leftCreated.localeCompare(rightCreated);
}
function applyOrder(entries, order) {
  if (order === "alphabetical") {
    return sortTasks(entries.map((entry) => entry.task));
  }
  if (order === "created") {
    return [...entries].sort(compareCreated).map((entry) => entry.task);
  }
  return entries.map((entry) => entry.task);
}
function hasErrorCode(error3, code) {
  return !!error3 && typeof error3 === "object" && Object.prototype.hasOwnProperty.call(error3, "code") && error3.code === code;
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function sortStrings(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}
function sortTasks(tasks) {
  return [...tasks].sort((left, right) => left.qualifiedId.localeCompare(right.qualifiedId));
}
function isTrimmedPrintableIdentifier(value) {
  if (value.length === 0 || value !== value.trim()) {
    return false;
  }
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) {
      return false;
    }
  }
  return true;
}
function validateTaskId(id) {
  if (!isTrimmedPrintableIdentifier(id) || id.startsWith(".") || id.includes("/") || id.includes("\\") || id.includes("..")) {
    throw new Error(`Invalid task id "${id}".`);
  }
  return id;
}
function validateTaskName(name) {
  if (name.trim().length === 0) {
    throw new Error("Task name must not be empty.");
  }
  return name;
}
async function statIfExists(fs2, filePath) {
  try {
    return await fs2.stat(filePath);
  } catch (error3) {
    if (hasErrorCode(error3, "ENOENT")) {
      return void 0;
    }
    throw error3;
  }
}
async function rejectSymbolicLinkComponents(fs2, filePath) {
  const resolvedPath = path2.resolve(filePath);
  const rootPath = path2.parse(resolvedPath).root;
  const components = resolvedPath.slice(rootPath.length).split(path2.sep).filter(Boolean);
  let currentPath = rootPath;
  for (const component of components) {
    currentPath = path2.join(currentPath, component);
    try {
      if ((await fs2.lstat(currentPath)).isSymbolicLink()) {
        if (currentPath === "/tmp") {
          continue;
        }
        throw new Error(`Path "${filePath}" contains a symbolic link.`);
      }
    } catch (error3) {
      if (hasErrorCode(error3, "ENOENT")) {
        return;
      }
      throw error3;
    }
  }
}
async function writeAtomically(fs2, filePath, content) {
  const tempPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  let tempCreated = false;
  await fs2.mkdir(path2.dirname(filePath), { recursive: true });
  try {
    await fs2.writeFile(tempPath, content, { encoding: "utf8", flag: "wx" });
    tempCreated = true;
    await fs2.rename(tempPath, filePath);
    tempCreated = false;
  } catch (error3) {
    if (tempCreated || !hasErrorCode(error3, "EEXIST")) {
      try {
        await fs2.unlink(tempPath);
      } catch (unlinkError) {
        if (!hasErrorCode(unlinkError, "ENOENT")) {
          throw unlinkError;
        }
      }
    }
    throw error3;
  }
}
async function withFileLock(fs2, lockPath, operation) {
  await fs2.mkdir(path2.dirname(lockPath), { recursive: true });
  for (; ; ) {
    try {
      await fs2.writeFile(lockPath, String(process.pid), { encoding: "utf8", flag: "wx" });
      break;
    } catch (error3) {
      if (!hasErrorCode(error3, "EEXIST")) {
        await fs2.unlink(lockPath).catch(() => void 0);
        throw error3;
      }
      if (await removeAbandonedLock(fs2, lockPath)) {
        continue;
      }
      await Promise.resolve();
    }
  }
  try {
    return await operation();
  } finally {
    await fs2.unlink(lockPath);
  }
}
async function removeAbandonedLock(fs2, lockPath) {
  let content;
  try {
    content = await fs2.readFile(lockPath, "utf8");
  } catch (error3) {
    if (hasErrorCode(error3, "ENOENT")) {
      return true;
    }
    throw error3;
  }
  const owner = Number(content);
  if (Number.isInteger(owner) && owner > 0 && isProcessRunning(owner)) {
    return false;
  }
  try {
    await fs2.unlink(lockPath);
    return true;
  } catch (error3) {
    if (hasErrorCode(error3, "ENOENT")) {
      return true;
    }
    throw error3;
  }
}
function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error3) {
    return !hasErrorCode(error3, "ESRCH");
  }
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/gh-issues.js
var PROJECT_ORGANIZATION_QUERY = `query Project($owner: String!, $number: Int!) {
  organization(login: $owner) {
    projectV2(number: $number) {
      id
      title
      field(name: "Status") {
        ... on ProjectV2SingleSelectField {
          id
          name
          options { id name color description }
        }
      }
      fields(first: 100) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name color description }
          }
        }
      }
    }
  }
}`;
var PROJECT_USER_QUERY = `query Project($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      id
      title
      field(name: "Status") {
        ... on ProjectV2SingleSelectField {
          id
          name
          options { id name color description }
        }
      }
      fields(first: 100) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name color description }
          }
        }
      }
    }
  }
}`;
var PROJECT_ITEMS_QUERY = `query Items($projectId: ID!, $after: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100, after: $after) {
        nodes {
          id
          content {
            __typename
            ... on Issue {
              number
              title
              body
              url
              createdAt
              labels(first: 50) { nodes { name } }
              assignees(first: 20) { nodes { login } }
              milestone { title }
            }
          }
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}`;
var REPOSITORY_ISSUES_QUERY = `query Issues($owner: String!, $repo: String!, $labels: [String!], $after: String) {
  repository(owner: $owner, name: $repo) {
    issues(first: 100, after: $after, labels: $labels, states: OPEN) {
      nodes {
        __typename
        number
        title
        body
        url
        createdAt
        labels(first: 50) { nodes { name } }
        assignees(first: 20) { nodes { login } }
        milestone { title }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;
var ISSUE_QUERY = `query Issue($owner: String!, $repo: String!, $number: Int!, $after: String) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      id
      number
      title
      body
      url
      createdAt
      labels(first: 50) { nodes { name } }
      assignees(first: 20) { nodes { login } }
      milestone { title }
      projectItems(first: 100, after: $after) {
        nodes {
          id
          project { id }
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}`;
var REPOSITORY_ISSUE_QUERY = `query Issue($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      id
      number
      title
      body
      url
      createdAt
      labels(first: 50) { nodes { name } }
      assignees(first: 20) { nodes { login } }
      milestone { title }
    }
  }
}`;
var ISSUE_STATE_LABELS_QUERY = `query IssueStateLabels($owner: String!, $repo: String!, $number: Int!, $after: String) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      id
      labels(first: 50) { nodes { id name } }
      projectItems(first: 100, after: $after) {
        nodes {
          id
          project { id }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}`;
var REPOSITORY_ISSUE_STATE_LABELS_QUERY = `query IssueStateLabels($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      id
      labels(first: 50) { nodes { id name } }
    }
  }
}`;
var REPOSITORY_QUERY = `query Repository($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    id
  }
}`;
var ISSUE_ID_QUERY = `query IssueId($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      id
    }
  }
}`;
var REPOSITORY_LABEL_QUERY = `query RepositoryLabel($owner: String!, $repo: String!, $name: String!) {
  repository(owner: $owner, name: $repo) {
    label(name: $name) {
      id
    }
  }
}`;
var CREATE_ISSUE_MUTATION = `mutation CreateIssue($input: CreateIssueInput!) {
  createIssue(input: $input) {
    issue {
      id
      number
      title
      body
      url
      createdAt
      labels(first: 50) { nodes { name } }
      assignees(first: 20) { nodes { login } }
      milestone { title }
    }
  }
}`;
var ADD_PROJECT_ITEM_MUTATION = `mutation AddProjectItem($input: AddProjectV2ItemByIdInput!) {
  addProjectV2ItemById(input: $input) {
    item {
      id
    }
  }
}`;
var UPDATE_STATUS_MUTATION = `mutation UpdateProjectItemStatus($input: UpdateProjectV2ItemFieldValueInput!) {
  updateProjectV2ItemFieldValue(input: $input) {
    projectV2Item {
      id
    }
  }
}`;
var UPDATE_ISSUE_MUTATION = `mutation UpdateIssue($input: UpdateIssueInput!) {
  updateIssue(input: $input) {
    issue {
      id
    }
  }
}`;
var ADD_LABELS_MUTATION = `mutation AddLabels($input: AddLabelsToLabelableInput!) {
  addLabelsToLabelable(input: $input) {
    clientMutationId
  }
}`;
var REMOVE_LABELS_MUTATION = `mutation RemoveLabels($input: RemoveLabelsFromLabelableInput!) {
  removeLabelsFromLabelable(input: $input) {
    clientMutationId
  }
}`;
var ADD_COMMENT_MUTATION = `mutation AddComment($input: AddCommentInput!) {
  addComment(input: $input) {
    commentEdge {
      node {
        id
      }
    }
  }
}`;
var UPDATE_PROJECT_ITEM_POSITION_MUTATION = `mutation UpdateProjectItemPosition($input: UpdateProjectV2ItemPositionInput!) {
  updateProjectV2ItemPosition(input: $input) {
    clientMutationId
  }
}`;
var DELETE_PROJECT_ITEM_MUTATION = `mutation DeleteProjectItem($input: DeleteProjectV2ItemInput!) {
  deleteProjectV2Item(input: $input) {
    deletedItemId
  }
}`;
async function ghIssuesBackend(deps) {
  if (deps.state?.labelPrefix === "") {
    throw new Error("gh-issues state.labelPrefix must be a non-empty string when configured.");
  }
  if (deps.stateMachine !== void 0) {
    validateMachine(deps.stateMachine);
  }
  const client = createGhClient({
    token: deps.token,
    endpoint: deps.endpoint,
    fetch: deps.fetch
  });
  const repoParts = parseRepo(deps.repo);
  const project = deps.project;
  let listName;
  let session;
  if (project === void 0) {
    if (deps.state?.labelPrefix === void 0 || deps.stateMachine === void 0) {
      throw new Error("gh-issues requires project or label-backed stateMachine configuration.");
    }
    listName = deps.repo;
    session = createLabelSession(deps.stateMachine, deps.state.labelPrefix);
  } else {
    listName = `${project.owner}/${project.number}`;
    const variables = { owner: project.owner, number: project.number };
    const organizationResult = await client.graphql(PROJECT_ORGANIZATION_QUERY, variables);
    let resolvedProject = organizationResult.organization?.projectV2 ?? null;
    if (resolvedProject === null) {
      const userResult = await client.graphql(PROJECT_USER_QUERY, variables);
      resolvedProject = userResult.user?.projectV2 ?? null;
    }
    if (resolvedProject === null) {
      throw new Error(`Project ${listName} not found or inaccessible.`);
    }
    const field = resolvedProject.field;
    if (!isStatusField(field)) {
      throw new Error(`Project ${listName} has no Status field; gh-issues requires one.`);
    }
    if (field.options.length === 0) {
      throw new Error(`Project ${listName} Status field has no options.`);
    }
    session = createProjectSession(resolvedProject, field, deps.state?.labelPrefix);
  }
  const context = {
    client,
    repoOwner: repoParts.owner,
    repoName: repoParts.name,
    issueIds: /* @__PURE__ */ new Map(),
    labels: resolveLabelsFilter(deps.filter)
  };
  function list(name) {
    assertSingleList(name, listName);
    return createTasksView(listName, session, context);
  }
  return {
    list,
    async lists() {
      return [listName];
    },
    async allTasks(filter) {
      return list(listName).all(filter);
    },
    async get(qualifiedId) {
      const id = parseQualifiedId(qualifiedId, listName);
      return list(listName).get(id);
    },
    async moveBetweenLists(_qualifiedId, _targetList) {
      throw singleListError(listName);
    }
  };
}
function createProjectSession(project, field, labelPrefix) {
  const statusOptions = new Map(field.options.map((option) => [option.name, option.id]));
  const states = field.options.map((option) => option.name);
  const events = Object.fromEntries(states.map((state) => [state, Object.freeze({ from: "*", to: state })]));
  const stateMachine = Object.freeze({
    states: Object.freeze([...states]),
    initial: states[0],
    events: Object.freeze(events)
  });
  return Object.freeze({
    projectId: project.id,
    statusFieldId: field.id,
    statusOptions,
    stateMachine,
    labelPrefix,
    labelIds: /* @__PURE__ */ new Map()
  });
}
function createLabelSession(stateMachine, labelPrefix) {
  return Object.freeze({
    statusOptions: new Map(stateMachine.states.map((state) => [state, state])),
    stateMachine,
    labelPrefix,
    labelIds: /* @__PURE__ */ new Map()
  });
}
function createTasksView(name, session, context) {
  return {
    name,
    stateMachine: session.stateMachine,
    async all(filter) {
      if (filter?.includeArchived === true) {
        return [];
      }
      const tasks = await fetchTasks(name, session, context);
      const filteredTasks = filter?.state === void 0 ? tasks : tasks.filter((task) => task.state === filter.state);
      if (filter?.order === "alphabetical") {
        return sortTasks(filteredTasks);
      }
      if (filter?.order === "created") {
        return applyOrder(filteredTasks.map((task) => ({
          task,
          raw: {
            created: task.metadata.created
          }
        })), "created");
      }
      return filteredTasks;
    },
    async get(id) {
      return fetchIssueTask(id, name, session, context);
    },
    /**
     * GitHub Issues assigns the issue number, so TaskCreate.id is intentionally ignored.
     */
    async create(input) {
      const repositoryId = await resolveRepositoryId(context);
      const labelIds = await resolveConfiguredLabelIds(session, context);
      const created = await context.client.graphql(CREATE_ISSUE_MUTATION, {
        input: {
          repositoryId,
          title: input.name,
          body: input.description ?? "",
          ...labelIds.length === 0 ? {} : { labelIds }
        }
      });
      const issue = created.createIssue?.issue;
      const issueId = issue?.id ?? null;
      const issueNumber = issue?.number ?? null;
      if (issue === void 0 || issue === null || issueId === null || issueNumber === null) {
        throw new Error("GitHub createIssue response did not include issue id and number.");
      }
      context.issueIds.set(issueNumber, issueId);
      let projectItemId;
      try {
        if (session.projectId !== void 0) {
          const added = await context.client.graphql(ADD_PROJECT_ITEM_MUTATION, {
            input: {
              projectId: session.projectId,
              contentId: issueId
            }
          });
          projectItemId = added.addProjectV2ItemById?.item?.id ?? void 0;
          if (projectItemId === void 0) {
            throw new Error("GitHub addProjectV2ItemById response did not include project item id.");
          }
        }
        if (session.labelPrefix === void 0) {
          if (projectItemId === void 0) {
            throw new Error("gh-issues project-backed state requires a project item id.");
          }
          await updateProjectItemStatus(projectItemId, session.stateMachine.initial, session, context);
        } else {
          await addStateLabel(issueId, session.stateMachine.initial, session, context);
        }
      } catch (error3) {
        if (projectItemId !== void 0 && session.projectId !== void 0) {
          await context.client.graphql(DELETE_PROJECT_ITEM_MUTATION, {
            input: { projectId: session.projectId, itemId: projectItemId }
          });
        }
        await context.client.graphql(UPDATE_ISSUE_MUTATION, {
          input: { id: issueId, state: "CLOSED" }
        });
        throw error3;
      }
      const task = mapIssueToTask({
        issue: {
          ...issue,
          number: issueNumber,
          title: input.name,
          body: input.description ?? "",
          url: issue.url,
          createdAt: issue.createdAt,
          labels: {
            nodes: [
              ...(context.labels ?? []).map((label) => ({ name: label })),
              ...session.labelPrefix === void 0 ? [] : [{ name: `${session.labelPrefix}${session.stateMachine.initial}` }]
            ]
          }
        },
        projectItemId,
        statusName: session.stateMachine.initial,
        listName: name,
        session
      });
      return session.labelPrefix === void 0 ? task : { ...task, state: session.stateMachine.initial };
    },
    async update(id, patch) {
      const task = await fetchIssueTask(id, name, session, context);
      const input = {};
      if (patch.name !== void 0) {
        input.title = patch.name;
      }
      if (patch.description !== void 0) {
        input.body = patch.description;
      }
      if (Object.keys(input).length > 0) {
        input.id = await resolveIssueId(id, name, context);
        await context.client.graphql(UPDATE_ISSUE_MUTATION, {
          input
        });
      }
      return {
        ...task,
        name: patch.name ?? task.name,
        description: patch.description ?? task.description
      };
    },
    async fire(id, event, _opts) {
      if (!session.statusOptions.has(event)) {
        throw new InvalidTransitionError({
          event,
          to: event,
          reason: `Unknown gh-issues Status state "${event}".`
        });
      }
      const task = await fetchIssueTask(id, name, session, context);
      const transition = findEvent(session.stateMachine, task.state, event);
      if (transition === void 0) {
        throw new InvalidTransitionError({
          task,
          event,
          to: event,
          reason: `Cannot fire event "${event}" from task state "${task.state}".`
        });
      }
      if (session.labelPrefix === void 0) {
        const projectItemId = projectItemIdFromTask(task);
        await updateProjectItemStatus(projectItemId, event, session, context);
      } else {
        await updateIssueStateLabel(id, name, event, session, context);
      }
      return { ...task, state: event };
    },
    async comment(id, body) {
      await fetchIssueTask(id, name, session, context);
      await context.client.graphql(ADD_COMMENT_MUTATION, {
        input: {
          subjectId: await resolveIssueId(id, name, context),
          body
        }
      });
    },
    async canFire(id, event) {
      const task = await fetchIssueTask(id, name, session, context);
      return findEvent(session.stateMachine, task.state, event) !== void 0;
    },
    async events(id) {
      const task = await fetchIssueTask(id, name, session, context);
      return eventsFromState(session.stateMachine, task.state);
    },
    async delete(id) {
      if (session.projectId === void 0) {
        await context.client.graphql(UPDATE_ISSUE_MUTATION, {
          input: {
            id: await resolveIssueId(id, name, context),
            state: "CLOSED"
          }
        });
        return;
      }
      const projectItemId = await resolveProjectItemId(id, name, session, context);
      await context.client.graphql(DELETE_PROJECT_ITEM_MUTATION, {
        input: {
          projectId: session.projectId,
          itemId: projectItemId
        }
      });
    },
    async move(id, anchor) {
      assertProjectBacked(session, "move");
      const task = await fetchIssueTask(id, name, session, context);
      const projectItemId = projectItemIdFromTask(task);
      const afterId = await resolveMoveAfterId(id, anchor, name, session, context);
      await updateProjectItemPosition(projectItemId, afterId, session, context);
      return task;
    },
    async reorder(ids) {
      assertProjectBacked(session, "reorder");
      const currentTasks = await fetchProjectTasks(name, session, context);
      const currentIds = currentTasks.map((task) => task.id);
      const currentSet = new Set(currentIds);
      const inputSet = new Set(ids);
      const seenInputIds = /* @__PURE__ */ new Set();
      const missing = currentIds.filter((id) => !inputSet.has(id));
      const extra = ids.filter((id) => {
        if (!currentSet.has(id)) {
          return true;
        }
        if (seenInputIds.has(id)) {
          return true;
        }
        seenInputIds.add(id);
        return false;
      });
      if (missing.length > 0 || extra.length > 0) {
        throw new OrderMismatchError({ missing, extra });
      }
      const itemIdsByTaskId = new Map(currentTasks.map((task) => [task.id, projectItemIdFromTask(task)]));
      let afterId = null;
      try {
        for (const id of ids) {
          const projectItemId = itemIdsByTaskId.get(id);
          if (projectItemId === void 0) {
            throw new OrderMismatchError({ missing: [id], extra: [] });
          }
          await updateProjectItemPosition(projectItemId, afterId, session, context);
          afterId = projectItemId;
        }
      } catch (error3) {
        await restoreProjectOrder(currentTasks, session, context);
        throw error3;
      }
      return fetchProjectTasks(name, session, context);
    }
  };
}
async function restoreProjectOrder(tasks, session, context) {
  let afterId = null;
  for (const task of tasks) {
    const projectItemId = projectItemIdFromTask(task);
    await updateProjectItemPosition(projectItemId, afterId, session, context);
    afterId = projectItemId;
  }
}
async function resolveRepositoryId(context) {
  if (context.repositoryId !== void 0) {
    return context.repositoryId;
  }
  const result = await context.client.graphql(REPOSITORY_QUERY, {
    owner: context.repoOwner,
    repo: context.repoName
  });
  const repositoryId = result.repository?.id ?? null;
  if (repositoryId === null) {
    throw new Error(`Repository ${context.repoOwner}/${context.repoName} not found or inaccessible.`);
  }
  context.repositoryId = repositoryId;
  return repositoryId;
}
async function resolveIssueId(id, listName, context) {
  const issueNumber = parseIssueNumber(id, listName);
  const cachedIssueId = context.issueIds.get(issueNumber);
  if (cachedIssueId !== void 0) {
    return cachedIssueId;
  }
  const result = await context.client.graphql(ISSUE_ID_QUERY, {
    owner: context.repoOwner,
    repo: context.repoName,
    number: issueNumber
  });
  const issueId = result.repository?.issue?.id ?? null;
  if (issueId === null) {
    throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
  }
  context.issueIds.set(issueNumber, issueId);
  return issueId;
}
async function resolveProjectItemId(id, listName, session, context) {
  assertProjectBacked(session, "resolve project item");
  const issueNumber = parseIssueNumber(id, listName);
  let after;
  while (true) {
    const result = await context.client.graphql(ISSUE_STATE_LABELS_QUERY, {
      owner: context.repoOwner,
      repo: context.repoName,
      number: issueNumber,
      after
    });
    const issue = result.repository?.issue ?? null;
    if (issue === null) {
      throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
    }
    if (issue.id !== void 0 && issue.id !== null) {
      context.issueIds.set(issueNumber, issue.id);
    }
    const projectItem = issue.projectItems?.nodes?.find((item) => item.project?.id === session.projectId) ?? null;
    if (projectItem !== null) {
      return projectItem.id;
    }
    const pageInfo = issue.projectItems?.pageInfo;
    if (pageInfo?.hasNextPage !== true || pageInfo.endCursor === void 0 || pageInfo.endCursor === null) {
      throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
    }
    after = pageInfo.endCursor;
  }
}
async function updateProjectItemStatus(projectItemId, state, session, context) {
  assertProjectBacked(session, "set project status");
  const optionId = session.statusOptions.get(state);
  if (optionId === void 0) {
    throw new InvalidTransitionError({
      to: state,
      reason: `Unknown gh-issues Status state "${state}".`
    });
  }
  await context.client.graphql(UPDATE_STATUS_MUTATION, {
    input: {
      projectId: session.projectId,
      itemId: projectItemId,
      fieldId: session.statusFieldId,
      value: {
        singleSelectOptionId: optionId
      }
    }
  });
}
async function addStateLabel(issueId, state, session, context) {
  const labelId = await resolveStateLabelId(state, session, context);
  await context.client.graphql(ADD_LABELS_MUTATION, {
    input: {
      labelableId: issueId,
      labelIds: [labelId]
    }
  });
}
async function updateIssueStateLabel(id, listName, state, session, context) {
  const issueNumber = parseIssueNumber(id, listName);
  let after;
  let issue = null;
  let isInProject = session.projectId === void 0;
  while (true) {
    const result = await context.client.graphql(session.projectId === void 0 ? REPOSITORY_ISSUE_STATE_LABELS_QUERY : ISSUE_STATE_LABELS_QUERY, {
      owner: context.repoOwner,
      repo: context.repoName,
      number: issueNumber,
      after
    });
    const currentIssue = result.repository?.issue ?? null;
    if (currentIssue === null) {
      throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
    }
    if (typeof currentIssue.id === "string") {
      context.issueIds.set(issueNumber, currentIssue.id);
    }
    issue ??= currentIssue;
    if (session.projectId === void 0) {
      break;
    }
    if (currentIssue.projectItems?.nodes?.some((item) => item.project?.id === session.projectId)) {
      isInProject = true;
      break;
    }
    const pageInfo = currentIssue.projectItems?.pageInfo;
    if (pageInfo?.hasNextPage !== true || pageInfo.endCursor === void 0 || pageInfo.endCursor === null) {
      break;
    }
    after = pageInfo.endCursor;
  }
  if (issue === null) {
    throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
  }
  const issueId = issue.id ?? null;
  if (issueId === null) {
    throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
  }
  if (!isInProject) {
    throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
  }
  const targetLabel = `${session.labelPrefix}${state}`;
  const stateLabels = (issue.labels?.nodes ?? []).filter((node) => node !== null && node.name.startsWith(session.labelPrefix ?? ""));
  const targetNode = stateLabels.find((node) => node.name === targetLabel);
  if (targetNode === void 0) {
    await addStateLabel(issueId, state, session, context);
  }
  const labelIdsToRemove = stateLabels.filter((node) => node.name !== targetLabel && node.id !== void 0).map((node) => node.id);
  if (labelIdsToRemove.length > 0) {
    await context.client.graphql(REMOVE_LABELS_MUTATION, {
      input: {
        labelableId: issueId,
        labelIds: labelIdsToRemove
      }
    });
  }
}
async function resolveStateLabelId(state, session, context) {
  return resolveLabelId(`${session.labelPrefix}${state}`, session, context);
}
async function resolveConfiguredLabelIds(session, context) {
  return Promise.all((context.labels ?? []).map((name) => resolveLabelId(name, session, context)));
}
async function resolveLabelId(name, session, context) {
  const cachedLabelId = session.labelIds.get(name);
  if (cachedLabelId !== void 0) {
    return cachedLabelId;
  }
  const result = await context.client.graphql(REPOSITORY_LABEL_QUERY, {
    owner: context.repoOwner,
    repo: context.repoName,
    name
  });
  const labelId = result.repository?.label?.id ?? null;
  if (labelId === null) {
    throw new Error(`GitHub label "${name}" not found or inaccessible.`);
  }
  session.labelIds.set(name, labelId);
  return labelId;
}
async function updateProjectItemPosition(projectItemId, afterId, session, context) {
  assertProjectBacked(session, "update project position");
  await context.client.graphql(UPDATE_PROJECT_ITEM_POSITION_MUTATION, {
    input: {
      projectId: session.projectId,
      itemId: projectItemId,
      afterId
    }
  });
}
async function resolveMoveAfterId(movingId, anchor, listName, session, context) {
  if ("position" in anchor) {
    if (anchor.position === "top") {
      return null;
    }
    const tasks2 = await fetchProjectTasks(listName, session, context);
    for (let index = tasks2.length - 1; index >= 0; index -= 1) {
      const task = tasks2[index];
      if (task.id !== movingId) {
        return projectItemIdFromTask(task);
      }
    }
    return null;
  }
  const anchorId = "before" in anchor ? anchor.before : anchor.after;
  let anchorProjectItemId;
  try {
    anchorProjectItemId = await resolveProjectItemId(anchorId, listName, session, context);
  } catch (error3) {
    if (error3 instanceof TaskNotFoundError) {
      throw new AnchorNotFoundError(anchorId);
    }
    throw error3;
  }
  if ("after" in anchor) {
    return anchorProjectItemId;
  }
  const tasks = await fetchProjectTasks(listName, session, context);
  const anchorIndex = tasks.findIndex((task) => task.id === anchorId);
  if (anchorIndex < 0) {
    throw new AnchorNotFoundError(anchorId);
  }
  for (let index = anchorIndex - 1; index >= 0; index -= 1) {
    const predecessor = tasks[index];
    if (predecessor.id !== movingId) {
      return projectItemIdFromTask(predecessor);
    }
  }
  return null;
}
async function fetchProjectTasks(listName, session, context) {
  assertProjectBacked(session, "list project items");
  const tasks = [];
  let after = null;
  do {
    const result = await context.client.graphql(PROJECT_ITEMS_QUERY, {
      projectId: session.projectId,
      after
    });
    const items = result.node?.items;
    for (const item of items?.nodes ?? []) {
      const task = mapProjectItemToTask(item, listName, session);
      if (task !== null) {
        tasks.push(task);
      }
    }
    after = items?.pageInfo?.hasNextPage === true ? items.pageInfo.endCursor ?? null : null;
  } while (after !== null);
  return tasks;
}
async function fetchTasks(listName, session, context) {
  if (session.projectId !== void 0) {
    return fetchProjectTasks(listName, session, context);
  }
  const tasks = [];
  let after = null;
  do {
    const result = await context.client.graphql(REPOSITORY_ISSUES_QUERY, {
      owner: context.repoOwner,
      repo: context.repoName,
      labels: context.labels,
      after
    });
    const issues = result.repository?.issues;
    for (const issue of issues?.nodes ?? []) {
      tasks.push(mapIssueToTask({ issue, statusName: null, listName, session }));
    }
    after = issues?.pageInfo?.hasNextPage === true ? issues.pageInfo.endCursor ?? null : null;
  } while (after !== null);
  return tasks;
}
async function fetchIssueTask(id, listName, session, context) {
  const issueNumber = parseIssueNumber(id, listName);
  let after;
  let issue = null;
  let projectItem = null;
  while (true) {
    const result = await context.client.graphql(session.projectId === void 0 ? REPOSITORY_ISSUE_QUERY : ISSUE_QUERY, {
      owner: context.repoOwner,
      repo: context.repoName,
      number: issueNumber,
      after
    });
    const currentIssue = result.repository?.issue ?? null;
    if (currentIssue === null) {
      throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
    }
    if (currentIssue.id !== void 0) {
      context.issueIds.set(issueNumber, currentIssue.id);
    }
    issue ??= currentIssue;
    if (session.projectId === void 0) {
      break;
    }
    projectItem = currentIssue.projectItems?.nodes?.find((item) => item.project?.id === session.projectId) ?? null;
    if (projectItem !== null) {
      break;
    }
    const pageInfo = currentIssue.projectItems?.pageInfo;
    if (pageInfo?.hasNextPage !== true || pageInfo.endCursor === void 0 || pageInfo.endCursor === null) {
      throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
    }
    after = pageInfo.endCursor;
  }
  return mapIssueToTask({
    issue,
    projectItemId: projectItem?.id,
    statusName: projectItem?.fieldValueByName?.name ?? null,
    listName,
    session
  });
}
function parseIssueNumber(id, listName) {
  if (!isCanonicalDecimalIssueId(id)) {
    throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
  }
  const issueNumber = Number(id);
  if (!Number.isSafeInteger(issueNumber) || issueNumber < 1) {
    throw new TaskNotFoundError(`Task "${listName}/${id}" not found.`);
  }
  return issueNumber;
}
function isCanonicalDecimalIssueId(id) {
  if (id.length === 0 || id[0] === "0") {
    return false;
  }
  for (let index = 0; index < id.length; index += 1) {
    const charCode = id.charCodeAt(index);
    if (charCode < 48 || charCode > 57) {
      return false;
    }
  }
  return true;
}
function mapProjectItemToTask(item, listName, session) {
  const content = item.content;
  if (!isIssueNode(content)) {
    return null;
  }
  return mapIssueToTask({
    issue: content,
    projectItemId: item.id,
    statusName: item.fieldValueByName?.name ?? null,
    listName,
    session
  });
}
function isIssueNode(value) {
  return isRecord3(value) && value.__typename === "Issue" && typeof value.number === "number" && typeof value.title === "string" && typeof value.url === "string" && typeof value.createdAt === "string";
}
function mapIssueToTask(options) {
  const id = String(options.issue.number);
  const labels = (options.issue.labels?.nodes ?? []).filter((node) => node !== null).map((node) => node.name);
  const assignees = (options.issue.assignees?.nodes ?? []).filter((node) => node !== null).map((node) => node.login);
  return {
    list: options.listName,
    id,
    qualifiedId: `${options.listName}#${id}`,
    name: options.issue.title,
    description: options.issue.body ?? "",
    state: resolveTaskState(labels, options.statusName, options.session),
    metadata: {
      url: options.issue.url,
      labels,
      assignees,
      milestone: options.issue.milestone?.title ?? null,
      ...options.projectItemId === void 0 ? {} : { projectItemId: options.projectItemId },
      created: options.issue.createdAt
    }
  };
}
function resolveTaskState(labels, statusName, session) {
  if (session.labelPrefix === void 0) {
    return statusName ?? session.stateMachine.initial;
  }
  return session.stateMachine.states.find((state) => labels.includes(`${session.labelPrefix}${state}`)) ?? session.stateMachine.initial;
}
function projectItemIdFromTask(task) {
  const projectItemId = task.metadata.projectItemId;
  if (typeof projectItemId !== "string") {
    throw new Error(`Task "${task.qualifiedId}" is missing GitHub project item metadata.`);
  }
  return projectItemId;
}
function assertProjectBacked(session, operation) {
  if (session.projectId === void 0 || session.statusFieldId === void 0) {
    throw new Error(`gh-issues ${operation} requires a configured GitHub Project.`);
  }
}
function resolveLabelsFilter(filter) {
  if (filter === void 0) {
    return void 0;
  }
  const prefix = "label:";
  if (!filter.startsWith(prefix)) {
    throw new Error('gh-issues filter currently supports only "label:<name>".');
  }
  const label = filter.slice(prefix.length).trim();
  if (label.length === 0) {
    throw new Error('gh-issues filter requires a non-empty label after "label:".');
  }
  return [label];
}
function parseRepo(repo) {
  const parts = repo.split("/");
  if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
    throw new Error(`Invalid GitHub repository "${repo}". Expected "owner/name".`);
  }
  return {
    owner: parts[0],
    name: parts[1]
  };
}
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStatusOption(value) {
  return isRecord3(value) && typeof value.id === "string" && typeof value.name === "string";
}
function isStatusField(value) {
  return isRecord3(value) && typeof value.id === "string" && Array.isArray(value.options) && value.options.every(isStatusOption);
}
function assertSingleList(name, listName) {
  if (name !== listName) {
    throw singleListError(listName);
  }
}
function singleListError(listName) {
  return new Error(`gh-issues backend has a single list ${listName}`);
}
function parseQualifiedId(qualifiedId, listName) {
  const prefix = `${listName}#`;
  if (!qualifiedId.startsWith(prefix) || qualifiedId.length === prefix.length) {
    throw new Error(`Invalid qualified task id "${qualifiedId}".`);
  }
  return qualifiedId.slice(prefix.length);
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/markdown-dir.js
var import_yaml3 = __toESM(require_dist(), 1);
import path3 from "node:path";

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/schema/task.schema.json
var task_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://poe-platform.github.io/poe-code/schemas/task-list/task.schema.json",
  title: "Task",
  description: "Persisted task payload used by task-list backends.",
  type: "object",
  properties: {
    $schema: {
      type: "string",
      const: "https://poe-platform.github.io/poe-code/schemas/task-list/task.schema.json"
    },
    kind: {
      type: "string",
      const: "task"
    },
    version: {
      type: "integer",
      const: 1
    },
    name: {
      type: "string",
      minLength: 1
    },
    state: {
      type: "string"
    },
    description: {
      type: "string"
    }
  },
  required: ["name", "state"],
  additionalProperties: true
};

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/state.js
var defaultStateMachine = {
  initial: "draft",
  states: ["draft", "planned", "in-progress", "done", "archived"],
  events: {
    plan: { from: ["draft"], to: "planned" },
    start: { from: ["planned"], to: "in-progress" },
    complete: { from: ["in-progress"], to: "done" },
    archive: { from: "*", to: "archived" }
  }
};
Object.freeze(defaultStateMachine.states);
for (const event of Object.values(defaultStateMachine.events)) {
  if (event.from !== "*") {
    Object.freeze(event.from);
  }
  Object.freeze(event);
}
Object.freeze(defaultStateMachine.events);
Object.freeze(defaultStateMachine);
function deriveLegacyTransitions(machine) {
  const transitions = Object.fromEntries(machine.states.map((state) => [state, /* @__PURE__ */ new Set()]));
  for (const fromState of machine.states) {
    for (const eventName of Object.keys(machine.events)) {
      const event = findEvent(machine, fromState, eventName);
      if (event !== void 0) {
        transitions[fromState].add(event.to);
      }
    }
  }
  const terminalState = machine.events.archive.to;
  const activeStates = machine.states.filter((state) => state !== terminalState);
  for (let index = 1; index < activeStates.length; index += 1) {
    transitions[activeStates[index]].add(activeStates[index - 1]);
  }
  return transitions;
}
var defaultTransitions = deriveLegacyTransitions(defaultStateMachine);
function resolveStateMachine(stateMachine) {
  return stateMachine ?? defaultStateMachine;
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/markdown-dir.js
var ARCHIVE_DIRECTORY_NAME = "archive";
var MARKDOWN_EXTENSION = ".md";
var TASK_KIND = "task";
var TASK_VERSION = 1;
var TASK_SCHEMA_ID = task_schema_default.$id;
var MIN_PREFIX_WIDTH = 2;
var RESERVED_FRONTMATTER_KEYS = /* @__PURE__ */ new Set([
  "$schema",
  "created",
  "description",
  "kind",
  "name",
  "state",
  "version"
]);
var PASSTHROUGH_RESERVED_FRONTMATTER_KEYS = /* @__PURE__ */ new Set(["description", "name", "state"]);
function resolveListLayout(deps) {
  return deps.singleList ? { kind: "single", name: deps.singleList } : { kind: "multi" };
}
function validateListName(name) {
  if (!isTrimmedPrintableIdentifier(name) || name === ARCHIVE_DIRECTORY_NAME || name.startsWith(".") || name.includes("/") || name.includes("\\") || name.includes("..")) {
    throw new Error(`Invalid task list name "${name}".`);
  }
  return name;
}
function parseQualifiedId2(qualifiedId) {
  const separatorIndex = qualifiedId.indexOf("/");
  if (separatorIndex <= 0 || separatorIndex !== qualifiedId.lastIndexOf("/") || separatorIndex === qualifiedId.length - 1) {
    throw new Error(`Invalid qualified task id "${qualifiedId}".`);
  }
  return {
    list: validateListName(qualifiedId.slice(0, separatorIndex)),
    id: validateTaskId(qualifiedId.slice(separatorIndex + 1))
  };
}
function listPath(rootPath, layout, list) {
  return layout.kind === "single" ? rootPath : path3.join(rootPath, list);
}
function archiveDirectoryPath(rootPath, layout, list) {
  return layout.kind === "single" ? path3.join(rootPath, ARCHIVE_DIRECTORY_NAME) : path3.join(rootPath, list, ARCHIVE_DIRECTORY_NAME);
}
function activeTaskFilename(id, order, width) {
  return `${String(order).padStart(width, "0")}-${id}${MARKDOWN_EXTENSION}`;
}
function archivedTaskPath(rootPath, layout, list, id) {
  return path3.join(archiveDirectoryPath(rootPath, layout, list), `${id}${MARKDOWN_EXTENSION}`);
}
function isMarkdownFile(entryName) {
  return entryName.endsWith(MARKDOWN_EXTENSION);
}
function isHiddenEntry(entryName) {
  return entryName.startsWith(".");
}
function isValidTaskIdShape(id) {
  return id.length > 0 && !id.startsWith(".") && !id.includes("/") && !id.includes("\\") && !id.includes("..");
}
function parseActiveFilename(entryName) {
  if (!isMarkdownFile(entryName))
    return void 0;
  const stem = entryName.slice(0, -MARKDOWN_EXTENSION.length);
  const match = /^(\d+)-(.+)$/.exec(stem);
  if (match) {
    const id = match[2];
    if (isValidTaskIdShape(id)) {
      return { id, order: Number.parseInt(match[1], 10) };
    }
  }
  if (isValidTaskIdShape(stem)) {
    return { id: stem, order: null };
  }
  return void 0;
}
function padWidthForCount(count) {
  return Math.max(MIN_PREFIX_WIDTH, String(Math.max(count, 1)).length);
}
function malformedTask(filePath, field) {
  return new MalformedTaskError(`Malformed task "${filePath}": invalid "${field}".`);
}
function stripTrailingCarriageReturn(line) {
  return line.endsWith("\r") ? line.slice(0, -1) : line;
}
function splitTaskDocument(content, filePath, mode) {
  const lines = content.split("\n");
  const hasFrontmatterBlock = lines.length > 0 && stripTrailingCarriageReturn(lines[0]) === "---";
  if (!hasFrontmatterBlock) {
    if (mode === "passthrough") {
      return { frontmatter: "", body: content };
    }
    throw malformedTask(filePath, "frontmatter");
  }
  let closingIndex = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (stripTrailingCarriageReturn(lines[index]) === "---") {
      closingIndex = index;
      break;
    }
  }
  if (closingIndex === -1) {
    throw malformedTask(filePath, "frontmatter");
  }
  const bodyLines = lines.slice(closingIndex + 1);
  if (bodyLines.length > 0 && stripTrailingCarriageReturn(bodyLines[0]) === "") {
    bodyLines.shift();
  }
  return {
    frontmatter: lines.slice(1, closingIndex).join("\n"),
    body: bodyLines.join("\n")
  };
}
function readFrontmatter(frontmatterContent, filePath) {
  const document = (0, import_yaml3.parseDocument)(frontmatterContent);
  if (document.errors.length > 0) {
    throw malformedTask(filePath, "frontmatter");
  }
  const parsed = document.toJS();
  if (!isRecord2(parsed)) {
    throw malformedTask(filePath, "frontmatter");
  }
  return parsed;
}
function assertValidTaskRecord(frontmatter, filePath, validStates) {
  if (hasOwnTaskField(frontmatter, "$schema") && frontmatter.$schema !== TASK_SCHEMA_ID) {
    throw malformedTask(filePath, "$schema");
  }
  if (hasOwnTaskField(frontmatter, "kind") && frontmatter.kind !== TASK_KIND) {
    throw malformedTask(filePath, "kind");
  }
  if (hasOwnTaskField(frontmatter, "version")) {
    if (typeof frontmatter.version !== "number" || !Number.isInteger(frontmatter.version) || frontmatter.version !== TASK_VERSION) {
      throw malformedTask(filePath, "version");
    }
  }
  if (!hasOwnTaskField(frontmatter, "name") || typeof frontmatter.name !== "string" || frontmatter.name.length === 0) {
    throw malformedTask(filePath, "name");
  }
  if (!hasOwnTaskField(frontmatter, "state") || typeof frontmatter.state !== "string" || !validStates.has(frontmatter.state)) {
    throw malformedTask(filePath, "state");
  }
  if (hasOwnTaskField(frontmatter, "description") && typeof frontmatter.description !== "string") {
    throw malformedTask(filePath, "description");
  }
}
function hasOwnTaskField(frontmatter, key2) {
  return Object.prototype.hasOwnProperty.call(frontmatter, key2);
}
function reservedFrontmatterKeys(mode) {
  return mode === "passthrough" ? PASSTHROUGH_RESERVED_FRONTMATTER_KEYS : RESERVED_FRONTMATTER_KEYS;
}
function setOwnValue2(record, key2, value) {
  Object.defineProperty(record, key2, {
    value,
    enumerable: true,
    writable: true,
    configurable: true
  });
}
function metadataFromFrontmatter(frontmatter, mode) {
  const metadata = {};
  const reservedKeys = reservedFrontmatterKeys(mode);
  for (const [key2, value] of Object.entries(frontmatter)) {
    if (!reservedKeys.has(key2)) {
      setOwnValue2(metadata, key2, value);
    }
  }
  return metadata;
}
function createTask(list, id, frontmatter, body, mode, sourcePath) {
  return {
    list,
    id,
    qualifiedId: `${list}/${id}`,
    name: frontmatter.name,
    state: frontmatter.state,
    description: body,
    metadata: metadataFromFrontmatter(frontmatter, mode),
    ...sourcePath !== void 0 && { sourcePath: path3.resolve(sourcePath) }
  };
}
function serializeTaskDocument(frontmatter, description) {
  return `---
${(0, import_yaml3.stringify)(frontmatter)}---

${description}`;
}
async function readDirectoryNames(fs2, directoryPath) {
  try {
    return sortStrings(await fs2.readdir(directoryPath));
  } catch (error3) {
    if (hasErrorCode(error3, "ENOENT")) {
      return [];
    }
    throw error3;
  }
}
async function ensureRootPath(deps) {
  await rejectSymbolicLinkComponents(deps.fs, deps.path);
  if (deps.create) {
    await deps.fs.mkdir(deps.path, { recursive: true });
    return;
  }
  await deps.fs.stat(deps.path);
}
async function readTaskFile(fs2, list, id, filePath, validStates, initialState, mode) {
  await rejectSymbolicLinkComponents(fs2, filePath);
  const content = await fs2.readFile(filePath, "utf8");
  const document = splitTaskDocument(content, filePath, mode);
  const frontmatter = mode === "passthrough" && document.frontmatter.trim().length === 0 ? {} : readFrontmatter(document.frontmatter, filePath);
  if (mode !== "passthrough") {
    assertValidTaskRecord(frontmatter, filePath, validStates);
    return {
      path: filePath,
      frontmatter,
      task: createTask(list, id, frontmatter, document.body, mode, filePath)
    };
  }
  const effectiveFrontmatter = {
    ...frontmatter,
    name: typeof frontmatter.name === "string" ? frontmatter.name : id,
    state: typeof frontmatter.state === "string" && validStates.has(frontmatter.state) ? frontmatter.state : initialState
  };
  return {
    path: filePath,
    frontmatter,
    task: createTask(list, id, effectiveFrontmatter, document.body, mode, filePath)
  };
}
async function readPassthroughFrontmatter(fs2, filePath, mode) {
  if (mode !== "passthrough") {
    return {};
  }
  const content = await fs2.readFile(filePath, "utf8");
  const document = splitTaskDocument(content, filePath, mode);
  if (document.frontmatter.trim().length === 0) {
    return {};
  }
  return readFrontmatter(document.frontmatter, filePath);
}
async function resolveActiveFilenameEntry(fs2, entryName, entryPath, parsed, mode) {
  if (mode !== "passthrough" || parsed.order === null) {
    return parsed;
  }
  const frontmatter = await readPassthroughFrontmatter(fs2, entryPath, mode);
  if (Object.keys(frontmatter).length === 0 && orderedFilenamePrefixLength(entryName) <= MIN_PREFIX_WIDTH) {
    return parsed;
  }
  if (typeof frontmatter.state === "string" || hasOwnTaskField(frontmatter, "$schema") || hasOwnTaskField(frontmatter, "kind") || hasOwnTaskField(frontmatter, "version")) {
    return parsed;
  }
  return {
    id: entryName.slice(0, -MARKDOWN_EXTENSION.length),
    order: null,
    filename: parsed.filename
  };
}
function orderedFilenamePrefixLength(entryName) {
  const stem = entryName.slice(0, -MARKDOWN_EXTENSION.length);
  const separatorIndex = stem.indexOf("-");
  if (separatorIndex <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  for (let index = 0; index < separatorIndex; index += 1) {
    const code = stem.charCodeAt(index);
    if (code < 48 || code > 57) {
      return Number.POSITIVE_INFINITY;
    }
  }
  return separatorIndex;
}
async function findActiveTaskFilename(fs2, listDirectoryPath, id, mode) {
  const entries = await readDirectoryNames(fs2, listDirectoryPath);
  for (const entryName of entries) {
    if (isHiddenEntry(entryName))
      continue;
    const parsed = parseActiveFilename(entryName);
    if (!parsed)
      continue;
    const entryPath = path3.join(listDirectoryPath, entryName);
    const resolved = await resolveActiveFilenameEntry(fs2, entryName, entryPath, { id: parsed.id, order: parsed.order, filename: entryName }, mode);
    if (resolved.id === id) {
      return entryName;
    }
  }
  return void 0;
}
async function findTaskLocation(fs2, rootPath, layout, list, id, mode) {
  const listDirectoryPath = listPath(rootPath, layout, list);
  await rejectSymbolicLinkComponents(fs2, listDirectoryPath);
  const activeName = await findActiveTaskFilename(fs2, listDirectoryPath, id, mode);
  if (activeName) {
    const activePath = path3.join(listDirectoryPath, activeName);
    await rejectSymbolicLinkComponents(fs2, activePath);
    const activeStat = await statIfExists(fs2, activePath);
    if (activeStat?.isFile()) {
      return { archived: false, path: activePath };
    }
  }
  const archivedPath = archivedTaskPath(rootPath, layout, list, id);
  await rejectSymbolicLinkComponents(fs2, archiveDirectoryPath(rootPath, layout, list));
  await rejectSymbolicLinkComponents(fs2, archivedPath);
  const archivedStat = await statIfExists(fs2, archivedPath);
  if (archivedStat?.isFile()) {
    return { archived: true, path: archivedPath };
  }
  return void 0;
}
async function readTaskAtLocation(fs2, rootPath, layout, list, id, validStates, initialState, mode) {
  const location = await findTaskLocation(fs2, rootPath, layout, list, id, mode);
  if (!location) {
    throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
  }
  return readTaskFile(fs2, list, id, location.path, validStates, initialState, mode);
}
function createdFrontmatter(defaults2, input, initialState, mode) {
  const frontmatter = mode !== "passthrough" ? {
    $schema: TASK_SCHEMA_ID,
    kind: TASK_KIND,
    version: TASK_VERSION,
    name: input.name,
    state: initialState
  } : {
    name: input.name,
    state: initialState
  };
  const reservedKeys = reservedFrontmatterKeys(mode);
  for (const [key2, value] of Object.entries(defaults2.metadata)) {
    if (!reservedKeys.has(key2)) {
      setOwnValue2(frontmatter, key2, value);
    }
  }
  for (const [key2, value] of Object.entries(input.metadata ?? {})) {
    if (!reservedKeys.has(key2)) {
      setOwnValue2(frontmatter, key2, value);
    }
  }
  frontmatter.created = (/* @__PURE__ */ new Date()).toISOString();
  return frontmatter;
}
function updatedFrontmatter(existingFrontmatter, task, patch, mode) {
  const nextFrontmatter = mode !== "passthrough" ? {
    ...existingFrontmatter,
    $schema: existingFrontmatter.$schema ?? TASK_SCHEMA_ID,
    kind: existingFrontmatter.kind ?? TASK_KIND,
    version: existingFrontmatter.version ?? TASK_VERSION,
    name: patch.name ?? task.name,
    state: task.state
  } : {
    ...existingFrontmatter,
    name: patch.name ?? task.name,
    state: task.state
  };
  const reservedKeys = reservedFrontmatterKeys(mode);
  for (const [key2, value] of Object.entries(patch.metadata ?? {})) {
    if (!reservedKeys.has(key2)) {
      setOwnValue2(nextFrontmatter, key2, value);
    }
  }
  return nextFrontmatter;
}
function transitionedFrontmatter(existingFrontmatter, task, to, mode) {
  return mode !== "passthrough" ? {
    ...existingFrontmatter,
    $schema: existingFrontmatter.$schema ?? TASK_SCHEMA_ID,
    kind: existingFrontmatter.kind ?? TASK_KIND,
    version: existingFrontmatter.version ?? TASK_VERSION,
    name: task.name,
    state: to
  } : {
    ...existingFrontmatter,
    name: task.name,
    state: to
  };
}
function firedFrontmatter(existingFrontmatter, task, to, mode, metadataPatch) {
  const nextFrontmatter = transitionedFrontmatter(existingFrontmatter, task, to, mode);
  const reservedKeys = reservedFrontmatterKeys(mode);
  for (const [key2, value] of Object.entries(metadataPatch ?? {})) {
    if (!reservedKeys.has(key2)) {
      setOwnValue2(nextFrontmatter, key2, value);
    }
  }
  return nextFrontmatter;
}
function assertCreateDoesNotSetState(input) {
  if (Object.prototype.hasOwnProperty.call(input, "state")) {
    throw new Error('Tasks.create() does not accept "state"; new tasks always start at stateMachine.initial.');
  }
}
function assertCreateHasId(input) {
  if (input.id === void 0) {
    throw new Error("id is required for markdown-dir backend");
  }
}
function assertUpdateDoesNotSetState(patch) {
  if (Object.prototype.hasOwnProperty.call(patch, "state")) {
    throw new Error('Tasks.update() does not accept "state"; use fire() to change task state.');
  }
}
function createTasksView2(deps, layout, list) {
  const listDirectoryPath = listPath(deps.path, layout, list);
  const stateMachine = resolveStateMachine(deps.stateMachine);
  const validStates = new Set(stateMachine.states);
  async function readActiveEntries() {
    await rejectSymbolicLinkComponents(deps.fs, listDirectoryPath);
    const entries = await readDirectoryNames(deps.fs, listDirectoryPath);
    const result = [];
    for (const entryName of entries) {
      if (isHiddenEntry(entryName))
        continue;
      const parsed = parseActiveFilename(entryName);
      if (!parsed)
        continue;
      const entryPath = path3.join(listDirectoryPath, entryName);
      await rejectSymbolicLinkComponents(deps.fs, entryPath);
      const entryStat = await statIfExists(deps.fs, entryPath);
      if (!entryStat?.isFile())
        continue;
      result.push(await resolveActiveFilenameEntry(deps.fs, entryName, entryPath, { id: parsed.id, order: parsed.order, filename: entryName }, deps.frontmatterMode));
    }
    result.sort((left, right) => {
      const leftOrder = left.order ?? Number.POSITIVE_INFINITY;
      const rightOrder = right.order ?? Number.POSITIVE_INFINITY;
      if (leftOrder !== rightOrder)
        return leftOrder - rightOrder;
      return left.filename.localeCompare(right.filename);
    });
    return result;
  }
  async function readActiveTasks() {
    const entries = await readActiveEntries();
    const tasks = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      const filePath = path3.join(listDirectoryPath, entry.filename);
      const file = await readTaskFile(deps.fs, list, entry.id, filePath, validStates, stateMachine.initial, deps.frontmatterMode);
      tasks.set(entry.id, { task: file.task, raw: file.frontmatter });
    }
    return { entries, tasks };
  }
  async function readArchivedTasks() {
    const archivePath = archiveDirectoryPath(deps.path, layout, list);
    await rejectSymbolicLinkComponents(deps.fs, archivePath);
    const entries = await readDirectoryNames(deps.fs, archivePath);
    const result = [];
    for (const entryName of entries) {
      if (isHiddenEntry(entryName) || !isMarkdownFile(entryName))
        continue;
      const entryPath = path3.join(archivePath, entryName);
      await rejectSymbolicLinkComponents(deps.fs, entryPath);
      const entryStat = await statIfExists(deps.fs, entryPath);
      if (!entryStat?.isFile())
        continue;
      const id = entryName.slice(0, -MARKDOWN_EXTENSION.length);
      const file = await readTaskFile(deps.fs, list, id, entryPath, validStates, stateMachine.initial, deps.frontmatterMode);
      result.push({ task: file.task, raw: file.frontmatter });
    }
    return result.sort((left, right) => left.task.qualifiedId.localeCompare(right.task.qualifiedId));
  }
  async function renameActiveEntries(entries, desiredOrdersById) {
    const staged = [];
    const maxOrder = Math.max(...desiredOrdersById.values(), entries.length);
    const width = padWidthForCount(maxOrder);
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const desiredOrder = desiredOrdersById.get(entry.id);
      if (desiredOrder === void 0)
        continue;
      const desiredFilename = activeTaskFilename(entry.id, desiredOrder, width);
      if (entry.filename !== desiredFilename) {
        const fromPath = path3.join(listDirectoryPath, entry.filename);
        const stagingPath = path3.join(listDirectoryPath, `${desiredFilename}.staging-${process.pid}-${index}`);
        const targetPath = path3.join(listDirectoryPath, desiredFilename);
        try {
          await deps.fs.rename(fromPath, stagingPath);
          staged.push({
            original: fromPath,
            staging: stagingPath,
            target: targetPath,
            finalized: false
          });
        } catch (error3) {
          for (const stagedEntry of staged.reverse()) {
            await deps.fs.rename(stagedEntry.staging, stagedEntry.original);
          }
          throw error3;
        }
      }
    }
    try {
      for (const entry of staged) {
        await deps.fs.rename(entry.staging, entry.target);
        entry.finalized = true;
      }
    } catch (error3) {
      for (const entry of staged.filter((stagedEntry) => stagedEntry.finalized).reverse()) {
        await deps.fs.rename(entry.target, entry.staging);
      }
      for (const entry of staged.reverse()) {
        await deps.fs.rename(entry.staging, entry.original);
      }
      throw error3;
    }
  }
  async function rewriteListPrefixes(orderedIds) {
    const entries = await readActiveEntries();
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    const desiredOrdersById = /* @__PURE__ */ new Map();
    for (let index = 0; index < orderedIds.length; index += 1) {
      const id = orderedIds[index];
      const entry = byId.get(id);
      if (!entry)
        continue;
      desiredOrdersById.set(id, index + 1);
    }
    await renameActiveEntries(entries, desiredOrdersById);
  }
  function entryOrder(entry, index) {
    return entry.order ?? index + 1;
  }
  async function rewriteMovedPrefix(movedId, orderedIds) {
    const entries = await readActiveEntries();
    const byId = new Map(entries.map((entry, index) => [entry.id, { entry, index }]));
    const movedIndex = orderedIds.indexOf(movedId);
    const moved = byId.get(movedId);
    if (movedIndex < 0 || moved === void 0)
      return;
    const desiredOrdersById = /* @__PURE__ */ new Map();
    const previousId = movedIndex > 0 ? orderedIds[movedIndex - 1] : void 0;
    const nextId = movedIndex < orderedIds.length - 1 ? orderedIds[movedIndex + 1] : void 0;
    const previous = previousId === void 0 ? void 0 : byId.get(previousId);
    const next = nextId === void 0 ? void 0 : byId.get(nextId);
    if (previous !== void 0 && next === void 0) {
      desiredOrdersById.set(movedId, entryOrder(previous.entry, previous.index) + 1);
      await renameActiveEntries(entries, desiredOrdersById);
      return;
    }
    if (previous === void 0 && next !== void 0) {
      const nextOrder = entryOrder(next.entry, next.index);
      if (nextOrder > 1) {
        desiredOrdersById.set(movedId, nextOrder - 1);
        await renameActiveEntries(entries, desiredOrdersById);
        return;
      }
      desiredOrdersById.set(movedId, 1);
      let lastOrder = 1;
      for (let index = movedIndex + 1; index < orderedIds.length; index += 1) {
        const candidate = byId.get(orderedIds[index]);
        if (candidate === void 0)
          continue;
        const currentOrder = entryOrder(candidate.entry, candidate.index);
        if (currentOrder > lastOrder)
          break;
        lastOrder += 1;
        desiredOrdersById.set(candidate.entry.id, lastOrder);
      }
      await renameActiveEntries(entries, desiredOrdersById);
      return;
    }
    if (previous !== void 0 && next !== void 0) {
      const previousOrder = entryOrder(previous.entry, previous.index);
      const nextOrder = entryOrder(next.entry, next.index);
      if (nextOrder - previousOrder > 1) {
        desiredOrdersById.set(movedId, previousOrder + 1);
        await renameActiveEntries(entries, desiredOrdersById);
        return;
      }
      let lastOrder = previousOrder + 1;
      desiredOrdersById.set(movedId, lastOrder);
      for (let index = movedIndex + 1; index < orderedIds.length; index += 1) {
        const candidate = byId.get(orderedIds[index]);
        if (candidate === void 0)
          continue;
        const currentOrder = entryOrder(candidate.entry, candidate.index);
        if (currentOrder > lastOrder)
          break;
        lastOrder += 1;
        desiredOrdersById.set(candidate.entry.id, lastOrder);
      }
      await renameActiveEntries(entries, desiredOrdersById);
    }
  }
  async function getTaskFile(id) {
    validateTaskId(id);
    return readTaskAtLocation(deps.fs, deps.path, layout, list, id, validStates, stateMachine.initial, deps.frontmatterMode);
  }
  function assertFireableTaskEvent(task, eventName) {
    const event = findEvent(stateMachine, task.state, eventName);
    if (event === void 0) {
      throw new InvalidTransitionError({
        task,
        event: eventName,
        to: stateMachine.events[eventName]?.to,
        reason: `Cannot fire event "${eventName}" from task state "${task.state}".`
      });
    }
    return event;
  }
  return {
    name: list,
    stateMachine,
    async all(filter) {
      const { entries: activeEntries, tasks: activeTasks } = await readActiveTasks();
      const archivedEntries = filter?.includeArchived ? await readArchivedTasks() : [];
      const orderedActive = activeEntries.map((entry) => activeTasks.get(entry.id)).filter((entry) => {
        if (filter?.state && entry.task.state !== filter.state)
          return false;
        return true;
      });
      const filteredArchived = archivedEntries.filter((entry) => {
        if (filter?.state && entry.task.state !== filter.state)
          return false;
        return true;
      });
      return applyOrder([...orderedActive, ...filteredArchived], filter?.order);
    },
    async get(id) {
      return (await getTaskFile(id)).task;
    },
    async create(input) {
      assertCreateDoesNotSetState(input);
      assertCreateHasId(input);
      validateTaskId(input.id);
      validateTaskName(input.name);
      await rejectSymbolicLinkComponents(deps.fs, listDirectoryPath);
      return withFileLock(deps.fs, path3.join(listDirectoryPath, ".transition.lock"), async () => {
        const existing = await findTaskLocation(deps.fs, deps.path, layout, list, input.id, deps.frontmatterMode);
        if (existing) {
          throw new TaskAlreadyExistsError(`Task "${list}/${input.id}" already exists.`);
        }
        const activeEntries = await readActiveEntries();
        const maxOrder = activeEntries.reduce((max, entry) => entry.order !== null && entry.order > max ? entry.order : max, 0);
        const nextOrder = maxOrder + 1;
        const width = padWidthForCount(activeEntries.length + 1);
        const filename = activeTaskFilename(input.id, nextOrder, width);
        const targetPath = path3.join(listDirectoryPath, filename);
        const frontmatter = createdFrontmatter(deps.defaults, input, stateMachine.initial, deps.frontmatterMode);
        const description = input.description ?? "";
        await writeAtomically(deps.fs, targetPath, serializeTaskDocument(frontmatter, description));
        return createTask(list, input.id, frontmatter, description, deps.frontmatterMode, targetPath);
      });
    },
    async update(id, patch) {
      assertUpdateDoesNotSetState(patch);
      validateTaskId(id);
      if (patch.name !== void 0) {
        validateTaskName(patch.name);
      }
      const existing = await getTaskFile(id);
      const nextFrontmatter = updatedFrontmatter(existing.frontmatter, existing.task, patch, deps.frontmatterMode);
      const description = patch.description ?? existing.task.description;
      await writeAtomically(deps.fs, existing.path, serializeTaskDocument(nextFrontmatter, description));
      return createTask(list, id, nextFrontmatter, description, deps.frontmatterMode, existing.path);
    },
    async fire(id, eventName, opts) {
      const fireTask = async () => {
        const existing = await getTaskFile(id);
        const event2 = assertFireableTaskEvent(existing.task, eventName);
        const guardResult = event2.guard?.(existing.task) ?? true;
        if (guardResult !== true) {
          throw new InvalidTransitionError({
            task: existing.task,
            event: eventName,
            to: event2.to,
            reason: guardResult
          });
        }
        await event2.onExit?.(existing.task);
        const nextFrontmatter = firedFrontmatter(existing.frontmatter, existing.task, event2.to, deps.frontmatterMode, opts?.metadataPatch);
        const serializedTask = serializeTaskDocument(nextFrontmatter, existing.task.description);
        if (event2.to === "archived") {
          const targetPath = archivedTaskPath(deps.path, layout, list, id);
          await rejectSymbolicLinkComponents(deps.fs, archiveDirectoryPath(deps.path, layout, list));
          const archivedTargetExists = await statIfExists(deps.fs, targetPath);
          if (archivedTargetExists?.isFile()) {
            throw new TaskAlreadyExistsError(`Task "${list}/${id}" already exists in archive.`);
          }
          await deps.fs.mkdir(archiveDirectoryPath(deps.path, layout, list), { recursive: true });
          await writeAtomically(deps.fs, targetPath, serializedTask);
          try {
            await deps.fs.unlink(existing.path);
          } catch (error3) {
            await deps.fs.unlink(targetPath);
            throw error3;
          }
          const nextTask3 = createTask(list, id, nextFrontmatter, existing.task.description, deps.frontmatterMode, targetPath);
          return { event: event2, nextTask: nextTask3 };
        }
        await writeAtomically(deps.fs, existing.path, serializedTask);
        const nextTask2 = createTask(list, id, nextFrontmatter, existing.task.description, deps.frontmatterMode, existing.path);
        return { event: event2, nextTask: nextTask2 };
      };
      if (stateMachine.events[eventName]?.to === "archived") {
        validateTaskId(id);
        const location = await findTaskLocation(deps.fs, deps.path, layout, list, id, deps.frontmatterMode);
        if (!location) {
          throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
        }
      }
      validateTaskId(id);
      const { event, nextTask } = await withFileLock(deps.fs, path3.join(listDirectoryPath, ".transition.lock"), fireTask);
      await event.onEnter?.(nextTask);
      return nextTask;
    },
    async canFire(id, eventName) {
      const task = (await getTaskFile(id)).task;
      const event = findEvent(stateMachine, task.state, eventName);
      if (event === void 0) {
        return false;
      }
      return (event.guard?.(task) ?? true) === true;
    },
    async events(id) {
      const task = (await getTaskFile(id)).task;
      return eventsFromState(stateMachine, task.state);
    },
    async delete(id) {
      validateTaskId(id);
      const location = await findTaskLocation(deps.fs, deps.path, layout, list, id, deps.frontmatterMode);
      if (!location) {
        throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
      }
      await deps.fs.unlink(location.path);
    },
    async move(id, anchor) {
      validateTaskId(id);
      const { entries } = await readActiveTasks();
      const fromIndex = entries.findIndex((entry) => entry.id === id);
      if (fromIndex < 0) {
        throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
      }
      const ordered = entries.map((entry) => entry.id);
      ordered.splice(fromIndex, 1);
      let insertIndex;
      if ("position" in anchor) {
        insertIndex = anchor.position === "top" ? 0 : ordered.length;
      } else {
        const anchorId = "before" in anchor ? anchor.before : anchor.after;
        const anchorIndex = ordered.indexOf(anchorId);
        if (anchorIndex < 0) {
          throw new AnchorNotFoundError(anchorId);
        }
        insertIndex = "before" in anchor ? anchorIndex : anchorIndex + 1;
      }
      ordered.splice(insertIndex, 0, id);
      await rewriteMovedPrefix(id, ordered);
      return (await getTaskFile(id)).task;
    },
    async reorder(ids) {
      for (const id of ids) {
        validateTaskId(id);
      }
      const { entries } = await readActiveTasks();
      const currentIds = entries.map((entry) => entry.id);
      const currentSet = new Set(currentIds);
      const inputSet = new Set(ids);
      const missing = currentIds.filter((id) => !inputSet.has(id));
      const extra = ids.filter((id) => !currentSet.has(id));
      if (inputSet.size !== ids.length || missing.length > 0 || extra.length > 0) {
        throw new OrderMismatchError({ missing, extra });
      }
      await rewriteListPrefixes(ids);
      return Promise.all(ids.map(async (id) => (await getTaskFile(id)).task));
    }
  };
}
async function markdownDirBackend(deps) {
  await ensureRootPath(deps);
  const layout = resolveListLayout(deps);
  const stateMachine = resolveStateMachine(deps.stateMachine);
  const validStates = new Set(stateMachine.states);
  const list = (name) => {
    if (layout.kind === "single") {
      if (name !== layout.name) {
        throw new Error(`Task list "${name}" not found.`);
      }
      return createTasksView2(deps, layout, name);
    }
    const listName = validateListName(name);
    return createTasksView2(deps, layout, listName);
  };
  const lists = async () => {
    if (layout.kind === "single") {
      return [layout.name];
    }
    const entries = await readDirectoryNames(deps.fs, deps.path);
    const result = [];
    for (const entryName of entries) {
      if (entryName === ARCHIVE_DIRECTORY_NAME || isHiddenEntry(entryName)) {
        continue;
      }
      const entryPath = path3.join(deps.path, entryName);
      await rejectSymbolicLinkComponents(deps.fs, entryPath);
      const entryStat = await statIfExists(deps.fs, entryPath);
      if (entryStat?.isDirectory()) {
        result.push(entryName);
      }
    }
    return sortStrings(result);
  };
  const allTasks = async (filter) => {
    const allLists = await lists();
    const tasks = [];
    for (const taskListName of allLists) {
      tasks.push(...await list(taskListName).all(filter));
    }
    return tasks;
  };
  const get = async (qualifiedId) => {
    const { list: listName, id } = parseQualifiedId2(qualifiedId);
    return list(listName).get(id);
  };
  const moveBetweenLists = async (qualifiedId, targetList) => {
    if (layout.kind === "single") {
      throw new Error("moveBetweenLists is unsupported in single-list mode.");
    }
    const { list: sourceListName, id } = parseQualifiedId2(qualifiedId);
    const targetListName = validateListName(targetList);
    if (sourceListName === targetListName) {
      const file = await readTaskAtLocation(deps.fs, deps.path, layout, sourceListName, id, validStates, stateMachine.initial, deps.frontmatterMode);
      return file.task;
    }
    const targetListDir = listPath(deps.path, layout, targetListName);
    await rejectSymbolicLinkComponents(deps.fs, targetListDir);
    return withFileLock(deps.fs, path3.join(targetListDir, ".transition.lock"), async () => {
      const targetExisting = await findTaskLocation(deps.fs, deps.path, layout, targetListName, id, deps.frontmatterMode);
      if (targetExisting) {
        throw new TaskAlreadyExistsError(`Task "${targetListName}/${id}" already exists.`);
      }
      const sourceLocation = await findTaskLocation(deps.fs, deps.path, layout, sourceListName, id, deps.frontmatterMode);
      if (!sourceLocation) {
        throw new TaskNotFoundError(`Task "${sourceListName}/${id}" not found.`);
      }
      const sourceFile = await readTaskFile(deps.fs, sourceListName, id, sourceLocation.path, validStates, stateMachine.initial, deps.frontmatterMode);
      const targetEntries = await (async () => {
        const out = [];
        const names = await readDirectoryNames(deps.fs, targetListDir);
        for (const entryName of names) {
          if (isHiddenEntry(entryName))
            continue;
          const parsed = parseActiveFilename(entryName);
          if (!parsed)
            continue;
          out.push({ id: parsed.id, order: parsed.order, filename: entryName });
        }
        return out;
      })();
      if (sourceLocation.archived) {
        const archivedTargetDir = archiveDirectoryPath(deps.path, layout, targetListName);
        await rejectSymbolicLinkComponents(deps.fs, archivedTargetDir);
        await deps.fs.mkdir(archivedTargetDir, { recursive: true });
        const archivedTargetPath = archivedTaskPath(deps.path, layout, targetListName, id);
        await deps.fs.rename(sourceLocation.path, archivedTargetPath);
        return createTask(targetListName, id, sourceFile.frontmatter, sourceFile.task.description, deps.frontmatterMode, archivedTargetPath);
      }
      const maxOrder = targetEntries.reduce((max, entry) => entry.order !== null && entry.order > max ? entry.order : max, 0);
      const width = padWidthForCount(targetEntries.length + 1);
      const targetFilename = activeTaskFilename(id, maxOrder + 1, width);
      const targetPath = path3.join(targetListDir, targetFilename);
      await deps.fs.rename(sourceLocation.path, targetPath);
      return createTask(targetListName, id, sourceFile.frontmatter, sourceFile.task.description, deps.frontmatterMode, targetPath);
    });
  };
  return {
    list,
    lists,
    allTasks,
    get,
    moveBetweenLists
  };
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/yaml-file.js
var import_yaml4 = __toESM(require_dist(), 1);
import path4 from "node:path";

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/schema/store.schema.json
var store_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://poe-platform.github.io/poe-code/schemas/task-list/store.schema.json",
  title: "Task Store",
  description: "YAML multi-list task store.",
  type: "object",
  properties: {
    $schema: {
      type: "string",
      const: "https://poe-platform.github.io/poe-code/schemas/task-list/store.schema.json"
    },
    kind: {
      type: "string",
      const: "task-store"
    },
    version: {
      type: "integer",
      const: 1
    },
    lists: {
      type: "object",
      additionalProperties: {
        type: "object",
        additionalProperties: {
          $ref: "./task.schema.json"
        }
      }
    }
  },
  required: ["$schema", "kind", "version", "lists"],
  additionalProperties: false
};

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/backends/yaml-file.js
var STORE_KIND = "task-store";
var STORE_SCHEMA_ID = store_schema_default.$id;
var STORE_VERSION = 1;
var TASK_KIND2 = "task";
var TASK_SCHEMA_ID2 = task_schema_default.$id;
var TASK_VERSION2 = 1;
var RESERVED_TASK_KEYS = /* @__PURE__ */ new Set([
  "$schema",
  "created",
  "description",
  "kind",
  "name",
  "state",
  "version"
]);
function malformedStore(filePath, field) {
  return new MalformedTaskError(`Malformed task store "${filePath}": invalid "${field}".`);
}
function malformedTask2(list, id, field) {
  return new MalformedTaskError(`Malformed task "${list}/${id}": invalid "${field}".`);
}
function validateListName2(name) {
  if (!isTrimmedPrintableIdentifier(name) || name.startsWith(".") || name.includes("/") || name.includes("\\") || name.includes("..")) {
    throw new Error(`Invalid task list name "${name}".`);
  }
  return name;
}
function parseQualifiedId3(qualifiedId) {
  const separatorIndex = qualifiedId.indexOf("/");
  if (separatorIndex <= 0 || separatorIndex !== qualifiedId.lastIndexOf("/") || separatorIndex === qualifiedId.length - 1) {
    throw new Error(`Invalid qualified task id "${qualifiedId}".`);
  }
  return {
    list: validateListName2(qualifiedId.slice(0, separatorIndex)),
    id: validateTaskId(qualifiedId.slice(separatorIndex + 1))
  };
}
function descriptionFromTaskRecord(taskRecord) {
  const description = getOwnEntry(taskRecord, "description");
  return typeof description === "string" ? description : "";
}
function metadataFromTaskRecord(taskRecord) {
  const metadata = /* @__PURE__ */ Object.create(null);
  for (const [key2, value] of Object.entries(taskRecord)) {
    if (!RESERVED_TASK_KEYS.has(key2)) {
      metadata[key2] = value;
    }
  }
  return metadata;
}
function createTask2(list, id, taskRecord, sourcePath) {
  return {
    list,
    id,
    qualifiedId: `${list}/${id}`,
    name: getOwnEntry(taskRecord, "name"),
    state: getOwnEntry(taskRecord, "state"),
    description: descriptionFromTaskRecord(taskRecord),
    metadata: metadataFromTaskRecord(taskRecord),
    ...sourcePath !== void 0 && { sourcePath: path4.resolve(sourcePath) }
  };
}
function matchesFilter(task, filter) {
  if (!filter?.includeArchived && task.state === "archived") {
    return false;
  }
  if (filter?.state !== void 0 && task.state !== filter.state) {
    return false;
  }
  return true;
}
function createTaskRecord(defaults2, input, initialState) {
  const taskRecord = Object.assign(/* @__PURE__ */ Object.create(null), {
    name: input.name,
    state: initialState,
    description: input.description ?? ""
  });
  for (const [key2, value] of Object.entries(defaults2.metadata)) {
    if (!RESERVED_TASK_KEYS.has(key2)) {
      taskRecord[key2] = value;
    }
  }
  for (const [key2, value] of Object.entries(input.metadata ?? {})) {
    if (!RESERVED_TASK_KEYS.has(key2)) {
      taskRecord[key2] = value;
    }
  }
  taskRecord.created = (/* @__PURE__ */ new Date()).toISOString();
  return taskRecord;
}
function assertCreateDoesNotSetState2(input) {
  if (Object.prototype.hasOwnProperty.call(input, "state")) {
    throw new Error('Tasks.create() does not accept "state"; new tasks always start at stateMachine.initial.');
  }
}
function assertCreateHasId2(input) {
  if (input.id === void 0) {
    throw new Error("id is required for yaml-file backend");
  }
}
function assertUpdateDoesNotSetState2(patch) {
  if (Object.prototype.hasOwnProperty.call(patch, "state")) {
    throw new Error('Tasks.update() does not accept "state"; use fire() to change task state.');
  }
}
function buildUpdatedTaskRecord(existing, patch) {
  const nextTaskRecord = Object.assign(/* @__PURE__ */ Object.create(null), existing, {
    ...existing,
    name: patch.name ?? existing.name,
    state: existing.state,
    description: patch.description ?? descriptionFromTaskRecord(existing)
  });
  for (const [key2, value] of Object.entries(patch.metadata ?? {})) {
    if (!RESERVED_TASK_KEYS.has(key2)) {
      nextTaskRecord[key2] = value;
    }
  }
  return nextTaskRecord;
}
function buildTransitionedTaskRecord(existing, to) {
  return Object.assign(/* @__PURE__ */ Object.create(null), existing, {
    ...existing,
    state: to,
    description: descriptionFromTaskRecord(existing)
  });
}
function buildFiredTaskRecord(existing, to, metadataPatch) {
  const nextTaskRecord = buildTransitionedTaskRecord(existing, to);
  for (const [key2, value] of Object.entries(metadataPatch ?? {})) {
    if (!RESERVED_TASK_KEYS.has(key2)) {
      nextTaskRecord[key2] = value;
    }
  }
  return nextTaskRecord;
}
function parseStoreDocument(filePath, content) {
  let document;
  try {
    document = (0, import_yaml4.parseDocument)(content, { keepSourceTokens: true, prettyErrors: false });
  } catch {
    throw malformedStore(filePath, "yaml");
  }
  if (document.errors.length > 0) {
    throw malformedStore(filePath, "yaml");
  }
  return document;
}
function assertValidStoreRecord(store, filePath) {
  if (!isRecord2(store)) {
    throw malformedStore(filePath, "store");
  }
  if (getOwnEntry(store, "$schema") !== STORE_SCHEMA_ID) {
    throw malformedStore(filePath, "$schema");
  }
  if (getOwnEntry(store, "kind") !== STORE_KIND) {
    throw malformedStore(filePath, "kind");
  }
  const version = getOwnEntry(store, "version");
  if (typeof version !== "number" || !Number.isInteger(version) || version !== STORE_VERSION) {
    throw malformedStore(filePath, "version");
  }
  if (!isRecord2(getOwnEntry(store, "lists"))) {
    throw malformedStore(filePath, "lists");
  }
}
function assertValidTaskRecord2(taskRecord, list, id, validStates) {
  if (!isRecord2(taskRecord)) {
    throw malformedTask2(list, id, "task");
  }
  if (hasOwnTaskField2(taskRecord, "$schema") && getOwnEntry(taskRecord, "$schema") !== TASK_SCHEMA_ID2) {
    throw malformedTask2(list, id, "$schema");
  }
  if (hasOwnTaskField2(taskRecord, "kind") && getOwnEntry(taskRecord, "kind") !== TASK_KIND2) {
    throw malformedTask2(list, id, "kind");
  }
  if (hasOwnTaskField2(taskRecord, "version")) {
    const version = getOwnEntry(taskRecord, "version");
    if (typeof version !== "number" || !Number.isInteger(version) || version !== TASK_VERSION2) {
      throw malformedTask2(list, id, "version");
    }
  }
  const name = getOwnEntry(taskRecord, "name");
  if (!hasOwnTaskField2(taskRecord, "name") || typeof name !== "string" || name.length === 0) {
    throw malformedTask2(list, id, "name");
  }
  const state = getOwnEntry(taskRecord, "state");
  if (!hasOwnTaskField2(taskRecord, "state") || typeof state !== "string" || !validStates.has(state)) {
    throw malformedTask2(list, id, "state");
  }
  if (hasOwnTaskField2(taskRecord, "description") && typeof getOwnEntry(taskRecord, "description") !== "string") {
    throw malformedTask2(list, id, "description");
  }
}
function hasOwnTaskField2(taskRecord, key2) {
  return Object.prototype.hasOwnProperty.call(taskRecord, key2);
}
function getOwnEntry(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}
function validateStoreEntries(store, filePath, validStates) {
  const lists = getOwnEntry(store, "lists");
  if (!isRecord2(lists)) {
    throw malformedStore(filePath, "lists");
  }
  for (const [list, listRecord] of Object.entries(lists)) {
    try {
      validateListName2(list);
    } catch {
      throw malformedStore(filePath, `lists.${list}`);
    }
    if (!isRecord2(listRecord)) {
      throw malformedStore(filePath, `lists.${list}`);
    }
    for (const [id, taskRecord] of Object.entries(listRecord)) {
      try {
        validateTaskId(id);
      } catch {
        throw malformedTask2(list, id, "id");
      }
      assertValidTaskRecord2(taskRecord, list, id, validStates);
    }
  }
}
function serializeDocument(document) {
  const serialized = document.toString();
  return serialized.endsWith("\n") ? serialized : `${serialized}
`;
}
async function readStore(fs2, filePath, validStates) {
  const content = await fs2.readFile(filePath, "utf8");
  const document = parseStoreDocument(filePath, content);
  const store = document.toJS();
  assertValidStoreRecord(store, filePath);
  validateStoreEntries(store, filePath, validStates);
  return {
    document,
    store
  };
}
function getListsRecord(store) {
  const lists = getOwnEntry(store, "lists");
  return isRecord2(lists) ? lists : {};
}
function getListRecord(store, list) {
  const listRecord = getOwnEntry(getListsRecord(store), list);
  return isRecord2(listRecord) ? listRecord : void 0;
}
function getTaskRecord(store, list, id) {
  const listRecord = getListRecord(store, list);
  const taskRecord = listRecord !== void 0 && Object.prototype.hasOwnProperty.call(listRecord, id) ? listRecord[id] : void 0;
  return isRecord2(taskRecord) ? taskRecord : void 0;
}
function getTaskOrThrow(store, list, id) {
  const taskRecord = getTaskRecord(store, list, id);
  if (!taskRecord) {
    throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
  }
  return taskRecord;
}
function getListNode(document, list) {
  const lists = document.get("lists");
  if (!(0, import_yaml4.isMap)(lists)) {
    return void 0;
  }
  const listNode = lists.get(list);
  if (!(0, import_yaml4.isMap)(listNode)) {
    return void 0;
  }
  return listNode;
}
function pairKey(pair) {
  const key2 = pair.key;
  if (typeof key2 === "string") {
    return key2;
  }
  if (key2 && typeof key2 === "object" && "value" in key2 && typeof key2.value === "string") {
    return key2.value;
  }
  return void 0;
}
function findItemIndex(listNode, id) {
  return listNode.items.findIndex((pair) => pairKey(pair) === id);
}
function activeItemIds(listNode, validStates) {
  const ids = [];
  for (const pair of listNode.items) {
    const id = pairKey(pair);
    if (id === void 0)
      continue;
    const value = pair.value;
    let state;
    if (value && typeof value === "object" && "get" in value && typeof value.get === "function") {
      state = value.get("state");
    } else if (isRecord2(value)) {
      state = value.state;
    }
    if (typeof state === "string" && validStates.has(state) && state !== "archived") {
      ids.push(id);
    }
  }
  return ids;
}
async function ensureStorePath(deps) {
  await rejectSymbolicLinkComponents(deps.fs, deps.path);
  if (!deps.create) {
    await deps.fs.stat(deps.path);
    return;
  }
  const existing = await statIfExists(deps.fs, deps.path);
  if (existing !== void 0) {
    return;
  }
  await writeAtomically(deps.fs, deps.path, serializeDocument((0, import_yaml4.parseDocument)([
    `$schema: ${STORE_SCHEMA_ID}`,
    `kind: ${STORE_KIND}`,
    `version: ${STORE_VERSION}`,
    "lists: {}",
    ""
  ].join("\n"))));
}
function createTasksView3(deps, list) {
  const stateMachine = resolveStateMachine(deps.stateMachine);
  const validStates = new Set(stateMachine.states);
  async function readTasks(filter) {
    const { store } = await readStore(deps.fs, deps.path, validStates);
    const listRecord = getListRecord(store, list);
    if (!listRecord) {
      return [];
    }
    const entries = Object.entries(listRecord).map(([id, taskRecord]) => ({
      task: createTask2(list, id, taskRecord, deps.path),
      raw: taskRecord
    })).filter(({ task }) => matchesFilter(task, filter));
    return applyOrder(entries, filter?.order);
  }
  function assertFireableTaskEvent(task, eventName) {
    const event = findEvent(stateMachine, task.state, eventName);
    if (event === void 0) {
      throw new InvalidTransitionError({
        task,
        event: eventName,
        to: stateMachine.events[eventName]?.to,
        reason: `Cannot fire event "${eventName}" from task state "${task.state}".`
      });
    }
    return event;
  }
  return {
    name: list,
    stateMachine,
    async all(filter) {
      return readTasks(filter);
    },
    async get(id) {
      validateTaskId(id);
      const { store } = await readStore(deps.fs, deps.path, validStates);
      return createTask2(list, id, getTaskOrThrow(store, list, id), deps.path);
    },
    async create(input) {
      assertCreateDoesNotSetState2(input);
      assertCreateHasId2(input);
      validateTaskId(input.id);
      validateTaskName(input.name);
      const { document, store } = await readStore(deps.fs, deps.path, validStates);
      if (getTaskRecord(store, list, input.id)) {
        throw new TaskAlreadyExistsError(`Task "${list}/${input.id}" already exists.`);
      }
      const taskRecord = createTaskRecord(deps.defaults, input, stateMachine.initial);
      document.setIn(["lists", list, input.id], taskRecord);
      await writeAtomically(deps.fs, deps.path, serializeDocument(document));
      return createTask2(list, input.id, taskRecord, deps.path);
    },
    async update(id, patch) {
      assertUpdateDoesNotSetState2(patch);
      validateTaskId(id);
      if (patch.name !== void 0) {
        validateTaskName(patch.name);
      }
      const { document, store } = await readStore(deps.fs, deps.path, validStates);
      const existing = getTaskOrThrow(store, list, id);
      const nextTaskRecord = buildUpdatedTaskRecord(existing, patch);
      if (patch.name !== void 0) {
        document.setIn(["lists", list, id, "name"], patch.name);
      }
      if (patch.description !== void 0) {
        document.setIn(["lists", list, id, "description"], patch.description);
      }
      for (const [key2, value] of Object.entries(patch.metadata ?? {})) {
        if (!RESERVED_TASK_KEYS.has(key2)) {
          document.setIn(["lists", list, id, key2], value);
        }
      }
      await writeAtomically(deps.fs, deps.path, serializeDocument(document));
      return createTask2(list, id, nextTaskRecord, deps.path);
    },
    async fire(id, eventName, opts) {
      validateTaskId(id);
      const { event, nextTask } = await withFileLock(deps.fs, `${deps.path}.lock`, async () => {
        const { document, store } = await readStore(deps.fs, deps.path, validStates);
        const existing = getTaskOrThrow(store, list, id);
        const task = createTask2(list, id, existing, deps.path);
        const event2 = assertFireableTaskEvent(task, eventName);
        const guardResult = event2.guard?.(task) ?? true;
        if (guardResult !== true) {
          throw new InvalidTransitionError({
            task,
            event: eventName,
            to: event2.to,
            reason: guardResult
          });
        }
        await event2.onExit?.(task);
        const nextTaskRecord = buildFiredTaskRecord(existing, event2.to, opts?.metadataPatch);
        document.setIn(["lists", list, id, "state"], event2.to);
        for (const [key2, value] of Object.entries(opts?.metadataPatch ?? {})) {
          if (!RESERVED_TASK_KEYS.has(key2)) {
            document.setIn(["lists", list, id, key2], value);
          }
        }
        await writeAtomically(deps.fs, deps.path, serializeDocument(document));
        return {
          event: event2,
          nextTask: createTask2(list, id, nextTaskRecord, deps.path)
        };
      });
      await event.onEnter?.(nextTask);
      return nextTask;
    },
    async canFire(id, eventName) {
      validateTaskId(id);
      const { store } = await readStore(deps.fs, deps.path, validStates);
      const task = createTask2(list, id, getTaskOrThrow(store, list, id), deps.path);
      const event = findEvent(stateMachine, task.state, eventName);
      if (event === void 0) {
        return false;
      }
      return (event.guard?.(task) ?? true) === true;
    },
    async events(id) {
      validateTaskId(id);
      const { store } = await readStore(deps.fs, deps.path, validStates);
      const task = createTask2(list, id, getTaskOrThrow(store, list, id), deps.path);
      return eventsFromState(stateMachine, task.state);
    },
    async delete(id) {
      validateTaskId(id);
      const { document, store } = await readStore(deps.fs, deps.path, validStates);
      getTaskOrThrow(store, list, id);
      document.deleteIn(["lists", list, id]);
      await writeAtomically(deps.fs, deps.path, serializeDocument(document));
    },
    async move(id, anchor) {
      validateTaskId(id);
      const { document, store } = await readStore(deps.fs, deps.path, validStates);
      const taskRecord = getTaskOrThrow(store, list, id);
      const listNode = getListNode(document, list);
      if (!listNode) {
        throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
      }
      const fromIndex = findItemIndex(listNode, id);
      if (fromIndex < 0) {
        throw new TaskNotFoundError(`Task "${list}/${id}" not found.`);
      }
      const [movedPair] = listNode.items.splice(fromIndex, 1);
      let insertIndex;
      if ("position" in anchor) {
        insertIndex = anchor.position === "top" ? 0 : listNode.items.length;
      } else {
        const anchorId = "before" in anchor ? anchor.before : anchor.after;
        const activeIds = new Set(activeItemIds(listNode, validStates));
        if (!activeIds.has(anchorId)) {
          listNode.items.splice(fromIndex, 0, movedPair);
          throw new AnchorNotFoundError(anchorId);
        }
        const anchorIndex = findItemIndex(listNode, anchorId);
        if (anchorIndex < 0) {
          listNode.items.splice(fromIndex, 0, movedPair);
          throw new AnchorNotFoundError(anchorId);
        }
        insertIndex = "before" in anchor ? anchorIndex : anchorIndex + 1;
      }
      listNode.items.splice(insertIndex, 0, movedPair);
      await writeAtomically(deps.fs, deps.path, serializeDocument(document));
      return createTask2(list, id, taskRecord, deps.path);
    },
    async reorder(ids) {
      for (const id of ids) {
        validateTaskId(id);
      }
      const { document, store } = await readStore(deps.fs, deps.path, validStates);
      const listNode = getListNode(document, list);
      if (!listNode) {
        throw new OrderMismatchError({ missing: [...ids], extra: [] });
      }
      const currentActive = activeItemIds(listNode, validStates);
      const currentSet = new Set(currentActive);
      const inputSet = new Set(ids);
      const missing = currentActive.filter((id) => !inputSet.has(id));
      const extra = ids.filter((id) => !currentSet.has(id));
      if (inputSet.size !== ids.length || missing.length > 0 || extra.length > 0) {
        throw new OrderMismatchError({ missing, extra });
      }
      const archivedPairs = listNode.items.filter((pair) => {
        const id = pairKey(pair);
        return id !== void 0 && !currentSet.has(id);
      });
      const orderedActive = ids.map((id) => {
        const pair = listNode.items.find((p) => pairKey(p) === id);
        if (!pair) {
          throw new OrderMismatchError({ missing: [id], extra: [] });
        }
        return pair;
      });
      listNode.items.splice(0, listNode.items.length, ...orderedActive, ...archivedPairs);
      await writeAtomically(deps.fs, deps.path, serializeDocument(document));
      const tasks = ids.map((id) => createTask2(list, id, getTaskOrThrow(store, list, id), deps.path));
      return tasks;
    }
  };
}
async function yamlFileBackend(deps) {
  await ensureStorePath(deps);
  const stateMachine = resolveStateMachine(deps.stateMachine);
  const validStates = new Set(stateMachine.states);
  const list = (name) => {
    const listName = validateListName2(name);
    return createTasksView3({ ...deps, stateMachine }, listName);
  };
  const lists = async () => {
    const { store } = await readStore(deps.fs, deps.path, validStates);
    return sortStrings(Object.keys(getListsRecord(store)));
  };
  const allTasks = async (filter) => {
    const { store } = await readStore(deps.fs, deps.path, validStates);
    const result = [];
    const listNames = sortStrings(Object.keys(getListsRecord(store)));
    for (const listName of listNames) {
      const listRecord = getOwnEntry(getListsRecord(store), listName);
      if (!isRecord2(listRecord))
        continue;
      const entries = Object.entries(listRecord).map(([id, taskRecord]) => ({
        task: createTask2(listName, id, taskRecord, deps.path),
        raw: taskRecord
      })).filter(({ task }) => matchesFilter(task, filter));
      result.push(...applyOrder(entries, filter?.order));
    }
    return result;
  };
  const get = async (qualifiedId) => {
    const { list: listName, id } = parseQualifiedId3(qualifiedId);
    return list(listName).get(id);
  };
  const moveBetweenLists = async (qualifiedId, targetList) => {
    const { list: sourceListName, id } = parseQualifiedId3(qualifiedId);
    const targetListName = validateListName2(targetList);
    const { document, store } = await readStore(deps.fs, deps.path, validStates);
    const taskRecord = getTaskOrThrow(store, sourceListName, id);
    if (sourceListName === targetListName) {
      return createTask2(targetListName, id, taskRecord, deps.path);
    }
    if (getTaskRecord(store, targetListName, id)) {
      throw new TaskAlreadyExistsError(`Task "${targetListName}/${id}" already exists.`);
    }
    document.deleteIn(["lists", sourceListName, id]);
    document.setIn(["lists", targetListName, id], taskRecord);
    await writeAtomically(deps.fs, deps.path, serializeDocument(document));
    return createTask2(targetListName, id, taskRecord, deps.path);
  };
  return {
    list,
    lists,
    allTasks,
    get,
    moveBetweenLists
  };
}

// node_modules/toolcraft/node_modules/@poe-code/task-list/dist/open.js
var backendFactories = {
  "markdown-dir": markdownDirBackend,
  "yaml-file": yamlFileBackend
};
function createDefaultFs() {
  return fsPromises;
}
async function openTaskList(options) {
  const type = getOwnProperty2(options, "type");
  switch (type) {
    case "markdown-dir":
    case "yaml-file":
      return openFileBackend(options);
    case "gh-issues":
      return openGhIssuesBackend(options);
    default:
      throw new Error(`Unknown task list backend type "${String(type)}".`);
  }
}
async function openFileBackend(options) {
  const type = getOwnProperty2(options, "type");
  const factory = backendFactories[type];
  const stateMachine = resolveStateMachine(getOwnProperty2(options, "stateMachine"));
  validateMachine(stateMachine);
  const markdownOptions = type === "markdown-dir" ? options : void 0;
  const defaults2 = getOwnProperty2(options, "defaults");
  const deps = {
    path: getOwnProperty2(options, "path"),
    defaults: {
      metadata: readDefaultMetadata(defaults2)
    },
    singleList: markdownOptions === void 0 ? void 0 : getOwnProperty2(markdownOptions, "singleList"),
    frontmatterMode: markdownOptions === void 0 ? "strict" : getOwnProperty2(markdownOptions, "frontmatterMode") ?? "strict",
    create: getOwnProperty2(options, "create") ?? false,
    fs: getOwnProperty2(options, "fs") ?? createDefaultFs(),
    stateMachine
  };
  return factory(deps);
}
async function openGhIssuesBackend(options) {
  const auth = getOwnProperty2(options, "auth");
  const explicitToken = auth && hasOwnProperty2(auth, "token") ? auth.token : void 0;
  const endpoint = resolveEndpoint();
  const defaults2 = getOwnProperty2(options, "defaults");
  return ghIssuesBackend({
    repo: getOwnProperty2(options, "repo"),
    project: getOwnProperty2(options, "project"),
    filter: getOwnProperty2(options, "filter"),
    state: getOwnProperty2(options, "state"),
    stateMachine: getOwnProperty2(options, "stateMachine"),
    defaults: {
      metadata: readDefaultMetadata(defaults2)
    },
    token: await resolveAuth({ explicitToken }),
    endpoint,
    fetch: getOwnProperty2(options, "fetch")
  });
}
function readDefaultMetadata(defaults2) {
  const metadata = defaults2 === void 0 ? void 0 : getOwnProperty2(defaults2, "metadata");
  return isRecord4(metadata) ? { ...metadata } : {};
}
function getOwnProperty2(value, name) {
  return hasOwnProperty2(value, name) ? value[name] : void 0;
}
function hasOwnProperty2(value, name) {
  return Object.prototype.hasOwnProperty.call(value, name);
}
function isRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// node_modules/toolcraft/dist/human-in-loop/approval-tasks.js
import { randomBytes } from "node:crypto";

// node_modules/toolcraft/dist/human-in-loop/state-machine.js
var approvalStateMachineDefinition = {
  initial: "pending",
  states: ["pending", "prompting", "approved-running", "approved-done", "approved-failed", "declined"],
  events: {
    claim: { from: ["pending"], to: "prompting" },
    start: { from: ["prompting"], to: "approved-running" },
    succeed: { from: ["approved-running"], to: "approved-done" },
    fail: { from: ["prompting", "approved-running"], to: "approved-failed" },
    decline: { from: ["pending", "prompting"], to: "declined" }
  }
};
Object.freeze(approvalStateMachineDefinition.states);
for (const event of Object.values(approvalStateMachineDefinition.events)) {
  Object.freeze(event.from);
  Object.freeze(event);
}
Object.freeze(approvalStateMachineDefinition.events);
var approvalStateMachine = Object.freeze(approvalStateMachineDefinition);

// node_modules/toolcraft/dist/human-in-loop/approval-tasks.js
var DEFAULT_LIST_NAME = "approvals";
var openedTaskListsByRuntime = /* @__PURE__ */ new WeakMap();
var validatedListsByRuntime = /* @__PURE__ */ new WeakMap();
async function ensureApprovalList(runtimeOptions, deps = {}) {
  if (runtimeOptions?.taskList === void 0) {
    throw new UserError("humanInLoop.taskList required for async-mode commands");
  }
  const listName = runtimeOptions.listName ?? DEFAULT_LIST_NAME;
  const taskList = await resolveTaskList(runtimeOptions, runtimeOptions.taskList, deps.openTaskList ?? openTaskList, deps.create ?? true);
  const tasks = taskList.list(listName);
  if (!isListValidated(runtimeOptions, listName)) {
    if (!isApprovalStateMachine(tasks.stateMachine)) {
      throw new UserError(`Approvals task list was created with a different version of toolcraft. Delete the task list directory (${getTaskListDirectory(runtimeOptions.taskList)}) or pass a matching approvalStateMachine.`);
    }
    cacheValidatedList(runtimeOptions, listName);
  }
  return {
    taskList,
    listName,
    tasks
  };
}
async function enqueueApproval(ctx) {
  const enqueuedAt = (/* @__PURE__ */ new Date()).toISOString();
  const approval = createApprovalRecord(ctx.payload, enqueuedAt);
  try {
    await createApprovalTask(ctx.tasks, approval);
  } catch (error3) {
    if (!(error3 instanceof TaskAlreadyExistsError)) {
      throw error3;
    }
    const retryApproval = createApprovalRecord(ctx.payload, enqueuedAt);
    await createApprovalTask(ctx.tasks, retryApproval);
    return retryApproval;
  }
  return approval;
}
async function resolveTaskList(runtimeOptions, taskList, openTaskListFn, create) {
  if (!isTaskListConfig(taskList)) {
    return taskList;
  }
  const cachedTaskList = create ? openedTaskListsByRuntime.get(runtimeOptions) : void 0;
  if (cachedTaskList !== void 0) {
    return cachedTaskList;
  }
  const openedTaskList = openTaskListFn({
    create,
    type: taskList.format,
    path: taskList.dir,
    stateMachine: approvalStateMachine
  });
  if (create) {
    openedTaskListsByRuntime.set(runtimeOptions, openedTaskList);
  }
  return openedTaskList;
}
function cacheValidatedList(runtimeOptions, listName) {
  const validatedLists = validatedListsByRuntime.get(runtimeOptions);
  if (validatedLists === void 0) {
    validatedListsByRuntime.set(runtimeOptions, /* @__PURE__ */ new Set([listName]));
    return;
  }
  validatedLists.add(listName);
}
function isListValidated(runtimeOptions, listName) {
  return validatedListsByRuntime.get(runtimeOptions)?.has(listName) ?? false;
}
function createApprovalRecord(payload, enqueuedAt) {
  const approvalId = `${enqueuedAt.slice(0, 19).replaceAll(":", "-")}-${randomBytes(3).toString("hex")}`;
  return {
    approvalId,
    name: `${payload.commandPath} (${enqueuedAt})`,
    metadata: {
      schemaVersion: 1,
      approvalId,
      commandPath: payload.commandPath,
      params: payload.params,
      message: payload.message,
      declineInputPrompt: payload.declineInputPrompt ?? null,
      enqueuedAt,
      pid: null,
      result: null,
      error: null
    },
    pending: {
      status: "pending-approval",
      approvalId,
      message: payload.message,
      enqueuedAt
    }
  };
}
async function createApprovalTask(tasks, approval) {
  await tasks.create({
    id: approval.approvalId,
    name: approval.name,
    metadata: approval.metadata
  });
}
function isApprovalStateMachine(stateMachine) {
  if (stateMachine === approvalStateMachine) {
    return true;
  }
  return isDeepEqualStateMachine(stateMachine, approvalStateMachine);
}
function isTaskListConfig(taskList) {
  return taskList !== void 0 && "dir" in taskList;
}
function getTaskListDirectory(taskList) {
  return isTaskListConfig(taskList) ? taskList.dir : "unknown";
}
function isDeepEqualStateMachine(left, right) {
  if (!areEqualStrings(left.states, right.states)) {
    return false;
  }
  const leftEventNames = Object.keys(left.events);
  const rightEventNames = Object.keys(right.events);
  if (!areEqualStrings(leftEventNames, rightEventNames)) {
    return false;
  }
  for (const eventName of leftEventNames) {
    const leftEvent = left.events[eventName];
    const rightEvent = right.events[eventName];
    if (leftEvent === void 0 || rightEvent === void 0) {
      return false;
    }
    if (leftEvent.to !== rightEvent.to) {
      return false;
    }
    if (!areEqualEventFrom(leftEvent.from, rightEvent.from)) {
      return false;
    }
  }
  return true;
}
function areEqualEventFrom(left, right) {
  if (left === "*" || right === "*") {
    return left === right;
  }
  return areEqualStrings(left, right);
}
function areEqualStrings(left, right) {
  if (left.length !== right.length) {
    return false;
  }
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }
  return true;
}

// node_modules/toolcraft/dist/human-in-loop/runner.js
import { access, lstat, readFile, rename, unlink, writeFile } from "node:fs/promises";

// node_modules/toolcraft/dist/human-in-loop/default-provider.js
import process2 from "node:process";

// node_modules/toolcraft/node_modules/@poe-code/agent-human-in-loop/dist/providers/osascript.js
import { execFile } from "node:child_process";
import { promisify } from "node:util";

// node_modules/toolcraft/node_modules/@poe-code/agent-human-in-loop/dist/providers/osascript-script.js
function escapeAppleScriptString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function buildScript(request, title) {
  const escapedMessage = escapeAppleScriptString(request.message);
  const escapedTitle = escapeAppleScriptString(title);
  if (request.declineInputPrompt === void 0) {
    return `button returned of (display dialog "${escapedMessage}" with title "${escapedTitle}" buttons {"Decline","Approve"} default button "Approve")`;
  }
  const escapedPrompt = escapeAppleScriptString(request.declineInputPrompt);
  return `set firstResp to button returned of (display dialog "${escapedMessage}" with title "${escapedTitle}" buttons {"Decline","Approve"} default button "Approve")
if firstResp is "Approve" then
  return "APPROVED"
end if
try
  set reason to text returned of (display dialog "${escapedPrompt}" default answer "" with title "${escapedTitle}" buttons {"Cancel","Submit"} default button "Submit")
  return "DECLINED:" & reason
on error number -128
  return "DECLINED:"
end try`;
}
function parseStdout(out) {
  const value = out.endsWith("\r\n") ? out.slice(0, -2) : out.endsWith("\n") ? out.slice(0, -1) : out.endsWith("\r") ? out.slice(0, -1) : out;
  switch (value) {
    case "Approve":
    case "APPROVED":
      return { outcome: "approved" };
    case "Decline":
      return { outcome: "declined" };
    default:
      break;
  }
  if (value.startsWith("DECLINED:")) {
    const reason = value.slice("DECLINED:".length);
    return reason === "" ? { outcome: "declined" } : { outcome: "declined", reason };
  }
  throw new Error(`unexpected osascript output: ${out}`);
}

// node_modules/toolcraft/node_modules/@poe-code/agent-human-in-loop/dist/providers/osascript.js
var execFileAsync = promisify(execFile);
function isUserCanceled(error3) {
  const message2 = error3 instanceof Error ? error3.message : error3 === void 0 ? "" : String(error3);
  const stderr = error3?.stderr ?? "";
  return [message2, stderr].some((value) => value.includes("User canceled. (-128)"));
}
function osascriptProvider(options = {}) {
  const title = options.title ?? "Approval needed";
  const binary = options.binary ?? "osascript";
  return {
    id: "osascript",
    async requestApproval(request) {
      const script = buildScript(request, title);
      try {
        const { stdout } = await execFileAsync(binary, ["-e", script]);
        return parseStdout(stdout);
      } catch (error3) {
        if (hasOwnErrorCode2(error3, "ENOENT")) {
          throw new Error("osascript not found \u2014 provide a different provider on this platform");
        }
        if (isUserCanceled(error3)) {
          return { outcome: "declined" };
        }
        const stderr = error3.stderr ?? String(error3);
        throw new Error(`osascript failed: ${stderr.trim()}`);
      }
    }
  };
}
function hasOwnErrorCode2(error3, code) {
  return typeof error3 === "object" && error3 !== null && Object.prototype.hasOwnProperty.call(error3, "code") && error3.code === code;
}

// node_modules/toolcraft/dist/human-in-loop/default-provider.js
function noProviderConfigured() {
  return {
    id: "noProviderConfigured",
    async requestApproval() {
      throw new UserError("No human-in-loop provider is configured. Pass {humanInLoop: {provider: ...}} to runCLI / createMCPServer / createSDK, or run on macOS to use the default osascript provider.");
    }
  };
}
function createDefaultProviderFactory() {
  let provider;
  return () => {
    if (provider !== void 0) {
      return provider;
    }
    provider = process2.platform === "darwin" ? osascriptProvider({ title: "Approval needed" }) : noProviderConfigured();
    return provider;
  };
}
var getDefaultProvider = createDefaultProviderFactory();
function defaultProviderForPlatform() {
  return getDefaultProvider();
}

// node_modules/toolcraft/dist/human-in-loop/spawn.js
import { spawn } from "node:child_process";
function spawnApprovalRunner(approvalId, runtimeOptions, spawnFn) {
  const { execPath, entryArgs } = runtimeOptions.binPath ?? {
    execPath: process.execPath,
    entryArgs: [process.argv[1]]
  };
  const fn = spawnFn ?? spawn;
  const child = fn(execPath, [...entryArgs, "approvals", "run", approvalId], {
    detached: true,
    stdio: "ignore",
    env: process.env,
    cwd: process.cwd()
  });
  child.unref();
}

// node_modules/toolcraft/dist/human-in-loop/gate.js
var providersByRuntime = /* @__PURE__ */ new WeakMap();
var providerWithoutRuntime;
function resolveProvider(runtimeOptions) {
  if (runtimeOptions?.provider !== void 0) {
    return runtimeOptions.provider;
  }
  if (runtimeOptions === void 0) {
    providerWithoutRuntime ??= defaultProviderForPlatform();
    return providerWithoutRuntime;
  }
  const cachedProvider = providersByRuntime.get(runtimeOptions);
  if (cachedProvider !== void 0) {
    return cachedProvider;
  }
  const provider = defaultProviderForPlatform();
  providersByRuntime.set(runtimeOptions, provider);
  return provider;
}
async function invokeWithHumanInLoop(node, ctx, runtimeOptions, commandPath) {
  if (!node.humanInLoop) {
    return node.handler(ctx);
  }
  const message2 = node.humanInLoop.message({
    params: ctx.params,
    commandPath
  });
  if (node.humanInLoop.mode === "async") {
    const { tasks } = await ensureApprovalList(runtimeOptions);
    const { approvalId, pending } = await enqueueApproval({
      tasks,
      payload: {
        commandPath,
        params: ctx.params,
        message: message2,
        declineInputPrompt: node.humanInLoop.declineInputPrompt
      }
    });
    spawnApprovalRunner(approvalId, runtimeOptions);
    return pending;
  }
  const provider = resolveProvider(runtimeOptions);
  const result = await provider.requestApproval({
    message: message2,
    declineInputPrompt: node.humanInLoop.declineInputPrompt
  });
  if (result.outcome === "declined") {
    throw new ApprovalDeclinedError({
      reason: result.reason,
      commandPath
    });
  }
  return node.handler(ctx);
}

// node_modules/toolcraft/dist/human-in-loop/runner.js
var MAX_AVAILABLE_COMMAND_PATHS = 20;
async function runApproval(approvalId, runtimeOptions, root2) {
  const { tasks } = await ensureApprovalList(runtimeOptions);
  const task = await tasks.get(approvalId);
  if (task.state !== "pending") {
    return;
  }
  const approval = readApprovalPayload(task);
  const provider = resolveProvider(runtimeOptions);
  try {
    await tasks.fire(approvalId, "claim", {
      metadataPatch: {
        pid: process.pid
      }
    });
  } catch (error3) {
    if (error3 instanceof InvalidTransitionError) {
      return;
    }
    throw error3;
  }
  try {
    const approvalResult = await provider.requestApproval({
      message: approval.message,
      declineInputPrompt: approval.declineInputPrompt ?? void 0
    });
    if (approvalResult.outcome === "declined") {
      await tasks.fire(approvalId, "decline", {
        metadataPatch: {
          error: {
            reason: approvalResult.reason
          }
        }
      });
      return;
    }
  } catch (error3) {
    await tasks.fire(approvalId, "fail", {
      metadataPatch: {
        error: errorMetadataFromUnknown(error3)
      }
    });
    return;
  }
  await tasks.fire(approvalId, "start");
  try {
    const command = findCommand(root2, approval.commandPath);
    const ctx = createHandlerContext(command, approval.params);
    const result = await command.handler(ctx);
    const serializedResult = serializeJsonResult(result);
    if (!serializedResult.ok) {
      await tasks.fire(approvalId, "fail", {
        metadataPatch: {
          error: {
            message: "result not JSON-serializable"
          }
        }
      });
      return;
    }
    await tasks.fire(approvalId, "succeed", {
      metadataPatch: {
        result: serializedResult.value
      }
    });
  } catch (error3) {
    await tasks.fire(approvalId, "fail", {
      metadataPatch: {
        error: errorMetadataFromUnknown(error3)
      }
    });
  }
}
function readApprovalPayload(task) {
  const metadata = task.metadata;
  if (typeof metadata !== "object" || metadata === null) {
    throw new UserError(`Malformed approval metadata for "${task.qualifiedId}".`);
  }
  if (metadata.schemaVersion !== 1) {
    throw new UserError(`Malformed approval metadata for "${task.qualifiedId}".`);
  }
  if (typeof metadata.commandPath !== "string" || typeof metadata.message !== "string" || typeof metadata.params !== "object" || metadata.params === null) {
    throw new UserError(`Malformed approval metadata for "${task.qualifiedId}".`);
  }
  const declineInputPrompt = typeof metadata.declineInputPrompt === "string" || metadata.declineInputPrompt === null ? metadata.declineInputPrompt : void 0;
  return {
    approvalId: typeof metadata.approvalId === "string" ? metadata.approvalId : void 0,
    commandPath: metadata.commandPath,
    params: metadata.params,
    message: metadata.message,
    declineInputPrompt,
    enqueuedAt: typeof metadata.enqueuedAt === "string" ? metadata.enqueuedAt : void 0,
    pid: typeof metadata.pid === "number" || metadata.pid === null ? metadata.pid : void 0,
    result: metadata.result,
    error: metadata.error
  };
}
function findCommand(root2, commandPath) {
  const pathSegments = commandPath.split(".").filter((segment) => segment.length > 0);
  const unknownCommandPathError = () => new UserError(`Unknown approval command path "${commandPath}". ${formatAvailableApprovalCommandPaths(root2)}`);
  if (pathSegments.length === 0) {
    throw unknownCommandPathError();
  }
  let current = root2;
  for (const segment of pathSegments) {
    if (current.kind !== "group") {
      throw unknownCommandPathError();
    }
    const next = current.children.find((child) => child.name === segment);
    if (next === void 0) {
      throw unknownCommandPathError();
    }
    current = next;
  }
  if (current.kind !== "command") {
    throw unknownCommandPathError();
  }
  return current;
}
function formatAvailableApprovalCommandPaths(root2) {
  const paths = enumerateApprovalCommandPaths(root2);
  const visiblePaths = paths.slice(0, MAX_AVAILABLE_COMMAND_PATHS);
  const remaining = paths.length - visiblePaths.length;
  const suffix = remaining > 0 ? `, \u2026 and ${remaining} more` : "";
  return `Available: ${visiblePaths.join(", ")}${suffix}.`;
}
function enumerateApprovalCommandPaths(root2) {
  const paths = [];
  const visit = (node, path10) => {
    if (node.kind === "command") {
      paths.push(path10.join("."));
      return;
    }
    for (const child of getVisibleCliChildren(node)) {
      visit(child, [...path10, child.name]);
    }
  };
  if (root2.kind === "command") {
    visit(root2, [root2.name]);
    return paths.sort();
  }
  for (const child of getVisibleCliChildren(root2)) {
    visit(child, [child.name]);
  }
  return paths.sort();
}
function isNodeVisibleInCli(node) {
  if (node.kind === "command") {
    return node.scope.includes("cli");
  }
  return getVisibleCliChildren(node).length > 0 || Boolean(node.default && node.default.scope.includes("cli")) || node.scope === void 0 || node.scope.includes("cli");
}
function getVisibleCliChildren(root2) {
  return root2.kind === "group" ? root2.children.filter(isNodeVisibleInCli) : [];
}
function createHandlerContext(command, params) {
  return {
    params,
    secrets: resolveCommandSecrets(command),
    fetch: globalThis.fetch,
    fs: createFs(),
    env: createEnv(),
    progress() {
      return void 0;
    }
  };
}
function createFs() {
  return {
    readFile: async (path10, encoding = "utf8") => readFile(path10, { encoding }),
    writeFile: async (path10, contents, options) => {
      await writeFile(path10, contents, options);
    },
    exists: async (path10) => {
      try {
        await access(path10);
        return true;
      } catch {
        return false;
      }
    },
    lstat: async (path10) => lstat(path10),
    rename: async (fromPath, toPath) => rename(fromPath, toPath),
    unlink: async (path10) => unlink(path10)
  };
}
function createEnv(values = process.env) {
  return {
    get(key2) {
      return values[key2];
    }
  };
}
function serializeJsonResult(value) {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === void 0) {
      return {
        ok: false
      };
    }
    return {
      ok: true,
      value: JSON.parse(serialized)
    };
  } catch {
    return {
      ok: false
    };
  }
}
function errorMetadataFromUnknown(error3) {
  if (error3 instanceof Error) {
    return {
      name: error3.name,
      message: error3.message,
      stack: error3.stack
    };
  }
  return {
    name: "Error",
    message: String(error3)
  };
}

// node_modules/toolcraft/dist/human-in-loop/approvals-commands.js
var approvalsGroupSymbol = Symbol("toolcraft.humanInLoop.approvalsBuiltIn");
var listScope = ["cli", "mcp", "sdk"];
var runScope = ["cli"];
var listParams = S.Object({
  state: S.Optional(S.String())
});
var showParams = S.Object({
  approvalId: S.String()
});
var runParams = S.Object({
  approvalId: S.String(),
  dryRun: S.Optional(S.Boolean({
    description: "Preview the approval without prompting or executing it",
    scope: ["cli"]
  }))
});
var approvalsGroup = markApprovalsBuiltIn(defineGroup({
  name: "approvals",
  description: "Inspect and execute queued approvals.",
  children: [
    defineCommand({
      name: "list",
      description: "List queued approvals.",
      scope: listScope,
      params: listParams,
      handler: async ({ params, runtimeOptions }) => {
        try {
          const { tasks } = await ensureApprovalList(runtimeOptions, { create: false });
          return loadApprovals(tasks, params.state);
        } catch (error3) {
          if (isMissingStateError(error3)) {
            return [];
          }
          throw error3;
        }
      },
      render: {
        rich: (result, primitives) => renderApprovalList(result, primitives),
        markdown: (result) => renderApprovalListMarkdown(result),
        json: (result) => result
      }
    }),
    defineCommand({
      name: "show",
      description: "Show one approval.",
      scope: listScope,
      params: showParams,
      handler: async ({ params, runtimeOptions }) => {
        try {
          const { tasks } = await ensureApprovalList(runtimeOptions, { create: false });
          return tasks.get(params.approvalId);
        } catch (error3) {
          if (isMissingStateError(error3)) {
            throw new TaskNotFoundError(`Task "approvals/${params.approvalId}" not found.`);
          }
          throw error3;
        }
      },
      render: {
        rich: (result, primitives) => renderApprovalDetails(result, primitives),
        markdown: (result) => renderApprovalDetailsMarkdown(result),
        json: (result) => result
      }
    }),
    defineCommand({
      name: "run",
      description: "Run one queued approval.",
      scope: runScope,
      params: runParams,
      handler: async ({ params, runtimeOptions, root: root2 }) => {
        if (params.dryRun === true) {
          const { tasks } = await ensureApprovalList(runtimeOptions, { create: false });
          return tasks.get(params.approvalId);
        }
        return runApproval(params.approvalId, runtimeOptions, root2);
      },
      render: {
        rich: (result, primitives) => {
          if (result)
            renderApprovalDetails(result, primitives);
        },
        markdown: (result) => result ? renderApprovalDetailsMarkdown(result) : "",
        json: (result) => result
      }
    })
  ]
}));
function mergeApprovalsGroup(root2) {
  const existing = root2.children.find((child) => child.name === approvalsGroup.name);
  if (existing !== void 0) {
    if (isApprovalsBuiltIn(existing)) {
      return root2;
    }
    throw new UserError("'approvals' is reserved for human-in-loop built-ins");
  }
  return {
    ...root2,
    children: [...root2.children, approvalsGroup]
  };
}
function markApprovalsBuiltIn(group) {
  Object.defineProperty(group, approvalsGroupSymbol, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false
  });
  return group;
}
function isApprovalsBuiltIn(node) {
  return node.kind === "group" && node[approvalsGroupSymbol] === true;
}
async function loadApprovals(tasks, stateFilter) {
  const states = splitStateFilter(stateFilter);
  if (states.length === 0) {
    return tasks.all();
  }
  const seenIds = /* @__PURE__ */ new Set();
  const approvals = [];
  for (const state of states) {
    const matching = await tasks.all({
      state
    });
    for (const task of matching) {
      if (seenIds.has(task.qualifiedId)) {
        continue;
      }
      seenIds.add(task.qualifiedId);
      approvals.push(task);
    }
  }
  return approvals;
}
function splitStateFilter(stateFilter) {
  if (stateFilter === void 0) {
    return [];
  }
  const seen = /* @__PURE__ */ new Set();
  const states = [];
  for (const value of stateFilter.split(",")) {
    const trimmed = value.trim();
    if (trimmed.length === 0 || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    states.push(trimmed);
  }
  return states;
}
function renderApprovalList(result, { logger: logger2, renderTable: renderTable2, getTheme: getTheme2 }) {
  if (result.length === 0) {
    logger2.message("No approvals found.");
    return;
  }
  logger2.message(renderTable2({
    theme: getTheme2(),
    columns: [
      { name: "id", title: "ID", alignment: "left", maxLen: 24 },
      { name: "state", title: "State", alignment: "left", maxLen: 18 },
      { name: "name", title: "Name", alignment: "left", maxLen: 60 }
    ],
    rows: result.map((task) => ({
      id: task.id,
      state: task.state,
      name: task.name
    }))
  }));
}
function renderApprovalListMarkdown(result) {
  if (result.length === 0) {
    return "No approvals found.";
  }
  const lines = ["| ID | State | Name |", "| :--- | :--- | :--- |"];
  for (const task of result) {
    lines.push(`| ${escapeMarkdownCell(task.id)} | ${escapeMarkdownCell(task.state)} | ${escapeMarkdownCell(task.name)} |`);
  }
  return lines.join("\n");
}
function renderApprovalDetails(result, { logger: logger2, renderTable: renderTable2, getTheme: getTheme2 }) {
  logger2.message(renderTable2({
    theme: getTheme2(),
    columns: [
      { name: "key", title: "Key", alignment: "left", maxLen: 18 },
      { name: "value", title: "Value", alignment: "left", maxLen: 80 }
    ],
    rows: Object.entries(taskToRecord(result)).map(([key2, value]) => ({
      key: key2,
      value: stringifyValue(value)
    }))
  }));
}
function renderApprovalDetailsMarkdown(result) {
  return Object.entries(taskToRecord(result)).map(([key2, value]) => `- ${key2}: ${stringifyValue(value)}`).join("\n");
}
function taskToRecord(task) {
  return {
    list: task.list,
    id: task.id,
    qualifiedId: task.qualifiedId,
    name: task.name,
    state: task.state,
    description: task.description,
    metadata: task.metadata
  };
}
function stringifyValue(value) {
  if (value === void 0) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
function escapeMarkdownCell(value) {
  return value.replaceAll("|", "\\|");
}
function isMissingStateError(error3) {
  return hasOwnErrorCode(error3, "ENOENT");
}

// node_modules/toolcraft/dist/error-report.js
import { mkdir as mkdir2, realpath, writeFile as writeFile3 } from "node:fs/promises";
import { randomUUID as randomUUID4 } from "node:crypto";
import os from "node:os";
import path8 from "node:path";

// node_modules/toolcraft/dist/mcp-proxy.js
import { existsSync as existsSync2 } from "node:fs";
import { lstat as lstat2, mkdir, readFile as readFile2, rename as rename2, unlink as unlink2, writeFile as writeFile2 } from "node:fs/promises";
import path7 from "node:path";
import { createHash, randomUUID as randomUUID3 } from "node:crypto";

// node_modules/toolcraft/node_modules/tiny-mcp-client/dist/internal.js
import { spawn as spawn3 } from "node:child_process";
import { PassThrough } from "node:stream";

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/auth-store-session-store.js
import crypto from "node:crypto";
import path6 from "node:path";

// node_modules/toolcraft/node_modules/auth-store/dist/encrypted-file-store.js
import { createCipheriv, createDecipheriv, randomBytes as randomBytes2, randomUUID as randomUUID2, scrypt } from "node:crypto";
import { promises as fs } from "node:fs";
import { homedir, hostname, userInfo } from "node:os";
import path5 from "node:path";

// node_modules/toolcraft/node_modules/auth-store/dist/error-codes.js
function hasOwnErrorCode3(error3, code) {
  return error3 instanceof Error && Object.prototype.hasOwnProperty.call(error3, "code") && error3.code === code;
}

// node_modules/toolcraft/node_modules/auth-store/dist/encrypted-file-store.js
var derivedKeyCache = /* @__PURE__ */ new Map();
var ENCRYPTION_ALGORITHM = "aes-256-gcm";
var ENCRYPTION_VERSION = 1;
var ENCRYPTION_KEY_BYTES = 32;
var ENCRYPTION_IV_BYTES = 12;
var ENCRYPTION_AUTH_TAG_BYTES = 16;
var ENCRYPTION_FILE_MODE = 384;
var EncryptedFileStore = class {
  fs;
  filePath;
  symbolicLinkCheckStartPath;
  salt;
  getMachineIdentity;
  getRandomBytes;
  keyPromise = null;
  constructor(input) {
    this.fs = input.fs ?? fs;
    this.salt = input.salt;
    if (input.filePath === void 0) {
      const homeDirectory = (input.getHomeDirectory ?? homedir)();
      const defaultDirectory = input.defaultDirectory ?? ".auth-store";
      const defaultFileName = input.defaultFileName ?? "credentials.enc";
      assertSafeDefaultDirectory(defaultDirectory);
      assertSafeDefaultFileName(defaultFileName);
      this.filePath = path5.join(homeDirectory, defaultDirectory, defaultFileName);
      this.symbolicLinkCheckStartPath = resolveDefaultDirectoryCheckStart(homeDirectory, defaultDirectory);
    } else {
      this.filePath = input.filePath;
      this.symbolicLinkCheckStartPath = null;
    }
    this.getMachineIdentity = input.getMachineIdentity ?? defaultMachineIdentity;
    this.getRandomBytes = input.getRandomBytes ?? randomBytes2;
  }
  async get() {
    await this.assertCredentialPathHasNoSymbolicLinks(this.filePath);
    let rawDocument;
    try {
      rawDocument = await this.fs.readFile(this.filePath, "utf8");
    } catch (error3) {
      if (isNotFoundError(error3)) {
        return null;
      }
      throw error3;
    }
    const document = parseEncryptedDocument(rawDocument);
    if (!document) {
      return null;
    }
    const key2 = await this.getEncryptionKey();
    try {
      const iv = Buffer.from(document.iv, "base64");
      const authTag = Buffer.from(document.authTag, "base64");
      const ciphertext = Buffer.from(document.ciphertext, "base64");
      if (iv.byteLength !== ENCRYPTION_IV_BYTES || authTag.byteLength !== ENCRYPTION_AUTH_TAG_BYTES) {
        return null;
      }
      const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, key2, iv);
      decipher.setAuthTag(authTag);
      const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      return plaintext.toString("utf8");
    } catch {
      return null;
    }
  }
  async set(value) {
    await this.assertCredentialPathHasNoSymbolicLinks(this.filePath);
    const key2 = await this.getEncryptionKey();
    const iv = this.getRandomBytes(ENCRYPTION_IV_BYTES);
    const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key2, iv);
    const ciphertext = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    const document = {
      version: ENCRYPTION_VERSION,
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
      ciphertext: ciphertext.toString("base64")
    };
    await this.fs.mkdir(path5.dirname(this.filePath), { recursive: true });
    await this.assertCredentialPathHasNoSymbolicLinks(this.filePath);
    const temporaryPath = `${this.filePath}.${process.pid}.${randomUUID2()}.tmp`;
    let temporaryCreated = false;
    try {
      await this.assertCredentialPathHasNoSymbolicLinks(temporaryPath);
      await this.fs.writeFile(temporaryPath, JSON.stringify(document), {
        encoding: "utf8",
        flag: "wx",
        mode: ENCRYPTION_FILE_MODE
      });
      temporaryCreated = true;
      await this.fs.chmod(temporaryPath, ENCRYPTION_FILE_MODE);
      await this.fs.rename(temporaryPath, this.filePath);
    } catch (error3) {
      if (temporaryCreated || !isAlreadyExistsError(error3)) {
        await removeIfPresent(this.fs, temporaryPath).catch(() => void 0);
      }
      throw error3;
    }
  }
  async delete() {
    await this.assertCredentialPathHasNoSymbolicLinks(this.filePath);
    try {
      await this.fs.unlink(this.filePath);
    } catch (error3) {
      if (!isNotFoundError(error3)) {
        throw error3;
      }
    }
  }
  async assertCredentialPathHasNoSymbolicLinks(targetPath) {
    const resolvedPath = path5.resolve(targetPath);
    const protectedPaths = getProtectedCredentialPaths(resolvedPath, this.symbolicLinkCheckStartPath);
    for (const currentPath of protectedPaths) {
      try {
        const stats = await this.fs.lstat(currentPath);
        if (stats.isSymbolicLink()) {
          throw new Error(`Refusing to use encrypted credential path through symbolic link: ${currentPath}`);
        }
      } catch (error3) {
        if (isNotFoundError(error3)) {
          return;
        }
        throw error3;
      }
    }
  }
  getEncryptionKey() {
    if (!this.keyPromise) {
      const retryableKeyPromise = deriveEncryptionKey(this.getMachineIdentity, this.salt).catch((error3) => {
        if (this.keyPromise === retryableKeyPromise) {
          this.keyPromise = null;
        }
        throw error3;
      });
      this.keyPromise = retryableKeyPromise;
    }
    return this.keyPromise;
  }
};
function resolveDefaultDirectoryCheckStart(homeDirectory, defaultDirectory) {
  const [firstSegment] = defaultDirectory.split(/[\\/]+/).filter(Boolean);
  return path5.resolve(homeDirectory, firstSegment ?? ".");
}
function getProtectedCredentialPaths(resolvedPath, symbolicLinkCheckStartPath) {
  if (symbolicLinkCheckStartPath === null) {
    return getExplicitProtectedCredentialPaths(resolvedPath);
  }
  const resolvedStartPath = path5.resolve(symbolicLinkCheckStartPath);
  if (!isPathInsideOrEqual(resolvedPath, resolvedStartPath)) {
    return [path5.dirname(resolvedPath), resolvedPath];
  }
  const protectedPaths = [resolvedStartPath];
  let currentPath = resolvedStartPath;
  for (const segment of path5.relative(resolvedStartPath, resolvedPath).split(path5.sep).filter(Boolean)) {
    currentPath = path5.join(currentPath, segment);
    protectedPaths.push(currentPath);
  }
  return protectedPaths;
}
function assertSafeDefaultDirectory(defaultDirectory) {
  if (path5.isAbsolute(defaultDirectory) || path5.win32.isAbsolute(defaultDirectory)) {
    throw new Error("defaultDirectory must be a relative path inside the home directory");
  }
  for (const segment of splitPathSegments(defaultDirectory)) {
    if (segment === "..") {
      throw new Error("defaultDirectory must be a relative path inside the home directory");
    }
  }
}
function assertSafeDefaultFileName(defaultFileName) {
  if (defaultFileName.trim().length === 0 || defaultFileName === "." || defaultFileName === ".." || splitPathSegments(defaultFileName).length !== 1) {
    throw new Error("defaultFileName must be a file name without path separators");
  }
}
function splitPathSegments(value) {
  return value.split("/").flatMap((segment) => segment.split("\\")).filter((segment) => segment.length > 0);
}
function getExplicitProtectedCredentialPaths(resolvedPath) {
  const parsed = path5.parse(resolvedPath);
  const segments = resolvedPath.slice(parsed.root.length).split(path5.sep).filter((segment) => segment.length > 0);
  if (segments.length <= 1) {
    return [resolvedPath];
  }
  const protectedPaths = [];
  let currentPath = parsed.root;
  for (const [index, segment] of segments.entries()) {
    currentPath = path5.join(currentPath, segment);
    if (index === 0) {
      continue;
    }
    protectedPaths.push(currentPath);
  }
  return protectedPaths;
}
function isPathInsideOrEqual(childPath, parentPath) {
  const relativePath = path5.relative(parentPath, childPath);
  return relativePath === "" || !relativePath.startsWith("..") && !path5.isAbsolute(relativePath);
}
async function removeIfPresent(fileSystem, filePath) {
  try {
    await fileSystem.unlink(filePath);
  } catch (error3) {
    if (!isNotFoundError(error3)) {
      throw error3;
    }
  }
}
function defaultMachineIdentity() {
  return {
    hostname: hostname(),
    username: userInfo().username
  };
}
async function deriveEncryptionKey(getMachineIdentity, salt) {
  const machineIdentity = await getMachineIdentity();
  const secret = `${machineIdentity.hostname}:${machineIdentity.username}`;
  const cacheKey = JSON.stringify([machineIdentity.hostname, machineIdentity.username, salt]);
  const cached2 = derivedKeyCache.get(cacheKey);
  if (cached2) {
    return cached2;
  }
  const keyPromise = new Promise((resolve2, reject) => {
    scrypt(secret, salt, ENCRYPTION_KEY_BYTES, (error3, derivedKey) => {
      if (error3) {
        reject(error3);
        return;
      }
      resolve2(Buffer.from(derivedKey));
    });
  });
  derivedKeyCache.set(cacheKey, keyPromise);
  return keyPromise.catch((error3) => {
    if (derivedKeyCache.get(cacheKey) === keyPromise) {
      derivedKeyCache.delete(cacheKey);
    }
    throw error3;
  });
}
function parseEncryptedDocument(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord5(parsed)) {
      return null;
    }
    const version = getOwnEntry2(parsed, "version");
    const iv = getOwnEntry2(parsed, "iv");
    const authTag = getOwnEntry2(parsed, "authTag");
    const ciphertext = getOwnEntry2(parsed, "ciphertext");
    if (version !== ENCRYPTION_VERSION) {
      return null;
    }
    if (typeof iv !== "string" || typeof authTag !== "string" || typeof ciphertext !== "string") {
      return null;
    }
    return {
      version,
      iv,
      authTag,
      ciphertext
    };
  } catch {
    return null;
  }
}
function isRecord5(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function getOwnEntry2(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}
function isNotFoundError(error3) {
  return hasOwnErrorCode3(error3, "ENOENT");
}
function isAlreadyExistsError(error3) {
  return hasOwnErrorCode3(error3, "EEXIST");
}

// node_modules/toolcraft/node_modules/auth-store/dist/keychain-store.js
import { spawn as spawn2 } from "node:child_process";
var SECURITY_CLI = "security";
var KEYCHAIN_ITEM_NOT_FOUND_EXIT_CODE = 44;
var KeychainStore = class {
  runCommand;
  service;
  account;
  constructor(input) {
    this.runCommand = input.runCommand ?? runSecurityCommand;
    this.service = input.service.trim();
    this.account = input.account.trim();
    if (this.service.length === 0) {
      throw new Error("Keychain service must not be empty");
    }
    if (this.account.length === 0) {
      throw new Error("Keychain account must not be empty");
    }
  }
  async get() {
    const result = await this.executeSecurityCommand(["find-generic-password", "-s", this.service, "-a", this.account, "-w"], "read secret from macOS Keychain");
    if (getCommandExitCode(result) === 0) {
      return stripTrailingLineBreak(getCommandOutput(result, "stdout"));
    }
    if (isKeychainEntryNotFound(result)) {
      return null;
    }
    throw createSecurityCliFailure("read secret from macOS Keychain", result);
  }
  async set(value) {
    if (value.includes("\n") || value.includes("\r")) {
      throw new Error("Keychain secrets cannot contain line breaks");
    }
    const result = await this.executeSecurityCommand([
      "add-generic-password",
      "-s",
      this.service,
      "-a",
      this.account,
      "-U",
      "-w",
      value
    ], "store secret in macOS Keychain");
    if (getCommandExitCode(result) !== 0) {
      throw createSecurityCliFailure("store secret in macOS Keychain", result);
    }
  }
  async delete() {
    const result = await this.executeSecurityCommand(["delete-generic-password", "-s", this.service, "-a", this.account], "delete secret from macOS Keychain");
    if (getCommandExitCode(result) === 0 || isKeychainEntryNotFound(result)) {
      return;
    }
    throw createSecurityCliFailure("delete secret from macOS Keychain", result);
  }
  async executeSecurityCommand(args, operation, options) {
    try {
      if (options === void 0) {
        return await this.runCommand(SECURITY_CLI, args);
      }
      return await this.runCommand(SECURITY_CLI, args, options);
    } catch (error3) {
      const message2 = error3 instanceof Error ? error3.message : String(error3);
      throw new Error(`Failed to ${operation}: ${message2}`);
    }
  }
};
function runSecurityCommand(command, args, options) {
  return new Promise((resolve2) => {
    const child = spawn2(command, args, {
      stdio: [options?.stdin === void 0 ? "ignore" : "pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let stdinErrorMessage;
    const appendStderr = (message2) => {
      stderr = stderr.length === 0 ? message2 : `${stderr}${stderr.endsWith("\n") ? "" : "\n"}${message2}`;
    };
    const appendStdinError = () => {
      if (stdinErrorMessage === void 0) {
        return;
      }
      appendStderr(stdinErrorMessage);
      stdinErrorMessage = void 0;
    };
    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    if (options?.stdin !== void 0) {
      child.stdin?.once("error", (error3) => {
        stdinErrorMessage = error3 instanceof Error ? error3.message : String(error3);
      });
      child.stdin?.end(options.stdin);
    }
    child.on("error", (error3) => {
      const message2 = error3 instanceof Error ? error3.message : String(error3 ?? "Unknown error");
      appendStdinError();
      appendStderr(message2);
      resolve2({
        stdout,
        stderr,
        exitCode: 127
      });
    });
    child.on("close", (code) => {
      appendStdinError();
      resolve2({
        stdout,
        stderr,
        exitCode: code ?? 1
      });
    });
  });
}
function stripTrailingLineBreak(value) {
  if (value.endsWith("\r\n")) {
    return value.slice(0, -2);
  }
  if (value.endsWith("\n") || value.endsWith("\r")) {
    return value.slice(0, -1);
  }
  return value;
}
function isKeychainEntryNotFound(result) {
  return getCommandExitCode(result) === KEYCHAIN_ITEM_NOT_FOUND_EXIT_CODE;
}
function createSecurityCliFailure(operation, result) {
  const exitCode = getCommandExitCode(result);
  const details = getCommandOutput(result, "stderr").trim() || getCommandOutput(result, "stdout").trim();
  if (details) {
    return new Error(`Failed to ${operation}: security exited with code ${exitCode}: ${details}`);
  }
  return new Error(`Failed to ${operation}: security exited with code ${exitCode}`);
}
function getCommandExitCode(result) {
  const value = getOwnEntry3(result, "exitCode");
  return typeof value === "number" && Number.isInteger(value) ? value : 1;
}
function getCommandOutput(result, key2) {
  const value = getOwnEntry3(result, key2);
  return typeof value === "string" ? value : "";
}
function getOwnEntry3(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}

// node_modules/toolcraft/node_modules/auth-store/dist/create-secret-store.js
var DEFAULT_BACKEND_ENV_VAR = "AUTH_BACKEND";
var MACOS_PLATFORM = "darwin";
var storeFactories = {
  file: (input) => {
    if (!input.fileStore) {
      throw new Error("fileStore configuration is required for file backend");
    }
    return new EncryptedFileStore(input.fileStore);
  },
  keychain: (input) => {
    if (!input.keychainStore) {
      throw new Error("keychainStore configuration is required for keychain backend");
    }
    return new KeychainStore(input.keychainStore);
  }
};
function createSecretStore(input) {
  const backend = resolveBackend(input);
  const platform = input.platform ?? process.platform;
  if (backend === "keychain" && platform !== MACOS_PLATFORM) {
    throw new Error(`Keychain backend is only supported on macOS. Current platform: ${platform}`);
  }
  const store = storeFactories[backend](input);
  return { backend, store };
}
function resolveBackend(input) {
  const envVar = input.backendEnvVar ?? DEFAULT_BACKEND_ENV_VAR;
  const configuredBackend = input.backend ?? getOwnEnvValue(input.env, envVar) ?? getOwnEnvValue(process.env, envVar);
  const backend = configuredBackend?.trim();
  if (backend === "keychain") {
    return "keychain";
  }
  if (backend === void 0 || backend === "file") {
    return "file";
  }
  throw new Error(`Unsupported auth store backend: ${backend}`);
}
function getOwnEnvValue(env, key2) {
  return env !== void 0 && Object.prototype.hasOwnProperty.call(env, key2) ? env[key2] : void 0;
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/resource-indicator.js
function canonicalizeResourceIndicator(value) {
  let url;
  try {
    url = value instanceof URL ? new URL(value.toString()) : new URL(value);
  } catch {
    throw new Error("Resource indicator must be an absolute URL");
  }
  url.hash = "";
  return url.toString();
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/auth-store-session-store.js
var DEFAULT_FILE_SALT = "poe-code:mcp-oauth:v1";
var DEFAULT_FILE_DIRECTORY = ".poe-code/mcp-oauth";
var DEFAULT_KEYCHAIN_SERVICE = "poe-code-mcp-oauth";
var DEFAULT_CLIENT_FILE_SALT = "poe-code:mcp-oauth:clients:v1";
var DEFAULT_CLIENT_FILE_DIRECTORY = ".poe-code/mcp-oauth/clients";
var DEFAULT_CLIENT_KEYCHAIN_SERVICE = "poe-code-mcp-oauth-clients";
var MAX_JS_DATE_MS = 864e13;
function createAuthStoreSessionStore(options = {}) {
  return {
    async load(resource) {
      const store = createResourceSecretStore(resource, options);
      const value = await store.get();
      if (value === null) {
        return null;
      }
      const parsed = JSON.parse(value);
      if (isStoredOAuthSession(parsed)) {
        return parsed;
      }
      throw new Error("Stored OAuth session must match the expected shape");
    },
    async save(resource, session) {
      const store = createResourceSecretStore(resource, options);
      await store.set(JSON.stringify(session));
    },
    async clear(resource) {
      const store = createResourceSecretStore(resource, options);
      await store.delete();
    }
  };
}
function createAuthStoreClientStore(options) {
  return {
    async load(issuer) {
      const store = createIssuerSecretStore(issuer, options);
      const value = await store.get();
      if (value === null) {
        return null;
      }
      const parsed = JSON.parse(value);
      const clientId = isObjectRecord(parsed) ? getOwnString(parsed, "clientId") : void 0;
      if (clientId !== void 0) {
        const client = { clientId };
        if (isObjectRecord(parsed) && Object.prototype.hasOwnProperty.call(parsed, "clientSecret")) {
          client.clientSecret = getOwnEntry4(parsed, "clientSecret");
        }
        return client;
      }
      throw new Error("Stored OAuth client must be a JSON object with clientId");
    },
    async save(issuer, client) {
      const store = createIssuerSecretStore(issuer, options);
      await store.set(JSON.stringify(client));
    },
    async clear(issuer) {
      const store = createIssuerSecretStore(issuer, options);
      await store.delete();
    }
  };
}
function createNamedSecretStore(key2, options, defaults2) {
  const hash = crypto.createHash("sha256").update(key2).digest("hex");
  const configuredFilePath = options.fileStore?.filePath;
  const parsedFilePath = configuredFilePath === void 0 ? null : path6.parse(configuredFilePath);
  const fileStore = {
    ...options.fileStore,
    filePath: parsedFilePath === null ? void 0 : path6.join(parsedFilePath.dir, `${parsedFilePath.name}-${hash}${parsedFilePath.ext || ".enc"}`),
    salt: options.fileStore?.salt ?? defaults2.salt,
    defaultDirectory: options.fileStore?.defaultDirectory || defaults2.directory,
    defaultFileName: parsedFilePath === null ? `${hash}.enc` : `${parsedFilePath.name}-${hash}${parsedFilePath.ext || ".enc"}`
  };
  const keychainStore = {
    ...options.keychainStore,
    service: options.keychainStore?.service ?? defaults2.service,
    account: `${options.keychainStore?.account ?? defaults2.accountPrefix}:${hash}`
  };
  return createSecretStore({ ...options, fileStore, keychainStore }).store;
}
function createResourceSecretStore(resource, options) {
  return createNamedSecretStore(canonicalizeResourceIndicator(resource), options, {
    salt: DEFAULT_FILE_SALT,
    directory: DEFAULT_FILE_DIRECTORY,
    service: DEFAULT_KEYCHAIN_SERVICE,
    accountPrefix: "provider"
  });
}
function createIssuerSecretStore(issuer, options) {
  return createNamedSecretStore(issuer, options, {
    salt: DEFAULT_CLIENT_FILE_SALT,
    directory: DEFAULT_CLIENT_FILE_DIRECTORY,
    service: DEFAULT_CLIENT_KEYCHAIN_SERVICE,
    accountPrefix: "issuer"
  });
}
function isObjectRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function getOwnEntry4(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}
function getOwnString(record, key2) {
  const value = getOwnEntry4(record, key2);
  return typeof value === "string" ? value : void 0;
}
function isStoredOAuthSession(value) {
  if (!isObjectRecord(value)) {
    return false;
  }
  return isNonBlankOwnString(value, "resource") && isNonBlankOwnString(value, "authorizationServer") && isStoredOAuthClient(getOwnEntry4(value, "client")) && isStoredOAuthDiscovery(getOwnEntry4(value, "discovery")) && isStoredOAuthTokensOrMissing(getOwnEntry4(value, "tokens"));
}
function isStoredOAuthClient(value) {
  if (!isObjectRecord(value) || !isNonBlankOwnString(value, "clientId")) {
    return false;
  }
  const clientSecret = getOwnEntry4(value, "clientSecret");
  return clientSecret === void 0 || typeof clientSecret === "string" && clientSecret.trim().length > 0;
}
function isStoredOAuthDiscovery(value) {
  if (!isObjectRecord(value)) {
    return false;
  }
  return isNonBlankOwnString(value, "resourceMetadataUrl") && isObjectRecord(getOwnEntry4(value, "resourceMetadata")) && isObjectRecord(getOwnEntry4(value, "authorizationServerMetadata"));
}
function isStoredOAuthTokensOrMissing(value) {
  if (value === void 0) {
    return true;
  }
  if (!isObjectRecord(value)) {
    return false;
  }
  if (!isNonBlankOwnString(value, "accessToken") || getOwnString(value, "tokenType") !== "Bearer") {
    return false;
  }
  const expiresAt = getOwnEntry4(value, "expiresAt");
  if (expiresAt !== null && (typeof expiresAt !== "number" || !Number.isSafeInteger(expiresAt) || expiresAt > MAX_JS_DATE_MS || !Number.isFinite(new Date(expiresAt).getTime()))) {
    return false;
  }
  const refreshToken = getOwnEntry4(value, "refreshToken");
  if (refreshToken !== void 0 && (typeof refreshToken !== "string" || refreshToken.trim().length === 0)) {
    return false;
  }
  const scope = getOwnEntry4(value, "scope");
  return scope === void 0 || typeof scope === "string" && scope.trim().length > 0;
}
function isNonBlankOwnString(record, key2) {
  const value = getOwnString(record, key2);
  return value !== void 0 && value.trim().length > 0;
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/default-oauth-client-provider.js
import { URL as URL2 } from "node:url";

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/loopback-authorization.js
import http from "node:http";

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/authorization-state.js
import crypto2 from "node:crypto";
function createAuthorizationState(input) {
  const payload = {
    v: 1,
    n: crypto2.randomBytes(16).toString("base64url"),
    i: input.issuer,
    r: input.requireIssuer
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function parseAuthorizationState(value) {
  if (value === null || value.length === 0) {
    return null;
  }
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    if (!isObjectRecord2(parsed)) {
      return null;
    }
    const version = getOwnEntry5(parsed, "v");
    const nonce = getOwnEntry5(parsed, "n");
    const issuer = getOwnEntry5(parsed, "i");
    const requireIssuer = getOwnEntry5(parsed, "r");
    if (version !== 1 || typeof nonce !== "string" || nonce.length === 0 || typeof issuer !== "string" || issuer.length === 0 || typeof requireIssuer !== "boolean") {
      return null;
    }
    return {
      issuer,
      requireIssuer
    };
  } catch {
    return null;
  }
}
function isObjectRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function getOwnEntry5(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/loopback-authorization.js
async function createLoopbackAuthorizationSession(options = {}) {
  const callbackPath = options.callbackPath ?? "/callback";
  const server = options.createServer ? options.createServer() : http.createServer();
  const port = await startServer(server);
  const redirectUri = `http://127.0.0.1:${port}${callbackPath}`;
  return {
    redirectUri,
    async waitForCode(authorizationUrl) {
      return waitForAuthorizationCode(server, authorizationUrl, options, callbackPath);
    },
    close() {
      server.closeAllConnections?.();
      server.close();
    }
  };
}
async function startServer(server) {
  return new Promise((resolve2, reject) => {
    const handleError = (error3) => {
      server.off("error", handleError);
      reject(error3);
    };
    server.once("error", handleError);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", handleError);
      const address = server.address();
      resolve2(address.port);
    });
  });
}
function waitForAuthorizationCode(server, authorizationUrl, options, callbackPath) {
  const expectedAuthorization = readExpectedAuthorizationCallback(authorizationUrl);
  return new Promise((resolve2, reject) => {
    let settled = false;
    const settle = (fn) => {
      if (!settled) {
        settled = true;
        fn();
      }
    };
    server.on("request", (req, res) => {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      if (url.pathname !== callbackPath) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const callbackParameters = {
        code: url.searchParams.get("code"),
        error: url.searchParams.get("error"),
        errorDescription: url.searchParams.get("error_description"),
        state: url.searchParams.get("state"),
        iss: url.searchParams.get("iss")
      };
      try {
        validateAuthorizationCallbackBinding(callbackParameters, expectedAuthorization);
      } catch (error3) {
        res.writeHead(400);
        res.end(error3 instanceof Error ? error3.message : "Invalid OAuth callback");
        settle(() => reject(error3 instanceof Error ? error3 : new Error(String(error3))));
        return;
      }
      const authorizationError = callbackParameters.error;
      if (authorizationError !== null) {
        const description = callbackParameters.errorDescription ?? authorizationError;
        res.writeHead(400);
        res.end(`Authorization failed: ${description}`);
        settle(() => reject(createAuthorizationError(authorizationError, description)));
        return;
      }
      try {
        const code = validateAuthorizationCallbackParameters(callbackParameters, expectedAuthorization);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(buildSuccessPage(options.landingPage));
        settle(() => resolve2(code));
      } catch (error3) {
        res.writeHead(400);
        res.end(error3 instanceof Error ? error3.message : "Invalid OAuth callback");
        settle(() => reject(error3 instanceof Error ? error3 : new Error(String(error3))));
      }
    });
    if (options.readLine !== void 0) {
      options.readLine().then((input) => {
        const callbackParameters = extractCallbackParametersFromInput(input);
        if (callbackParameters === null) {
          settle(() => reject(new Error("OAuth callback missing authorization code")));
          return;
        }
        try {
          validateAuthorizationCallbackBinding(callbackParameters, expectedAuthorization);
          if (callbackParameters.error !== null) {
            const description = callbackParameters.errorDescription ?? callbackParameters.error;
            throw createAuthorizationError(callbackParameters.error, description);
          }
          const code = validateAuthorizationCallbackParameters(callbackParameters, expectedAuthorization);
          settle(() => resolve2(code));
        } catch (error3) {
          settle(() => reject(error3 instanceof Error ? error3 : new Error(String(error3))));
        }
      }).catch((error3) => {
        settle(() => reject(error3 instanceof Error ? error3 : new Error(String(error3))));
      });
    }
    if (options.openBrowser !== void 0) {
      options.openBrowser(authorizationUrl).catch((error3) => {
        settle(() => reject(error3));
      });
    }
  });
}
function extractCallbackParametersFromInput(input) {
  const trimmed = input.replaceAll("\r", "").replaceAll("\n", "").trim();
  if (trimmed.length === 0) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    return {
      code: url.searchParams.get("code"),
      error: url.searchParams.get("error"),
      errorDescription: url.searchParams.get("error_description"),
      state: url.searchParams.get("state"),
      iss: url.searchParams.get("iss")
    };
  } catch {
    return {
      code: trimmed,
      error: null,
      errorDescription: null,
      state: null,
      iss: null
    };
  }
}
function readExpectedAuthorizationCallback(authorizationUrl) {
  const url = new URL(authorizationUrl);
  const state = url.searchParams.get("state");
  const parsedState = parseAuthorizationState(state);
  return {
    state,
    issuer: parsedState?.issuer ?? null,
    requireIssuer: parsedState?.requireIssuer ?? false
  };
}
function validateAuthorizationCallbackParameters(callback, expected) {
  validateAuthorizationCallbackBinding(callback, expected);
  if (callback.code === null || callback.code.length === 0) {
    throw new Error("OAuth callback missing authorization code");
  }
  return callback.code;
}
function validateAuthorizationCallbackBinding(callback, expected) {
  if (expected.state !== null) {
    if (callback.state === null || callback.state.length === 0) {
      throw new Error("OAuth callback missing state");
    }
    if (callback.state !== expected.state) {
      throw new Error("OAuth callback state mismatch");
    }
  }
  if (expected.requireIssuer) {
    if (callback.iss === null || callback.iss.length === 0) {
      throw new Error("OAuth callback missing issuer");
    }
  }
  if (callback.iss !== null && callback.iss.length > 0 && expected.issuer !== null && callback.iss !== expected.issuer) {
    throw new Error("OAuth callback issuer mismatch");
  }
}
function createAuthorizationError(error3, description) {
  return new Error(`OAuth authorization failed: ${error3} \u2014 ${description}`);
}
function escapeHtml(text4) {
  return text4.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function buildSuccessPage(landingPage) {
  const title = landingPage?.title ?? "Connected";
  const body = landingPage?.body ?? "You can close this tab and return to your terminal.";
  return [
    "<!DOCTYPE html>",
    `<html><head><meta charset=utf-8><title>${escapeHtml(title)}</title></head>`,
    '<body style="font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">',
    '<div style="text-align:center">',
    `<h1>${escapeHtml(title)}</h1>`,
    `<p style="color:#666">${escapeHtml(body)}</p>`,
    "</div></body></html>"
  ].join("");
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/pkce.js
import crypto3 from "node:crypto";
function generateCodeVerifier() {
  return crypto3.randomBytes(32).toString("base64url");
}
function generateCodeChallenge(verifier) {
  return crypto3.createHash("sha256").update(verifier).digest("base64url");
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/token-endpoint.js
var MAX_JS_DATE_MS2 = 864e13;
var OAuthError = class extends Error {
  error;
  errorDescription;
  errorUri;
  error_description;
  error_uri;
  status;
  retryable;
  terminal;
  constructor(shape, status) {
    super(shape.error_description ?? shape.error);
    this.name = "OAuthError";
    this.error = shape.error;
    this.errorDescription = shape.error_description;
    this.errorUri = shape.error_uri;
    this.error_description = shape.error_description;
    this.error_uri = shape.error_uri;
    this.status = status;
    this.retryable = isRetryableOAuthError(this);
    this.terminal = !this.retryable;
  }
};
function isRetryableOAuthError(error3) {
  return error3 instanceof OAuthError && (error3.status >= 500 || error3.error === "server_error" || error3.error === "temporarily_unavailable");
}
async function exchangeAuthorizationCode(input) {
  const resource = canonicalizeResourceIndicator(input.resource);
  return requestTokens({
    tokenEndpoint: input.tokenEndpoint,
    clientId: input.clientId,
    clientSecret: input.clientSecret,
    params: {
      grant_type: "authorization_code",
      code: input.code,
      code_verifier: input.codeVerifier,
      redirect_uri: input.redirectUri,
      resource
    },
    fetch: input.fetch,
    now: input.now
  });
}
async function refreshAccessToken(input) {
  const resource = canonicalizeResourceIndicator(input.resource);
  return requestTokens({
    tokenEndpoint: input.tokenEndpoint,
    clientId: input.clientId,
    clientSecret: input.clientSecret,
    params: {
      grant_type: "refresh_token",
      refresh_token: input.refreshToken,
      resource
    },
    fetch: input.fetch,
    now: input.now
  });
}
async function requestTokens(input) {
  const body = new URLSearchParams({
    client_id: input.clientId,
    ...input.params
  });
  if (input.clientSecret !== void 0) {
    body.set("client_secret", input.clientSecret);
  }
  const response = await input.fetch(input.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });
  const payload = await readOAuthJsonObjectResponse(response);
  const accessToken = getOwnEntry6(payload, "access_token");
  if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
    throw new Error("OAuth token response missing access_token");
  }
  const normalizedAccessToken = accessToken.trim();
  const tokenType = normalizeBearerTokenType(getOwnEntry6(payload, "token_type"));
  if (tokenType === null) {
    throw new Error("OAuth token response missing token_type=Bearer");
  }
  const expiresIn = getOwnEntry6(payload, "expires_in");
  let expiresAt = null;
  if (expiresIn !== void 0) {
    if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn) || !Number.isInteger(expiresIn) || expiresIn < 0) {
      throw new Error("OAuth token response has invalid expires_in");
    }
    expiresAt = input.now() + expiresIn * 1e3;
    if (!Number.isSafeInteger(expiresAt) || expiresAt > MAX_JS_DATE_MS2 || !Number.isFinite(new Date(expiresAt).getTime())) {
      throw new Error("OAuth token response has invalid expires_in");
    }
  }
  const refreshToken = getOwnEntry6(payload, "refresh_token");
  const scope = getOwnEntry6(payload, "scope");
  const normalizedRefreshToken = typeof refreshToken === "string" && refreshToken.trim().length > 0 ? refreshToken.trim() : void 0;
  const normalizedScope = typeof scope === "string" && scope.trim().length > 0 ? scope.trim() : void 0;
  return {
    accessToken: normalizedAccessToken,
    refreshToken: normalizedRefreshToken === void 0 ? void 0 : normalizedRefreshToken,
    tokenType,
    expiresAt,
    scope: normalizedScope === void 0 ? void 0 : normalizedScope
  };
}
async function readOAuthJsonObjectResponse(response) {
  const fallbackError = createFallbackOAuthError(response.status);
  let payload;
  try {
    payload = await response.json();
  } catch {
    if (!response.ok) {
      throw fallbackError;
    }
    throw new Error("OAuth response must be a JSON object");
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    if (!response.ok) {
      throw fallbackError;
    }
    throw new Error("OAuth response must be a JSON object");
  }
  const record = payload;
  if (!response.ok) {
    throw new OAuthError(readOAuthError(record, fallbackError.error), response.status);
  }
  return record;
}
function readOAuthError(payload, fallbackError = "server_error") {
  const error3 = getOwnEntry6(payload, "error");
  const errorDescription = getOwnEntry6(payload, "error_description");
  const errorUri = getOwnEntry6(payload, "error_uri");
  return {
    error: typeof error3 === "string" ? error3 : fallbackError,
    error_description: typeof errorDescription === "string" ? errorDescription : void 0,
    error_uri: typeof errorUri === "string" ? errorUri : void 0
  };
}
function getOwnEntry6(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}
function createFallbackOAuthError(status) {
  const error3 = status === 503 ? "temporarily_unavailable" : "server_error";
  return new OAuthError({ error: error3 }, status);
}
function normalizeBearerTokenType(value) {
  if (typeof value !== "string") {
    return null;
  }
  return value.toLowerCase() === "bearer" ? "Bearer" : null;
}

// node_modules/toolcraft/node_modules/mcp-oauth/dist/client/default-oauth-client-provider.js
var MAX_JS_DATE_MS3 = 864e13;
function createOAuthClientProvider(options) {
  if (isProviderOptions(options)) {
    return options.provider;
  }
  return createDefaultOAuthClientProvider(options);
}
function createDefaultOAuthClientProvider(options) {
  const sessionStore = options.sessionStore ?? createAuthStoreSessionStore(options.authStore);
  const clientStore = options.authStore === void 0 ? null : createAuthStoreClientStore(options.authStore);
  const now = options.now ?? Date.now;
  const registeredClients = /* @__PURE__ */ new Map();
  const refreshPromises = /* @__PURE__ */ new Map();
  const authorizationPromises = /* @__PURE__ */ new Map();
  return {
    async authorizeRequest(input) {
      assertNoAccessTokenInUrl(input.requestUrl, "Protected resource request URL");
      const requestUrl = canonicalizeResourceIndicator(input.requestUrl);
      const session = await ensureAuthorizedSession(requestUrl, void 0, input.fetch, false);
      const accessToken = session?.tokens?.accessToken;
      if (session === null || accessToken === void 0 || session.tokens === void 0 || isExpired(session.tokens, now)) {
        return;
      }
      assertRequestMatchesResource(requestUrl, session.resource);
      input.headers.set("Authorization", `Bearer ${accessToken}`);
    },
    async handleUnauthorized(input) {
      try {
        assertNoAccessTokenInUrl(input.requestUrl, "Protected resource request URL");
        const requestUrl = canonicalizeResourceIndicator(input.requestUrl);
        const resource = canonicalizeResourceIndicator(input.discovery.resource);
        assertRequestMatchesResource(requestUrl, resource);
        const forceRefresh = hasCachedAccessToken(await loadSession(resource)) && input.challenge?.params.error === "invalid_token";
        const session = await ensureAuthorizedSession(resource, {
          ...input.discovery,
          resource
        }, input.fetch, true, forceRefresh);
        if (session?.tokens?.accessToken === void 0) {
          return { action: "fail" };
        }
        return { action: "retry" };
      } catch (error3) {
        return {
          action: "fail",
          error: error3 instanceof Error ? error3 : new Error(String(error3))
        };
      }
    }
  };
  async function ensureAuthorizedSession(resource, discovery, fetch2, allowInteractive, forceRefresh = false) {
    const canonicalResource = canonicalizeResourceIndicator(resource);
    let session = await loadSession(canonicalResource);
    const sessionDiscovery = resolveDiscovery(discovery, session);
    if (session?.tokens !== void 0 && !forceRefresh && !isExpired(session.tokens, now)) {
      return session;
    }
    if (session?.tokens?.refreshToken !== void 0 && sessionDiscovery !== void 0 && (forceRefresh || isExpired(session.tokens, now))) {
      session = await refreshSession(canonicalResource, session, sessionDiscovery, fetch2);
      if (session?.tokens !== void 0 && !isExpired(session.tokens, now)) {
        return session;
      }
    }
    if (forceRefresh && session?.tokens !== void 0) {
      session = clearSessionTokens(session);
      await saveSession(canonicalResource, session);
    }
    if (!allowInteractive || sessionDiscovery === void 0) {
      return session;
    }
    return authorizeSession(canonicalResource, session, sessionDiscovery, fetch2);
  }
  async function refreshSession(resource, session, discovery, fetch2) {
    assertSecureOAuthFlowEndpoints(discovery.authorizationServerMetadata);
    const inFlight = refreshPromises.get(resource);
    if (inFlight !== void 0) {
      return inFlight;
    }
    const promise = (async () => {
      try {
        if (session.tokens?.refreshToken === void 0) {
          return session;
        }
        let refreshAttempted = false;
        let refreshedTokens;
        while (true) {
          try {
            refreshedTokens = await refreshAccessToken({
              tokenEndpoint: requireOwnString(discovery.authorizationServerMetadata, "token_endpoint", "Authorization server metadata"),
              clientId: session.client.clientId,
              clientSecret: session.client.clientSecret,
              refreshToken: session.tokens.refreshToken,
              resource,
              fetch: fetch2,
              now
            });
            break;
          } catch (error3) {
            if (error3 instanceof OAuthError && error3.error === "invalid_grant") {
              const clearedSession = clearSessionTokens(session);
              await saveSession(resource, clearedSession);
              return clearedSession;
            }
            if (shouldReRegisterStoredDynamicClient(error3, await loadRegisteredClient(discovery.authorizationServer), false)) {
              await clearRegisteredClient(discovery.authorizationServer);
              await clearSession(resource);
              return null;
            }
            if (!refreshAttempted && isRetryableOAuthError(error3)) {
              refreshAttempted = true;
              continue;
            }
            throw error3;
          }
        }
        const updatedSession = {
          ...session,
          tokens: {
            ...refreshedTokens,
            refreshToken: refreshedTokens.refreshToken ?? session.tokens.refreshToken
          },
          discovery: toStoredDiscovery(discovery)
        };
        await saveSession(resource, updatedSession);
        return updatedSession;
      } finally {
        refreshPromises.delete(resource);
      }
    })();
    refreshPromises.set(resource, promise);
    return promise;
  }
  async function authorizeSession(resource, existingSession, discovery, fetch2) {
    const inFlight = authorizationPromises.get(resource);
    if (inFlight !== void 0) {
      return inFlight;
    }
    const promise = (async () => {
      assertS256PkceSupport(discovery.authorizationServerMetadata);
      assertSecureOAuthFlowEndpoints(discovery.authorizationServerMetadata);
      let currentSession = existingSession;
      let transientRetryAttempted = false;
      let reRegistrationAttempted = false;
      while (true) {
        const loopback = await createLoopbackAuthorizationSession({
          openBrowser: options.browser.openBrowser,
          readLine: options.browser.readLine,
          createServer: options.browser.createServer,
          landingPage: options.browser.landingPage
        });
        let resolvedClient = null;
        try {
          resolvedClient = await resolveClient(currentSession, discovery, loopback.redirectUri, fetch2);
          const sessionWithoutTokens = {
            resource,
            authorizationServer: discovery.authorizationServer,
            client: resolvedClient.client,
            discovery: toStoredDiscovery(discovery)
          };
          await saveSession(resource, sessionWithoutTokens);
          const verifier = generateCodeVerifier();
          const challenge = generateCodeChallenge(verifier);
          const authorizationUrl = buildAuthorizationUrl({
            metadata: discovery.authorizationServerMetadata,
            resource,
            clientId: resolvedClient.client.clientId,
            redirectUri: loopback.redirectUri,
            codeChallenge: challenge,
            clientMetadata: getClientMetadata(options.client)
          });
          const code = await loopback.waitForCode(authorizationUrl);
          const tokens = await exchangeAuthorizationCode({
            tokenEndpoint: requireOwnString(discovery.authorizationServerMetadata, "token_endpoint", "Authorization server metadata"),
            clientId: resolvedClient.client.clientId,
            clientSecret: resolvedClient.client.clientSecret,
            code,
            codeVerifier: verifier,
            redirectUri: loopback.redirectUri,
            resource,
            fetch: fetch2,
            now
          });
          const session = {
            ...sessionWithoutTokens,
            tokens
          };
          await saveSession(resource, session);
          return session;
        } catch (error3) {
          if (shouldReRegisterStoredDynamicClient(error3, resolvedClient, reRegistrationAttempted)) {
            reRegistrationAttempted = true;
            await clearRegisteredClient(discovery.authorizationServer);
            await clearSession(resource);
            currentSession = null;
            continue;
          }
          if (!transientRetryAttempted && isRetryableOAuthError(error3)) {
            transientRetryAttempted = true;
            await clearSession(resource);
            currentSession = null;
            continue;
          }
          throw error3;
        } finally {
          loopback.close();
        }
      }
    })();
    const finalPromise = promise.finally(() => {
      authorizationPromises.delete(resource);
    });
    authorizationPromises.set(resource, finalPromise);
    return finalPromise;
  }
  async function resolveClient(existingSession, discovery, redirectUri, fetch2) {
    const configuredClient = normalizeConfiguredClient(options.client);
    if (options.client.mode === "static") {
      if (configuredClient === null) {
        throw new Error("OAuth client_id must not be blank");
      }
      return {
        kind: "static",
        fromStoredRegistration: false,
        client: configuredClient
      };
    }
    const registrationEndpoint = getOwnString2(discovery.authorizationServerMetadata, "registration_endpoint");
    if (registrationEndpoint === void 0 && configuredClient !== null) {
      return {
        kind: "static",
        fromStoredRegistration: false,
        client: configuredClient
      };
    }
    const storedClient = await loadRegisteredClient(discovery.authorizationServer);
    if (storedClient !== null) {
      return {
        kind: "dynamic",
        fromStoredRegistration: true,
        client: storedClient
      };
    }
    if (registrationEndpoint === void 0) {
      if (existingSession !== null && existingSession.client.clientId.length > 0) {
        return {
          kind: "dynamic",
          fromStoredRegistration: true,
          client: existingSession.client
        };
      }
      throw new Error("Authorization server metadata is missing registration_endpoint");
    }
    if (existingSession !== null && existingSession.client.clientId.length > 0) {
      const isConfiguredStaticFallback = configuredClient !== null && existingSession.client.clientId === configuredClient.clientId && existingSession.client.clientSecret === configuredClient.clientSecret;
      if (!isConfiguredStaticFallback) {
        await saveRegisteredClient(discovery.authorizationServer, existingSession.client);
        return {
          kind: "dynamic",
          fromStoredRegistration: true,
          client: existingSession.client
        };
      }
    }
    const registrationBody = buildClientRegistrationBody(getClientMetadata(options.client), redirectUri);
    const response = await fetch2(registrationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registrationBody)
    });
    const payload = await readOAuthJsonObjectResponse(response);
    const clientId = getOwnString2(payload, "client_id");
    if (clientId === void 0 || clientId.trim().length === 0) {
      throw new Error("OAuth client registration response missing client_id");
    }
    const clientSecret = getOwnString2(payload, "client_secret");
    const registeredClient = {
      clientId: clientId.trim(),
      clientSecret: clientSecret !== void 0 && clientSecret.trim().length > 0 ? clientSecret.trim() : void 0
    };
    await saveRegisteredClient(discovery.authorizationServer, registeredClient);
    return {
      kind: "dynamic",
      fromStoredRegistration: false,
      client: registeredClient
    };
  }
  async function loadSession(resource) {
    return normalizeLoadedSession(await sessionStore.load(resource));
  }
  async function saveSession(resource, session) {
    await sessionStore.save(resource, session);
  }
  async function clearSession(resource) {
    await sessionStore.clear(resource);
  }
  async function loadRegisteredClient(issuer) {
    if (registeredClients.has(issuer)) {
      return registeredClients.get(issuer) ?? null;
    }
    if (clientStore === null) {
      return null;
    }
    const client = await clientStore.load(issuer);
    const normalizedClient = client === null ? null : normalizeStoredClient(client);
    if (client !== null && normalizedClient === null) {
      await clientStore.clear(issuer);
      return null;
    }
    registeredClients.set(issuer, normalizedClient);
    return normalizedClient;
  }
  async function saveRegisteredClient(issuer, client) {
    registeredClients.set(issuer, client);
    if (clientStore !== null) {
      await clientStore.save(issuer, client);
    }
  }
  async function clearRegisteredClient(issuer) {
    registeredClients.delete(issuer);
    if (clientStore !== null) {
      await clientStore.clear(issuer);
    }
  }
}
function isProviderOptions(options) {
  return Object.prototype.hasOwnProperty.call(options, "provider");
}
function isExpired(tokens, now) {
  return tokens.expiresAt !== null && tokens.expiresAt <= now();
}
function resolveDiscovery(discovery, session) {
  if (discovery !== void 0) {
    return {
      ...discovery,
      resource: canonicalizeResourceIndicator(discovery.resource)
    };
  }
  if (session === null) {
    return void 0;
  }
  const metadata = session.discovery.authorizationServerMetadata;
  const issuer = getOwnString2(metadata, "issuer");
  const authorizationEndpoint = getOwnString2(metadata, "authorization_endpoint");
  const tokenEndpoint = getOwnString2(metadata, "token_endpoint");
  const codeChallengeMethodsSupported = getOwnStringArray(metadata, "code_challenge_methods_supported");
  if (issuer === void 0 || authorizationEndpoint === void 0 || tokenEndpoint === void 0 || codeChallengeMethodsSupported === void 0 || !codeChallengeMethodsSupported.includes("S256")) {
    return void 0;
  }
  return {
    resource: canonicalizeResourceIndicator(session.resource),
    resourceMetadataUrl: session.discovery.resourceMetadataUrl,
    resourceMetadata: session.discovery.resourceMetadata,
    authorizationServer: session.authorizationServer,
    authorizationServerMetadataUrl: "",
    authorizationServerMetadata: metadata
  };
}
function clearSessionTokens(session) {
  const nextSession = { ...session };
  delete nextSession.tokens;
  return nextSession;
}
function hasCachedAccessToken(session) {
  return session?.tokens?.accessToken !== void 0;
}
function normalizeLoadedSession(session) {
  if (session === null) {
    return null;
  }
  const client = normalizeStoredClient(getOwnEntry7(session, "client"));
  if (client === null) {
    return { ...session, client: { clientId: "" }, tokens: void 0 };
  }
  return {
    ...session,
    client,
    tokens: normalizeStoredTokens(getOwnEntry7(session, "tokens"))
  };
}
function normalizeStoredClient(value) {
  if (!isObjectRecord3(value)) {
    return null;
  }
  const clientId = getOwnString2(value, "clientId");
  if (clientId === void 0 || clientId.trim().length === 0) {
    return null;
  }
  const normalizedClientId = clientId.trim();
  const clientSecret = getOwnEntry7(value, "clientSecret");
  if (clientSecret === void 0) {
    return { clientId: normalizedClientId };
  }
  if (typeof clientSecret !== "string" || clientSecret.trim().length === 0) {
    return null;
  }
  const normalizedClientSecret = clientSecret.trim();
  return { clientId: normalizedClientId, clientSecret: normalizedClientSecret };
}
function normalizeStoredTokens(value) {
  if (value === void 0 || !isObjectRecord3(value)) {
    return void 0;
  }
  const accessToken = getOwnString2(value, "accessToken");
  const tokenType = getOwnString2(value, "tokenType");
  const expiresAt = getOwnEntry7(value, "expiresAt");
  const refreshToken = getOwnEntry7(value, "refreshToken");
  const scope = getOwnString2(value, "scope");
  const normalizedAccessToken = accessToken?.trim();
  const normalizedRefreshToken = typeof refreshToken === "string" ? refreshToken.trim() : void 0;
  const normalizedScope = scope?.trim();
  if (accessToken === void 0 || normalizedAccessToken === void 0 || normalizedAccessToken.length === 0 || tokenType !== "Bearer" || !(expiresAt === null || typeof expiresAt === "number" && Number.isSafeInteger(expiresAt) && expiresAt <= MAX_JS_DATE_MS3 && Number.isFinite(new Date(expiresAt).getTime())) || refreshToken !== void 0 && (typeof refreshToken !== "string" || normalizedRefreshToken === void 0 || normalizedRefreshToken.length === 0)) {
    return void 0;
  }
  return {
    accessToken: normalizedAccessToken,
    tokenType,
    expiresAt,
    ...normalizedRefreshToken === void 0 ? {} : { refreshToken: normalizedRefreshToken },
    ...normalizedScope === void 0 || normalizedScope.length === 0 ? {} : { scope: normalizedScope }
  };
}
function getClientMetadata(client) {
  if (client.metadata === void 0) {
    return void 0;
  }
  return {
    clientName: normalizeOptionalOAuthString(client.metadata.clientName),
    scope: normalizeOptionalOAuthString(client.metadata.scope),
    softwareId: normalizeOptionalOAuthString(client.metadata.softwareId),
    softwareVersion: normalizeOptionalOAuthString(client.metadata.softwareVersion)
  };
}
function normalizeConfiguredClient(client) {
  const clientId = normalizeOptionalOAuthString(client.clientId);
  if (clientId === void 0) {
    return null;
  }
  const clientSecret = normalizeOptionalOAuthString(client.clientSecret);
  return clientSecret === void 0 ? { clientId } : { clientId, clientSecret };
}
function normalizeOptionalOAuthString(value) {
  if (value === void 0) {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? void 0 : trimmed;
}
function getOwnEntry7(record, key2) {
  return Object.prototype.hasOwnProperty.call(record, key2) ? record[key2] : void 0;
}
function isObjectRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function getOwnString2(record, key2) {
  const value = getOwnEntry7(record, key2);
  return typeof value === "string" ? value : void 0;
}
function requireOwnString(record, key2, label) {
  const value = getOwnString2(record, key2);
  if (value === void 0) {
    throw new Error(`${label} is missing ${key2}`);
  }
  return value;
}
function getOwnStringArray(record, key2) {
  const value = getOwnEntry7(record, key2);
  return Array.isArray(value) && value.every((entry) => typeof entry === "string") ? value : void 0;
}
function buildAuthorizationUrl(input) {
  const authorizationEndpoint = requireOwnString(input.metadata, "authorization_endpoint", "Authorization server metadata");
  const issuer = requireOwnString(input.metadata, "issuer", "Authorization server metadata");
  const url = new URL2(authorizationEndpoint);
  const resource = canonicalizeResourceIndicator(input.resource);
  const state = createAuthorizationState({
    issuer,
    requireIssuer: getOwnEntry7(input.metadata, "authorization_response_iss_parameter_supported") === true
  });
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("resource", resource);
  url.searchParams.set("state", state);
  if (input.clientMetadata?.scope !== void 0 && input.clientMetadata.scope.length > 0) {
    url.searchParams.set("scope", input.clientMetadata.scope);
  }
  return url.toString();
}
function assertS256PkceSupport(metadata) {
  if (!getOwnStringArray(metadata, "code_challenge_methods_supported")?.includes("S256")) {
    throw new Error("Authorization server metadata must advertise code_challenge_methods_supported including S256");
  }
}
function normalizeHostname(hostname2) {
  return hostname2.endsWith(".") ? hostname2.slice(0, -1).toLowerCase() : hostname2.toLowerCase();
}
function isLoopbackHostname(hostname2) {
  const normalizedHostname = normalizeHostname(hostname2);
  return normalizedHostname === "localhost" || normalizedHostname === "::1" || normalizedHostname.startsWith("127.");
}
function assertSecureUrl(value, label) {
  const url = new URL2(value);
  if (url.protocol === "https:") {
    return;
  }
  if (url.protocol === "http:" && isLoopbackHostname(url.hostname)) {
    return;
  }
  throw new Error(`${label} must use https unless it targets a loopback host`);
}
function assertSecureOAuthFlowEndpoints(metadata) {
  const authorizationEndpoint = requireOwnString(metadata, "authorization_endpoint", "Authorization server metadata");
  const tokenEndpoint = requireOwnString(metadata, "token_endpoint", "Authorization server metadata");
  const registrationEndpoint = getOwnString2(metadata, "registration_endpoint");
  assertNoAccessTokenInUrl(authorizationEndpoint, "Authorization endpoint");
  assertNoAccessTokenInUrl(tokenEndpoint, "Token endpoint");
  assertSecureUrl(authorizationEndpoint, "Authorization endpoint");
  assertSecureUrl(tokenEndpoint, "Token endpoint");
  if (registrationEndpoint !== void 0) {
    assertNoAccessTokenInUrl(registrationEndpoint, "Registration endpoint");
    assertSecureUrl(registrationEndpoint, "Registration endpoint");
  }
}
function assertNoAccessTokenInUrl(value, label) {
  const url = value instanceof URL2 ? new URL2(value.toString()) : new URL2(value);
  if (url.searchParams.has("access_token")) {
    throw new Error(`${label} must not include access_token in the URI`);
  }
}
function assertRequestMatchesResource(requestUrl, resource) {
  if (requestUrl !== resource) {
    throw new Error(`OAuth request URL ${requestUrl} does not match discovered resource ${resource}`);
  }
}
function buildClientRegistrationBody(metadata, redirectUri) {
  const body = {
    redirect_uris: [redirectUri],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none"
  };
  const clientName = metadata === void 0 ? void 0 : getOwnString2(metadata, "clientName");
  const scope = metadata === void 0 ? void 0 : getOwnString2(metadata, "scope");
  const softwareId = metadata === void 0 ? void 0 : getOwnString2(metadata, "softwareId");
  const softwareVersion = metadata === void 0 ? void 0 : getOwnString2(metadata, "softwareVersion");
  if (clientName !== void 0 && clientName.length > 0) {
    body.client_name = clientName;
  }
  if (scope !== void 0 && scope.length > 0) {
    body.scope = scope;
  }
  if (softwareId !== void 0 && softwareId.length > 0) {
    body.software_id = softwareId;
  }
  if (softwareVersion !== void 0 && softwareVersion.length > 0) {
    body.software_version = softwareVersion;
  }
  return body;
}
function toStoredDiscovery(discovery) {
  return {
    resourceMetadataUrl: discovery.resourceMetadataUrl,
    resourceMetadata: discovery.resourceMetadata,
    authorizationServerMetadata: discovery.authorizationServerMetadata
  };
}
function shouldReRegisterStoredDynamicClient(error3, client, alreadyAttempted) {
  if (!(error3 instanceof OAuthError) || error3.error !== "invalid_client" || alreadyAttempted) {
    return false;
  }
  if (client === null) {
    return false;
  }
  if ("kind" in client) {
    return client.kind === "dynamic" && client.fromStoredRegistration;
  }
  return true;
}

// node_modules/toolcraft/node_modules/tiny-mcp-client/dist/oauth-discovery.js
function defaultOAuthMetadataFetch(input, init) {
  return fetch(input, init);
}
function isObjectRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function normalizeHostname2(hostname2) {
  return hostname2.endsWith(".") ? hostname2.slice(0, -1).toLowerCase() : hostname2.toLowerCase();
}
function isLoopbackHostname2(hostname2) {
  const normalizedHostname = normalizeHostname2(hostname2);
  return normalizedHostname === "localhost" || normalizedHostname === "::1" || normalizedHostname.startsWith("127.");
}
function assertSecureUrl2(url, label) {
  if (url.protocol === "https:") {
    return;
  }
  if (url.protocol === "http:" && isLoopbackHostname2(url.hostname)) {
    return;
  }
  throw new Error(`${label} must use https unless it targets a loopback host`);
}
function validateProtectedResourceMetadata(value, resourceUrl) {
  if (!isObjectRecord4(value)) {
    throw new Error("Protected resource metadata must be a JSON object");
  }
  if (typeof value.resource !== "string" || value.resource.length === 0) {
    throw new Error("Protected resource metadata must include a resource string");
  }
  const normalizedResource = canonicalizeResourceIndicator(value.resource);
  if (normalizedResource !== resourceUrl) {
    throw new Error(`Protected resource metadata resource mismatch: expected ${resourceUrl}, received ${value.resource}`);
  }
  if (!isStringArray(value.authorization_servers) || value.authorization_servers.length === 0) {
    throw new Error("Protected resource metadata must include a non-empty authorization_servers array");
  }
  return {
    ...value,
    resource: normalizedResource
  };
}
function validateAuthorizationServerMetadata(value, issuer) {
  if (!isObjectRecord4(value)) {
    throw new Error("Authorization server metadata must be a JSON object");
  }
  if (typeof value.issuer !== "string" || value.issuer.length === 0) {
    throw new Error("Authorization server metadata must include issuer");
  }
  if (value.issuer !== issuer) {
    throw new Error(`Authorization server metadata issuer mismatch: expected ${issuer}, received ${value.issuer}`);
  }
  if (typeof value.authorization_endpoint !== "string" || value.authorization_endpoint.length === 0) {
    throw new Error("Authorization server metadata must include authorization_endpoint");
  }
  if (typeof value.token_endpoint !== "string" || value.token_endpoint.length === 0) {
    throw new Error("Authorization server metadata must include token_endpoint");
  }
  if (!isStringArray(value.response_types_supported) || !value.response_types_supported.includes("code")) {
    throw new Error("Authorization server metadata must include response_types_supported containing code");
  }
  if (!isStringArray(value.code_challenge_methods_supported) || !value.code_challenge_methods_supported.includes("S256")) {
    throw new Error("Authorization server metadata must include code_challenge_methods_supported containing S256");
  }
  return value;
}
async function readJsonResponse(response, label) {
  if (!response.ok) {
    const statusDescriptor = `${response.status} ${response.statusText}`.trim();
    throw new Error(`${label} request failed (${statusDescriptor})`);
  }
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} response must be valid JSON`);
  }
}
function resolveWellKnownMetadataUrl(inputUrl, suffix) {
  const url = new URL(typeof inputUrl === "string" ? inputUrl : inputUrl.toString());
  const resourcePath = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/.well-known/${suffix}${resourcePath}`;
  return url.toString();
}
function resolveProtectedResourceMetadataUrl(resourceUrl, resourceMetadataUrl) {
  const resource = new URL(canonicalizeResourceIndicator(resourceUrl));
  assertSecureUrl2(resource, "Protected resource URL");
  if (resourceMetadataUrl !== void 0) {
    const resolvedResourceMetadataUrl2 = new URL(typeof resourceMetadataUrl === "string" ? resourceMetadataUrl : resourceMetadataUrl.toString(), resource);
    assertSecureUrl2(resolvedResourceMetadataUrl2, "Protected resource metadata URL");
    return resolvedResourceMetadataUrl2.toString();
  }
  const resolvedResourceMetadataUrl = new URL(resolveWellKnownMetadataUrl(resource, "oauth-protected-resource"));
  assertSecureUrl2(resolvedResourceMetadataUrl, "Protected resource metadata URL");
  return resolvedResourceMetadataUrl.toString();
}
function normalizeAuthorizationServerIssuer(issuer) {
  const input = typeof issuer === "string" ? issuer : issuer.toString();
  const url = new URL(input);
  if (url.search.length > 0 || url.hash.length > 0) {
    throw new Error("Authorization server issuer must not include query or fragment");
  }
  assertSecureUrl2(url, "Authorization server issuer");
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.pathname === "/" ? url.origin : url.toString();
}
function resolveAuthorizationServerMetadataUrl(issuer) {
  return resolveWellKnownMetadataUrl(normalizeAuthorizationServerIssuer(issuer), "oauth-authorization-server");
}
var OAuthMetadataDiscovery = class {
  fetchImpl;
  cache;
  memoryCache = /* @__PURE__ */ new Map();
  constructor({ fetch: fetch2 = defaultOAuthMetadataFetch, cache } = {}) {
    this.fetchImpl = fetch2;
    this.cache = cache;
  }
  async discover(resourceUrl, { resourceMetadataUrl } = {}) {
    const cacheKey = canonicalizeResourceIndicator(resourceUrl);
    const resourceMetadataLocation = resolveProtectedResourceMetadataUrl(cacheKey, resourceMetadataUrl);
    const memoryCachedResult = this.memoryCache.get(cacheKey);
    if (memoryCachedResult !== void 0 && resourceMetadataUrl === void 0) {
      return memoryCachedResult;
    }
    const sharedCachedResult = await this.cache?.get(cacheKey);
    if (sharedCachedResult !== null && sharedCachedResult !== void 0 && resourceMetadataUrl === void 0) {
      this.memoryCache.set(cacheKey, sharedCachedResult);
      return sharedCachedResult;
    }
    const resourceMetadataResponse = await this.fetchImpl(resourceMetadataLocation, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
    const resourceMetadata = validateProtectedResourceMetadata(await readJsonResponse(resourceMetadataResponse, "Protected resource metadata"), cacheKey);
    const authorizationServerErrors = [];
    for (const authorizationServer of resourceMetadata.authorization_servers) {
      const normalizedAuthorizationServer = normalizeAuthorizationServerIssuer(authorizationServer);
      const authorizationServerMetadataUrl = resolveAuthorizationServerMetadataUrl(normalizedAuthorizationServer);
      try {
        const authorizationServerResponse = await this.fetchImpl(authorizationServerMetadataUrl, {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        });
        const authorizationServerMetadata = validateAuthorizationServerMetadata(await readJsonResponse(authorizationServerResponse, "Authorization server metadata"), normalizedAuthorizationServer);
        const result = {
          resource: resourceMetadata.resource,
          resourceMetadataUrl: resourceMetadataLocation,
          resourceMetadata,
          authorizationServer: normalizedAuthorizationServer,
          authorizationServerMetadataUrl,
          authorizationServerMetadata
        };
        this.memoryCache.set(cacheKey, result);
        await this.cache?.set(cacheKey, result);
        return result;
      } catch (error3) {
        authorizationServerErrors.push(`${authorizationServerMetadataUrl}: ${error3 instanceof Error ? error3.message : String(error3)}`);
      }
    }
    throw new Error(`Unable to load authorization server metadata for ${cacheKey}: ${authorizationServerErrors.join("; ")}`);
  }
};
function skipOptionalWhitespace(value, start) {
  let index = start;
  while (index < value.length && (value[index] === " " || value[index] === "	")) {
    index += 1;
  }
  return index;
}
function readToken(value, start) {
  let index = start;
  while (index < value.length) {
    const character = value[index];
    if (character === " " || character === "	" || character === "," || character === "=" || character === '"') {
      break;
    }
    index += 1;
  }
  if (index === start) {
    return null;
  }
  return {
    token: value.slice(start, index),
    nextIndex: index
  };
}
function looksLikeAuthParam(value, start) {
  const token = readToken(value, start);
  if (token === null) {
    return false;
  }
  return value[skipOptionalWhitespace(value, token.nextIndex)] === "=";
}
function isToken68Character(character) {
  return character >= "a" && character <= "z" || character >= "A" && character <= "Z" || character >= "0" && character <= "9" || character === "-" || character === "." || character === "_" || character === "~" || character === "+" || character === "/";
}
function readToken68(value, start) {
  let nextIndex = start;
  while (nextIndex < value.length) {
    const character = value[nextIndex];
    if (character === "," || character === " " || character === "	") {
      break;
    }
    nextIndex += 1;
  }
  const token68 = value.slice(start, nextIndex);
  if (token68.length === 0) {
    return null;
  }
  let index = 0;
  while (index < token68.length && isToken68Character(token68[index])) {
    index += 1;
  }
  if (index === 0) {
    return null;
  }
  while (index < token68.length && token68[index] === "=") {
    index += 1;
  }
  if (index !== token68.length) {
    return null;
  }
  return { token68, nextIndex };
}
function readQuotedString(value, start) {
  if (value[start] !== '"') {
    return null;
  }
  let parsedValue = "";
  let index = start + 1;
  let escaping = false;
  while (index < value.length) {
    const character = value[index];
    if (escaping) {
      parsedValue += character;
      escaping = false;
      index += 1;
      continue;
    }
    if (character === "\\") {
      escaping = true;
      index += 1;
      continue;
    }
    if (character === '"') {
      return {
        parsedValue,
        nextIndex: index + 1
      };
    }
    parsedValue += character;
    index += 1;
  }
  return null;
}
function parseAuthParam(value, start) {
  const token = readToken(value, start);
  if (token === null) {
    return null;
  }
  let index = skipOptionalWhitespace(value, token.nextIndex);
  if (value[index] !== "=") {
    return null;
  }
  index = skipOptionalWhitespace(value, index + 1);
  if (index >= value.length) {
    return null;
  }
  const quotedValue = readQuotedString(value, index);
  if (quotedValue !== null) {
    return {
      name: token.token,
      value: quotedValue.parsedValue,
      nextIndex: quotedValue.nextIndex
    };
  }
  let nextIndex = index;
  while (nextIndex < value.length) {
    const character = value[nextIndex];
    if (character === "," || character === " " || character === "	") {
      break;
    }
    nextIndex += 1;
  }
  return {
    name: token.token,
    value: value.slice(index, nextIndex),
    nextIndex
  };
}
function parseBearerWwwAuthenticateHeader(headerValue) {
  if (headerValue === null) {
    return null;
  }
  let index = 0;
  let firstBearerChallenge = null;
  while (index < headerValue.length) {
    index = skipOptionalWhitespace(headerValue, index);
    while (headerValue[index] === ",") {
      index = skipOptionalWhitespace(headerValue, index + 1);
    }
    const scheme = readToken(headerValue, index);
    if (scheme === null) {
      break;
    }
    index = skipOptionalWhitespace(headerValue, scheme.nextIndex);
    const params = /* @__PURE__ */ Object.create(null);
    if (index < headerValue.length && headerValue[index] !== ",") {
      const token68 = readToken68(headerValue, index);
      if (token68 !== null) {
        index = token68.nextIndex;
      } else if (looksLikeAuthParam(headerValue, index)) {
        while (index < headerValue.length) {
          const parsedParam = parseAuthParam(headerValue, index);
          if (parsedParam === null) {
            break;
          }
          params[parsedParam.name] = parsedParam.value;
          index = skipOptionalWhitespace(headerValue, parsedParam.nextIndex);
          if (headerValue[index] !== ",") {
            break;
          }
          const nextIndex = skipOptionalWhitespace(headerValue, index + 1);
          if (!looksLikeAuthParam(headerValue, nextIndex)) {
            index = nextIndex;
            break;
          }
          index = nextIndex;
        }
      }
    }
    if (scheme.token.toLowerCase() === "bearer") {
      const challenge = {
        scheme: "Bearer",
        params,
        raw: headerValue
      };
      if (Object.keys(params).length > 0) {
        return challenge;
      }
      firstBearerChallenge ??= challenge;
    }
    if (headerValue[index] === ",") {
      index += 1;
    }
  }
  return firstBearerChallenge;
}

// node_modules/toolcraft/node_modules/tiny-mcp-client/dist/internal.js
var MCP_PROTOCOL_VERSION = "2025-03-26";
var McpClient = class {
  currentState = "disconnected";
  currentServerCapabilities = null;
  currentClientCapabilities = null;
  currentServerInfo = null;
  currentInstructions;
  subscribedResourceUris = /* @__PURE__ */ new Set();
  activeProgressTokens = /* @__PURE__ */ new Map();
  options;
  transport = null;
  messageLayer = null;
  constructor(options) {
    this.options = options;
  }
  get state() {
    return this.currentState;
  }
  get serverCapabilities() {
    return this.currentServerCapabilities === null ? null : structuredClone(this.currentServerCapabilities);
  }
  get serverInfo() {
    return this.currentServerInfo;
  }
  get instructions() {
    return this.currentInstructions;
  }
  getMessageLayerOrThrow() {
    if (this.currentState === "disconnected") {
      throw new Error("MCP client is disconnected");
    }
    if (this.currentState === "closed") {
      throw new Error("MCP client is closed");
    }
    if (this.messageLayer === null) {
      throw new Error("MCP client is disconnected");
    }
    return this.messageLayer;
  }
  async connect(transport) {
    if (this.currentState !== "disconnected" && this.currentState !== "closed") {
      throw new Error("MCP client is already connected");
    }
    this.currentServerCapabilities = null;
    this.currentClientCapabilities = null;
    this.currentServerInfo = null;
    this.currentInstructions = void 0;
    this.subscribedResourceUris.clear();
    this.activeProgressTokens.clear();
    const transportClosedReason = transport.closed.then((closedEvent) => closedEvent.reason).catch((error3) => error3 instanceof Error ? error3 : new Error(String(error3)));
    const messageLayer = new JsonRpcMessageLayer(transport.readable, transport.writable, this.options.requestTimeoutMs, transportClosedReason);
    const { onSamplingRequest, onRootsList, onToolsChanged, onResourcesChanged, onResourceUpdated, onPromptsChanged, onLog, onProgress } = this.options;
    messageLayer.onRequest("ping", () => ({}));
    if (onSamplingRequest !== void 0) {
      messageLayer.onRequest("sampling/createMessage", (params) => onSamplingRequest(params));
    }
    messageLayer.onNotification("notifications/tools/list_changed", async () => {
      if (onToolsChanged === void 0 || this.currentServerCapabilities?.tools?.listChanged !== true) {
        return;
      }
      await onToolsChanged();
    });
    messageLayer.onNotification("notifications/resources/list_changed", async () => {
      if (onResourcesChanged === void 0 || this.currentServerCapabilities?.resources?.listChanged !== true) {
        return;
      }
      await onResourcesChanged();
    });
    messageLayer.onNotification("notifications/resources/updated", async (params) => {
      if (onResourceUpdated === void 0) {
        return;
      }
      if (typeof params !== "object" || params === null || Array.isArray(params)) {
        return;
      }
      const { uri } = params;
      if (typeof uri !== "string" || !this.subscribedResourceUris.has(uri)) {
        return;
      }
      await onResourceUpdated(uri);
    });
    messageLayer.onNotification("notifications/prompts/list_changed", async () => {
      if (onPromptsChanged === void 0 || this.currentServerCapabilities?.prompts?.listChanged !== true) {
        return;
      }
      await onPromptsChanged();
    });
    messageLayer.onNotification("notifications/message", async (params) => {
      if (onLog === void 0 || !isObjectRecord5(params) || !isLogLevel(params.level)) {
        return;
      }
      if (!hasOwn(params, "data")) {
        return;
      }
      const message2 = {
        level: params.level,
        data: params.data
      };
      if (params.logger !== void 0) {
        if (typeof params.logger !== "string") {
          return;
        }
        message2.logger = params.logger;
      }
      await onLog(message2);
    });
    messageLayer.onNotification("notifications/progress", async (params) => {
      if (onProgress === void 0 || !isObjectRecord5(params)) {
        return;
      }
      const { progressToken, progress } = params;
      if (!isRequestId(progressToken) || typeof progress !== "number" || !this.activeProgressTokens.has(progressToken)) {
        return;
      }
      const progressParams = {
        progressToken,
        progress
      };
      if (params.total !== void 0) {
        if (typeof params.total !== "number") {
          return;
        }
        progressParams.total = params.total;
      }
      if (params.message !== void 0) {
        if (typeof params.message !== "string") {
          return;
        }
        progressParams.message = params.message;
      }
      await onProgress(progressParams);
    });
    messageLayer.onNotification("notifications/cancelled", () => void 0);
    this.transport = transport;
    this.messageLayer = messageLayer;
    this.currentState = "initializing";
    this.subscribedResourceUris.clear();
    this.activeProgressTokens.clear();
    transport.closed.then((closedEvent) => {
      if (this.transport !== transport) {
        return;
      }
      this.messageLayer?.dispose(closedEvent.reason);
      this.messageLayer = null;
      this.transport = null;
      this.currentState = "closed";
    }).catch((error3) => {
      if (this.transport !== transport) {
        return;
      }
      const reason = error3 instanceof Error ? error3 : new Error(String(error3));
      this.messageLayer?.dispose(reason);
      this.messageLayer = null;
      this.transport = null;
      this.currentState = "closed";
    });
    const capabilities = {
      ...this.options.capabilities ?? {}
    };
    if (onSamplingRequest !== void 0 && capabilities.sampling === void 0) {
      capabilities.sampling = {};
    }
    if (onRootsList !== void 0) {
      capabilities.roots = {
        ...capabilities.roots ?? {}
      };
    }
    this.currentClientCapabilities = structuredClone(capabilities);
    try {
      const initializeResultValue = await messageLayer.sendRequest("initialize", {
        protocolVersion: MCP_PROTOCOL_VERSION,
        clientInfo: this.options.clientInfo,
        capabilities
      });
      if (!isInitializeResult(initializeResultValue)) {
        throw new McpError(ERROR_INVALID_REQUEST, "Invalid initialize result");
      }
      const initializeResult = initializeResultValue;
      if (initializeResult.protocolVersion !== MCP_PROTOCOL_VERSION) {
        throw new McpError(ERROR_INVALID_REQUEST, `Unsupported protocol version: ${initializeResult.protocolVersion}`);
      }
      this.currentServerCapabilities = structuredClone(initializeResult.capabilities);
      this.currentServerInfo = { ...initializeResult.serverInfo };
      this.currentInstructions = initializeResult.instructions;
      if (onRootsList !== void 0) {
        messageLayer.onRequest("roots/list", async () => ({
          roots: await onRootsList()
        }));
      }
      messageLayer.sendNotification("notifications/initialized");
      this.currentState = "ready";
      return initializeResult;
    } catch (error3) {
      if (this.transport === transport) {
        const reason = error3 instanceof Error ? error3 : new Error(String(error3));
        messageLayer.dispose(reason);
        transport.dispose(reason);
        this.messageLayer = null;
        this.transport = null;
        this.currentState = "disconnected";
      }
      throw error3;
    }
  }
  getServerCapabilitiesOrThrow() {
    if (this.currentServerCapabilities === null) {
      throw new Error("MCP client has not completed initialization");
    }
    return this.currentServerCapabilities;
  }
  async listTools(params = {}) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.tools === void 0) {
      throw new Error("Server does not support tools");
    }
    const requestParams = params.cursor === void 0 ? void 0 : { cursor: params.cursor };
    const result = await messageLayer.sendRequest("tools/list", requestParams);
    if (!isToolsListResult(result)) {
      throw new McpError(ERROR_INVALID_REQUEST, "Invalid tools/list result");
    }
    return result;
  }
  async callTool(params, options = {}) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.tools === void 0) {
      throw new Error("Server does not support tools");
    }
    if (options.signal?.aborted) {
      throw options.signal.reason;
    }
    const requestParams = options.progressToken === void 0 ? params : {
      ...params,
      _meta: {
        progressToken: options.progressToken
      }
    };
    if (options.progressToken !== void 0) {
      this.activeProgressTokens.set(options.progressToken, (this.activeProgressTokens.get(options.progressToken) ?? 0) + 1);
    }
    try {
      let requestId;
      let cancellationSent = false;
      const sendCancellationNotification = () => {
        if (requestId === void 0 || cancellationSent) {
          return;
        }
        cancellationSent = true;
        messageLayer.sendNotification("notifications/cancelled", { requestId });
      };
      const requestPromise = messageLayer.sendRequest("tools/call", requestParams, {
        onRequestId: (nextRequestId) => {
          requestId = nextRequestId;
        },
        onTimeout: sendCancellationNotification
      }).then((result) => {
        if (!isCallToolResult(result)) {
          throw new McpError(ERROR_INVALID_REQUEST, "Invalid tool result");
        }
        return result;
      });
      if (options.signal === void 0) {
        return await requestPromise;
      }
      const signal = options.signal;
      let abortListener;
      const abortPromise = new Promise((_, reject) => {
        const rejectWithAbortReason = () => {
          sendCancellationNotification();
          if (requestId !== void 0) {
            messageLayer.cancelRequest(requestId, signal.reason);
          }
          reject(signal.reason);
        };
        abortListener = rejectWithAbortReason;
        signal.addEventListener("abort", abortListener, { once: true });
        if (signal.aborted) {
          signal.removeEventListener("abort", abortListener);
          rejectWithAbortReason();
        }
      });
      try {
        return await Promise.race([requestPromise, abortPromise]);
      } finally {
        if (abortListener !== void 0) {
          signal.removeEventListener("abort", abortListener);
        }
      }
    } finally {
      if (options.progressToken !== void 0) {
        const activeCount = this.activeProgressTokens.get(options.progressToken);
        if (activeCount === 1) {
          this.activeProgressTokens.delete(options.progressToken);
        } else if (activeCount !== void 0) {
          this.activeProgressTokens.set(options.progressToken, activeCount - 1);
        }
      }
    }
  }
  async listResources(params = {}) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.resources === void 0) {
      throw new Error("Server does not support resources");
    }
    const requestParams = params.cursor === void 0 ? void 0 : { cursor: params.cursor };
    const result = await messageLayer.sendRequest("resources/list", requestParams);
    if (!isResourcesListResult(result)) {
      throw new McpError(ERROR_INVALID_REQUEST, "Invalid resources/list result");
    }
    return result;
  }
  async listResourceTemplates(params = {}) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.resources === void 0) {
      throw new Error("Server does not support resources");
    }
    const requestParams = params.cursor === void 0 ? void 0 : { cursor: params.cursor };
    const result = await messageLayer.sendRequest("resources/templates/list", requestParams);
    if (!isResourceTemplatesListResult(result)) {
      throw new McpError(ERROR_INVALID_REQUEST, "Invalid resources/templates/list result");
    }
    return result;
  }
  async readResource(params) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.resources === void 0) {
      throw new Error("Server does not support resources");
    }
    const result = await messageLayer.sendRequest("resources/read", params);
    if (!isReadResourceResult(result)) {
      throw new McpError(ERROR_INVALID_REQUEST, "Invalid resources/read result");
    }
    return result;
  }
  async subscribe(uri) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.resources?.subscribe !== true) {
      throw new Error("Server does not support resource subscriptions");
    }
    await messageLayer.sendRequest("resources/subscribe", { uri });
    this.subscribedResourceUris.add(uri);
  }
  async unsubscribe(uri) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.resources?.subscribe !== true) {
      throw new Error("Server does not support resource subscriptions");
    }
    await messageLayer.sendRequest("resources/unsubscribe", { uri });
    this.subscribedResourceUris.delete(uri);
  }
  async listPrompts(params = {}) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.prompts === void 0) {
      throw new Error("Server does not support prompts");
    }
    const requestParams = params.cursor === void 0 ? void 0 : { cursor: params.cursor };
    return await messageLayer.sendRequest("prompts/list", requestParams);
  }
  async getPrompt(params) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.prompts === void 0) {
      throw new Error("Server does not support prompts");
    }
    const result = await messageLayer.sendRequest("prompts/get", params);
    if (!isGetPromptResult(result)) {
      throw new McpError(ERROR_INVALID_REQUEST, "Invalid prompts/get result");
    }
    return result;
  }
  async complete(params) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.completions === void 0) {
      throw new Error("Server does not support completions");
    }
    const result = await messageLayer.sendRequest("completion/complete", params);
    if (!isCompleteResult(result)) {
      throw new McpError(ERROR_INVALID_REQUEST, "Invalid completion/complete result");
    }
    return result;
  }
  async setLogLevel(level) {
    const messageLayer = this.getMessageLayerOrThrow();
    const serverCapabilities = this.getServerCapabilitiesOrThrow();
    if (serverCapabilities.logging === void 0) {
      throw new Error("Server does not support logging");
    }
    await messageLayer.sendRequest("logging/setLevel", { level });
  }
  async cancel(requestId, reason) {
    const messageLayer = this.getMessageLayerOrThrow();
    const params = { requestId };
    if (reason !== void 0) {
      params.reason = reason;
    }
    messageLayer.sendNotification("notifications/cancelled", params);
  }
  async sendRootsChanged() {
    const messageLayer = this.getMessageLayerOrThrow();
    if (this.currentClientCapabilities?.roots?.listChanged !== true) {
      throw new Error("Client did not advertise roots list changes");
    }
    messageLayer.sendNotification("notifications/roots/list_changed");
  }
  async ping() {
    const messageLayer = this.getMessageLayerOrThrow();
    await messageLayer.sendRequest("ping");
  }
  async close() {
    if (this.currentState === "closed") {
      return;
    }
    const closeError = new Error("MCP client closed");
    this.messageLayer?.dispose(closeError);
    this.transport?.dispose(closeError);
    this.messageLayer = null;
    this.transport = null;
    this.currentServerCapabilities = null;
    this.currentClientCapabilities = null;
    this.currentServerInfo = null;
    this.currentInstructions = void 0;
    this.subscribedResourceUris.clear();
    this.activeProgressTokens.clear();
    this.currentState = "closed";
  }
};
var ERROR_PARSE = -32700;
var ERROR_INVALID_REQUEST = -32600;
var ERROR_METHOD_NOT_FOUND = -32601;
var ERROR_INTERNAL = -32603;
function defaultStdioSpawn(command, args, options) {
  return spawn3(command, args, options);
}
function defaultHttpTransportFetch(input, init) {
  return fetch(input, init);
}
var StdioTransport = class _StdioTransport {
  readable;
  writable;
  closed;
  child;
  disposed = false;
  stderrOutput = "";
  static STDERR_MAX_LENGTH = 65536;
  constructor({ command, args = [], cwd, env, spawn: spawnProcess = defaultStdioSpawn }) {
    this.child = spawnProcess(command, args, {
      cwd,
      env,
      stdio: ["pipe", "pipe", "pipe"]
    });
    const child = this.child;
    this.readable = child.stdout;
    this.writable = child.stdin;
    const stderrDecoder = new TextDecoder();
    child.stderr.on("data", (chunk) => {
      const decoded = chunk instanceof Uint8Array ? stderrDecoder.decode(chunk, { stream: true }) : `${stderrDecoder.decode()}${String(chunk)}`;
      this.appendStderrOutput(decoded);
    });
    child.stderr.once("end", () => {
      this.appendStderrOutput(stderrDecoder.decode());
    });
    this.closed = new Promise((resolve2) => {
      let settled = false;
      const resolveClosed = (event) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve2(event);
      };
      child.once("exit", (code, signal) => {
        const closedEvent = {
          reason: new Error("Stdio transport process exited")
        };
        if (code !== null) {
          closedEvent.code = code;
        }
        if (signal !== null) {
          closedEvent.signal = signal;
        }
        resolveClosed(closedEvent);
      });
      child.once("error", (error3) => {
        const closedEvent = {
          reason: error3 instanceof Error ? error3 : new Error(String(error3))
        };
        if (child.exitCode !== null) {
          closedEvent.code = child.exitCode;
        }
        if (child.signalCode !== null) {
          closedEvent.signal = child.signalCode;
        }
        resolveClosed(closedEvent);
      });
    });
  }
  getStderrOutput() {
    return this.stderrOutput;
  }
  appendStderrOutput(chunk) {
    if (chunk.length === 0) {
      return;
    }
    this.stderrOutput += chunk;
    if (this.stderrOutput.length > _StdioTransport.STDERR_MAX_LENGTH) {
      this.stderrOutput = this.stderrOutput.slice(-_StdioTransport.STDERR_MAX_LENGTH);
    }
  }
  dispose(reason = new Error("Stdio transport disposed")) {
    void reason;
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    if (!this.child.stdin.destroyed && !this.child.stdin.writableEnded) {
      this.child.stdin.end();
    }
    if (this.child.exitCode === null && this.child.signalCode === null && !this.child.killed) {
      this.child.kill("SIGTERM");
    }
  }
};
var HttpTransport = class {
  readable;
  writable;
  closed;
  url;
  headers;
  fetchImpl;
  readStream = new PassThrough();
  writeStream = new PassThrough();
  resolveClosed;
  sessionId;
  lastEventId;
  getSseStreamStarted = false;
  disposed = false;
  oauthProvider;
  oauthMetadataDiscovery;
  inFlightFetchAbortControllers = /* @__PURE__ */ new Set();
  openSseReaders = /* @__PURE__ */ new Set();
  constructor({ url, headers = {}, fetch: fetchImpl = defaultHttpTransportFetch, oauth, oauthDiscoveryCache }) {
    this.url = url;
    this.headers = headers;
    this.fetchImpl = fetchImpl;
    this.oauthProvider = oauth === void 0 ? void 0 : createOAuthClientProvider(oauth);
    this.oauthMetadataDiscovery = oauth === void 0 ? void 0 : new OAuthMetadataDiscovery({
      fetch: (input, init) => this.fetchWithAbort(input, init ?? {}),
      cache: oauthDiscoveryCache
    });
    this.readable = this.readStream;
    this.writable = this.writeStream;
    this.closed = new Promise((resolve2) => {
      this.resolveClosed = resolve2;
    });
    this.readStream.once("error", (error3) => {
      this.dispose(error3 instanceof Error ? error3 : new Error(String(error3)));
    });
    this.writeStream.once("error", (error3) => {
      this.dispose(error3 instanceof Error ? error3 : new Error(String(error3)));
    });
    this.consumeWrittenLines().catch((error3) => {
      this.dispose(error3 instanceof Error ? error3 : new Error(String(error3)));
    });
  }
  dispose(reason = new Error("HTTP transport disposed")) {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.abortInFlightFetches();
    this.cancelOpenSseReaders();
    if (!this.writeStream.destroyed && !this.writeStream.writableEnded) {
      this.writeStream.end();
    }
    if (!this.readStream.destroyed && !this.readStream.writableEnded) {
      this.readStream.end();
    }
    void this.closeWithSessionTermination(reason);
  }
  async closeWithSessionTermination(reason) {
    let closeReason = reason;
    if (this.sessionId !== void 0) {
      const sessionId = this.sessionId;
      this.sessionId = void 0;
      try {
        await this.sendSessionTerminationRequest(sessionId);
      } catch (error3) {
        closeReason = error3 instanceof Error ? error3 : new Error(String(error3));
      }
    }
    const resolveClosed = this.resolveClosed;
    this.resolveClosed = void 0;
    resolveClosed?.({ reason: closeReason });
  }
  abortInFlightFetches() {
    for (const abortController of this.inFlightFetchAbortControllers) {
      abortController.abort();
    }
    this.inFlightFetchAbortControllers.clear();
  }
  cancelOpenSseReaders() {
    for (const reader of this.openSseReaders) {
      void reader.cancel().catch(() => void 0);
    }
    this.openSseReaders.clear();
  }
  async fetchWithAbort(input, init) {
    const abortController = new AbortController();
    this.inFlightFetchAbortControllers.add(abortController);
    try {
      return await this.fetchImpl(input, {
        ...init,
        signal: abortController.signal
      });
    } finally {
      this.inFlightFetchAbortControllers.delete(abortController);
    }
  }
  async consumeWrittenLines() {
    for await (const line of readLines(this.writeStream)) {
      if (this.disposed || line.length === 0) {
        continue;
      }
      const hasSessionId = this.sessionId !== void 0;
      const response = await this.fetchWithOAuthRetry({
        method: "POST",
        createHeaders: () => this.createPostHeaders(),
        body: line
      });
      if (hasSessionId && response.status === 404) {
        this.sessionId = void 0;
        this.dispose(new Error("HTTP transport session expired (404 response)"));
        return;
      }
      await this.throwForPostHttpError(response);
      this.captureSessionId(response);
      this.maybeOpenGetSseStream();
      void this.forwardResponseMessages(response).catch((error3) => {
        this.dispose(error3 instanceof Error ? error3 : new Error(String(error3)));
      });
    }
  }
  async createPostHeaders() {
    const headers = new Headers(this.headers);
    headers.set("Accept", "application/json, text/event-stream");
    headers.set("Content-Type", "application/json");
    if (this.sessionId !== void 0) {
      headers.set("Mcp-Session-Id", this.sessionId);
      headers.set("MCP-Protocol-Version", MCP_PROTOCOL_VERSION);
    }
    return this.authorizeRequestHeaders(headers);
  }
  async createGetHeaders() {
    const headers = new Headers(this.headers);
    headers.set("Accept", "text/event-stream");
    if (this.sessionId !== void 0) {
      headers.set("Mcp-Session-Id", this.sessionId);
      headers.set("MCP-Protocol-Version", MCP_PROTOCOL_VERSION);
    }
    if (this.lastEventId !== void 0) {
      headers.set("Last-Event-ID", this.lastEventId);
    }
    return this.authorizeRequestHeaders(headers);
  }
  async createDeleteHeaders(sessionId) {
    const headers = new Headers(this.headers);
    headers.set("Mcp-Session-Id", sessionId);
    headers.set("MCP-Protocol-Version", MCP_PROTOCOL_VERSION);
    return this.authorizeRequestHeaders(headers);
  }
  async authorizeRequestHeaders(headers) {
    await this.oauthProvider?.authorizeRequest?.({
      requestUrl: new URL(this.url),
      headers,
      fetch: this.fetchImpl
    });
    return headers;
  }
  captureSessionId(response) {
    const sessionId = response.headers.get("Mcp-Session-Id");
    if (sessionId === null || sessionId.length === 0) {
      return;
    }
    if (this.sessionId !== void 0 && this.sessionId !== sessionId) {
      throw new Error("HTTP transport response changed active session ID");
    }
    this.sessionId = sessionId;
  }
  maybeOpenGetSseStream() {
    if (this.disposed || this.sessionId === void 0 || this.getSseStreamStarted) {
      return;
    }
    this.getSseStreamStarted = true;
    this.consumeGetSseStream().catch((error3) => {
      if (error3 instanceof HttpTransportGetSseNotSupportedError || this.disposed) {
        return;
      }
      this.dispose(error3 instanceof Error ? error3 : new Error(String(error3)));
    });
  }
  async sendSessionTerminationRequest(sessionId) {
    const response = await this.fetchImpl(this.url, {
      method: "DELETE",
      headers: await this.createDeleteHeaders(sessionId)
    });
    if (response.status === 405 || response.ok) {
      return;
    }
    const responseBody = (await response.text()).trim();
    const statusDescriptor = `${response.status} ${response.statusText}`.trim();
    const message2 = responseBody.length === 0 ? `HTTP transport DELETE failed (${statusDescriptor})` : `HTTP transport DELETE failed (${statusDescriptor}): ${responseBody}`;
    throw new Error(message2);
  }
  async consumeGetSseStream() {
    const response = await this.fetchWithOAuthRetry({
      method: "GET",
      createHeaders: () => this.createGetHeaders()
    });
    if (response.status === 405) {
      throw new HttpTransportGetSseNotSupportedError();
    }
    if (response.status === 404) {
      this.sessionId = void 0;
      throw new Error("HTTP transport session expired (GET 404 response)");
    }
    if (!response.ok) {
      const responseBody = (await response.text()).trim();
      const statusDescriptor = `${response.status} ${response.statusText}`.trim();
      const message2 = responseBody.length === 0 ? `HTTP transport GET failed (${statusDescriptor})` : `HTTP transport GET failed (${statusDescriptor}): ${responseBody}`;
      throw new Error(message2);
    }
    const contentType = response.headers.get("Content-Type");
    if (contentType === null) {
      return;
    }
    if (contentType.toLowerCase().includes("text/event-stream")) {
      await this.forwardSseResponseMessages(response);
      this.getSseStreamStarted = false;
      if (!this.disposed && this.sessionId !== void 0 && this.lastEventId !== void 0) {
        this.maybeOpenGetSseStream();
      }
      return;
    }
    return;
  }
  async throwForPostHttpError(response) {
    if (response.status < 400) {
      return;
    }
    const responseBody = (await response.text()).trim();
    const statusDescriptor = `${response.status} ${response.statusText}`.trim();
    const message2 = responseBody.length === 0 ? `HTTP transport POST failed (${statusDescriptor})` : `HTTP transport POST failed (${statusDescriptor}): ${responseBody}`;
    throw new Error(message2);
  }
  async maybeHandleUnauthorizedResponse(response) {
    if (response.status !== 401 || this.oauthProvider === void 0) {
      return false;
    }
    const discoveryClient = this.oauthMetadataDiscovery;
    if (discoveryClient === void 0) {
      return false;
    }
    const challenge = parseBearerWwwAuthenticateHeader(response.headers.get("WWW-Authenticate"));
    const resourceMetadataUrl = challenge?.params.resource_metadata;
    const discovery = await discoveryClient.discover(this.url, {
      resourceMetadataUrl
    });
    const result = await this.oauthProvider.handleUnauthorized({
      requestUrl: new URL(this.url),
      response: response.clone(),
      challenge,
      discovery,
      fetch: this.fetchImpl
    });
    if (result.action === "retry") {
      return true;
    }
    if (result.error !== void 0) {
      throw result.error;
    }
    return false;
  }
  async forwardResponseMessages(response) {
    if (response.status === 202) {
      return;
    }
    const contentType = response.headers.get("Content-Type");
    if (contentType === null) {
      return;
    }
    const normalizedContentType = contentType.toLowerCase();
    if (normalizedContentType.includes("text/event-stream")) {
      await this.forwardSseResponseMessages(response);
      return;
    }
    if (normalizedContentType.includes("application/json")) {
      await this.forwardJsonResponseMessage(response);
      return;
    }
    throw new Error("HTTP transport POST returned an unsupported response content type");
  }
  async forwardSseResponseMessages(response) {
    if (response.body === null) {
      return;
    }
    const parser = new SseParser();
    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    this.openSseReaders.add(reader);
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (value === void 0) {
          continue;
        }
        const messages = parser.push(decoder.decode(value, { stream: true }));
        this.writeSseMessages(messages);
        this.lastEventId = parser.lastEventId;
      }
      const trailingChunk = decoder.decode();
      if (trailingChunk.length > 0) {
        this.writeSseMessages(parser.push(trailingChunk));
        this.lastEventId = parser.lastEventId;
      }
      this.writeSseMessages(parser.flush());
      this.lastEventId = parser.lastEventId;
    } finally {
      this.openSseReaders.delete(reader);
      reader.releaseLock();
    }
  }
  async forwardJsonResponseMessage(response) {
    const payload = await response.text();
    if (payload.length === 0) {
      return;
    }
    const parsedPayload = JSON.parse(payload);
    this.writeReadableLine(JSON.stringify(parsedPayload));
  }
  writeSseMessages(messages) {
    for (const message2 of messages) {
      this.writeReadableLine(message2.data);
    }
  }
  writeReadableLine(line) {
    if (this.disposed || this.readStream.destroyed || this.readStream.writableEnded) {
      return;
    }
    this.readStream.write(`${line}
`);
  }
  async fetchWithOAuthRetry(input) {
    const request = async () => this.fetchWithAbort(this.url, {
      method: input.method,
      headers: await input.createHeaders(),
      body: input.body
    });
    let response = await request();
    if (await this.maybeHandleUnauthorizedResponse(response)) {
      response = await request();
    }
    const oauthError = this.oauthProvider === void 0 ? null : this.readOAuthChallengeError(response);
    if (oauthError !== null) {
      throw oauthError;
    }
    return response;
  }
  readOAuthChallengeError(response) {
    if (response.status !== 401 && response.status !== 403) {
      return null;
    }
    const challenge = parseBearerWwwAuthenticateHeader(response.headers.get("WWW-Authenticate"));
    const error3 = challenge?.params.error;
    if (error3 === void 0 || error3.length === 0) {
      return null;
    }
    return new OAuthError({
      error: error3,
      error_description: challenge?.params.error_description,
      error_uri: challenge?.params.error_uri
    }, response.status);
  }
};
var HttpTransportGetSseNotSupportedError = class extends Error {
  constructor() {
    super("HTTP transport server does not support GET SSE streams");
  }
};
var McpError = class extends Error {
  code;
  constructor(code, message2, data) {
    super(message2);
    this.name = "McpError";
    this.code = code;
    if (data !== void 0) {
      this.data = data;
    }
  }
};
function serializeJsonRpcMessage(message2) {
  return `${JSON.stringify(message2)}
`;
}
function normalizeLine(line) {
  return line.endsWith("\r") ? line.slice(0, -1) : line;
}
async function* readLines(stream) {
  let buffer = "";
  const decoder = new TextDecoder();
  for await (const chunk of stream) {
    buffer += chunk instanceof Uint8Array ? decoder.decode(chunk, { stream: true }) : decoder.decode() + String(chunk);
    while (true) {
      const newlineIndex = buffer.indexOf("\n");
      if (newlineIndex === -1) {
        break;
      }
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      yield normalizeLine(line);
    }
  }
  buffer += decoder.decode();
  if (buffer.length > 0) {
    yield normalizeLine(buffer);
  }
}
var SseParser = class {
  buffer = "";
  eventType;
  dataLines = [];
  eventId = "";
  hasEventId = false;
  _lastEventId;
  get lastEventId() {
    return this._lastEventId;
  }
  push(chunk) {
    if (chunk.length === 0) {
      return [];
    }
    this.buffer += chunk;
    const messages = [];
    while (true) {
      const newlineIndex = this.buffer.indexOf("\n");
      if (newlineIndex === -1) {
        break;
      }
      const line = normalizeLine(this.buffer.slice(0, newlineIndex));
      this.buffer = this.buffer.slice(newlineIndex + 1);
      this.consumeLine(line, messages);
    }
    return messages;
  }
  flush() {
    const messages = [];
    if (this.buffer.length > 0) {
      this.consumeLine(normalizeLine(this.buffer), messages);
      this.buffer = "";
    }
    this.emitEvent(messages);
    return messages;
  }
  consumeLine(line, messages) {
    if (line.length === 0) {
      this.emitEvent(messages);
      return;
    }
    if (line.startsWith(":")) {
      return;
    }
    const separatorIndex = line.indexOf(":");
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    const rawValue = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);
    const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;
    if (field === "event") {
      this.eventType = value;
      return;
    }
    if (field === "data") {
      this.dataLines.push(value);
      return;
    }
    if (field === "id") {
      if (value.includes("\0")) {
        return;
      }
      this.eventId = value;
      this.hasEventId = true;
    }
  }
  emitEvent(messages) {
    const eventType = this.eventType ?? "message";
    if (this.hasEventId) {
      this._lastEventId = this.eventId;
    }
    if (this.dataLines.length === 0 || eventType !== "message") {
      this.resetEvent();
      return;
    }
    const message2 = {
      data: this.dataLines.join("\n")
    };
    if (this.hasEventId) {
      message2.id = this.eventId;
    }
    messages.push(message2);
    this.resetEvent();
  }
  resetEvent() {
    this.eventType = void 0;
    this.dataLines = [];
    this.eventId = "";
    this.hasEventId = false;
  }
};
var JsonRpcMessageLayer = class {
  requestTimeoutMs;
  input;
  output;
  inputClosedReason;
  nextRequestId = 1;
  disposedError;
  pendingRequests = /* @__PURE__ */ new Map();
  activeIncomingRequests = /* @__PURE__ */ new Map();
  requestHandlers = /* @__PURE__ */ new Map();
  notificationHandlers = /* @__PURE__ */ new Map();
  constructor(input, output, requestTimeoutMs = 3e4, inputClosedReason) {
    if (!Number.isFinite(requestTimeoutMs) || requestTimeoutMs < 0) {
      throw new Error("requestTimeoutMs must be a non-negative finite number");
    }
    this.input = input;
    this.output = output;
    this.inputClosedReason = inputClosedReason;
    this.requestTimeoutMs = requestTimeoutMs;
    this.consumeInput().catch(() => void 0);
  }
  sendNotification(method, params) {
    if (this.disposedError !== void 0) {
      throw this.disposedError;
    }
    const message2 = {
      jsonrpc: "2.0",
      method
    };
    if (params !== void 0) {
      message2.params = params;
    }
    this.output.write(serializeJsonRpcMessage(message2));
  }
  onRequest(method, handler) {
    this.requestHandlers.set(method, handler);
  }
  onNotification(method, handler) {
    this.notificationHandlers.set(method, handler);
  }
  sendRequest(method, params, options = {}) {
    if (this.disposedError !== void 0) {
      throw this.disposedError;
    }
    const id = this.nextRequestId;
    this.nextRequestId += 1;
    const timeoutMs = options.timeoutMs ?? this.requestTimeoutMs;
    if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
      throw new Error("timeoutMs must be a non-negative finite number");
    }
    if (options.onRequestId !== void 0) {
      options.onRequestId(id);
    }
    const message2 = {
      jsonrpc: "2.0",
      id,
      method
    };
    if (params !== void 0) {
      message2.params = params;
    }
    return new Promise((resolve2, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        options.onTimeout?.(id);
        reject(new Error(`JSON-RPC request "${method}" timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      this.pendingRequests.set(id, { resolve: resolve2, reject, timeout });
      try {
        this.output.write(serializeJsonRpcMessage(message2));
      } catch (error3) {
        clearTimeout(timeout);
        this.pendingRequests.delete(id);
        reject(error3);
      }
    });
  }
  cancelRequest(requestId, reason) {
    const pending = this.pendingRequests.get(requestId);
    if (pending === void 0) {
      return false;
    }
    this.pendingRequests.delete(requestId);
    clearTimeout(pending.timeout);
    pending.reject(reason);
    return true;
  }
  dispose(reason = new Error("JSON-RPC message layer disposed")) {
    if (this.disposedError !== void 0) {
      return;
    }
    this.disposedError = reason;
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout);
      pending.reject(reason);
    }
    this.pendingRequests.clear();
    this.activeIncomingRequests.clear();
  }
  async consumeInput() {
    try {
      for await (const line of readLines(this.input)) {
        if (this.disposedError !== void 0) {
          break;
        }
        if (line.length === 0) {
          continue;
        }
        let parsedLine;
        try {
          parsedLine = JSON.parse(line);
        } catch {
          await this.processParsedMessage({
            type: "invalid",
            id: null,
            error: parseError()
          });
          continue;
        }
        if (Array.isArray(parsedLine)) {
          for (const message2 of parsedLine) {
            if (this.disposedError !== void 0) {
              break;
            }
            await this.processParsedMessage(parseJsonRpcPayload(message2));
          }
          continue;
        }
        await this.processParsedMessage(parseJsonRpcPayload(parsedLine));
      }
    } catch (error3) {
      if (this.disposedError === void 0) {
        this.dispose(error3 instanceof Error ? error3 : new Error(`JSON-RPC input stream failed: ${String(error3)}`));
      }
      return;
    }
    if (this.disposedError === void 0) {
      const streamClosedReason = await this.resolveInputStreamClosedReason();
      if (this.disposedError === void 0) {
        this.dispose(streamClosedReason);
      }
    }
  }
  async resolveInputStreamClosedReason() {
    const streamClosedError = new Error("JSON-RPC input stream closed");
    if (this.inputClosedReason === void 0) {
      return streamClosedError;
    }
    try {
      return await Promise.race([
        this.inputClosedReason,
        new Promise((resolve2) => {
          setTimeout(() => {
            resolve2(streamClosedError);
          }, 50);
        })
      ]);
    } catch {
      return streamClosedError;
    }
  }
  async processParsedMessage(parsed) {
    if (parsed.type === "request") {
      const handler = this.requestHandlers.get(parsed.message.method);
      if (handler === void 0) {
        this.output.write(serializeJsonRpcMessage({
          jsonrpc: "2.0",
          id: parsed.message.id,
          error: {
            code: ERROR_METHOD_NOT_FOUND,
            message: `Method not found: ${parsed.message.method}`
          }
        }));
        return;
      }
      this.handleIncomingRequest(parsed.message, handler);
      return;
    }
    if (parsed.type === "notification") {
      if (parsed.message.method === "notifications/cancelled") {
        this.handleCancellationNotification(parsed.message.params);
      }
      const handler = this.notificationHandlers.get(parsed.message.method);
      if (handler === void 0) {
        return;
      }
      try {
        await handler(parsed.message.params, {
          method: parsed.message.method
        });
      } catch {
        return;
      }
      return;
    }
    if (parsed.type === "invalid") {
      const errorResponse = {
        jsonrpc: "2.0",
        id: parsed.id,
        error: {
          code: parsed.error.code,
          message: parsed.error.message
        }
      };
      if (parsed.error.data !== void 0) {
        errorResponse.error.data = parsed.error.data;
      }
      this.output.write(`${JSON.stringify(errorResponse)}
`);
      return;
    }
    if (parsed.type !== "response") {
      return;
    }
    const pending = this.pendingRequests.get(parsed.message.id);
    if (pending === void 0) {
      return;
    }
    this.pendingRequests.delete(parsed.message.id);
    clearTimeout(pending.timeout);
    if ("result" in parsed.message) {
      pending.resolve(parsed.message.result);
      return;
    }
    pending.reject(new McpError(parsed.message.error.code, parsed.message.error.message, parsed.message.error.data));
  }
  handleIncomingRequest(message2, handler) {
    const activeRequest = {
      cancelled: false
    };
    this.activeIncomingRequests.set(message2.id, activeRequest);
    void (async () => {
      try {
        const result = await handler(message2.params, {
          id: message2.id,
          method: message2.method
        });
        if (this.disposedError !== void 0 || activeRequest.cancelled) {
          return;
        }
        this.output.write(serializeJsonRpcMessage({
          jsonrpc: "2.0",
          id: message2.id,
          result
        }));
      } catch (error3) {
        if (this.disposedError !== void 0 || activeRequest.cancelled) {
          return;
        }
        const errorMessage = error3 instanceof Error ? error3.message : String(error3);
        this.output.write(serializeJsonRpcMessage({
          jsonrpc: "2.0",
          id: message2.id,
          error: {
            code: ERROR_INTERNAL,
            message: errorMessage
          }
        }));
      } finally {
        const inFlightRequest = this.activeIncomingRequests.get(message2.id);
        if (inFlightRequest === activeRequest) {
          this.activeIncomingRequests.delete(message2.id);
        }
      }
    })();
  }
  handleCancellationNotification(params) {
    if (!isObjectRecord5(params)) {
      return;
    }
    const requestId = params.requestId;
    if (!isRequestId(requestId)) {
      return;
    }
    const activeRequest = this.activeIncomingRequests.get(requestId);
    if (activeRequest === void 0) {
      return;
    }
    activeRequest.cancelled = true;
    this.activeIncomingRequests.delete(requestId);
  }
};
function isObjectRecord5(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isInitializeResult(value) {
  if (!isObjectRecord5(value) || typeof value.protocolVersion !== "string") {
    return false;
  }
  if (!isServerCapabilities(value.capabilities)) {
    return false;
  }
  if (!isObjectRecord5(value.serverInfo) || typeof value.serverInfo.name !== "string" || value.serverInfo.name.length === 0 || typeof value.serverInfo.version !== "string" || value.serverInfo.version.length === 0) {
    return false;
  }
  return value.instructions === void 0 || typeof value.instructions === "string";
}
function isServerCapabilities(value) {
  if (!isObjectRecord5(value)) {
    return false;
  }
  for (const capability of ["prompts", "resources", "tools", "logging", "completions", "experimental"]) {
    if (value[capability] !== void 0 && !isObjectRecord5(value[capability])) {
      return false;
    }
  }
  return true;
}
function isCallToolResult(value) {
  if (!isObjectRecord5(value) || !Array.isArray(value.content)) {
    return false;
  }
  if (value.structuredContent !== void 0 && !isObjectRecord5(value.structuredContent)) {
    return false;
  }
  if (value.isError !== void 0 && typeof value.isError !== "boolean") {
    return false;
  }
  return value.content.every(isContentItem);
}
function isToolsListResult(value) {
  return isObjectRecord5(value) && Array.isArray(value.tools) && (value.nextCursor === void 0 || typeof value.nextCursor === "string");
}
function isResourcesListResult(value) {
  return isObjectRecord5(value) && Array.isArray(value.resources) && value.resources.every(isResource) && (value.nextCursor === void 0 || typeof value.nextCursor === "string");
}
function isResourceTemplatesListResult(value) {
  return isObjectRecord5(value) && Array.isArray(value.resourceTemplates) && value.resourceTemplates.every(isResourceTemplate) && (value.nextCursor === void 0 || typeof value.nextCursor === "string");
}
function isReadResourceResult(value) {
  return isObjectRecord5(value) && Array.isArray(value.contents) && value.contents.every(isResourceContents);
}
function isGetPromptResult(value) {
  return isObjectRecord5(value) && (value.description === void 0 || typeof value.description === "string") && Array.isArray(value.messages) && value.messages.every(isPromptMessage);
}
function isCompleteResult(value) {
  return isObjectRecord5(value) && isObjectRecord5(value.completion) && Array.isArray(value.completion.values) && value.completion.values.every((candidate) => typeof candidate === "string") && (value.completion.hasMore === void 0 || typeof value.completion.hasMore === "boolean") && (value.completion.total === void 0 || typeof value.completion.total === "number");
}
function isResource(value) {
  return isObjectRecord5(value) && typeof value.uri === "string" && typeof value.name === "string" && (value.description === void 0 || typeof value.description === "string") && (value.mimeType === void 0 || typeof value.mimeType === "string") && (value.size === void 0 || typeof value.size === "number");
}
function isResourceTemplate(value) {
  return isObjectRecord5(value) && typeof value.uriTemplate === "string" && typeof value.name === "string" && (value.description === void 0 || typeof value.description === "string") && (value.mimeType === void 0 || typeof value.mimeType === "string");
}
function isResourceContents(value) {
  if (!isObjectRecord5(value) || typeof value.uri !== "string") {
    return false;
  }
  if (value.mimeType !== void 0 && typeof value.mimeType !== "string") {
    return false;
  }
  const hasText = value.text !== void 0;
  const hasBlob = value.blob !== void 0;
  if (!hasText && !hasBlob) {
    return false;
  }
  return (!hasText || typeof value.text === "string") && (!hasBlob || typeof value.blob === "string");
}
function isPromptMessage(value) {
  return isObjectRecord5(value) && (value.role === "user" || value.role === "assistant") && isContentItem(value.content);
}
function isContentItem(value) {
  if (!isObjectRecord5(value)) {
    return false;
  }
  if (value.type === "text") {
    return typeof value.text === "string";
  }
  if (value.type === "image" || value.type === "audio") {
    return typeof value.data === "string" && typeof value.mimeType === "string";
  }
  if (value.type !== "resource" || !isObjectRecord5(value.resource)) {
    return false;
  }
  return isResourceContents(value.resource);
}
function hasOwn(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isRequestId(value) {
  return typeof value === "string" || typeof value === "number";
}
function isLogLevel(value) {
  return value === "debug" || value === "info" || value === "notice" || value === "warning" || value === "error" || value === "critical" || value === "alert" || value === "emergency";
}
function toRequestId(value) {
  return isRequestId(value) ? value : null;
}
function parseError() {
  return new McpError(ERROR_PARSE, "Parse error");
}
function invalidRequest() {
  return new McpError(ERROR_INVALID_REQUEST, "Invalid Request");
}
function isJsonRpcErrorObject(value) {
  if (!isObjectRecord5(value)) {
    return false;
  }
  if (typeof value.code !== "number" || typeof value.message !== "string") {
    return false;
  }
  return value.data === void 0 || hasOwn(value, "data");
}
function parseJsonRpcPayload(parsed) {
  if (!isObjectRecord5(parsed)) {
    return {
      type: "invalid",
      id: null,
      error: invalidRequest()
    };
  }
  const id = toRequestId(parsed.id);
  if (parsed.jsonrpc !== "2.0") {
    return {
      type: "invalid",
      id,
      error: invalidRequest()
    };
  }
  const hasMethod = hasOwn(parsed, "method");
  const hasId = hasOwn(parsed, "id");
  if (hasMethod) {
    if (typeof parsed.method !== "string") {
      return {
        type: "invalid",
        id,
        error: invalidRequest()
      };
    }
    if (hasId) {
      if (!isRequestId(parsed.id)) {
        return {
          type: "invalid",
          id: null,
          error: invalidRequest()
        };
      }
      const request = {
        jsonrpc: "2.0",
        id: parsed.id,
        method: parsed.method
      };
      if (hasOwn(parsed, "params")) {
        request.params = parsed.params;
      }
      return {
        type: "request",
        message: request
      };
    }
    const notification = {
      jsonrpc: "2.0",
      method: parsed.method
    };
    if (hasOwn(parsed, "params")) {
      notification.params = parsed.params;
    }
    return {
      type: "notification",
      message: notification
    };
  }
  if (!hasId || !isRequestId(parsed.id)) {
    return {
      type: "invalid",
      id,
      error: invalidRequest()
    };
  }
  const hasResult = hasOwn(parsed, "result");
  const hasError = hasOwn(parsed, "error");
  if (hasResult === hasError) {
    return {
      type: "invalid",
      id: parsed.id,
      error: invalidRequest()
    };
  }
  if (hasResult) {
    return {
      type: "response",
      message: {
        jsonrpc: "2.0",
        id: parsed.id,
        result: parsed.result
      }
    };
  }
  if (!isJsonRpcErrorObject(parsed.error)) {
    return {
      type: "invalid",
      id: parsed.id,
      error: invalidRequest()
    };
  }
  return {
    type: "response",
    message: {
      jsonrpc: "2.0",
      id: parsed.id,
      error: parsed.error
    }
  };
}

// node_modules/toolcraft/dist/json-schema-converter.js
function convertJsonSchema(schema) {
  if (hasSelfReferencingRef(schema, schema)) {
    return applyMetadata(S.Json(), schema, {
      nullable: schema.nullable === true
    });
  }
  return convertSchema(schema, schema, []);
}
function convertSchema(schema, root2, path10) {
  const resolvedSchema = resolveReferencedSchema(schema, root2, path10);
  const normalizedSchema = normalizeNullability(resolvedSchema);
  const composition = getComposition(normalizedSchema.schema);
  if (Array.isArray(normalizedSchema.schema.type)) {
    throw new Error(`JSON Schema "${formatJsonSchemaPath(path10)}" has an unsupported type "${formatJsonSchemaType(normalizedSchema.schema.type)}". Supported: string, number, integer, boolean, array, object.`);
  }
  if (resolvedSchema.const !== void 0) {
    return convertConstSchema(resolvedSchema, normalizedSchema.nullable);
  }
  if (resolvedSchema.enum !== void 0) {
    return convertEnumSchema(resolvedSchema, normalizedSchema.nullable);
  }
  if (composition !== void 0) {
    return convertCompositionSchema(normalizedSchema.schema, root2, normalizedSchema.nullable, path10);
  }
  if (isRecordSchema(normalizedSchema.schema)) {
    return applyMetadata(S.Record(convertSchema(normalizedSchema.schema.additionalProperties, root2, [
      ...path10,
      "additionalProperties"
    ])), normalizedSchema.schema, {
      nullable: normalizedSchema.nullable
    });
  }
  switch (normalizedSchema.schema.type) {
    case "string":
      return S.String({
        ...createCommonOptions(normalizedSchema.schema, normalizedSchema.nullable, getStringDefault(normalizedSchema.schema.default)),
        ...normalizedSchema.schema.pattern === void 0 ? {} : { pattern: normalizedSchema.schema.pattern }
      });
    case "number":
      return S.Number(createCommonOptions(normalizedSchema.schema, normalizedSchema.nullable, getNumberDefault(normalizedSchema.schema.default)));
    case "integer":
      return S.Number({
        ...createCommonOptions(normalizedSchema.schema, normalizedSchema.nullable, getIntegerDefault(normalizedSchema.schema.default)),
        jsonType: "integer"
      });
    case "boolean":
      return S.Boolean(createCommonOptions(normalizedSchema.schema, normalizedSchema.nullable, getBooleanDefault(normalizedSchema.schema.default)));
    case "array":
      if (normalizedSchema.schema.items === void 0) {
        throw new Error(`JSON Schema "${formatJsonSchemaPath(path10)}" is an array but is missing the "items" field. Add "items": { ... } to declare the element type.`);
      }
      return S.Array(convertSchema(normalizedSchema.schema.items, root2, [...path10, "items"]), createCommonOptions(normalizedSchema.schema, normalizedSchema.nullable, getArrayDefault(normalizedSchema.schema.default)));
    case "object":
      return convertObjectSchema(normalizedSchema.schema, root2, {
        nullable: normalizedSchema.nullable,
        path: path10
      });
    case "null":
      return applyMetadata(S.Json(), normalizedSchema.schema, {
        default: getJsonDefault(normalizedSchema.schema.default) ?? null,
        nullable: true
      });
    case void 0:
      if (normalizedSchema.nullable) {
        return applyMetadata(S.Json(), normalizedSchema.schema, {
          nullable: true
        });
      }
      throw new Error(`JSON Schema "${formatJsonSchemaPath(path10)}" must declare one of: "type", "enum", "const", "oneOf", "anyOf", or "allOf".`);
  }
  throw new Error(`JSON Schema "${formatJsonSchemaPath(path10)}" has an unsupported type "${formatJsonSchemaType(normalizedSchema.schema.type)}". Supported: string, number, integer, boolean, array, object.`);
}
function convertConstSchema(schema, nullable) {
  if (isPrimitiveEnumValue(schema.const)) {
    return S.Enum([schema.const], {
      ...createCommonOptions(schema, nullable, schema.const),
      default: schema.const,
      ...schema.type === "integer" && typeof schema.const === "number" ? { jsonType: "integer" } : {}
    });
  }
  return applyMetadata(S.Json(), schema, {
    default: schema.const,
    nullable: nullable || schema.const === null,
    description: appendDescription(schema.description, `Constant JSON value: ${JSON.stringify(schema.const)}.`)
  });
}
function convertEnumSchema(schema, nullable) {
  const values = schema.enum ?? [];
  const nonNullValues = values.filter((value) => value !== null);
  const hasNull = nonNullValues.length !== values.length;
  if (nonNullValues.every(isPrimitiveEnumValue) && nonNullValues.length > 0) {
    return S.Enum(nonNullValues, {
      ...createCommonOptions(schema, nullable || hasNull, getPrimitiveEnumDefault(schema.default, nonNullValues)),
      ...schema.type === "integer" && nonNullValues.every((value) => Number.isInteger(value)) ? { jsonType: "integer" } : {}
    });
  }
  return applyMetadata(S.Json(), schema, {
    nullable: nullable || hasNull,
    description: appendDescription(schema.description, `Allowed JSON values: ${values.map((value) => JSON.stringify(value)).join(", ")}.`)
  });
}
function convertCompositionSchema(schema, root2, nullable, path10) {
  const composition = getComposition(schema);
  const branchSchemas = composition?.branches ?? [];
  const keyword = composition?.keyword ?? "oneOf";
  const branches = branchSchemas.map((branch, index) => resolveReferencedSchema(branch, root2, [...path10, keyword, String(index)]));
  const discriminator = findDiscriminator(branches, root2, path10);
  if (discriminator !== void 0) {
    const convertedBranches = Object.fromEntries(branches.map((branch, index) => [
      getDiscriminatorLiteral(branch, discriminator, root2),
      convertObjectSchema(branch, root2, {
        omitProperty: discriminator,
        path: [...path10, keyword, String(index)]
      })
    ]));
    return applyMetadata(S.OneOf({
      discriminator,
      branches: convertedBranches
    }), schema, {
      nullable
    });
  }
  return applyMetadata(S.Union(branches.map((branch, index) => convertObjectSchema(branch, root2, {
    path: [...path10, keyword, String(index)]
  }))), schema, {
    nullable
  });
}
function convertObjectSchema(schema, root2, options) {
  const resolvedSchema = resolveReferencedSchema(schema, root2, options.path);
  const normalizedSchema = normalizeNullability(resolvedSchema);
  const properties = normalizedSchema.schema.properties ?? {};
  const requiredKeys = new Set(normalizedSchema.schema.required ?? []);
  const shape = {};
  if (normalizedSchema.schema.type !== "object" && normalizedSchema.schema.properties === void 0) {
    throw new Error(`Expected "${formatJsonSchemaPath(options.path)}" to be an object schema (got "${describeObjectSchemaKind(normalizedSchema.schema)}").`);
  }
  for (const [key2, propertySchema] of Object.entries(properties)) {
    if (key2 === options.omitProperty) {
      continue;
    }
    const convertedProperty = convertSchema(propertySchema, root2, [
      ...options.path,
      "properties",
      key2
    ]);
    setOwnShapeProperty(shape, key2, requiredKeys.has(key2) ? convertedProperty : S.Optional(convertedProperty));
  }
  return applyMetadata(S.Object(shape, {
    ...typeof normalizedSchema.schema.additionalProperties === "boolean" ? { additionalProperties: normalizedSchema.schema.additionalProperties } : {}
  }), normalizedSchema.schema, {
    nullable: options.nullable ?? normalizedSchema.nullable
  });
}
function setOwnShapeProperty(shape, key2, value) {
  Object.defineProperty(shape, key2, {
    configurable: true,
    enumerable: true,
    writable: true,
    value
  });
}
function createCommonOptions(schema, nullable, defaultValue) {
  return {
    ...schema.description === void 0 ? {} : { description: schema.description },
    ...defaultValue === void 0 ? {} : { default: defaultValue },
    ...nullable ? { nullable: true } : {}
  };
}
function applyMetadata(schema, source, overrides) {
  const result = { ...schema };
  const description = overrides.description ?? source.description;
  const hasDefaultOverride = Object.prototype.hasOwnProperty.call(overrides, "default");
  const defaultValue = hasDefaultOverride ? overrides.default : source.default;
  if (description !== void 0) {
    result.description = description;
  }
  if (defaultValue !== void 0) {
    result.default = defaultValue;
  }
  if (overrides.nullable === true) {
    result.nullable = true;
  }
  return result;
}
function normalizeNullability(schema) {
  if (!Array.isArray(schema.type)) {
    return {
      schema,
      nullable: schema.nullable === true
    };
  }
  const nextTypes = schema.type.filter((value) => value !== "null");
  if (nextTypes.length === schema.type.length) {
    return {
      schema,
      nullable: schema.nullable === true
    };
  }
  return {
    schema: {
      ...schema,
      type: nextTypes.length === 0 ? void 0 : nextTypes.length === 1 ? nextTypes[0] : nextTypes,
      nullable: void 0
    },
    nullable: true
  };
}
function getComposition(schema) {
  if (schema.oneOf !== void 0) {
    return { keyword: "oneOf", branches: schema.oneOf };
  }
  if (schema.anyOf !== void 0) {
    return { keyword: "anyOf", branches: schema.anyOf };
  }
  if (schema.allOf !== void 0) {
    return { keyword: "allOf", branches: schema.allOf };
  }
  return void 0;
}
function formatJsonSchemaPath(path10) {
  if (path10.length === 0) {
    return "#";
  }
  return `#/${path10.map(escapeJsonPointerSegment).join("/")}`;
}
function formatJsonSchemaType(type) {
  return Array.isArray(type) ? JSON.stringify(type) : String(type);
}
function describeObjectSchemaKind(schema) {
  const type = schema.type;
  if (typeof type === "string") {
    return type;
  }
  return type === void 0 ? "unknown" : JSON.stringify(type);
}
function isRecordSchema(schema) {
  const propertyKeys = Object.keys(schema.properties ?? {});
  return schema.type === "object" && propertyKeys.length === 0 && typeof schema.additionalProperties === "object" && schema.additionalProperties !== null;
}
function findDiscriminator(branches, root2, path10) {
  const [firstBranch] = branches;
  if (firstBranch === void 0) {
    throw new Error(`JSON Schema "${formatJsonSchemaPath(path10)}" uses oneOf/anyOf/allOf but has no branches.`);
  }
  const candidateKeys = Object.keys(firstBranch.properties ?? {});
  for (const candidate of candidateKeys) {
    const values = [];
    let matches = true;
    for (const branch of branches) {
      const requiredKeys = new Set(branch.required ?? []);
      if (!requiredKeys.has(candidate)) {
        matches = false;
        break;
      }
      const literal = getDiscriminatorLiteral(branch, candidate, root2);
      if (literal === void 0) {
        matches = false;
        break;
      }
      values.push(literal);
    }
    if (matches && new Set(values).size === values.length) {
      return candidate;
    }
  }
  return void 0;
}
function getDiscriminatorLiteral(branch, key2, root2) {
  const propertySchema = branch.properties?.[key2];
  if (propertySchema === void 0) {
    return void 0;
  }
  const resolvedProperty = resolveReferencedSchema(propertySchema, root2, []);
  if (typeof resolvedProperty.const === "string") {
    return resolvedProperty.const;
  }
  if (resolvedProperty.enum !== void 0 && resolvedProperty.enum.length === 1 && typeof resolvedProperty.enum[0] === "string") {
    return resolvedProperty.enum[0];
  }
  return void 0;
}
function resolveReferencedSchema(schema, root2, path10) {
  if (schema.$ref === void 0) {
    return schema;
  }
  const resolvedTarget = resolveLocalRef(root2, schema.$ref);
  if (resolvedTarget === void 0) {
    throw new Error(`JSON Schema "${formatJsonSchemaPath(path10)}" uses "$ref": ${schema.$ref}. toolcraft only supports internal refs like "#/components/schemas/Foo".`);
  }
  const { $ref: ignoredRef, ...siblingKeywords } = schema;
  void ignoredRef;
  const resolvedSchema = resolveReferencedSchema(resolvedTarget, root2, path10);
  if (Object.keys(siblingKeywords).length === 0) {
    return resolvedSchema;
  }
  return mergeJsonSchemas(resolvedSchema, siblingKeywords);
}
function mergeJsonSchemas(base, overlay) {
  const mergedProperties = base.properties === void 0 && overlay.properties === void 0 ? void 0 : {
    ...base.properties ?? {},
    ...overlay.properties ?? {}
  };
  const mergedDefs = base.$defs === void 0 && overlay.$defs === void 0 ? void 0 : {
    ...base.$defs ?? {},
    ...overlay.$defs ?? {}
  };
  const mergedRequired = base.required === void 0 && overlay.required === void 0 ? void 0 : [.../* @__PURE__ */ new Set([...base.required ?? [], ...overlay.required ?? []])];
  return {
    ...base,
    ...overlay,
    ...mergedDefs === void 0 ? {} : { $defs: mergedDefs },
    ...mergedProperties === void 0 ? {} : { properties: mergedProperties },
    ...mergedRequired === void 0 ? {} : { required: mergedRequired }
  };
}
function hasSelfReferencingRef(schema, root2, path10 = "#", activePaths = /* @__PURE__ */ new Set()) {
  const nextActivePaths = new Set(activePaths);
  nextActivePaths.add(path10);
  const localRefPath = getLocalRefPath(schema.$ref);
  if (localRefPath !== void 0) {
    if (nextActivePaths.has(localRefPath)) {
      return true;
    }
    const target = resolveLocalRef(root2, localRefPath);
    if (target !== void 0 && hasSelfReferencingRef(target, root2, localRefPath, nextActivePaths)) {
      return true;
    }
  }
  if (schema.items !== void 0 && hasSelfReferencingRef(schema.items, root2, `${path10}/items`, nextActivePaths)) {
    return true;
  }
  if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null && hasSelfReferencingRef(schema.additionalProperties, root2, `${path10}/additionalProperties`, nextActivePaths)) {
    return true;
  }
  for (const [key2, childSchema] of Object.entries(schema.properties ?? {})) {
    if (hasSelfReferencingRef(childSchema, root2, `${path10}/properties/${escapeJsonPointerSegment(key2)}`, nextActivePaths)) {
      return true;
    }
  }
  for (const [key2, childSchema] of Object.entries(schema.$defs ?? {})) {
    if (hasSelfReferencingRef(childSchema, root2, `${path10}/$defs/${escapeJsonPointerSegment(key2)}`, nextActivePaths)) {
      return true;
    }
  }
  for (const [index, childSchema] of (schema.oneOf ?? []).entries()) {
    if (hasSelfReferencingRef(childSchema, root2, `${path10}/oneOf/${index}`, nextActivePaths)) {
      return true;
    }
  }
  for (const [index, childSchema] of (schema.anyOf ?? []).entries()) {
    if (hasSelfReferencingRef(childSchema, root2, `${path10}/anyOf/${index}`, nextActivePaths)) {
      return true;
    }
  }
  for (const [index, childSchema] of (schema.allOf ?? []).entries()) {
    if (hasSelfReferencingRef(childSchema, root2, `${path10}/allOf/${index}`, nextActivePaths)) {
      return true;
    }
  }
  return false;
}
function getLocalRefPath(ref) {
  if (ref === void 0) {
    return void 0;
  }
  if (ref === "#") {
    return "#";
  }
  return ref.startsWith("#/") ? ref : void 0;
}
function resolveLocalRef(root2, ref) {
  const path10 = getLocalRefPath(ref);
  if (path10 === void 0) {
    return void 0;
  }
  if (path10 === "#") {
    return root2;
  }
  const segments = path10.slice(2).split("/").map(unescapeJsonPointerSegment);
  let current = root2;
  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = parseArrayIndex(segment);
      if (index === void 0) {
        return void 0;
      }
      current = current[index];
      continue;
    }
    if (!isPlainObject(current)) {
      return void 0;
    }
    if (!Object.prototype.hasOwnProperty.call(current, segment)) {
      return void 0;
    }
    current = current[segment];
  }
  return isPlainObject(current) ? current : void 0;
}
function appendDescription(description, addition) {
  if (addition === void 0 || addition.length === 0) {
    return description;
  }
  if (description === void 0 || description.length === 0) {
    return addition;
  }
  return `${description} ${addition}`;
}
function isPrimitiveEnumValue(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function getStringDefault(value) {
  return typeof value === "string" ? value : void 0;
}
function getNumberDefault(value) {
  return typeof value === "number" ? value : void 0;
}
function getIntegerDefault(value) {
  return typeof value === "number" && Number.isInteger(value) ? value : void 0;
}
function getBooleanDefault(value) {
  return typeof value === "boolean" ? value : void 0;
}
function getArrayDefault(value) {
  return Array.isArray(value) && value.every((item) => isJsonValue2(item)) ? value : void 0;
}
function getPrimitiveEnumDefault(value, candidates) {
  return isPrimitiveEnumValue(value) && candidates.includes(value) ? value : void 0;
}
function getJsonDefault(value) {
  return isJsonValue2(value) ? value : void 0;
}
function isJsonValue2(value) {
  if (value === null) {
    return true;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every((item) => isJsonValue2(item));
  }
  if (!isPlainObject(value)) {
    return false;
  }
  return Object.values(value).every((item) => isJsonValue2(item));
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function escapeJsonPointerSegment(value) {
  return value.split("~").join("~0").split("/").join("~1");
}
function unescapeJsonPointerSegment(value) {
  return value.split("~1").join("/").split("~0").join("~");
}
function parseArrayIndex(value) {
  if (value.length === 0) {
    return void 0;
  }
  for (const char of value) {
    if (char < "0" || char > "9") {
      return void 0;
    }
  }
  return Number.parseInt(value, 10);
}

// node_modules/toolcraft/dist/mcp-proxy.js
var GROUP_CONFIG_SYMBOL_DESCRIPTION = "toolcraft.group.config";
var MCP_PROXY_SCHEMA_URL = "https://poe-platform.github.io/poe-code/schemas/toolcraft/mcp-proxy.schema.json";
var DEFAULT_CLIENT_INFO = {
  name: "toolcraft",
  version: "0.0.1"
};
var proxyNodeSymbol = Symbol("toolcraft.mcpProxyNode");
var proxyConnectionSymbol = Symbol("toolcraft.mcpProxyConnection");
var shutdownDisposers = /* @__PURE__ */ new Set();
function getInternalGroupConfig2(group) {
  const symbol2 = Object.getOwnPropertySymbols(group).find((candidate) => candidate.description === GROUP_CONFIG_SYMBOL_DESCRIPTION);
  if (symbol2 === void 0) {
    return {};
  }
  return group[symbol2] ?? {};
}
function isProxyNode(node) {
  return node[proxyNodeSymbol] === true;
}
function markProxyNode(node) {
  Object.defineProperty(node, proxyNodeSymbol, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false
  });
  return node;
}
function cloneSecrets2(secrets) {
  return { ...secrets };
}
function cloneScope2(scope) {
  return scope === void 0 ? void 0 : [...scope];
}
function registerShutdownDispose(dispose) {
  shutdownDisposers.add(dispose);
}
function getProxyConnection(group) {
  return group[proxyConnectionSymbol];
}
function setProxyConnection(group, connection) {
  group[proxyConnectionSymbol] = connection;
}
function createProxyGroup(parent, name) {
  return markProxyNode({
    kind: "group",
    name,
    description: void 0,
    aliases: [],
    scope: cloneScope2(parent.scope),
    secrets: cloneSecrets2(parent.secrets),
    requires: parent.requires,
    children: [],
    default: void 0
  });
}
function createProxyCommand(parent, tool, commandName, connection) {
  const params = convertJsonSchema(tool.inputSchema);
  if (params.kind !== "object") {
    throw new Error(`upstream tool "${tool.name}" must define an object input schema`);
  }
  const result = tool.outputSchema === void 0 ? void 0 : convertJsonSchema(tool.outputSchema);
  if (result !== void 0 && result.kind !== "object") {
    throw new Error(`upstream tool "${tool.name}" must define an object output schema`);
  }
  return markProxyNode({
    kind: "command",
    name: commandName,
    description: tool.description,
    hidden: false,
    examples: [],
    aliases: [],
    positional: [],
    params,
    ...result === void 0 ? {} : { result },
    secrets: cloneSecrets2(parent.secrets),
    scope: cloneScope2(parent.scope) ?? ["cli", "sdk"],
    confirm: false,
    requires: parent.requires,
    handler: async (ctx) => {
      const client = await ensureConnected(connection);
      const toolResult = await client.callTool({
        name: tool.name,
        arguments: ctx.params
      });
      if (result === void 0) {
        return toolResult;
      }
      if (toolResult.structuredContent === void 0) {
        throw new Error(`upstream tool "${tool.name}" declared outputSchema but returned no structuredContent`);
      }
      return toolResult.structuredContent;
    },
    render: void 0
  });
}
function removeProxyChildren(group) {
  group.children = group.children.filter((child) => !isProxyNode(child));
  for (const child of group.children) {
    if (child.kind === "group") {
      removeProxyChildren(child);
    }
  }
}
function findChild(group, name) {
  return group.children.find((child) => child.name === name);
}
function filterAllowlistedTools(tools, allowlist) {
  if (allowlist === void 0) {
    return tools;
  }
  const allowedNames = new Set(allowlist);
  return tools.filter((tool) => allowedNames.has(tool.name));
}
function validateRenameMap2(name, tools, rename4) {
  if (rename4 === void 0) {
    return;
  }
  const toolNames = new Set(tools.map((tool) => tool.name));
  for (const upstreamToolName of Object.keys(rename4)) {
    if (!toolNames.has(upstreamToolName)) {
      throw new Error(`couldn't discover MCP ${name}: rename references unknown upstream tool "${upstreamToolName}"`);
    }
  }
}
function createConnection(name, config2) {
  const connection = {
    name,
    config: config2,
    async dispose() {
      shutdownDisposers.delete(connection.dispose);
      connection.connecting = void 0;
      if (connection.client === void 0) {
        return;
      }
      const client = connection.client;
      connection.client = void 0;
      await client.close();
    }
  };
  registerShutdownDispose(connection.dispose);
  return connection;
}
async function ensureConnected(connection) {
  if (connection.client !== void 0 && connection.client.state === "ready") {
    return connection.client;
  }
  if (connection.connecting !== void 0) {
    return connection.connecting;
  }
  connection.connecting = dialUpstream(connection.name, connection.config).then((client) => {
    connection.client = client;
    return client;
  }).finally(() => {
    connection.connecting = void 0;
  });
  return connection.connecting;
}
async function readCache(cachePath) {
  try {
    await assertCachePathHasNoSymlinks(cachePath);
    const raw = await readFile2(cachePath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || !Array.isArray(parsed.tools) || parsed.upstream === void 0 || typeof parsed.upstream.name !== "string" || typeof parsed.upstream.version !== "string") {
      return void 0;
    }
    return {
      $schema: typeof parsed.$schema === "string" ? parsed.$schema : MCP_PROXY_SCHEMA_URL,
      fetchedAt: typeof parsed.fetchedAt === "string" ? parsed.fetchedAt : (/* @__PURE__ */ new Date(0)).toISOString(),
      tools: parsed.tools,
      upstream: parsed.upstream,
      configFingerprint: typeof parsed.configFingerprint === "string" ? parsed.configFingerprint : void 0,
      version: parsed.version === 1 ? 1 : 1
    };
  } catch (error3) {
    if (hasOwnErrorCode(error3, "ENOENT") || error3 instanceof SyntaxError) {
      return void 0;
    }
    return void 0;
  }
}
async function writeCache(cachePath, cache) {
  const directory = path7.dirname(cachePath);
  const tempPath = `${cachePath}.tmp-${randomUUID3()}`;
  let tempCreated = false;
  await assertCachePathHasNoSymlinks(cachePath);
  await assertCachePathHasNoSymlinks(tempPath);
  await mkdir(directory, { recursive: true });
  await assertCachePathHasNoSymlinks(directory);
  try {
    await writeFile2(tempPath, `${JSON.stringify(cache, null, 2)}
`, {
      encoding: "utf8",
      flag: "wx"
    });
    tempCreated = true;
    await assertCachePathHasNoSymlinks(tempPath);
    await assertCachePathHasNoSymlinks(cachePath);
    await rename2(tempPath, cachePath);
    tempCreated = false;
  } catch (error3) {
    if (tempCreated || !isAlreadyExistsError2(error3)) {
      await unlink2(tempPath).catch(() => void 0);
    }
    throw error3;
  }
}
function isAlreadyExistsError2(error3) {
  return hasOwnErrorCode(error3, "EEXIST");
}
async function fetchCache(name, config2) {
  const logger2 = createLogger((message2) => {
    process.stderr.write(`${message2}
`);
  });
  logger2.info(`MCP ${name}: connecting`);
  const client = await dialUpstream(name, config2);
  try {
    logger2.info(`MCP ${name}: listing tools`);
    const tools = [];
    let cursor2;
    do {
      const page = await client.listTools(cursor2 === void 0 ? {} : { cursor: cursor2 });
      tools.push(...page.tools);
      cursor2 = page.nextCursor;
    } while (cursor2 !== void 0);
    logger2.info(`MCP ${name}: found ${tools.length} tools`);
    const upstream = client.serverInfo ?? {
      name,
      version: "unknown"
    };
    const cache = {
      $schema: MCP_PROXY_SCHEMA_URL,
      version: 1,
      upstream,
      configFingerprint: fingerprintMcpServerConfig(config2),
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tools
    };
    return cache;
  } finally {
    await client.close();
  }
}
function populateGroupFromTools(group, tools, rename4, connection) {
  removeProxyChildren(group);
  for (const tool of tools) {
    const targetPath = rename4?.[tool.name] ?? tool.name;
    const segments = rename4 !== void 0 && Object.prototype.hasOwnProperty.call(rename4, tool.name) ? targetPath.split(".") : [tool.name];
    const commandName = segments[segments.length - 1];
    if (commandName === void 0 || commandName.length === 0) {
      throw new Error(`command path "${targetPath}" collides with an existing child`);
    }
    let parent = group;
    for (const segment of segments.slice(0, -1)) {
      const existing = findChild(parent, segment);
      if (existing === void 0) {
        const created = createProxyGroup(parent, segment);
        parent.children.push(created);
        parent = created;
        continue;
      }
      if (existing.kind !== "group") {
        throw new Error(`command path "${targetPath}" collides with an existing child`);
      }
      parent = existing;
    }
    if (findChild(parent, commandName) !== void 0) {
      throw new Error(`command path "${targetPath}" collides with an existing child`);
    }
    parent.children.push(createProxyCommand(parent, tool, commandName, connection));
  }
}
function replaceProxyChildrenSafely(group, tools, rename4, connection) {
  const previousChildren = snapshotGroupChildren(group);
  try {
    populateGroupFromTools(group, tools, rename4, connection);
  } catch (error3) {
    for (const [capturedGroup, children] of previousChildren) {
      capturedGroup.children = children;
    }
    throw error3;
  }
}
function snapshotGroupChildren(group) {
  const snapshot = /* @__PURE__ */ new Map();
  const visit = (current) => {
    snapshot.set(current, [...current.children]);
    for (const child of current.children) {
      if (child.kind === "group") {
        visit(child);
      }
    }
  };
  visit(group);
  return snapshot;
}
function isRefreshRequested(name, refresh) {
  if (refresh === "all") {
    return true;
  }
  return refresh?.has(name) === true;
}
async function resolveSingleProxy(group, options) {
  const internal = getInternalGroupConfig2(group);
  const config2 = internal.mcp;
  if (config2 === void 0) {
    return;
  }
  const name = group.name;
  try {
    const cachePath = resolveCachePath(name, options.projectRoot);
    const refresh = parseRefreshEnv(process.env.TOOLCRAFT_MCP_REFRESH);
    let cache;
    let shouldWriteCache = false;
    if (isRefreshRequested(name, refresh)) {
      cache = await fetchCache(name, config2);
      shouldWriteCache = true;
    } else {
      const storedCache = await readCache(cachePath);
      if (storedCache && cacheMatchesConfig(storedCache, config2)) {
        cache = storedCache;
      } else {
        cache = await fetchCache(name, config2);
        shouldWriteCache = true;
      }
    }
    const tools = filterAllowlistedTools(cache.tools, internal.tools);
    validateRenameMap2(name, tools, internal.rename);
    const previousConnection = getProxyConnection(group);
    const nextConnection = createConnection(name, config2);
    try {
      replaceProxyChildrenSafely(group, tools, internal.rename, nextConnection);
      if (shouldWriteCache) {
        await writeCache(cachePath, cache);
        createLogger((message2) => process.stderr.write(`${message2}
`)).info(`MCP ${name}: wrote ${cachePath}`);
      }
      setProxyConnection(group, nextConnection);
    } catch (error3) {
      await nextConnection.dispose();
      throw error3;
    }
    if (previousConnection !== void 0 && previousConnection !== nextConnection) {
      await previousConnection.dispose();
    }
  } catch (error3) {
    if (error3 instanceof Error && error3.message.startsWith(`couldn't discover MCP ${name}:`)) {
      throw error3;
    }
    throw new Error(`couldn't discover MCP ${name}: ${error3 instanceof Error ? error3.message : String(error3)}`);
  }
}
function cacheMatchesConfig(cache, config2) {
  return cache.configFingerprint === fingerprintMcpServerConfig(config2);
}
function fingerprintMcpServerConfig(config2) {
  return createHash("sha256").update(JSON.stringify(config2)).digest("hex");
}
function collectProxyGroups(root2) {
  const groups = [];
  function visit(group) {
    if (getInternalGroupConfig2(group).mcp !== void 0) {
      groups.push(group);
    }
    for (const child of group.children) {
      if (child.kind === "group") {
        visit(child);
      }
    }
  }
  visit(root2);
  return groups;
}
function findProjectRoot(from = process.cwd()) {
  let current = process.cwd();
  if (from !== current) {
    current = path7.resolve(from);
  }
  while (true) {
    if (existsSync2(path7.join(current, "package.json"))) {
      return current;
    }
    const parent = path7.dirname(current);
    if (parent === current) {
      return void 0;
    }
    current = parent;
  }
}
function resolveCachePath(name, projectRoot) {
  const resolvedProjectRoot = projectRoot ?? findProjectRoot();
  if (resolvedProjectRoot === void 0) {
    throw new Error(`Could not find package.json above "${process.cwd()}" while resolving MCP cache path.`);
  }
  if (name.length === 0 || name === "." || name === ".." || name.includes("/") || name.includes("\\")) {
    throw new Error(`MCP proxy group name must be a file-safe name: "${name}".`);
  }
  return path7.join(resolvedProjectRoot, ".toolcraft", "mcp", `${name}.json`);
}
async function assertCachePathHasNoSymlinks(filePath) {
  let currentPath = filePath;
  while (true) {
    try {
      if ((await lstat2(currentPath)).isSymbolicLink()) {
        throw new Error(`MCP cache path must not contain symbolic links: ${currentPath}.`);
      }
    } catch (error3) {
      if (!hasOwnErrorCode(error3, "ENOENT")) {
        throw error3;
      }
    }
    if (path7.basename(currentPath) === ".toolcraft") {
      return;
    }
    const parentPath = path7.dirname(currentPath);
    if (parentPath === currentPath) {
      return;
    }
    currentPath = parentPath;
  }
}
function parseRefreshEnv(value) {
  const trimmed = value?.trim();
  if (trimmed === void 0 || trimmed.length === 0) {
    return void 0;
  }
  if (trimmed === "1" || trimmed === "true") {
    return "all";
  }
  const names = trimmed.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  return names.length === 0 ? void 0 : new Set(names);
}
async function dialUpstream(name, config2) {
  const client = new McpClient({
    clientInfo: {
      name: `${DEFAULT_CLIENT_INFO.name}-${name}`,
      version: DEFAULT_CLIENT_INFO.version
    }
  });
  const transport = config2.transport === "stdio" ? new StdioTransport({
    command: config2.command,
    ...config2.args === void 0 ? {} : { args: config2.args },
    ...config2.env === void 0 ? {} : { env: config2.env }
  }) : new HttpTransport({
    url: config2.url,
    ...config2.headers === void 0 ? {} : { headers: config2.headers }
  });
  await client.connect(transport);
  return client;
}
async function resolveMcpProxies(root2, options = {}) {
  const groups = collectProxyGroups(root2);
  await Promise.all(groups.map((group) => resolveSingleProxy(group, options)));
}

// node_modules/toolcraft/dist/redaction.js
var REDACTED_VALUE = "<redacted>";
var SENSITIVE_NAME_PARTS = ["password", "token", "apikey", "secret"];
var AUTHORIZATION_HEADER_NAMES = /* @__PURE__ */ new Set(["authorization", "proxyauthorization"]);
var SECRET_HEADER_NAMES = /* @__PURE__ */ new Set(["cookie", "setcookie"]);
function isPlainObject2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function isSensitiveName(name) {
  const normalized = normalizeName(name);
  return SENSITIVE_NAME_PARTS.some((candidate) => normalized.includes(candidate));
}
function redactSecretLikeFieldsValue(value, name, seen) {
  if (name.length > 0 && isSensitiveName(name)) {
    return REDACTED_VALUE;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    return value.map((entry) => redactSecretLikeFieldsValue(entry, name, seen));
  }
  if (isPlainObject2(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    return Object.fromEntries(Object.entries(value).map(([key2, entry]) => [
      key2,
      redactSecretLikeFieldsValue(entry, key2, seen)
    ]));
  }
  return value;
}
function redactSecretLikeFields(value, name = "") {
  return redactSecretLikeFieldsValue(value, name, /* @__PURE__ */ new WeakSet());
}
function parseJsonObjectOrArray(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(trimmed);
    return isPlainObject2(parsed) || Array.isArray(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function redactHttpBody(body) {
  if (typeof body === "string") {
    const parsed = parseJsonObjectOrArray(body);
    return parsed === void 0 ? body : redactSecretLikeFields(parsed);
  }
  return redactSecretLikeFields(body);
}
function redactHttpHeaderValue(name, value) {
  const normalized = normalizeName(name);
  if (AUTHORIZATION_HEADER_NAMES.has(normalized)) {
    return "Bearer ****";
  }
  if (SECRET_HEADER_NAMES.has(normalized) || isSensitiveName(name)) {
    return REDACTED_VALUE;
  }
  return value;
}

// node_modules/toolcraft/dist/error-report.js
var ERROR_REPORTS_ENV = "TOOLCRAFT_ERROR_REPORTS";
function isPlainObject3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function unwrapOptional(schema) {
  if (schema.kind === "optional") {
    return unwrapOptional(schema.inner);
  }
  return schema;
}
function hasHttpContext(error3) {
  return error3 instanceof Error && error3.name === "HttpError" && isPlainObject3(error3.request) && isPlainObject3(error3.response);
}
function isSkippedError(error3) {
  if (error3 instanceof ApprovalDeclinedError) {
    return true;
  }
  if (error3 instanceof CommanderError && (error3.code === "commander.helpDisplayed" || error3.code === "commander.version")) {
    return true;
  }
  return error3 instanceof UserError && error3.cause === void 0 && !hasHttpContext(error3);
}
function reportsEnabled(option, env) {
  if (env[ERROR_REPORTS_ENV] === "1") {
    return true;
  }
  return option !== void 0 && option !== false;
}
function resolveReportDir(option, projectRoot) {
  const configuredDir = typeof option === "object" ? option.dir : void 0;
  if (configuredDir === void 0 || configuredDir.length === 0) {
    return path8.join(projectRoot, ".toolcraft", "errors");
  }
  return path8.isAbsolute(configuredDir) ? configuredDir : path8.join(projectRoot, configuredDir);
}
function reportDirMustStayWithinProject(option) {
  const configuredDir = typeof option === "object" ? option.dir : void 0;
  return configuredDir === void 0 || configuredDir.length === 0 || !path8.isAbsolute(configuredDir);
}
function isWithinDirectory(parent, child) {
  const relative = path8.relative(parent, child);
  return relative === "" || !path8.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path8.sep}`);
}
async function assertReportDirWithinProject(projectRoot, reportDir) {
  if (!isWithinDirectory(path8.resolve(projectRoot), path8.resolve(reportDir))) {
    throw new Error("Error report directory resolves outside project root.");
  }
  const [canonicalProjectRoot, canonicalReportDir] = await Promise.all([
    realpath(projectRoot),
    realpath(reportDir)
  ]);
  if (!isWithinDirectory(canonicalProjectRoot, canonicalReportDir)) {
    throw new Error("Error report directory resolves outside project root.");
  }
}
function resolveProjectRoot(projectRoot) {
  if (projectRoot !== void 0) {
    return projectRoot;
  }
  return findProjectRoot() ?? os.tmpdir();
}
function formatTimestamp(date) {
  const isoMinute = date.toISOString().slice(0, 16);
  const colonIndex = isoMinute.indexOf(":");
  if (colonIndex === -1) {
    return isoMinute;
  }
  return `${isoMinute.slice(0, colonIndex)}${isoMinute.slice(colonIndex + 1)}`;
}
function slugifyCommandPath(commandPath) {
  const source = commandPath === void 0 || commandPath.length === 0 ? "root" : commandPath;
  let output = "";
  let previousWasDash = false;
  for (const char of source) {
    const lower = char.toLowerCase();
    const isWord = lower >= "a" && lower <= "z" || lower >= "0" && lower <= "9";
    if (isWord) {
      output += lower;
      previousWasDash = false;
      continue;
    }
    if (!previousWasDash) {
      output += "-";
      previousWasDash = true;
    }
  }
  while (output.startsWith("-")) {
    output = output.slice(1);
  }
  while (output.endsWith("-")) {
    output = output.slice(0, -1);
  }
  return output.length === 0 ? "root" : output;
}
function relativeDisplayPath(projectRoot, absolutePath) {
  const relative = path8.relative(projectRoot, absolutePath);
  return relative.length === 0 || relative.startsWith("..") ? absolutePath : relative;
}
function redactValue(value) {
  if (value === void 0) {
    return "<unset>";
  }
  return `<set, ${value.length} chars>`;
}
function collectStringLeaves(value, output) {
  if (typeof value === "string") {
    if (value.length > 0) {
      output.add(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      collectStringLeaves(entry, output);
    }
    return;
  }
  if (isPlainObject3(value)) {
    for (const entry of Object.values(value)) {
      collectStringLeaves(entry, output);
    }
  }
}
function schemaSecretValue(schema) {
  const unwrapped = unwrapOptional(schema);
  if (unwrapped.kind === "string" || unwrapped.kind === "number") {
    return unwrapped.secret;
  }
  return void 0;
}
function shouldRedactParam(name, schema) {
  const secret = schemaSecretValue(schema);
  if (secret !== void 0) {
    return secret;
  }
  return isSensitiveName(name);
}
function redactParamsValue(value, schema, name) {
  if (shouldRedactParam(name, schema)) {
    return "<redacted>";
  }
  const unwrapped = unwrapOptional(schema);
  if (unwrapped.kind === "object" && isPlainObject3(value)) {
    return Object.fromEntries(Object.entries(value).map(([key2, childValue]) => {
      const childSchema = unwrapped.shape[key2];
      return [
        key2,
        childSchema === void 0 ? childValue : redactParamsValue(childValue, childSchema, key2)
      ];
    }));
  }
  if (unwrapped.kind === "array" && Array.isArray(value)) {
    return value.map((entry) => redactParamsValue(entry, unwrapped.item, name));
  }
  return value;
}
function redactParams(params, command) {
  if (command === void 0) {
    return params;
  }
  return redactParamsValue(params, command.params, "");
}
function collectSensitiveParamValues(value, schema, name, output) {
  if (shouldRedactParam(name, schema)) {
    collectStringLeaves(value, output);
    return;
  }
  const unwrapped = unwrapOptional(schema);
  if (unwrapped.kind === "object" && isPlainObject3(value)) {
    for (const [key2, childValue] of Object.entries(value)) {
      const childSchema = unwrapped.shape[key2];
      if (childSchema !== void 0) {
        collectSensitiveParamValues(childValue, childSchema, key2, output);
      }
    }
    return;
  }
  if (unwrapped.kind === "array" && Array.isArray(value)) {
    for (const entry of value) {
      collectSensitiveParamValues(entry, unwrapped.item, name, output);
    }
  }
}
function createReportStringRedactor(context, env) {
  const values = /* @__PURE__ */ new Set();
  for (const value of Object.values(context.secrets ?? {})) {
    if (value !== void 0 && value.length > 0) {
      values.add(value);
    }
  }
  for (const [name, secret] of Object.entries(context.command?.secrets ?? {})) {
    const value = context.secrets?.[name] ?? env[secret.env];
    if (value !== void 0 && value.length > 0) {
      values.add(value);
    }
  }
  if (context.command !== void 0) {
    collectSensitiveParamValues(context.params, context.command.params, "", values);
  }
  const orderedValues = [...values].sort((left, right) => right.length - left.length);
  return (value) => {
    let redacted = value;
    for (const secretValue of orderedValues) {
      redacted = redacted.split(secretValue).join("<redacted>");
    }
    return redacted;
  };
}
function commandSecretEnvNames(secrets) {
  if (secrets === void 0) {
    return [];
  }
  return Object.values(secrets).map((secret) => secret.env);
}
function redactArgv(argv, options) {
  if (argv === void 0) {
    return [];
  }
  const secretValues = new Set(Object.values(options.secrets ?? {}).filter((value) => value !== void 0 && value.length > 0));
  const secretNames = /* @__PURE__ */ new Set([
    ...Object.keys(options.secrets ?? {}),
    ...commandSecretEnvNames(options.command?.secrets)
  ]);
  const output = [];
  let redactNext = false;
  for (const arg of argv) {
    if (redactNext) {
      output.push("<redacted>");
      redactNext = false;
      continue;
    }
    const equalsIndex = arg.indexOf("=");
    const optionName = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
    const normalizedOptionName = optionName.replaceAll("-", "");
    const sensitiveByName = isSensitiveName(normalizedOptionName) || [...secretNames].some((name) => normalizedOptionName.toLowerCase().includes(name.toLowerCase()));
    if (equalsIndex !== -1 && sensitiveByName) {
      output.push(`${optionName}=<redacted>`);
      continue;
    }
    if (arg.startsWith("-") && sensitiveByName) {
      output.push(arg);
      redactNext = true;
      continue;
    }
    let redactedArg = arg;
    for (const secretValue of secretValues) {
      redactedArg = redactedArg.split(secretValue).join("<redacted>");
    }
    output.push(redactedArg);
  }
  return output;
}
function stableJson(value) {
  return JSON.stringify(value, null, 2) ?? "undefined";
}
function redactStructuredErrorField(name, value, redactString) {
  if (typeof value === "string") {
    const redactedHeaderValue = redactHttpHeaderValue(name, value);
    if (redactedHeaderValue !== value) {
      return redactedHeaderValue;
    }
    if (isSensitiveName(name)) {
      return "<redacted>";
    }
    return redactString(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => redactStructuredErrorField(name, entry, redactString));
  }
  if (isPlainObject3(value)) {
    return Object.fromEntries(Object.entries(value).map(([key2, entry]) => [
      key2,
      redactStructuredErrorField(key2, entry, redactString)
    ]));
  }
  return value;
}
function ownStructuredFields(error3, redactString) {
  const fields = {};
  for (const key2 of Object.keys(error3)) {
    if (key2 === "name" || key2 === "message" || key2 === "stack" || key2 === "cause") {
      continue;
    }
    Object.defineProperty(fields, key2, {
      value: redactStructuredErrorField(key2, error3[key2], redactString),
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  return fields;
}
function formatStackChain(error3, redactString) {
  const lines = [];
  let current = error3;
  let index = 0;
  while (current !== void 0) {
    if (current instanceof Error) {
      const stack = current.stack ?? String(current);
      lines.push(redactString(index === 0 ? stack : `Caused by: ${stack}`));
      current = current.cause;
    } else {
      const message2 = String(current);
      lines.push(redactString(index === 0 ? message2 : `Caused by: ${message2}`));
      current = void 0;
    }
    index += 1;
  }
  return lines.join("\n");
}
function formatHeaderValue(name, value, redactString) {
  return redactString(redactHttpHeaderValue(name, value));
}
function formatHeaders(headers, redactString) {
  return Object.entries(headers).map(([name, value]) => `${name}: ${formatHeaderValue(name, value, redactString)}`).join("\n");
}
function formatBody(body, redactString) {
  const redactedBody = redactHttpBody(body);
  if (typeof redactedBody === "string") {
    return redactString(redactedBody);
  }
  return redactString(stableJson(redactedBody));
}
function formatHttpTranscript(error3, redactString) {
  const requestLines = [
    `${error3.request.method} ${error3.request.url}`,
    formatHeaders(error3.request.headers, redactString)
  ].filter((line) => line.length > 0);
  if (error3.request.body !== void 0) {
    requestLines.push("", formatBody(error3.request.body, redactString));
  }
  return [
    "Request:",
    ...requestLines,
    "",
    "Response:",
    `${error3.response.status} ${error3.response.statusText}`,
    formatHeaders(error3.response.headers, redactString),
    "",
    formatBody(error3.response.body, redactString)
  ].join("\n");
}
function resolveToolcraftVersion(version) {
  return version ?? findPackageMetadata(new URL("./error-report.ts", import.meta.url))?.version ?? "unknown";
}
function buildReport(context) {
  const env = context.env ?? process.env;
  const error3 = context.error;
  const redactString = createReportStringRedactor(context, env);
  const errorName = error3 instanceof Error ? error3.name : typeof error3;
  const errorMessage = redactString(error3 instanceof Error ? error3.message : String(error3));
  const structuredFields = error3 instanceof Error ? ownStructuredFields(error3, redactString) : {};
  const secretLines = Object.entries(context.command?.secrets ?? {}).map(([name, secret]) => {
    const value = context.secrets?.[name] ?? env[secret.env];
    return `${secret.env}=${redactValue(value)}`;
  });
  const lines = [
    "Toolcraft Error Report",
    "",
    "Runtime",
    `toolcraft version: ${resolveToolcraftVersion(context.version)}`,
    `node version: ${process.version}`,
    `platform: ${process.platform} ${process.arch}`,
    "",
    "Argv",
    redactString(stableJson(redactArgv(context.argv, { command: context.command, secrets: context.secrets }))),
    "",
    "Resolved Secrets",
    ...secretLines.length === 0 ? ["<none>"] : secretLines,
    "",
    "Command Path",
    context.commandPath === void 0 || context.commandPath.length === 0 ? "root" : context.commandPath,
    "",
    "Parsed Params",
    redactString(stableJson(redactParams(context.params, context.command))),
    "",
    "Error",
    `name: ${errorName}`,
    `message: ${errorMessage}`,
    "structured fields:",
    redactString(stableJson(structuredFields)),
    "",
    "Stack",
    formatStackChain(error3, redactString)
  ];
  if (hasHttpContext(error3)) {
    lines.push("", "HTTP Transcript", formatHttpTranscript(error3, redactString));
  }
  return `${lines.join("\n")}
`;
}
async function writeErrorReport(context) {
  const env = context.env ?? process.env;
  if (!reportsEnabled(context.errorReports, env) || isSkippedError(context.error)) {
    return void 0;
  }
  const projectRoot = resolveProjectRoot(context.projectRoot);
  const reportDir = resolveReportDir(context.errorReports, projectRoot);
  const fileName = `${formatTimestamp(/* @__PURE__ */ new Date())}-${slugifyCommandPath(context.commandPath)}-${randomUUID4()}.log`;
  const absolutePath = path8.join(reportDir, fileName);
  await mkdir2(reportDir, { recursive: true });
  if (reportDirMustStayWithinProject(context.errorReports)) {
    await assertReportDirWithinProject(projectRoot, reportDir);
  }
  await writeFile3(absolutePath, buildReport(context));
  return {
    absolutePath,
    displayPath: relativeDisplayPath(projectRoot, absolutePath)
  };
}

// node_modules/toolcraft/dist/number-schema.js
function isValidNumberSchemaValue(value, schema) {
  return typeof value === "number" && Number.isFinite(value) && (schema.jsonType !== "integer" || Number.isInteger(value)) && (schema.minimum === void 0 || value >= schema.minimum) && (schema.maximum === void 0 || value <= schema.maximum);
}
function getExpectedNumberDescription(schema) {
  const type = schema.jsonType === "integer" ? "an integer" : "a number";
  const bounds = [
    schema.minimum === void 0 ? void 0 : `greater than or equal to ${schema.minimum}`,
    schema.maximum === void 0 ? void 0 : `less than or equal to ${schema.maximum}`
  ].filter((bound) => bound !== void 0);
  return bounds.length === 0 ? type : `${type} ${bounds.join(" and ")}`;
}

// node_modules/toolcraft/dist/renderer.js
var import_yaml5 = __toESM(require_dist(), 1);
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isMcpCallToolResult(value) {
  if (!isObject(value)) {
    return false;
  }
  const hasContent = Array.isArray(value.content);
  const hasStructured = value.structuredContent !== void 0;
  if (!hasContent && !hasStructured) {
    return false;
  }
  return Object.keys(value).every((key2) => key2 === "content" || key2 === "structuredContent" || key2 === "isError" || key2 === "_meta");
}
function isMcpTextContent(value) {
  return isObject(value) && value.type === "text" && typeof value.text === "string";
}
function extractMcpPayload(envelope) {
  const structuredContent = envelope.structuredContent;
  if (isObject(structuredContent) && "result" in structuredContent) {
    return structuredContent.result;
  }
  if (structuredContent !== void 0) {
    return structuredContent;
  }
  if (Array.isArray(envelope.content)) {
    const text4 = envelope.content.filter(isMcpTextContent).map((block) => block.text).join("\n");
    return text4.length > 0 ? text4 : void 0;
  }
  return void 0;
}
function unwrapMcpEnvelope(result) {
  if (!isMcpCallToolResult(result)) {
    return { result, mcpError: false };
  }
  return {
    result: extractMcpPayload(result),
    mcpError: result.isError === true
  };
}
function isArrayOfObjects(value) {
  return Array.isArray(value) && value.every((entry) => isObject(entry));
}
function stringifyValue2(value) {
  if (value === void 0) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return stringifyJson(value);
}
function stringifyJson(value, spaces) {
  try {
    return JSON.stringify(value, (_key, currentValue) => typeof currentValue === "bigint" ? currentValue.toString() : currentValue, spaces) ?? String(value);
  } catch {
    return String(value);
  }
}
function humanizeKey(key2) {
  let output = "";
  let capitalizeNext = true;
  for (const char of key2) {
    if (char === "_" || char === "-") {
      output += " ";
      capitalizeNext = false;
      continue;
    }
    if (char >= "A" && char <= "Z" && output.length > 0 && !output.endsWith(" ")) {
      output += " ";
    }
    if (capitalizeNext) {
      output += char.toUpperCase();
      capitalizeNext = false;
      continue;
    }
    output += char;
  }
  return output;
}
function detailRows(result, depth = 0) {
  const rows = [];
  for (const [key2, value] of Object.entries(result)) {
    const label = `${"  ".repeat(depth)}${humanizeKey(key2)}`;
    if (isObject(value)) {
      if (Object.keys(value).length === 0) {
        rows.push({ label, value: "{}" });
        continue;
      }
      rows.push({ label, value: "" });
      rows.push(...detailRows(value, depth + 1));
      continue;
    }
    rows.push({ label, value: displayScalar(value) });
  }
  return rows;
}
function displayScalar(value) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (Array.isArray(value) && value.every((entry) => !isObject(entry) && !Array.isArray(entry))) {
    return value.map((entry) => displayScalar(entry)).join(", ") || "\u2014";
  }
  return stringifyValue2(value) || "\u2014";
}
function isUrl(value) {
  return typeof value === "string" && (value.startsWith("https://") || value.startsWith("http://"));
}
function compactUrl(value) {
  try {
    const url = new URL(value);
    const tail = url.pathname.split("/").filter(Boolean).at(-1);
    return tail ? `${url.hostname}/\u2026/${tail}` : url.hostname;
  } catch {
    return value;
  }
}
function displayRowValue(value) {
  return isUrl(value) ? compactUrl(value) : displayScalar(value);
}
function directScalarRows(result) {
  return Object.entries(result).filter(([, value]) => !isObject(value) && !Array.isArray(value)).map(([key2, value]) => ({ label: humanizeKey(key2), value: displayRowValue(value) }));
}
function directObjectSections(result) {
  return Object.entries(result).filter(([, value]) => isObject(value)).map(([key2, value]) => ({ title: humanizeKey(key2), rows: detailRows(value) })).filter((section) => section.rows.length > 0);
}
function renderObjectCard(result, primitives, title) {
  const scalarRows = directScalarRows(result);
  const nestedSections = directObjectSections(result);
  const listRows = Object.entries(result).filter(([, value]) => Array.isArray(value)).map(([key2, value]) => ({ label: humanizeKey(key2), value: displayScalar(value) }));
  return renderDetailCard({
    theme: primitives.getTheme(),
    title,
    sections: [
      { rows: scalarRows },
      ...nestedSections,
      { title: "Lists", rows: listRows }
    ]
  });
}
function richResultTitle(command) {
  const description = command.description?.trim();
  if (description && !description.includes("\n") && description.length <= 64) {
    return description;
  }
  return command.name ? humanizeKey(command.name) : "Result";
}
function renderObjectMarkdown(result) {
  return Object.entries(result).map(([key2, value]) => `- ${key2}: ${stringifyValue2(value)}`).join("\n");
}
function getColumnNames(rows) {
  const names = /* @__PURE__ */ new Set();
  for (const row of rows) {
    for (const name of Object.keys(row)) {
      names.add(name);
    }
  }
  return [...names];
}
function renderArrayTable(result, primitives) {
  if (result.length === 0) {
    return "[]";
  }
  const columnNames = getColumnNames(result);
  return primitives.renderTable({
    theme: primitives.getTheme(),
    columns: columnNames.map((name) => ({
      name,
      title: name,
      alignment: "left",
      maxLen: Math.max(name.length, ...result.map((row) => Object.prototype.hasOwnProperty.call(row, name) ? stringifyValue2(row[name]).length : 0))
    })),
    rows: result.map((row) => Object.fromEntries(columnNames.map((name) => [
      name,
      Object.prototype.hasOwnProperty.call(row, name) ? stringifyValue2(row[name]) : ""
    ])))
  });
}
function renderArrayMarkdown(result) {
  if (result.length === 0) {
    return "[]";
  }
  const columnNames = getColumnNames(result);
  const header = `| ${columnNames.join(" | ")} |`;
  const separator = `| ${columnNames.map(() => ":---").join(" | ")} |`;
  const rows = result.map((row) => `| ${columnNames.map((name) => Object.prototype.hasOwnProperty.call(row, name) ? stringifyValue2(row[name]).replaceAll("|", "\\|") : "").join(" | ")} |`);
  return [header, separator, ...rows].join("\n");
}
function autoRender(command, result, output, primitives) {
  if (result === null || result === void 0) {
    if (output === "json") {
      return stringifyJson({ ok: true }, 2);
    }
    return "Done.";
  }
  if (typeof result === "string") {
    if (output === "json") {
      return stringifyJson({ result }, 2);
    }
    return result;
  }
  if (output === "rich" && Array.isArray(result) && result.every((value) => typeof value === "string")) {
    return result.join("\n");
  }
  if (isObject(result)) {
    if (output === "md") {
      return renderObjectMarkdown(result);
    }
    if (output === "json") {
      return stringifyJson(result, 2);
    }
    return renderObjectCard(result, primitives, richResultTitle(command));
  }
  if (isArrayOfObjects(result)) {
    if (output === "md") {
      return renderArrayMarkdown(result);
    }
    if (output === "json") {
      return stringifyJson(result, 2);
    }
    return renderArrayTable(result, primitives);
  }
  if (output === "rich") {
    return import_yaml5.default.stringify(result);
  }
  return stringifyJson(result, 2);
}
function renderResult(command, result, output, primitives, write = (chunk, stream = "stdout") => {
  if (stream === "stderr") {
    process.stderr.write(chunk);
    return;
  }
  process.stdout.write(chunk);
}) {
  const unwrapped = unwrapMcpEnvelope(result);
  result = unwrapped.result;
  if (unwrapped.mcpError) {
    const payload2 = autoRender(command, result, output, primitives);
    if (payload2.length > 0) {
      write(`${payload2}
`, "stderr");
    }
    return { mcpError: true };
  }
  if (output === "json" && command.render?.json) {
    const payload2 = command.render.json(result, primitives);
    if (payload2 !== void 0) {
      write(`${stringifyJson(payload2, 2)}
`);
    }
    return { mcpError: false };
  }
  if (output === "md" && command.render?.markdown) {
    const payload2 = command.render.markdown(result, primitives);
    if (typeof payload2 === "string" && payload2.length > 0) {
      write(`${payload2}
`);
    }
    return { mcpError: false };
  }
  if (output === "rich" && command.render?.rich) {
    command.render.rich(result, primitives);
    return { mcpError: false };
  }
  const payload = autoRender(command, result, output, primitives);
  if (payload.length > 0) {
    write(`${payload}
`);
  }
  return { mcpError: false };
}

// node_modules/toolcraft/dist/source-snippet.js
function renderSourceSnippet(opts) {
  const lines = opts.source.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const line = clampInteger(opts.line, 1, Math.max(lines.length, 1));
  const context = Math.max(0, Math.floor(opts.context ?? 2));
  const startLine = Math.max(1, line - context);
  const endLine = Math.min(lines.length, line + context);
  const gutterWidth = String(endLine).length;
  const output = [];
  if (opts.filePath !== void 0) {
    output.push(muted(`--> ${opts.filePath}:${line}${opts.column === void 0 ? "" : `:${Math.max(1, opts.column)}`}`));
  }
  output.push(renderDivider(gutterWidth));
  for (let currentLine = startLine; currentLine <= endLine; currentLine += 1) {
    const sourceLine = lines[currentLine - 1] ?? "";
    output.push(`${muted(String(currentLine).padStart(gutterWidth, " "))} | ${sourceLine}`);
    if (currentLine === line && opts.column !== void 0) {
      const column = Math.max(1, Math.floor(opts.column));
      output.push(`${muted(" ".repeat(gutterWidth))} | ${" ".repeat(column - 1)}${error2("^")}`);
    }
  }
  output.push(renderDivider(gutterWidth));
  return output.join("\n");
}
function renderDivider(gutterWidth) {
  return `${muted(" ".repeat(gutterWidth))} |`;
}
function clampInteger(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.floor(value)));
}
function muted(value) {
  return shouldStyleStderr() ? text.muted(value) : value;
}
function error2(value) {
  return shouldStyleStderr() ? text.error(value) : value;
}
function shouldStyleStderr() {
  return process.stderr.isTTY === true;
}

// node_modules/toolcraft/dist/stack-trim.js
var HIDDEN_FRAME_SUMMARY_PREFIX = "    \u2026 (";
var HIDDEN_FRAME_SUMMARY_SUFFIX = " hidden \u2014 pass --debug=raw to show)";
function enableSourceMaps() {
  process.setSourceMapsEnabled?.(true);
}
function formatDebugStack(stack, mode) {
  return mode === "raw" ? stack : trimStack(stack);
}
function trimStack(stack) {
  const sections = splitStackSections(stack);
  const trimmed = sections.map((section) => trimStackSection(section));
  const hiddenFrameCount = trimmed.reduce((count, section) => count + section.hiddenFrameCount, 0);
  if (hiddenFrameCount === 0) {
    return stack;
  }
  return trimmed.flatMap((section) => section.lines).join("\n");
}
function splitStackSections(stack) {
  const lines = stack.split("\n");
  const firstLine = lines[0];
  if (firstLine === void 0) {
    return [];
  }
  const sections = [{ header: firstLine, lines: [] }];
  for (const line of lines.slice(1)) {
    if (isCauseHeader(line)) {
      sections.push({ header: line, lines: [] });
      continue;
    }
    sections[sections.length - 1]?.lines.push(line);
  }
  return sections;
}
function trimStackSection(section) {
  const userFrames = [];
  const skippedFrames = [];
  for (const line of section.lines) {
    if (isFrameworkOrRuntimeFrame(line)) {
      skippedFrames.push(line);
      continue;
    }
    userFrames.push(line);
  }
  if (skippedFrames.length === 0) {
    return {
      lines: [section.header, ...section.lines],
      hiddenFrameCount: 0
    };
  }
  return {
    lines: [section.header, ...userFrames, formatHiddenFrameSummary(skippedFrames.length)],
    hiddenFrameCount: skippedFrames.length
  };
}
function isCauseHeader(line) {
  return line.trimStart().startsWith("[cause]:");
}
function isFrameworkOrRuntimeFrame(line) {
  const normalized = line.replaceAll("\\", "/");
  return normalized.includes("node_modules/toolcraft/") || normalized.includes("node_modules/toolcraft-openapi/") || normalized.includes("node_modules/toolcraft-schema/") || normalized.includes("node_modules/commander/") || normalized.includes("node:internal/") || normalized.includes("/packages/toolcraft/src/");
}
function formatHiddenFrameSummary(count) {
  const plural = count === 1 ? "" : "s";
  return `${HIDDEN_FRAME_SUMMARY_PREFIX}${count} framework / runtime frame${plural}${HIDDEN_FRAME_SUMMARY_SUFFIX}`;
}

// node_modules/toolcraft/dist/validation-errors.js
var MAX_RENDERED_VALIDATION_ERRORS = 10;
function throwValidationErrors(errors) {
  if (errors.length === 0) {
    return;
  }
  if (errors.length === 1) {
    throw new UserError(errors[0]?.message ?? "Invalid parameters.");
  }
  const rendered = errors.slice(0, MAX_RENDERED_VALIDATION_ERRORS).map((error3) => `  - ${error3.path}: ${error3.message}`);
  const remaining = errors.length - rendered.length;
  if (remaining > 0) {
    rendered.push(`  \u2026 and ${remaining} more`);
  }
  throw new UserError(`${errors.length} parameter errors:
${rendered.join("\n")}`);
}

// node_modules/toolcraft/dist/cli.js
configureTheme({ brand: "blue", label: "Toolcraft" });
var RESERVED_SERVICE_NAMES = /* @__PURE__ */ new Set([
  "params",
  "secrets",
  "fetch",
  "fs",
  "env",
  "progress",
  "runtimeOptions",
  "root"
]);
var RESERVED_SERVICE_NAMES_MESSAGE = "Available reserved names: params, secrets, fetch, fs, env, progress, runtimeOptions, root.";
var NULL_OPTION_VALUE = Symbol("toolcraft.cli.null");
function inferProgramName(argv) {
  const entrypoint = argv[1];
  if (typeof entrypoint !== "string" || entrypoint.length === 0) {
    return "toolcraft";
  }
  const parsed = path9.parse(entrypoint);
  return parsed.name.length > 0 ? parsed.name : "toolcraft";
}
function normalizeRoots(roots, argv) {
  if (!Array.isArray(roots)) {
    return roots;
  }
  return {
    kind: "group",
    name: inferProgramName(argv),
    aliases: [],
    secrets: {},
    children: roots
  };
}
var HELP_FLAGS = /* @__PURE__ */ new Set(["--help", "-h"]);
function unwrapOptional2(schema) {
  if (schema.kind === "optional") {
    return unwrapOptional2(schema.inner);
  }
  return schema;
}
function splitWords3(value) {
  const words = [];
  let current = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index] ?? "";
    const lower = char.toLowerCase();
    const upper = char.toUpperCase();
    const isSeparator = char === "-" || char === "_" || char === " " || char === ".";
    if (isSeparator) {
      if (current.length > 0) {
        words.push(current.toLowerCase());
        current = "";
      }
      continue;
    }
    const isUppercase = char !== lower && char === upper;
    const previous = value[index - 1];
    const next = value[index + 1];
    const previousIsLowercase = previous !== void 0 && previous === previous.toLowerCase() && previous !== previous.toUpperCase();
    const nextIsLowercase = next !== void 0 && next === next.toLowerCase() && next !== next.toUpperCase();
    if (isUppercase && current.length > 0 && (previousIsLowercase || nextIsLowercase)) {
      words.push(current.toLowerCase());
      current = char;
      continue;
    }
    current += char;
  }
  if (current.length > 0) {
    words.push(current.toLowerCase());
  }
  return words;
}
function formatSegment(segment, casing) {
  const separator = casing === "snake" ? "_" : "-";
  return splitWords3(segment).join(separator);
}
function toOptionFlag(path10, casing) {
  return `--${path10.map((segment) => formatSegment(segment, casing)).join(".")}`;
}
function toOptionAttribute(path10, casing) {
  return path10.map((segment) => {
    const formatted = formatSegment(segment, casing);
    if (casing === "snake") {
      return formatted;
    }
    const words = formatted.split("-");
    return words.map((word, index) => index === 0 ? word : `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join("");
  }).join(".");
}
function toDisplayPath(path10) {
  return path10.join(".");
}
function toUnionKindControlPath(path10) {
  if (path10.length === 0) {
    return ["kind"];
  }
  const head = path10.slice(0, -1);
  const tail = path10[path10.length - 1] ?? "";
  return [...head, `${tail}Kind`];
}
function toUnionKindDisplayPath(path10) {
  if (path10.length === 0) {
    return "kind";
  }
  const head = path10.slice(0, -1);
  const tail = path10[path10.length - 1] ?? "";
  return [...head, `${tail}-kind`].join(".");
}
function createSyntheticEnumSchema(values) {
  if (values.length === 0) {
    throw new Error("Synthetic enum schema requires at least one value.");
  }
  return {
    kind: "enum",
    values
  };
}
function getRequiredBranchFingerprint(branch, casing) {
  const requiredKeys = Object.entries(branch.shape).filter(([, schema]) => schema.kind !== "optional").map(([key2]) => formatSegment(key2, casing)).sort();
  return requiredKeys.join("+");
}
function collectFields(schema, casing, globalLongOptionFlags, path10 = [], inheritedOptional = false, variantContext) {
  const collected = {
    dynamicFields: [],
    fields: [],
    variants: []
  };
  for (const [key2, rawChildSchema] of Object.entries(schema.shape)) {
    const nextPath = [...path10, key2];
    const runtimeOptional = inheritedOptional || rawChildSchema.kind === "optional";
    const childSchema = unwrapOptional2(rawChildSchema);
    const requiredWhenActive = rawChildSchema.kind !== "optional" && childSchema.default === void 0;
    if (childSchema.kind === "object") {
      const nested = collectFields(childSchema, casing, globalLongOptionFlags, nextPath, runtimeOptional, variantContext);
      collected.dynamicFields.push(...nested.dynamicFields);
      collected.fields.push(...nested.fields);
      collected.variants.push(...nested.variants);
      continue;
    }
    if (childSchema.kind === "oneOf") {
      const variantId = `${toDisplayPath(nextPath)}:oneOf`;
      const branchIds = Object.keys(childSchema.branches);
      const controlField = {
        id: toDisplayPath([...nextPath, childSchema.discriminator]),
        path: [...nextPath, childSchema.discriminator],
        displayPath: toDisplayPath([...nextPath, childSchema.discriminator]),
        optionAttribute: toOptionAttribute([...nextPath, childSchema.discriminator], casing),
        commanderOptionAttribute: toCommanderOptionAttribute([...nextPath, childSchema.discriminator], casing, globalLongOptionFlags),
        optionFlag: toOptionFlag([...nextPath, childSchema.discriminator], casing),
        longAliases: [],
        shortFlag: void 0,
        schema: createSyntheticEnumSchema(branchIds),
        description: childSchema.description,
        optional: runtimeOptional,
        hasDefault: false,
        defaultValue: void 0,
        requiredWhenActive
      };
      collected.fields.push(controlField);
      const branches = [];
      for (const [branchId, branchSchema] of Object.entries(childSchema.branches)) {
        const branch = collectFields(branchSchema, casing, globalLongOptionFlags, nextPath, true, {
          id: variantId,
          branchId
        });
        collected.dynamicFields.push(...branch.dynamicFields);
        collected.fields.push(...branch.fields);
        collected.variants.push(...branch.variants);
        branches.push({
          branchId,
          dynamicFieldIds: branch.dynamicFields.map((field) => field.id),
          fieldIds: branch.fields.map((field) => field.id),
          requiredDynamicFieldIds: branch.dynamicFields.filter((field) => field.requiredWhenActive).map((field) => field.id),
          requiredFieldIds: branch.fields.filter((field) => field.requiredWhenActive).map((field) => field.id)
        });
      }
      collected.variants.push({
        id: variantId,
        controlDisplayPath: controlField.displayPath,
        controlFieldId: controlField.id,
        optional: runtimeOptional,
        branches
      });
      continue;
    }
    if (childSchema.kind === "union") {
      const variantId = `${toDisplayPath(nextPath)}:union`;
      const controlPath = toUnionKindControlPath(nextPath);
      const controlDisplayPath = toUnionKindDisplayPath(nextPath);
      const branchIds = childSchema.branches.map((branch) => getRequiredBranchFingerprint(branch, casing));
      const controlField = {
        id: controlDisplayPath,
        path: controlPath,
        displayPath: controlDisplayPath,
        optionAttribute: toOptionAttribute(controlPath, casing),
        commanderOptionAttribute: toCommanderOptionAttribute(controlPath, casing, globalLongOptionFlags),
        optionFlag: toOptionFlag(controlPath, casing),
        longAliases: [],
        shortFlag: void 0,
        schema: createSyntheticEnumSchema(branchIds),
        description: childSchema.description,
        optional: runtimeOptional,
        hasDefault: false,
        defaultValue: void 0,
        requiredWhenActive,
        synthetic: true
      };
      collected.fields.push(controlField);
      const branches = [];
      childSchema.branches.forEach((branchSchema, index) => {
        const branchId = branchIds[index] ?? "";
        const branch = collectFields(branchSchema, casing, globalLongOptionFlags, nextPath, true, {
          id: variantId,
          branchId
        });
        collected.dynamicFields.push(...branch.dynamicFields);
        collected.fields.push(...branch.fields);
        collected.variants.push(...branch.variants);
        branches.push({
          branchId,
          dynamicFieldIds: branch.dynamicFields.map((field) => field.id),
          fieldIds: branch.fields.map((field) => field.id),
          requiredDynamicFieldIds: branch.dynamicFields.filter((field) => field.requiredWhenActive).map((field) => field.id),
          requiredFieldIds: branch.fields.filter((field) => field.requiredWhenActive).map((field) => field.id)
        });
      });
      collected.variants.push({
        id: variantId,
        controlDisplayPath,
        controlFieldId: controlField.id,
        optional: runtimeOptional,
        branches
      });
      continue;
    }
    if (childSchema.kind === "record") {
      collected.dynamicFields.push({
        id: toDisplayPath(nextPath),
        path: nextPath,
        displayPath: toDisplayPath(nextPath),
        optionPath: nextPath,
        optionPathDisplay: `${toDisplayPath(nextPath)}.<key>`,
        optionFlag: `${toOptionFlag(nextPath, casing)}.<key>`,
        description: childSchema.description,
        optional: runtimeOptional,
        hasDefault: childSchema.default !== void 0,
        defaultValue: childSchema.default,
        requiredWhenActive,
        schema: childSchema,
        variantId: variantContext?.id,
        variantBranchId: variantContext?.branchId
      });
      continue;
    }
    if (childSchema.kind === "array" && unwrapOptional2(childSchema.item).kind === "object") {
      collected.dynamicFields.push({
        id: toDisplayPath(nextPath),
        path: nextPath,
        displayPath: toDisplayPath(nextPath),
        optionPath: nextPath,
        optionPathDisplay: `${toDisplayPath(nextPath)}.<index>`,
        optionFlag: `${toOptionFlag(nextPath, casing)}.<index>`,
        description: childSchema.description,
        optional: runtimeOptional,
        hasDefault: childSchema.default !== void 0,
        defaultValue: childSchema.default,
        requiredWhenActive,
        schema: childSchema,
        variantId: variantContext?.id,
        variantBranchId: variantContext?.branchId
      });
      continue;
    }
    collected.fields.push({
      id: toDisplayPath(nextPath),
      path: nextPath,
      displayPath: toDisplayPath(nextPath),
      optionAttribute: toOptionAttribute(nextPath, casing),
      commanderOptionAttribute: toCommanderOptionAttribute(nextPath, casing, globalLongOptionFlags),
      optionFlag: toOptionFlag(nextPath, casing),
      longAliases: [...childSchema.cliAliases ?? []].map((alias) => alias.startsWith("--") ? alias : `--${alias}`),
      shortFlag: childSchema.short,
      schema: childSchema,
      description: childSchema.description,
      optional: runtimeOptional,
      hasDefault: childSchema.default !== void 0,
      defaultValue: childSchema.default,
      requiredWhenActive,
      global: childSchema.global === true ? true : void 0,
      variantId: variantContext?.id,
      variantBranchId: variantContext?.branchId
    });
  }
  return collected;
}
function toCommanderOptionAttribute(path10, casing, globalLongOptionFlags) {
  const optionAttribute = toOptionAttribute(path10, casing);
  const optionFlag = toOptionFlag(path10, casing);
  if (!globalLongOptionFlags.has(optionFlag)) {
    return optionAttribute;
  }
  return `param_${optionAttribute}`;
}
function assignPositionals(fields, positional) {
  if (positional.length === 0) {
    return fields;
  }
  const byPath = new Map(fields.map((field) => [field.displayPath, field]));
  let variadicPositionSeen = false;
  positional.forEach((name, index) => {
    const field = byPath.get(name);
    if (field === void 0) {
      throw new UserError(`Positional parameter "${name}" does not exist in params.`);
    }
    if (field.schema.kind === "array") {
      if (index !== positional.length - 1) {
        throw new UserError(`Positional array parameter "${name}" must be the last positional.`);
      }
      variadicPositionSeen = true;
    }
    if (variadicPositionSeen && field.schema.kind !== "array") {
      throw new UserError(`Positional parameter "${name}" cannot appear after a positional array.`);
    }
    field.positionalIndex = index;
    field.variadicPosition = field.schema.kind === "array";
  });
  return fields;
}
function formatOptionFlags(field, globalLongOptionFlags) {
  const collidesWithGlobalFlag = globalLongOptionFlags.has(field.optionFlag);
  if (collidesWithGlobalFlag) {
    if (field.shortFlag === void 0) {
      throw new UserError(`Parameter "${field.displayPath}" uses reserved CLI flag "${field.optionFlag}". Add a short flag or rename the parameter.`);
    }
    return `-${field.shortFlag}`;
  }
  if (field.shortFlag === void 0) {
    return [field.optionFlag, ...field.longAliases].join(", ");
  }
  return [`-${field.shortFlag}`, field.optionFlag, ...field.longAliases].join(", ");
}
function formatPositionalToken(field) {
  const optionalPositional = field.optional || field.hasDefault;
  if (field.variadicPosition === true) {
    return optionalPositional ? `[${field.displayPath}...]` : `<${field.displayPath}...>`;
  }
  return optionalPositional ? `[${field.displayPath}]` : `<${field.displayPath}>`;
}
function parseBooleanText(value, label) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  throw new InvalidArgumentError(`Invalid value for "${label}". Expected true or false, got ${describeReceived(value)}.`);
}
function parseEnumValue(value, values, label) {
  const match = values.find((candidate) => String(candidate) === value);
  if (match === void 0) {
    const suggestions = suggest(value, values.map((candidate) => String(candidate)));
    const suggestionLine = suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?
` : " ";
    throw new InvalidArgumentError(`Invalid value for "${label}".${suggestionLine}Expected one of: ${values.map((candidate) => String(candidate)).join(", ")}, got ${describeReceived(value)}.`);
  }
  return match;
}
function validateStringPattern(value, schema, label) {
  if (schema.minLength !== void 0 && value.length < schema.minLength) {
    throw new UserError(`Invalid value for "${label}". Expected a string with length at least ${schema.minLength}, got string with length ${value.length}.`);
  }
  if (schema.maxLength !== void 0 && value.length > schema.maxLength) {
    throw new UserError(`Invalid value for "${label}". Expected a string with length at most ${schema.maxLength}, got string with length ${value.length}.`);
  }
  if (schema.pattern !== void 0 && !matchesStringPattern(value, schema.pattern)) {
    throw new UserError(`Invalid value for "${label}": "${value}" does not match pattern "${schema.pattern}".`);
  }
  return value;
}
function matchesStringPattern(value, pattern) {
  return new RegExp(pattern).test(value);
}
function parseJsonText(value, label) {
  try {
    return JSON.parse(value);
  } catch (error3) {
    throw new InvalidArgumentError(`Invalid value for "${label}". Expected valid JSON, got ${describeReceived(value)} (parser: ${getErrorMessage(error3)}).`);
  }
}
function describeReceived(value) {
  if (value === null)
    return "null";
  if (value === void 0)
    return "missing";
  if (Array.isArray(value))
    return `array(${value.length})`;
  if (typeof value === "object")
    return "object";
  if (typeof value === "string") {
    const s = value.length > 40 ? `${value.slice(0, 40)}\u2026` : value;
    return `${JSON.stringify(s)}`;
  }
  return JSON.stringify(value);
}
function getErrorMessage(error3) {
  return error3 instanceof Error ? error3.message : String(error3);
}
function formatJsonParseUserErrorMessage(label, filePath, source, error3, options) {
  const location = getJsonParseErrorLocation(error3, source);
  const message2 = location === null ? getErrorMessage(error3) : removeNativeJsonParseLocation(getErrorMessage(error3), location);
  const positionText = location === null ? "" : ` at line ${location.line} column ${location.column}`;
  const formattedPath = options.quotePath ? `"${filePath}"` : filePath;
  const snippet = location === null ? "" : `
${renderSourceSnippet({
    source,
    line: location.line,
    column: location.column,
    filePath
  })}`;
  return `${label} ${formattedPath} is not valid JSON: ${message2}${positionText}.${snippet}`;
}
function removeNativeJsonParseLocation(message2, location) {
  const nativeSuffix = ` (line ${location.line} column ${location.column})`;
  return message2.endsWith(nativeSuffix) ? message2.slice(0, -nativeSuffix.length) : message2;
}
function getJsonParseErrorLocation(error3, source) {
  const causeLocation = getJsonParseCauseLocation(error3);
  if (causeLocation !== null) {
    return causeLocation;
  }
  const directPosition = getNumericProperty(error3, "position");
  if (directPosition !== null) {
    return getSourceOffsetLocation(source, directPosition);
  }
  const messagePosition = getJsonParseMessagePosition(getErrorMessage(error3));
  if (messagePosition !== null) {
    return getSourceOffsetLocation(source, messagePosition);
  }
  return null;
}
function getJsonParseCauseLocation(error3) {
  if (typeof error3 !== "object" || error3 === null || !hasOwnProperty3(error3, "cause")) {
    return null;
  }
  const cause = error3.cause;
  const line = getNumericProperty(cause, "line");
  const column = getNumericProperty(cause, "column") ?? getNumericProperty(cause, "col");
  if (line === null || column === null) {
    return null;
  }
  return { line, column };
}
function getNumericProperty(value, key2) {
  if (typeof value !== "object" || value === null || !hasOwnProperty3(value, key2)) {
    return null;
  }
  const propertyValue = value[key2];
  return typeof propertyValue === "number" && Number.isFinite(propertyValue) ? propertyValue : null;
}
function getJsonParseMessagePosition(message2) {
  const marker = " at position ";
  const markerIndex = message2.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }
  const startIndex = markerIndex + marker.length;
  let endIndex = startIndex;
  while (endIndex < message2.length && isAsciiDigit(message2[endIndex] ?? "")) {
    endIndex += 1;
  }
  if (endIndex === startIndex) {
    return null;
  }
  return Number.parseInt(message2.slice(startIndex, endIndex), 10);
}
function getSourceOffsetLocation(source, offset) {
  let line = 1;
  let column = 1;
  const boundedOffset = Math.max(0, Math.floor(offset));
  for (let index = 0; index < boundedOffset && index < source.length; index += 1) {
    if (source[index] === "\n") {
      line += 1;
      column = 1;
      continue;
    }
    column += 1;
  }
  return { line, column };
}
function isAsciiDigit(value) {
  return value >= "0" && value <= "9";
}
function formatAvailableList(values) {
  return `Available: ${[...values].sort().join(", ")}.`;
}
function normalizeCommanderOptionValue(value) {
  return value === NULL_OPTION_VALUE ? null : value;
}
function parseScalarValue(value, schema, label) {
  if (value === "null" && schema.nullable === true) {
    return null;
  }
  switch (schema.kind) {
    case "string":
      return validateStringPattern(value, schema, label);
    case "number": {
      const parsed = Number(value);
      if (!isValidNumberSchemaValue(parsed, schema)) {
        throw new InvalidArgumentError(`Invalid value for "${label}". Expected ${getExpectedNumberDescription(schema)}, got ${describeReceived(value)}.`);
      }
      return parsed;
    }
    case "boolean":
      return parseBooleanText(value, label);
    case "enum":
      return parseEnumValue(value, schema.values, label);
  }
  throw new UserError(`Unsupported CLI schema kind. ${formatAvailableList(["boolean", "enum", "number", "string"])}`);
}
function splitArrayInput(value) {
  const items = [];
  let current = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index] ?? "";
    if (char === ",") {
      const trimmed2 = current.trim();
      if (trimmed2.length > 0) {
        items.push(trimmed2);
      }
      current = "";
      continue;
    }
    current += char;
  }
  const trimmed = current.trim();
  if (trimmed.length > 0) {
    items.push(trimmed);
  }
  return items;
}
function parseArrayValue(value, schema, label) {
  if (value === "null" && schema.nullable === true) {
    return null;
  }
  const itemSchema = unwrapOptional2(schema.item);
  if (itemSchema.kind === "array" || itemSchema.kind === "object") {
    throw new UserError(`Array parameter "${label}" must use scalar items.`);
  }
  return splitArrayInput(value).map((item) => parseScalarValue(item, itemSchema, label));
}
function isNegativeNumericArrayToken(token, schema) {
  if (!token.startsWith("-") || token.startsWith("--")) {
    return false;
  }
  const itemSchema = unwrapOptional2(schema.item);
  if (itemSchema.kind !== "number") {
    return false;
  }
  const items = splitArrayInput(token);
  return items.length > 0 && items.every((item) => isValidNumberSchemaValue(Number(item), itemSchema));
}
function isNextArrayOptionToken(token, schema) {
  return token.startsWith("-") && !isNegativeNumericArrayToken(token, schema);
}
function validateArrayBounds(value, schema, label) {
  if (schema.minItems !== void 0 && value.length < schema.minItems) {
    throw new UserError(`Invalid value for "${label}". Expected an array with at least ${schema.minItems} items, got array(${value.length}).`);
  }
  if (schema.maxItems !== void 0 && value.length > schema.maxItems) {
    throw new UserError(`Invalid value for "${label}". Expected an array with at most ${schema.maxItems} items, got array(${value.length}).`);
  }
}
function createOption2(field, globalLongOptionFlags) {
  const flags = formatOptionFlags(field, globalLongOptionFlags);
  const collidesWithGlobalFlag = globalLongOptionFlags.has(field.optionFlag);
  if (field.schema.kind === "boolean") {
    if (collidesWithGlobalFlag) {
      return [createCommanderOption(flags, field.description, field)];
    }
    const mainOption = createCommanderOption(`${flags} [value]`, field.description, field);
    mainOption.preset(true);
    mainOption.argParser((value) => typeof value === "boolean" ? value : value);
    return [
      mainOption,
      createCommanderOption(`--no-${field.optionFlag.slice(2)}`, field.description, field)
    ];
  }
  if (field.schema.kind === "array") {
    return [
      createCommanderOption(`${flags} <value...>`, field.description, field).argParser((value, previous = []) => [...previous, value])
    ];
  }
  if (field.schema.kind === "json") {
    return [createCommanderOption(`${flags} <json>`, field.description, field)];
  }
  const option = createCommanderOption(`${flags} <value>`, field.description, field);
  return [option];
}
function resolveCLIControls(controls) {
  return {
    debug: controls?.debug === true,
    output: controls?.output === true,
    verbose: controls?.verbose === true,
    yes: controls?.yes === true
  };
}
function getGlobalLongOptionFlags(presetsEnabled, versionEnabled, controls) {
  const flags = [];
  if (presetsEnabled) {
    flags.push("--preset");
  }
  if (controls.yes) {
    flags.push("--yes");
  }
  if (controls.output) {
    flags.push("--output");
  }
  if (controls.debug) {
    flags.push("--debug");
  }
  if (controls.verbose) {
    flags.push("--verbose");
  }
  if (versionEnabled) {
    flags.push("--version");
  }
  return new Set(flags);
}
function validateUniqueOptionFlags(fields, globalLongOptionFlags) {
  const fieldsByFlag = /* @__PURE__ */ new Map();
  for (const field of fields) {
    if (field.positionalIndex !== void 0) {
      continue;
    }
    for (const flag of [field.optionFlag, ...field.longAliases]) {
      if (globalLongOptionFlags.has(flag)) {
        if (flag === field.optionFlag && field.shortFlag !== void 0) {
          continue;
        }
        throw new UserError(`Parameter "${field.displayPath}" uses reserved CLI flag "${flag}". Add a short flag or rename the parameter.`);
      }
      const existing = fieldsByFlag.get(flag);
      if (existing !== void 0) {
        throw new UserError(`Parameters "${existing.displayPath}" and "${field.displayPath}" use conflicting CLI flag "${flag}".`);
      }
      fieldsByFlag.set(flag, field);
    }
  }
}
function createCommanderOption(flags, description, field) {
  const option = new Option(flags, description);
  if (field.commanderOptionAttribute !== field.optionAttribute || field.longAliases.length > 0) {
    option.attributeName = () => field.commanderOptionAttribute;
  }
  return option;
}
function hasHelpFlag(argv) {
  return argv.some((token) => HELP_FLAGS.has(token));
}
function resolveHelpOutput(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index] ?? "";
    if (token === "--output") {
      const value = argv[index + 1];
      if (value === "rich" || value === "md" || value === "json") {
        return value;
      }
      if (value === "markdown") {
        return "md";
      }
      continue;
    }
    if (token.startsWith("--output=")) {
      const value = token.slice("--output=".length);
      if (value === "rich" || value === "md" || value === "json") {
        return value;
      }
      if (value === "markdown") {
        return "md";
      }
    }
  }
  return "rich";
}
function isNodeVisibleInScope(node, scope) {
  if (node.kind === "command") {
    return node.scope.includes(scope);
  }
  return getVisibleChildren(node, scope).length > 0 || Boolean(node.default && node.default.scope.includes(scope)) || node.scope === void 0 || node.scope.includes(scope);
}
function getVisibleChildren(group, scope) {
  return group.children.filter((child) => isNodeVisibleInScope(child, scope));
}
function getHelpChildren(group, scope) {
  return getVisibleChildren(group, scope).filter((child) => {
    if (child.kind === "command") {
      return child.hidden !== true;
    }
    return true;
  });
}
function findVisibleChild(group, token, scope) {
  return getVisibleChildren(group, scope).find((child) => child.name === token || child.aliases.includes(token));
}
function resolveHelpTarget(root2, argv, scope, rootDisplayName) {
  const breadcrumb = [rootDisplayName ?? root2.name];
  let current = root2;
  for (const token of argv.slice(2)) {
    if (token.startsWith("-") || token === "help") {
      break;
    }
    if (current.kind !== "group") {
      break;
    }
    const child = findVisibleChild(current, token, scope);
    if (child === void 0) {
      break;
    }
    breadcrumb.push(child.name);
    current = child;
  }
  return {
    breadcrumb,
    node: current
  };
}
function formatHelpFieldFlags(field, globalLongOptionFlags) {
  if (field.positionalIndex !== void 0) {
    return formatPositionalToken(field);
  }
  if (field.schema.kind === "boolean") {
    if (field.defaultValue === true) {
      return `--no-${field.optionFlag.slice(2)}`;
    }
    return formatOptionFlags(field, globalLongOptionFlags);
  }
  return `${formatOptionFlags(field, globalLongOptionFlags)} <${describeHelpValueToken(field.schema, {
    displayPath: field.displayPath,
    optionFlag: field.optionFlag
  })}>`;
}
function appendHelpMetadata(description, metadata) {
  if (metadata.length === 0) {
    return description;
  }
  if (description.length === 0) {
    return `(${metadata.join(", ")})`;
  }
  return `${description} (${metadata.join(", ")})`;
}
function formatHelpFieldDescription(field) {
  const description = field.description ?? field.displayPath;
  const metadata = [];
  if (!field.optional && !field.hasDefault) {
    metadata.push("required");
  }
  if (field.hasDefault) {
    metadata.push(`default: ${formatResolvedValue(field.defaultValue)}`);
  }
  return appendHelpMetadata(description, metadata);
}
function describeKnownStringFormat(format) {
  switch (format) {
    case "date":
      return "date";
    case "date-time":
      return "datetime";
    case "uri":
      return "url";
    case "email":
      return "email";
    default:
      return void 0;
  }
}
function describeKnownStringPattern(pattern) {
  if (pattern === void 0) {
    return void 0;
  }
  if (pattern === "^\\d{4}-\\d{2}-\\d{2}$") {
    return "YYYY-MM-DD";
  }
  if (pattern.startsWith("^\\d{4}-\\d{2}-\\d{2}T")) {
    return "YYYY-MM-DDTHH:MM:SS";
  }
  return void 0;
}
function stripLongOptionPrefix(optionFlag) {
  return optionFlag.startsWith("--") ? optionFlag.slice(2) : optionFlag;
}
function getLastSegment(value, separator) {
  const segments = value.split(separator);
  return segments[segments.length - 1] ?? value;
}
function matchesFieldNameSuffix(name, suffix) {
  const lowerName = name.toLowerCase();
  const lowerSuffix = suffix.toLowerCase();
  return lowerName === lowerSuffix || name.endsWith(suffix) || lowerName.endsWith(`-${lowerSuffix}`) || lowerName.endsWith(`_${lowerSuffix}`);
}
function describeFieldNameValueToken(displayPath, optionFlag) {
  const displayName = getLastSegment(displayPath, ".");
  const optionName = getLastSegment(stripLongOptionPrefix(optionFlag), ".");
  const candidates = [displayName, optionName];
  const suffixTokens = [
    ["Path", "path"],
    ["Paths", "path"],
    ["File", "path"],
    ["Files", "path"],
    ["Url", "url"],
    ["Email", "email"],
    ["Name", "name"],
    ["Id", "id"]
  ];
  for (const [suffix, token] of suffixTokens) {
    if (candidates.some((candidate) => matchesFieldNameSuffix(candidate, suffix))) {
      return token;
    }
  }
  return void 0;
}
function describeHelpValueToken(schema, field) {
  if (schema.kind === "array") {
    const itemSchema = unwrapOptional2(schema.item);
    if (itemSchema.kind === "array" || itemSchema.kind === "object") {
      return "value...";
    }
    return `${describeHelpValueToken(itemSchema, field)}...`;
  }
  if (schema.kind === "json") {
    return "json";
  }
  if (schema.kind === "string") {
    const metadataToken = describeKnownStringFormat(schema.format) ?? describeKnownStringPattern(schema.pattern);
    if (metadataToken !== void 0) {
      return metadataToken;
    }
  }
  if (schema.kind === "enum") {
    return "value";
  }
  return describeFieldNameValueToken(field.displayPath, field.optionFlag) ?? "value";
}
function formatCompactEnumSignatureToken(schema) {
  if (schema.kind !== "enum" || schema.values.length < 2 || schema.values.length > 3) {
    return void 0;
  }
  const tokens = schema.values.map((value) => String(value));
  const compact = tokens.every((token) => token.length > 0 && token.length <= 24 && token.trim() === token && !token.includes("|") && !token.includes("	") && !token.includes("\n") && !token.includes("\r") && !token.includes(" "));
  return compact ? tokens.join("|") : void 0;
}
function formatCommandParameterFieldFlags(field, globalLongOptionFlags) {
  if (field.positionalIndex !== void 0 || field.schema.kind === "boolean") {
    return formatHelpFieldFlags(field, globalLongOptionFlags);
  }
  const enumToken = formatCompactEnumSignatureToken(field.schema);
  if (enumToken !== void 0) {
    return `${formatOptionFlags(field, globalLongOptionFlags)} ${enumToken}`;
  }
  return formatHelpFieldFlags(field, globalLongOptionFlags);
}
function describeDynamicFieldType(field) {
  if (field.schema.kind === "record") {
    const valueSchema = unwrapOptional2(field.schema.value);
    if (valueSchema.kind === "json") {
      return "json";
    }
    if (valueSchema.kind === "array") {
      return describeHelpValueToken(valueSchema, {
        displayPath: field.optionPathDisplay,
        optionFlag: field.optionFlag
      });
    }
    if (valueSchema.kind === "object") {
      return "value";
    }
    return describeHelpValueToken(valueSchema, {
      displayPath: field.optionPathDisplay,
      optionFlag: field.optionFlag
    });
  }
  return "value";
}
function formatDynamicHelpMetadata(field) {
  const metadata = [];
  if (!field.optional && !field.hasDefault) {
    metadata.push("required");
  }
  if (field.hasDefault) {
    metadata.push(`default: ${formatResolvedValue(field.defaultValue)}`);
  }
  return metadata;
}
function collectDynamicObjectHelpRows(schema, casing, optionPrefix, displayPrefix, metadata) {
  const rows = [];
  for (const [key2, rawChildSchema] of Object.entries(schema.shape)) {
    const childSchema = unwrapOptional2(rawChildSchema);
    const optionFlag = `${optionPrefix}.${formatSegment(key2, casing)}`;
    const displayPath = `${displayPrefix}.${key2}`;
    const description = childSchema.description ?? displayPath;
    if (childSchema.kind === "object") {
      rows.push(...collectDynamicObjectHelpRows(childSchema, casing, optionFlag, displayPath, metadata));
      continue;
    }
    if (childSchema.kind === "record") {
      rows.push({
        flags: `${optionFlag}.<key> <${describeDynamicFieldType({
          ...{
            id: displayPath,
            path: [],
            displayPath,
            optionPath: [],
            optionPathDisplay: `${displayPath}.<key>`,
            optionFlag: `${optionFlag}.<key>`,
            optional: false,
            hasDefault: false,
            defaultValue: void 0,
            requiredWhenActive: false,
            schema: childSchema
          }
        })}>`,
        description: appendHelpMetadata(description, metadata)
      });
      continue;
    }
    if (childSchema.kind === "array" && unwrapOptional2(childSchema.item).kind === "object") {
      rows.push(...collectDynamicObjectHelpRows(unwrapOptional2(childSchema.item), casing, `${optionFlag}.<index>`, `${displayPath}.<index>`, metadata));
      continue;
    }
    rows.push({
      flags: childSchema.kind === "boolean" ? childSchema.default === true ? `--no-${optionFlag.slice(2)}` : optionFlag : `${optionFlag} <${describeHelpValueToken(childSchema, {
        displayPath,
        optionFlag
      })}>`,
      description: appendHelpMetadata(description, metadata)
    });
  }
  return rows;
}
function formatDynamicHelpFields(field, casing) {
  const metadata = formatDynamicHelpMetadata(field);
  if (field.schema.kind === "record") {
    const valueSchema = unwrapOptional2(field.schema.value);
    if (valueSchema.kind === "object") {
      return collectDynamicObjectHelpRows(valueSchema, casing, `${field.optionFlag}`, `${field.optionPathDisplay}`, metadata);
    }
  }
  if (field.schema.kind === "array") {
    const itemSchema = unwrapOptional2(field.schema.item);
    if (itemSchema.kind === "object") {
      return collectDynamicObjectHelpRows(itemSchema, casing, `${field.optionFlag}`, `${field.optionPathDisplay}`, metadata);
    }
  }
  return [
    {
      flags: `${field.optionFlag} <${describeDynamicFieldType(field)}>`,
      description: appendHelpMetadata(field.description ?? field.optionPathDisplay, metadata)
    }
  ];
}
function formatSecretRows(secrets) {
  return Object.values(secrets).map((secret) => ({
    flags: secret.env,
    description: formatSecretDescription(secret)
  }));
}
function formatSecretDescription(secret) {
  if (secret.description !== void 0 && secret.description.length > 0) {
    return secret.description;
  }
  return secret.optional === true ? "Optional secret" : "Required secret";
}
function formatExampleValue(value) {
  if (typeof value === "string" && value.length > 0 && !value.includes(" ")) {
    return value;
  }
  return JSON.stringify(value);
}
function formatExampleCommand(breadcrumb, rootUsageName, params) {
  const commandPath = buildUsageLine(breadcrumb, rootUsageName, "");
  const flags = Object.entries(params).map(([key2, value]) => {
    const flag = `--${key2}`;
    return typeof value === "boolean" ? value ? flag : `--no-${key2}` : `${flag} ${formatExampleValue(value)}`;
  });
  return [commandPath, ...flags].filter((token) => token.length > 0).join(" ");
}
function formatExampleRows(examples, breadcrumb, rootUsageName) {
  return examples.map((example) => `${example.title}
  ${formatExampleCommand(breadcrumb, rootUsageName, example.params)}`);
}
function wrapOptionalCommandParameterToken(token, optional) {
  return optional ? `[${token}]` : token;
}
function formatCommandDynamicParameterTokens(field, casing) {
  const optional = field.optional || field.hasDefault;
  return formatDynamicHelpFields(field, casing).map((row) => wrapOptionalCommandParameterToken(row.flags, optional));
}
function formatCommandParameterTokens(command, casing, globalLongOptionFlags) {
  const collected = collectFields(command.params, casing, globalLongOptionFlags);
  const fields = assignPositionals(collected.fields, command.positional);
  return fields.filter((field) => field.global !== true).map((field) => wrapOptionalCommandParameterToken(formatCommandParameterFieldFlags(field, globalLongOptionFlags), field.positionalIndex === void 0 && (field.optional || field.hasDefault))).concat(collected.dynamicFields.flatMap((field) => formatCommandDynamicParameterTokens(field, casing)));
}
function formatCommandRowName(node, casing, globalLongOptionFlags) {
  const baseName = node.aliases.length === 0 ? node.name : `${node.name} (${node.aliases.join(", ")})`;
  const parameterTokens = node.kind === "command" ? formatCommandParameterTokens(node, casing, globalLongOptionFlags) : [];
  const name = parameterTokens.length === 0 ? baseName : `${baseName} ${parameterTokens.join(" ")}`;
  return name;
}
function formatCommandRows(group, scope, casing, globalLongOptionFlags) {
  return getHelpChildren(group, scope).map((child) => ({
    name: formatCommandRowName(child, casing, globalLongOptionFlags),
    description: child.description ?? ""
  }));
}
function formatGlobalOptionsLine(ctx) {
  const flags = [];
  if (ctx.presetsEnabled) {
    flags.push("--preset <path>");
  }
  if (ctx.controls.yes) {
    flags.push("--yes");
  }
  if (ctx.controls.output) {
    flags.push("--output <format>");
  }
  if (ctx.showVersion) {
    flags.push("--version");
  }
  return flags.length > 0 ? `${text.section("Options:")} ${flags.join("  ")}` : "";
}
function collectSchemaGlobalFieldRows(group, scope, casing, globalLongOptionFlags) {
  const seen = /* @__PURE__ */ new Map();
  const visit = (node) => {
    if (node.kind === "command") {
      const collected = collectFields(node.params, casing, globalLongOptionFlags);
      for (const field of collected.fields) {
        if (field.global !== true) {
          continue;
        }
        if (globalLongOptionFlags.has(field.optionFlag)) {
          continue;
        }
        const dedupeKey = `${field.optionFlag}|${field.shortFlag ?? ""}`;
        if (seen.has(dedupeKey)) {
          continue;
        }
        seen.set(dedupeKey, {
          flags: formatHelpFieldFlags(field, globalLongOptionFlags),
          description: formatHelpFieldDescription(field)
        });
      }
      return;
    }
    for (const child of getHelpChildren(node, scope)) {
      visit(child);
    }
  };
  visit(group);
  return [...seen.values()];
}
function renderHelpSections(sections) {
  return sections.filter((section) => section.length > 0).join("\n\n");
}
function formatHelpCommandList(rows) {
  return process.stdout.isTTY !== true ? help_formatter_plain_exports.formatCommandList(rows) : formatCommandList(rows);
}
function formatHelpOptionList(rows) {
  return process.stdout.isTTY !== true ? help_formatter_plain_exports.formatOptionList(rows) : formatOptionList(rows);
}
function buildUsageLine(breadcrumb, rootUsageName, suffix) {
  const visibleBreadcrumb = breadcrumb.filter((segment) => segment.length > 0);
  const usageBreadcrumb = breadcrumb[0] === "" ? [rootUsageName, ...visibleBreadcrumb] : visibleBreadcrumb;
  const subPath = usageBreadcrumb.slice(1).join(" ");
  const tokens = [rootUsageName, subPath, suffix].filter((segment) => segment.length > 0);
  return tokens.join(" ");
}
function formatGroupUsageSuffix(group, scope, casing, globalLongOptionFlags) {
  if (group.default !== void 0 && group.default.hidden === true && group.default.scope.includes(scope)) {
    const parameterTokens = formatCommandParameterTokens(group.default, casing, globalLongOptionFlags);
    return ["[command]", "[OPTIONS]", ...parameterTokens].join(" ");
  }
  return "[command] [OPTIONS]";
}
function renderGroupHelp(group, breadcrumb, scope, casing, globalOptions, rootUsageName, isRoot) {
  const sections = [];
  const globalLongOptionFlags = getGlobalLongOptionFlags(globalOptions.presetsEnabled, globalOptions.showVersion, globalOptions.controls);
  const commandRows = formatCommandRows(group, scope, casing, globalLongOptionFlags);
  if (commandRows.length > 0) {
    sections.push(`${text.sectionHeader("Commands")}
${formatHelpCommandList(commandRows)}`);
  }
  if (isRoot) {
    const schemaGlobalRows = collectSchemaGlobalFieldRows(group, scope, casing, globalLongOptionFlags);
    const builtInLine = formatGlobalOptionsLine(globalOptions);
    if (schemaGlobalRows.length > 0) {
      sections.push(`${text.sectionHeader("Options")}
${formatHelpOptionList(schemaGlobalRows)}
${builtInLine}`);
    } else {
      sections.push(builtInLine);
    }
  }
  return renderHelpDocument({
    breadcrumb,
    rootUsageName,
    usageLine: buildUsageLine(breadcrumb, rootUsageName, formatGroupUsageSuffix(group, scope, casing, globalLongOptionFlags)),
    description: group.description,
    requiresAuth: group.requires?.auth === true,
    sections
  });
}
function renderLeafHelp(command, breadcrumb, casing, globalOptions, rootUsageName) {
  const sections = [];
  const globalLongOptionFlags = getGlobalLongOptionFlags(globalOptions.presetsEnabled, globalOptions.showVersion, globalOptions.controls);
  const collected = collectFields(command.params, casing, globalLongOptionFlags);
  const fields = assignPositionals(collected.fields, command.positional);
  const optionRows = fields.filter((field) => field.global !== true).map((field) => ({
    flags: formatHelpFieldFlags(field, globalLongOptionFlags),
    description: formatHelpFieldDescription(field)
  })).concat(collected.dynamicFields.flatMap((field) => formatDynamicHelpFields(field, casing)));
  if (optionRows.length > 0) {
    sections.push(`${text.sectionHeader("Options")}
${formatHelpOptionList(optionRows)}`);
  }
  const secretRows = formatSecretRows(command.secrets);
  if (secretRows.length > 0) {
    sections.push(`${text.sectionHeader("Secrets (environment)")}
${formatHelpOptionList(secretRows)}`);
  }
  if (command.examples.length > 0) {
    sections.push(`${text.sectionHeader("Examples")}
${formatExampleRows(command.examples, breadcrumb, rootUsageName).join("\n")}`);
  }
  const positionalFields = fields.filter((f) => f.positionalIndex !== void 0);
  const usageSuffix = positionalFields.length > 0 ? `[OPTIONS] ${positionalFields.map(formatPositionalToken).join(" ")}` : "[OPTIONS]";
  return renderHelpDocument({
    breadcrumb,
    rootUsageName,
    usageLine: buildUsageLine(breadcrumb, rootUsageName, usageSuffix),
    description: command.description,
    requiresAuth: command.requires?.auth === true,
    sections
  });
}
function renderHelpDocument(input) {
  const title = input.breadcrumb.filter((segment) => segment.length > 0).join(" ") || input.rootUsageName;
  const description = input.description ?? "";
  const sentenceEndIndex = description.indexOf(". ");
  const headingDescription = sentenceEndIndex === -1 ? description : description.slice(0, sentenceEndIndex + 1);
  const remainingDescription = sentenceEndIndex === -1 ? "" : description.slice(sentenceEndIndex + 2);
  const heading = headingDescription.length > 0 ? `${title} \u2014 ${headingDescription}` : title;
  const lines = [text.heading(heading), ""];
  if (remainingDescription.length > 0) {
    lines.push(remainingDescription, "");
  }
  lines.push(`Usage: ${text.usageCommand(input.usageLine)}`, "");
  if (input.requiresAuth) {
    lines.push("Requires: authentication");
  }
  if (input.requiresAuth) {
    lines.push("");
  }
  lines.push(renderHelpSections(input.sections));
  return `${lines.join("\n").trimEnd()}
`;
}
async function renderGeneratedHelp(root2, argv, options) {
  const target = resolveHelpTarget(root2, argv, "cli", options.rootDisplayName);
  const output = resolveHelpOutput(argv);
  const casing = options.casing ?? "kebab";
  const rootUsageName = options.rootUsageName ?? inferProgramName(argv);
  const controls = resolveCLIControls(options.controls);
  await withOutputFormat2(output, async () => {
    const rendered = target.node.kind === "group" ? renderGroupHelp(target.node, target.breadcrumb, "cli", casing, {
      controls,
      showVersion: options.version !== void 0,
      presetsEnabled: options.presets === true
    }, rootUsageName, target.node === root2) : renderLeafHelp(target.node, target.breadcrumb, casing, {
      controls,
      showVersion: options.version !== void 0,
      presetsEnabled: options.presets === true
    }, rootUsageName);
    process.stdout.write(rendered);
  });
}
function createNodeCommand(node, casing, globalLongOptionFlags, execute, presetsEnabled, controls, pathSegments = []) {
  const nextPathSegments = [...pathSegments, node.name];
  if (node.kind === "command") {
    if (!node.scope.includes("cli")) {
      return null;
    }
    const command = new Command(node.name);
    Reflect.set(command, "_toolcraftHidden", node.hidden);
    Reflect.set(command, "_toolcraftOriginalName", node.name);
    const collected = collectFields(node.params, casing, globalLongOptionFlags);
    const fields = assignPositionals(collected.fields, node.positional);
    validateUniqueOptionFlags(fields, globalLongOptionFlags);
    if (node.description !== void 0) {
      command.description(node.description);
    }
    node.aliases.forEach((alias) => command.alias(alias));
    command.addHelpCommand(false);
    addGlobalOptions(command, presetsEnabled, controls);
    command.allowExcessArguments(true);
    if (collected.dynamicFields.length > 0) {
      command.allowUnknownOption(true);
    }
    for (const field of fields) {
      if (field.positionalIndex !== void 0) {
        command.argument(formatPositionalToken(field));
        continue;
      }
      for (const option of createOption2(field, globalLongOptionFlags)) {
        command.addOption(option);
      }
    }
    command.action(async (...args) => {
      const actionCommand = args[args.length - 1];
      const positionalValues = args.slice(0, -2);
      await execute({
        command: node,
        commandPath: nextPathSegments.join("."),
        casing,
        dynamicFields: collected.dynamicFields,
        fields,
        positionalValues,
        presetsEnabled,
        rawArgv: actionCommand.args,
        actionCommand,
        variants: collected.variants
      });
    });
    return command;
  }
  if (!isNodeVisibleInScope(node, "cli")) {
    return null;
  }
  const reservedChildNames = node.children.filter((child) => !isNodeVisibleInScope(child, "cli")).flatMap((child) => getNodeCommandNames(child));
  const visibleChildren = node.children.map((child) => createNodeCommand(child, casing, globalLongOptionFlags, execute, presetsEnabled, controls, nextPathSegments)).filter((child) => child !== null);
  const group = new Command(node.name);
  Reflect.set(group, "_toolcraftReservedChildNames", reservedChildNames);
  if (node.description !== void 0) {
    group.description(node.description);
  }
  node.aliases.forEach((alias) => group.alias(alias));
  group.addHelpCommand(false);
  addGlobalOptions(group, presetsEnabled, controls);
  const childNames = new Set(visibleChildren.map((child) => child.name()));
  for (const child of visibleChildren) {
    const isDefaultChild = node.default !== void 0 && node.default.scope.includes("cli") && (child.name() === node.default.name || child.aliases().includes(node.default.name));
    addCommanderChild(group, child, isDefaultChild, childNames);
  }
  return group;
}
function addCommanderChild(parent, child, isDefault, siblingNames) {
  if (isDefault && (child.name().length === 0 || isToolcraftHiddenCommander(child))) {
    let internalName = "__toolcraft_default__";
    let suffix = 2;
    while (siblingNames.has(internalName)) {
      internalName = `__toolcraft_default_${suffix}`;
      suffix += 1;
    }
    child.name(internalName);
    Reflect.set(parent, "_toolcraftHiddenDefaultNames", getToolcraftHiddenDefaultNames(parent).concat([
      ...new Set([Reflect.get(child, "_toolcraftOriginalName"), ...child.aliases()].filter((name) => typeof name === "string" && name.length > 0))
    ]));
    parent.addCommand(child, { hidden: true, isDefault: true });
    return;
  }
  const options = {
    ...isDefault ? { isDefault: true } : {},
    ...isToolcraftHiddenCommander(child) ? { hidden: true } : {}
  };
  parent.addCommand(child, Object.keys(options).length > 0 ? options : void 0);
}
function isToolcraftHiddenCommander(command) {
  return Reflect.get(command, "_toolcraftHidden") === true;
}
function getToolcraftHiddenDefaultNames(command) {
  const value = Reflect.get(command, "_toolcraftHiddenDefaultNames");
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function getToolcraftReservedChildNames(command) {
  const value = Reflect.get(command, "_toolcraftReservedChildNames");
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function getNodeCommandNames(node) {
  return [node.name, ...node.aliases].filter((name) => name.length > 0);
}
function addGlobalOptions(command, presetsEnabled, controls) {
  const options = [];
  if (presetsEnabled) {
    options.push(new Option("--preset <path>", "Load parameter defaults from a JSON file."));
  }
  if (controls.yes) {
    options.push(new Option("--yes", "Accept defaults and skip prompts."));
  }
  if (controls.output) {
    options.push(new Option("--output <format>", "Output format.").argParser((value) => {
      if (value === "rich" || value === "md" || value === "json") {
        return value;
      }
      if (value === "markdown") {
        return "md";
      }
      throw new InvalidArgumentError(formatInvalidEnumMessage("--output", value, ["rich", "md", "markdown", "json"], {
        candidates: ["rich", "markdown", "json"],
        threshold: 3
      }));
    }));
  }
  if (controls.debug) {
    options.push(new Option("--debug [mode]", "Print stack traces for unexpected errors.").preset("trim").argParser(parseDebugStackMode));
  }
  if (controls.verbose) {
    options.push(new Option("--verbose", "Print detailed runtime diagnostics."));
  }
  for (const option of options) {
    option.hideHelp(true);
    command.addOption(option);
  }
}
function parseDebugStackMode(value) {
  if (value === true || value === "trim") {
    return "trim";
  }
  if (value === "raw") {
    return "raw";
  }
  throw new InvalidArgumentError(formatInvalidEnumMessage("--debug", String(value), ["raw"], { candidates: ["raw"] }));
}
function setNestedValue(target, path10, value) {
  let cursor2 = target;
  for (let index = 0; index < path10.length - 1; index += 1) {
    const segment = path10[index] ?? "";
    const existing = Object.prototype.hasOwnProperty.call(cursor2, segment) ? cursor2[segment] : void 0;
    if (typeof existing === "object" && existing !== null) {
      cursor2 = existing;
      continue;
    }
    const next = {};
    Object.defineProperty(cursor2, segment, {
      value: next,
      enumerable: true,
      configurable: true,
      writable: true
    });
    cursor2 = next;
  }
  const leaf = path10[path10.length - 1];
  if (leaf !== void 0) {
    Object.defineProperty(cursor2, leaf, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
}
function formatResolvedValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}
function fieldPromptLabel(field) {
  return field.positionalIndex === void 0 ? field.optionFlag : `<${field.displayPath}>`;
}
function enumOptionLabel(schema, value) {
  const key2 = String(value);
  if (schema.labels === void 0 || !Object.prototype.hasOwnProperty.call(schema.labels, key2)) {
    return key2;
  }
  return schema.labels[key2] ?? key2;
}
async function promptForField(field) {
  const schema = field.schema;
  if (schema.kind === "enum") {
    const options = schema.loadOptions ? await schema.loadOptions() : schema.values.map((value) => ({
      label: enumOptionLabel(schema, value),
      value
    }));
    const selected = await select({
      message: field.description ?? fieldPromptLabel(field),
      options,
      initialValue: field.hasDefault ? field.defaultValue : void 0
    });
    if (isCancel(selected)) {
      cancel("Operation cancelled.");
      throw new UserError("Operation cancelled.");
    }
    return selected;
  }
  if (field.schema.kind === "boolean") {
    const selected = await confirm({
      message: fieldPromptLabel(field),
      initialValue: field.hasDefault ? Boolean(field.defaultValue) : void 0
    });
    if (isCancel(selected)) {
      cancel("Operation cancelled.");
      throw new UserError("Operation cancelled.");
    }
    return selected;
  }
  const entered = await text2({
    message: fieldPromptLabel(field),
    initialValue: field.hasDefault && field.defaultValue !== void 0 ? formatResolvedValue(field.defaultValue) : void 0
  });
  if (isCancel(entered)) {
    cancel("Operation cancelled.");
    throw new UserError("Operation cancelled.");
  }
  if (typeof entered !== "string") {
    throw new UserError(`Missing required parameter "${field.displayPath}".`);
  }
  if (entered.trim().length === 0 && field.hasDefault) {
    return field.defaultValue;
  }
  if (field.schema.kind === "array") {
    return parseArrayValue(entered, field.schema, field.displayPath);
  }
  if (field.schema.kind === "json") {
    if (entered === "null" && field.schema.nullable === true) {
      return null;
    }
    return parseJsonText(entered, field.displayPath);
  }
  return parseScalarValue(entered, field.schema, field.displayPath);
}
function resolveOutput(resolvedFlags) {
  if (resolvedFlags.json === true) {
    return "json";
  }
  if (resolvedFlags.output !== void 0) {
    return resolvedFlags.output;
  }
  return "rich";
}
function resolveOutputFromArgv(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index] ?? "";
    if (token === "--json") {
      return "json";
    }
    if (token === "--md" || token === "--markdown") {
      return "md";
    }
    if (token === "--output") {
      const value = argv[index + 1];
      if (value === "rich" || value === "md" || value === "json") {
        return value;
      }
      if (value === "markdown") {
        return "md";
      }
      continue;
    }
    if (token.startsWith("--output=")) {
      const value = token.slice("--output=".length);
      if (value === "rich" || value === "md" || value === "json") {
        return value;
      }
      if (value === "markdown") {
        return "md";
      }
    }
  }
  return "rich";
}
var DESIGN_SYSTEM_OUTPUT_BY_MODE = {
  rich: "terminal",
  md: "markdown",
  json: "json"
};
function toDesignSystemOutput(output) {
  return DESIGN_SYSTEM_OUTPUT_BY_MODE[output];
}
async function withOutputFormat2(output, fn) {
  const previous = process.env.OUTPUT_FORMAT;
  process.env.OUTPUT_FORMAT = toDesignSystemOutput(output);
  resetOutputFormatCache();
  try {
    return await fn();
  } finally {
    if (previous === void 0) {
      delete process.env.OUTPUT_FORMAT;
    } else {
      process.env.OUTPUT_FORMAT = previous;
    }
    resetOutputFormatCache();
  }
}
function createFs2() {
  return {
    readFile: async (path10, encoding = "utf8") => readFile3(path10, { encoding }),
    writeFile: async (path10, contents, options) => {
      await writeFile4(path10, contents, options);
    },
    exists: async (path10) => {
      try {
        await access2(path10);
        return true;
      } catch {
        return false;
      }
    },
    lstat: async (path10) => lstat3(path10),
    rename: async (fromPath, toPath) => rename3(fromPath, toPath),
    unlink: async (path10) => unlink3(path10)
  };
}
function createEnv2(values = process.env) {
  return {
    get(key2) {
      return values[key2];
    }
  };
}
function isPlainObject4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasFieldValue(value) {
  return value !== void 0;
}
function hasNestedField(fields, path10) {
  return fields.some((field) => path10.length < field.path.length && path10.every((segment, index) => field.path[index] === segment));
}
function describeExpectedPresetValue(schema) {
  if (schema.kind === "array") {
    return "an array";
  }
  if (schema.kind === "number") {
    return getExpectedNumberDescription(schema);
  }
  if (schema.kind === "json") {
    return "valid JSON";
  }
  if (schema.kind === "enum") {
    return `one of: ${schema.values.map((value) => JSON.stringify(value)).join(", ")}`;
  }
  return `a ${schema.kind}`;
}
function validatePresetScalarValue(value, schema, fieldPath, presetPath) {
  if (value === null && schema.nullable === true) {
    return null;
  }
  switch (schema.kind) {
    case "string":
      if (typeof value !== "string") {
        break;
      }
      if (schema.minLength !== void 0 && value.length < schema.minLength) {
        throw new UserError(`Preset file "${presetPath}" has an invalid value for "${fieldPath}". Expected a string with length at least ${schema.minLength}, got string with length ${value.length}.`);
      }
      if (schema.maxLength !== void 0 && value.length > schema.maxLength) {
        throw new UserError(`Preset file "${presetPath}" has an invalid value for "${fieldPath}". Expected a string with length at most ${schema.maxLength}, got string with length ${value.length}.`);
      }
      if (schema.pattern !== void 0 && !matchesStringPattern(value, schema.pattern)) {
        throw new UserError(`Preset file "${presetPath}" has an invalid value for "${fieldPath}": "${value}" does not match pattern "${schema.pattern}".`);
      }
      return value;
    case "number":
      if (!isValidNumberSchemaValue(value, schema)) {
        break;
      }
      return value;
    case "boolean":
      if (typeof value !== "boolean") {
        break;
      }
      return value;
    case "enum": {
      const match = schema.values.find((candidate) => Object.is(candidate, value));
      if (match !== void 0) {
        return match;
      }
      break;
    }
  }
  throw new UserError(`Preset file "${presetPath}" has an invalid value for "${fieldPath}". Expected ${describeExpectedPresetValue(schema)}, got ${describeReceived(value)}.`);
}
function validatePresetFieldValue(value, field, presetPath) {
  if (field.schema.kind === "json") {
    return value;
  }
  if (field.schema.kind !== "array") {
    return validatePresetScalarValue(value, field.schema, field.displayPath, presetPath);
  }
  const itemSchema = unwrapOptional2(field.schema.item);
  if (itemSchema.kind === "array" || itemSchema.kind === "object") {
    throw new UserError(`Array parameter "${field.displayPath}" must use scalar items.`);
  }
  if (!Array.isArray(value)) {
    throw new UserError(`Preset file "${presetPath}" has an invalid value for "${field.displayPath}". Expected an array, got ${describeReceived(value)}.`);
  }
  if (field.schema.minItems !== void 0 && value.length < field.schema.minItems) {
    throw new UserError(`Preset file "${presetPath}" has an invalid value for "${field.displayPath}". Expected an array with at least ${field.schema.minItems} items, got array(${value.length}).`);
  }
  if (field.schema.maxItems !== void 0 && value.length > field.schema.maxItems) {
    throw new UserError(`Preset file "${presetPath}" has an invalid value for "${field.displayPath}". Expected an array with at most ${field.schema.maxItems} items, got array(${value.length}).`);
  }
  return value.map((item) => validatePresetScalarValue(item, itemSchema, field.displayPath, presetPath));
}
async function loadPresetValues(fields, presetPath) {
  let rawPreset;
  try {
    rawPreset = await readFile3(presetPath, {
      encoding: "utf8"
    });
  } catch (error3) {
    if (hasOwnErrorCode(error3, "ENOENT")) {
      throw new UserError(`Preset file "${presetPath}" was not found.`);
    }
    const message2 = error3 instanceof Error && error3.message.length > 0 ? error3.message : "Unknown read error.";
    throw new UserError(`Preset file "${presetPath}" could not be read: ${message2}`);
  }
  let parsedPreset;
  try {
    parsedPreset = JSON.parse(rawPreset);
  } catch (error3) {
    throw new UserError(formatJsonParseUserErrorMessage("Preset file", presetPath, rawPreset, error3, {
      quotePath: true
    }), { cause: error3 });
  }
  if (!isPlainObject4(parsedPreset)) {
    throw new UserError(`Preset file "${presetPath}" must contain a JSON object.`);
  }
  const fieldByPath = new Map(fields.map((field) => [field.displayPath, field]));
  const presetValues = {};
  function visitObject(current, path10) {
    for (const [key2, value] of Object.entries(current)) {
      const nextPath = [...path10, key2];
      const displayPath = toDisplayPath(nextPath);
      const field = fieldByPath.get(displayPath);
      if (field !== void 0) {
        presetValues[field.optionAttribute] = validatePresetFieldValue(value, field, presetPath);
        continue;
      }
      if (!hasNestedField(fields, nextPath)) {
        throw new UserError(`Preset file "${presetPath}" contains unknown parameter "${displayPath}".`);
      }
      if (!isPlainObject4(value)) {
        throw new UserError(`Preset file "${presetPath}" has an invalid value for "${displayPath}". Expected an object, got ${describeReceived(value)}.`);
      }
      visitObject(value, nextPath);
    }
  }
  visitObject(parsedPreset, []);
  return presetValues;
}
function isNumericFixtureSelector(value) {
  if (value.length === 0) {
    return false;
  }
  for (const char of value) {
    if (char < "0" || char > "9") {
      return false;
    }
  }
  return true;
}
function normalizeHttpMethod(value) {
  return (value ?? "GET").toUpperCase();
}
function isReadLikeMethod(name) {
  const normalized = name.toLowerCase();
  return normalized === "get" || normalized === "head" || normalized === "options" || normalized.startsWith("read") || normalized.startsWith("get") || normalized.startsWith("find") || normalized.startsWith("list") || normalized.startsWith("load") || normalized.startsWith("fetch") || normalized.startsWith("query") || normalized.startsWith("exists") || normalized.startsWith("has");
}
function isWriteLikeMethod(name) {
  const normalized = name.toLowerCase();
  return normalized === "post" || normalized === "put" || normalized === "patch" || normalized === "delete" || normalized.startsWith("write") || normalized.startsWith("set") || normalized.startsWith("save") || normalized.startsWith("create") || normalized.startsWith("update") || normalized.startsWith("delete") || normalized.startsWith("remove") || normalized.startsWith("insert");
}
function matchesFixtureValue(expected, actual) {
  if (typeof expected === "string" && typeof actual === "string" && expected.endsWith("%")) {
    return actual.startsWith(expected.slice(0, -1));
  }
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || expected.length !== actual.length) {
      return false;
    }
    return expected.every((item, index) => matchesFixtureValue(item, actual[index]));
  }
  if (isPlainObject4(expected)) {
    if (!isPlainObject4(actual)) {
      return false;
    }
    return Object.entries(expected).every(([key2, value]) => matchesFixtureValue(value, actual[key2]));
  }
  return Object.is(expected, actual);
}
function getFetchUrl(input) {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  return input.url;
}
function createFixtureResponse(response) {
  const status = response.status ?? 200;
  const headers = new Headers(response.headers);
  if (response.body === void 0) {
    return new Response(null, {
      status,
      headers
    });
  }
  if (typeof response.body === "string") {
    return new Response(response.body, {
      status,
      headers
    });
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new Response(JSON.stringify(response.body), {
    status,
    headers
  });
}
function createFixtureFetch(entries) {
  return async (input, init) => {
    const method = normalizeHttpMethod(init?.method ?? (input instanceof Request ? input.method : void 0));
    const url = getFetchUrl(input);
    const match = entries?.find((entry) => {
      const requestMethod = normalizeHttpMethod(entry.request.method);
      return requestMethod === method && entry.request.url === url;
    });
    if (match !== void 0) {
      return createFixtureResponse(match.response);
    }
    if (isReadLikeMethod(method)) {
      return null;
    }
    return new Response(null, {
      status: 204
    });
  };
}
function createFixtureFs(definition) {
  const fsDefinition = isPlainObject4(definition) ? definition : {};
  const readFileEntries = isPlainObject4(fsDefinition.readFile) ? fsDefinition.readFile : {};
  const existsEntries = isPlainObject4(fsDefinition.exists) ? fsDefinition.exists : {};
  return {
    readFile: async (filePath) => {
      if (Object.prototype.hasOwnProperty.call(readFileEntries, filePath)) {
        return String(readFileEntries[filePath]);
      }
      return null;
    },
    writeFile: async () => void 0,
    exists: async (filePath) => {
      if (Object.prototype.hasOwnProperty.call(existsEntries, filePath)) {
        return Boolean(existsEntries[filePath]);
      }
      return Object.prototype.hasOwnProperty.call(readFileEntries, filePath);
    },
    lstat: async () => ({ isSymbolicLink: () => false }),
    rename: async () => void 0,
    unlink: async () => void 0
  };
}
function resolveFixtureMethodResult(methodName, definition, args) {
  if (Array.isArray(definition)) {
    for (const entry of definition) {
      if (!isPlainObject4(entry)) {
        continue;
      }
      const explicitMatcher = isPlainObject4(entry.request) ? entry.request : void 0;
      const matcher = explicitMatcher ?? Object.fromEntries(Object.entries(entry).filter(([key2]) => key2 !== "result" && key2 !== "response" && key2 !== "error"));
      const firstArg = args[0];
      let matched = false;
      if (Array.isArray(matcher.args)) {
        matched = matchesFixtureValue(matcher.args, args);
      } else if (Object.keys(matcher).length === 0) {
        matched = true;
      } else if (isPlainObject4(firstArg)) {
        matched = matchesFixtureValue(matcher, firstArg);
      } else if (args.length === 1 && Object.keys(matcher).length === 1) {
        const [[, expectedValue]] = Object.entries(matcher);
        matched = matchesFixtureValue(expectedValue, firstArg);
      }
      if (!matched) {
        continue;
      }
      if (entry.error !== void 0) {
        throw new Error(String(entry.error));
      }
      if (Object.prototype.hasOwnProperty.call(entry, "result")) {
        return Promise.resolve(entry.result);
      }
      if (Object.prototype.hasOwnProperty.call(entry, "response")) {
        return Promise.resolve(entry.response);
      }
      return Promise.resolve(null);
    }
  }
  if (isPlainObject4(definition)) {
    const firstArg = args[0];
    if (typeof firstArg === "string" && Object.prototype.hasOwnProperty.call(definition, firstArg)) {
      return Promise.resolve(definition[firstArg]);
    }
  }
  if (isWriteLikeMethod(methodName)) {
    return Promise.resolve(void 0);
  }
  return Promise.resolve(null);
}
function createFixtureService(definition) {
  const methods = isPlainObject4(definition) ? definition : {};
  return new Proxy({}, {
    get(_target, property) {
      if (property === "then") {
        return void 0;
      }
      const methodName = String(property);
      return async (...args) => resolveFixtureMethodResult(methodName, methods[methodName], args);
    }
  });
}
function resolveFixturePath(commandPath) {
  const parsed = path9.parse(commandPath);
  return path9.join(parsed.dir, `${parsed.name}.fixture.json`);
}
function selectFixtureScenario(scenarios, selector, fixturePath) {
  if (isNumericFixtureSelector(selector)) {
    const index = Number(selector) - 1;
    const scenario2 = scenarios[index];
    if (scenario2 === void 0) {
      throw new UserError(`Fixture scenario index ${selector} is out of range. Available scenarios: ${scenarios.length}.`);
    }
    return scenario2;
  }
  const scenario = scenarios.find((entry) => entry.name === selector);
  if (scenario === void 0) {
    const names = scenarios.map((entry) => entry.name).filter((name) => typeof name === "string" && name.length > 0);
    const available = names.length === 0 ? `No fixtures are declared in ${fixturePath}.` : formatAvailableList(names);
    throw new UserError(`Fixture scenario "${selector}" was not found. ${available}`);
  }
  return scenario;
}
async function loadFixtureScenario(command, selector) {
  const commandPath = getCommandSourcePath(command);
  if (commandPath === void 0) {
    throw new UserError(`Fixture mode could not determine the source file for command "${command.name}".`);
  }
  const fixturePath = resolveFixturePath(commandPath);
  let rawFixture;
  try {
    rawFixture = await readFile3(fixturePath, {
      encoding: "utf8"
    });
  } catch {
    throw new UserError(`Fixture file not found for command "${command.name}". Expected ${fixturePath}.`);
  }
  let parsed;
  try {
    parsed = JSON.parse(rawFixture);
  } catch (error3) {
    throw new UserError(formatJsonParseUserErrorMessage("Fixture file", fixturePath, rawFixture, error3, {
      quotePath: false
    }), { cause: error3 });
  }
  if (!Array.isArray(parsed)) {
    throw new UserError(`Fixture file ${fixturePath} must contain a JSON array of scenarios.`);
  }
  return selectFixtureScenario(parsed, selector, fixturePath);
}
function resolveFixtureSecrets(command) {
  return Object.fromEntries(Object.keys(command.secrets).map((name) => [name, "fixture-secret"]));
}
function createFixtureEnvValues(command) {
  const values = {
    ...process.env,
    POE_API_KEY: process.env.POE_API_KEY ?? "fixture-secret"
  };
  for (const secret of Object.values(command.secrets)) {
    values[secret.env] = values[secret.env] ?? "fixture-secret";
  }
  return values;
}
async function resolveFixtureRuntime(command, services, requirementOptions, runtimeFetch) {
  const selector = process.env.TOOLCRAFT_FIXTURE;
  if (selector === void 0 || selector.length === 0) {
    return {
      env: createEnv2(),
      fetch: runtimeFetch,
      fs: createFs2(),
      isFixture: false,
      requirementOptions,
      secrets: resolveCommandSecrets(command),
      services
    };
  }
  const scenario = await loadFixtureScenario(command, selector);
  const scenarioServices = isPlainObject4(scenario.services) ? scenario.services : {};
  const customServiceNames = /* @__PURE__ */ new Set([
    ...Object.keys(services),
    ...Object.keys(scenarioServices).filter((name) => !RESERVED_SERVICE_NAMES.has(name))
  ]);
  const fixtureServices = Object.fromEntries([...customServiceNames].map((name) => [name, createFixtureService(scenarioServices[name])]));
  const fixtureEnvValues = createFixtureEnvValues(command);
  return {
    env: createEnv2(fixtureEnvValues),
    fetch: createFixtureFetch(scenarioServices.fetch),
    fs: createFixtureFs(scenarioServices.fs),
    isFixture: true,
    requirementOptions: {
      ...requirementOptions,
      env: fixtureEnvValues
    },
    secrets: resolveFixtureSecrets(command),
    services: fixtureServices
  };
}
function writeRichHeader(title) {
  const padding = Math.max(12, 34 - title.length);
  process.stdout.write(`\u2500\u2500 ${title} ${"\u2500".repeat(padding)}
`);
}
function isHumanInLoopPending(result) {
  return typeof result === "object" && result !== null && result.status === "pending-approval" && typeof result.approvalId === "string" && typeof result.message === "string" && typeof result.enqueuedAt === "string";
}
function renderHumanInLoopPending(pending) {
  process.stdout.write(`\u2713 Queued for human approval (id: ${pending.approvalId})
  Message: ${pending.message}
  Track:   toolcraft approvals show ${pending.approvalId}
`);
}
function renderApprovalDeclined(error3) {
  const logger2 = createLogger();
  logger2.error(error3.message);
  process.exitCode = 1;
}
function renderCliErrorPattern(pattern) {
  const logger2 = createLogger();
  if (pattern.kind === "usage") {
    logger2.error(appendUsagePointer(pattern.message, {
      rootUsageName: pattern.rootUsageName,
      commandPath: pattern.commandPath
    }));
    process.exitCode = 1;
    return;
  }
  if (pattern.kind === "runtime-user") {
    logger2.error(pattern.message);
    process.exitCode = 1;
    return;
  }
  if (pattern.kind === "toolcraft-bug") {
    logger2.error(`toolcraft hit an internal invariant: ${pattern.error.message}
This is a bug in toolcraft or in the command definition; it cannot be worked around by changing argv. Re-run with --debug for a stack trace and file an issue.`);
    if (pattern.debugStackMode !== void 0 && pattern.error.stack) {
      process.stderr.write(`${formatDebugStack(pattern.error.stack, pattern.debugStackMode)}
`);
    }
    process.exitCode = 1;
    return;
  }
  logger2.error(pattern.debugStackMode !== void 0 ? pattern.message : `${pattern.message} Use --debug for a stack trace.`);
  if (pattern.debugStackMode !== void 0 && pattern.stack !== void 0) {
    process.stderr.write(`${formatDebugStack(pattern.stack, pattern.debugStackMode)}
`);
  }
  process.exitCode = 1;
}
function validateServices(services) {
  for (const name of Object.keys(services)) {
    if (RESERVED_SERVICE_NAMES.has(name)) {
      throw new Error(`Service name "${name}" is reserved. Choose a different name. ${RESERVED_SERVICE_NAMES_MESSAGE}`);
    }
  }
}
function getNestedValue(target, path10) {
  return path10.reduce((current, segment) => current !== null && typeof current === "object" ? current[segment] : void 0, target);
}
function parseFieldInputValue(value, schema, label) {
  if (schema.kind === "array") {
    return parseArrayValue(value, schema, label);
  }
  if (schema.kind === "json") {
    if (value === "null" && schema.nullable === true) {
      return null;
    }
    return parseJsonText(value, label);
  }
  return parseScalarValue(value, schema, label);
}
function parseOptionFieldValue(field, value, errors) {
  try {
    if (value === null) {
      return { ok: true, value };
    }
    if (field.schema.kind === "array" && Array.isArray(value)) {
      const parsedValues = [];
      for (const item of value) {
        const parsed = parseArrayValue(String(item), field.schema, field.displayPath);
        if (parsed === null) {
          return { ok: true, value: null };
        }
        parsedValues.push(...parsed);
      }
      validateArrayBounds(parsedValues, field.schema, field.displayPath);
      return { ok: true, value: parsedValues };
    }
    if (typeof value !== "string") {
      return { ok: true, value };
    }
    const parsedValue = parseFieldInputValue(value, field.schema, field.displayPath);
    if (field.schema.kind === "array" && Array.isArray(parsedValue)) {
      validateArrayBounds(parsedValue, field.schema, field.displayPath);
    }
    return { ok: true, value: parsedValue };
  } catch (error3) {
    if (error3 instanceof UserError || error3 instanceof InvalidArgumentError) {
      errors.push({
        path: field.displayPath,
        message: error3.message
      });
      return { ok: false };
    }
    throw error3;
  }
}
function consumeFieldValue(args, index, schema, label, inlineValue) {
  if (schema.kind === "boolean") {
    if (inlineValue !== void 0) {
      return {
        nextIndex: index,
        value: parseScalarValue(inlineValue, schema, label)
      };
    }
    const next2 = args[index + 1];
    if (next2 === "true" || next2 === "false" || schema.nullable === true && next2 === "null") {
      return {
        nextIndex: index + 1,
        value: parseScalarValue(next2, schema, label)
      };
    }
    return {
      nextIndex: index,
      value: true
    };
  }
  if (inlineValue !== void 0) {
    return {
      nextIndex: index,
      value: parseFieldInputValue(inlineValue, schema, label)
    };
  }
  if (schema.kind === "array") {
    const values = [];
    let nextIndex = index;
    let cursor2 = index + 1;
    while (cursor2 < args.length) {
      const token = args[cursor2] ?? "";
      if (isNextArrayOptionToken(token, schema)) {
        break;
      }
      const parsed = parseArrayValue(token, schema, label);
      if (parsed === null) {
        return {
          nextIndex: cursor2,
          value: null
        };
      }
      values.push(...parsed);
      nextIndex = cursor2;
      cursor2 += 1;
    }
    if (values.length === 0) {
      throw new InvalidArgumentError(`option '${label}' argument missing`);
    }
    validateArrayBounds(values, schema, label);
    return {
      nextIndex,
      value: values
    };
  }
  const next = args[index + 1];
  if (next === void 0) {
    throw new InvalidArgumentError(`option '${label}' argument missing`);
  }
  return {
    nextIndex: index + 1,
    value: parseFieldInputValue(next, schema, label)
  };
}
function resolveDynamicLeaf(schema, rawSegments, casing, outputPath = [], displayPath = [], displayPathPrefix = "") {
  const unwrappedSchema = unwrapOptional2(schema);
  const kind = formatCliSchemaKind(unwrappedSchema.kind);
  if (rawSegments.length === 0) {
    if (unwrappedSchema.kind === "json" || unwrappedSchema.kind === "array" || unwrappedSchema.kind === "string" || unwrappedSchema.kind === "number" || unwrappedSchema.kind === "boolean" || unwrappedSchema.kind === "enum") {
      return {
        displayPath: toDisplayPath(displayPath),
        path: outputPath,
        schema: unwrappedSchema
      };
    }
    throw new UserError(formatUnsupportedDynamicSchemaMessage(kind, qualifyDisplayPath(displayPathPrefix, toDisplayPath(displayPath))));
  }
  switch (unwrappedSchema.kind) {
    case "object": {
      const [head, ...rest] = rawSegments;
      for (const [key2, childSchema] of Object.entries(unwrappedSchema.shape)) {
        if (formatSegment(key2, casing) !== head) {
          continue;
        }
        return resolveDynamicLeaf(childSchema, rest, casing, [...outputPath, key2], [...displayPath, key2], displayPathPrefix);
      }
      throw new UserError(`Unknown parameter "${qualifyDisplayPath(displayPathPrefix, [...displayPath, head].join("."))}". ${formatAvailableList(Object.keys(unwrappedSchema.shape).map((key2) => qualifyDisplayPath(displayPathPrefix, toDisplayPath([...displayPath, formatSegment(key2, casing)]))))}`);
    }
    case "record": {
      const [head, ...rest] = rawSegments;
      return resolveDynamicLeaf(unwrappedSchema.value, rest, casing, [...outputPath, head ?? ""], [...displayPath, head ?? ""], displayPathPrefix);
    }
    case "array": {
      const itemSchema = unwrapOptional2(unwrappedSchema.item);
      if (itemSchema.kind !== "object") {
        throw new UserError(`Array parameter "${qualifyDisplayPath(displayPathPrefix, toDisplayPath(displayPath))}" must use object items.`);
      }
      const [head, ...rest] = rawSegments;
      if (head === void 0 || !isNumericFixtureSelector(head)) {
        throw new UserError(`Array parameter "${qualifyDisplayPath(displayPathPrefix, toDisplayPath(displayPath))}" must use numeric indices.`);
      }
      return resolveDynamicLeaf(itemSchema, rest, casing, [...outputPath, head], [...displayPath, head], displayPathPrefix);
    }
    default:
      throw new UserError(`Unknown parameter "${qualifyDisplayPath(displayPathPrefix, [...displayPath, ...rawSegments].join("."))}". ${formatAvailableList(displayPath.length === 0 ? [] : [qualifyDisplayPath(displayPathPrefix, toDisplayPath(displayPath))])}`);
  }
}
function finalizeDynamicValue(schema, value, displayPath, errors) {
  const unwrappedSchema = unwrapOptional2(schema);
  if (value === void 0) {
    return void 0;
  }
  if (value === null && unwrappedSchema.nullable === true) {
    return null;
  }
  switch (unwrappedSchema.kind) {
    case "string":
    case "number":
    case "boolean":
    case "enum":
    case "json":
      return value;
    case "array": {
      const itemSchema = unwrapOptional2(unwrappedSchema.item);
      if (itemSchema.kind !== "object") {
        return value;
      }
      if (!isPlainObject4(value)) {
        errors.push({
          path: displayPath,
          message: `Invalid value for "${displayPath}". Expected indexed object entries, got ${describeReceived(value)}.`
        });
        return value;
      }
      const entries = Object.entries(value);
      const indices = entries.map(([key2]) => Number(key2)).sort((left, right) => left - right);
      if (indices.some((index) => !Number.isInteger(index) || index < 0)) {
        errors.push({
          path: displayPath,
          message: `Array parameter "${displayPath}" must use numeric indices.`
        });
        return value;
      }
      for (let index = 0; index < indices.length; index += 1) {
        if (indices[index] !== index) {
          errors.push({
            path: displayPath,
            message: `Array parameter "${displayPath}" must use contiguous indices starting at 0.`
          });
          return value;
        }
      }
      return indices.map((index) => finalizeDynamicValue(unwrappedSchema.item, value[String(index)], `${displayPath}.${index}`, errors));
    }
    case "object": {
      if (!isPlainObject4(value)) {
        errors.push({
          path: displayPath,
          message: `Invalid value for "${displayPath}". Expected an object, got ${describeReceived(value)}.`
        });
        return value;
      }
      const result = {};
      for (const [key2, rawChildSchema] of Object.entries(unwrappedSchema.shape)) {
        const childSchema = unwrapOptional2(rawChildSchema);
        const childValue = value[key2];
        const childDisplayPath = displayPath.length === 0 ? key2 : `${displayPath}.${key2}`;
        if (childValue === void 0) {
          if (childSchema.default !== void 0) {
            result[key2] = childSchema.default;
            continue;
          }
          if (rawChildSchema.kind === "optional") {
            continue;
          }
          errors.push({
            path: childDisplayPath,
            message: `Missing required parameter "${childDisplayPath}".`
          });
          continue;
        }
        result[key2] = finalizeDynamicValue(rawChildSchema, childValue, childDisplayPath, errors);
      }
      return result;
    }
    case "record": {
      if (!isPlainObject4(value)) {
        errors.push({
          path: displayPath,
          message: `Invalid value for "${displayPath}". Expected an object, got ${describeReceived(value)}.`
        });
        return value;
      }
      return Object.fromEntries(Object.entries(value).map(([key2, entryValue]) => [
        key2,
        finalizeDynamicValue(unwrappedSchema.value, entryValue, displayPath.length === 0 ? key2 : `${displayPath}.${key2}`, errors)
      ]));
    }
    default:
      errors.push({
        path: displayPath,
        message: formatUnsupportedDynamicSchemaMessage(formatCliSchemaKind(unwrappedSchema.kind), displayPath)
      });
      return value;
  }
}
function formatCliSchemaKind(kind) {
  return kind === "oneOf" ? "oneof" : kind;
}
function formatUnsupportedDynamicSchemaMessage(kind, displayPath) {
  return `Unsupported parameter type "${kind}" for "${displayPath}". Supported types: string, number, integer, boolean, array, object, enum, oneof.`;
}
function qualifyDisplayPath(prefix, displayPath) {
  if (prefix.length === 0) {
    return displayPath;
  }
  if (displayPath.length === 0) {
    return prefix;
  }
  return `${prefix}.${displayPath}`;
}
function parseDynamicValues(dynamicFields, rawArgv, casing, errors) {
  const rawValues = /* @__PURE__ */ new Map();
  const providedFieldIds = /* @__PURE__ */ new Set();
  const sortedFields = [...dynamicFields].sort((left, right) => right.optionPath.length - left.optionPath.length);
  for (let index = 0; index < rawArgv.length; index += 1) {
    const token = rawArgv[index] ?? "";
    if (!token.startsWith("--")) {
      continue;
    }
    const negated = token.startsWith("--no-");
    const normalized = negated ? `--${token.slice("--no-".length)}` : token;
    const equalsIndex = normalized.indexOf("=");
    const flagName = equalsIndex >= 0 ? normalized.slice(2, equalsIndex) : normalized.slice(2);
    const inlineValue = equalsIndex >= 0 ? normalized.slice(equalsIndex + 1) : void 0;
    const flagPath = flagName.split(".");
    const match = sortedFields.find((field) => {
      const optionPath2 = field.optionPath.map((segment) => formatSegment(segment, casing));
      return flagPath.length > optionPath2.length && optionPath2.every((segment, segmentIndex) => flagPath[segmentIndex] === segment);
    });
    if (match === void 0) {
      throw new UserError(`Unknown parameter "${flagName}". ${formatAvailableList(dynamicFields.map((field) => field.optionPathDisplay))}`);
    }
    const optionPath = match.optionPath.map((segment) => formatSegment(segment, casing));
    const remainder = flagPath.slice(optionPath.length);
    const leaf = resolveDynamicLeaf(match.schema, remainder, casing, [], [], match.displayPath);
    const rawStore = rawValues.get(match.id) ?? {};
    const label = `${match.displayPath}.${leaf.displayPath}`.replace(/^\./u, "");
    const parsed = negated && leaf.schema.kind === "boolean" ? {
      nextIndex: index,
      value: false
    } : consumeFieldValue(rawArgv, index, leaf.schema, label, inlineValue);
    setNestedValue(rawStore, leaf.path, parsed.value);
    rawValues.set(match.id, rawStore);
    providedFieldIds.add(match.id);
    index = parsed.nextIndex;
  }
  return {
    providedFieldIds,
    values: new Map(dynamicFields.filter((field) => rawValues.has(field.id)).map((field) => [
      field.id,
      finalizeDynamicValue(field.schema.kind === "record" ? field.schema : field.schema, rawValues.get(field.id), field.displayPath, errors)
    ]))
  };
}
async function enforceVariantConstraints(params, fields, dynamicFields, variants, resolvedFieldValues, providedDynamicFieldIds, providedFieldIds, shouldPrompt, errors) {
  const fieldById = new Map(fields.map((field) => [field.id, field]));
  const dynamicFieldById = new Map(dynamicFields.map((field) => [field.id, field]));
  const getAvailableBranchParameters = (branch) => [
    ...branch.fieldIds.map((fieldId) => fieldById.get(fieldId)).filter((field) => field !== void 0 && field.synthetic !== true).map((field) => field.displayPath),
    ...branch.dynamicFieldIds.map((fieldId) => dynamicFieldById.get(fieldId)).filter((field) => field !== void 0).map((field) => field.optionPathDisplay)
  ];
  for (const variant of variants) {
    let selectedBranchId = resolvedFieldValues.get(variant.controlFieldId);
    if (selectedBranchId === void 0 && shouldPrompt) {
      const controlField = fieldById.get(variant.controlFieldId);
      if (controlField !== void 0) {
        selectedBranchId = await promptForField(controlField);
        resolvedFieldValues.set(controlField.id, selectedBranchId);
        if (!controlField.synthetic) {
          setNestedValue(params, controlField.path, selectedBranchId);
        }
      }
    }
    if (selectedBranchId === void 0) {
      if (variant.optional) {
        continue;
      }
      errors.push({
        path: variant.controlDisplayPath,
        message: `Missing required parameter "${variant.controlDisplayPath}".`
      });
      continue;
    }
    const selectedBranch = variant.branches.find((branch) => branch.branchId === selectedBranchId);
    if (selectedBranch === void 0) {
      errors.push({
        path: variant.controlDisplayPath,
        message: `Invalid value for "${variant.controlDisplayPath}". Expected one of: ${variant.branches.map((branch) => branch.branchId).join(", ")}, got ${describeReceived(selectedBranchId)}.`
      });
      continue;
    }
    let hasInvalidBranchParameter = false;
    for (const branch of variant.branches) {
      if (branch.branchId === selectedBranch.branchId) {
        continue;
      }
      const invalidFieldId = branch.fieldIds.find((fieldId) => providedFieldIds.has(fieldId));
      if (invalidFieldId !== void 0) {
        const field = fieldById.get(invalidFieldId);
        if (field !== void 0) {
          errors.push({
            path: field.displayPath,
            message: `Unknown parameter "${field.displayPath}" for ${variant.controlDisplayPath}="${selectedBranch.branchId}". ${formatAvailableList(getAvailableBranchParameters(selectedBranch))}`
          });
          hasInvalidBranchParameter = true;
        }
      }
      const invalidDynamicFieldId = branch.dynamicFieldIds.find((fieldId) => providedDynamicFieldIds.has(fieldId));
      if (invalidDynamicFieldId !== void 0) {
        const field = dynamicFieldById.get(invalidDynamicFieldId);
        if (field !== void 0) {
          errors.push({
            path: field.displayPath,
            message: `Unknown parameter "${field.displayPath}" for ${variant.controlDisplayPath}="${selectedBranch.branchId}". ${formatAvailableList(getAvailableBranchParameters(selectedBranch))}`
          });
          hasInvalidBranchParameter = true;
        }
      }
    }
    if (hasInvalidBranchParameter) {
      continue;
    }
    for (const fieldId of selectedBranch.requiredFieldIds) {
      const field = fieldById.get(fieldId);
      if (field === void 0 || field.synthetic) {
        continue;
      }
      if (getNestedValue(params, field.path) !== void 0) {
        continue;
      }
      if (shouldPrompt) {
        const promptedValue = await promptForField(field);
        resolvedFieldValues.set(field.id, promptedValue);
        setNestedValue(params, field.path, promptedValue);
        providedFieldIds.add(field.id);
        continue;
      }
      errors.push({
        path: field.displayPath,
        message: `Missing required parameter "${field.displayPath}" for ${variant.controlDisplayPath}="${selectedBranch.branchId}". ${formatAvailableList(getAvailableBranchParameters(selectedBranch))}`
      });
    }
    for (const fieldId of selectedBranch.requiredDynamicFieldIds) {
      const field = dynamicFieldById.get(fieldId);
      if (field === void 0) {
        continue;
      }
      if (getNestedValue(params, field.path) !== void 0) {
        continue;
      }
      errors.push({
        path: field.displayPath,
        message: `Missing required parameter "${field.displayPath}" for ${variant.controlDisplayPath}="${selectedBranch.branchId}". ${formatAvailableList(getAvailableBranchParameters(selectedBranch))}`
      });
    }
  }
}
async function resolveParams(fields, dynamicFields, variants, positionalValues, optionValues, rawArgv, casing, presetPath, shouldPrompt) {
  const params = {};
  const presetValues = typeof presetPath === "string" && presetPath.length > 0 ? await loadPresetValues(fields, presetPath) : {};
  const providedFieldIds = /* @__PURE__ */ new Set();
  const resolvedFieldValues = /* @__PURE__ */ new Map();
  const errors = [];
  for (const field of fields) {
    let value;
    let source;
    if (field.positionalIndex !== void 0) {
      const positionalValue = positionalValues[field.positionalIndex];
      if (field.schema.kind === "array") {
        if (Array.isArray(positionalValue) && positionalValue.length > 0) {
          const itemSchema = unwrapOptional2(field.schema.item);
          if (itemSchema.kind === "array" || itemSchema.kind === "object") {
            throw new UserError(`Array parameter "${field.displayPath}" must use scalar items.`);
          }
          value = positionalValue.map((item) => parseScalarValue(String(item), itemSchema, field.displayPath));
          source = "positional";
        }
      } else if (typeof positionalValue === "string" && positionalValue.length > 0) {
        value = parseFieldInputValue(positionalValue, field.schema, field.displayPath);
        source = "positional";
      }
    }
    if (value === void 0 && Object.prototype.hasOwnProperty.call(optionValues, field.commanderOptionAttribute) && hasFieldValue(optionValues[field.commanderOptionAttribute])) {
      value = normalizeCommanderOptionValue(optionValues[field.commanderOptionAttribute]);
      source = "option";
    }
    if (value === void 0 && field.commanderOptionAttribute === field.optionAttribute && Object.prototype.hasOwnProperty.call(optionValues, field.optionAttribute) && hasFieldValue(optionValues[field.optionAttribute])) {
      value = normalizeCommanderOptionValue(optionValues[field.optionAttribute]);
      source = "option";
    }
    if (value === void 0 && field.optionFlag === "--verbose" && Object.prototype.hasOwnProperty.call(optionValues, field.optionAttribute) && hasFieldValue(optionValues[field.optionAttribute])) {
      value = normalizeCommanderOptionValue(optionValues[field.optionAttribute]);
      source = "option";
    }
    if (value === void 0 && Object.prototype.hasOwnProperty.call(presetValues, field.optionAttribute)) {
      value = presetValues[field.optionAttribute];
      source = "preset";
    }
    if (source === "option") {
      const parsed = parseOptionFieldValue(field, value, errors);
      if (!parsed.ok) {
        continue;
      }
      value = parsed.value;
    }
    if (value === void 0 && shouldPrompt && !field.optional) {
      value = await promptForField(field);
      source = "prompt";
    }
    if (value === void 0 && field.hasDefault) {
      value = field.defaultValue;
      source = "default";
    }
    if (value === void 0) {
      if (field.optional) {
        continue;
      }
      errors.push({
        path: field.displayPath,
        message: `Missing required parameter "${field.displayPath}".`
      });
      continue;
    }
    resolvedFieldValues.set(field.id, value);
    if (source !== void 0 && source !== "default") {
      providedFieldIds.add(field.id);
    }
    if (!field.synthetic) {
      setNestedValue(params, field.path, value);
    }
  }
  const dynamicResults = dynamicFields.length > 0 ? parseDynamicValues(dynamicFields, rawArgv, casing, errors) : {
    providedFieldIds: /* @__PURE__ */ new Set(),
    values: /* @__PURE__ */ new Map()
  };
  for (const field of dynamicFields) {
    let value = dynamicResults.values.get(field.id);
    if (value === void 0 && field.hasDefault) {
      value = field.defaultValue;
    }
    if (value === void 0) {
      if (field.optional || field.variantId !== void 0) {
        continue;
      }
      errors.push({
        path: field.displayPath,
        message: `Missing required parameter "${field.displayPath}".`
      });
      continue;
    }
    setNestedValue(params, field.path, value);
  }
  await enforceVariantConstraints(params, fields, dynamicFields, variants, resolvedFieldValues, dynamicResults.providedFieldIds, providedFieldIds, shouldPrompt, errors);
  throwValidationErrors(errors);
  return params;
}
function getResolvedFlags(command) {
  const flags = command.optsWithGlobals();
  return flags;
}
async function executeCommand(state, services, requirementOptions, runtimeFetch, runtimeOptions, onErrorReportContext) {
  const logger2 = createLogger();
  const primitives = {
    logger: logger2,
    renderTable,
    getTheme,
    note
  };
  const optionValues = state.actionCommand.optsWithGlobals();
  const resolvedFlags = optionValues;
  const output = resolveOutput(resolvedFlags);
  const shouldPrompt = !resolvedFlags.yes && Boolean(process.stdin.isTTY);
  const runtime = await resolveFixtureRuntime(state.command, services, requirementOptions, runtimeFetch);
  const preflightContext = {
    ...runtime.services,
    secrets: runtime.secrets,
    fetch: runtime.fetch,
    fs: runtime.fs,
    env: runtime.env,
    progress(message2) {
      logger2.info(message2);
    }
  };
  let runtimeSecrets;
  let resolvedParams;
  try {
    await withOutputFormat2(output, async () => {
      await assertCommandRequirements(state.command, preflightContext, runtime.requirementOptions);
      const params = await resolveParams(state.fields, state.dynamicFields, state.variants, state.positionalValues, optionValues, state.rawArgv, state.casing, state.presetsEnabled ? resolvedFlags.preset : void 0, shouldPrompt);
      resolvedParams = params;
      runtimeSecrets = runtime.secrets;
      const context = {
        ...preflightContext,
        params
      };
      if (state.command.confirm && !state.command.humanInLoop && !resolvedFlags.yes && process.stdin.isTTY) {
        for (const field of state.fields) {
          const value = field.path.reduce((current, segment) => current && typeof current === "object" ? current[segment] : void 0, params);
          if (value !== void 0) {
            logger2.resolved(field.displayPath, formatResolvedValue(value));
          }
        }
        const proceed = await confirm({
          message: "Proceed?",
          initialValue: true
        });
        if (isCancel(proceed)) {
          cancel("Operation cancelled.");
          throw new UserError("Operation cancelled.");
        }
        if (proceed !== true) {
          throw new UserError("Operation cancelled.");
        }
      }
      const result = await invokeWithHumanInLoop(state.command, context, runtimeOptions, state.commandPath);
      if (output === "rich" && runtime.isFixture) {
        writeRichHeader(`${state.command.name} (fixture)`);
      }
      if (isHumanInLoopPending(result)) {
        renderHumanInLoopPending(result);
        return;
      }
      const renderStatus = renderResult(state.command, result, output, primitives);
      if (renderStatus.mcpError) {
        process.exitCode = 1;
      }
    });
  } catch (error3) {
    onErrorReportContext?.({
      command: state.command,
      commandPath: state.commandPath,
      params: resolvedParams,
      secrets: runtimeSecrets ?? runtime.secrets
    });
    throw error3;
  }
}
function isStringRecord(value) {
  return isPlainObject4(value) && Object.values(value).every((entry) => typeof entry === "string");
}
function isHttpErrorLike(error3) {
  if (!isPlainObject4(error3)) {
    return false;
  }
  if (error3.name !== "HttpError" || typeof error3.message !== "string") {
    return false;
  }
  const request = error3.request;
  const response = error3.response;
  return isPlainObject4(request) && typeof request.method === "string" && typeof request.url === "string" && isStringRecord(request.headers) && isPlainObject4(response) && typeof response.status === "number" && typeof response.statusText === "string" && isStringRecord(response.headers) && hasOwnProperty3(response, "body");
}
function hasTypedOptionalField(value, field, type) {
  return !hasOwnProperty3(value, field) || typeof value[field] === type;
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function isProblemDetailsLike(body) {
  if (!isPlainObject4(body)) {
    return false;
  }
  if (!hasTypedOptionalField(body, "type", "string")) {
    return false;
  }
  if (!hasTypedOptionalField(body, "title", "string")) {
    return false;
  }
  if (!hasTypedOptionalField(body, "status", "number")) {
    return false;
  }
  if (!hasTypedOptionalField(body, "detail", "string")) {
    return false;
  }
  if (!hasTypedOptionalField(body, "instance", "string")) {
    return false;
  }
  return hasOwnNonEmptyString(body, "title") || hasOwnNonEmptyString(body, "detail");
}
function isGraphQLErrorEnvelopeLike(body) {
  if (!isPlainObject4(body) || !Array.isArray(body.errors) || body.errors.length === 0) {
    return false;
  }
  return body.errors.every((error3) => {
    if (!isPlainObject4(error3) || typeof error3.message !== "string") {
      return false;
    }
    if (hasOwnProperty3(error3, "path")) {
      const pathValue = error3.path;
      if (!Array.isArray(pathValue) || !pathValue.every((entry) => typeof entry === "string" || typeof entry === "number")) {
        return false;
      }
    }
    if (hasOwnProperty3(error3, "extensions")) {
      if (!isPlainObject4(error3.extensions)) {
        return false;
      }
      if (hasOwnProperty3(error3.extensions, "code") && typeof error3.extensions.code !== "string") {
        return false;
      }
    }
    return true;
  });
}
function hasOwnProperty3(value, name) {
  return Object.prototype.hasOwnProperty.call(value, name);
}
function hasOwnNonEmptyString(value, name) {
  return hasOwnProperty3(value, name) && isNonEmptyString(value[name]);
}
function styleHttpErrorLine(value, style) {
  return process.stdout.isTTY !== true ? value : style(value);
}
function formatHttpErrorStatus(value) {
  return styleHttpErrorLine(value, text.error);
}
function formatProblemDetailsBody(body) {
  const lines = [];
  if (hasOwnNonEmptyString(body, "title")) {
    lines.push(`Problem: ${body.title}`);
  }
  if (hasOwnNonEmptyString(body, "detail")) {
    lines.push(`Detail:  ${body.detail}`);
  }
  if (hasOwnProperty3(body, "type") && body.type !== void 0) {
    lines.push(`Type:    ${body.type}`);
  }
  if (hasOwnProperty3(body, "instance") && body.instance !== void 0) {
    lines.push(`Instance: ${body.instance}`);
  }
  if (hasOwnProperty3(body, "status") && body.status !== void 0) {
    lines.push(`Status:  ${body.status}`);
  }
  return lines.join("\n");
}
function formatGraphQLErrorEnvelopeBody(body) {
  return body.errors.map((error3) => {
    const lines = [`GraphQL error: ${error3.message}`];
    if (hasOwnProperty3(error3, "path") && error3.path !== void 0) {
      lines.push(`  at path: ${error3.path.join(".")}`);
    }
    if (hasOwnProperty3(error3, "extensions") && error3.extensions !== void 0 && hasOwnProperty3(error3.extensions, "code") && error3.extensions.code !== void 0) {
      lines.push(`  code:    ${error3.extensions.code}`);
    }
    return lines.join("\n");
  }).join("\n\n");
}
function formatHttpErrorBody(body) {
  const redactedBody = redactHttpBody(body);
  if (typeof redactedBody === "string") {
    return redactedBody;
  }
  if (isProblemDetailsLike(redactedBody)) {
    return formatProblemDetailsBody(redactedBody);
  }
  if (isGraphQLErrorEnvelopeLike(redactedBody)) {
    return formatGraphQLErrorEnvelopeBody(redactedBody);
  }
  const serialized = JSON.stringify(redactedBody, null, 2);
  return serialized === void 0 ? String(redactedBody) : serialized;
}
function indentHttpErrorBlock(value) {
  return value.split("\n").map((line) => `  ${line}`).join("\n");
}
function formatHttpHeaderValue(name, value) {
  return redactHttpHeaderValue(name, value);
}
function formatHttpErrorHeaders(headers) {
  return Object.entries(headers).map(([name, value]) => `  ${name}: ${formatHttpHeaderValue(name, value)}`);
}
function formatHttpErrorSnippet(body) {
  return formatHttpErrorBody(body).replace(/\s+/g, " ").trim().slice(0, 200);
}
function renderHttpError(error3, options) {
  const detailed = options.verbose || options.debugStackMode !== void 0;
  const lines = [
    styleHttpErrorLine(`Request:  ${error3.request.method} ${error3.request.url}`, text.muted)
  ];
  if (detailed) {
    lines.push("", "Request headers:", ...formatHttpErrorHeaders(error3.request.headers), "");
    if (error3.request.body !== void 0) {
      lines.push("Request body:", indentHttpErrorBlock(formatHttpErrorBody(error3.request.body)), "");
    }
  }
  lines.push(formatHttpErrorStatus(`Status:   ${error3.response.status} ${error3.response.statusText}`));
  if (detailed) {
    lines.push("", "Response headers:", ...formatHttpErrorHeaders(error3.response.headers), "", "Response body:", indentHttpErrorBlock(formatHttpErrorBody(error3.response.body)));
  } else {
    lines.push("", `Response body: ${formatHttpErrorSnippet(error3.response.body)}`, "Re-run with --verbose to see headers and full body.");
  }
  process.stderr.write(`${lines.join("\n")}
`);
  const stack = error3 instanceof Error ? error3.stack : void 0;
  if (options.debugStackMode !== void 0 && stack) {
    process.stderr.write(`${formatDebugStack(stack, options.debugStackMode)}
`);
  }
}
async function handleRunError(error3, options) {
  const logger2 = createLogger();
  await withOutputFormat2(options.output, async () => {
    if (error3 instanceof UserError) {
      renderCliErrorPattern(options.userErrorPattern === "usage" ? {
        kind: "usage",
        message: error3.message,
        rootUsageName: options.rootUsageName,
        commandPath: options.commandPath
      } : {
        kind: "runtime-user",
        message: error3.message
      });
      return;
    }
    if (error3 instanceof Error && error3.name === "ToolcraftBugError") {
      renderCliErrorPattern({
        kind: "toolcraft-bug",
        error: error3,
        debugStackMode: options.debugStackMode
      });
      return;
    }
    if (error3 instanceof CommanderError) {
      process.exitCode = error3.exitCode;
      if (error3.code === "commander.helpDisplayed" || error3.code === "commander.version") {
        return;
      }
      if (error3.code === "commander.unknownCommand") {
        logger2.error(appendUsagePointer(formatUnknownCommandError(error3, options.program, options.argv ?? process.argv), {
          rootUsageName: options.rootUsageName,
          commandPath: options.commandPath
        }));
        return;
      }
      if (error3.code === "commander.unknownOption") {
        const argv = options.argv ?? process.argv;
        logger2.error(appendUsagePointer(formatUnknownOptionError(error3, options.program, argv), {
          rootUsageName: options.rootUsageName,
          commandPath: options.commandPath.length > 0 ? options.commandPath : findCurrentCommanderCommandPath(options.program, argv)
        }));
        return;
      }
      logger2.error(appendUsagePointer(formatCommanderErrorMessage(error3), {
        rootUsageName: options.rootUsageName,
        commandPath: options.commandPath.length > 0 ? options.commandPath : findCurrentCommanderCommandPath(options.program, options.argv ?? process.argv)
      }));
      return;
    }
    if (isHttpErrorLike(error3)) {
      renderHttpError(error3, options);
      process.exitCode = 1;
      return;
    }
    const message2 = error3 instanceof Error ? error3.message : String(error3);
    renderCliErrorPattern({
      kind: "unexpected",
      message: message2,
      stack: error3 instanceof Error ? error3.stack : void 0,
      debugStackMode: options.debugStackMode
    });
  });
}
function formatCommanderErrorMessage(error3) {
  return error3.message.startsWith("error:") ? error3.message : `error: ${error3.message}`;
}
function formatInvalidEnumMessage(label, value, values, opts = {}) {
  const suggestions = suggest(value, opts.candidates ?? values.map((candidate) => String(candidate)), opts);
  const suggestionLine = suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?
` : " ";
  return `Invalid value for "${label}".${suggestionLine}Expected one of: ${values.map((candidate) => String(candidate)).join(", ")}, got ${describeReceived(value)}.`;
}
function formatUnknownCommandError(error3, program2, argv) {
  const input = extractQuotedCommanderValue(error3.message) ?? "";
  const currentCommand = program2 === void 0 ? void 0 : findCurrentCommanderCommand(program2, argv);
  return formatUnknownCommandMessage(input, currentCommand);
}
function appendUsagePointer(message2, options) {
  if (message2.includes("--help")) {
    return message2;
  }
  const helpTarget = options.commandPath.length === 0 ? options.rootUsageName : `${options.rootUsageName} ${options.commandPath}`;
  return `${message2}
Run ${helpTarget} --help for usage.`;
}
function formatCliCommandPath(commandPath) {
  return commandPath.split(".").filter((segment) => segment.length > 0).join(" ");
}
function formatUnknownCommandMessage(input, currentCommand) {
  const suggestions = currentCommand === void 0 ? [] : suggest(input, currentCommand.commands.map((command) => command.name()));
  return formatSuggestionMessage(`Unknown command "${input}".`, suggestions);
}
function formatUnknownOptionError(error3, program2, argv) {
  const input = extractQuotedCommanderValue(error3.message) ?? "";
  const currentCommand = program2 === void 0 ? void 0 : findCurrentCommanderCommand(program2, argv);
  const suggestions = currentCommand === void 0 ? [] : suggest(input, currentCommand.options.map((option) => option.long).filter((flag) => flag !== void 0));
  return formatSuggestionMessage(`Unknown option "${input}".`, suggestions);
}
function formatSuggestionMessage(message2, suggestions) {
  if (suggestions.length === 0) {
    return message2;
  }
  return `${message2}
Did you mean: ${suggestions.join(", ")}?`;
}
function extractQuotedCommanderValue(message2) {
  const singleQuoted = extractBetweenQuotes(message2, "'");
  if (singleQuoted !== void 0) {
    return singleQuoted;
  }
  return extractBetweenQuotes(message2, '"');
}
function extractBetweenQuotes(message2, quote) {
  const start = message2.indexOf(quote);
  if (start === -1) {
    return void 0;
  }
  const end = message2.indexOf(quote, start + 1);
  if (end === -1) {
    return void 0;
  }
  return message2.slice(start + 1, end);
}
function resolveDebugStackMode(value) {
  if (value === true || value === "trim") {
    return "trim";
  }
  if (value === "raw") {
    return "raw";
  }
  return void 0;
}
function getDebugStackModeFromArgv(argv) {
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === void 0) {
      continue;
    }
    if (token === "--debug") {
      return "trim";
    }
    if (token === "--debug=raw") {
      return "raw";
    }
  }
  return void 0;
}
function findCurrentCommanderCommand(program2, argv) {
  let current = program2;
  const tokens = argv.slice(2);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === void 0 || token === "--") {
      break;
    }
    if (token.startsWith("-")) {
      const option = current.options.find((candidate) => candidate.long === token || candidate.short === token);
      if (option?.required === true && !token.includes("=")) {
        index += 1;
      }
      continue;
    }
    const child = current.commands.find((command) => command.name() === token || command.aliases().includes(token));
    if (child === void 0) {
      break;
    }
    current = child;
  }
  return current;
}
function findCurrentCommanderCommandPath(program2, argv) {
  if (program2 === void 0) {
    return "";
  }
  let current = program2;
  const pathSegments = [];
  const tokens = argv.slice(2);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === void 0 || token === "--" || token.startsWith("-")) {
      break;
    }
    const child = current.commands.find((command) => command.name() === token || command.aliases().includes(token));
    if (child === void 0) {
      break;
    }
    current = child;
    pathSegments.push(child.name());
  }
  return pathSegments.join(" ");
}
function findUnknownCommanderCommand(program2, argv) {
  let current = program2;
  const pathSegments = [];
  const tokens = argv.slice(2);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === void 0 || token === "--") {
      return void 0;
    }
    if (token.startsWith("-")) {
      const option = current.options.find((candidate) => candidate.long === token || candidate.short === token);
      if (option?.required === true && !token.includes("=")) {
        index += 1;
      }
      continue;
    }
    if (getToolcraftHiddenDefaultNames(current).includes(token) || getToolcraftReservedChildNames(current).includes(token)) {
      return {
        input: token,
        currentCommand: current,
        commandPath: pathSegments.join(" ")
      };
    }
    if (current.commands.length === 0 || getDefaultCommanderCommandName(current) !== void 0) {
      return void 0;
    }
    const child = current.commands.find((command) => command.name() === token || command.aliases().includes(token));
    if (child === void 0) {
      return {
        input: token,
        currentCommand: current,
        commandPath: pathSegments.join(" ")
      };
    }
    current = child;
    pathSegments.push(child.name());
  }
  return void 0;
}
function getDefaultCommanderCommandName(command) {
  const candidate = command;
  return typeof candidate._defaultCommandName === "string" ? candidate._defaultCommandName : void 0;
}
function configureCommanderSuggestionOutput(command) {
  command.exitOverride();
  command.configureOutput({
    outputError: (message2, write) => {
      if (message2.includes("unknown command") || message2.includes("unknown option")) {
        return;
      }
      write(message2);
    }
  });
  command.commands.forEach((child) => configureCommanderSuggestionOutput(child));
}
async function runCLI(roots, options = {}) {
  enableSourceMaps();
  const normalizedRoot = normalizeRoots(roots, process.argv);
  const root2 = options.approvals === true ? mergeApprovalsGroup(normalizedRoot) : normalizedRoot;
  await resolveMcpProxies(root2, { projectRoot: options.projectRoot });
  const casing = options.casing ?? "kebab";
  const services = options.services ?? {};
  const runtimeOptions = options.humanInLoop ?? {};
  const runtimeFetch = options.fetch ?? globalThis.fetch;
  const version = options.version ?? findEntrypointPackageMetadata(process.argv[1])?.version;
  const rootUsageName = options.rootUsageName ?? inferProgramName(process.argv);
  const controls = resolveCLIControls(options.controls);
  const servicesWithBuiltIns = {
    ...services,
    runtimeOptions,
    root: root2
  };
  const requirementOptions = {
    apiVersion: options.apiVersion
  };
  validateServices(services);
  if (hasHelpFlag(process.argv)) {
    await renderGeneratedHelp(root2, process.argv, { ...options, version });
    return;
  }
  const program2 = new Command();
  program2.name(root2.name);
  program2.exitOverride();
  program2.showHelpAfterError();
  program2.addHelpCommand(false);
  const presetsEnabled = options.presets === true;
  const globalLongOptionFlags = getGlobalLongOptionFlags(presetsEnabled, version !== void 0, controls);
  addGlobalOptions(program2, presetsEnabled, controls);
  if (version !== void 0) {
    program2.version(version, "--version");
  }
  Reflect.set(program2, "_toolcraftReservedChildNames", root2.children.filter((child) => !isNodeVisibleInScope(child, "cli")).flatMap((child) => getNodeCommandNames(child)));
  let lastActionCommand;
  let resolvedCommandPath = "";
  let errorReportContext;
  const execute = async (state) => {
    lastActionCommand = state.actionCommand;
    resolvedCommandPath = formatCliCommandPath(state.commandPath);
    await executeCommand(state, servicesWithBuiltIns, requirementOptions, runtimeFetch, runtimeOptions, (context) => {
      errorReportContext = context;
    });
  };
  const rootChildNames = new Set(root2.children.filter((candidate) => isNodeVisibleInScope(candidate, "cli")).map((candidate) => candidate.name));
  for (const child of root2.children) {
    const command = createNodeCommand(child, casing, globalLongOptionFlags, execute, presetsEnabled, controls);
    if (command === null) {
      continue;
    }
    const isDefaultChild = root2.default !== void 0 && root2.default.scope.includes("cli") && (command.name() === root2.default.name || command.aliases().includes(root2.default.name));
    addCommanderChild(program2, command, isDefaultChild, rootChildNames);
  }
  configureCommanderSuggestionOutput(program2);
  const unknownCommand = findUnknownCommanderCommand(program2, process.argv);
  if (unknownCommand !== void 0) {
    createLogger().error(appendUsagePointer(formatUnknownCommandMessage(unknownCommand.input, unknownCommand.currentCommand), {
      rootUsageName,
      commandPath: unknownCommand.commandPath
    }));
    process.exitCode = 1;
    return;
  }
  try {
    await program2.parseAsync(process.argv);
  } catch (error3) {
    if (error3 instanceof ApprovalDeclinedError) {
      renderApprovalDeclined(error3);
      return;
    }
    const resolvedFlags = lastActionCommand ? getResolvedFlags(lastActionCommand) : void 0;
    const report = await writeErrorReport({
      argv: process.argv,
      command: errorReportContext?.command,
      commandPath: errorReportContext?.commandPath ?? resolvedCommandPath,
      env: process.env,
      error: error3,
      errorReports: options.errorReports,
      params: errorReportContext?.params,
      projectRoot: options.projectRoot,
      secrets: errorReportContext?.secrets,
      version
    });
    if (report !== void 0) {
      process.stderr.write(`Saved error report to ${report.displayPath}
`);
    }
    await handleRunError(error3, {
      debugStackMode: resolvedFlags !== void 0 ? resolveDebugStackMode(resolvedFlags.debug) : getDebugStackModeFromArgv(process.argv),
      output: resolvedFlags !== void 0 ? resolveOutput(resolvedFlags) : resolveOutputFromArgv(process.argv),
      verbose: resolvedFlags ? Boolean(resolvedFlags.verbose) : process.argv.includes("--verbose"),
      program: program2,
      argv: process.argv,
      rootUsageName,
      commandPath: resolvedCommandPath,
      userErrorPattern: errorReportContext?.params === void 0 ? "usage" : "runtime-user"
    });
  }
}

// src/root.js
import { execFile as execFile2 } from "node:child_process";
import { readFile as readFile4, stat } from "node:fs/promises";
import { homedir as homedir2 } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { promisify as promisify2 } from "node:util";
var artifactIdPattern = /^[0-9a-fA-F-]{36}$/;
var execFilePromise = promisify2(execFile2);
var artifactShellStyle = "<style>:root{color-scheme:light}body{margin:0;padding:20px;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#faf9f5;color:#141413}img{max-width:100%}</style>";
function artifactId(value) {
  if (artifactIdPattern.test(value)) return value;
  const url = new URL(value);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1];
}
function lineText(value) {
  return value.replace(/[\t\r\n]+/g, " ").trim();
}
function sourceKind(path10) {
  const extension = extname(path10).toLowerCase();
  if (extension === ".html" || extension === ".htm") return "html";
  if (extension === ".md") return "markdown";
  throw new Error(`Claude Code artifacts can publish .html, .htm, or .md files: ${path10}`);
}
async function validateArtifactSource(file) {
  const path10 = resolve(file);
  const fileStat = await stat(path10);
  const contents = await readFile4(path10, "utf8");
  const kind = sourceKind(path10);
  const externalRequests = kind === "html" ? [...contents.matchAll(/\b(?:src|href)\s*=\s*["']https?:\/\//gi)].map((match) => match[0]) : [];
  const dynamicRequests = kind === "html" ? [...contents.matchAll(/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b/g)].map((match) => match[0]) : [];
  return {
    path: path10,
    kind,
    bytes: fileStat.size,
    under_size_limit: fileStat.size <= 16 * 1024 * 1024,
    external_reference_count: externalRequests.length,
    dynamic_request_count: dynamicRequests.length,
    publishable: fileStat.size <= 16 * 1024 * 1024
  };
}
function escapeHtml2(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  for (const line of lines) {
    if (line.startsWith("```")) {
      closeList();
      html.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
    } else if (inCode) {
      html.push(escapeHtml2(line));
    } else if (/^#{1,6}\s+/.test(line)) {
      closeList();
      const level = line.match(/^#+/)[0].length;
      html.push(`<h${level}>${escapeHtml2(line.slice(level).trim())}</h${level}>`);
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml2(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html.push(`<p>${escapeHtml2(line.trim())}</p>`);
    }
  }
  closeList();
  if (inCode) html.push("</code></pre>");
  return html.join("\n");
}
function htmlTitle(contents) {
  const match = contents.slice(0, 32768).replace(/<!--[\s\S]*?(?:-->|$)/g, "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (match === null) return null;
  return lineText(match[1].replace(/<[^>]*>/g, ""));
}
async function artifactContent(path10, kind) {
  const source = await readFile4(path10, "utf8");
  if (kind === "markdown") {
    return `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">${artifactShellStyle}</head><body>
${markdownToHtml(source)}
</body></html>`;
  }
  if (/<!doctype\s+html/i.test(source) || /<html[\s>]/i.test(source)) return source;
  return `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">${artifactShellStyle}</head><body>
${source}
</body></html>`;
}
async function artifactTitle(path10, title) {
  if (title !== void 0) return title;
  const source = await readFile4(path10, "utf8");
  return htmlTitle(source) ?? basename(path10, extname(path10));
}
async function oauthToken() {
  if (process.env["CLAUDE_CODE_OAUTH_TOKEN"]) return process.env["CLAUDE_CODE_OAUTH_TOKEN"];
  if (process.platform === "darwin") {
    const result = await execFilePromise("security", ["find-generic-password", "-a", process.env["USER"], "-w", "-s", "Claude Code-credentials"], { encoding: "utf8" });
    return JSON.parse(result.stdout)["claudeAiOauth"]["accessToken"];
  }
  const configDir = process.env["CLAUDE_CONFIG_DIR"] ?? join(homedir2(), ".claude");
  return JSON.parse(await readFile4(join(configDir, ".credentials.json"), "utf8"))["claudeAiOauth"]["accessToken"];
}
function artifactsApiBaseUrl() {
  if (process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"] !== void 0) return process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"].replace(/\/+$/, "");
  return "https://api.anthropic.com";
}
async function frameRequest(method, path10, body) {
  const response = await fetch(`${artifactsApiBaseUrl()}${path10}`, {
    method,
    headers: {
      authorization: `Bearer ${await oauthToken()}`,
      "content-type": "application/json",
      "X-Frame-CP": "go"
    },
    ...body !== void 0 ? { body: JSON.stringify(body) } : {}
  });
  const text4 = await response.text();
  const responseBody = text4 === "" ? null : JSON.parse(text4);
  if (response.status === 409 && responseBody?.["conflict"] === true) throw new Error(`conflict: live version is ${responseBody["live"]}`);
  if (response.status < 200 || response.status >= 300) throw new Error(`${method} ${path10} ${response.status}: ${JSON.stringify(responseBody)}`);
  return responseBody;
}
async function artifactAssetContent(slug, version, assetToken) {
  const response = await fetch(`https://${slug}.frame.claudeusercontent.com/_f/${version}/?__frame_t=${encodeURIComponent(assetToken)}`, {
    redirect: "manual"
  });
  const text4 = await response.text();
  if (response.status < 200 || response.status >= 300) throw new Error(`asset ${response.status}: ${text4.slice(0, 200)}`);
  return text4.replace(`<base href="/_f/${version}/">`, "");
}
function artifactMetadata(slug, body) {
  return {
    artifact_url: `https://claude.ai/code/artifact/${slug}`,
    artifact_id: slug,
    title: body["title"],
    favicon: body["favicon"],
    version: body["ver"],
    live: body["live"],
    role: body["perm"]?.["role"],
    share_mode: body["perm"]?.["mode"],
    author_email: body["author"]?.["email"],
    created_at: body["created_at"],
    updated_at: body["updated_at"],
    history: body["history"],
    versions: body["versions"]
  };
}
async function publishDirect(path10, kind, slug, title, favicon, label, baseVersion) {
  const content = await artifactContent(path10, kind);
  const body = {
    title: await artifactTitle(path10, title),
    favicon,
    content,
    ...slug !== void 0 ? { slug } : {},
    ...label !== void 0 ? { label } : {},
    ...baseVersion !== void 0 ? { baseVersion } : {}
  };
  const responseBody = await frameRequest("POST", "/api/frame/deploy/direct", body);
  const responseSlug = responseBody["slug"];
  const version = responseBody["version"];
  if (responseSlug === void 0 || version === void 0) throw new Error(`deploy returned incomplete response: ${JSON.stringify(responseBody)}`);
  return {
    artifact_url: `https://claude.ai/code/artifact/${responseSlug}`,
    artifact_id: responseSlug,
    version,
    read: responseBody["read"],
    shared: responseBody["shared"]
  };
}
function renderJson(value) {
  return value;
}
function renderLines(lines) {
  return lines.filter((line) => line !== "").join("\n");
}
function formatTimestamp2(value) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(new Date(value));
}
function renderPublish(value) {
  return renderLines([
    `artifact: ${value.artifact_url}`,
    `source:   ${value.source_path}`,
    `version:  ${value.version}`
  ]);
}
function renderRead(value) {
  return renderLines([
    `artifact: ${value.artifact_url}`,
    `title:    ${value.title}`,
    `version:  ${value.version}`,
    `role:     ${value.role}`,
    `updated:  ${value.updated_at}`,
    value.content_html !== void 0 ? "" : "",
    value.content_html !== void 0 ? "```html" : "",
    value.content_html !== void 0 ? value.content_html : "",
    value.content_html !== void 0 ? "```" : ""
  ]);
}
function renderList2(value) {
  if (value.artifacts.length === 0) return "no code artifacts";
  return value.artifacts.map((artifact, index) => renderLines([
    `${index + 1}. ${artifact.title ?? "(untitled)"}`,
    `   id:      ${artifact.artifact_id}`,
    `   url:     ${artifact.artifact_url}`,
    `   updated: ${artifact.updated_at_display}`,
    artifact.label !== void 0 ? `   label:   ${artifact.label}` : "",
    `   owner:   ${artifact.owner_email}`,
    `   access:  ${artifact.relation}`,
    `   views:   ${artifact.view_count} total, ${artifact.unique_view_count} unique`
  ])).join("\n\n");
}
function renderDelete(value) {
  return `deleted: ${value.artifact_url}`;
}
var publishParams = {
  file: S.String({ description: "Local .html, .htm, or .md file to publish." }),
  favicon: S.String({ description: "One or two emoji for the artifact browser-tab icon." }),
  title: S.Optional(S.String({ description: "Artifact title. Defaults to the HTML title or file basename." })),
  label: S.Optional(S.String({ description: "Version label shown in the artifact version picker." }))
};
var createCommand2 = defineCommand({
  name: "create",
  aliases: ["publish"],
  description: "Publish a new Claude Code artifact from a local file using the current Claude Code login without an LLM turn.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["file"],
  params: S.Object(publishParams),
  handler: async ({ params }) => {
    const validation = await validateArtifactSource(params.file);
    if (!validation.publishable) throw new Error(`Artifact source is not publishable: ${validation.path}`);
    const published = await publishDirect(validation.path, validation.kind, void 0, params.title, params.favicon, params.label, void 0);
    return { ...published, source_path: validation.path };
  },
  render: { json: renderJson, markdown: renderPublish, rich: (value, primitives) => primitives.logger.message(renderPublish(value), "") }
});
var updateCommand = defineCommand({
  name: "update",
  description: "Publish a new version of an existing Claude Code artifact from a local file.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["artifact", "file"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." }),
    baseVersion: S.Optional(S.String({ description: "Version to overwrite from. Pass the current version when enforcing conflict checks." })),
    ...publishParams
  }),
  handler: async ({ params }) => {
    const validation = await validateArtifactSource(params.file);
    if (!validation.publishable) throw new Error(`Artifact source is not publishable: ${validation.path}`);
    const published = await publishDirect(validation.path, validation.kind, artifactId(params.artifact), params.title, params.favicon, params.label, params.baseVersion);
    return { ...published, artifact_id: artifactId(params.artifact), source_path: validation.path };
  },
  render: { json: renderJson, markdown: renderPublish, rich: (value, primitives) => primitives.logger.message(renderPublish(value), "") }
});
var readCommand = defineCommand({
  name: "read",
  description: "Read a Claude Code artifact from the Claude frame API.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["artifact"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." }),
    content: S.Optional(S.Boolean({ description: "Include current HTML content." })),
    contentVersion: S.Optional(S.String({ description: "Artifact version to fetch when content is included." }))
  }),
  handler: async ({ params }) => {
    const id = artifactId(params.artifact);
    const response = await frameRequest("GET", `/api/frame/${id}`, void 0);
    const metadata = artifactMetadata(id, response);
    if (params.content !== true) return metadata;
    const version = params.contentVersion ?? response["ver"];
    const content = await artifactAssetContent(id, version, response["assetToken"]);
    return { ...metadata, version, content_html: content, content_bytes: Buffer.byteLength(content, "utf8") };
  },
  render: { json: renderJson, markdown: renderRead, rich: (value, primitives) => primitives.logger.message(renderRead(value), "") }
});
var listCommand = defineCommand({
  name: "list",
  description: "List Claude Code artifacts from the Claude frame API.",
  scope: ["cli", "mcp", "sdk"],
  params: S.Object({
    limit: S.Optional(S.Number({ description: "Maximum number of artifacts to request." }))
  }),
  handler: async ({ params }) => {
    const response = await frameRequest("GET", `/api/frame/frames?limit=${params.limit ?? 60}`, void 0);
    const artifacts = response["frames"].filter((frame) => frame["source_surface"] === "code").map((frame) => ({
      artifact_url: `https://claude.ai/code/artifact/${frame["slug"]}`,
      artifact_id: frame["slug"],
      title: frame["title"],
      label: frame["label"],
      owner_email: frame["owner_email"],
      owner_account: frame["owner_account"],
      relation: frame["rel"],
      source_surface: frame["source_surface"],
      view_count: frame["view_count"],
      unique_view_count: frame["unique_view_count"],
      updated_at: frame["updatedAt"],
      updated_at_display: formatTimestamp2(frame["updatedAt"])
    }));
    return { artifacts };
  },
  render: { json: renderJson, markdown: renderList2, rich: (value) => process.stdout.write(`${renderList2(value)}
`) }
});
var deleteCommand = defineCommand({
  name: "delete",
  description: "Delete a Claude Code artifact.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["artifact"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." })
  }),
  handler: async ({ params }) => {
    const id = artifactId(params.artifact);
    await frameRequest("DELETE", `/api/frame/${id}`, void 0);
    return { deleted: true, artifact_id: id, artifact_url: `https://claude.ai/code/artifact/${id}` };
  },
  render: { json: renderJson, markdown: renderDelete, rich: (value, primitives) => primitives.logger.message(renderDelete(value), "") }
});
var galleryCommand = defineCommand({
  name: "gallery",
  description: "Return the Claude Code artifacts gallery URL.",
  scope: ["cli", "mcp", "sdk"],
  params: S.Object({}),
  handler: async () => ({ url: "https://claude.ai/code/artifacts" }),
  render: { json: renderJson, markdown: (value) => value.url, rich: (value, primitives) => primitives.logger.message(value.url, "") }
});
var root = defineGroup({
  name: "claude-artifacts",
  description: "Create Claude Code artifacts with the current Claude Code login.",
  scope: ["cli", "mcp", "sdk"],
  children: [
    createCommand2,
    readCommand,
    updateCommand,
    listCommand,
    deleteCommand,
    galleryCommand
  ]
});

// bin/claude-artifacts.mjs
await runCLI(root, { version: "0.1.0", rootUsageName: "claude-artifacts", presets: false, approvals: false, controls: { output: true } });
