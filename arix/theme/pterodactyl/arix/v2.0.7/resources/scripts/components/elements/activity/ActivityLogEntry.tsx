import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Translate from '@/components/elements/Translate';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ActivityLog } from '@definitions/user';
import ActivityLogMetaButton from '@/components/elements/activity/ActivityLogMetaButton';
import { FolderOpenIcon, TerminalIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import style from './style.module.css';
import UserAvatar from '@/components/UserAvatar';
import useLocationHash from '@/plugins/useLocationHash';
import { getObjectKeys, isObject } from '@/lib/objects';
import { useStoreState } from 'easy-peasy';
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

interface Props {
    activity: ActivityLog;
    children?: React.ReactNode;
}

function wrapProperties(value: unknown): any {
    if (value === null || typeof value === 'string' || typeof value === 'number') {
        return `<strong>${String(value)}</strong>`;
    }

    if (isObject(value)) {
        return getObjectKeys(value).reduce((obj, key) => {
            if (key === 'count' || (typeof key === 'string' && key.endsWith('_count'))) {
                return { ...obj, [key]: value[key] };
            }
            return { ...obj, [key]: wrapProperties(value[key]) };
        }, {} as Record<string, unknown>);
    }

    if (Array.isArray(value)) {
        return value.map(wrapProperties);
    }

    return value;
}

export default ({ activity, children }: Props) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    const localeKey = currentLang as keyof typeof locales;

    const { pathTo } = useLocationHash();
    const actor = activity.relationships.actor;
    const properties = wrapProperties(activity.properties);
    const [countryCode, setCountryCode] = useState<string | null>(null);

    const ipFlag = String(useStoreState((state: ApplicationStore) => state.settings.data!.arix.ipFlag));
    
    // 984ce3c23a3964d60835ab8bc4f9afe1

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.country.is/${activity.ip}`);
                const data = await response.json();
                if (data.country) {
                    // Transform the country code to lowercase
                    setCountryCode(data.country.toLowerCase());
                }
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };

        if (activity.ip && ipFlag == 'true') {
            fetchData();
        }
    }, [activity.ip]);

    const countryLogo = countryCode ? countryCode : 'us';

    return (
        <div className={'grid relative grid-cols-10 py-5 mb-2 last:mb-0 bg-gray-700 backdrop rounded-box'}>
            <div className={'hidden sm:flex sm:col-span-1 items-center justify-center select-none'}>
                <div className={'flex items-center w-10 h-10 rounded-full bg-gray-600 overflow-hidden'}>
                    <UserAvatar uuid={actor?.uuid || 'system'} email={actor?.email || 'system@weijers.one'} user={actor?.username || 'system'} width={'40px'} />
                </div>
            </div>
            <div className={'col-span-10 sm:col-span-9 flex'}>
                <div className={'flex-1 px-4 sm:px-0'}>
                    <div className={'flex items-center text-gray-50'}>
                        <Tooltip placement={'top'} content={actor?.email || 'System User'}>
                            <span>{actor?.username || 'System'}</span>
                        </Tooltip>
                        <span className={'text-gray-400'}>&nbsp;&mdash;&nbsp;</span>
                        <Link
                            to={`#${pathTo({ event: activity.event })}`}
                            className={'transition-colors duration-75 active:text-arix hover:text-arix'}
                        >
                            {activity.event}
                        </Link>
                        <div className={classNames(style.icons, 'hover:text-gray-300')}>
                            {activity.isApi && (
                                <Tooltip placement={'top'} content={'Using API Key'}>
                                    <TerminalIcon />
                                </Tooltip>
                            )}
                            {activity.event.startsWith('server:sftp.') && (
                                <Tooltip placement={'top'} content={'Using SFTP'}>
                                    <FolderOpenIcon />
                                </Tooltip>
                            )}
                            {children}
                        </div>
                    </div>
                    <p className={style.description}>
                        <Translate ns={'activity'} values={properties} i18nKey={activity.event.replace(':', '.')} />
                    </p>
                    <div className={'mt-1 flex items-center text-sm'}>
                        {activity.ip && (
                            <span className={'group flex items-center'}>
                                {ipFlag == 'true' && <img src={`https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryLogo}.svg`} className={'w-6 rounded-sm'}/>}
                                <span className={'filter privacy:blur-sm hover:privacy:blur-none cursor-text select-none duration-300 px-2'}>{activity.ip}</span>
                                <span className={'text-gray-400'}>|&nbsp;</span>
                            </span>
                        )}
                        <Tooltip placement={'right'} content={format(activity.timestamp, 'MMM do, yyyy H:mm:ss', {locale: getLocale(localeKey)})}>
                            <span>{formatDistanceToNowStrict(activity.timestamp, { addSuffix: true, locale: getLocale(localeKey) })}</span>
                        </Tooltip>
                    </div>
                </div>
                {activity.hasAdditionalMetadata && <ActivityLogMetaButton meta={activity.properties} />}
            </div>
        </div>
    );
};
