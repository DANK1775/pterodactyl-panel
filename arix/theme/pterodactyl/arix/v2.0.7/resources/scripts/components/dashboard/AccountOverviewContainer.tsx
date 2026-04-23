import React, { useState } from 'react';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import AccountSSHContainer from '@/components/dashboard/ssh/AccountSSHContainer';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateProfileForm from '@/components/dashboard/forms/UpdateProfileForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import AppearanceWrapper from '@/components/dashboard/forms/AppearanceWrapper';
import PageContentBlock from '@/components/elements/PageContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import UserAvatar from '@/components/UserAvatar'
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('arix/account');
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();
    const [isTab, setIsTab] = useState('ssh')

    return (
        <PageContentBlock title={t('account-overview')}>
            {state?.twoFactorRedirect ? (
                <div>
                    <MessageBox title={'2-Factor Required'} type={'error'}>
                        Your account must have two-factor authentication enabled in order to continue.
                    </MessageBox>
                    <ConfigureTwoFactorForm />
                </div>
            ) : (
                <div>
                    <div className={'grid lg:grid-cols-2 gap-4 mb-4'}>
                        <div className={'flex flex-col gap-4'}>
                            <div className={'bg-gray-700 backdrop rounded-box overflow-hidden'}>
                                <div className={'w-full relative px-6 pt-5 z-10'}>
                                    <div className={'h-3/4 w-full absolute top-0 left-0 z-[-1]'} css={'background: linear-gradient(90deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 25%, transparent) 100%);'} />
                                    <div className={'w-[60px] rounded-component border-4 border-gray-700 overflow-hidden'}>
                                        <UserAvatar width={'60px'} rounded={'rounded-none'}/>
                                    </div>
                                </div>
                                <FlashMessageRender byKey={'account:email'} />
                                <UpdateEmailAddressForm />
                            </div>
                            <FlashMessageRender byKey={'account:profile'} />
                            <UpdateProfileForm />
                            <AppearanceWrapper />
                        </div>
                        <div className={'flex flex-col gap-4'}>
                            <FlashMessageRender byKey={'account:password'} />
                            <UpdatePasswordForm />
                            <ConfigureTwoFactorForm />
                        </div>
                    </div>
                    <div className={'bg-gray-700 backdrop rounded-box px-6 py-5'}>
                        <div className={'flex justify-between mb-5'}>
                            <p className={'text-gray-300 font-medium'}>
                                {isTab == 'api' 
                                ? t('apikey')
                                : isTab == 'ssh'
                                && t('sshkey')}
                            </p>
                            <div className={'flex gap-x-4'}>
                                <button onClick={() => setIsTab('api')} className={`pb-2 border-b duration-300 ${isTab === 'api' ? 'border-arix text-gray-50' : 'border-transparent hover:text-gray-50'}`}>
                                    {t('apikey')}
                                </button>
                                <button onClick={() => setIsTab('ssh')} className={`pb-2 border-b duration-300 ${isTab === 'ssh' ? 'border-arix text-gray-50' : 'border-transparent hover:text-gray-50'}`}>
                                    {t('sshkey')}
                                </button>
                            </div>
                        </div>
                        {isTab == 'api' 
                        ? <AccountApiContainer />
                        : isTab == 'ssh'
                        && <AccountSSHContainer />}
                    </div>
                </div>
            )}
        </PageContentBlock>
    );
};
