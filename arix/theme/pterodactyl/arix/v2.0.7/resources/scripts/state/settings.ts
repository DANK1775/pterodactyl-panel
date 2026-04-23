import { action, Action } from 'easy-peasy';

export interface SiteSettings {
    name: string;
    locale: string;
    arix: {
        logo: string,
        logoLight: string,
        fullLogo: boolean,
        logoHeight: number,
        
        announcement: boolean,
        announcementColor: string,
        announcementIcon: string,
        announcementMessage: string,
        announcementCta: boolean,
        announcementCtaTitle: string,
        announcementCtaLink: string,
        announcementDismissable: boolean,
      
        /* COMPONENTS */
        serverRow: number,
        socialButtons: boolean,
        discordBox: boolean,
      
        statsCards: number,
        sideGraphs: number,
        graphs: number,
      
        dashboardWidgets: string[],
      
        /* SOCIALS */
        discord: string,
        support: string,
      
        /* LAYOUT */
        layout: number,
        searchComponent: number,
        logoPosition: number,
        socialPosition: number,
        loginLayout: number,
      
        /* STYLING */
        background: boolean,
        backgroundImage: string,
        backgroundFaded: 'default' | 'translucent' | 'faded',
        backdrop: boolean,
        backdropPercentage: string,
        defaultMode: string,
        modeToggler: boolean,
        langSwitch: boolean,
        defaultLang: string,
        languageOptions: { key: string; name: string }[],
        copyright: string,
        radiusInput: string,
        borderInput: boolean,
        radiusBox: string,
        flashMessage: number,
        pageTitle: boolean,
        loginBackground: string,
        loginGradient: boolean,

        icon: string,
        
        socials: {
            title: string;
            icon: 'billing' | 'status' | 'support' | 'discord' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github';
            description: string;
            link: string;
        }[];

        profileType: string,
        ipFlag: boolean;
        lowResourcesAlert: boolean;
        alertLink: string;
        dashboardPage: boolean;
        registration: boolean;

        /* COLORS */
        primary: string,
    };
    recaptcha: {
        method: 'recaptcha' | 'turnstile';
        enabled: boolean;
        siteKey: string;
    };
    turnstile: {
        siteKey: string;
    };
}

export interface SettingsStore {
    data?: SiteSettings;
    setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
    data: undefined,

    setSettings: action((state, payload) => {
        state.data = payload;
    }),
};

export default settings;
