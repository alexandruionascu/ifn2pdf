import IDBStorage from "idbstorage";
import {
  instanceToInstance,
  instanceToPlain,
  plainToClass,
  plainToInstance,
  serialize,
} from "class-transformer";
import { databox } from "../models/DataBox";

interface IPropertySchema {
  component?: React.FC<any>;
  key: string;
  importKey?: string;
  exportKey?: string;
  propertyIndex: number;
  args?: string[];
}

interface IClassSchema {
  [propertyName: string]: IPropertySchema;
}
interface ISchema {
  [className: string]: IClassSchema;
}

interface DataBoxCollectionSchema {
  [propertyName: string]: string;
}

interface DataBoxSchema {
  [databoxName: string]: DataBoxCollectionSchema;
}
let schema: ISchema = {};
let databoxSchema: DataBoxSchema = {};

interface ComponentProps {
  value: string;
  onChange: (event: any) => void;
}

export function Component(component: React.FC<any>) {
  return function (target: any, key: string) {
    const className = target.constructor.name;
    if (!schema[className]) {
      schema[className] = {};
    }
    if (!schema[className][key]) {
      schema[className][key] = {
        component: component,
        key: `__${className}_${key}__`,
        propertyIndex: Object.keys(schema[className]).length,
      };
    } else {
      schema[className][key]["component"] = component;
    }
  };
}

export function Key(data: string) {
  return function (target: any, key: string) {
    const className = target.constructor.name;
    if (!schema[className]) {
      schema[className] = {};
    }
    if (!schema[className][key]) {
      schema[className][key] = {
        key: data,
        propertyIndex: Object.keys(schema[className]).length,
      };
    } else {
      schema[className][key].key = data;
    }
  };
}

export function ImportKey(data: string) {
  return function (target: any, key: string) {
    const className = target.constructor.name;
    if (!schema[className]) {
      schema[className] = {};
    }
    if (!schema[className][key]) {
      schema[className][key] = {
        importKey: data,
        key: `__${className}_${key}__`,
        propertyIndex: Object.keys(schema[className]).length,
      };
    } else {
      schema[className][key].importKey = data;
    }
  };
}

export function ExportKey(data: string) {
  return function (target: any, key: string) {
    const className = target.constructor.name;
    if (!schema[className]) {
      schema[className] = {};
    }
    if (!schema[className][key]) {
      schema[className][key] = {
        exportKey: data,
        key: `__${className}_${key}__`,
        propertyIndex: Object.keys(schema[className]).length,
      };
    } else {
      schema[className][key].exportKey = data;
    }
  };
}

export function ImportExportKey(data: string) {
  return function (target: any, key: string) {
    const className = target.constructor.name;
    if (!schema[className]) {
      schema[className] = {};
    }
    if (!schema[className][key]) {
      schema[className][key] = {
        importKey: data,
        exportKey: data,
        key: `__${className}_${key}__`,
        propertyIndex: Object.keys(schema[className]).length,
      };
    } else {
      schema[className][key].importKey = data;
      schema[className][key].exportKey = data;
    }
  };
}

interface ISpreadsheetField {
  label: string;
  key: string;
  fieldType: {
    type: string;
  };
}

class BoxModel {
  private __className__: string;
  private __schema__: IClassSchema;

  constructor() {
    this.__className__ = this.constructor.name;

    this.__schema__ = schema[this.__className__];
  }

  public static getKeys(): string[] {
    const propKeys = Object.values(schema[this.name]).map((x) => x.key);
    return propKeys;
  }

  public static get spreadsheetFields(): ISpreadsheetField[] {
    const className = this.name;
    let propKeys = Object.keys(schema[className]);
    let props: IPropertySchema[] = [];
    for (let key of propKeys) {
      props.push(schema[className][key]);
    }

    props = props.filter((x) => x.importKey);
    return props.map((p) => ({
      label: p.importKey,
      key: p.importKey,
      fieldType: {
        type: "input",
      },
    }));
  }
}
export { BoxModel };

export function DataBoxTable(classRef: any) {
  return (target: any, key: string) => {
    const className = target.constructor.name;
    if (!databoxSchema[className]) {
      databoxSchema[className] = {};
    }
    databoxSchema[className][key] = classRef;
    console.log(databoxSchema);
  };
}

class DataBox {
  private storage: IDBStorage;
  public constructor() {
    this.storage = new IDBStorage();
    for (const propName in databoxSchema[this.constructor.name]) {
      this[propName] = new DataBoxCollection(
        propName,
        this.constructor.name,
        this.storage
      );
    }
  }
}

const myConstObject = {
  "TEST OF": 123,
  "TEST": "123",
 } as const;

type MyConstObjectKeys = keyof typeof myConstObject[number];

class DataBoxCollection<T> implements Iterable<T> {
  public data: T[] = [];
  private className: string;
  private databoxClassName: string;
  private storage: IDBStorage;

  public constructor(
    className: string,
    databoxClassName: string,
    storage: Storage
  ) {
    this.className = className;
    this.databoxClassName = databoxClassName;
    this.storage = storage;
  }

  [Symbol.iterator](): Iterator<T> {
    let index = 0;

    return {
      next: (): IteratorResult<T> => {
        if (index < this.data.length) {
          return {
            value: this.data[index++],
            done: false,
          };
        } else {
          return { value: undefined as any, done: true };
        }
      },
    };
  }

  public get length() {
    return this.data.length;
  }

  load(): Promise<any[]> {
    //const constr: any = databoxSchema[this.databoxClassName][this.className];
    return this.storage.getItem(this.className).then((data) => {
      const jsonArr = JSON.parse(data);
      this.data = jsonArr;
      return jsonArr;
    });
  }

  push(item: T): void {
    this.data.push(item);
  }

  importFromJSONList(items: Partial<T>[], callback: (data: T[]) => void) {
    const constr: any = databoxSchema[this.databoxClassName][this.className];
    const insts = items.map((x) => plainToInstance(constr, x));
    this.data = insts as T[];
    return this.commit(callback);
  }

  add(...items: T[]): void {
    this.data.push(...items);
  }

  clear(): void {
    this.data = [];
  }

  commit(callback: (data: T[]) => void): void {
    this.storage
      .setItem(this.className, JSON.stringify(this.data))
      .then((value) => {
        callback(value);
      });
  }
}

export { DataBoxCollection, DataBox };

const ArgKey = (key: string) => {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const className = target.constructor.name;
    if (!schema[className]) {
      schema[className] = {};
    }
    if (!schema[className][propertyKey]) {
      schema[className][propertyKey] = {
        key: `__${className}_${propertyKey}__`,
        propertyIndex: Object.keys(schema[className]).length,
      };
    }

    let args = schema[className][propertyKey.toString()].args;
    if (!args) {
      args = [];
    }
    args.push(key);
    schema[className][propertyKey.toString()].args = args;
  };
};

export { ArgKey };
