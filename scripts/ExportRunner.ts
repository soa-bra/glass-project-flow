import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ContractsAPI } from "../src/api/contracts/contracts";
import { InvoicesAPI } from "../src/api/invoices/invoices";
import fs from "fs";
import path from "path";

// مكان حفظ الملفات
const outputDir = path.resolve("./exports");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const generateReports = async () => {
  const contractsAPI = new ContractsAPI();
  const invoicesAPI = new InvoicesAPI();

  try {
    const [contracts, invoices] = await Promise.all([
      contractsAPI.getContracts(),
      invoicesAPI.getInvoices()
    ]);

    const combinedData = contracts.map((contract: any) => {
      const relatedInvoices = invoices.filter(
        (inv: any) => inv.projectId === contract.projectId
      );
      return {
        contractId: contract.id,
        projectId: contract.projectId,
        value: contract.value,
        invoices: relatedInvoices.map((inv: any) => ({
          invoiceId: inv.id,
          total: inv.total,
          status: inv.status
        }))
      };
    });

    // --- PDF ---
    const doc = new jsPDF();
    doc.text("تقرير العقود والفواتير", 10, 10);
    let y = 20;
    combinedData.forEach((item, i) => {
      doc.text(`${i + 1}. عقد #${item.contractId} - قيمة: ${item.value}`, 10, y);
      y += 10;
      item.invoices.forEach((inv: any) => {
        doc.text(`   فاتورة: ${inv.invoiceId}, الإجمالي: ${inv.total}, الحالة: ${inv.status}`, 10, y);
        y += 10;
      });
    });
    doc.save(path.join(outputDir, "contracts-invoices-report.pdf"));

    // --- Excel ---
    const rows: any[] = [];
    combinedData.forEach(item => {
      item.invoices.forEach((inv: any) => {
        rows.push({
          ContractID: item.contractId,
          ProjectID: item.projectId,
          ContractValue: item.value,
          InvoiceID: inv.invoiceId,
          InvoiceTotal: inv.total,
          InvoiceStatus: inv.status
        });
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts_Invoices");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    fs.writeFileSync(path.join(outputDir, "contracts-invoices-report.xlsx"), excelBuffer);

    // --- CSV ---
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    fs.writeFileSync(path.join(outputDir, "contracts-invoices-report.csv"), csv);

    console.log("✅ تم توليد جميع التقارير في مجلد exports/");
  } catch (error) {
    console.error("فشل توليد التقارير:", error);
  }
};

generateReports();