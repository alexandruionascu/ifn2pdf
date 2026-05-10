import * as React from "react";
import { Checkbox, Table, Box } from "@mantine/core";

export const DataTable = (props: {
  data: any[];
  fields: any[];
  selectedIdx: number;
  onSelectChange: (newIdx: number) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}) => {
  const rows = props.data.map((element, i) => (
    <Table.Tr
      key={i}
      onClick={() => props.onSelectChange(i)}
      style={{
        cursor: "pointer",
        backgroundColor: i === props.selectedIdx ? "#e7f5ff" : "transparent",
      }}
    >
      <Table.Td
        style={{
          position: "sticky",
          left: 0,
          backgroundColor: i === props.selectedIdx ? "#e7f5ff" : "#fff",
          zIndex: 1,
          borderRight: "2px solid #dee2e6",
        }}
      >
        <Checkbox
          onClick={(e) => {
            e.stopPropagation();
            props.onSelectChange(i);
          }}
          checked={i === props.selectedIdx}
          readOnly
        />
      </Table.Td>
      {props.fields.map((field, fieldIdx) => (
        <Table.Td key={fieldIdx} style={{ whiteSpace: "nowrap" }}>
          {element[field.key]}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  const getSortIcon = (fieldKey: string) => {
    if (props.sortField !== fieldKey) {
      return <span style={{ opacity: 0.3, marginLeft: "4px" }}>⇅</span>;
    }
    return props.sortDirection === "asc" ? (
      <span style={{ marginLeft: "4px" }}>↑</span>
    ) : (
      <span style={{ marginLeft: "4px" }}>↓</span>
    );
  };

  return (
    <Box
      style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
      }}
    >
      <Table striped highlightOnHover withTableBorder={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              style={{
                position: "sticky",
                left: 0,
                backgroundColor: "#f8f9fa",
                zIndex: 2,
                borderRight: "2px solid #dee2e6",
              }}
            >
              {/* Checkbox header */}
            </Table.Th>
            {props.fields.map((field, i) => (
              <Table.Th
                key={i}
                onClick={() => props.onSort && props.onSort(field.key)}
                style={{
                  cursor: props.onSort ? "pointer" : "default",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                {field.label}
                {props.onSort && getSortIcon(field.key)}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
};