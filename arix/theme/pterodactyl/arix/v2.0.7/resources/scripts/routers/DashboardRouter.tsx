import React from 'react';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';
import { Route, Switch } from 'react-router-dom';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import Announcement from '@/components/elements/Announcement';
import TransitionRouter from '@/TransitionRouter';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';

import SideBar from '@/routers/layouts/SideBar';
import IconBar from '@/routers/layouts/IconBar';
import NavigationBar from '@/routers/layouts/NavigationBar';

export default () => {
    const location = useLocation();
    const layout = useStoreState((state: ApplicationStore) => state.settings.data!.arix.layout);
    const background = useStoreState((state: ApplicationStore) => state.settings.data!.arix.background);
    const backgroundFaded = useStoreState((state: ApplicationStore) => state.settings.data!.arix.backgroundFaded);

    return (
        <>
        <div className={`min-h-screen flex h-full bg-gray-800 relative z-10`}>
            {String(background) === 'true' &&
                <div className={`absolute top-0 left-0 w-full h-full bg-center bg-no-repeat bg-cover bg-fixed -z-10 
                    ${backgroundFaded === 'translucent' ? 'opacity-50' : 'opacity-100'}
                    ${backgroundFaded === 'faded' ? `after:content-[''] after:bg-center after:bg-cover after:bg-fixed after:absolute after:inset-0 after:bg-gradient-to-b from-transparent to-gray-800` : ''}
                `} 
                    css={`background-image:var(--image);`}
                />
            }
            {(layout == 1 || layout == 2 || layout == 5) && <SideBar />}
            {layout == 4 && <IconBar/>}
            <div className="w-full">
                <NavigationBar />
                <Announcement />
                <TransitionRouter>
                    <React.Suspense fallback={<Spinner centered />}>
                        <Switch location={location}>
                            <Route path={'/'} exact>
                                <DashboardContainer />
                            </Route>
                            {routes.account.map(({ path, component: Component }) => (
                                <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                    <Component />
                                </Route>
                            ))}
                            <Route path={'*'}>
                                <NotFound />
                            </Route>
                        </Switch>
                    </React.Suspense>
                </TransitionRouter>
            </div>
        </div>
        </>
    );
};
