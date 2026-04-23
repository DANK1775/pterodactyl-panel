import React, { lazy } from 'react';
import DashboardContainer from '@/components/server/dashboard/DashboardContainer';
import ServerConsole from '@/components/server/console/ServerConsoleContainer';
import FullConsoleContainer from '@/components/server/console/FullConsoleContainer';
import DatabasesContainer from '@/components/server/databases/DatabasesContainer';
import ScheduleContainer from '@/components/server/schedules/ScheduleContainer';
import UsersContainer from '@/components/server/users/UsersContainer';
import BackupContainer from '@/components/server/backups/BackupContainer';
import NetworkContainer from '@/components/server/network/NetworkContainer';
import StartupContainer from '@/components/server/startup/StartupContainer';
import FileManagerContainer from '@/components/server/files/FileManagerContainer';
import SettingsContainer from '@/components/server/settings/SettingsContainer';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import ActivityLogContainer from '@/components/dashboard/activity/ActivityLogContainer';
import ServerActivityLogContainer from '@/components/server/ServerActivityLogContainer';
import { 
    HiOutlineUser, HiOutlineEye, HiOutlineViewGrid, HiOutlineTerminal, HiOutlineFolderOpen, HiOutlineDatabase, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineArchive, HiOutlineGlobe, HiOutlineAdjustments, HiOutlineCog,
    HiUser, HiEye, HiViewGrid, HiTerminal, HiFolderOpen, HiDatabase, HiCalendar, HiUserGroup, HiArchive, HiGlobe, HiAdjustments, HiCog
 } from "react-icons/hi";
import { LuUser, LuEye, LuLayoutGrid, LuTerminal, LuFolder, LuDatabase, LuCalendar, LuUsers, LuArchive, LuGlobe, LuSlidersVertical, LuCog } from "react-icons/lu";
import { 
    RiUserLine, RiEyeLine, RiLayoutGridLine, RiTerminalBoxLine, RiFolderOpenLine, RiDatabaseLine, RiCalendarLine, RiGroupLine, RiArchiveLine, RiGlobalLine, RiSoundModuleLine, RiSettings2Line,
    RiUserFill, RiEyeFill, RiLayoutGridFill, RiTerminalBoxFill, RiFolderOpenFill, RiDatabaseFill, RiCalendarFill, RiGroupFill, RiArchiveFill, RiGlobalFill, RiSoundModuleFill, RiSettings2Fill
 } from "react-icons/ri";
import CodeEditorContainer from '@/components/server/files/codeEditor/CodeEditorContainer';

const FileEditContainer = lazy(() => import('@/components/server/files/FileEditContainer'));
const ScheduleEditContainer = lazy(() => import('@/components/server/schedules/ScheduleEditContainer'));

/*
        ██╗██╗  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗  ██╗██╗
        ██║██║  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║  ██║██║
        ██║██║  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║  ██║██║
        ╚═╝╚═╝  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║  ╚═╝╚═╝
        ██╗██╗  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║  ██╗██╗
        ╚═╝╚═╝  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝  ╚═╝╚═╝


        Read this before doing addon modifications

        Arix Theme has already handled many panel 
        modifications for you, so there's no need for 
        any changes in the "ServerRouter.tsx" file.

        To add an adodn to your theme, you just need
        to add an icon from the Heroicons font pack to
        the import statement on line 16. You can find
        the icons at https://v1.heroicons.com/. For
        instance, if you want to add "inbox-in", include
        the following in the import statement: 

        "InboxInIcon," 
        
        Your import statement might look like this example:

        import { InboxInIcon, UserIcon, EyeIcon, ... 

        After importing the desired icon, refer to the addon's
        readme file and include the required import line. 
        An example might be:

        import PluginInstallerContainer from '@/components/server/plugin/PluginInstallerContainer';

        Once you've imported the correct icon and the component,
        you simply need to follow the instructions in the addon's
        readme to add the route. Don't forget to include
        the icon in the route definition. Here's an example:

        {
            path: '/plugin-installer',
            permission: null,
            name: 'Plugin installer',
            icon: InboxInIcon,  
            component: PluginInstallerContainer,
            exact: true,
        },
*/

interface RouteDefinition {
    path: string;
    // If undefined is passed this route is still rendered into the router itself
    // but no navigation link is displayed in the sub-navigation menu.
    name: string | undefined;
    component: React.ComponentType;
    icon?: React.ComponentType[];
    exact?: boolean;
}

interface ServerRouteDefinition extends RouteDefinition {
    permission: string | string[] | null;
    nestId?: number;
    eggId?: number;
    nestIds?: number[];
    eggIds?: number[];
}  

interface Routes {
    // All of the routes available under "/account"
    account: RouteDefinition[];
    // All of the routes available under "/server/:id"
    server: {
        general: ServerRouteDefinition[];
        management: ServerRouteDefinition[];
        configuration: ServerRouteDefinition[];
    };
}

export default {
    account: [
        {
            path: '/',
            name: 'account',
            icon: [HiOutlineUser, HiUser, LuUser, RiUserLine, RiUserFill],
            component: AccountOverviewContainer,
            exact: true,
        },
        {
            path: '/activity',
            name: 'account-activity',
            icon: [HiOutlineEye, HiEye, LuEye, RiEyeLine, RiEyeFill],
            component: ActivityLogContainer,
        },
    ],
    server: {
        general: [
            {
                path: '/',
                permission: null,
                name: 'dashboard',
                icon: [HiOutlineViewGrid, HiViewGrid, LuLayoutGrid, RiLayoutGridLine, RiLayoutGridFill],
                component: DashboardContainer,
                exact: true,
            },
            {
                path: '/console',
                permission: null,
                name: 'console',
                icon: [HiOutlineTerminal, HiTerminal, LuTerminal, RiTerminalBoxLine, RiTerminalBoxFill],
                component: ServerConsole,
                exact: true,
            },
            {
                path: '/console/popup',
                permission: null,
                name: undefined,
                component: FullConsoleContainer,
            },
            {
                path: '/settings',
                permission: ['settings.*', 'file.sftp'],
                name: 'settings',
                icon: [HiOutlineCog, HiCog, LuCog, RiSettings2Line, RiSettings2Fill],
                component: SettingsContainer,
            },
            {
                path: '/activity',
                permission: 'activity.*',
                name: 'activity',
                icon: [HiOutlineEye, HiEye, LuEye, RiEyeLine, RiEyeFill],
                component: ServerActivityLogContainer,
            },
        ],
        management: [
            {
                path: '/files',
                permission: 'file.*',
                name: 'files',
                icon: [HiOutlineFolderOpen, HiFolderOpen, LuFolder, RiFolderOpenLine, RiFolderOpenFill],
                component: FileManagerContainer,
            },
            {
                path: '/files/:action(edit|new)',
                permission: 'file.*',
                name: undefined,
                component: FileEditContainer,
            },
            {
                path: '/files/code-editor',
                permission: 'file.*',
                name: undefined,
                component: CodeEditorContainer,
            },
            {
                path: '/databases',
                permission: 'database.*',
                name: 'databases',
                icon: [HiOutlineDatabase, HiDatabase, LuDatabase, RiDatabaseLine, RiDatabaseFill],
                component: DatabasesContainer,
            },
            {
                path: '/backups',
                permission: 'backup.*',
                name: 'backups',
                icon: [HiOutlineArchive, HiArchive, LuArchive, RiArchiveLine, RiArchiveFill],
                component: BackupContainer,
            },
            {
                path: '/network',
                permission: 'allocation.*',
                name: 'network',
                icon: [HiOutlineGlobe, HiGlobe, LuGlobe, RiGlobalLine, RiGlobalFill],
                component: NetworkContainer,
            },
        ],
        configuration: [
            {
                path: '/schedules',
                permission: 'schedule.*',
                name: 'schedules',
                icon: [HiOutlineCalendar, HiCalendar, LuCalendar, RiCalendarLine, RiCalendarFill],
                component: ScheduleContainer,
            },
            {
                path: '/schedules/:id',
                permission: 'schedule.*',
                name: undefined,
                component: ScheduleEditContainer,
            },
            {
                path: '/users',
                permission: 'user.*',
                name: 'users',
                icon: [HiOutlineUserGroup, HiUserGroup, LuUsers, RiGroupLine, RiGroupFill],
                component: UsersContainer,
            },
            {
                path: '/startup',
                permission: 'startup.*',
                name: 'startup',
                icon: [HiOutlineAdjustments, HiAdjustments, LuSlidersVertical, RiSoundModuleLine, RiSoundModuleFill],
                component: StartupContainer,
            },
        ]
    }
} as Routes;
