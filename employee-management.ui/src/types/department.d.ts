export interface Department{
    deptId: number;
    deptName: string;
    designations: Designation[];
}

export interface Designation {
    designationId: number;
    designationName: string;
}
