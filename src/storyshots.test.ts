// https://qiita.com/junkor-1011/items/da0a3060fd2f6a03c916#%E8%BF%BD%E8%A8%98custom-renderer%E3%82%92%E4%BD%BF%E3%81%86%E5%A0%B4%E5%90%88
import initStoryshots from '@storybook/addon-storyshots';
import { render } from '@testing-library/react';

const reactTestingLibrarySerializer = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, testing-library/no-node-access
  print: (val, serialize, indent) => serialize(val.container.firstChild),
  // eslint-disable-next-line no-prototype-builtins
  test: (val) => val && val.hasOwnProperty('container'),
};

initStoryshots({
  renderer: render,
  snapshotSerializers: [reactTestingLibrarySerializer],
});
