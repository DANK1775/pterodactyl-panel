import React, { useRef, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { 
    HiOutlineUserCircle, HiOutlineServer,
    HiUserCircle, HiServer
 } from "react-icons/hi";
import { LuCircleUser, LuServer } from "react-icons/lu";
import {
    RiAccountCircle2Line, RiServerLine,
    RiAccountCircle2Fill, RiServerFill
} from "react-icons/ri";
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { useTranslation } from 'react-i18next';
import ClientDropdown from '@/routers/layouts/ClientDropdown';

interface Props {
    children?: React.ReactNode;
    type?: boolean;
}

const SideBar = ({ children, type }: Props) => {
    const { t } = useTranslation('arix/navigation');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const layout = useStoreState((state: ApplicationStore) => state.settings.data!.arix.layout);
    const logo = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logo);
    const logoLight = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logoLight);
    const logoHeight = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logoHeight);
    const fullLogo = useStoreState((state: ApplicationStore) => state.settings.data!.arix.fullLogo);
    const icon = useStoreState((state: ApplicationStore) => state.settings.data!.arix.icon);

    const darkMode = localStorage.getItem('darkMode') === 'true';

    useEffect(() => {
        const storedMode = localStorage.getItem('darkMode');
        if (storedMode !== null) {
          setIsDarkMode(storedMode === 'true');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', String(isDarkMode));
        document.body.classList.toggle('lightmode', isDarkMode);
    }, [isDarkMode]);


    const NavigationLinks = styled.div`
        ${tw`flex flex-col gap-1`};

        & > div{
            ${tw`flex flex-col gap-1`};

            & > span{
                ${tw`px-5 text-sm text-gray-300 font-medium mt-4 uppercase`}
            }
        }

        & a{
            ${tw`relative z-10 flex px-5 py-2 gap-x-2 items-center duration-300 border-r-2 border-transparent`}

            & > svg{
                ${tw`text-gray-300 w-5`}
            }

            &::after{
                ${tw`absolute inset-0 z-[-1] opacity-0 duration-300`}
                content: '';
                background: ${layout == 5 ? 'var(--primary)' : 'linear-gradient(90deg, color-mix(in srgb, var(--gray700) 0%, transparent) 0%, color-mix(in srgb, var(--primary) 30%, transparent) 100%)'}; 
            }

            &:hover,
            &:focus,
            &.active{
                ${tw`text-gray-100 border-arix`}

                &::after{
                    ${tw`opacity-100`}
                }

                & > svg{
                    ${layout == 5 ? tw`text-gray-100` : tw`text-arix duration-300`}
                }
            }
        }
    `;

    return (
    <div className={'w-[250px] shrink-0 bg-gray-700 h-screen overflow-y-auto lg:flex hidden flex-col sticky top-0 backdrop border-t-0 border-b-0 border-l-0'}>
        <div className={'pt-3'}>
            <Link to={'/'} className='flex gap-x-2 items-center font-semibold text-lg text-gray-50 px-5 pt-2 pb-5'>
                <img src={darkMode ? logoLight : logo} alt={name + 'logo'} css={`height:${logoHeight}px;`} />
                {String(fullLogo) === 'false' && name}
            </Link>
            {!type &&
            <NavigationLinks className={'mb-4'}>
                <NavLink to={'/'} exact>
                    {icon === 'heroicons' ?
                        <HiOutlineServer className={'text-lg'} />
                        : icon === 'heroiconsFilled' ?
                            <HiServer className={'text-lg'} />
                            : icon === 'lucide' ?
                                <LuServer className={'text-lg'} />
                                : icon === 'remixicon' ?
                                    <RiServerLine className={'text-lg'} />
                                    :
                                    <RiServerFill className={'text-lg'} />
                    }
                    {t('servers')}
                </NavLink>
                <NavLink to={'/account'} exact>
                    {icon === 'heroicons' ?
                        <HiOutlineUserCircle className={'text-lg'} />
                        : icon === 'heroiconsFilled' ?
                            <HiUserCircle className={'text-lg'} />
                            : icon === 'lucide' ?
                                <LuCircleUser className={'text-lg'} />
                                : icon === 'remixicon' ?
                                    <RiAccountCircle2Line className={'text-lg'} />
                                    :
                                    <RiAccountCircle2Fill className={'text-lg'} />
                    }
                    {t('account')}
                </NavLink>
            </NavigationLinks>}
            <hr className={'border-b border-gray-500 mx-5'}/>
        </div>
        {children &&
        <NavigationLinks className={'pb-2'}>
            {children}
        </NavigationLinks>
        }
        <div className="sticky bottom-0 bg-gray-700 pb-4 px-5 z-20 mt-auto backdrop-blur-xl">
            <hr className={'border-b border-gray-500 mb-4'}/>
            <ClientDropdown sideBar={true} />
        </div>
    </div>
)};

export default SideBar;