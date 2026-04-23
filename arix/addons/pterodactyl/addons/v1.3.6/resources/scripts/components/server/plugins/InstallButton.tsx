import React, { useState, useEffect } from 'react';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';
import { Plugin, Versions, InstalledPlugin } from '@/api/server/plugins/Plugins';
import getVersions from '@/api/server/plugins/getVersions';
import installPlugin from '@/api/server/plugins/installPlugin';
import { ServerContext } from '@/state/server';
import { Button } from '@/components/elements/button/index';
import Select from '@/components/elements/Select';
import { Actions, useStoreActions } from 'easy-peasy';
import { numify } from "numify";
import Spinner from '@/components/elements/Spinner';
import { differenceInCalendarMonths, format, formatDistanceToNow } from 'date-fns';
import { ExternalLinkIcon, DownloadIcon, StarIcon, CalendarIcon } from '@heroicons/react/outline';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import { ApplicationStore } from '@/state';
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

const ModalContent = ({ plugin, service, visible, onDismissed, ...props }: RequiredModalProps & { plugin: Plugin; service: string }) => {
    const { t } = useTranslation('arix/server/addons/plugins');
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    const localeKey = currentLang as keyof typeof locales;
    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState<Versions>();
    const [selectedVersion, setSelectedVersion] = useState<string>();
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
    const appendPlugin = ServerContext.useStoreActions((actions) => actions.plugins.appendPlugin);

    const Error = (message?: string) => {
        onDismissed();
        addFlash({
            type: 'error',
            key: 'plugins',
            message: message ?? t('install.download-not-available'),
        });
    }
    
    const InstallPlugin = async () => {
        if (selectedVersion && versions) {
            const selectedPlugin = versions.versions.find((version) => version.name === selectedVersion);
            
            if (selectedPlugin?.url) {
                setLoading(true);
                installPlugin({
                    id, uuid, service,
                    plugin_id: plugin.id,
                    plugin_name: plugin.name,
                    plugin_icon: plugin.icon,
                    version: selectedVersion,
                    download: selectedPlugin.url
                })
                .then((rep: InstalledPlugin) => {
                    appendPlugin(rep);
                    addFlash({
                        type: 'success',
                        key: 'plugins',
                        message: t('install.installed-successfully'),
                    });
                    onDismissed();
                })
                .catch((error: string) => {
                    Error(error);
                })
                .finally(() => 
                    setLoading(false)
                )
            } else {
                Error();
            }
        }
    };

    useEffect(() => {
        if(visible) {
            clearFlashes('plugins');

            getVersions({id, service, pluginId: plugin.id })
                .then((response: Versions) => {
                    setVersions(response);
                    setSelectedVersion(response ? response.versions[0].name : '');
                })
                .catch((error) => {
                    addFlash({
                        type: 'error',
                        key: 'plugins',
                        message: error,
                    })
                })
        }
    }, [id, plugin, service, visible]);

    return (
        <Modal visible={visible} onDismissed={onDismissed} {...props}>
            <div className={'flex flex-col items-start gap-3'}>
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
                        <div className={'flex gap-5 text-gray-400 text-sm'}>
                            <p>
                                {t('by')}&nbsp;
                                <a href={plugin.project.authorUrl} target={'_blank'} className={'underline'}>
                                    {plugin.project.author}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'flex gap-3'}>
                    <Tooltip content={`${t('downloads')}`} placement={'top'}>
                        <p className={'flex items-center gap-x-1'}>
                            <DownloadIcon className={'w-4 text-arix'} />
                            {numify(plugin.stats.downloads)}
                        </p>
                    </Tooltip>
                    <Tooltip content={`${t('likes')}`} placement={'top'}>
                        <p className={'flex items-center gap-x-1'}>
                            <StarIcon className={'w-4 text-arix'} />
                            {numify(plugin.stats.likes)}
                        </p>
                    </Tooltip>
                    <Tooltip content={`${t('last-updated')}`} placement={'top'}>
                        <p className={'flex items-center gap-x-1'}>
                            <CalendarIcon className={'w-4 text-arix'} />
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
                    </Tooltip>
                </div>
                <p>
                    {plugin.description}
                </p>
            </div>
            <div>
                <p className={'mb-1 mt-4'}>{t('install.select-a-version')}:</p>
                <Select onChange={e => setSelectedVersion(e.target.value)}>
                    {versions?.versions?.map((version) => (
                        <option value={version.name} key={version.name}>
                            {version.name}
                        </option>
                    ))}
                </Select>
                <div className={'flex justify-end mt-3'}>
                    <Button disabled={!selectedVersion || loading} onClick={InstallPlugin} className={'flex items-center gap-x-2'}>
                        {loading && <Spinner size={'small'} />}
                        {t('install.install-plugin')}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default function InstallButton({ plugin, service }: { plugin: Plugin; service: string }) {
    const { t } = useTranslation('arix/server/addons/plugins');
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <ModalContent 
                plugin={plugin}
                service={service}
                appear 
                visible={visible} 
                onDismissed={() => setVisible(false)}
            />

            <Button onClick={() => setVisible(true)}>
                {t('install.select-version')}
            </Button>
        </div>
    )
}