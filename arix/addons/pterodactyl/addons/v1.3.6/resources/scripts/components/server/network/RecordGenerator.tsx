import React, { useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import Input from '@/components/elements/Input';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { useTranslation } from 'react-i18next';

export default function RecordGenerator(){
    const { t } = useTranslation('arix/server/addons/network');
    const [domain, setDomain] = useState<string>('play.example.com')
    const ip = ServerContext.useStoreState((state) => {
        const match = state.server.data?.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.ip}`;
    });
    const port = ServerContext.useStoreState((state) => {
        const match = state.server.data?.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.port}`;
    });

    return (
        <TitledGreyBox title={t('record-generator')} className={'mt-4'}>
            <p className={'mb-2'}>{t('description')}</p>

            <Input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="play.example.com"
            />

            <div className={`duration-300 ${domain === 'play.example.com' ? 'blur-sm pointer-events-none' : ''}`}>
                <div className={'grid lg:grid-cols-3 gap-2 px-5 py-4 bg-gray-600 mt-4 rounded-lg'}>
                    <div>
                        <p className={'text-sm font-medium text-gray-300'}>TYPE</p>
                        A
                    </div>
                    <CopyOnClick text={domain}>
                        <div>
                            <p className={'text-sm font-medium text-gray-300'}>NAME</p>
                            {domain}
                        </div>
                    </CopyOnClick>
                    <CopyOnClick text={ip}>
                        <div>
                            <p className={'text-sm font-medium text-gray-300'}>CONTENT</p>
                            {ip}
                        </div>
                    </CopyOnClick>
                </div>
                <div className={'grid lg:grid-cols-3 gap-2 px-5 py-4 bg-gray-600 mt-2 rounded-lg'}>
                    <div>
                        <p className={'text-sm font-medium text-gray-300'}>TYPE</p>
                        SRV
                    </div>
                    <div>
                        <CopyOnClick text={`_minecraft._tcp.${domain}`}>
                            <div>
                                <p className={'text-sm font-medium text-gray-300'}>NAME</p>
                                _minecraft._tcp.{domain}
                            </div>
                        </CopyOnClick>
                    </div>
                    <div>
                        <CopyOnClick text={`0 5 ${port} ${domain}`}>
                            <div>
                                <p className={'text-sm font-medium text-gray-300'}>CONTENT</p>
                                0 5 {port} {domain}
                            </div>
                        </CopyOnClick>
                    </div>
                </div>
            </div>
        </TitledGreyBox>
    )
}
