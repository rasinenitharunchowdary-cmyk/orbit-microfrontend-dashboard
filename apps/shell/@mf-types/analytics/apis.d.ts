
    export type RemoteKeys = 'analytics/App';
    type PackageType<T> = T extends 'analytics/App' ? typeof import('analytics/App') :any;