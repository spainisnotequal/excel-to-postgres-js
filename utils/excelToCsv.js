const XLSX = require("xlsx");

module.exports = {
  convertExcelToCsv: (inputFileName, outputFileName) => {
    const readOptions = { cellDates: true, cellNF: true, cellText: true };
    const workBook = XLSX.readFile(inputFileName, readOptions);
    XLSX.writeFile(workBook, outputFileName, { bookType: "csv" });
  },
};
