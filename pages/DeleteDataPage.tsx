import * as React from "react";
import { Card, Group, Text, Modal, Badge, Button, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IDBStorage from "idbstorage"
import { notifications } from "@mantine/notifications";
import { databox } from "../models/DataBox";

export const DeleteDataPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
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
          <Text fw={500}>Stergerea datelor din browser</Text>
          <Badge color="pink" variant="light">
            Atentie
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Aceasta optiune este doar pentru administrare. Inainte de stergere,
          este nevoie de un backup al datelor existente.
        </Text>

        <Button
          onClick={open}
          variant="light"
          color="red"
          fullWidth
          mt="md"
          radius="md"
        >
          Sterge datele din browser
        </Button>
      </Card>

      <Modal overlayProps={{
          backgroundOpacity: 0.85,
          blur: 3,
        }} opened={opened} onClose={close} title="Stergere date">
        <Text>Confirm stergerea datelor din browser.</Text>
        <Button
          onClick={() => {
            const storage = new IDBStorage();
            databox.contracts.data = [];
            storage.clear().then(() => {
                notifications.show({
                    title: 'Stergerea datelor',
                    message: 'Stergerea datelor a fost efectuata cu succes.',
                  })
                  close();
            }).catch((err) => {
                console.log(err);
            });
          }}
          variant="light"
          color="red"
          fullWidth
          mt="md"
          radius="md"
        >
          Confirma stergerea
        </Button>
      </Modal>
    </div>
  );
};
