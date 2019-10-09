import * as hooks from '../hooks';

export const handleMessage = async message => {
  Object.values(hooks).forEach(hook => {
    typeof hook === 'function' && hook(message);
  });
};

export default handleMessage;
