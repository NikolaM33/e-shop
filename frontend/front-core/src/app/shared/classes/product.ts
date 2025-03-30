// Products
export interface Product {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    brand?: string;
    category: string;
    subCategory: string;
    code: string;
    publish: boolean;
    rent: boolean;
    price?: number;
    sale?: boolean;
    discount?: number;
    stock?: number;
    new?: boolean;
    quantity?: number;
    tag: any;
    variants?: Variants[];
    images?: Images[];
    specifications?: any[];
    colors?: any[];
    sizes?: any[];
    priceWithDiscount?: any;
    discountStartDate?: string;
    discountEndDate?: string;
    rentStartDate?: any;
    rentDuration?: number;
}

export interface Variants {
    variant_id?: number;
    id?: number;
    sku?: string;
    size?: string;
    color?: string;
    image_id?: number;
}

export interface Images {
    image_id?: number;
    id?: number;
    alt?: string;
    src?: string;
    variant_id?: any[];
}