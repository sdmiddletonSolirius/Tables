const examples = {
    "example1-ungrouped-basic": "ungrouped-table",
    "example2-ungrouped-complex": "ungrouped-table",
    "example5-ungrouped-basic-long": "ungrouped-table",
    "example3-grouped-row-basic": "grouped-row-table",
    "example4-grouped-row-complex": "grouped-row-table"
};

const example = new URLSearchParams(location.search).get("example") || "example1-ungrouped-basic";
const template = examples[example];
if (!template) {
    throw new Error(`Unknown table example: ${example}`);
}

const configScript = document.createElement("script");
configScript.src = `../examples/${example}/config.js`;
configScript.onload = async () => {
    config.graphicDataURL = `../examples/${example}/data.csv`;
    await import(`../${template}/script.js`);
};
configScript.onerror = () => {
    throw new Error(`Failed to load configuration for ${example}`);
};
document.body.append(configScript);
