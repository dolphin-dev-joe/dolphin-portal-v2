
export interface IPerfume {
    id: string;
    categoryId: string;
    name: string;
    nameEn: string;
    sortOrder: number;
    category?: ICategory;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICategory {
    id: string;
    name: string;
    nameEn: string;
}
