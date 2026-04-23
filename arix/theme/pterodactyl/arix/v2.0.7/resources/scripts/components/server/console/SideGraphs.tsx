import React, { useEffect, useRef, useState } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@/components/server/console/chart';
import { hexToRgba } from '@/lib/helpers';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import { theme } from 'twin.macro';
import ChartBlock from '@/components/server/console/ChartBlock';
import { useTranslation } from 'react-i18next';

type Stats = Record<'memory' | 'cpu' | 'rx' | 'tx', number>;

export default () => {
    const { t } = useTranslation('arix/utilities');
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, rx: 0, tx: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 2);
    const memory = useChartTickLabel('Memory', limits.memory, 'MiB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                },
            },
        },
        callback(opts, index) {
            return {
                ...opts,
                label: !index ? 'Network In' : 'Network Out',
                borderColor: !index ? theme('colors.cyan.400') : theme('colors.yellow.400'),
                backgroundColor: hexToRgba(!index ? theme('colors.cyan.700') : theme('colors.yellow.700'), 0.5),
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        setStats({
            memory: values.memory_bytes,
            cpu: values.cpu_absolute,
            tx: values.network.tx_bytes,
            rx: values.network.rx_bytes,
        });

        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    
    return (
        <>
            <ChartBlock title={t('cpu-usage')} type={'cpu'} limit={limits.cpu ? limits.cpu + '%' : '∞'} usage={`${stats.cpu.toFixed(2)}%`}>
                <Line {...cpu.props} />
            </ChartBlock>
            <ChartBlock title={t('memory-usage')} type={'memory'} limit={limits.memory ? bytesToString(mbToBytes(limits.memory)) : '∞'} usage={bytesToString(stats.memory)}>
                <Line {...memory.props} />
            </ChartBlock>
        </>
    );
};
