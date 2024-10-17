import datacatalogclient from '@clinia/client-datacatalog';
import datapartitionclient from '@clinia/client-datapartition';

const getHost = () => {
  return {
    protocol: 'http',
    url: `localhost:${process.env.PORT ?? 3000 /* Default prod port */}/api`,
    accept: 'readWrite',
  } as const;
};

export const useServerSideDataPartitionClient = () => {
  return datapartitionclient(
    'clinia',
    {
      mode: 'BearerToken',
      bearerToken: '',
    },
    {
      hosts: [getHost()],
    }
  );
};

export const useServerSideDataCatalogClient = () => {
  return datacatalogclient(
    'clinia',
    {
      mode: 'BearerToken',
      bearerToken: '',
    },
    {
      hosts: [getHost()],
    }
  );
};
