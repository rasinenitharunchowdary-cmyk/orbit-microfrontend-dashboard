
    export type RemoteKeys = 'notifications/App';
    type PackageType<T> = T extends 'notifications/App' ? typeof import('notifications/App') :any;