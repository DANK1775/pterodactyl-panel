import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import { theme as th } from 'twin.macro';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import PowerButtons from '@/components/server/console/PowerButtons';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { ArrowsExpandIcon, ClipboardIcon, ClipboardCheckIcon, TrashIcon } from '@heroicons/react/outline'
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

import 'xterm/css/xterm.css';
import styles from './style.module.css';
import Tooltip from '@/components/elements/tooltip/Tooltip';

type LogLevel = 'info' | 'warning' | 'error';

interface LogEntry {
    level?: LogLevel;
    content: string;
}

const theme = {
    background: 'transparent',
    cursor: 'transparent',
    black: th`colors.black`.toString(),
    red: '#E54B4B',
    green: '#9ECE58',
    yellow: '#FAED70',
    blue: '#396FE2',
    magenta: '#BB80B3',
    cyan: '#2DDAFD',
    white: '#d0d0d0',
    brightBlack: 'rgba(255, 255, 255, 0.2)',
    brightRed: '#FF5370',
    brightGreen: '#C3E88D',
    brightYellow: '#FFCB6B',
    brightBlue: '#82AAFF',
    brightMagenta: '#C792EA',
    brightCyan: '#89DDFF',
    brightWhite: '#ffffff',
    selection: '#FAF089',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    fontFamily: th('fontFamily.mono'),
    rows: 30,
    theme: theme,
};

interface Props {
    fullConsole?: boolean;
}

export default ({ fullConsole }: Props) => {
    const { t } = useTranslation('arix/server/console');
    const [consoleLog, setConsoleLog] = useState<LogEntry[]>([]);
    const logBufferRef = useRef<LogEntry[]>([]);
    const [logFilter, setLogFilter] = useState<LogLevel | null>(null);
    const logFilterRef = useRef<LogLevel | null>(null);
    const [isCopied, setCopied] = useState<Boolean>(false);
    const daemonText = ServerContext.useStoreState((state) => state.server.data?.daemonText);
    const containerText = ServerContext.useStoreState((state) => state.server.data?.containerText);

    const TERMINAL_PRELUDE = `\u001b[1m\u001b[33m${containerText} \u001b[0m`;
    const TERMINAL_DAEMON =  `\u001b[1m\u001b[33m${daemonText}\u001b[0m`;
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // SearchBarAddon has hardcoded z-index: 999 :(
    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
    }`;

    const detectLogLevel = (line: string): LogLevel | undefined => {
        const lower = line.toLowerCase();
        if (lower.includes('error')) return 'error';
        if (lower.includes('warn')) return 'warning';
        if (lower.includes('info')) return 'info';
        return undefined;
    };

    const addLog = (data: string) => {
        const cleanData = data.startsWith('>') ? data.substring(1) : data;
        const level = detectLogLevel(cleanData);
        const logLine: LogEntry = { level, content: cleanData };

        logBufferRef.current.push(logLine);

        if (!logFilterRef.current || logFilterRef.current === level) {
            terminal.writeln(cleanData);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (logBufferRef.current.length > 0) {
                setConsoleLog(prev => {
                    const newLogs = [...prev, ...logBufferRef.current];
                    logBufferRef.current = [];
                    return newLogs.slice(-2000); // Optional: keep max 2000 logs
                });
            }
        }, 250);

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        logFilterRef.current = logFilter;
    }, [logFilter]);


    const handleConsoleOutput = (line: string, prelude = false) => {
        addLog(
            (prelude ? TERMINAL_PRELUDE : '') +
            line
                .replace('container@pterodactyl~ ', TERMINAL_PRELUDE)
                .replace('[Pterodactyl Daemon]:', TERMINAL_DAEMON)
                .replace(/(?:\r\n|\r|\n)$/im, '') +
            '\u001b[0m'
        );
    };
    

    const handleTransferStatus = (status: string) => {
        switch (status) {
            // Sent by either the source or target node if a failure occurs.
            case 'failure':
                addLog(TERMINAL_PRELUDE + 'Transfer has failed.\u001b[0m');
                return;
        }
    };

    const handleDaemonErrorOutput = (line: string) =>
        addLog(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m'
        );

    const handlePowerChangeEvent = (state: string) =>
        addLog(TERMINAL_PRELUDE + 'Server marked as ' + state + '...\u001b[0m');

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';

            // By default up arrow will also bring the cursor to the start of the line,
            // so we'll preventDefault to keep it at the end.
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            setHistory((prevHistory) => [command, ...prevHistory!].slice(0, 32));
            setHistoryIndex(-1);

            instance && instance.send('send command', command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(unicode11Addon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);

            // Activate Unicode 11 for proper emoji and special character width handling
            terminal.unicode.activeVersion = '11';

            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            // Add support for capturing keys
            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        }
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100)
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            // Do not clear the console if the server is being transferred.
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    const openWindow = () => {
        window.open(
            `/server/${serverId}/console/popup?floating=true`,
            'popUpWindow',
            'height=500,width=800,left=100,top=100'
        );
    };

    const logData = async () => {
        setCopied(false);

        try {
            const data = consoleLog.slice(-500).map((it) => it.content.replace('\r', '')).join('\n').replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') || '';

            const response = await fetch('https://api.mclo.gs/1/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `content=${data}`,
            });
    
            const responseData = await response.json();
            await copy(responseData['url']);
            if (localStorage.getItem('panelSounds') === 'true'){
                const copySound = new Audio('/arix/copy.mp3');
                copySound.volume = 0.2;
                copySound.play();
            }
            setCopied(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const ClearTerminal = () => {
        terminal.clear();
        setConsoleLog([]);
    };
    
    return (
        <div className={classNames(styles.terminal, fullConsole ? 'fixed top-0 left-0 h-full w-full z-[90]' : 'relative rounded-box', 'backdrop')}>
            <SpinnerOverlay visible={!connected} size={'large'} />
            <div className="flex justify-between items-center">
                <div className="flex gap-x-2 pb-2">
                    <button 
                        onClick={() => {
                            const newFilter = null;
                            setLogFilter(newFilter);
                            terminal.clear();
                            consoleLog
                                .filter(log => !newFilter || log.level === newFilter)
                                .forEach(log => terminal.writeln(log.content));
                        }}
                        className={classNames(
                            'px-2 py-2 rounded text-xs font-medium',
                            logFilter === null ? 'bg-gray-500 text-gray-50' : 'text-gray-400'
                        )}
                    >
                        {t('view-all')} ({consoleLog.length > 99 ? '99+' : consoleLog.length})
                    </button>

                    {(['info', 'warning', 'error'] as LogLevel[]).map(lvl => (
                        consoleLog.filter(log => log.level === lvl).length > 0 &&
                        <button
                            key={lvl}
                            onClick={() => {
                                const newFilter = logFilter === lvl ? null : lvl;
                                setLogFilter(newFilter);
                                terminal.clear();
                                consoleLog
                                    .filter(log => !newFilter || log.level === newFilter)
                                    .forEach(log => terminal.writeln(log.content));
                            }}
                            className={classNames(
                                'px-2 py-2 rounded text-xs font-medium capitalize',
                                logFilter === lvl ? 'bg-gray-400 text-gray-50' : 'text-gray-300'
                            )}
                        >
                            {lvl} ({consoleLog.filter(log => log.level === lvl).length > 99 ? '99+' : consoleLog.filter(log => log.level === lvl).length})
                        </button>
                    ))}
                </div>
                <div className={'flex items-center gap-x-2'}>
                    <Tooltip content={t('clear-console')} placement='bottom'>
                        <button onClick={ClearTerminal} className={'block text-gray-200 hover:text-gray-100 duration-300'}>
                            <TrashIcon className={'w-5'}/>
                        </button>
                    </Tooltip>
                    <Tooltip content={t('share-logs')} placement='bottom'>
                        <button onClick={logData} className={'block text-gray-200 hover:text-gray-100 duration-300'}>
                            {isCopied 
                                ? <ClipboardCheckIcon className={'w-5 text-success-100'}/>
                                : <ClipboardIcon className={'w-5'}/>
                            }
                        </button>
                    </Tooltip>
                    <Tooltip content={t('floating-console')} placement='bottom'>
                        <button onClick={openWindow} className={'block text-gray-200 hover:text-gray-100 duration-300'}>
                            <ArrowsExpandIcon className={'w-5'}/>
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div
                className={classNames(styles.container, styles.overflows_container, { 'rounded-b': !canSendCommands })}
            >
                <div className={'h-full'}>
                    <div id={styles.terminal} ref={ref} />
                </div>
            </div>
            <div className={classNames('relative min-h-8', styles.overflows_container)}>
            {canSendCommands && (
                <>
                    <input
                        className={classNames('peer', styles.command_input)}
                        type={'text'}
                        placeholder={t('type-a-command')}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                    <div
                        className={classNames(
                            'text-gray-100 peer-focus:text-gray-50 peer-focus:animate-pulse',
                            styles.command_icon
                        )}
                    >
                        <ChevronDoubleRightIcon className={'w-4 h-4'} />
                    </div>
                </>
            )}
            {fullConsole &&
                <PowerButtons icons className={'absolute flex items-center gap-x-2 right-0 top-0 py-[4px] px-[5px]'}/>
            }
            </div>
        </div>
    );
};
