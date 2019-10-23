export interface Target {
    service: "github.com";
    owner: string;
    repo: string;
    path?: string;
}

export interface TargetPath extends Target {
    path: string
}

export function isTargetPath(target: Target): target is TargetPath {
    return !!target.path
}