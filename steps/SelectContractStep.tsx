import * as React from "react";
import { DataTable } from "../components/DataTable";
import { Contract } from "../models/Contract";
import { TextInput, MultiSelect, Badge, Group, Stack, Text, Box, ActionIcon } from "@mantine/core";
import { formTemplate } from "../formTemplate";
import { useMemo, useCallback } from "react";
import { IconX, IconSortDescending } from "@tabler/icons-react";

interface Props {
  inputJson: Object[];
  onContractSelect: (output: Object) => void;
}

export const SelectContractStep: React.FC<Props> = ({
  inputJson,
  onContractSelect,
}) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState("");
  const [numeFilters, setNumeFilters] = React.useState<string[]>([]);
  const [statusFilters, setStatusFilters] = React.useState<string[]>([]);
  const [sortField, setSortField] = React.useState<string>("NR. CONTRACT / DATA");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  
  // Parse contract number from "2410 - 04.11.2022" format
  const getContractNumber = (contractString: string): number => {
    if (!contractString) return 0;
    const parts = contractString.split("-");
    if (parts.length < 2) return 0;
    const match = parts[0]?.trim().match(/^(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };
  
  // Parse contract date from "2410 - 04.11.2022" format
  const getContractDate = (contractString: string): Date => {
    if (!contractString) return new Date(0);
    const parts = contractString.split("-");
    if (parts.length < 2) return new Date(0);
    const dateStr = parts[1]?.trim(); // "04.11.2022"
    if (!dateStr) return new Date(0);
    
    const dateParts = dateStr.split(".");
    if (dateParts.length !== 3) return new Date(0);
    
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date(0);
    
    return new Date(year, month - 1, day);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Get sortable value for a field
  const getSortValue = (item: any, field: string): any => {
    if (field === "NR. CONTRACT / DATA") {
      // This is now handled separately in sortedData
      return 0;
    }
    if (field === "DATA" || field === "DATA SCADENTA") {
      const dateValue = item[field];
      if (!dateValue) return 0;
      return new Date(dateValue).getTime();
    }
    if (field === "VALOARE IMPRUMUT - RON" || field === "SUMA DE RESTITUIT") {
      return parseFloat(item[field]) || 0;
    }
    return String(item[field] || "").toLowerCase();
  };

  // Memoize the sorted data
  const sortedData = useMemo(() => {
    const sorted = [...inputJson].sort((a: any, b: any) => {
      if (sortField === "NR. CONTRACT / DATA") {
        // Special handling for contract number/date field
        const dateA = getContractDate(a[sortField]);
        const dateB = getContractDate(b[sortField]);
        
        // First compare by date
        const dateDiff = sortDirection === "desc" 
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
        
        if (dateDiff !== 0) return dateDiff;
        
        // If dates are equal, compare by contract number
        const nrA = getContractNumber(a[sortField]);
        const nrB = getContractNumber(b[sortField]);
        
        return sortDirection === "desc" ? nrB - nrA : nrA - nrB;
      }
      
      // For other fields, use standard sorting
      const valueA = getSortValue(a, sortField);
      const valueB = getSortValue(b, sortField);
      
      let primaryComparison = 0;
      
      if (typeof valueA === "number" && typeof valueB === "number") {
        primaryComparison = sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        primaryComparison = sortDirection === "asc"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
      
      // If primary sort values are equal, use secondary sort (contract date+number descending)
      if (primaryComparison === 0 && sortField !== "NR. CONTRACT / DATA") {
        const dateA = getContractDate(a["NR. CONTRACT / DATA"]);
        const dateB = getContractDate(b["NR. CONTRACT / DATA"]);
        const dateDiff = dateB.getTime() - dateA.getTime();
        
        if (dateDiff !== 0) return dateDiff;
        
        const nrA = getContractNumber(a["NR. CONTRACT / DATA"]);
        const nrB = getContractNumber(b["NR. CONTRACT / DATA"]);
        return nrB - nrA;
      }
      
      return primaryComparison;
    });
    
    return sorted;
  }, [inputJson, sortField, sortDirection]);

  // Determine contract status based on dates
  const getContractStatus = (contract: any): string => {
    const dataScadenta = contract["DATA SCADENTA"];
    if (!dataScadenta) return "Necunoscut";
    
    const scadenta = new Date(dataScadenta);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scadenta.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((scadenta.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Scadent";
    if (diffDays <= 7) return "Scade curând";
    return "Activ";
  };

  // Extract unique names and statuses for filters
  const filterOptions = useMemo(() => {
    const names = new Set<string>();
    const statuses = new Set<string>();
    
    sortedData.forEach((item: any) => {
      if (item.NUME) names.add(String(item.NUME).trim());
      statuses.add(getContractStatus(item));
    });
    
    return {
      names: Array.from(names).sort(),
      statuses: Array.from(statuses).sort(),
    };
  }, [sortedData]);

  // Memoize filtered data
  const filteredData = useMemo(() => {
    const results: any[] = [];
    const searchLower = searchInput.toLowerCase().trim();
    
    for (const item of sortedData) {
      // Apply name filter (multi-select)
      if (numeFilters.length > 0) {
        const itemNume = String(item.NUME || "").trim();
        if (!numeFilters.includes(itemNume)) continue;
      }
      
      // Apply status filter (multi-select)
      if (statusFilters.length > 0) {
        const itemStatus = getContractStatus(item);
        if (!statusFilters.includes(itemStatus)) continue;
      }
      
      // Apply search filter
      if (searchLower) {
        const searchableText = [
          item.NUME,
          item.CNP,
          item["ACT IDENTITATE"],
          item["NR. CONTRACT / DATA"],
          item.ADRESA,
          item.OBIECTE,
          item.TITLU,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        
        if (!searchableText.includes(searchLower)) continue;
      }
      
      results.push(item);
      
      // Limit to 200 results for performance
      if (results.length >= 200) break;
    }
    
    return results;
  }, [sortedData, searchInput, numeFilters, statusFilters]);

  // computed data
  const [currentFn, setCurrentFn] = React.useState({});
  
  const updateFnData = useCallback((key: string, newValue: string) => {
    if (!key) return;
    
    const current = filteredData[selectedIdx];
    if (!current) return;
    
    let newFnData = { ...currentFn, [key]: newValue };
    const templateField = formTemplate.find((x) => x.key === key);
    
    if (templateField?.triggers) {
      for (const trigger of templateField.triggers) {
        const triggerField = formTemplate.find((x) => x.key === trigger);
        if (triggerField?.fn) {
          try {
            const result = triggerField.fn(current, newFnData);
            newFnData = { ...newFnData, [triggerField.key]: result };
          } catch (err) {
            console.error(`Error computing ${triggerField.key}:`, err);
          }
        }
      }
    }
    
    setCurrentFn(newFnData);
  }, [currentFn, filteredData, selectedIdx]);

  // Reset selection when filters change
  React.useEffect(() => {
    setSelectedIdx(0);
    setCurrentFn({});
  }, [searchInput, numeFilters, statusFilters, sortField, sortDirection]);

  // Notify parent of selection changes
  React.useEffect(() => {
    if (filteredData.length > 0 && filteredData[selectedIdx]) {
      onContractSelect(filteredData[selectedIdx]);
    }
  }, [selectedIdx, filteredData, onContractSelect]);

  const clearFilters = () => {
    setSearchInput("");
    setNumeFilters([]);
    setStatusFilters([]);
  };

  const hasActiveFilters = searchInput !== "" || numeFilters.length > 0 || statusFilters.length > 0;
  const hasNonDefaultSort = sortField !== "DATA" || sortDirection !== "desc";

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scadent": return "red";
      case "Scade curând": return "orange";
      case "Activ": return "green";
      default: return "gray";
    }
  };

  // Get display label for sort field
  const getSortLabel = (field: string) => {
    if (field === "DATA") return "Dată";
    if (field === "NR. CONTRACT / DATA") return "Nr. Contract";
    if (field === "NUME") return "Nume";
    if (field === "VALOARE IMPRUMUT - RON") return "Valoare";
    if (field === "DATA SCADENTA") return "Scadență";
    return field;
  };

  return (
    <Stack gap="md" style={{ padding: "1rem" }}>
      {/* Header with result count */}
      <Group justify="space-between" align="center">
        <div>
          <Text size="xl" fw={600}>
            Selectează Contract
          </Text>
          <Group gap="xs" mt={4}>
            <Text size="sm" c="dimmed">
              Sortare:
            </Text>
            <Badge
              size="sm"
              variant="light"
              color={hasNonDefaultSort ? "orange" : "blue"}
              leftSection={<IconSortDescending size={14} />}
            >
              {getSortLabel(sortField)}
              {" "}
              {sortDirection === "desc" ? "↓" : "↑"}
            </Badge>
          </Group>
        </div>
        <Badge size="lg" variant="light" color="blue">
          {filteredData.length} {filteredData.length !== sortedData.length && `/ ${sortedData.length}`} contracte
        </Badge>
      </Group>

      {/* Filters */}
      <Box
        style={{
          background: "#f8f9fa",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 200px 150px 36px",
          gap: "1rem",
          alignItems: "start"
        }}>
          <TextInput
            label="Căutare rapidă"
            placeholder="Nume, CNP, CI, Nr. Contract, Adresă, Obiect..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          
          <div>
            <MultiSelect
              label="Clienți"
              placeholder="Toți clienții"
              value={numeFilters}
              onChange={setNumeFilters}
              data={filterOptions.names}
              searchable
              clearable
              hidePickedOptions
              maxDropdownHeight={300}
              styles={{
                input: {
                  minHeight: "36px",
                  maxHeight: "36px",
                  overflow: "hidden",
                },
                pill: {
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }
              }}
            />
            {numeFilters.length > 0 && (
              <Text size="xs" c="dimmed" mt={4}>
                {numeFilters.length} {numeFilters.length === 1 ? "client selectat" : "clienți selectați"}
              </Text>
            )}
          </div>

          <div>
            <MultiSelect
              label="Status"
              placeholder="Toate statusurile"
              value={statusFilters}
              onChange={setStatusFilters}
              data={filterOptions.statuses}
              clearable
              hidePickedOptions
              maxDropdownHeight={300}
              styles={{
                input: {
                  minHeight: "36px",
                  maxHeight: "36px",
                  overflow: "hidden",
                }
              }}
            />
            {statusFilters.length > 0 && (
              <Text size="xs" c="dimmed" mt={4}>
                {statusFilters.length} {statusFilters.length === 1 ? "status" : "statusuri"}
              </Text>
            )}
          </div>
          
          {hasActiveFilters ? (
            <ActionIcon
              onClick={clearFilters}
              variant="light"
              color="gray"
              size="lg"
              title="Resetează filtrele"
              style={{ marginTop: "24px" }}
            >
              <IconX size={18} />
            </ActionIcon>
          ) : (
            <div style={{ width: "36px" }} />
          )}
        </div>
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <Group gap="xs" mt="md">
            <Text size="xs" c="dimmed">Filtre active:</Text>
            {searchInput && (
              <Badge size="sm" variant="dot" color="blue">
                Căutare: "{searchInput}"
              </Badge>
            )}
            {numeFilters.map(nume => (
              <Badge
                key={nume}
                size="sm"
                variant="dot"
                color="cyan"
                rightSection={
                  <IconX
                    size={12}
                    style={{ cursor: "pointer" }}
                    onClick={() => setNumeFilters(numeFilters.filter(n => n !== nume))}
                  />
                }
              >
                {nume}
              </Badge>
            ))}
            {statusFilters.map(status => (
              <Badge
                key={status}
                size="sm"
                variant="dot"
                color={getStatusColor(status)}
                rightSection={
                  <IconX
                    size={12}
                    style={{ cursor: "pointer" }}
                    onClick={() => setStatusFilters(statusFilters.filter(s => s !== status))}
                  />
                }
              >
                {status}
              </Badge>
            ))}
          </Group>
        )}
        
        {/* Quick status summary */}
        {!hasActiveFilters && (
          <Group gap="xs" mt="md">
            <Text size="xs" c="dimmed">Filtrare rapidă:</Text>
            {filterOptions.statuses.map(status => {
              const count = sortedData.filter(item => getContractStatus(item) === status).length;
              return (
                <Badge
                  key={status}
                  size="sm"
                  variant="light"
                  color={getStatusColor(status)}
                  style={{ cursor: "pointer" }}
                  onClick={() => setStatusFilters([status])}
                >
                  {status}: {count}
                </Badge>
              );
            })}
          </Group>
        )}
      </Box>

      {/* Data Table */}
      {filteredData.length > 0 ? (
        <DataTable
          selectedIdx={selectedIdx}
          onSelectChange={(newIdx) => setSelectedIdx(newIdx)}
          fields={Contract.spreadsheetFields}
          data={filteredData}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        <Box
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <Text size="xl" fw={600} c="dimmed">
            📋 Niciun contract găsit
          </Text>
          <Text size="sm" c="dimmed" mt="sm">
            Încearcă să modifici criteriile de căutare sau filtrele
          </Text>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: "1rem",
                padding: "10px 24px",
                cursor: "pointer",
                background: "#228be6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Resetează toate filtrele
            </button>
          )}
        </Box>
      )}
      
      {filteredData.length >= 200 && (
        <Text size="sm" c="dimmed" ta="center">
          ℹ️ Se afișează primele 200 de rezultate. Folosește filtrele pentru a restrânge căutarea.
        </Text>
      )}
    </Stack>
  );
};