import React from "react";
export declare const SELECT_DROPDOWN_ID = "react-select-dropdown-wrapper";
interface PortalProps {
    controlElement: HTMLDivElement | null;
    children: React.ReactNode;
}
export declare const customComponents: {
    MenuPortal: (props: PortalProps) => React.ReactPortal | null;
};
export {};
