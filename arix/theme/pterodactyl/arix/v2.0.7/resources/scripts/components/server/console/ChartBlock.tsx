import React from 'react';
import classNames from 'classnames';
import { ServerContext } from '@/state/server';
import styles from '@/components/server/console/style.module.css';
import { ChipIcon, CloudIcon } from '@heroicons/react/outline';
import { LuMemoryStick } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

interface ChartBlockProps {
    type: string;
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
    usage?: string;
    limit?: string;
    inbound?: string;
    outbound?: string;
}

export default ({ type, title, legend, usage, limit, inbound, outbound, children }: ChartBlockProps) => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const { t } = useTranslation('arix/utilities');

    return (
    <>
    <div className={'bg-gray-700 backdrop overflow-hidden rounded-box'}>
        <div className={'px-6 pt-5 flex justify-between items-center'}>
            <div>
                <span className={'text-gray-300'}>{title}:</span>
                <div className={'flex items-center gap-x-1'}>
                    {status === 'offline' ? (
                        <p>{t('offline')}</p>
                    ) : (
                        <p className={'text-lg font-medium'}>
                            {usage && usage}
                            {inbound && outbound && `${inbound} / ${outbound}`}
                        </p>
                    )}
                    <span className={'text-gray-300 font-medium'}>{limit && '/ ' + limit}</span>
                </div>
            </div>
            <div className={'text-white bg-arix rounded-component w-16 h-16 flex items-center justify-center'}>
                {type == 'cpu'
                ? <ChipIcon className={'w-10'}/>
                : type == 'network'
                ? <CloudIcon className={'w-10'}/>
                : <LuMemoryStick className={'text-[2.5rem]'}/>
                }
            </div>
        </div>
        <div css={'left:-11px;bottom:-11px;width:calc(100% + 17px);position:relative;'}>
            {children}
        </div>
    </div>
    </>
)};
