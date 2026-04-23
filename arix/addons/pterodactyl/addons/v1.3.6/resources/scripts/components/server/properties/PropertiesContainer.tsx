import React, { useState, useEffect } from 'react';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import getProperties from '@/api/server/properties/getProperties';
import updateProperties from '@/api/server/properties/updateProperties';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import Switch from '@/components/elements/Switch';
import Input from '@/components/elements/Input';
import { useTranslation } from 'react-i18next';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';
import { HiOutlineDocumentText, HiDocumentText } from "react-icons/hi";
import { LuFileText } from "react-icons/lu";
import { RiFileTextLine, RiFileTextFill } from "react-icons/ri";

export default function PropertiesContainer() {
    const { t } = useTranslation('arix/server/addons/properties');
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const { addError, clearFlashes } = useFlash();
    const [properties, setProperties] = useState<Record<string, string | boolean | number> | null>();
    const iconStyle = useStoreState((state: ApplicationStore) => state.settings.data!.arix.icon);

    useEffect(() => {
        setLoading(true);
        clearFlashes('properties');
    
        getProperties(uuid, '/server.properties')
            .then((response) => {
                setProperties(typeof response === 'string' ? JSON.parse(response) : response);
            })
            .catch((error) => {
                addError({ key: 'properties', message: t('properties-not-found') });
                setProperties(null); 
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);

    const UpdateProperties = () => {
        if(properties){
            updateProperties(uuid, '/server.properties', properties)
                .catch((error) => {
                    addError({ key: 'properties', message: error });
                });
        }
    }

    const UpdateProperty = async (key: string, value: string | boolean | number) => {
        await setProperties(prev => {
            if (prev === null) {
                return { [key]: value };
            }
            return {
                ...prev,
                [key]: value,
            };
        });
    }

    useEffect(() => {
        if (properties) {
            UpdateProperties();
        }
    }, [properties]);

    const options: { [key: string]: string[] } = {
        gamemode: [
            'survival',
            'creative',
            'adventure',
            'spectator'
        ],
        difficulty: [
            'peaceful',
            'easy',
            'normal',
            'hard'
        ]
    }


    return (
        <ServerContentBlock 
            title={t('properties')} 
            icon={
                iconStyle === 'heroicons'
                    ? HiOutlineDocumentText
                    : iconStyle === 'heroiconsFilled'
                    ? HiDocumentText
                    : iconStyle === 'lucide'
                    ? LuFileText
                    : iconStyle === 'remixicon'
                    ? RiFileTextLine
                    : RiFileTextFill
            }
        >
            <FlashMessageRender byKey={'properties'} />
            {(!properties || loading) ? (
                !loading && (
                    <div className={'text-center'}>{t('properties-not-found')}</div>
                )
            ) : (
                <div className={'grid lg:grid-cols-2 gap-4'}>
                    <div className={'lg:col-span-2'}>
                        <Input
                            placeholder={t('search-for-property')}
                            type="text"
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {Object
                        .entries(properties)
                        .filter(([key, value]) => {
                            return key.toLowerCase().replace(/-/g, ' ').includes(search.toLowerCase().replace(/-/g, ' '));
                        })
                        .map(([key, value]) => (
                        <div className={'rounded-box bg-neutral-700 backdrop px-6 py-5'}>
                            <div className={'flex items-center gap-x-2 mb-2'}>
                                <p className={'font-medium capitalize'}>
                                    {key.replace(/-/g, ' ')}
                                </p>
                                <a 
                                    className={'text-gray-300'} 
                                    href={`https://minecraft.fandom.com/wiki/Server.properties#${key}`} 
                                    target={'_blank'}
                                >
                                    <ExternalLinkIcon className={'w-5'} />
                                </a>
                            </div>
                            {typeof value === 'boolean' ? (
                                <div className={'flex items-center gap-x-2'}>
                                    <Switch 
                                        name={key} 
                                        onChange={(e) => UpdateProperty(key, e.target.checked)} 
                                        defaultChecked={value} 
                                    />
                                    <span className={'text-sm text-gray-300'}>
                                        {value 
                                            ? t('enabled')
                                            : t('disabled')
                                        }
                                    </span>
                                </div>
                            ) : (
                                options[key] ? (
                                    <div className={'flex gap-1'}>
                                        {options[key].map((option: string) => (
                                            <button
                                                key={option}
                                                onClick={() => UpdateProperty(key, option)}
                                                className={`px-3 py-1 capitalize rounded-component font-medium transition duration-300 ${
                                                    properties[key] === option
                                                        ? 'bg-arix text-white'
                                                        : 'bg-gray-600 hover:bg-gray-500'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <Input
                                        placeholder={key}
                                        type="text"
                                        value={String(value ?? '')} 
                                        onChange={(e) => UpdateProperty(key, e.target.value)}
                                    />
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </ServerContentBlock>
    )
}