import React from 'react';
import { numify } from "numify";
import { Plugin, QueryParams } from '@/api/server/plugins/Plugins';
import { differenceInCalendarMonths, format, formatDistanceToNow } from 'date-fns';
import { ExternalLinkIcon, DownloadIcon, StarIcon, CalendarIcon } from '@heroicons/react/outline';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import { ServerContext } from '@/state/server';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Can from '@/components/elements/Can';
import InstallButton from '@/components/server/plugins/InstallButton';
import Tooltip from '@/components/elements/tooltip/Tooltip';
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

export default function PluginRow({ plugin, filters }: { plugin: Plugin; filters: QueryParams }) {
    const { t } = useTranslation('arix/server/addons/plugins');
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    const localeKey = currentLang as keyof typeof locales;
    const installedPlugins = useDeepMemoize(ServerContext.useStoreState((state) => state.plugins.data));
    const isInstalled = installedPlugins.find((installed) => (
        installed.plugin_service_id === plugin.id && installed.plugin_service === filters.service
    ));

    return(
        <GreyRowBox key={plugin.id} className={'flex-col !items-start gap-3'} $hoverable={false}>
            <div className={'flex items-center gap-x-5'}>
                <div className={'p-1 bg-gray-600 rounded-lg overflow-hidden'}>
                    <img 
                        src={plugin.icon === 'https://www.spigotmc.org/' ? '/arix/Arix.png' : plugin.icon} 
                        width={64} 
                        height={64} 
                        alt={`${plugin.name.slice(0, 5)} Icon`}
                        className={'shrink-0'}
                    />
                </div>
                <div>
                    <p className={'text-xl font-medium text-gray-50 flex items-center gap-x-2'}>
                        {plugin.name}
                        <a href={plugin.project.projectUrl} target={'_blank'}>
                            <ExternalLinkIcon className={'w-6'}/>
                        </a>
                    </p>
                    <div className={'text-gray-400 text-sm'}>
                        <p>
                            {t('by')}&nbsp;
                            <a href={plugin.project.authorUrl} target={'_blank'} className={'underline'}>
                                {plugin.project.author}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <p className="line-clamp-2">
                {plugin.description}
            </p>
            <p className={'flex items-center gap-x-1'}>
                <CalendarIcon className={'w-4 text-arix'} />
                {t('last-updated')}&nbsp;
                {plugin.stats.lastUpdated
                    ? (() => {
                        const lastUpdated = new Date(plugin.stats.lastUpdated);
                        const monthsDifference = Math.abs(differenceInCalendarMonths(lastUpdated, new Date()));
                        return monthsDifference > 12
                            ? format(lastUpdated, 'MMM do, yyyy', { locale: getLocale(localeKey) })
                            : formatDistanceToNow(lastUpdated, { addSuffix: true, locale: getLocale(localeKey) });
                        })()
                    : 'Unknown'
                }
            </p>
            <div className={'mt-auto w-full flex items-center justify-between gap-2 flex-wrap'}>
                <div className={'flex items-center gap-x-3'}>
                    <Tooltip content={`${t('downloads')}`} placement={'top'}>
                        <p className={'flex items-center gap-x-1'}>
                            <DownloadIcon className={'w-4 text-gray-300'} />
                            {numify(plugin.stats.downloads)}
                        </p>
                    </Tooltip>
                    {plugin.stats.likes > 0 && (
                        <Tooltip content={`${t('likes')}`} placement={'top'}>
                            <p className={'flex items-center gap-x-1'}>
                                <StarIcon className={'w-4 text-gray-300'} />
                                {numify(plugin.stats.likes)}
                            </p>
                        </Tooltip>
                    )}
                </div>
                {!isInstalled ?
                        <Can action={'file.create'}>
                            <InstallButton 
                                plugin={plugin}
                                service={filters.service}
                            />
                        </Can>
                    :
                    <span className={'rounded-component px-2 py-1 text-sm inline-block font-medium bg-success-200 text-success-50'}>
                        {t('plugin-installed')}
                    </span>
                }
            </div>
        </GreyRowBox>
    )
}