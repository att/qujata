import { colors } from "../BarChart/barChart.const";

export function getColorByName(name: string): string {
    const firstLetter: string = name.trim().substring(0, 1);
    if (isLetter(firstLetter)) {
      const numberFromStr: number = firstLetter.toLowerCase().charCodeAt(0) - 97;
      return colors[numberFromStr % colors.length];
    }
  
    return colors[0];
}

function isLetter(str: string) {
    return str.length === 1 && str.match(/[a-z]/i);
}
