import React, { useState } from 'react';
import deleteFiles from '@/api/server/files/deleteFiles';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions } from 'easy-peasy';
import { TrashIcon } from '@heroicons/react/outline';
import { ApplicationStore } from '@/state';
import Can from '@/components/elements/Can';
import { Button } from '@/components/elements/button/index';
import Spinner from '@/components/elements/Spinner';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Dialog } from '@/components/elements/dialog';
import tw from 'twin.macro';
import { useTranslation } from 'react-i18next';

export default function DeletePlugin({ plugin_id, file_name }: { plugin_id: number, file_name: string }){
    const { t } = useTranslation('arix/server/addons/plugins');
    const [isOpen, setIsOpen] = useState(false);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const removePlugin = ServerContext.useStoreActions((actions) => actions.plugins.removePlugin);
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
    const [loading, setLoading] = useState(false);

    const Delete = () => {
        setLoading(true);
        clearFlashes('plugins');
        
        deleteFiles(    
            uuid, '/plugins', [file_name]
        )
        .then(() => {
            removePlugin(plugin_id)
            addFlash({
                type: 'success',
                key: 'plugins:delete',
                message: t('delete.deleted-succesfully'),
            })
        })
        .catch((error) => {
            addFlash({
                type: 'error',
                key: 'plugins:delete',
                message: error.response.data.error,
            })
        })
        .finally(() => setLoading(false))
    }

    return (
        <>
        <FlashMessageRender byKey={'plugins:delete'} css={tw`mb-4`} />
        <Dialog.Confirm
            open={isOpen}
            hideCloseIcon
            onClose={() => setIsOpen(false)}
            title={t('delete.delete-plugin')}
            confirm={t('delete.continue')}
            onConfirmed={Delete}
        >
            {t('delete.are-you-sure')} <code>{file_name}</code>?
        </Dialog.Confirm>

        <Can action={'file.delete'}>
            <Tooltip content={`${t('delete.delete-plugin')}`} placement={'top'}>
                <Button.Danger
                    onClick={() => setIsOpen(true)} 
                    disabled={loading} 
                    className={'ml-auto'}
                >
                    {loading 
                        ? <Spinner size={'small'} />
                        : <TrashIcon className={'w-4'} /> }
                </Button.Danger>
            </Tooltip>
        </Can>
        </>
    )
}