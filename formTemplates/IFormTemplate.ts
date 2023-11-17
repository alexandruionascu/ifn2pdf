export interface IFieldTemplate<T> {
    key: string,
    pdfKeys?: string[],
    placeholder?: string,
    fn?: (formData: T, actions: any) => any,
    triggers?: string[],
    readonly?: boolean
    type?: string;
}

export type IFormTemplate<T> = IFieldTemplate<T>[];
