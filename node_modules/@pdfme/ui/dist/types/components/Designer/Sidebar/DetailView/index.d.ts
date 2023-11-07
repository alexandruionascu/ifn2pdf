import React from 'react';
import type { SchemaForUI } from '@pdfme/common';
import type { SidebarProps } from '../../../../types';
declare const DetailView: (props: Pick<SidebarProps, 'size' | 'schemas' | 'pageSize' | 'changeSchemas' | 'activeElements' | 'deselectSchema'> & {
    activeSchema: SchemaForUI;
}) => React.JSX.Element;
export default DetailView;
