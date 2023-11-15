import { TextInput } from "@mantine/core";
import { BoxModel, Component, ImportKey, Key } from "../boxmodel/BoxModel";

class Contract extends BoxModel {
    @Key("NR CONTRACT")
    @Component(TextInput)
    contractNo: number;

    @Key("DIN")
    @Component(TextInput)
    contractFromDate = () => {
        return this.contractNoAndDate.split('-')[0];
    }

    @Key("NUME")
    @ImportKey("NUME")
    @Component(TextInput)
    name: string;

    @Key("CNP")
    @ImportKey("CNP")
    @Component(TextInput)
    personalID: string;

    @Key("ACT IDENTITATE")
    @ImportKey("ACT IDENTITATE")
    fullIDCardSeries: string;

    @Key("ADRESA")
    @ImportKey("ADRESA")
    fullAddress: string;

    @Key("NR CONTRACT / DATA")
    @ImportKey("NR CONTRACT / DATA")
    contractNoAndDate: string;

    @Key("DATA")
    @ImportKey("DATA")
    date: Date;

    @Key("OBIECTE")
    @ImportKey("OBIECTE")
    objects: string;

    @Key("TITLU")
    @ImportKey("TITLU")
    title: string;

    @Key("GREUTATE / GRAM")
    @ImportKey("GREUTATE / GRAM")
    weightPerG: string;

    @Key("JUDET")
    @ImportKey("JUDET")
    @Component(TextInput)
    county: string;

    @Key("LOCALITATEA")
    @Component(TextInput)
    city: string;

    @Key("STRADA")
    @Component(TextInput)
    streetNo: string;

    @Key("BLOC")
    @Component(TextInput)
    block: string;

    @Key("SCARA")
    @Component(TextInput)
    staircase: string;

    @Key("APARTAMENT")
    @Component(TextInput)
    apartment: string;

    @Key("LEGITIMAT CU")
    @Component(TextInput)
    identifiedWith: string;

    @Key("SERIE CI")
    @Component(TextInput)
    personalIDSeries: string;

    @Key("NR CI")
    @Component(TextInput)
    personalIDNo: string;

    @Key("ELIBERAT DE")
    @ImportKey("ELIBERAT DE")
    @Component(TextInput)
    issuedBy: string;

    @Key("VALOARE IMPRUMUT")
    @ImportKey("VALOARE IMPRUMUT - RON")
    @Component(TextInput)
    loanValue: string;

    @Key("VALOARE IMPRUMUT IN SCRIS")
    @Component(TextInput)
    loanValueWritten: string;

    @Key("DATA SCADENTA")
    @ImportKey("DATA SCADENTA")
    @Component(TextInput)
    dueDate: Date;

    @Key("DATA IESIRII")
    @ImportKey("DATA IESIRII")
    exitDate: Date;

    @Key("VALOARE INITIALA")
    @ImportKey("VALOARE INITIALA")
    initialAmount: number;

    @Key("NR ZILE")
    @ImportKey("NR ZILE")
    @Component(TextInput)
    days: number;

    @Key("COMISION")
    @ImportKey("COMISION - RON")
    @Component(TextInput)
    commission: number;

    @Key("SUMA DE RESTITUIT")
    @ImportKey("SUMA DE RESTITUIT")
    @Component(TextInput)
    paidAmount: number;

    @Key("GARANTII")
    @Component(TextInput)
    mortgage: string;

    @Key("DISPOZITIE DE PLATA NUMARUL")
    @Component(TextInput)
    paymentNumber: string;

    constructor() {
        super();
    }
}

export {Contract}