export interface Department{
    deptId: number;
    deptName: string;
    designations: Designation[]; // ✅ object
}

export interface Designation {
    designationId: number;
    designationName: string;
}
