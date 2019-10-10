import { Message, TextChannel } from 'discord.js';

import * as hooks from '../hooks';

export const handleMessage = async (message: Message) => {
  if (!(message.channel instanceof TextChannel)) {
    return;
  }

  Object.values(hooks).forEach(hook => {
    hook(message);
  });
};

export default handleMessage;
