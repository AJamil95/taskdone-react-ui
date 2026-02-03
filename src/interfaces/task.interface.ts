export interface Task{
    id: number;
    name: string;
    done: boolean;
}

export interface CreateTask{
    name: string;
}

export interface UpdateTask{
    name?: string;
    done?: boolean;
}

export interface ParamsDataTable {
    page: number;
    limit: number;
    orderby?: string;
    orderDir?: string;
    search?: string;
    done?: boolean | null;
}