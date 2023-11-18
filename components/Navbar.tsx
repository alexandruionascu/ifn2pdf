import * as React from "react";
import { useEffect, useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  IconHome2,
  IconCalendarStats,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconAlertTriangle,
  IconDeviceFloppy,
  IconClipboardList,
  IconFileDollar,
  IconFilePlus,
  IconTableImport,
  IconRun,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon
          style={{ width: rem(20), height: rem(20) }}
          stroke={1.5}
          color={active ? "black" : "white"}
        />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Acasa" },
  { icon: IconFilePlus, label: "Genereaza contract" },
  { icon: IconCalendarStats, label: "Prelungeste contract" },
  { icon: IconRun, label: "Iesire contract" },
  { icon: IconClipboardList, label: "Raport de gestiune" },
  { icon: IconFileDollar, label: "Nota de contabilitate" },
  { icon: IconTableImport, label: "Importa datele" },
  { icon: IconDeviceFloppy, label: "Salveaza datele" },
  { icon: IconAlertTriangle, label: "Sterge datele" },
  { icon: IconSettings, label: "Settings" },
];

export function Navbar(props: { onChange: (idx: number) => void }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    props.onChange(active);
  }, [active]);
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Text style={{ color: "white", fontWeight: 700 }}>IFN</Text>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
