import { Template, DesignerProps } from '@pdfme/common';
import { BaseUIClass } from './class';
declare class Designer extends BaseUIClass {
    private onSaveTemplateCallback?;
    private onChangeTemplateCallback?;
    constructor(props: DesignerProps);
    saveTemplate(): void;
    updateTemplate(template: Template): void;
    onSaveTemplate(cb: (template: Template) => void): void;
    onChangeTemplate(cb: (template: Template) => void): void;
    protected render(): void;
}
export default Designer;
