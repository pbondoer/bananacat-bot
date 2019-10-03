import { getEmoji, hasBanana } from "../utils";
import { getDb } from '../localdb';

const bananaCounter = getDb('bananaCounter');

export const handleMessage = async message => {
  if (hasBanana(message)) {
    message.react(getEmoji("bananacat"));

    // increase banana counter
    bananaCounter[message.author.id] = (bananaCounter[message.author.id] || 0) + 1;
  }
};

export default handleMessage;
