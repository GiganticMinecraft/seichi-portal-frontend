if (typeof window === 'undefined') {
  import('./server').then(({ server }) => server.listen());
} else {
  import('./browser').then(({ worker }) =>
    // eslint-disable-next-line no-console
    worker.start().catch((e) => console.error(e)),
  );
}

export {};
