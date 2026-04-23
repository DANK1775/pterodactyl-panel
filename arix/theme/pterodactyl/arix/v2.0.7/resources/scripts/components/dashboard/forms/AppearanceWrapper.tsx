import React, { useState, useEffect, ChangeEvent } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { useTranslation } from 'react-i18next';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import Switch from '@/components/elements/Switch';
import Select from '@/components/elements/Select';
import updateAccountLanguage from '@/api/account/updateAccountLanguage';

const AppearanceWrapper = () => {
    const { i18n, t } = useTranslation('arix/account');
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const modeToggler = String(useStoreState((state: ApplicationStore) => state.settings.data!.arix.modeToggler));
    const langSwitch = String(useStoreState((state: ApplicationStore) => state.settings.data!.arix.langSwitch));
    const defaultMode = useStoreState((state: ApplicationStore) => state.settings.data!.arix.defaultMode);
    const languages = useStoreState((state: ApplicationStore) => state.settings.data!.arix.languageOptions);

    const useLocalToggle = (key: string, className?: string) => {
        const [value, setValue] = useState<boolean>(() => {
            const stored = localStorage.getItem(key);
            return stored ? stored === 'true' : false;
        });

        useEffect(() => {
            localStorage.setItem(key, String(value));
            if (className) document.body.classList.toggle(className, value);
        }, [key, value, className]);

        const toggle = () => setValue((v) => !v);
        return [value, toggle] as const;
    };

    const [isDarkMode, toggleDarkMode] = useLocalToggle('darkMode', 'lightmode');
    const [isCompact, toggleCompactMode] = useLocalToggle('compactMode', 'compact');
    const [isPrivacyMode, togglePrivacyMode] = useLocalToggle('privacyMode', 'privacy');
    const [panelSounds, toggleSounds] = useLocalToggle('panelSounds');

    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;

        updateAccountLanguage(newLanguage)
            .then(() => {
                i18n.changeLanguage(newLanguage);
                setSelectedLanguage(newLanguage);
            })

    };

    useEffect(() => {
        setSelectedLanguage(i18n.language || 'en');
    }, [i18n.language]);

    const ToggleRow = ({ label, offLabel, onLabel, value, onToggle, name }: {
        label: React.ReactNode;
        offLabel?: string;
        onLabel?: string;
        value: boolean;
        onToggle: () => void;
        name: string;
    }) => (
        <div className={'flex justify-between items-center'}>
            <p>{label}</p>
            <div className={'flex gap-x-2 items-center'}>
                <span className={'text-sm text-gray-300'}>{offLabel ?? t('appearance.off')}</span>
                <Switch name={name} onChange={onToggle} defaultChecked={value} />
                <span className={'text-sm text-gray-300'}>{onLabel ?? t('appearance.on')}</span>
            </div>
        </div>
    );

    return (
        <TitledGreyBox title={t('appearance.title')}>
            <div className='space-y-4'>
                {langSwitch == 'true' &&
                <div className={'flex justify-between items-center'}>
                    <p className={'flex-1'}>{t('appearance.language')}</p>
                    <Select value={selectedLanguage} className={'!w-auto !pr-10'} onChange={handleLanguageChange}>
                        {languages.map((lang: { key: string; name: string }) => (
                            <option key={lang.key} value={lang.key}>
                                {lang.name}
                            </option>
                        ))}
                    </Select>
                </div>}
                {modeToggler == 'true' &&
                <div className={'flex justify-between items-center'}>
                    <p>{t('appearance.lightDarkMode')}</p>
                    <div className={'flex gap-x-2 items-center'}>
                        <span className={'text-sm text-gray-300'}>{defaultMode == 'lightmode' ? t('appearance.light') : t('appearance.dark')}</span>
                        <Switch name={'mode'} onChange={toggleDarkMode} defaultChecked={isDarkMode} />
                        <span className={'text-sm text-gray-300'}>{defaultMode !== 'lightmode' ? t('appearance.light') : t('appearance.dark')}</span>
                    </div>
                </div>}
                <ToggleRow label={t('appearance.panel-sounds')} value={panelSounds} onToggle={toggleSounds} name={'panel-sounds'} />
                {/* <ToggleRow label={'Display mode'} offLabel={'Normal'} onLabel={'Compact'} value={isCompact} onToggle={toggleCompactMode} name={'compact'} /> */}
                <ToggleRow label={t('appearance.privacy-mode')} offLabel={t('appearance.off')} onLabel={t('appearance.on')} value={isPrivacyMode} onToggle={togglePrivacyMode} name={'privacy'} />
            </div>
        </TitledGreyBox>
    );
};

export default AppearanceWrapper;
