import * as React from "react";
import {
  Container,
  Grid,
  Text,
  Paper,
  SimpleGrid,
  rem,
  UnstyledButton,
  Group,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconChevronDown,
  IconChevronUp,
  IconFileInvoice,
  IconTransferOut,
  IconCoins,
  IconAlertCircle,
} from "@tabler/icons-react";
import classes from "./HomePage.module.css";
import dayjs from "dayjs";
import { StatsGroup } from "../components/StatsGroup";
import { StatsSegments } from "../components/StatsSegments";
import IDBStorage from "idbstorage";

const PRIMARY_COL_HEIGHT = rem(500);

const storage = new IDBStorage();

interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  expiringContracts: number;
  expiredContracts: number;
  todayContracts: number;
  totalValue: number;
  averageValue: number;
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

const calculateStats = (contracts: any[], selectedDate: Date): ContractStats => {
  const dateStr = dayjs(selectedDate).format("DD.MM.YYYY");
  
  let stats: ContractStats = {
    totalContracts: contracts.length,
    activeContracts: 0,
    expiringContracts: 0,
    expiredContracts: 0,
    todayContracts: 0,
    totalValue: 0,
    averageValue: 0,
  };

  contracts.forEach((contract) => {
    const status = getContractStatus(contract);
    
    // Count by status
    if (status === "Activ") stats.activeContracts++;
    if (status === "Scade curând") stats.expiringContracts++;
    if (status === "Scadent") stats.expiredContracts++;
    
    // Count contracts created on selected date
    // Contract format: "04.11.2022 - 2410"
    const contractNoData = contract["NR. CONTRACT / DATA"];
    if (contractNoData) {
      const parts = contractNoData.split("-");
      if (parts.length >= 2) {
        const contractDate = parts[0]?.trim(); // "04.11.2022"
        if (contractDate === dateStr) {
          stats.todayContracts++;
        }
      }
    }
    
    // Calculate total value
    const value = parseFloat(contract["VALOARE IMPRUMUT - RON"]) || 0;
    if (status === "Activ" || status === "Scade curând") {
      stats.totalValue += value;
    }
  });

  stats.averageValue = stats.totalContracts > 0 
    ? stats.totalValue / (stats.activeContracts + stats.expiringContracts) 
    : 0;

  return stats;
};

export function StatsControls({ date, setDate, stats }: { 
  date: Date; 
  setDate: (date: Date) => void;
  stats: ContractStats;
}) {
  const data = [
    { 
      icon: IconFileInvoice, 
      label: "Contracte active", 
      value: stats.activeContracts,
      color: "green"
    },
    { 
      icon: IconCalendarTime, 
      label: "Scad curând (7 zile)", 
      value: stats.expiringContracts,
      color: "orange"
    },
    { 
      icon: IconAlertCircle, 
      label: "Scadente", 
      value: stats.expiredContracts,
      color: "red"
    },
    { 
      icon: IconCoins, 
      label: "Valoare totală", 
      value: `${stats.totalValue.toFixed(0)} RON`,
      color: "blue"
    },
  ];

  const statCards = data.map((stat) => (
    <Paper
      className={classes.stat}
      radius="md"
      shadow="md"
      p="xs"
      key={stat.label}
    >
      <stat.icon
        style={{ width: rem(32), height: rem(32) }}
        className={classes.icon}
        stroke={1.5}
        color={stat.color}
      />
      <div>
        <Text className={classes.label}>{stat.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>{stat.value}</span>
        </Text>
      </div>
    </Paper>
  ));

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <UnstyledButton
          className={classes.control}
          onClick={() => setDate(dayjs(date).add(1, "day").toDate())}
        >
          <IconChevronUp
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>
        
        <div className={classes.date}>
          <Text className={classes.day}>{dayjs(date).format("DD")}</Text>
          <Text className={classes.month}>{dayjs(date).format("MMMM")}</Text>
        </div>
        
        <UnstyledButton
          className={classes.control}
          onClick={() => setDate(dayjs(date).subtract(1, "day").toDate())}
        >
          <IconChevronDown
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>
      </div>
      
      <Group style={{ flex: 1 }}>{statCards}</Group>
    </div>
  );
}

export const HomePage = () => {
  const [date, setDate] = React.useState(new Date());
  const [contracts, setContracts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<ContractStats>({
    totalContracts: 0,
    activeContracts: 0,
    expiringContracts: 0,
    expiredContracts: 0,
    todayContracts: 0,
    totalValue: 0,
    averageValue: 0,
  });

  // Load contracts from storage
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const contractsData = await storage.getItem("contracts");
        if (contractsData) {
          const parsedContracts = JSON.parse(contractsData);
          setContracts(parsedContracts);
        }
      } catch (error) {
        console.error("Error loading contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats when contracts or date changes
  React.useEffect(() => {
    if (contracts.length > 0) {
      const newStats = calculateStats(contracts, date);
      setStats(newStats);
    }
  }, [contracts, date]);

  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  if (loading) {
    return (
      <Container my="md">
        <Center style={{ height: "400px" }}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (contracts.length === 0) {
    return (
      <Container my="md">
        <Center style={{ height: "400px" }}>
          <div style={{ textAlign: "center" }}>
            <IconFileInvoice size={64} color="gray" style={{ marginBottom: "1rem" }} />
            <Text size="xl" fw={600} c="dimmed">
              Niciun contract găsit
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              Creează primul contract pentru a vedea statistici
            </Text>
          </div>
        </Center>
      </Container>
    );
  }

  return (
    <Container my="md" style={{ width: "100%", height: "100%" }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        style={{ width: "100%", height: "100%", marginTop: rem(70) }}
        spacing="md"
      >
        <StatsControls date={date} setDate={setDate} stats={stats} />
        
        <Grid gutter="md" style={{ width: "100%", height: "100%" }}>
          <Grid.Col span={12}>
            <StatsSegments />
          </Grid.Col>
          <Grid.Col span={12}>
            <StatsGroup />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
};