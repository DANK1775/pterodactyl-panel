import React from 'react';
import { ServerContext } from '@/state/server';
import routes from '@/routers/routes';
import Can from '@/components/elements/Can';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import PermissionRoute from '@/components/elements/PermissionRoute';
import Spinner from '@/components/elements/Spinner';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';

const ICON_MAP: Record<string, number> = {
    heroicons: 0,
    heroiconsFilled: 1,
    lucide: 2,
    remixicon: 3,
    remixiconFilled: 4,
};

const ALL_ROUTES = [
    ...routes.server.general,
    ...routes.server.management,
    ...routes.server.configuration,
];

const shouldDisplayRoute = (route: any, nestId?: number, eggId?: number): boolean => {
    const hasNestMatch = route.nestIds?.includes(nestId ?? 0) || route.nestId === nestId;
    const hasEggMatch = route.eggIds?.includes(eggId ?? 0) || route.eggId === eggId;
    const hasNoRestrictions = !route.eggIds && !route.nestIds && !route.nestId && !route.eggId;
    return hasNestMatch || hasEggMatch || hasNoRestrictions;
};

const useArixSettings = () => {
    const { dashboardPage, icon } = useStoreState((state: ApplicationStore) => state.settings.data!.arix);
    const isDashboardDisabled = String(dashboardPage) === 'false';
    return { isDashboardDisabled, icon };
};

const useServerIds = () => {
    const nestId = ServerContext.useStoreState((state) => state.server.data?.nestId);
    const eggId = ServerContext.useStoreState((state) => state.server.data?.eggId);
    return { nestId, eggId };
};

const usePathBuilder = () => {
    const match = useRouteMatch<{ id: string }>();
    return (value: string, useUrl = false) => {
        const base = (useUrl ? match.url : match.path).replace(/\/*$/, '');
        return `${base}/${value.replace(/^\/+/, '')}`;
    };
};

const getAdjustedPath = (path: string, isDashboardDisabled: boolean) => 
    path === '/console' && isDashboardDisabled ? '/' : path;

const renderIcon = (route: any, iconType: string) => {
    const iconIndex = ICON_MAP[iconType];
    const IconComponent = route.icon?.[iconIndex];
    return IconComponent ? <IconComponent size="1.25rem" /> : null;
};

const NavItem = ({ route }: { route: any }) => {
    const { t } = useTranslation('arix/navigation');
    const { isDashboardDisabled, icon } = useArixSettings();
    const { nestId, eggId } = useServerIds();
    const buildPath = usePathBuilder();

    if (!shouldDisplayRoute(route, nestId, eggId)) return null;

    const path = getAdjustedPath(route.path, isDashboardDisabled);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        window.open(`${buildPath(route.path, true)}?floating=true`, '_blank', 'height=500,width=800,left=100,top=100');
    };

    return (
        <NavLink to={buildPath(path, true)} exact={route.exact} onContextMenu={handleContextMenu}>
            {renderIcon(route, icon)}
            <span>{t(route.name)}</span>
        </NavLink>
    );
};

const NavItemWrapper = ({ route }: { route: any }) => {
    const { isDashboardDisabled } = useArixSettings();
    
    if (route.path === '/' && isDashboardDisabled) return null;

    return route.permission ? (
        <Can key={route.path} action={route.permission} matchAny>
            <NavItem route={route} />
        </Can>
    ) : (
        <NavItem route={route} />
    );
};

const RouteList = ({ routes }: { routes: any[] }) => (
    <>
        {routes
            .filter((route) => !!route.name)
            .map((route) => <NavItemWrapper key={route.path} route={route} />)}
    </>
);

const NavigationDropdown = ({ label, routes }: { label: string; routes: any[] }) => (
    <div className="dropdown">
        <span>{label} <ChevronDownIcon className="w-3" /></span>
        <div className="dropdown-body">
            <RouteList routes={routes} />
        </div>
    </div>
);

const NavigationSection = ({ label, routes }: { label: string; routes: any[] }) => {
    
    return (
        <div>
            <span>{label}</span>
            <RouteList routes={routes} />
        </div>
    )
};

export const SubNavigationLinks = () => {
    const { t } = useTranslation('arix/navigation');

    return (
        <>
            <RouteList routes={routes.server.general} />
            <NavigationDropdown label={t('management')} routes={routes.server.management} />
            <NavigationDropdown label={t('configuration')} routes={routes.server.configuration} />
        </>
    );
};

export const Navigation = () => {
    const { t } = useTranslation('arix/navigation');

    return (
        <>
            <NavigationSection label={t('general')} routes={routes.server.general} />
            <NavigationSection label={t('management')} routes={routes.server.management} />
            <NavigationSection label={t('configuration')} routes={routes.server.configuration} />
        </>
    );
};

export const ComponentLoader = () => {
    const location = useLocation();
    const { isDashboardDisabled } = useArixSettings();
    const { nestId, eggId } = useServerIds();
    const buildPath = usePathBuilder();

    return (
        <TransitionRouter>
            <Switch location={location}>
                {ALL_ROUTES.map((route) => {
                    if (!shouldDisplayRoute(route, nestId, eggId)) return null;
                    if (route.path === '/' && isDashboardDisabled) return null;

                    const path = getAdjustedPath(route.path, isDashboardDisabled);
                    const Component = route.component;

                    return (
                        <PermissionRoute key={path} permission={route.permission} path={buildPath(path)} exact>
                            <Spinner.Suspense>
                                <Component />
                            </Spinner.Suspense>
                        </PermissionRoute>
                    );
                })}
                <Route path={'*'} component={NotFound} />
            </Switch>
        </TransitionRouter>
    );
};
