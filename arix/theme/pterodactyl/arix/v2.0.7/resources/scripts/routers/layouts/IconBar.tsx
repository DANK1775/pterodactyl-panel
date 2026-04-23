import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { UserCircleIcon, CogIcon, EyeIcon, LogoutIcon } from '@heroicons/react/outline';
import http from '@/api/http';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const NavigationLinks = styled.div`
    ${tw`flex flex-col gap-2 h-full`};

    & > div{
        ${tw`flex flex-col gap-2`};

        & > span{
            ${tw`hidden`}
        }
    }

    & a,
    & button{
        ${tw`relative z-10 flex items-center justify-center duration-300 rounded-component`};
        aspect-ratio: 1 / 1;

        & > svg{
            ${tw`text-gray-200 w-6 duration-300`};
        }
        & > span{
            ${tw`hidden`}
        }

        &:hover > span{
            ${tw`opacity-100 bottom-[30px]`}
        }

        &.active,
        &:focus,
        &:hover{
            background-color: color-mix(in srgb, var(--gray50) 10%, transparent);

            & > svg{
                ${tw`text-gray-100 w-7`}
            }
        }
    }
`;

interface Props {
    children?: React.ReactNode;
}

const SideBarIcon = ({ children }: Props) => {
    const { t } = useTranslation('arix/navigation');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logo = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logo);
    const logoLight = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logoLight);
    const logoHeight = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logoHeight);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
    <div className={'w-[75px] shrink-0 bg-gray-700 h-screen overflow-y-auto lg:flex hidden flex-col sticky top-0 backdrop border-t-0 border-b-0 border-l-0 px-4 py-3'}>
        <SpinnerOverlay visible={isLoggingOut} />
        <NavigationLinks>
            <div className={'pb-2 border-b border-gray-400'}>
                <NavLink to={'/'} exact>
                    <img src={darkMode ? logoLight : logo} alt={name + 'logo'} css={`height:${logoHeight};`} />
                    <span>{t('servers')}</span>
                </NavLink>
                <NavLink to={'/account'} exact>
                    <UserCircleIcon/>
                    <span>{t('account')}</span>
                </NavLink>
                <NavLink to={'/account/activity'}>
                    <EyeIcon/>
                    <span>{t('account-activity')}</span>
                </NavLink>
                {rootAdmin &&
                    <a href={'/admin'}>
                        <CogIcon/>
                        <span>{t('admin-view')}</span>
                    </a>
                }
            </div>
            {children ? children : ''}
            <div className={'mt-auto pt-2 border-t border-gray-400'}>
                <button onClick={onTriggerLogout}>
                    <LogoutIcon />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </NavigationLinks>
    </div>
)};

export default SideBarIcon;