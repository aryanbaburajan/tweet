import open from "open";

const routes = [
  "/aryanbaburajan/status/1934622277779460230",
  "/aryanbaburajan/status/1929977032873762850",
  "/aryanbaburajan/status/1929977036275364075",
  "/aryanbaburajan/status/1929977150289129789",
  "/aryanbaburajan/status/1929977301913219169",
  "/aryanbaburajan/status/1933965572020347247",
  "/aryanbaburajan/status/1933803518223397028",
  "/aryanbaburajan/status/1934583368253149209",
];

const base = "http://localhost:3000";

for (const route of routes) {
  await open(base + route);
}
