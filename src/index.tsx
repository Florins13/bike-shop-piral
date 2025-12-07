import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi } from 'piral';
import { layout, errors } from './layout';

// change to your feed URL here (either using feed.piral.cloud or your own service)
// const feedUrl = 'https://feed.piral.cloud/api/v1/pilet/empty';
const feeds = [
  'http://localhost:1234/$pilet-api/',
  'http://localhost:1235/$pilet-api/',
];

const instance = createInstance({
  state: {
    components: layout,
    errorComponents: errors,
  },
  plugins: [...createStandardApi()],
  requestPilets() {
    return Promise.all(feeds.map(feedUrl =>
      fetch(feedUrl).then(res => res.json())
    )).then(results =>
      results.flat() // merge all pilets into one array
    );
  },
});

const root = createRoot(document.querySelector('#app'));

root.render(<Piral instance={instance} />);
