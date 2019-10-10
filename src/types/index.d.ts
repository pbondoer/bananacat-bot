import { Message } from 'discord.js';

declare global {
  // Defines a simple object map
  type FlatMap<T> = Record<string, T>;

  // Defines a bot command
  type Command = {
    name: string;
    description: string;
    admin?: boolean;
    hidden?: boolean;
    args?: FlatMap<string>;
    handler: (m: Message, args?: string[]) => void;
  };
}
