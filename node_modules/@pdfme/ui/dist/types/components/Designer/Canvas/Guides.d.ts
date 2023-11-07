import React, { Ref } from 'react';
import Guides from '@scena/react-guides';
import { Size } from '@pdfme/common';
declare const _Guides: ({ paperSize, horizontalRef, verticalRef, }: {
    paperSize: Size;
    horizontalRef: Ref<Guides> | undefined;
    verticalRef: Ref<Guides> | undefined;
}) => React.JSX.Element;
export default _Guides;
