import * as React from 'react';
import { Table } from "@mantine/core";


export const DataTable = (props: { data: any[]; fields: any[] }) => {
  const rows = props.data.map((element, i) => (
    <Table.Tr key={i}>
      {props.fields.map((field, i) => (
        <Table.Td key={i}>{element[field.key]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table className="table">
      <Table.Thead>
        <Table.Tr className="table-data">
          {props.fields.map((f, i) => (
            <Table.Th key={i}>{f.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
