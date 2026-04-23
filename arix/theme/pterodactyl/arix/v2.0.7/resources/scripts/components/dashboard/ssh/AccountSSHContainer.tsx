import React, { useEffect } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import FlashMessageRender from '@/components/FlashMessageRender';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { useSSHKeys } from '@/api/account/ssh-keys';
import { useFlashKey } from '@/plugins/useFlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import CreateSSHKeyForm from '@/components/dashboard/ssh/CreateSSHKeyForm';
import DeleteSSHKeyButton from '@/components/dashboard/ssh/DeleteSSHKeyButton';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('arix/account');
    const { clearAndAddHttpError } = useFlashKey('account');
    const { data, isValidating, error } = useSSHKeys({
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <div className={'grid lg:grid-cols-2 gap-4'}>
            <div>
                <FlashMessageRender byKey={'account'} />
                <CreateSSHKeyForm />
            </div>
            <div>
                <SpinnerOverlay visible={!data && isValidating} />
                {!data || !data.length ? (
                    <p css={tw`text-center text-sm`}>
                        {!data ? t('sshKey.loading') : t('sshKey.no-key-found')}
                    </p>
                ) : (
                    data.map((key, index) => (
                        <GreyRowBox
                            key={key.fingerprint}
                            css={[tw`bg-neutral-600 flex space-x-4 items-center`, index > 0 && tw`mt-2`]}
                        >
                            <FontAwesomeIcon icon={faKey} css={tw`text-neutral-300`} />
                            <div css={tw`flex-1`}>
                                <p css={tw`text-sm break-words font-medium`}>{key.name}</p>
                                <p css={tw`text-xs mt-1 font-mono truncate`}>SHA256:{key.fingerprint}</p>
                                <p css={tw`text-xs mt-1 text-neutral-300 uppercase`}>
                                    {t('sshKey.added-on')}:&nbsp;
                                    {format(key.createdAt, 'MMM do, yyyy HH:mm')}
                                </p>
                            </div>
                            <DeleteSSHKeyButton name={key.name} fingerprint={key.fingerprint} />
                        </GreyRowBox>
                    ))
                )}
            </div>
        </div>
    );
};
