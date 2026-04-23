import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Subuser } from '@/state/server/subusers';
import RemoveSubuserButton from '@/components/server/users/RemoveSubuserButton';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import UserAvatar from '@/components/UserAvatar';
import Can from '@/components/elements/Can';
import { Button } from '@/components/elements/button/index';
import { useStoreState } from 'easy-peasy';
import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import * as locales from 'date-fns/locale';

const getLocale = (localeKey: keyof typeof locales) => {
    if (locales[localeKey]) {
        return locales[localeKey];
    } else {
        const keyString = String(localeKey);
        console.warn(`Locale '${keyString}' not found. Falling back to '${locales.enUS}'`);
        return locales.enUS;
    }
};

interface Props {
    subuser: Subuser;
}

export default ({ subuser }: Props) => {
    const { t, i18n } = useTranslation('arix/server/users');
    const currentLang = i18n.language;
    const localeKey = currentLang as keyof typeof locales;
    const uuid = useStoreState((state) => state.user!.data!.uuid);
    const [visible, setVisible] = useState(false);

    return (
        <tr>
            <td>
                <div className={'flex gap-x-2 items-center font-medium'}>
                    <UserAvatar uuid={subuser.uuid} email={subuser.email} user={subuser.username} />
                    {subuser.username}
                </div>
            </td>
            <td className='privacy:blur-sm hover:privacy:blur-none duration-300'>
                {subuser.email}
            </td>
            <td>
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-component ${!subuser.twoFactorEnabled ? 'text-danger-50' : 'text-success-50'}`}
                    css={`background-color:color-mix(in srgb, ${!subuser.twoFactorEnabled ? 'var(--dangerBackground)' : 'var(--successBackground)'} 40%, transparent);`}
                >
                    {!subuser.twoFactorEnabled
                    ? <LockOpenIcon className={'w-5'}/>
                    : <LockClosedIcon className={'w-5'}/>}
                </div>
            </td>
            <td>
                {formatDistanceToNow(subuser.createdAt, { includeSeconds: true, addSuffix: true, locale: getLocale(localeKey) })}
            </td>
            <td className={'w-1'}>
                <EditSubuserModal subuser={subuser} visible={visible} onModalDismissed={() => setVisible(false)} />
                <div className={'flex justify-end items-centet gap-x-2'}>
                    {subuser.uuid !== uuid && (
                        <>
                        <Can action={'user.update'}>
                            <Button.Text onClick={() => setVisible(true)}>
                                {t('modify-permissions')}
                            </Button.Text>
                        </Can>
                        <Can action={'user.delete'}>
                            <RemoveSubuserButton subuser={subuser} />
                        </Can>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};
