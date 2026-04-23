import React, { useEffect, useState } from 'react';
import getServerDatabases from '@/api/server/databases/getServerDatabases';
import { ServerContext } from '@/state/server';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import DatabaseRow from '@/components/server/databases/DatabaseRow';
import Spinner from '@/components/elements/Spinner';
import CreateDatabaseButton from '@/components/server/databases/CreateDatabaseButton';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import TableList from '@/components/elements/TableList';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import { DatabaseIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('arix/server/databases');
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const databaseLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.databases);

    const { addError, clearFlashes } = useFlash();
    const [loading, setLoading] = useState(true);

    const databases = useDeepMemoize(ServerContext.useStoreState((state) => state.databases.data));
    const setDatabases = ServerContext.useStoreActions((state) => state.databases.setDatabases);

    useEffect(() => {
        setLoading(!databases.length);
        clearFlashes('databases');

        getServerDatabases(uuid)
            .then((databases) => setDatabases(databases))
            .catch((error) => {
                console.error(error);
                addError({ key: 'databases', message: httpErrorToHuman(error) });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <ServerContentBlock title={t('databases')} icon={DatabaseIcon}>
            <FlashMessageRender byKey={'databases'} css={tw`mb-4`} />

            {!databases.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <div className={'bg-gray-700 rounded-box backdrop'}>
                    <div className={'flex lg:flex-row flex-col gap-2 items-start justify-between px-6 pt-5 pb-1'}>
                        <div>
                            <p className={'text-medium text-gray-300'}>{t('manage-databases')}</p>
                            {databaseLimit > 0 && databases.length > 0 && (
                                <p css={tw`text-sm text-neutral-300 mt-1`}>
                                    {t('have-been-allocated', { current: databases.length, max: databaseLimit })}
                                </p>
                            )}
                        </div>
                        <Can action={'database.create'}>
                            {databaseLimit > 0 && databaseLimit !== databases.length && (
                                <CreateDatabaseButton />
                            )}
                        </Can>
                    </div>
                    <TableList>
                        <tr>
                            <th>{t('name')}</th>
                            <th>{t('username')}</th>
                            <th>{t('endpoint')}</th>
                            <th></th>
                        </tr>
                            {databases.length > 0 ? (
                                databases.map((database, index) => (
                                    <DatabaseRow
                                        key={database.id}
                                        database={database}
                                        className={index > 0 ? 'mt-1' : undefined}
                                    />
                                ))
                            ) : (
                            <tr>
                                <td colSpan={5} css={tw`text-center text-sm`}>
                                    {databaseLimit > 0
                                        ? t('no-databases')
                                        : t('cannot-be-created')}
                                </td>
                            </tr>
                        )}
                    </TableList>
                </div>
            )}
        </ServerContentBlock>
    );
};
