'use client';

import dynamic from 'next/dynamic';

// Disable SSR for react-graph-vis
const Graph = dynamic(() => import('react-graph-vis'), {
  ssr: false,
});

export default Graph;
