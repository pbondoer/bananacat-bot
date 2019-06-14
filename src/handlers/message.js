import { getEmoji, hasBanana } from "../utils";

export const handleMessage = async message => {
  if (hasBanana(message)) {
    // only works in bananacat server
    message.react(getEmoji("bananacat"));
  }
};

export default handleMessage;
