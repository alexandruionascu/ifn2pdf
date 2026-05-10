import * as React from "react";
import { Paper, Text, Group, rem } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconCoins,
  IconCash,
  IconReceipt,
} from "@tabler/icons-react";
import IDBStorage from "idbstorage";

const storage = new IDBStorage();

interface StatData {
  title: string;
  value: string;
  diff: number;
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

export function StatsGroup() {
  const [data, setData] = React.useState<StatData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const contractsData = await storage.getItem("contracts");
        if (contractsData) {
          const contracts = JSON.parse(contractsData);
          
          let totalLoaned = 0;
          let totalToReturn = 0;
          let totalCommission = 0;
          let activeCount = 0;

          contracts.forEach((contract: any) => {
            const status = getContractStatus(contract);
            
            // Only count active and expiring soon contracts
            if (status === "Activ" || status === "Scade curând") {
              const loaned = parseFloat(contract["VALOARE IMPRUMUT - RON"]) || 0;
              const toReturn = parseFloat(contract["SUMA DE RESTITUIT"]) || 0;
              const commission = parseFloat(contract["COMISION - RON"]) || 0;

              totalLoaned += loaned;
              totalToReturn += toReturn;
              totalCommission += commission;
              activeCount++;
            }
          });

          // Calculate average interest (profit margin)
          const averageProfit = activeCount > 0 
            ? ((totalToReturn - totalLoaned) / totalLoaned) * 100 
            : 0;

          const statsData: StatData[] = [
            {
              title: "Valoare împrumutată",
              value: `${totalLoaned.toFixed(0)} RON`,
              diff: averageProfit,
              icon: IconCoins,
            },
            {
              title: "Suma de încasat",
              value: `${totalToReturn.toFixed(0)} RON`,
              diff: ((totalToReturn - totalLoaned) / totalLoaned * 100) || 0,
              icon: IconCash,
            },
            {
              title: "Comisioane totale",
              value: `${totalCommission.toFixed(0)} RON`,
              diff: (totalCommission / totalLoaned * 100) || 0,
              icon: IconReceipt,
            },
          ];

          setData(statsData);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value}
            </Text>
          </div>
          <stat.icon
            style={{ width: rem(32), height: rem(32) }}
            stroke={1.5}
          />
        </Group>
        <Group mt="md" gap={0}>
          <Text fz="sm" c={stat.diff > 0 ? "teal" : "red"} fw={700}>
            {stat.diff > 0 ? "+" : ""}
            {stat.diff.toFixed(1)}%
          </Text>
          <DiffIcon
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
            color={stat.diff > 0 ? "teal" : "red"}
          />
          <Text fz="xs" c="dimmed" ml={4}>
            marjă profit
          </Text>
        </Group>
      </Paper>
    );
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
      {stats}
    </div>
  );
}