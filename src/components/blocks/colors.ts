import type { FinderColor} from "./Finder.vue";

export function getTheme(color: FinderColor) {
  return getColor(color);
}

type FinderColorExport = {
  "600": string;
  "500": string;
  "400": string;
  "300": string;
  "200": string;
  "100": string;
  "50": string;
};

export function getColor(color: FinderColor): FinderColorExport {
  switch (color) {
    case "blue":
      return {
        "600": "oklch(42.4% 0.199 265.638)",
        "500": "oklch(62.3% 0.214 259.815)",
        "400": "oklch(70.7% 0.165 254.624)",
        "300": "oklch(81.2% 0.099 251.5)",
        "200": "oklch(87.1% 0.054 253.2)",
        "100": "oklch(93.2% 0.032 255.585)",
        "50": "oklch(97% 0.014 254.604)",
      };
    case "green":
      return {
        "600": "oklch(49.2% 0.16 145)",
        "500": "oklch(62.3% 0.19 145)",
        "400": "oklch(70.7% 0.15 145)",
        "300": "oklch(81.2% 0.10 145)",
        "200": "oklch(87.1% 0.055 145)",
        "100": "oklch(93.2% 0.035 145)",
        "50": "oklch(97% 0.015 145)",
      };
    case "red":
      return {
        "600": "oklch(49.2% 0.19 29.2)",
        "500": "oklch(62.3% 0.22 29.2)",
        "400": "oklch(70.7% 0.17 29.2)",
        "300": "oklch(75% 0.15 29.2)",
        "200": "oklch(85% 0.08 29.2)",
        "100": "oklch(93.2% 0.04 29.2)",
        "50": "oklch(97% 0.02 29.2)",
      };
    case "orange":
      return {
        "600": "oklch(70% 0.16 60)",
        "500": "oklch(80% 0.18 60)",
        "400": "oklch(88% 0.14 60)",
        "300": "oklch(92% 0.10 60)",
        "200": "oklch(96% 0.06 60)",
        "100": "oklch(95% 0.04 60)",
        "50": "oklch(98% 0.02 60)",
      };
    case "gray":
      return {
        "600": "oklch(60% 0.01 270)",
        "500": "oklch(65% 0.01 270)",
        "400": "oklch(80% 0.01 270)",
        "300": "oklch(85% 0.009 270)",
        "200": "oklch(90% 0.008 270)",
        "100": "oklch(93% 0.008 270)",
        "50": "oklch(98% 0.005 270)",
      };
    default:
      return {
        "600": "oklch(60% 0.01 270)",
        "500": "oklch(65% 0.01 270)",
        "400": "oklch(80% 0.01 270)",
        "300": "oklch(85% 0.009 270)",
        "200": "oklch(90% 0.008 270)",
        "100": "oklch(93% 0.008 270)",
        "50": "oklch(98% 0.005 270)",
      };
  }
}
