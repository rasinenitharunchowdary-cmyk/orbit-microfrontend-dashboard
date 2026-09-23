
    export type RemoteKeys = 'users/App';
    type PackageType<T> = T extends 'users/App' ? typeof import('users/App') :any;