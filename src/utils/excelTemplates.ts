import type ExcelJS from "exceljs";

const downloadWorkbook = async (workbook: ExcelJS.Workbook, fileName: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const styleHeaderRow = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6D28D9" }, // primary-700
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFD8CCFB" } },
    };
  });
};

/**
 * Key bulk upload template: S.No | Key No | Key Name
 */
export const downloadKeyTemplate = async () => {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Key Template");

  sheet.columns = [
    { header: "S.No", key: "sno", width: 10 },
    { header: "Key No", key: "keyNo", width: 22 },
    { header: "Key Name", key: "keyName", width: 32 },
  ];

  styleHeaderRow(sheet.getRow(1));

  // A couple of blank sample rows so the format is obvious.
  for (let i = 1; i <= 20; i++) {
    sheet.addRow({ sno: i, keyNo: "", keyName: "" });
  }

  await downloadWorkbook(workbook, "Key_Bulk_Upload_Template.xlsx");
};

// /**
//  * Pass bulk upload template: S.No | Pass No | Pass Type (dropdown: NRIC / Foreign IC)
//  * | Visitor Type (dropdown: Contractor / Visitor)
//  */
// export const downloadPassTemplate = async () => {
//   const { default: ExcelJS } = await import("exceljs");
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Pass Template");

//   sheet.columns = [
//     { header: "S.No", key: "sno", width: 10 },
//     { header: "Pass No", key: "passNo", width: 20 },
//     { header: "Pass Type", key: "passType", width: 22 },
//     { header: "Visitor Type", key: "visitorType", width: 22 },
//   ];

//   styleHeaderRow(sheet.getRow(1));

//   const totalRows = 20;
//   for (let i = 1; i <= totalRows; i++) {
//     const row = sheet.addRow({ sno: i, passNo: "", passType: "", visitorType: "" });

//     // Dropdown validation for Pass Type
//     row.getCell("passType").dataValidation = {
//       type: "list",
//       allowBlank: true,
//       formulae: ['"NRIC,Foreign IC"'],
//       showErrorMessage: true,
//       errorTitle: "Invalid Pass Type",
//       error: "Please select either NRIC or Foreign IC from the dropdown.",
//     };

//     // Dropdown validation for Visitor Type
//     row.getCell("visitorType").dataValidation = {
//       type: "list",
//       allowBlank: true,
//       formulae: ['"Contractor,Visitor"'],
//       showErrorMessage: true,
//       errorTitle: "Invalid Visitor Type",
//       error: "Please select either Contractor or Visitor from the dropdown.",
//     };
//   }

//   await downloadWorkbook(workbook, "Pass_Bulk_Upload_Template.xlsx");
// };


// Replace the existing downloadPassTemplate export in src/utils/excelTemplates.ts
// with this version. Visitor Type is no longer a column — it's picked once
// per upload via the dropdown in BulkUpload.tsx and applied to every row.

// export const downloadPassTemplate = async () => {
//   const { default: ExcelJS } = await import("exceljs");

//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Pass Template");

//   const headers = ["S.No", "Pass No", "Pass Name"];

//   sheet.columns = [
//     { header: headers[0], key: "s_no", width: 8 },
//     { header: headers[1], key: "pass_no", width: 22 },
//     { header: headers[2], key: "pass_name", width: 30 },
//   ];

//   const headerRow = sheet.getRow(1);
//   headerRow.font = { bold: true };
//   headerRow.eachCell((cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF6D28D9" },
//     };
//   });

//   // one example row so the format is obvious
//   sheet.addRow({ s_no: 1, pass_no: "PS-001", pass_name: "Visitor Pass" });

//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "pass_bulk_upload_template.xlsx";
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   URL.revokeObjectURL(url);
// };



export const downloadPassTemplate = async () => {
  const { default: ExcelJS } = await import("exceljs");

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Pass Template");

  sheet.columns = [
    { header: "S.No", key: "sno", width: 10 },
    { header: "Pass No", key: "passNo", width: 22 },
    { header: "Pass Name", key: "passName", width: 32 },
  ];

  styleHeaderRow(sheet.getRow(1));

  // Blank sample rows so the format is obvious.
  for (let i = 1; i <= 20; i++) {
    sheet.addRow({
      sno: i,
      passNo: "",
      passName: "",
    });
  }

  await downloadWorkbook(workbook, "Pass_Bulk_Upload_Template.xlsx");
};