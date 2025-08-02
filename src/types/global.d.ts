export {};

declare global {
  interface Window {
    __USER__: {
      id: number;
      name: string;
      email: string;
      roles: Array<{name: string}>;
    };
    __CLIENT__: any;
    __FLASH__: {
      success?: string;
      error?: string;
    };
  }
}