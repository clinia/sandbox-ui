import { useServerSideDataCatalogClient } from '@/lib';
import { CheckCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink } from '@clinia-ui/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clinia-ui/react';

export default async function Home() {
  const t = await getTranslations();

  const catalogClient = useServerSideDataCatalogClient({
    authorization: `Basic ${Buffer.from(`${process.env.ATLAS_ROOT_USER}:${process.env.ATLAS_ROOT_PASSWORD}`).toString('base64')}`,
  });
  const partitionsResponse = await catalogClient.partitionsClient
    .listDataPartitions({
      page: 0,
      perPage: 100,
    })
    .catch(() => null);
  const partitions = partitionsResponse?.data ?? [];

  return (
    <div className="mt-60 grid justify-items-center">
      <h2 className="mb-6 text-2xl font-semibold">{t('landing.title')}</h2>
      <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partitions
          .filter((p) => p.modules.search === 'HEALTH_GRADE_SEARCH')
          .map((partition) => (
            <Link
              key={partition.key}
              href={`/${partition.key}`}
              className="group transition-colors focus:outline-none"
            >
              <Card
                className={`cursor-pointer transition-colors hover:border-primary `}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {partition.key}
                    <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {/*
                  <p
                    className={`font-semibold ${
                      partition.status === 'STATUS_READY'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {partition.status}
                  </p> */}
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
