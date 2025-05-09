interface Product {
    id: number;
    name: string;
    img: string;
    price: number;
}
interface CartItem extends Product {
    count: number;
}
interface IziToast {
    success(options: {
        title: string;
        message: string;
        position: string;
        backgroundColor: string;
        messageColor: string;
        iconColor: string;
        timeout: number;
    }): void;
}
interface SweetAlertConfig {
    showCancelButton: boolean;
    cancelButtonColor: string;
    cancelButtonText: string;
    confirmButtonColor: string;
    confirmButtonText: string;
    title?: string;
    text?: string;
    icon?: string;
}
interface SweetAlertResult {
    isConfirmed: boolean;
}
interface SweetAlert {
    fire(config: SweetAlertConfig): Promise<SweetAlertResult>;
}
declare const iziToast: IziToast;
declare const Swal: SweetAlert;
declare const storeProducts: Product[];
declare let userCartItems: CartItem[];
declare let cartTotalPrice: number;
declare const productsContainer: HTMLElement | null;
declare const removeAllBtn: HTMLButtonElement | null;
declare const cartItemsContainer: HTMLElement | null;
declare let totalPrice: HTMLElement | null;
declare const SwalConfig: SweetAlertConfig;
declare const showStoreProducts: () => void;
declare const saveDataLocalStorage: () => void;
declare const formatNameToId: (name: string) => string;
declare const filterUserCart: (filterValue: string | number, propertyKey: string) => void;
declare const addToCart: (name: string, img: string, price: number) => void;
declare const calculateTotalPrice: () => void;
declare const removeProduct: (name: string) => void;
declare const removeAllProduct: () => void;
declare const createCartList: () => void;
declare const updateUserCart: (name: string, count: string | null) => void;
