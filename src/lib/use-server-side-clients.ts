import datacatalogclient from '@clinia/client-datacatalog';
import datapartitionclient from '@clinia/client-datapartition';

const getHost = () => {
  if (typeof window !== 'undefined') {
    throw new Error('This function should only be used server-side');
  }

  const url = new URL(process.env.API_URL ?? 'http://localhost:3000');
  if (url.host.endsWith('/')) {
    url.host = url.host.slice(0, -1);
  }

  return {
    protocol: url.protocol.replace(':', '') as 'http' | 'https',
    url: url.host,
    accept: 'readWrite',
  } as const;
};

export const useServerSideDataPartitionClient = (
  headers: Record<string, string>
) => {
  return datapartitionclient(
    'clinia',
    {
      mode: 'BearerToken',
      bearerToken: '',
    },
    {
      hosts: [getHost()],
      baseHeaders: headers,
    }
  );
};

export const useServerSideDataCatalogClient = (
  headers: Record<string, string>
) => {
  return datacatalogclient(
    'clinia',
    {
      mode: 'BearerToken',
      bearerToken: '',
    },
    {
      hosts: [getHost()],
      baseHeaders: headers,
    }
  );
};
