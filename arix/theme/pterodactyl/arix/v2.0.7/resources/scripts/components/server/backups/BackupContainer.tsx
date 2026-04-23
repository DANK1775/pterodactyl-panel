import React, { useContext, useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import CreateBackupButton from '@/components/server/backups/CreateBackupButton';
import FlashMessageRender from '@/components/FlashMessageRender';
import BackupRow from '@/components/server/backups/BackupRow';
import tw from 'twin.macro';
import TableList from '@/components/elements/TableList';
import getServerBackups, { Context as ServerBackupContext } from '@/api/swr/getServerBackups';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Pagination from '@/components/elements/Pagination';
import { ArchiveIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

const BackupContainer = () => {
    const { t } = useTranslation('arix/server/backups');
    const { page, setPage } = useContext(ServerBackupContext);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: backups, error, isValidating } = getServerBackups();

    const backupLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.backups);

    useEffect(() => {
        if (!error) {
            clearFlashes('backups');

            return;
        }

        clearAndAddHttpError({ error, key: 'backups' });
    }, [error]);

    if (!backups || (error && isValidating)) {
        return <Spinner size={'large'} centered />;
    }

    return (
        <ServerContentBlock title={t('backups')} icon={ArchiveIcon}>
            <FlashMessageRender byKey={'backups'} css={tw`mb-4`} />
            <div className={'bg-gray-700 rounded-box backdrop'}>
                <div className={'flex lg:flex-row flex-col gap-2 items-start justify-between px-6 pt-5 pb-1'}>
                    <div>
                        <p className={'text-medium text-gray-300'}>{t('manage-backups')}</p>
                        {backupLimit > 0 && backups.backupCount > 0 && (
                        <p css={tw`text-sm text-neutral-300 mt-1`}>
                            {t('have-been-allocated', { current: backups.backupCount, max: backupLimit })}
                        </p>
                    )}
                    </div>
                    <Can action={'backup.create'}>
                        {backupLimit > 0 && backupLimit > backups.backupCount && (
                            <CreateBackupButton css={tw`w-full sm:w-auto`} />
                        )}
                    </Can>
                </div>
                <TableList>
                    <tr>
                        <th>{t('name')}</th>
                        <th>{t('size')}</th>
                        <th>{t('creation-date')}</th>
                        <th>{t('checksum')}</th>
                        <th></th>
                    </tr>
                    {backupLimit === 0 && (
                        <tr>
                            <td colSpan={5} css={tw`text-center text-sm`}>
                                {t('limit-is-0')}
                            </td>
                        </tr>
                    )}
                    <Pagination data={backups} onPageSelect={setPage}>
                        {({ items }) =>
                            !items.length ? (
                                // Don't show any error messages if the server has no backups and the user cannot
                                // create additional ones for the server.
                                !backupLimit ? null : (
                                    <tr>
                                        <td colSpan={5} css={tw`text-center text-sm`}>
                                            {page > 1
                                                ? t('try-going-back')
                                                : t('no-backups')}
                                        </td>
                                    </tr>
                                )
                            ) : (
                                items.map((backup, index) => (
                                    <BackupRow key={backup.uuid} backup={backup} css={index > 0 ? tw`mt-2` : undefined} />
                                ))
                            )
                        }
                    </Pagination>
                </TableList>
            </div>
        </ServerContentBlock>
    );
};

export default () => {
    const [page, setPage] = useState<number>(1);
    return (
        <ServerBackupContext.Provider value={{ page, setPage }}>
            <BackupContainer />
        </ServerBackupContext.Provider>
    );
};
