type Database = {
  host: string | undefined,
  port: string | undefined,
  user: string | undefined,
  password: string | undefined,
  database: string | undefined
}

declare global {

interface HostBase {
  [key: string]: Database
}

}

export {}