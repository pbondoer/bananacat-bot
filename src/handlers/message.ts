import { Message } from 'discord.js';

import * as hooks from '../hooks';

export const handleMessage = async (message: Message) => {
  Object.values(hooks).forEach(hook => {
    typeof hook === 'function' && hook(message);
  });
};

export default handleMessage;
