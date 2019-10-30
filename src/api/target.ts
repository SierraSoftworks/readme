export interface Target {
    service: "github.com";
    owner: string;
    repo: string;
    branch?: string
    path?: string;
}

export interface TargetPath extends Target {
    path: string
}

export function isTargetPath(target: Target): target is TargetPath {
    return !!target.path
}

export interface TargetBranch extends Target {
    branch: string;
}

export function isTargetBranch(target: Target): target is TargetBranch {
    return !!target.branch
}