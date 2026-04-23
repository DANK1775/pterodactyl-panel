import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import Spinner from '@/components/elements/Spinner';
import AddSubuserButton from '@/components/server/users/AddSubuserButton';
import UserRow from '@/components/server/users/UserRow';
import FlashMessageRender from '@/components/FlashMessageRender';
import getServerSubusers from '@/api/server/users/getServerSubusers';
import { httpErrorToHuman } from '@/api/http';
import Can from '@/components/elements/Can';
import TableList from '@/components/elements/TableList';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { UserGroupIcon } from '@heroicons/react/outline';
import tw from 'twin.macro';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('arix/server/users');
    const [loading, setLoading] = useState(true);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const subusers = ServerContext.useStoreState((state) => state.subusers.data);
    const setSubusers = ServerContext.useStoreActions((actions) => actions.subusers.setSubusers);

    const permissions = useStoreState((state: ApplicationStore) => state.permissions.data);
    const getPermissions = useStoreActions((actions: Actions<ApplicationStore>) => actions.permissions.getPermissions);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    useEffect(() => {
        clearFlashes('users');
        getServerSubusers(uuid)
            .then((subusers) => {
                setSubusers(subusers);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                addError({ key: 'users', message: httpErrorToHuman(error) });
            });
    }, []);

    useEffect(() => {
        getPermissions().catch((error) => {
            addError({ key: 'users', message: httpErrorToHuman(error) });
            console.error(error);
        });
    }, []);

    if (!subusers.length && (loading || !Object.keys(permissions).length)) {
        return <Spinner size={'large'} centered />;
    }

    return (
        <ServerContentBlock title={t('title')} icon={UserGroupIcon}>
            <FlashMessageRender byKey={'users'} css={tw`mb-4`} />
            <div className={'bg-gray-700 rounded-box backdrop'}>
                <div className={'flex lg:flex-row flex-col gap-2 items-start justify-between px-6 pt-5 pb-1'}>
                    <p className={'text-medium text-gray-300'}>{t('manage-subusers')}</p>
                    <Can action={'user.create'}>
                        <AddSubuserButton />
                    </Can>
                </div>
                <TableList>
                    <tr>
                        <th>{t('name')}</th>
                        <th>{t('email')}</th>
                        <th>{t('2FA-enabled')}</th>
                        <th>{t('creation-date')}</th>
                        <th></th>
                    </tr>
                    {!subusers.length ? (
                        <tr>
                            <td colSpan={5} css={tw`text-center text-sm`}>
                                {t('no-users')}
                            </td>
                        </tr>
                    ) : (
                        subusers.map((subuser) => <UserRow key={subuser.uuid} subuser={subuser} />)
                    )}
                </TableList>
                
            </div>
        </ServerContentBlock>
    );
};
