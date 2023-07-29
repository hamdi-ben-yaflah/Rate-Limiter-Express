import { Rule } from "./interfaces/Rule";

const fs = require("fs");

let rulesCache;

function loadRules(path: string): Rule {
  const rules: { rules: Rule[] } = JSON.parse(fs.readFileSync("rules.json"));
  const rule = rules.rules.find((rule) => rule.path === path);
  if (!rule) throw new Error(`rule for this path ${path} is not founc`);

  return rule;
}

export { loadRules };
