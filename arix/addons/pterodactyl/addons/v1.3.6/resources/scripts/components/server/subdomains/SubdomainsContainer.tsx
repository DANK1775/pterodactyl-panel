import React, { useState, useEffect } from 'react';
import { ServerContext } from '@/state/server';
import getSubdomains from '@/api/server/subdomains/getSubdomains';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import CreateSubdomainButton from '@/components/server/subdomains/CreateSubdomainButton';
import DeleteSubdomainButton from '@/components/server/subdomains/DeleteSubdomainButton';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Spinner from '@/components/elements/Spinner';
import Can from '@/components/elements/Can';
import TableList from '@/components/elements/TableList';
import tw from 'twin.macro';
import { useTranslation } from 'react-i18next';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';
import { HiOutlineGlobeAlt, HiGlobeAlt } from "react-icons/hi";
import { LuEarth } from "react-icons/lu";
import { RiEarthLine, RiEarthFill } from "react-icons/ri";

const DomainsContainer = () => {
    const { t } = useTranslation('arix/server/addons/subdomains');
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const [loading, setLoading] = useState<boolean>(true);
    const { addError, clearFlashes } = useFlash();
    const iconStyle = useStoreState((state: ApplicationStore) => state.settings.data!.arix.icon);

    const subdomains = useDeepMemoize(ServerContext.useStoreState((state) => state.subdomains.data));
    const setSubdomains = ServerContext.useStoreActions((state) => state.subdomains.setSubdomains);

    const subdomainLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.subdomains);
    const subdomainCount = Object.keys(subdomains).length;


    useEffect(() => {
        setLoading(!subdomains.length);
        clearFlashes('subdomains');

        getSubdomains(id)
            .then((response) => {
                setSubdomains(response.data);
            })
            .catch((error) => {
                addError({ key: 'subdomains', message: error });
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);

    return (
        <ServerContentBlock 
            title={t('subdomains')} 
            icon={
                iconStyle === 'heroicons'
                    ? HiOutlineGlobeAlt
                    : iconStyle === 'heroiconsFilled'
                    ? HiGlobeAlt
                    : iconStyle === 'lucide'
                    ? LuEarth
                    : iconStyle === 'remixicon'
                    ? RiEarthLine
                    : RiEarthFill
            }
        >
            <FlashMessageRender byKey={'subdomains'} />
            {!subdomains.length && loading ? 
                <Spinner size={'large'} centered />
                :
                <div className={'bg-gray-700 rounded-box backdrop'}>
                    <div className={'flex lg:flex-row flex-col gap-2 items-start justify-between px-6 pt-5 pb-1'}>
                        <div>
                            <p className={'text-medium text-gray-300'}>{t('manage-subdomains')}</p>
                            {subdomainLimit > 0 && subdomainCount > 0 && (
                                <p css={tw`text-sm text-neutral-300 mt-1`}>
                                    {t('you-are-currently-using', { current: subdomainCount, max: subdomainLimit })}
                                </p>
                            )}
                        </div>
                        <Can action={'allocation.create'}>
                            {subdomainLimit > 0 && subdomainLimit !== subdomainCount && (
                                <CreateSubdomainButton />
                            )}
                        </Can>
                    </div>
                    <TableList>
                        <tr>
                            <th>{t('subdomain')}</th>
                            <th>{t('allocation')}</th>
                            <th></th>
                        </tr>
                        {subdomainCount > 0 ?
                            Object.entries(subdomains as Record<string, { 
                                full_domain: string;
                                ip: string;
                                port: number; 
                            }>).map(([key, domain]) => (
                                <tr key={key}>
                                    <td>
                                        <CopyOnClick text={domain.full_domain}>
                                            <p>{domain.full_domain}</p>
                                        </CopyOnClick>
                                    </td>
                                    <td>
                                        <CopyOnClick text={`${domain.ip}:${domain.port}`}>
                                            <p>{domain.ip}:{domain.port}</p>
                                        </CopyOnClick>
                                    </td>
                                    <td className={'w-1'}>
                                        <Can action={'allocation.delete'}>
                                            <DeleteSubdomainButton id={key} />
                                        </Can>
                                    </td>
                                </tr>
                            ))
                        : 
                            <tr>
                                <td colSpan={5} css={tw`text-center text-sm`}>
                                    {subdomainLimit > 0
                                        ? t('no-subdomains')
                                        : t('cannot-be-created')}
                                </td>
                            </tr>
                        }
                    </TableList>
                </div>
            }
        </ServerContentBlock>
    );
};

export default DomainsContainer;