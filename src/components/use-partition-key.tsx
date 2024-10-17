'use client';

import { useParams } from 'next/navigation';

export const usePartitionKey = () => {
  const routeParams = useParams();
  if (routeParams?.partitionKey) {
    return Array.isArray(routeParams.partitionKey)
      ? routeParams.partitionKey[0]
      : routeParams.partitionKey;
  }

  return 'clinia';
};
