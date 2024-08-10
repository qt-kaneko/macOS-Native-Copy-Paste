export type Stringifyable = string | number | boolean | null
                          | Stringifyable[]
                          | {[K: string]: Stringifyable};