import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useFlashKey } from '@/plugins/useFlash';
import { deleteSSHKey, useSSHKeys } from '@/api/account/ssh-keys';
import { Dialog } from '@/components/elements/dialog';
import Code from '@/components/elements/Code';
import { useTranslation } from 'react-i18next';

export default ({ name, fingerprint }: { name: string; fingerprint: string }) => {
    const { t } = useTranslation('arix/account');
    const { clearAndAddHttpError } = useFlashKey('account');
    const [visible, setVisible] = useState(false);
    const { mutate } = useSSHKeys();

    const onClick = () => {
        clearAndAddHttpError();

        Promise.all([
            mutate((data) => data?.filter((value) => value.fingerprint !== fingerprint), false),
            deleteSSHKey(fingerprint),
        ]).catch((error) => {
            mutate(undefined, true).catch(console.error);
            clearAndAddHttpError(error);
        });
    };

    return (
        <>
            <Dialog.Confirm
                open={visible}
                title={t('sshKey.deleteForm.delete-ssh-key')}
                confirm={t('sshKey.deleteForm.delete-key')}
                onConfirmed={onClick}
                onClose={() => setVisible(false)}
            >
                {t('sshKey.deleteForm.will-invalidate-1')} <Code>{name}</Code> {t('sshKey.deleteForm.will-invalidate-2')}
            </Dialog.Confirm>
            <button css={tw`ml-4 p-2 text-sm`} onClick={() => setVisible(true)}>
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    css={tw`text-neutral-400 hover:text-red-400 transition-colors duration-150`}
                />
            </button>
        </>
    );
};
