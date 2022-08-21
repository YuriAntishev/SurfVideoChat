export function UpperCaseArraySplit(input) {
    const result = input.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
    return result.split(",").join(' ');
  }