class SimpleSchema<T> {
  constructor(private readonly transformer: (value: any) => T) {}

  parse(value: any): T {
    return this.transformer(value);
  }

  safeParse(value: any) {
    try {
      return { success: true as const, data: this.transformer(value) };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false as const,
        error: {
          message,
          flatten: () => ({ formErrors: [message], fieldErrors: {} as Record<string, string[]> }),
        },
      };
    }
  }

  optional(): SimpleSchema<T | undefined> {
    return new SimpleSchema<T | undefined>((value) => {
      if (value === undefined || value === null) return undefined;
      return this.transformer(value);
    });
  }

  min(_value?: number): this {
    return this;
  }

  max(_value?: number): this {
    return this;
  }

  int(): SimpleSchema<number> {
    return new SimpleSchema<number>((value) => {
      const numeric = Number(this.transformer(value));
      return Number.isNaN(numeric) ? 0 : Math.trunc(numeric);
    });
  }

  default(defaultValue: T): SimpleSchema<T> {
    return new SimpleSchema<T>((value) => {
      if (value === undefined || value === null) return defaultValue;
      return this.transformer(value);
    });
  }
}

function createStringSchema() {
  return new SimpleSchema<string>((value) => {
    if (value === undefined || value === null) return '';
    return String(value);
  });
}

function createNumberSchema() {
  return new SimpleSchema<number | undefined>((value) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? undefined : numeric;
  });
}

function enumSchema<T extends string>(values: readonly T[]) {
  return new SimpleSchema<T | undefined>((value) => {
    if (values.includes(value as T)) {
      return value as T;
    }
    return undefined;
  });
}

export const z = {
  object(shape: Record<string, SimpleSchema<any>>) {
    return new SimpleSchema((value: any) => {
      const result: Record<string, any> = {};
      for (const key of Object.keys(shape)) {
        const schema = shape[key];
        result[key] = schema ? schema.parse(value?.[key]) : value?.[key];
      }
      return result;
    });
  },
  string: createStringSchema,
  number: createNumberSchema,
  enum: enumSchema,
  nativeEnum: <T extends Record<string, string>>(enumObject: T) => enumSchema(Object.values(enumObject) as string[]),
  coerce: {
    number: () =>
      new SimpleSchema<number | undefined>((value) => {
        if (value === undefined || value === null || value === '') return undefined;
        const numeric = Number(value);
        return Number.isNaN(numeric) ? undefined : numeric;
      }),
  },
};

export type ZodTypeAny = SimpleSchema<any>;
