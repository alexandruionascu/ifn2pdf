import * as React from "react";
import { Paper, Group, Text, ThemeIcon, SimpleGrid, rem } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconAlertCircle,
  IconCalendarTime,
  IconCheck,
} from "@tabler/icons-react";
import IDBStorage from "idbstorage";

const storage = new IDBStorage();

interface StatusData {
  label: string;
  count: number;
  part: number;
  color: string;
  icon: any;
}

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

export function StatsSegments() {
  const [data, setData] = React.useState<StatusData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const contractsData = await storage.getItem("contracts");
        if (contractsData) {
          const contracts = JSON.parse(contractsData);
          
          // Count contracts by status
          const statusCounts = {
            "Activ": 0,
            "Scade curând": 0,
            "Scadent": 0,
          };

          contracts.forEach((contract: any) => {
            const status = getContractStatus(contract);
            if (statusCounts[status] !== undefined) {
              statusCounts[status]++;
            }
          });

          const total = contracts.length;

          const statusData: StatusData[] = [
            {
              label: "Active",
              count: statusCounts["Activ"],
              part: (statusCounts["Activ"] / total) * 100,
              color: "#47d6ab",
              icon: IconCheck,
            },
            {
              label: "Scad curând",
              count: statusCounts["Scade curând"],
              part: (statusCounts["Scade curând"] / total) * 100,
              color: "#ffa94d",
              icon: IconCalendarTime,
            },
            {
              label: "Scadente",
              count: statusCounts["Scadent"],
              part: (statusCounts["Scadent"] / total) * 100,
              color: "#ff6b6b",
              icon: IconAlertCircle,
            },
          ];

          setData(statusData);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const segments = data.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part.toFixed(0)}%` : undefined,
  }));

  const descriptions = data.map((stat) => (
    <div key={stat.label} style={{ borderBottomColor: stat.color }}>
      <Text ta="center" fz="lg" fw={700}>
        {stat.count}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Paper withBorder p="md" radius="md" style={{ height: "100%" }}>
      <Group justify="space-between">
        <Group align="flex-end" gap="xs">
          <Text fz="xl" fw={700}>
            Distribuție contracte
          </Text>
        </Group>
      </Group>

      <Text c="dimmed" fz="sm" mt="md">
        Status contracte după scadență
      </Text>

      <div
        style={{
          display: "flex",
          marginTop: rem(16),
          marginBottom: rem(16),
          height: rem(30),
          borderRadius: rem(4),
          overflow: "hidden",
        }}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              width: `${segment.value}%`,
              backgroundColor: segment.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {segment.label}
          </div>
        ))}
      </div>

      <SimpleGrid cols={3} mt="xl">
        {descriptions}
      </SimpleGrid>
    </Paper>
  );
}