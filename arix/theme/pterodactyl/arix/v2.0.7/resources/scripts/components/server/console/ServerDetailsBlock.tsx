import React, { useEffect, useMemo, useState } from 'react';
import { ChipIcon } from '@heroicons/react/outline';
import { LuSave, LuMemoryStick } from "react-icons/lu";
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { useTranslation } from 'react-i18next';

type Stats = Record<'memory' | 'cpu' | 'disk', number>;

const ServerDetailsBlock = () => {
    const { t } = useTranslation('arix/utilities');
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : <>&infin;</>,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : <>&infin;</>,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : <>&infin;</>,
        }),
        [limits]
    );

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
        });
    });

    return (
        <>
        <div className={'grid md:grid-cols-3 gap-4'}>
            <div className={'bg-gray-700 backdrop rounded-box px-6 py-5 flex justify-between items-center'}>
                <div>
                    <span className={'text-gray-300'}>{t('cpu-usage')}:</span>
                    <div className={'flex items-center gap-x-1'}>
                        {status === 'offline' ? (
                            <p>{t('offline')}</p>
                        ) : (
                            <p className={'text-lg font-medium'}>{stats.cpu.toFixed(2)}%</p>
                        )}
                        <span className={'text-gray-300 font-medium'}>/ {textLimits.cpu}</span>
                    </div>
                </div>
                <div className={'text-white bg-arix rounded-component w-16 h-16 flex items-center justify-center'}>
                    <ChipIcon className={'w-10'}/>
                </div>
            </div>
            <div className={'bg-gray-700 backdrop rounded-box px-6 py-5 flex justify-between items-center'}>
                <div>
                    <span className={'text-gray-300'}>{t('memory-usage')}:</span>
                    <div className={'flex items-center gap-x-1'}>
                        <p className={'text-lg font-medium'}>{bytesToString(stats.memory)}</p>
                        <span className={'text-gray-300 font-medium'}>/ {textLimits.memory}</span>
                    </div>
                </div>
                <div className={'text-white bg-arix rounded-component w-16 h-16 flex items-center justify-center'}>
                    <LuMemoryStick className={'text-[2.5rem]'}/>
                </div>
            </div>
            <div className={'bg-gray-700 backdrop rounded-box px-6 py-5 flex justify-between items-center'}>
                <div>
                    <span className={'text-gray-300'}>{t('disk-usage')}:</span>
                    <div className={'flex items-center gap-x-1'}>
                        <p className={'text-lg font-medium'}>{bytesToString(stats.disk)}</p>
                        <span className={'text-gray-300 font-medium'}>/ {textLimits.disk}</span>
                    </div>
                </div>
                <div className={'text-white bg-arix rounded-component w-16 h-16 flex items-center justify-center'}>
                    <LuSave className={'text-[2.5rem]'}/>
                </div>
            </div>
        </div>
        </>
    );
};

export default ServerDetailsBlock;
