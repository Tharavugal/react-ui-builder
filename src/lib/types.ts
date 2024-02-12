import type { JsonObject } from "type-fest";

export type Component = {
  name: string;
  props: {
    sx: JsonObject;
    binding?: null | string;
    [key: string]: unknown;
  };
  children?: Component[];
};

export type Widget = {
  name: string;
  group: string | null;
  component: Omit<Component, "name">;
  propTypes: JsonObject[];
};
