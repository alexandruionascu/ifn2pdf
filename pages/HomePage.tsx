import * as React from "react";
import {
  Container,
  Grid,
  Text,
  Paper,
  SimpleGrid,
  Skeleton,
  rem,
  UnstyledButton,
  Group,
} from "@mantine/core";
import {
  IconBike,
  IconCalendarTime,
  IconChevronDown,
  IconChevronUp,
  IconFileInvoice,
  IconOutbound,
  IconRun,
  IconSwimming,
  IconTransferOut,
} from "@tabler/icons-react";
import classes from "./HomePage.module.css";
import dayjs from "dayjs";
import { StatsGroup } from "../components/StatsGroup";
import { StatsSegments } from "../components/StatsSegments";

const PRIMARY_COL_HEIGHT = rem(500);

const data = [
  { icon: IconFileInvoice, label: "Contracte" },
  { icon: IconCalendarTime, label: "Prelungiri" },
  { icon: IconTransferOut, label: "Iesiri" },
];

export function StatsControls() {
  const [date, setDate] = React.useState(new Date());

  const stats = data.map((stat) => (
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
      />
      <div>
        <Text className={classes.label}>{stat.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>
            {Math.floor(Math.random() * 6 + 4)}
          </span>{" "}
          emise noi
        </Text>
      </div>
    </Paper>
  ));

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <UnstyledButton
          className={classes.control}
          onClick={() =>
            setDate((current) => dayjs(current).add(1, "day").toDate())
          }
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
          onClick={() =>
            setDate((current) => dayjs(current).subtract(1, "day").toDate())
          }
        >
          <IconChevronDown
            style={{ width: rem(16), height: rem(16) }}
            className={classes.controlIcon}
            stroke={1.5}
          />
        </UnstyledButton>
      </div>
      <Group style={{ flex: 1 }}>{stats}</Group>
    </div>
  );
}

export const HomePage = () => {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <Container my="md" style={{ width: "100%", height: "100%" }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        style={{ width: "100%", height: "100%", marginTop: rem(70) }}
        spacing="md"
      >
        <StatsControls />
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
