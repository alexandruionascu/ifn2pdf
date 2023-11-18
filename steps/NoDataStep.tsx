import * as React from "react";
import { Badge, Button, Card, Group, rem, Text } from "@mantine/core";

export const NoDataStep:React.FC<any> = ({}) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ marginTop: rem(100) }}
      maw={478}
    >
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Incarca datele in format Excel pentru a continua.</Text>
        <Badge color="blue" variant="light">
          Info
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
       In aceasta sesiune nu sunt date existente. Incarca fisierul cu clientii si contracte pentru a folosi aceasta pagina.
      </Text>
    </Card>
  </div>
);
