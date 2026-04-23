import React from 'react';
import { InstalledPlugin } from '@/api/server/plugins/Plugins';
import GreyRowBox from '@/components/elements/GreyRowBox';
import DeletePlugin from '@/components/server/plugins/DeletePlugin';

export default function InstalledPluginRow({ ...props}: InstalledPlugin){

    return(
        <GreyRowBox key={props.id} className={'items-center gap-3'} $hoverable={false}>
            <img 
                src={props.plugin_icon === 'https://www.spigotmc.org/' ? '/arix/Arix.png' : props.plugin_icon} 
                width={64} 
                height={64} 
                alt={`${props.plugin_name.slice(0, 5)} Icon`}
                className={'shrink-0'}
            />
            <div>
                <p className={'text-lg font-medium'}>
                    {props.plugin_name}
                </p>
                <p className={'text-sm text-gray-300'}>
                    {props.plugin_version}
                </p>
            </div>

            <DeletePlugin 
                plugin_id={props.id}
                file_name={props.file_name}
            />
        </GreyRowBox>
    )
}