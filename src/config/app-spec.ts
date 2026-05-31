/**
 * AUTO-GENERATED — do not edit by hand.
 * Source: docs/specs/*.xlsx
 * Generated: 2026-05-18T22:30:44.648Z
 * Master reference: docs/specs/master-spec-ar.md
 *
 * Counts: dashboards=15 tabs=124 boxes=476 popups=184
 * Re-run via: node scripts/generate-app-spec.mjs
 */
/* eslint-disable */
export const APP_SPEC = {
  "counts": {
    "dashboards": 15,
    "tabs": 124,
    "boxes": 476,
    "popups": 184
  },
  "workspaces": [
    {
      "surface": "departments",
      "dashboards": [
        {
          "order": 1,
          "key": "financial",
          "dashboard": "FinancialDashboard",
          "title": "إدارة العمليات المالية",
          "domain": "financial",
          "service": "financial.service",
          "permissions": "financial.read / financial.write / financial.approve",
          "entities": "Budget, Transaction, Invoice, Payment, Account, FinancialReport",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "لوحة قراءة تنفيذية تلخص الوضع المالي، التدفقات، الإنفاق، الفواتير، والتنبيهات المالية الحرجة.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/overview مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.overview",
              "boxes": [
                {
                  "ref": "FinancialDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة العمليات المالية دون تنفيذ مباشر.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/overview | Service: financial.service | Events: financial.overview.loaded | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: Budget, Transaction, Invoice | Endpoints: GET/POST/PATCH /api/financial/overview | Service: financial.service | Events: financial.risk.detected, financial.alert.created | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: Budget, Transaction, Invoice | Endpoints: GET/POST/PATCH /api/financial/overview | Service: financial.service | Events: financial.record.opened | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: Budget, Transaction, Invoice | Endpoints: GET/POST/PATCH /api/financial/overview | Service: financial.service | Events: financial.action.requested | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice | Endpoints: GET/POST/PATCH /api/financial/overview | Service: financial.service | Events: financial.action.requested | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "budgets",
              "name": "الميزانيات",
              "description": "إدارة الميزانيات، الاعتمادات، التخصيص، والانحراف بين المخطط والفعلي.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/budgets مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.budgets",
              "boxes": [
                {
                  "ref": "FinancialDashboard.budgets.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الميزانيات حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/budgets | Service: financial.service | Events: financial.budgets.filtered | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.budgets.table",
                  "name": "جدول الميزانيات",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الميزانيات مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/budgets | Service: financial.service | Events: financial.budgets.opened | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.budgets.detail",
                  "name": "تفاصيل الميزانيات",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/budgets | Service: financial.service | Events: financial.budgets.detail.viewed | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.budgets.editor",
                  "name": "نموذج إدارة الميزانيات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الميزانيات حسب الصلاحية.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/budgets | Service: financial.service | Events: financial.budgets.created, financial.budgets.updated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.budgets.modal.detail",
                  "name": "نافذة تفاصيل الميزانيات",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الميزانيات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/budgets | Service: financial.service | Events: financial.budgets.detail.viewed | Permissions: financial.read / financial.write / financial.approve"
                },
                {
                  "ref": "FinancialDashboard.budgets.modal.editor",
                  "name": "نافذة إدارة الميزانيات",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الميزانيات حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الميزانيات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/budgets | Service: financial.service | Events: financial.budgets.created, financial.budgets.updated | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "transactions",
              "name": "المعاملات",
              "description": "سجل المعاملات المالية مع بحث وتصفية ومراجعة حالات القيد والسداد.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/transactions مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.transactions",
              "boxes": [
                {
                  "ref": "FinancialDashboard.transactions.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق المعاملات حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/transactions | Service: financial.service | Events: financial.transactions.filtered | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.transactions.table",
                  "name": "جدول المعاملات",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات المعاملات مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/transactions | Service: financial.service | Events: financial.transactions.opened | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.transactions.detail",
                  "name": "تفاصيل المعاملات",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/transactions | Service: financial.service | Events: financial.transactions.detail.viewed | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.transactions.editor",
                  "name": "نموذج إدارة المعاملات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن المعاملات حسب الصلاحية.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/transactions | Service: financial.service | Events: financial.transactions.created, financial.transactions.updated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.transactions.modal.detail",
                  "name": "نافذة تفاصيل المعاملات",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول المعاملات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/transactions | Service: financial.service | Events: financial.transactions.detail.viewed | Permissions: financial.read / financial.write / financial.approve"
                },
                {
                  "ref": "FinancialDashboard.transactions.modal.editor",
                  "name": "نافذة إدارة المعاملات",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن المعاملات حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول المعاملات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/transactions | Service: financial.service | Events: financial.transactions.created, financial.transactions.updated | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "invoices",
              "name": "الفواتير",
              "description": "إنشاء ومراجعة وإصدار الفواتير ومتابعة حالاتها وارتباطها بالعملاء والمشاريع.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/invoices مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.invoices",
              "boxes": [
                {
                  "ref": "FinancialDashboard.invoices.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الفواتير حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/invoices | Service: financial.service | Events: financial.invoices.filtered | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.invoices.table",
                  "name": "جدول الفواتير",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الفواتير مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/invoices | Service: financial.service | Events: financial.invoices.opened | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.invoices.detail",
                  "name": "تفاصيل الفواتير",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/invoices | Service: financial.service | Events: financial.invoices.detail.viewed | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.invoices.editor",
                  "name": "نموذج إدارة الفواتير",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الفواتير حسب الصلاحية.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/invoices | Service: financial.service | Events: financial.invoices.created, financial.invoices.updated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.invoices.modal.detail",
                  "name": "نافذة تفاصيل الفواتير",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الفواتير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/invoices | Service: financial.service | Events: financial.invoices.detail.viewed | Permissions: financial.read / financial.write / financial.approve"
                },
                {
                  "ref": "FinancialDashboard.invoices.modal.editor",
                  "name": "نافذة إدارة الفواتير",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الفواتير حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الفواتير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/invoices | Service: financial.service | Events: financial.invoices.created, financial.invoices.updated | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "analysis",
              "name": "التحليل المالي",
              "description": "قراءات تحليلية للاتجاهات المالية، التدفق النقدي، الانحرافات، والتنبؤات.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/analysis مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.analysis",
              "boxes": [
                {
                  "ref": "FinancialDashboard.analysis.kpi",
                  "name": "مؤشرات التحليل المالي",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/analysis | Service: financial.service | Events: financial.metric.calculated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01",
                    "DAV-CHT-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.analysis.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/analysis | Service: financial.service | Events: financial.analytics.viewed | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.analysis.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/analysis | Service: financial.service | Events: financial.report.opened, financial.report.exported | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.analysis.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/analysis | Service: financial.service | Events: financial.report.generated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.analysis.modal.editor",
                  "name": "نافذة إدارة التحليل المالي",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/analysis | Service: financial.service | Events: financial.report.generated | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "settings",
              "name": "إعدادات المالية",
              "description": "ضبط سياسات الفوترة، العملات، الضرائب، قوالب الفواتير، وحدود الاعتماد.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/settings مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.settings",
              "boxes": [
                {
                  "ref": "FinancialDashboard.settings.policy-list",
                  "name": "قائمة السياسات",
                  "kind": "أداة",
                  "purpose": "يعرض إعدادات وسياسات الإدارة ويتيح تعديلها بحسب الصلاحية.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/settings | Service: financial.service | Events: financial.policy.updated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.settings.configuration",
                  "name": "إعدادات التكوين",
                  "kind": "أداة",
                  "purpose": "يضبط القيم الحاكمة للتبويب مثل الحدود والقواعد والقوالب الافتراضية.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/settings | Service: financial.service | Events: financial.configuration.updated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.settings.compliance-state",
                  "name": "حالة الالتزام",
                  "kind": "عرض",
                  "purpose": "يعرض توافق الإعدادات مع قواعد الحوكمة والامتثال.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/settings | Service: financial.service | Events: financial.compliance.checked | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.settings.audit",
                  "name": "سجل التغييرات",
                  "kind": "عرض",
                  "purpose": "يعرض أثر التغييرات والاعتمادات على هذا النطاق.",
                  "backend": "Entities: AuditLog, Budget, Transaction | Endpoints: GET/POST/PATCH /api/financial/settings | Service: financial.service | Events: audit.recorded | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.settings.modal.editor",
                  "name": "نافذة إدارة إعدادات المالية",
                  "purpose": "يضبط القيم الحاكمة للتبويب مثل الحدود والقواعد والقوالب الافتراضية.",
                  "trigger": "زر إنشاء/تعديل من قائمة السياسات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/settings | Service: financial.service | Events: financial.configuration.updated | Permissions: financial.read / financial.write / financial.approve"
                },
                {
                  "ref": "FinancialDashboard.settings.modal.action",
                  "name": "نافذة إجراءات إعدادات المالية",
                  "purpose": "يعرض إعدادات وسياسات الإدارة ويتيح تعديلها بحسب الصلاحية.",
                  "trigger": "زر إجراء/حوكمة من قائمة السياسات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/settings | Service: financial.service | Events: financial.policy.updated | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "إدارة قوالب الفواتير والتقارير والنماذج المالية القابلة لإعادة الاستخدام.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/templates مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.templates",
              "boxes": [
                {
                  "ref": "FinancialDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.opened | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.previewed | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.created, financial.template.updated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.approved | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.previewed | Permissions: financial.read / financial.write / financial.approve"
                },
                {
                  "ref": "FinancialDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.created, financial.template.updated | Permissions: financial.read / financial.write / financial.approve"
                },
                {
                  "ref": "FinancialDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/templates | Service: financial.service | Events: financial.template.approved | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "مكتبة التقارير المالية، التصدير، وجدولة التقارير الدورية.",
              "backendScope": "نطاق باك اند حاكم: financial.service عبر /api/financial/reports مع صلاحيات financial.read / financial.write / financial.approve",
              "ref": "FinancialDashboard.reports",
              "boxes": [
                {
                  "ref": "FinancialDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/reports | Service: financial.service | Events: financial.metric.calculated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/reports | Service: financial.service | Events: financial.analytics.viewed | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/reports | Service: financial.service | Events: financial.report.opened, financial.report.exported | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "FinancialDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/reports | Service: financial.service | Events: financial.report.generated | Permissions: financial.read / financial.write / financial.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "FinancialDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Budget, Transaction, Invoice, Payment | Endpoints: GET/POST/PATCH /api/financial/reports | Service: financial.service | Events: financial.report.generated | Permissions: financial.read / financial.write / financial.approve"
                }
              ]
            }
          ]
        },
        {
          "order": 2,
          "key": "legal",
          "dashboard": "LegalDashboard",
          "title": "إدارة الشؤون القانونية",
          "domain": "legal",
          "service": "legal.service",
          "permissions": "legal.read / legal.write / legal.approve",
          "entities": "Contract, ComplianceCheck, LegalRisk, License, LegalCase, LegalReport",
          "tabsCount": 7,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص قانوني يعرض العقود، الامتثال، المخاطر، التراخيص، والتنبيهات القانونية.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/overview مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.overview",
              "boxes": [
                {
                  "ref": "LegalDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة الشؤون القانونية دون تنفيذ مباشر.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/overview | Service: legal.service | Events: legal.overview.loaded | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk | Endpoints: GET/POST/PATCH /api/legal/overview | Service: legal.service | Events: legal.risk.detected, legal.alert.created | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk | Endpoints: GET/POST/PATCH /api/legal/overview | Service: legal.service | Events: legal.record.opened | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk | Endpoints: GET/POST/PATCH /api/legal/overview | Service: legal.service | Events: legal.action.requested | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk | Endpoints: GET/POST/PATCH /api/legal/overview | Service: legal.service | Events: legal.action.requested | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            },
            {
              "code": "contracts",
              "name": "العقود",
              "description": "إدارة العقود، تواريخها، أطرافها، حالاتها، ومراجعاتها القانونية.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/contracts مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.contracts",
              "boxes": [
                {
                  "ref": "LegalDashboard.contracts.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق العقود حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/contracts | Service: legal.service | Events: legal.contracts.filtered | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.contracts.table",
                  "name": "جدول العقود",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات العقود مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/contracts | Service: legal.service | Events: legal.contracts.opened | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.contracts.detail",
                  "name": "تفاصيل العقود",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/contracts | Service: legal.service | Events: legal.contracts.detail.viewed | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.contracts.editor",
                  "name": "نموذج إدارة العقود",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن العقود حسب الصلاحية.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/contracts | Service: legal.service | Events: legal.contracts.created, legal.contracts.updated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.contracts.modal.detail",
                  "name": "نافذة تفاصيل العقود",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول العقود",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/contracts | Service: legal.service | Events: legal.contracts.detail.viewed | Permissions: legal.read / legal.write / legal.approve"
                },
                {
                  "ref": "LegalDashboard.contracts.modal.editor",
                  "name": "نافذة إدارة العقود",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن العقود حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول العقود",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/contracts | Service: legal.service | Events: legal.contracts.created, legal.contracts.updated | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            },
            {
              "code": "compliance",
              "name": "الامتثال",
              "description": "متابعة ضوابط الالتزام، نتائج الفحص، الاستثناءات، وخطط المعالجة.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/compliance مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.compliance",
              "boxes": [
                {
                  "ref": "LegalDashboard.compliance.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الامتثال حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/compliance | Service: legal.service | Events: legal.compliance.filtered | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.compliance.workspace-list",
                  "name": "قائمة الامتثال",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الامتثال ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/compliance | Service: legal.service | Events: legal.compliance.opened | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.compliance.detail",
                  "name": "تفاصيل الامتثال",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الامتثال.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/compliance | Service: legal.service | Events: legal.compliance.detail.viewed | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.compliance.actions",
                  "name": "إجراءات الامتثال",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الامتثال حسب نوعها.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/compliance | Service: legal.service | Events: legal.compliance.created, legal.compliance.updated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.compliance.modal.detail",
                  "name": "نافذة تفاصيل الامتثال",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الامتثال.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الامتثال",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/compliance | Service: legal.service | Events: legal.compliance.detail.viewed | Permissions: legal.read / legal.write / legal.approve"
                },
                {
                  "ref": "LegalDashboard.compliance.modal.action",
                  "name": "نافذة إجراءات الامتثال",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الامتثال حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الامتثال",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/compliance | Service: legal.service | Events: legal.compliance.created, legal.compliance.updated | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            },
            {
              "code": "risks",
              "name": "المخاطر القانونية",
              "description": "تسجيل وتصنيف ومتابعة المخاطر القانونية وآثارها المحتملة.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/risks مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.risks",
              "boxes": [
                {
                  "ref": "LegalDashboard.risks.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق المخاطر القانونية حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/risks | Service: legal.service | Events: legal.risks.filtered | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.risks.workspace-list",
                  "name": "قائمة المخاطر القانونية",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر المخاطر القانونية ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/risks | Service: legal.service | Events: legal.risks.opened | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.risks.detail",
                  "name": "تفاصيل المخاطر القانونية",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل المخاطر القانونية.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/risks | Service: legal.service | Events: legal.risks.detail.viewed | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.risks.actions",
                  "name": "إجراءات المخاطر القانونية",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر المخاطر القانونية حسب نوعها.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/risks | Service: legal.service | Events: legal.risks.created, legal.risks.updated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.risks.modal.detail",
                  "name": "نافذة تفاصيل المخاطر القانونية",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل المخاطر القانونية.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة المخاطر القانونية",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/risks | Service: legal.service | Events: legal.risks.detail.viewed | Permissions: legal.read / legal.write / legal.approve"
                },
                {
                  "ref": "LegalDashboard.risks.modal.action",
                  "name": "نافذة إجراءات المخاطر القانونية",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر المخاطر القانونية حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات المخاطر القانونية",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/risks | Service: legal.service | Events: legal.risks.created, legal.risks.updated | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            },
            {
              "code": "licenses",
              "name": "التراخيص",
              "description": "متابعة التراخيص والاعتمادات وتجديدها ومرفقاتها.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/licenses مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.licenses",
              "boxes": [
                {
                  "ref": "LegalDashboard.licenses.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التراخيص حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/licenses | Service: legal.service | Events: legal.licenses.filtered | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.licenses.table",
                  "name": "جدول التراخيص",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات التراخيص مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/licenses | Service: legal.service | Events: legal.licenses.opened | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.licenses.detail",
                  "name": "تفاصيل التراخيص",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/licenses | Service: legal.service | Events: legal.licenses.detail.viewed | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.licenses.editor",
                  "name": "نموذج إدارة التراخيص",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن التراخيص حسب الصلاحية.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/licenses | Service: legal.service | Events: legal.licenses.created, legal.licenses.updated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.licenses.modal.detail",
                  "name": "نافذة تفاصيل التراخيص",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول التراخيص",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/licenses | Service: legal.service | Events: legal.licenses.detail.viewed | Permissions: legal.read / legal.write / legal.approve"
                },
                {
                  "ref": "LegalDashboard.licenses.modal.editor",
                  "name": "نافذة إدارة التراخيص",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن التراخيص حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول التراخيص",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/licenses | Service: legal.service | Events: legal.licenses.created, legal.licenses.updated | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب العقود والخطابات والسياسات القانونية.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/templates مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.templates",
              "boxes": [
                {
                  "ref": "LegalDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.opened | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.previewed | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.created, legal.template.updated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.approved | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.previewed | Permissions: legal.read / legal.write / legal.approve"
                },
                {
                  "ref": "LegalDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.created, legal.template.updated | Permissions: legal.read / legal.write / legal.approve"
                },
                {
                  "ref": "LegalDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/templates | Service: legal.service | Events: legal.template.approved | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير العقود والامتثال والمخاطر والتراخيص.",
              "backendScope": "نطاق باك اند حاكم: legal.service عبر /api/legal/reports مع صلاحيات legal.read / legal.write / legal.approve",
              "ref": "LegalDashboard.reports",
              "boxes": [
                {
                  "ref": "LegalDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/reports | Service: legal.service | Events: legal.metric.calculated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/reports | Service: legal.service | Events: legal.analytics.viewed | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/reports | Service: legal.service | Events: legal.report.opened, legal.report.exported | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "LegalDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/reports | Service: legal.service | Events: legal.report.generated | Permissions: legal.read / legal.write / legal.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "LegalDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Contract, ComplianceCheck, LegalRisk, License | Endpoints: GET/POST/PATCH /api/legal/reports | Service: legal.service | Events: legal.report.generated | Permissions: legal.read / legal.write / legal.approve"
                }
              ]
            }
          ]
        },
        {
          "order": 3,
          "key": "marketing",
          "dashboard": "MarketingDashboard",
          "title": "إدارة الأنشطة التسويقية",
          "domain": "marketing",
          "service": "marketing.service",
          "permissions": "marketing.read / marketing.write / marketing.publish",
          "entities": "Campaign, MarketingChannel, ContentAsset, PerformanceMetric, MarketingBudget, PRRecord",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص أداء الأنشطة التسويقية والقنوات والحملات والمحتوى والميزانيات.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/overview مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.overview",
              "boxes": [
                {
                  "ref": "MarketingDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة الأنشطة التسويقية دون تنفيذ مباشر.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/overview | Service: marketing.service | Events: marketing.overview.loaded | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset | Endpoints: GET/POST/PATCH /api/marketing/overview | Service: marketing.service | Events: marketing.risk.detected, marketing.alert.created | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset | Endpoints: GET/POST/PATCH /api/marketing/overview | Service: marketing.service | Events: marketing.record.opened | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset | Endpoints: GET/POST/PATCH /api/marketing/overview | Service: marketing.service | Events: marketing.action.requested | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset | Endpoints: GET/POST/PATCH /api/marketing/overview | Service: marketing.service | Events: marketing.action.requested | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "campaigns",
              "name": "الحملات",
              "description": "إدارة الحملات، أهدافها، حالاتها، قنواتها، وجداولها التنفيذية.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/campaigns مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.campaigns",
              "boxes": [
                {
                  "ref": "MarketingDashboard.campaigns.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الحملات حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/campaigns | Service: marketing.service | Events: marketing.campaigns.filtered | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.campaigns.workspace-list",
                  "name": "قائمة الحملات",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الحملات ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/campaigns | Service: marketing.service | Events: marketing.campaigns.opened | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.campaigns.detail",
                  "name": "تفاصيل الحملات",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الحملات.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/campaigns | Service: marketing.service | Events: marketing.campaigns.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.campaigns.actions",
                  "name": "إجراءات الحملات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الحملات حسب نوعها.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/campaigns | Service: marketing.service | Events: marketing.campaigns.created, marketing.campaigns.updated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.campaigns.modal.detail",
                  "name": "نافذة تفاصيل الحملات",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الحملات.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الحملات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/campaigns | Service: marketing.service | Events: marketing.campaigns.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish"
                },
                {
                  "ref": "MarketingDashboard.campaigns.modal.action",
                  "name": "نافذة إجراءات الحملات",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الحملات حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الحملات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/campaigns | Service: marketing.service | Events: marketing.campaigns.created, marketing.campaigns.updated | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "content",
              "name": "المحتوى والأصول",
              "description": "إدارة أصول المحتوى والمواد التسويقية وربطها بالحملات والقنوات.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/content مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.content",
              "boxes": [
                {
                  "ref": "MarketingDashboard.content.search-filter",
                  "name": "بحث وتصفية",
                  "kind": "أداة",
                  "purpose": "يتيح البحث والتصفية حسب النوع والحالة والمالك والتاريخ.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/content | Service: marketing.service | Events: marketing.content.searched | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.content.asset-list",
                  "name": "قائمة المحتوى والأصول",
                  "kind": "أداة",
                  "purpose": "يعرض العناصر في قائمة/جدول مع فتح التفاصيل أو الربط أو التنزيل.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/content | Service: marketing.service | Events: marketing.content.opened | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.content.asset-detail",
                  "name": "تفاصيل العنصر",
                  "kind": "عرض",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/content | Service: marketing.service | Events: marketing.content.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.content.asset-actions",
                  "name": "إجراءات العنصر",
                  "kind": "أداة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/content | Service: marketing.service | Events: marketing.content.created, marketing.content.linked | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.content.modal.detail",
                  "name": "نافذة تفاصيل المحتوى والأصول",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة المحتوى والأصول",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/content | Service: marketing.service | Events: marketing.content.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish"
                },
                {
                  "ref": "MarketingDashboard.content.modal.action",
                  "name": "نافذة إجراءات المحتوى والأصول",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العنصر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/content | Service: marketing.service | Events: marketing.content.created, marketing.content.linked | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "performance",
              "name": "الأداء والتحليلات",
              "description": "تحليل مؤشرات الأداء، الوصول، التفاعل، التحويل، والعائد التسويقي.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/performance مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.performance",
              "boxes": [
                {
                  "ref": "MarketingDashboard.performance.kpi",
                  "name": "مؤشرات الأداء والتحليلات",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/performance | Service: marketing.service | Events: marketing.metric.calculated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01",
                    "DAV-CHT-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.performance.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/performance | Service: marketing.service | Events: marketing.analytics.viewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.performance.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/performance | Service: marketing.service | Events: marketing.report.opened, marketing.report.exported | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.performance.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/performance | Service: marketing.service | Events: marketing.report.generated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.performance.modal.editor",
                  "name": "نافذة إدارة الأداء والتحليلات",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/performance | Service: marketing.service | Events: marketing.report.generated | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "budgets",
              "name": "ميزانيات التسويق",
              "description": "تخطيط ومتابعة إنفاق الحملات والقنوات ومقارنة المخطط بالفعلي.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/budgets مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.budgets",
              "boxes": [
                {
                  "ref": "MarketingDashboard.budgets.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق ميزانيات التسويق حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/budgets | Service: marketing.service | Events: marketing.budgets.filtered | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.budgets.table",
                  "name": "جدول ميزانيات التسويق",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات ميزانيات التسويق مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/budgets | Service: marketing.service | Events: marketing.budgets.opened | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.budgets.detail",
                  "name": "تفاصيل ميزانيات التسويق",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/budgets | Service: marketing.service | Events: marketing.budgets.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.budgets.editor",
                  "name": "نموذج إدارة ميزانيات التسويق",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن ميزانيات التسويق حسب الصلاحية.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/budgets | Service: marketing.service | Events: marketing.budgets.created, marketing.budgets.updated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.budgets.modal.detail",
                  "name": "نافذة تفاصيل ميزانيات التسويق",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول ميزانيات التسويق",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/budgets | Service: marketing.service | Events: marketing.budgets.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish"
                },
                {
                  "ref": "MarketingDashboard.budgets.modal.editor",
                  "name": "نافذة إدارة ميزانيات التسويق",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن ميزانيات التسويق حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول ميزانيات التسويق",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/budgets | Service: marketing.service | Events: marketing.budgets.created, marketing.budgets.updated | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "pr",
              "name": "العلاقات العامة",
              "description": "إدارة المبادرات الإعلامية والعلاقات العامة والظهور والبيانات الصحفية.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/pr مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.pr",
              "boxes": [
                {
                  "ref": "MarketingDashboard.pr.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق العلاقات العامة حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/pr | Service: marketing.service | Events: marketing.pr.filtered | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.pr.workspace-list",
                  "name": "قائمة العلاقات العامة",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر العلاقات العامة ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/pr | Service: marketing.service | Events: marketing.pr.opened | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.pr.detail",
                  "name": "تفاصيل العلاقات العامة",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل العلاقات العامة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/pr | Service: marketing.service | Events: marketing.pr.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.pr.actions",
                  "name": "إجراءات العلاقات العامة",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر العلاقات العامة حسب نوعها.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/pr | Service: marketing.service | Events: marketing.pr.created, marketing.pr.updated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.pr.modal.detail",
                  "name": "نافذة تفاصيل العلاقات العامة",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل العلاقات العامة.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة العلاقات العامة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/pr | Service: marketing.service | Events: marketing.pr.detail.viewed | Permissions: marketing.read / marketing.write / marketing.publish"
                },
                {
                  "ref": "MarketingDashboard.pr.modal.action",
                  "name": "نافذة إجراءات العلاقات العامة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر العلاقات العامة حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العلاقات العامة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/pr | Service: marketing.service | Events: marketing.pr.created, marketing.pr.updated | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب الحملات والمحتوى والتقارير التسويقية.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/templates مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.templates",
              "boxes": [
                {
                  "ref": "MarketingDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.opened | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.previewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.created, marketing.template.updated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.approved | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.previewed | Permissions: marketing.read / marketing.write / marketing.publish"
                },
                {
                  "ref": "MarketingDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.created, marketing.template.updated | Permissions: marketing.read / marketing.write / marketing.publish"
                },
                {
                  "ref": "MarketingDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/templates | Service: marketing.service | Events: marketing.template.approved | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير التسويق، الأداء، القنوات، والحملات.",
              "backendScope": "نطاق باك اند حاكم: marketing.service عبر /api/marketing/reports مع صلاحيات marketing.read / marketing.write / marketing.publish",
              "ref": "MarketingDashboard.reports",
              "boxes": [
                {
                  "ref": "MarketingDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/reports | Service: marketing.service | Events: marketing.metric.calculated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/reports | Service: marketing.service | Events: marketing.analytics.viewed | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/reports | Service: marketing.service | Events: marketing.report.opened, marketing.report.exported | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "MarketingDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/reports | Service: marketing.service | Events: marketing.report.generated | Permissions: marketing.read / marketing.write / marketing.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "MarketingDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Campaign, MarketingChannel, ContentAsset, PerformanceMetric | Endpoints: GET/POST/PATCH /api/marketing/reports | Service: marketing.service | Events: marketing.report.generated | Permissions: marketing.read / marketing.write / marketing.publish"
                }
              ]
            }
          ]
        },
        {
          "order": 4,
          "key": "hr",
          "dashboard": "HRDashboard",
          "title": "إدارة الموارد البشرية",
          "domain": "hr",
          "service": "hr.service",
          "permissions": "hr.read / hr.write / hr.manage",
          "entities": "Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate, TrainingEnrollment, HRReport",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص القوى العاملة، الحضور، الأداء، الاحتياج، والمخاطر البشرية.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/overview مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.overview",
              "boxes": [
                {
                  "ref": "HRDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة الموارد البشرية دون تنفيذ مباشر.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/overview | Service: hr.service | Events: hr.overview.loaded | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview | Endpoints: GET/POST/PATCH /api/hr/overview | Service: hr.service | Events: hr.risk.detected, hr.alert.created | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview | Endpoints: GET/POST/PATCH /api/hr/overview | Service: hr.service | Events: hr.record.opened | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview | Endpoints: GET/POST/PATCH /api/hr/overview | Service: hr.service | Events: hr.action.requested | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview | Endpoints: GET/POST/PATCH /api/hr/overview | Service: hr.service | Events: hr.action.requested | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "employees",
              "name": "الموظفون",
              "description": "إدارة سجلات الموظفين، الأقسام، الأدوار، الحالات، والمرفقات الأساسية.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/employees مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.employees",
              "boxes": [
                {
                  "ref": "HRDashboard.employees.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الموظفون حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/employees | Service: hr.service | Events: hr.employees.filtered | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.employees.table",
                  "name": "جدول الموظفون",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الموظفون مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/employees | Service: hr.service | Events: hr.employees.opened | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.employees.detail",
                  "name": "تفاصيل الموظفون",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/employees | Service: hr.service | Events: hr.employees.detail.viewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.employees.editor",
                  "name": "نموذج إدارة الموظفون",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الموظفون حسب الصلاحية.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/employees | Service: hr.service | Events: hr.employees.created, hr.employees.updated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.employees.modal.detail",
                  "name": "نافذة تفاصيل الموظفون",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الموظفون",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/employees | Service: hr.service | Events: hr.employees.detail.viewed | Permissions: hr.read / hr.write / hr.manage"
                },
                {
                  "ref": "HRDashboard.employees.modal.editor",
                  "name": "نافذة إدارة الموظفون",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الموظفون حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الموظفون",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/employees | Service: hr.service | Events: hr.employees.created, hr.employees.updated | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "attendance",
              "name": "الحضور والانصراف",
              "description": "متابعة الحضور والانصراف والغياب والتأخير والإجازات.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/attendance مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.attendance",
              "boxes": [
                {
                  "ref": "HRDashboard.attendance.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الحضور والانصراف حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/attendance | Service: hr.service | Events: hr.attendance.filtered | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.attendance.table",
                  "name": "جدول الحضور والانصراف",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الحضور والانصراف مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/attendance | Service: hr.service | Events: hr.attendance.opened | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.attendance.detail",
                  "name": "تفاصيل الحضور والانصراف",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/attendance | Service: hr.service | Events: hr.attendance.detail.viewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.attendance.editor",
                  "name": "نموذج إدارة الحضور والانصراف",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الحضور والانصراف حسب الصلاحية.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/attendance | Service: hr.service | Events: hr.attendance.created, hr.attendance.updated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.attendance.modal.detail",
                  "name": "نافذة تفاصيل الحضور والانصراف",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الحضور والانصراف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/attendance | Service: hr.service | Events: hr.attendance.detail.viewed | Permissions: hr.read / hr.write / hr.manage"
                },
                {
                  "ref": "HRDashboard.attendance.modal.editor",
                  "name": "نافذة إدارة الحضور والانصراف",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الحضور والانصراف حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الحضور والانصراف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/attendance | Service: hr.service | Events: hr.attendance.created, hr.attendance.updated | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "performance",
              "name": "الأداء",
              "description": "تقييم الأداء، الأهداف، الملاحظات، وخطط التحسين.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/performance مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.performance",
              "boxes": [
                {
                  "ref": "HRDashboard.performance.kpi",
                  "name": "مؤشرات الأداء",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/performance | Service: hr.service | Events: hr.metric.calculated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.performance.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/performance | Service: hr.service | Events: hr.analytics.viewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.performance.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/performance | Service: hr.service | Events: hr.report.opened, hr.report.exported | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.performance.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/performance | Service: hr.service | Events: hr.report.generated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.performance.modal.editor",
                  "name": "نافذة إدارة الأداء",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/performance | Service: hr.service | Events: hr.report.generated | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "recruitment",
              "name": "الاستقطاب والتوظيف",
              "description": "إدارة المرشحين، مراحل التوظيف، المقابلات، والقرارات.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/recruitment مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.recruitment",
              "boxes": [
                {
                  "ref": "HRDashboard.recruitment.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الاستقطاب والتوظيف حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/recruitment | Service: hr.service | Events: hr.recruitment.filtered | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.recruitment.table",
                  "name": "جدول الاستقطاب والتوظيف",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الاستقطاب والتوظيف مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/recruitment | Service: hr.service | Events: hr.recruitment.opened | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.recruitment.detail",
                  "name": "تفاصيل الاستقطاب والتوظيف",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/recruitment | Service: hr.service | Events: hr.recruitment.detail.viewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.recruitment.editor",
                  "name": "نموذج إدارة الاستقطاب والتوظيف",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الاستقطاب والتوظيف حسب الصلاحية.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/recruitment | Service: hr.service | Events: hr.recruitment.created, hr.recruitment.updated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.recruitment.modal.detail",
                  "name": "نافذة تفاصيل الاستقطاب والتوظيف",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الاستقطاب والتوظيف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/recruitment | Service: hr.service | Events: hr.recruitment.detail.viewed | Permissions: hr.read / hr.write / hr.manage"
                },
                {
                  "ref": "HRDashboard.recruitment.modal.editor",
                  "name": "نافذة إدارة الاستقطاب والتوظيف",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الاستقطاب والتوظيف حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الاستقطاب والتوظيف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/recruitment | Service: hr.service | Events: hr.recruitment.created, hr.recruitment.updated | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "training",
              "name": "التدريب الداخلي",
              "description": "ربط الموظفين ببرامج التدريب وقياس أثر التدريب على الأداء.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/training مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.training",
              "boxes": [
                {
                  "ref": "HRDashboard.training.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التدريب الداخلي حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/training | Service: hr.service | Events: hr.training.filtered | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.training.workspace-list",
                  "name": "قائمة التدريب الداخلي",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر التدريب الداخلي ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/training | Service: hr.service | Events: hr.training.opened | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.training.detail",
                  "name": "تفاصيل التدريب الداخلي",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التدريب الداخلي.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/training | Service: hr.service | Events: hr.training.detail.viewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.training.actions",
                  "name": "إجراءات التدريب الداخلي",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التدريب الداخلي حسب نوعها.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/training | Service: hr.service | Events: hr.training.created, hr.training.updated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.training.modal.detail",
                  "name": "نافذة تفاصيل التدريب الداخلي",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التدريب الداخلي.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة التدريب الداخلي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/training | Service: hr.service | Events: hr.training.detail.viewed | Permissions: hr.read / hr.write / hr.manage"
                },
                {
                  "ref": "HRDashboard.training.modal.action",
                  "name": "نافذة إجراءات التدريب الداخلي",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التدريب الداخلي حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات التدريب الداخلي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/training | Service: hr.service | Events: hr.training.created, hr.training.updated | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب خطابات الموارد البشرية ونماذج التقييم والتوظيف.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/templates مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.templates",
              "boxes": [
                {
                  "ref": "HRDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.opened | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.previewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.created, hr.template.updated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.approved | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.previewed | Permissions: hr.read / hr.write / hr.manage"
                },
                {
                  "ref": "HRDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.created, hr.template.updated | Permissions: hr.read / hr.write / hr.manage"
                },
                {
                  "ref": "HRDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/templates | Service: hr.service | Events: hr.template.approved | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير الموارد البشرية، الحضور، الأداء، والتوظيف.",
              "backendScope": "نطاق باك اند حاكم: hr.service عبر /api/hr/reports مع صلاحيات hr.read / hr.write / hr.manage",
              "ref": "HRDashboard.reports",
              "boxes": [
                {
                  "ref": "HRDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/reports | Service: hr.service | Events: hr.metric.calculated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/reports | Service: hr.service | Events: hr.analytics.viewed | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/reports | Service: hr.service | Events: hr.report.opened, hr.report.exported | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "HRDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/reports | Service: hr.service | Events: hr.report.generated | Permissions: hr.read / hr.write / hr.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "HRDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Employee, AttendanceRecord, PerformanceReview, RecruitmentCandidate | Endpoints: GET/POST/PATCH /api/hr/reports | Service: hr.service | Events: hr.report.generated | Permissions: hr.read / hr.write / hr.manage"
                }
              ]
            }
          ]
        },
        {
          "order": 5,
          "key": "crm",
          "dashboard": "CRMDashboard",
          "title": "إدارة علاقات العملاء",
          "domain": "crm",
          "service": "crm.service",
          "permissions": "crm.read / crm.write / crm.manage",
          "entities": "Customer, Opportunity, ServiceTicket, CustomerInteraction, AccountHealth, CRMReport",
          "tabsCount": 7,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص العملاء والفرص والخدمة وصحة الحسابات ومؤشرات الرضا.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/overview مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.overview",
              "boxes": [
                {
                  "ref": "CRMDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة علاقات العملاء دون تنفيذ مباشر.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/overview | Service: crm.service | Events: crm.overview.loaded | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket | Endpoints: GET/POST/PATCH /api/crm/overview | Service: crm.service | Events: crm.risk.detected, crm.alert.created | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket | Endpoints: GET/POST/PATCH /api/crm/overview | Service: crm.service | Events: crm.record.opened | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket | Endpoints: GET/POST/PATCH /api/crm/overview | Service: crm.service | Events: crm.action.requested | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket | Endpoints: GET/POST/PATCH /api/crm/overview | Service: crm.service | Events: crm.action.requested | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            },
            {
              "code": "customers",
              "name": "العملاء",
              "description": "إدارة ملفات العملاء، بيانات الاتصال، العلاقات، والتصنيفات.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/customers مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.customers",
              "boxes": [
                {
                  "ref": "CRMDashboard.customers.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق العملاء حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/customers | Service: crm.service | Events: crm.customers.filtered | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.customers.table",
                  "name": "جدول العملاء",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات العملاء مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/customers | Service: crm.service | Events: crm.customers.opened | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.customers.detail",
                  "name": "تفاصيل العملاء",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/customers | Service: crm.service | Events: crm.customers.detail.viewed | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.customers.editor",
                  "name": "نموذج إدارة العملاء",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن العملاء حسب الصلاحية.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/customers | Service: crm.service | Events: crm.customers.created, crm.customers.updated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.customers.modal.detail",
                  "name": "نافذة تفاصيل العملاء",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول العملاء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/customers | Service: crm.service | Events: crm.customers.detail.viewed | Permissions: crm.read / crm.write / crm.manage"
                },
                {
                  "ref": "CRMDashboard.customers.modal.editor",
                  "name": "نافذة إدارة العملاء",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن العملاء حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول العملاء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/customers | Service: crm.service | Events: crm.customers.created, crm.customers.updated | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            },
            {
              "code": "opportunities",
              "name": "الفرص",
              "description": "إدارة فرص البيع أو التعاون ومراحلها واحتمالاتها وقيمتها.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/opportunities مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.opportunities",
              "boxes": [
                {
                  "ref": "CRMDashboard.opportunities.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الفرص حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/opportunities | Service: crm.service | Events: crm.opportunities.filtered | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.opportunities.table",
                  "name": "جدول الفرص",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الفرص مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/opportunities | Service: crm.service | Events: crm.opportunities.opened | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.opportunities.detail",
                  "name": "تفاصيل الفرص",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/opportunities | Service: crm.service | Events: crm.opportunities.detail.viewed | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.opportunities.editor",
                  "name": "نموذج إدارة الفرص",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الفرص حسب الصلاحية.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/opportunities | Service: crm.service | Events: crm.opportunities.created, crm.opportunities.updated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.opportunities.modal.detail",
                  "name": "نافذة تفاصيل الفرص",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الفرص",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/opportunities | Service: crm.service | Events: crm.opportunities.detail.viewed | Permissions: crm.read / crm.write / crm.manage"
                },
                {
                  "ref": "CRMDashboard.opportunities.modal.editor",
                  "name": "نافذة إدارة الفرص",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الفرص حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الفرص",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/opportunities | Service: crm.service | Events: crm.opportunities.created, crm.opportunities.updated | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            },
            {
              "code": "service",
              "name": "الخدمة والدعم",
              "description": "متابعة التذاكر والطلبات والشكاوى ومستويات الخدمة.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/service مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.service",
              "boxes": [
                {
                  "ref": "CRMDashboard.service.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الخدمة والدعم حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/service | Service: crm.service | Events: crm.service.filtered | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.service.workspace-list",
                  "name": "قائمة الخدمة والدعم",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الخدمة والدعم ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/service | Service: crm.service | Events: crm.service.opened | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.service.detail",
                  "name": "تفاصيل الخدمة والدعم",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الخدمة والدعم.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/service | Service: crm.service | Events: crm.service.detail.viewed | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.service.actions",
                  "name": "إجراءات الخدمة والدعم",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الخدمة والدعم حسب نوعها.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/service | Service: crm.service | Events: crm.service.created, crm.service.updated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.service.modal.detail",
                  "name": "نافذة تفاصيل الخدمة والدعم",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الخدمة والدعم.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الخدمة والدعم",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/service | Service: crm.service | Events: crm.service.detail.viewed | Permissions: crm.read / crm.write / crm.manage"
                },
                {
                  "ref": "CRMDashboard.service.modal.action",
                  "name": "نافذة إجراءات الخدمة والدعم",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الخدمة والدعم حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الخدمة والدعم",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/service | Service: crm.service | Events: crm.service.created, crm.service.updated | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            },
            {
              "code": "analytics",
              "name": "التحليلات",
              "description": "تحليل صحة الحسابات، الاحتفاظ، التحويل، والرضا.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/analytics مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.analytics",
              "boxes": [
                {
                  "ref": "CRMDashboard.analytics.kpi",
                  "name": "مؤشرات التحليلات",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/analytics | Service: crm.service | Events: crm.metric.calculated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01",
                    "DAV-CHT-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.analytics.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/analytics | Service: crm.service | Events: crm.analytics.viewed | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.analytics.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/analytics | Service: crm.service | Events: crm.report.opened, crm.report.exported | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.analytics.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/analytics | Service: crm.service | Events: crm.report.generated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.analytics.modal.editor",
                  "name": "نافذة إدارة التحليلات",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/analytics | Service: crm.service | Events: crm.report.generated | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب العروض والرسائل ونماذج تواصل العملاء.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/templates مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.templates",
              "boxes": [
                {
                  "ref": "CRMDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.opened | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.previewed | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.created, crm.template.updated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.approved | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.previewed | Permissions: crm.read / crm.write / crm.manage"
                },
                {
                  "ref": "CRMDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.created, crm.template.updated | Permissions: crm.read / crm.write / crm.manage"
                },
                {
                  "ref": "CRMDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/templates | Service: crm.service | Events: crm.template.approved | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير العملاء والفرص والخدمة والرضا.",
              "backendScope": "نطاق باك اند حاكم: crm.service عبر /api/crm/reports مع صلاحيات crm.read / crm.write / crm.manage",
              "ref": "CRMDashboard.reports",
              "boxes": [
                {
                  "ref": "CRMDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/reports | Service: crm.service | Events: crm.metric.calculated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/reports | Service: crm.service | Events: crm.analytics.viewed | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/reports | Service: crm.service | Events: crm.report.opened, crm.report.exported | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CRMDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/reports | Service: crm.service | Events: crm.report.generated | Permissions: crm.read / crm.write / crm.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CRMDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Customer, Opportunity, ServiceTicket, CustomerInteraction | Endpoints: GET/POST/PATCH /api/crm/reports | Service: crm.service | Events: crm.report.generated | Permissions: crm.read / crm.write / crm.manage"
                }
              ]
            }
          ]
        },
        {
          "order": 6,
          "key": "csr",
          "dashboard": "CSRDashboard",
          "title": "إدارة المسؤولية الاجتماعية",
          "domain": "csr",
          "service": "csr.service",
          "permissions": "csr.read / csr.write / csr.approve",
          "entities": "CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory, CSRResource, CSRReport",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص المبادرات والأثر الاجتماعي والموارد والقصص والمخاطر.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/overview مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.overview",
              "boxes": [
                {
                  "ref": "CSRDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة المسؤولية الاجتماعية دون تنفيذ مباشر.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/overview | Service: csr.service | Events: csr.overview.loaded | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment | Endpoints: GET/POST/PATCH /api/csr/overview | Service: csr.service | Events: csr.risk.detected, csr.alert.created | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment | Endpoints: GET/POST/PATCH /api/csr/overview | Service: csr.service | Events: csr.record.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment | Endpoints: GET/POST/PATCH /api/csr/overview | Service: csr.service | Events: csr.action.requested | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment | Endpoints: GET/POST/PATCH /api/csr/overview | Service: csr.service | Events: csr.action.requested | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "initiatives",
              "name": "المبادرات",
              "description": "إدارة مبادرات المسؤولية الاجتماعية وأهدافها وحالتها وجدولها.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/initiatives مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.initiatives",
              "boxes": [
                {
                  "ref": "CSRDashboard.initiatives.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق المبادرات حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/initiatives | Service: csr.service | Events: csr.initiatives.filtered | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.initiatives.workspace-list",
                  "name": "قائمة المبادرات",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر المبادرات ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/initiatives | Service: csr.service | Events: csr.initiatives.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.initiatives.detail",
                  "name": "تفاصيل المبادرات",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل المبادرات.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/initiatives | Service: csr.service | Events: csr.initiatives.detail.viewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.initiatives.actions",
                  "name": "إجراءات المبادرات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر المبادرات حسب نوعها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/initiatives | Service: csr.service | Events: csr.initiatives.created, csr.initiatives.updated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.initiatives.modal.detail",
                  "name": "نافذة تفاصيل المبادرات",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل المبادرات.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة المبادرات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/initiatives | Service: csr.service | Events: csr.initiatives.detail.viewed | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.initiatives.modal.action",
                  "name": "نافذة إجراءات المبادرات",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر المبادرات حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات المبادرات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/initiatives | Service: csr.service | Events: csr.initiatives.created, csr.initiatives.updated | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "impact",
              "name": "الأثر والقياس",
              "description": "قياس الأثر الاجتماعي والتسويقي ومؤشرات النتائج والمخرجات.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/impact مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.impact",
              "boxes": [
                {
                  "ref": "CSRDashboard.impact.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الأثر والقياس حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/impact | Service: csr.service | Events: csr.impact.filtered | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.impact.workspace-list",
                  "name": "قائمة الأثر والقياس",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الأثر والقياس ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/impact | Service: csr.service | Events: csr.impact.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.impact.detail",
                  "name": "تفاصيل الأثر والقياس",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الأثر والقياس.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/impact | Service: csr.service | Events: csr.impact.detail.viewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.impact.actions",
                  "name": "إجراءات الأثر والقياس",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الأثر والقياس حسب نوعها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/impact | Service: csr.service | Events: csr.impact.created, csr.impact.updated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.impact.modal.detail",
                  "name": "نافذة تفاصيل الأثر والقياس",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الأثر والقياس.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الأثر والقياس",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/impact | Service: csr.service | Events: csr.impact.detail.viewed | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.impact.modal.action",
                  "name": "نافذة إجراءات الأثر والقياس",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الأثر والقياس حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الأثر والقياس",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/impact | Service: csr.service | Events: csr.impact.created, csr.impact.updated | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "beneficiaries",
              "name": "المستفيدون",
              "description": "تعريف شرائح المستفيدين وارتباطها بالمبادرات والأثر.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/beneficiaries مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.beneficiaries",
              "boxes": [
                {
                  "ref": "CSRDashboard.beneficiaries.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق المستفيدون حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/beneficiaries | Service: csr.service | Events: csr.beneficiaries.filtered | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.beneficiaries.workspace-list",
                  "name": "قائمة المستفيدون",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر المستفيدون ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/beneficiaries | Service: csr.service | Events: csr.beneficiaries.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.beneficiaries.detail",
                  "name": "تفاصيل المستفيدون",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل المستفيدون.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/beneficiaries | Service: csr.service | Events: csr.beneficiaries.detail.viewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.beneficiaries.actions",
                  "name": "إجراءات المستفيدون",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر المستفيدون حسب نوعها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/beneficiaries | Service: csr.service | Events: csr.beneficiaries.created, csr.beneficiaries.updated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.beneficiaries.modal.detail",
                  "name": "نافذة تفاصيل المستفيدون",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل المستفيدون.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة المستفيدون",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/beneficiaries | Service: csr.service | Events: csr.beneficiaries.detail.viewed | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.beneficiaries.modal.action",
                  "name": "نافذة إجراءات المستفيدون",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر المستفيدون حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات المستفيدون",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/beneficiaries | Service: csr.service | Events: csr.beneficiaries.created, csr.beneficiaries.updated | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "stories",
              "name": "القصص والتوثيق",
              "description": "توثيق قصص الأثر والمواد السردية والمخرجات الإعلامية.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/stories مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.stories",
              "boxes": [
                {
                  "ref": "CSRDashboard.stories.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق القصص والتوثيق حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/stories | Service: csr.service | Events: csr.stories.filtered | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.stories.workspace-list",
                  "name": "قائمة القصص والتوثيق",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر القصص والتوثيق ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/stories | Service: csr.service | Events: csr.stories.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.stories.detail",
                  "name": "تفاصيل القصص والتوثيق",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل القصص والتوثيق.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/stories | Service: csr.service | Events: csr.stories.detail.viewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.stories.actions",
                  "name": "إجراءات القصص والتوثيق",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر القصص والتوثيق حسب نوعها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/stories | Service: csr.service | Events: csr.stories.created, csr.stories.updated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.stories.modal.detail",
                  "name": "نافذة تفاصيل القصص والتوثيق",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل القصص والتوثيق.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة القصص والتوثيق",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/stories | Service: csr.service | Events: csr.stories.detail.viewed | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.stories.modal.action",
                  "name": "نافذة إجراءات القصص والتوثيق",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر القصص والتوثيق حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات القصص والتوثيق",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/stories | Service: csr.service | Events: csr.stories.created, csr.stories.updated | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "resources",
              "name": "الموارد",
              "description": "إدارة الموارد والميزانيات والأصول المرتبطة بالمبادرات.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/resources مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.resources",
              "boxes": [
                {
                  "ref": "CSRDashboard.resources.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الموارد حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/resources | Service: csr.service | Events: csr.resources.filtered | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.resources.workspace-list",
                  "name": "قائمة الموارد",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الموارد ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/resources | Service: csr.service | Events: csr.resources.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.resources.detail",
                  "name": "تفاصيل الموارد",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الموارد.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/resources | Service: csr.service | Events: csr.resources.detail.viewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.resources.actions",
                  "name": "إجراءات الموارد",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الموارد حسب نوعها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/resources | Service: csr.service | Events: csr.resources.created, csr.resources.updated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.resources.modal.detail",
                  "name": "نافذة تفاصيل الموارد",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الموارد.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الموارد",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/resources | Service: csr.service | Events: csr.resources.detail.viewed | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.resources.modal.action",
                  "name": "نافذة إجراءات الموارد",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الموارد حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الموارد",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/resources | Service: csr.service | Events: csr.resources.created, csr.resources.updated | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب المبادرات وتقارير الأثر ونماذج التوثيق.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/templates مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.templates",
              "boxes": [
                {
                  "ref": "CSRDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.opened | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.previewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.created, csr.template.updated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.approved | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.previewed | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.created, csr.template.updated | Permissions: csr.read / csr.write / csr.approve"
                },
                {
                  "ref": "CSRDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/templates | Service: csr.service | Events: csr.template.approved | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير المبادرات والأثر والموارد والمخرجات.",
              "backendScope": "نطاق باك اند حاكم: csr.service عبر /api/csr/reports مع صلاحيات csr.read / csr.write / csr.approve",
              "ref": "CSRDashboard.reports",
              "boxes": [
                {
                  "ref": "CSRDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/reports | Service: csr.service | Events: csr.metric.calculated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/reports | Service: csr.service | Events: csr.analytics.viewed | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/reports | Service: csr.service | Events: csr.report.opened, csr.report.exported | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "CSRDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/reports | Service: csr.service | Events: csr.report.generated | Permissions: csr.read / csr.write / csr.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "CSRDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CSRInitiative, CSRImpactMetric, BeneficiarySegment, CSRStory | Endpoints: GET/POST/PATCH /api/csr/reports | Service: csr.service | Events: csr.report.generated | Permissions: csr.read / csr.write / csr.approve"
                }
              ]
            }
          ]
        },
        {
          "order": 7,
          "key": "bcm",
          "dashboard": "BCMDashboard",
          "title": "إدارة مجتمع العلامة",
          "domain": "bcm",
          "service": "brandCommunity.service",
          "permissions": "bcm.read / bcm.write / bcm.moderate",
          "entities": "CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram, CommunityContent, CommunityEvent",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص صحة مجتمع العلامة، النمو، التفاعل، الولاء، والمحتوى المجتمعي.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/overview مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.overview",
              "boxes": [
                {
                  "ref": "BCMDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة مجتمع العلامة دون تنفيذ مباشر.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/overview | Service: brandCommunity.service | Events: bcm.overview.loaded | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity | Endpoints: GET/POST/PATCH /api/bcm/overview | Service: brandCommunity.service | Events: bcm.risk.detected, bcm.alert.created | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity | Endpoints: GET/POST/PATCH /api/bcm/overview | Service: brandCommunity.service | Events: bcm.record.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity | Endpoints: GET/POST/PATCH /api/bcm/overview | Service: brandCommunity.service | Events: bcm.action.requested | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity | Endpoints: GET/POST/PATCH /api/bcm/overview | Service: brandCommunity.service | Events: bcm.action.requested | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "members",
              "name": "الأعضاء",
              "description": "إدارة أعضاء المجتمع، ملفاتهم، حالة العضوية، ودرجات التفاعل.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/members مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.members",
              "boxes": [
                {
                  "ref": "BCMDashboard.members.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الأعضاء حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/members | Service: brandCommunity.service | Events: bcm.members.filtered | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.members.table",
                  "name": "جدول الأعضاء",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الأعضاء مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/members | Service: brandCommunity.service | Events: bcm.members.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.members.detail",
                  "name": "تفاصيل الأعضاء",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/members | Service: brandCommunity.service | Events: bcm.members.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.members.editor",
                  "name": "نموذج إدارة الأعضاء",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الأعضاء حسب الصلاحية.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/members | Service: brandCommunity.service | Events: bcm.members.created, bcm.members.updated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.members.modal.detail",
                  "name": "نافذة تفاصيل الأعضاء",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الأعضاء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/members | Service: brandCommunity.service | Events: bcm.members.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate"
                },
                {
                  "ref": "BCMDashboard.members.modal.editor",
                  "name": "نافذة إدارة الأعضاء",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الأعضاء حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الأعضاء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/members | Service: brandCommunity.service | Events: bcm.members.created, bcm.members.updated | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "segments",
              "name": "الشرائح",
              "description": "تصنيف المجتمع إلى شرائح ثقافية وسلوكية وارتباطية.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/segments مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.segments",
              "boxes": [
                {
                  "ref": "BCMDashboard.segments.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الشرائح حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/segments | Service: brandCommunity.service | Events: bcm.segments.filtered | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.segments.table",
                  "name": "جدول الشرائح",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الشرائح مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/segments | Service: brandCommunity.service | Events: bcm.segments.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.segments.detail",
                  "name": "تفاصيل الشرائح",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/segments | Service: brandCommunity.service | Events: bcm.segments.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.segments.editor",
                  "name": "نموذج إدارة الشرائح",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الشرائح حسب الصلاحية.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/segments | Service: brandCommunity.service | Events: bcm.segments.created, bcm.segments.updated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.segments.modal.detail",
                  "name": "نافذة تفاصيل الشرائح",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الشرائح",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/segments | Service: brandCommunity.service | Events: bcm.segments.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate"
                },
                {
                  "ref": "BCMDashboard.segments.modal.editor",
                  "name": "نافذة إدارة الشرائح",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الشرائح حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الشرائح",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/segments | Service: brandCommunity.service | Events: bcm.segments.created, bcm.segments.updated | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "engagement",
              "name": "التفاعل",
              "description": "إدارة أنشطة التفاعل، المشاركة، النقاشات، ونقاط الاحتكاك.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/engagement مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.engagement",
              "boxes": [
                {
                  "ref": "BCMDashboard.engagement.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التفاعل حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/engagement | Service: brandCommunity.service | Events: bcm.engagement.filtered | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.engagement.workspace-list",
                  "name": "قائمة التفاعل",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر التفاعل ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/engagement | Service: brandCommunity.service | Events: bcm.engagement.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.engagement.detail",
                  "name": "تفاصيل التفاعل",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التفاعل.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/engagement | Service: brandCommunity.service | Events: bcm.engagement.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.engagement.actions",
                  "name": "إجراءات التفاعل",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التفاعل حسب نوعها.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/engagement | Service: brandCommunity.service | Events: bcm.engagement.created, bcm.engagement.updated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.engagement.modal.detail",
                  "name": "نافذة تفاصيل التفاعل",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التفاعل.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة التفاعل",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/engagement | Service: brandCommunity.service | Events: bcm.engagement.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate"
                },
                {
                  "ref": "BCMDashboard.engagement.modal.action",
                  "name": "نافذة إجراءات التفاعل",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التفاعل حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات التفاعل",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/engagement | Service: brandCommunity.service | Events: bcm.engagement.created, bcm.engagement.updated | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "loyalty",
              "name": "الولاء والانتماء",
              "description": "برامج الانتماء والولاء، المستويات، المكافآت، والامتيازات.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/loyalty مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.loyalty",
              "boxes": [
                {
                  "ref": "BCMDashboard.loyalty.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الولاء والانتماء حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/loyalty | Service: brandCommunity.service | Events: bcm.loyalty.filtered | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.loyalty.workspace-list",
                  "name": "قائمة الولاء والانتماء",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الولاء والانتماء ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/loyalty | Service: brandCommunity.service | Events: bcm.loyalty.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.loyalty.detail",
                  "name": "تفاصيل الولاء والانتماء",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الولاء والانتماء.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/loyalty | Service: brandCommunity.service | Events: bcm.loyalty.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.loyalty.actions",
                  "name": "إجراءات الولاء والانتماء",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الولاء والانتماء حسب نوعها.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/loyalty | Service: brandCommunity.service | Events: bcm.loyalty.created, bcm.loyalty.updated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.loyalty.modal.detail",
                  "name": "نافذة تفاصيل الولاء والانتماء",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الولاء والانتماء.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الولاء والانتماء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/loyalty | Service: brandCommunity.service | Events: bcm.loyalty.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate"
                },
                {
                  "ref": "BCMDashboard.loyalty.modal.action",
                  "name": "نافذة إجراءات الولاء والانتماء",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الولاء والانتماء حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الولاء والانتماء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/loyalty | Service: brandCommunity.service | Events: bcm.loyalty.created, bcm.loyalty.updated | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "content",
              "name": "المحتوى المجتمعي",
              "description": "تخطيط وإدارة المحتوى الحصري الخاص بالمجتمع.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/content مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.content",
              "boxes": [
                {
                  "ref": "BCMDashboard.content.search-filter",
                  "name": "بحث وتصفية",
                  "kind": "أداة",
                  "purpose": "يتيح البحث والتصفية حسب النوع والحالة والمالك والتاريخ.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/content | Service: brandCommunity.service | Events: bcm.content.searched | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.content.asset-list",
                  "name": "قائمة المحتوى المجتمعي",
                  "kind": "أداة",
                  "purpose": "يعرض العناصر في قائمة/جدول مع فتح التفاصيل أو الربط أو التنزيل.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/content | Service: brandCommunity.service | Events: bcm.content.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.content.asset-detail",
                  "name": "تفاصيل العنصر",
                  "kind": "عرض",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/content | Service: brandCommunity.service | Events: bcm.content.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.content.asset-actions",
                  "name": "إجراءات العنصر",
                  "kind": "أداة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/content | Service: brandCommunity.service | Events: bcm.content.created, bcm.content.linked | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.content.modal.detail",
                  "name": "نافذة تفاصيل المحتوى المجتمعي",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة المحتوى المجتمعي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/content | Service: brandCommunity.service | Events: bcm.content.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate"
                },
                {
                  "ref": "BCMDashboard.content.modal.action",
                  "name": "نافذة إجراءات المحتوى المجتمعي",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العنصر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/content | Service: brandCommunity.service | Events: bcm.content.created, bcm.content.linked | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "events",
              "name": "الفعاليات",
              "description": "إدارة اللقاءات والتجارب والفعاليات الحصرية لمجتمع العلامة.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/events مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.events",
              "boxes": [
                {
                  "ref": "BCMDashboard.events.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الفعاليات حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/events | Service: brandCommunity.service | Events: bcm.events.filtered | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.events.workspace-list",
                  "name": "قائمة الفعاليات",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الفعاليات ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/events | Service: brandCommunity.service | Events: bcm.events.opened | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.events.detail",
                  "name": "تفاصيل الفعاليات",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الفعاليات.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/events | Service: brandCommunity.service | Events: bcm.events.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.events.actions",
                  "name": "إجراءات الفعاليات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الفعاليات حسب نوعها.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/events | Service: brandCommunity.service | Events: bcm.events.created, bcm.events.updated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.events.modal.detail",
                  "name": "نافذة تفاصيل الفعاليات",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الفعاليات.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الفعاليات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/events | Service: brandCommunity.service | Events: bcm.events.detail.viewed | Permissions: bcm.read / bcm.write / bcm.moderate"
                },
                {
                  "ref": "BCMDashboard.events.modal.action",
                  "name": "نافذة إجراءات الفعاليات",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الفعاليات حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الفعاليات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/events | Service: brandCommunity.service | Events: bcm.events.created, bcm.events.updated | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير نمو المجتمع، التفاعل، الولاء، والفعاليات.",
              "backendScope": "نطاق باك اند حاكم: brandCommunity.service عبر /api/bcm/reports مع صلاحيات bcm.read / bcm.write / bcm.moderate",
              "ref": "BCMDashboard.reports",
              "boxes": [
                {
                  "ref": "BCMDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/reports | Service: brandCommunity.service | Events: bcm.metric.calculated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/reports | Service: brandCommunity.service | Events: bcm.analytics.viewed | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/reports | Service: brandCommunity.service | Events: bcm.report.opened, bcm.report.exported | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BCMDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/reports | Service: brandCommunity.service | Events: bcm.report.generated | Permissions: bcm.read / bcm.write / bcm.moderate",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BCMDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: CommunityMember, CommunitySegment, EngagementActivity, LoyaltyProgram | Endpoints: GET/POST/PATCH /api/bcm/reports | Service: brandCommunity.service | Events: bcm.report.generated | Permissions: bcm.read / bcm.write / bcm.moderate"
                }
              ]
            }
          ]
        },
        {
          "order": 8,
          "key": "training",
          "dashboard": "TrainingDashboard",
          "title": "إدارة التدريب والتطوير",
          "domain": "training",
          "service": "training.service",
          "permissions": "training.read / training.write / training.manage",
          "entities": "Course, LMSModule, TrainingSession, Certification, DevelopmentPath, TrainingReport",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص البرامج التدريبية، التقدم، الشهادات، والاحتياجات التطويرية.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/overview مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.overview",
              "boxes": [
                {
                  "ref": "TrainingDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة التدريب والتطوير دون تنفيذ مباشر.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/overview | Service: training.service | Events: training.overview.loaded | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession | Endpoints: GET/POST/PATCH /api/training/overview | Service: training.service | Events: training.risk.detected, training.alert.created | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: Course, LMSModule, TrainingSession | Endpoints: GET/POST/PATCH /api/training/overview | Service: training.service | Events: training.record.opened | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession | Endpoints: GET/POST/PATCH /api/training/overview | Service: training.service | Events: training.action.requested | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession | Endpoints: GET/POST/PATCH /api/training/overview | Service: training.service | Events: training.action.requested | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "courses",
              "name": "الدورات",
              "description": "إدارة الدورات والبرامج والمحتوى التدريبي.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/courses مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.courses",
              "boxes": [
                {
                  "ref": "TrainingDashboard.courses.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الدورات حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/courses | Service: training.service | Events: training.courses.filtered | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.courses.table",
                  "name": "جدول الدورات",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الدورات مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/courses | Service: training.service | Events: training.courses.opened | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.courses.detail",
                  "name": "تفاصيل الدورات",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/courses | Service: training.service | Events: training.courses.detail.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.courses.editor",
                  "name": "نموذج إدارة الدورات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الدورات حسب الصلاحية.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/courses | Service: training.service | Events: training.courses.created, training.courses.updated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.courses.modal.detail",
                  "name": "نافذة تفاصيل الدورات",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الدورات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/courses | Service: training.service | Events: training.courses.detail.viewed | Permissions: training.read / training.write / training.manage"
                },
                {
                  "ref": "TrainingDashboard.courses.modal.editor",
                  "name": "نافذة إدارة الدورات",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الدورات حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الدورات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/courses | Service: training.service | Events: training.courses.created, training.courses.updated | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "lms",
              "name": "نظام إدارة التعلم",
              "description": "إدارة وحدات التعلم والمحتوى والتتبع والإعدادات.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/lms مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.lms",
              "boxes": [
                {
                  "ref": "TrainingDashboard.lms.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق نظام إدارة التعلم حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/lms | Service: training.service | Events: training.lms.filtered | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.lms.table",
                  "name": "جدول نظام إدارة التعلم",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات نظام إدارة التعلم مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/lms | Service: training.service | Events: training.lms.opened | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.lms.detail",
                  "name": "تفاصيل نظام إدارة التعلم",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/lms | Service: training.service | Events: training.lms.detail.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.lms.editor",
                  "name": "نموذج إدارة نظام إدارة التعلم",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن نظام إدارة التعلم حسب الصلاحية.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/lms | Service: training.service | Events: training.lms.created, training.lms.updated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.lms.modal.detail",
                  "name": "نافذة تفاصيل نظام إدارة التعلم",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول نظام إدارة التعلم",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/lms | Service: training.service | Events: training.lms.detail.viewed | Permissions: training.read / training.write / training.manage"
                },
                {
                  "ref": "TrainingDashboard.lms.modal.editor",
                  "name": "نافذة إدارة نظام إدارة التعلم",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن نظام إدارة التعلم حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول نظام إدارة التعلم",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/lms | Service: training.service | Events: training.lms.created, training.lms.updated | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "scheduling",
              "name": "الجدولة",
              "description": "جدولة الجلسات والمدربين والحضور والمواعيد.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/scheduling مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.scheduling",
              "boxes": [
                {
                  "ref": "TrainingDashboard.scheduling.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الجدولة حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/scheduling | Service: training.service | Events: training.scheduling.filtered | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.scheduling.workspace-list",
                  "name": "قائمة الجدولة",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الجدولة ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/scheduling | Service: training.service | Events: training.scheduling.opened | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.scheduling.detail",
                  "name": "تفاصيل الجدولة",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الجدولة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/scheduling | Service: training.service | Events: training.scheduling.detail.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.scheduling.actions",
                  "name": "إجراءات الجدولة",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الجدولة حسب نوعها.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/scheduling | Service: training.service | Events: training.scheduling.created, training.scheduling.updated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.scheduling.modal.detail",
                  "name": "نافذة تفاصيل الجدولة",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الجدولة.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الجدولة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/scheduling | Service: training.service | Events: training.scheduling.detail.viewed | Permissions: training.read / training.write / training.manage"
                },
                {
                  "ref": "TrainingDashboard.scheduling.modal.action",
                  "name": "نافذة إجراءات الجدولة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الجدولة حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الجدولة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/scheduling | Service: training.service | Events: training.scheduling.created, training.scheduling.updated | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "certifications",
              "name": "الشهادات",
              "description": "إدارة الشهادات ومتطلبات الإصدار والتحقق.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/certifications مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.certifications",
              "boxes": [
                {
                  "ref": "TrainingDashboard.certifications.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الشهادات حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/certifications | Service: training.service | Events: training.certifications.filtered | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.certifications.table",
                  "name": "جدول الشهادات",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الشهادات مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/certifications | Service: training.service | Events: training.certifications.opened | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.certifications.detail",
                  "name": "تفاصيل الشهادات",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/certifications | Service: training.service | Events: training.certifications.detail.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.certifications.editor",
                  "name": "نموذج إدارة الشهادات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الشهادات حسب الصلاحية.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/certifications | Service: training.service | Events: training.certifications.created, training.certifications.updated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.certifications.modal.detail",
                  "name": "نافذة تفاصيل الشهادات",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الشهادات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/certifications | Service: training.service | Events: training.certifications.detail.viewed | Permissions: training.read / training.write / training.manage"
                },
                {
                  "ref": "TrainingDashboard.certifications.modal.editor",
                  "name": "نافذة إدارة الشهادات",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الشهادات حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الشهادات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/certifications | Service: training.service | Events: training.certifications.created, training.certifications.updated | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "analytics",
              "name": "التحليلات",
              "description": "تحليل أثر التدريب والتقدم والالتزام والمخرجات.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/analytics مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.analytics",
              "boxes": [
                {
                  "ref": "TrainingDashboard.analytics.kpi",
                  "name": "مؤشرات التحليلات",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/analytics | Service: training.service | Events: training.metric.calculated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01",
                    "DAV-CHT-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.analytics.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/analytics | Service: training.service | Events: training.analytics.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.analytics.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/analytics | Service: training.service | Events: training.report.opened, training.report.exported | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.analytics.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/analytics | Service: training.service | Events: training.report.generated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.analytics.modal.editor",
                  "name": "نافذة إدارة التحليلات",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/analytics | Service: training.service | Events: training.report.generated | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "development-paths",
              "name": "مسارات التطوير",
              "description": "تصميم ومتابعة مسارات تطوير الأفراد والفرق.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/development-paths مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.development-paths",
              "boxes": [
                {
                  "ref": "TrainingDashboard.development-paths.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق مسارات التطوير حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/development-paths | Service: training.service | Events: training.development-paths.filtered | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.development-paths.workspace-list",
                  "name": "قائمة مسارات التطوير",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر مسارات التطوير ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/development-paths | Service: training.service | Events: training.development-paths.opened | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.development-paths.detail",
                  "name": "تفاصيل مسارات التطوير",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل مسارات التطوير.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/development-paths | Service: training.service | Events: training.development-paths.detail.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.development-paths.actions",
                  "name": "إجراءات مسارات التطوير",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر مسارات التطوير حسب نوعها.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/development-paths | Service: training.service | Events: training.development-paths.created, training.development-paths.updated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.development-paths.modal.detail",
                  "name": "نافذة تفاصيل مسارات التطوير",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل مسارات التطوير.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة مسارات التطوير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/development-paths | Service: training.service | Events: training.development-paths.detail.viewed | Permissions: training.read / training.write / training.manage"
                },
                {
                  "ref": "TrainingDashboard.development-paths.modal.action",
                  "name": "نافذة إجراءات مسارات التطوير",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر مسارات التطوير حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات مسارات التطوير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/development-paths | Service: training.service | Events: training.development-paths.created, training.development-paths.updated | Permissions: training.read / training.write / training.manage"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير التدريب والتطوير والشهادات والأثر.",
              "backendScope": "نطاق باك اند حاكم: training.service عبر /api/training/reports مع صلاحيات training.read / training.write / training.manage",
              "ref": "TrainingDashboard.reports",
              "boxes": [
                {
                  "ref": "TrainingDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/reports | Service: training.service | Events: training.metric.calculated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/reports | Service: training.service | Events: training.analytics.viewed | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/reports | Service: training.service | Events: training.report.opened, training.report.exported | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "TrainingDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/reports | Service: training.service | Events: training.report.generated | Permissions: training.read / training.write / training.manage",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "TrainingDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: Course, LMSModule, TrainingSession, Certification | Endpoints: GET/POST/PATCH /api/training/reports | Service: training.service | Events: training.report.generated | Permissions: training.read / training.write / training.manage"
                }
              ]
            }
          ]
        },
        {
          "order": 9,
          "key": "partnerships",
          "dashboard": "InstitutionalPartnershipsDashboard",
          "title": "إدارة الشراكات المؤسسية",
          "domain": "partnerships",
          "service": "institutionalPartnerships.service",
          "permissions": "partnerships.read / partnerships.write / partnerships.approve",
          "entities": "PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan, PartnershipGovernance, PartnershipReport",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص الشراكات المؤسسية والفرص والاتفاقيات والتفعيل والمخاطر.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/overview مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.overview",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة الشراكات المؤسسية دون تنفيذ مباشر.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/overview | Service: institutionalPartnerships.service | Events: partnerships.overview.loaded | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement | Endpoints: GET/POST/PATCH /api/partnerships/overview | Service: institutionalPartnerships.service | Events: partnerships.risk.detected, partnerships.alert.created | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement | Endpoints: GET/POST/PATCH /api/partnerships/overview | Service: institutionalPartnerships.service | Events: partnerships.record.opened | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement | Endpoints: GET/POST/PATCH /api/partnerships/overview | Service: institutionalPartnerships.service | Events: partnerships.action.requested | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement | Endpoints: GET/POST/PATCH /api/partnerships/overview | Service: institutionalPartnerships.service | Events: partnerships.action.requested | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "partners",
              "name": "الشركاء",
              "description": "إدارة سجل الجهات الشريكة وملفاتها وتصنيفها وحالتها.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/partners مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.partners",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.partners.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الشركاء حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/partners | Service: institutionalPartnerships.service | Events: partnerships.partners.filtered | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.partners.table",
                  "name": "جدول الشركاء",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الشركاء مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/partners | Service: institutionalPartnerships.service | Events: partnerships.partners.opened | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.partners.detail",
                  "name": "تفاصيل الشركاء",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/partners | Service: institutionalPartnerships.service | Events: partnerships.partners.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.partners.editor",
                  "name": "نموذج إدارة الشركاء",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الشركاء حسب الصلاحية.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/partners | Service: institutionalPartnerships.service | Events: partnerships.partners.created, partnerships.partners.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.partners.modal.detail",
                  "name": "نافذة تفاصيل الشركاء",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الشركاء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/partners | Service: institutionalPartnerships.service | Events: partnerships.partners.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.partners.modal.editor",
                  "name": "نافذة إدارة الشركاء",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الشركاء حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الشركاء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/partners | Service: institutionalPartnerships.service | Events: partnerships.partners.created, partnerships.partners.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "opportunities",
              "name": "فرص الشراكة",
              "description": "إدارة فرص الشراكة وتقييمها ومراحلها وجدواها.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/opportunities مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.opportunities",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.opportunities.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق فرص الشراكة حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/opportunities | Service: institutionalPartnerships.service | Events: partnerships.opportunities.filtered | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.opportunities.table",
                  "name": "جدول فرص الشراكة",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات فرص الشراكة مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/opportunities | Service: institutionalPartnerships.service | Events: partnerships.opportunities.opened | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.opportunities.detail",
                  "name": "تفاصيل فرص الشراكة",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/opportunities | Service: institutionalPartnerships.service | Events: partnerships.opportunities.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.opportunities.editor",
                  "name": "نموذج إدارة فرص الشراكة",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن فرص الشراكة حسب الصلاحية.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/opportunities | Service: institutionalPartnerships.service | Events: partnerships.opportunities.created, partnerships.opportunities.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.opportunities.modal.detail",
                  "name": "نافذة تفاصيل فرص الشراكة",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول فرص الشراكة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/opportunities | Service: institutionalPartnerships.service | Events: partnerships.opportunities.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.opportunities.modal.editor",
                  "name": "نافذة إدارة فرص الشراكة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن فرص الشراكة حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول فرص الشراكة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/opportunities | Service: institutionalPartnerships.service | Events: partnerships.opportunities.created, partnerships.opportunities.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "agreements",
              "name": "الاتفاقيات",
              "description": "إدارة الاتفاقيات ومذكرات التفاهم والالتزامات والتجديد.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/agreements مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.agreements",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.agreements.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الاتفاقيات حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/agreements | Service: institutionalPartnerships.service | Events: partnerships.agreements.filtered | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.agreements.table",
                  "name": "جدول الاتفاقيات",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الاتفاقيات مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/agreements | Service: institutionalPartnerships.service | Events: partnerships.agreements.opened | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.agreements.detail",
                  "name": "تفاصيل الاتفاقيات",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/agreements | Service: institutionalPartnerships.service | Events: partnerships.agreements.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.agreements.editor",
                  "name": "نموذج إدارة الاتفاقيات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الاتفاقيات حسب الصلاحية.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/agreements | Service: institutionalPartnerships.service | Events: partnerships.agreements.created, partnerships.agreements.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.agreements.modal.detail",
                  "name": "نافذة تفاصيل الاتفاقيات",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الاتفاقيات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/agreements | Service: institutionalPartnerships.service | Events: partnerships.agreements.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.agreements.modal.editor",
                  "name": "نافذة إدارة الاتفاقيات",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الاتفاقيات حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الاتفاقيات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/agreements | Service: institutionalPartnerships.service | Events: partnerships.agreements.created, partnerships.agreements.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "activation",
              "name": "التفعيل",
              "description": "إدارة خطط التفعيل والأنشطة المشتركة والمخرجات المتفق عليها.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/activation مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.activation",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.activation.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التفعيل حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/activation | Service: institutionalPartnerships.service | Events: partnerships.activation.filtered | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.activation.workspace-list",
                  "name": "قائمة التفعيل",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر التفعيل ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/activation | Service: institutionalPartnerships.service | Events: partnerships.activation.opened | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.activation.detail",
                  "name": "تفاصيل التفعيل",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التفعيل.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/activation | Service: institutionalPartnerships.service | Events: partnerships.activation.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.activation.actions",
                  "name": "إجراءات التفعيل",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التفعيل حسب نوعها.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/activation | Service: institutionalPartnerships.service | Events: partnerships.activation.created, partnerships.activation.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.activation.modal.detail",
                  "name": "نافذة تفاصيل التفعيل",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التفعيل.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة التفعيل",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/activation | Service: institutionalPartnerships.service | Events: partnerships.activation.detail.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.activation.modal.action",
                  "name": "نافذة إجراءات التفعيل",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التفعيل حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات التفعيل",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/activation | Service: institutionalPartnerships.service | Events: partnerships.activation.created, partnerships.activation.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "governance",
              "name": "الحوكمة",
              "description": "حوكمة العلاقة، لجان المتابعة، المخاطر، والالتزامات.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/governance مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.governance",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.governance.policy-list",
                  "name": "قائمة السياسات",
                  "kind": "أداة",
                  "purpose": "يعرض إعدادات وسياسات الإدارة ويتيح تعديلها بحسب الصلاحية.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/governance | Service: institutionalPartnerships.service | Events: partnerships.policy.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.governance.configuration",
                  "name": "إعدادات التكوين",
                  "kind": "أداة",
                  "purpose": "يضبط القيم الحاكمة للتبويب مثل الحدود والقواعد والقوالب الافتراضية.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/governance | Service: institutionalPartnerships.service | Events: partnerships.configuration.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.governance.compliance-state",
                  "name": "حالة الالتزام",
                  "kind": "عرض",
                  "purpose": "يعرض توافق الإعدادات مع قواعد الحوكمة والامتثال.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/governance | Service: institutionalPartnerships.service | Events: partnerships.compliance.checked | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.governance.audit",
                  "name": "سجل التغييرات",
                  "kind": "عرض",
                  "purpose": "يعرض أثر التغييرات والاعتمادات على هذا النطاق.",
                  "backend": "Entities: AuditLog, PartnerOrganization, PartnershipOpportunity | Endpoints: GET/POST/PATCH /api/partnerships/governance | Service: institutionalPartnerships.service | Events: audit.recorded | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.governance.modal.editor",
                  "name": "نافذة إدارة الحوكمة",
                  "purpose": "يضبط القيم الحاكمة للتبويب مثل الحدود والقواعد والقوالب الافتراضية.",
                  "trigger": "زر إنشاء/تعديل من قائمة السياسات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/governance | Service: institutionalPartnerships.service | Events: partnerships.configuration.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.governance.modal.action",
                  "name": "نافذة إجراءات الحوكمة",
                  "purpose": "يعرض إعدادات وسياسات الإدارة ويتيح تعديلها بحسب الصلاحية.",
                  "trigger": "زر إجراء/حوكمة من قائمة السياسات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/governance | Service: institutionalPartnerships.service | Events: partnerships.policy.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب الاتفاقيات والعروض ونماذج التقييم.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/templates مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.templates",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.opened | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.previewed | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.created, partnerships.template.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.approved | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.previewed | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.created, partnerships.template.updated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/templates | Service: institutionalPartnerships.service | Events: partnerships.template.approved | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير الشراكات والفرص والتفعيل والعائد.",
              "backendScope": "نطاق باك اند حاكم: institutionalPartnerships.service عبر /api/partnerships/reports مع صلاحيات partnerships.read / partnerships.write / partnerships.approve",
              "ref": "InstitutionalPartnershipsDashboard.reports",
              "boxes": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/reports | Service: institutionalPartnerships.service | Events: partnerships.metric.calculated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/reports | Service: institutionalPartnerships.service | Events: partnerships.analytics.viewed | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/reports | Service: institutionalPartnerships.service | Events: partnerships.report.opened, partnerships.report.exported | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "InstitutionalPartnershipsDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/reports | Service: institutionalPartnerships.service | Events: partnerships.report.generated | Permissions: partnerships.read / partnerships.write / partnerships.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "InstitutionalPartnershipsDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: PartnerOrganization, PartnershipOpportunity, PartnershipAgreement, ActivationPlan | Endpoints: GET/POST/PATCH /api/partnerships/reports | Service: institutionalPartnerships.service | Events: partnerships.report.generated | Permissions: partnerships.read / partnerships.write / partnerships.approve"
                }
              ]
            }
          ]
        },
        {
          "order": 10,
          "key": "kmpa",
          "dashboard": "KMPADashboard",
          "title": "إدارة البحث العلمي والنشر",
          "domain": "kmpa",
          "service": "kmpa.service",
          "permissions": "kmpa.read / kmpa.write / kmpa.publish",
          "entities": "ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft, PeerReview, ResearchMetric",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص الأبحاث، النشر، المستودع، التأليف، والتحكيم العلمي.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/overview مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.overview",
              "boxes": [
                {
                  "ref": "KMPADashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة البحث العلمي والنشر دون تنفيذ مباشر.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/overview | Service: kmpa.service | Events: kmpa.overview.loaded | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset | Endpoints: GET/POST/PATCH /api/kmpa/overview | Service: kmpa.service | Events: kmpa.risk.detected, kmpa.alert.created | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset | Endpoints: GET/POST/PATCH /api/kmpa/overview | Service: kmpa.service | Events: kmpa.record.opened | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset | Endpoints: GET/POST/PATCH /api/kmpa/overview | Service: kmpa.service | Events: kmpa.action.requested | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset | Endpoints: GET/POST/PATCH /api/kmpa/overview | Service: kmpa.service | Events: kmpa.action.requested | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "research-pipeline",
              "name": "مسار الأبحاث",
              "description": "إدارة أفكار الأبحاث ومراحلها واعتمادها ومخرجاتها.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/research-pipeline مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.research-pipeline",
              "boxes": [
                {
                  "ref": "KMPADashboard.research-pipeline.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق مسار الأبحاث حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/research-pipeline | Service: kmpa.service | Events: kmpa.research-pipeline.filtered | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.research-pipeline.workspace-list",
                  "name": "قائمة مسار الأبحاث",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر مسار الأبحاث ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/research-pipeline | Service: kmpa.service | Events: kmpa.research-pipeline.opened | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.research-pipeline.detail",
                  "name": "تفاصيل مسار الأبحاث",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل مسار الأبحاث.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/research-pipeline | Service: kmpa.service | Events: kmpa.research-pipeline.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.research-pipeline.actions",
                  "name": "إجراءات مسار الأبحاث",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر مسار الأبحاث حسب نوعها.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/research-pipeline | Service: kmpa.service | Events: kmpa.research-pipeline.created, kmpa.research-pipeline.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.research-pipeline.modal.detail",
                  "name": "نافذة تفاصيل مسار الأبحاث",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل مسار الأبحاث.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة مسار الأبحاث",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/research-pipeline | Service: kmpa.service | Events: kmpa.research-pipeline.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                },
                {
                  "ref": "KMPADashboard.research-pipeline.modal.action",
                  "name": "نافذة إجراءات مسار الأبحاث",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر مسار الأبحاث حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات مسار الأبحاث",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/research-pipeline | Service: kmpa.service | Events: kmpa.research-pipeline.created, kmpa.research-pipeline.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "publications",
              "name": "النشر",
              "description": "إدارة المنشورات، قنوات النشر، الحالات، والروابط المرجعية.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/publications مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.publications",
              "boxes": [
                {
                  "ref": "KMPADashboard.publications.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق النشر حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/publications | Service: kmpa.service | Events: kmpa.publications.filtered | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.publications.table",
                  "name": "جدول النشر",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات النشر مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/publications | Service: kmpa.service | Events: kmpa.publications.opened | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.publications.detail",
                  "name": "تفاصيل النشر",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/publications | Service: kmpa.service | Events: kmpa.publications.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.publications.editor",
                  "name": "نموذج إدارة النشر",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن النشر حسب الصلاحية.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/publications | Service: kmpa.service | Events: kmpa.publications.created, kmpa.publications.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.publications.modal.detail",
                  "name": "نافذة تفاصيل النشر",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول النشر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/publications | Service: kmpa.service | Events: kmpa.publications.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                },
                {
                  "ref": "KMPADashboard.publications.modal.editor",
                  "name": "نافذة إدارة النشر",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن النشر حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول النشر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/publications | Service: kmpa.service | Events: kmpa.publications.created, kmpa.publications.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "repository",
              "name": "المستودع البحثي",
              "description": "حفظ وتنظيم الأصول البحثية والملفات والمراجع.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/repository مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.repository",
              "boxes": [
                {
                  "ref": "KMPADashboard.repository.search-filter",
                  "name": "بحث وتصفية",
                  "kind": "أداة",
                  "purpose": "يتيح البحث والتصفية حسب النوع والحالة والمالك والتاريخ.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/repository | Service: kmpa.service | Events: kmpa.repository.searched | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.repository.asset-list",
                  "name": "قائمة المستودع البحثي",
                  "kind": "أداة",
                  "purpose": "يعرض العناصر في قائمة/جدول مع فتح التفاصيل أو الربط أو التنزيل.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/repository | Service: kmpa.service | Events: kmpa.repository.opened | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.repository.asset-detail",
                  "name": "تفاصيل العنصر",
                  "kind": "عرض",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/repository | Service: kmpa.service | Events: kmpa.repository.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.repository.asset-actions",
                  "name": "إجراءات العنصر",
                  "kind": "أداة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/repository | Service: kmpa.service | Events: kmpa.repository.created, kmpa.repository.linked | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.repository.modal.detail",
                  "name": "نافذة تفاصيل المستودع البحثي",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة المستودع البحثي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/repository | Service: kmpa.service | Events: kmpa.repository.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                },
                {
                  "ref": "KMPADashboard.repository.modal.action",
                  "name": "نافذة إجراءات المستودع البحثي",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العنصر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/repository | Service: kmpa.service | Events: kmpa.repository.created, kmpa.repository.linked | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "authoring",
              "name": "التأليف",
              "description": "إدارة مسودات الكتابة والتعاون والمراجعة.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/authoring مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.authoring",
              "boxes": [
                {
                  "ref": "KMPADashboard.authoring.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التأليف حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/authoring | Service: kmpa.service | Events: kmpa.authoring.filtered | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.authoring.workspace-list",
                  "name": "قائمة التأليف",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر التأليف ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/authoring | Service: kmpa.service | Events: kmpa.authoring.opened | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.authoring.detail",
                  "name": "تفاصيل التأليف",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التأليف.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/authoring | Service: kmpa.service | Events: kmpa.authoring.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.authoring.actions",
                  "name": "إجراءات التأليف",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التأليف حسب نوعها.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/authoring | Service: kmpa.service | Events: kmpa.authoring.created, kmpa.authoring.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.authoring.modal.detail",
                  "name": "نافذة تفاصيل التأليف",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التأليف.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة التأليف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/authoring | Service: kmpa.service | Events: kmpa.authoring.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                },
                {
                  "ref": "KMPADashboard.authoring.modal.action",
                  "name": "نافذة إجراءات التأليف",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التأليف حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات التأليف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/authoring | Service: kmpa.service | Events: kmpa.authoring.created, kmpa.authoring.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "peer-review",
              "name": "التحكيم والمراجعة",
              "description": "متابعة المراجعات العلمية، الملاحظات، والاعتمادات.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/peer-review مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.peer-review",
              "boxes": [
                {
                  "ref": "KMPADashboard.peer-review.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التحكيم والمراجعة حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/peer-review | Service: kmpa.service | Events: kmpa.peer-review.filtered | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.peer-review.workspace-list",
                  "name": "قائمة التحكيم والمراجعة",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر التحكيم والمراجعة ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/peer-review | Service: kmpa.service | Events: kmpa.peer-review.opened | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.peer-review.detail",
                  "name": "تفاصيل التحكيم والمراجعة",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التحكيم والمراجعة.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/peer-review | Service: kmpa.service | Events: kmpa.peer-review.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.peer-review.actions",
                  "name": "إجراءات التحكيم والمراجعة",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التحكيم والمراجعة حسب نوعها.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/peer-review | Service: kmpa.service | Events: kmpa.peer-review.created, kmpa.peer-review.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.peer-review.modal.detail",
                  "name": "نافذة تفاصيل التحكيم والمراجعة",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التحكيم والمراجعة.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة التحكيم والمراجعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/peer-review | Service: kmpa.service | Events: kmpa.peer-review.detail.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                },
                {
                  "ref": "KMPADashboard.peer-review.modal.action",
                  "name": "نافذة إجراءات التحكيم والمراجعة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التحكيم والمراجعة حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات التحكيم والمراجعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/peer-review | Service: kmpa.service | Events: kmpa.peer-review.created, kmpa.peer-review.updated | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "analytics",
              "name": "التحليلات",
              "description": "تحليل إنتاجية البحث والنشر والاقتباس والأثر.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/analytics مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.analytics",
              "boxes": [
                {
                  "ref": "KMPADashboard.analytics.kpi",
                  "name": "مؤشرات التحليلات",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/analytics | Service: kmpa.service | Events: kmpa.metric.calculated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01",
                    "DAV-CHT-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.analytics.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/analytics | Service: kmpa.service | Events: kmpa.analytics.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.analytics.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/analytics | Service: kmpa.service | Events: kmpa.report.opened, kmpa.report.exported | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.analytics.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/analytics | Service: kmpa.service | Events: kmpa.report.generated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.analytics.modal.editor",
                  "name": "نافذة إدارة التحليلات",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/analytics | Service: kmpa.service | Events: kmpa.report.generated | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير البحث والنشر والمستودع والتحكيم.",
              "backendScope": "نطاق باك اند حاكم: kmpa.service عبر /api/kmpa/reports مع صلاحيات kmpa.read / kmpa.write / kmpa.publish",
              "ref": "KMPADashboard.reports",
              "boxes": [
                {
                  "ref": "KMPADashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/reports | Service: kmpa.service | Events: kmpa.metric.calculated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/reports | Service: kmpa.service | Events: kmpa.analytics.viewed | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/reports | Service: kmpa.service | Events: kmpa.report.opened, kmpa.report.exported | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KMPADashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/reports | Service: kmpa.service | Events: kmpa.report.generated | Permissions: kmpa.read / kmpa.write / kmpa.publish",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KMPADashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: ResearchProject, Publication, ResearchRepositoryAsset, AuthoringDraft | Endpoints: GET/POST/PATCH /api/kmpa/reports | Service: kmpa.service | Events: kmpa.report.generated | Permissions: kmpa.read / kmpa.write / kmpa.publish"
                }
              ]
            }
          ]
        },
        {
          "order": 11,
          "key": "knowledge",
          "dashboard": "KnowledgeBaseDashboard",
          "title": "إدارة قاعدة المعرفة",
          "domain": "knowledge",
          "service": "knowledgeBase.service",
          "permissions": "knowledge.read / knowledge.write / knowledge.govern",
          "entities": "KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink, KnowledgeVersion, KnowledgeGovernanceRule",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص الأصول المعرفية والفئات والروابط والإصدارات وحوكمة المعرفة.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/overview مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.overview",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة قاعدة المعرفة دون تنفيذ مباشر.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/overview | Service: knowledgeBase.service | Events: knowledge.overview.loaded | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode | Endpoints: GET/POST/PATCH /api/knowledge/overview | Service: knowledgeBase.service | Events: knowledge.risk.detected, knowledge.alert.created | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode | Endpoints: GET/POST/PATCH /api/knowledge/overview | Service: knowledgeBase.service | Events: knowledge.record.opened | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode | Endpoints: GET/POST/PATCH /api/knowledge/overview | Service: knowledgeBase.service | Events: knowledge.action.requested | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode | Endpoints: GET/POST/PATCH /api/knowledge/overview | Service: knowledgeBase.service | Events: knowledge.action.requested | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "assets",
              "name": "الأصول المعرفية",
              "description": "إدارة المقالات والأدلة والمواد المعرفية القابلة للاسترجاع.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/assets مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.assets",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.assets.search-filter",
                  "name": "بحث وتصفية",
                  "kind": "أداة",
                  "purpose": "يتيح البحث والتصفية حسب النوع والحالة والمالك والتاريخ.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/assets | Service: knowledgeBase.service | Events: knowledge.assets.searched | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.assets.asset-list",
                  "name": "قائمة الأصول المعرفية",
                  "kind": "أداة",
                  "purpose": "يعرض العناصر في قائمة/جدول مع فتح التفاصيل أو الربط أو التنزيل.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/assets | Service: knowledgeBase.service | Events: knowledge.assets.opened | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.assets.asset-detail",
                  "name": "تفاصيل العنصر",
                  "kind": "عرض",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/assets | Service: knowledgeBase.service | Events: knowledge.assets.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.assets.asset-actions",
                  "name": "إجراءات العنصر",
                  "kind": "أداة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/assets | Service: knowledgeBase.service | Events: knowledge.assets.created, knowledge.assets.linked | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.assets.modal.detail",
                  "name": "نافذة تفاصيل الأصول المعرفية",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الأصول المعرفية",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/assets | Service: knowledgeBase.service | Events: knowledge.assets.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                },
                {
                  "ref": "KnowledgeBaseDashboard.assets.modal.action",
                  "name": "نافذة إجراءات الأصول المعرفية",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العنصر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/assets | Service: knowledgeBase.service | Events: knowledge.assets.created, knowledge.assets.linked | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "categories",
              "name": "الفئات",
              "description": "تنظيم المعرفة في فئات ومجموعات قابلة للإدارة.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/categories مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.categories",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.categories.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الفئات حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/categories | Service: knowledgeBase.service | Events: knowledge.categories.filtered | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.categories.workspace-list",
                  "name": "قائمة الفئات",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الفئات ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/categories | Service: knowledgeBase.service | Events: knowledge.categories.opened | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.categories.detail",
                  "name": "تفاصيل الفئات",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الفئات.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/categories | Service: knowledgeBase.service | Events: knowledge.categories.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.categories.actions",
                  "name": "إجراءات الفئات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الفئات حسب نوعها.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/categories | Service: knowledgeBase.service | Events: knowledge.categories.created, knowledge.categories.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.categories.modal.detail",
                  "name": "نافذة تفاصيل الفئات",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الفئات.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الفئات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/categories | Service: knowledgeBase.service | Events: knowledge.categories.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                },
                {
                  "ref": "KnowledgeBaseDashboard.categories.modal.action",
                  "name": "نافذة إجراءات الفئات",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الفئات حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الفئات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/categories | Service: knowledgeBase.service | Events: knowledge.categories.created, knowledge.categories.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "taxonomy",
              "name": "التصنيف المعرفي",
              "description": "بناء وإدارة شجرة التصنيف والعلاقات الدلالية.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/taxonomy مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.taxonomy",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.taxonomy.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق التصنيف المعرفي حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/taxonomy | Service: knowledgeBase.service | Events: knowledge.taxonomy.filtered | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.taxonomy.workspace-list",
                  "name": "قائمة التصنيف المعرفي",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر التصنيف المعرفي ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/taxonomy | Service: knowledgeBase.service | Events: knowledge.taxonomy.opened | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.taxonomy.detail",
                  "name": "تفاصيل التصنيف المعرفي",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التصنيف المعرفي.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/taxonomy | Service: knowledgeBase.service | Events: knowledge.taxonomy.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.taxonomy.actions",
                  "name": "إجراءات التصنيف المعرفي",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التصنيف المعرفي حسب نوعها.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/taxonomy | Service: knowledgeBase.service | Events: knowledge.taxonomy.created, knowledge.taxonomy.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.taxonomy.modal.detail",
                  "name": "نافذة تفاصيل التصنيف المعرفي",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل التصنيف المعرفي.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة التصنيف المعرفي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/taxonomy | Service: knowledgeBase.service | Events: knowledge.taxonomy.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                },
                {
                  "ref": "KnowledgeBaseDashboard.taxonomy.modal.action",
                  "name": "نافذة إجراءات التصنيف المعرفي",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر التصنيف المعرفي حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات التصنيف المعرفي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/taxonomy | Service: knowledgeBase.service | Events: knowledge.taxonomy.created, knowledge.taxonomy.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "links",
              "name": "الروابط والعلاقات",
              "description": "إدارة العلاقات بين الأصول والمشاريع والمستندات والسياقات.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/links مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.links",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.links.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الروابط والعلاقات حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/links | Service: knowledgeBase.service | Events: knowledge.links.filtered | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.links.workspace-list",
                  "name": "قائمة الروابط والعلاقات",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الروابط والعلاقات ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/links | Service: knowledgeBase.service | Events: knowledge.links.opened | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.links.detail",
                  "name": "تفاصيل الروابط والعلاقات",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الروابط والعلاقات.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/links | Service: knowledgeBase.service | Events: knowledge.links.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.links.actions",
                  "name": "إجراءات الروابط والعلاقات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الروابط والعلاقات حسب نوعها.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/links | Service: knowledgeBase.service | Events: knowledge.links.created, knowledge.links.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.links.modal.detail",
                  "name": "نافذة تفاصيل الروابط والعلاقات",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الروابط والعلاقات.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الروابط والعلاقات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/links | Service: knowledgeBase.service | Events: knowledge.links.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                },
                {
                  "ref": "KnowledgeBaseDashboard.links.modal.action",
                  "name": "نافذة إجراءات الروابط والعلاقات",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الروابط والعلاقات حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الروابط والعلاقات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/links | Service: knowledgeBase.service | Events: knowledge.links.created, knowledge.links.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "versions",
              "name": "الإصدارات",
              "description": "إدارة نسخ الأصول المعرفية وسجل التعديلات.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/versions مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.versions",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.versions.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الإصدارات حسب الحالة والنوع والمالك والفترة.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/versions | Service: knowledgeBase.service | Events: knowledge.versions.filtered | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.versions.table",
                  "name": "جدول الإصدارات",
                  "kind": "أداة",
                  "purpose": "يعرض سجلات الإصدارات مع فتح التفاصيل وتحديد السجلات وإجراءات الصف.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/versions | Service: knowledgeBase.service | Events: knowledge.versions.opened | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.versions.detail",
                  "name": "تفاصيل الإصدارات",
                  "kind": "عرض",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/versions | Service: knowledgeBase.service | Events: knowledge.versions.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.versions.editor",
                  "name": "نموذج إدارة الإصدارات",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الإصدارات حسب الصلاحية.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/versions | Service: knowledgeBase.service | Events: knowledge.versions.created, knowledge.versions.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.versions.modal.detail",
                  "name": "نافذة تفاصيل الإصدارات",
                  "purpose": "يعرض تفاصيل السجل المحدد والارتباطات والحالة والتاريخ.",
                  "trigger": "زر عرض/فتح التفاصيل من جدول الإصدارات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/versions | Service: knowledgeBase.service | Events: knowledge.versions.detail.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                },
                {
                  "ref": "KnowledgeBaseDashboard.versions.modal.editor",
                  "name": "نافذة إدارة الإصدارات",
                  "purpose": "ينشئ أو يعدل أو يعتمد سجلًا ضمن الإصدارات حسب الصلاحية.",
                  "trigger": "زر إنشاء/تعديل من جدول الإصدارات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/versions | Service: knowledgeBase.service | Events: knowledge.versions.created, knowledge.versions.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "governance",
              "name": "حوكمة المعرفة",
              "description": "إدارة سياسات النشر، الاعتماد، الملكية، والجودة.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/governance مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.governance",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.governance.policy-list",
                  "name": "قائمة السياسات",
                  "kind": "أداة",
                  "purpose": "يعرض إعدادات وسياسات الإدارة ويتيح تعديلها بحسب الصلاحية.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/governance | Service: knowledgeBase.service | Events: knowledge.policy.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.governance.configuration",
                  "name": "إعدادات التكوين",
                  "kind": "أداة",
                  "purpose": "يضبط القيم الحاكمة للتبويب مثل الحدود والقواعد والقوالب الافتراضية.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/governance | Service: knowledgeBase.service | Events: knowledge.configuration.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.governance.compliance-state",
                  "name": "حالة الالتزام",
                  "kind": "عرض",
                  "purpose": "يعرض توافق الإعدادات مع قواعد الحوكمة والامتثال.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/governance | Service: knowledgeBase.service | Events: knowledge.compliance.checked | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.governance.audit",
                  "name": "سجل التغييرات",
                  "kind": "عرض",
                  "purpose": "يعرض أثر التغييرات والاعتمادات على هذا النطاق.",
                  "backend": "Entities: AuditLog, KnowledgeAsset, KnowledgeCategory | Endpoints: GET/POST/PATCH /api/knowledge/governance | Service: knowledgeBase.service | Events: audit.recorded | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.governance.modal.editor",
                  "name": "نافذة إدارة حوكمة المعرفة",
                  "purpose": "يضبط القيم الحاكمة للتبويب مثل الحدود والقواعد والقوالب الافتراضية.",
                  "trigger": "زر إنشاء/تعديل من قائمة السياسات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/governance | Service: knowledgeBase.service | Events: knowledge.configuration.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                },
                {
                  "ref": "KnowledgeBaseDashboard.governance.modal.action",
                  "name": "نافذة إجراءات حوكمة المعرفة",
                  "purpose": "يعرض إعدادات وسياسات الإدارة ويتيح تعديلها بحسب الصلاحية.",
                  "trigger": "زر إجراء/حوكمة من قائمة السياسات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/governance | Service: knowledgeBase.service | Events: knowledge.policy.updated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير المعرفة والاستخدام والجودة والارتباط.",
              "backendScope": "نطاق باك اند حاكم: knowledgeBase.service عبر /api/knowledge/reports مع صلاحيات knowledge.read / knowledge.write / knowledge.govern",
              "ref": "KnowledgeBaseDashboard.reports",
              "boxes": [
                {
                  "ref": "KnowledgeBaseDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/reports | Service: knowledgeBase.service | Events: knowledge.metric.calculated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/reports | Service: knowledgeBase.service | Events: knowledge.analytics.viewed | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/reports | Service: knowledgeBase.service | Events: knowledge.report.opened, knowledge.report.exported | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "KnowledgeBaseDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/reports | Service: knowledgeBase.service | Events: knowledge.report.generated | Permissions: knowledge.read / knowledge.write / knowledge.govern",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "KnowledgeBaseDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: KnowledgeAsset, KnowledgeCategory, TaxonomyNode, KnowledgeLink | Endpoints: GET/POST/PATCH /api/knowledge/reports | Service: knowledgeBase.service | Events: knowledge.report.generated | Permissions: knowledge.read / knowledge.write / knowledge.govern"
                }
              ]
            }
          ]
        },
        {
          "order": 12,
          "key": "brand",
          "dashboard": "BrandDashboard",
          "title": "إدارة العلامة والهوية الثقافية",
          "domain": "brand",
          "service": "brand.service",
          "permissions": "brand.read / brand.write / brand.approve",
          "entities": "BrandIdentity, BrandAsset, BrandContent, CulturalResearch, BrandEvent, BrandTemplate",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "ملخص هوية العلامة، الأصول، المحتوى، البحث الثقافي، والفعاليات.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/overview مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.overview",
              "boxes": [
                {
                  "ref": "BrandDashboard.overview.summary",
                  "name": "ملخص نظرة عامة",
                  "kind": "عرض",
                  "purpose": "يعرض الحالة المختصرة والمؤشرات العليا لإدارة إدارة العلامة والهوية الثقافية دون تنفيذ مباشر.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/overview | Service: brand.service | Events: brand.overview.loaded | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.overview.health",
                  "name": "صندوق الصحة والمخاطر",
                  "kind": "عرض",
                  "purpose": "يعرض الحالات الحرجة والتنبيهات والانحرافات التي تحتاج متابعة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent | Endpoints: GET/POST/PATCH /api/brand/overview | Service: brand.service | Events: brand.risk.detected, brand.alert.created | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-ALR-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.overview.recent",
                  "name": "أحدث العناصر",
                  "kind": "أداة",
                  "purpose": "يعرض أحدث السجلات مع فتح التفاصيل أو الانتقال إلى التبويب المختص.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent | Endpoints: GET/POST/PATCH /api/brand/overview | Service: brand.service | Events: brand.record.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.overview.quick-actions",
                  "name": "الإجراءات السريعة",
                  "kind": "أداة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent | Endpoints: GET/POST/PATCH /api/brand/overview | Service: brand.service | Events: brand.action.requested | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.overview.modal.action",
                  "name": "نافذة إجراءات نظرة عامة",
                  "purpose": "يوفر مداخل إنشاء أو اعتماد أو تصعيد بحسب صلاحيات الإدارة.",
                  "trigger": "زر إجراء/حوكمة من الإجراءات السريعة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent | Endpoints: GET/POST/PATCH /api/brand/overview | Service: brand.service | Events: brand.action.requested | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "identity",
              "name": "الهوية الثقافية",
              "description": "إدارة الرؤية، الرسالة، القيم، الشخصية الثقافية، واللغة اللفظية.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/identity مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.identity",
              "boxes": [
                {
                  "ref": "BrandDashboard.identity.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق الهوية الثقافية حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/identity | Service: brand.service | Events: brand.identity.filtered | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.identity.workspace-list",
                  "name": "قائمة الهوية الثقافية",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر الهوية الثقافية ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/identity | Service: brand.service | Events: brand.identity.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.identity.detail",
                  "name": "تفاصيل الهوية الثقافية",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الهوية الثقافية.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/identity | Service: brand.service | Events: brand.identity.detail.viewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.identity.actions",
                  "name": "إجراءات الهوية الثقافية",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الهوية الثقافية حسب نوعها.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/identity | Service: brand.service | Events: brand.identity.created, brand.identity.updated | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.identity.modal.detail",
                  "name": "نافذة تفاصيل الهوية الثقافية",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل الهوية الثقافية.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة الهوية الثقافية",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/identity | Service: brand.service | Events: brand.identity.detail.viewed | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.identity.modal.action",
                  "name": "نافذة إجراءات الهوية الثقافية",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر الهوية الثقافية حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات الهوية الثقافية",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/identity | Service: brand.service | Events: brand.identity.created, brand.identity.updated | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "assets",
              "name": "أصول العلامة",
              "description": "إدارة الملفات البصرية واللفظية والصوتية والمكانية المرتبطة بالعلامة.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/assets مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.assets",
              "boxes": [
                {
                  "ref": "BrandDashboard.assets.search-filter",
                  "name": "بحث وتصفية",
                  "kind": "أداة",
                  "purpose": "يتيح البحث والتصفية حسب النوع والحالة والمالك والتاريخ.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/assets | Service: brand.service | Events: brand.assets.searched | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.assets.asset-list",
                  "name": "قائمة أصول العلامة",
                  "kind": "أداة",
                  "purpose": "يعرض العناصر في قائمة/جدول مع فتح التفاصيل أو الربط أو التنزيل.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/assets | Service: brand.service | Events: brand.assets.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.assets.asset-detail",
                  "name": "تفاصيل العنصر",
                  "kind": "عرض",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/assets | Service: brand.service | Events: brand.assets.detail.viewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.assets.asset-actions",
                  "name": "إجراءات العنصر",
                  "kind": "أداة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/assets | Service: brand.service | Events: brand.assets.created, brand.assets.linked | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.assets.modal.detail",
                  "name": "نافذة تفاصيل أصول العلامة",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة أصول العلامة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/assets | Service: brand.service | Events: brand.assets.detail.viewed | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.assets.modal.action",
                  "name": "نافذة إجراءات أصول العلامة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العنصر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/assets | Service: brand.service | Events: brand.assets.created, brand.assets.linked | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "content",
              "name": "محتوى العلامة",
              "description": "إدارة محتوى العلامة ورسائلها وسرديتها وحالات النشر.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/content مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.content",
              "boxes": [
                {
                  "ref": "BrandDashboard.content.search-filter",
                  "name": "بحث وتصفية",
                  "kind": "أداة",
                  "purpose": "يتيح البحث والتصفية حسب النوع والحالة والمالك والتاريخ.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/content | Service: brand.service | Events: brand.content.searched | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.content.asset-list",
                  "name": "قائمة محتوى العلامة",
                  "kind": "أداة",
                  "purpose": "يعرض العناصر في قائمة/جدول مع فتح التفاصيل أو الربط أو التنزيل.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/content | Service: brand.service | Events: brand.content.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.content.asset-detail",
                  "name": "تفاصيل العنصر",
                  "kind": "عرض",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/content | Service: brand.service | Events: brand.content.detail.viewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.content.asset-actions",
                  "name": "إجراءات العنصر",
                  "kind": "أداة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/content | Service: brand.service | Events: brand.content.created, brand.content.linked | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.content.modal.detail",
                  "name": "نافذة تفاصيل محتوى العلامة",
                  "purpose": "يعرض بيانات العنصر والارتباطات والإصدارات دون تعديل مباشر.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة محتوى العلامة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/content | Service: brand.service | Events: brand.content.detail.viewed | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.content.modal.action",
                  "name": "نافذة إجراءات محتوى العلامة",
                  "purpose": "ينفذ إنشاء أو رفع أو ربط أو أرشفة أو حذف حسب نوع العنصر.",
                  "trigger": "زر إجراء/حوكمة من إجراءات العنصر",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/content | Service: brand.service | Events: brand.content.created, brand.content.linked | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "cultural-research",
              "name": "البحث الثقافي",
              "description": "إدارة أبحاث الجمهور والثقافة والسياق المحلي والمواءمة.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/cultural-research مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.cultural-research",
              "boxes": [
                {
                  "ref": "BrandDashboard.cultural-research.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق البحث الثقافي حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/cultural-research | Service: brand.service | Events: brand.cultural-research.filtered | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.cultural-research.workspace-list",
                  "name": "قائمة البحث الثقافي",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر البحث الثقافي ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/cultural-research | Service: brand.service | Events: brand.cultural-research.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.cultural-research.detail",
                  "name": "تفاصيل البحث الثقافي",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل البحث الثقافي.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/cultural-research | Service: brand.service | Events: brand.cultural-research.detail.viewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.cultural-research.actions",
                  "name": "إجراءات البحث الثقافي",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر البحث الثقافي حسب نوعها.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/cultural-research | Service: brand.service | Events: brand.cultural-research.created, brand.cultural-research.updated | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.cultural-research.modal.detail",
                  "name": "نافذة تفاصيل البحث الثقافي",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل البحث الثقافي.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة البحث الثقافي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/cultural-research | Service: brand.service | Events: brand.cultural-research.detail.viewed | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.cultural-research.modal.action",
                  "name": "نافذة إجراءات البحث الثقافي",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر البحث الثقافي حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات البحث الثقافي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/cultural-research | Service: brand.service | Events: brand.cultural-research.created, brand.cultural-research.updated | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "events",
              "name": "فعاليات وتجارب العلامة",
              "description": "إدارة التجارب والفعاليات والظهور الثقافي للعلامة.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/events مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.events",
              "boxes": [
                {
                  "ref": "BrandDashboard.events.filters",
                  "name": "بحث وفلاتر",
                  "kind": "أداة",
                  "purpose": "يضيق نطاق فعاليات وتجارب العلامة حسب الحالة والنوع والتاريخ والمالك.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/events | Service: brand.service | Events: brand.events.filtered | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.events.workspace-list",
                  "name": "قائمة فعاليات وتجارب العلامة",
                  "kind": "أداة",
                  "purpose": "يعرض عناصر فعاليات وتجارب العلامة ويفتح التفاصيل والإجراءات المناسبة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/events | Service: brand.service | Events: brand.events.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.events.detail",
                  "name": "تفاصيل فعاليات وتجارب العلامة",
                  "kind": "عرض",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل فعاليات وتجارب العلامة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/events | Service: brand.service | Events: brand.events.detail.viewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.events.actions",
                  "name": "إجراءات فعاليات وتجارب العلامة",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر فعاليات وتجارب العلامة حسب نوعها.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/events | Service: brand.service | Events: brand.events.created, brand.events.updated | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.events.modal.detail",
                  "name": "نافذة تفاصيل فعاليات وتجارب العلامة",
                  "purpose": "يعرض السياق الكامل للعنصر المحدد داخل فعاليات وتجارب العلامة.",
                  "trigger": "زر عرض/فتح التفاصيل من قائمة فعاليات وتجارب العلامة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/events | Service: brand.service | Events: brand.events.detail.viewed | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.events.modal.action",
                  "name": "نافذة إجراءات فعاليات وتجارب العلامة",
                  "purpose": "ينشئ أو يربط أو يحدث أو يعتمد عناصر فعاليات وتجارب العلامة حسب نوعها.",
                  "trigger": "زر إجراء/حوكمة من إجراءات فعاليات وتجارب العلامة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/events | Service: brand.service | Events: brand.events.created, brand.events.updated | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "قوالب الهوية والمحتوى والعروض والمواد المرجعية.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/templates مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.templates",
              "boxes": [
                {
                  "ref": "BrandDashboard.templates.library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "يعرض القوالب المتاحة ويتيح فتحها أو نسخها أو استخدامها.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.opened | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.templates.template-preview",
                  "name": "معاينة القالب",
                  "kind": "عرض",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.previewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.templates.template-editor",
                  "name": "محرر القالب",
                  "kind": "أداة",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.created, brand.template.updated | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.templates.template-governance",
                  "name": "حوكمة القوالب",
                  "kind": "أداة",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.approved | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.templates.modal.preview",
                  "name": "نافذة معاينة النماذج والقوالب",
                  "purpose": "يعرض وصف القالب وبنيته وآخر تحديثاته قبل التطبيق.",
                  "trigger": "زر معاينة/فتح من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "DAV-CHT-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.previewed | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.templates.modal.editor",
                  "name": "نافذة إدارة النماذج والقوالب",
                  "purpose": "ينشئ أو يعدل القالب وفق صلاحيات الإدارة.",
                  "trigger": "زر إنشاء/تعديل من مكتبة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.created, brand.template.updated | Permissions: brand.read / brand.write / brand.approve"
                },
                {
                  "ref": "BrandDashboard.templates.modal.action",
                  "name": "نافذة إجراءات النماذج والقوالب",
                  "purpose": "يضبط حالة القالب والاعتماد والملكية وإمكانية الاستخدام.",
                  "trigger": "زر إجراء/حوكمة من حوكمة القوالب",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/templates | Service: brand.service | Events: brand.template.approved | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "تقارير الهوية والأصول والمحتوى والبحث والأثر الثقافي.",
              "backendScope": "نطاق باك اند حاكم: brand.service عبر /api/brand/reports مع صلاحيات brand.read / brand.write / brand.approve",
              "ref": "BrandDashboard.reports",
              "boxes": [
                {
                  "ref": "BrandDashboard.reports.kpi",
                  "name": "مؤشرات التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض المقاييس الرقمية والاتجاهات الأساسية لهذا التبويب.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/reports | Service: brand.service | Events: brand.metric.calculated | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.reports.chart",
                  "name": "تحليل بياني",
                  "kind": "عرض",
                  "purpose": "يعرض رسومًا أو مقارنات تساعد على قراءة الأداء والانحرافات.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/reports | Service: brand.service | Events: brand.analytics.viewed | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.reports.report-list",
                  "name": "مكتبة التقارير",
                  "kind": "أداة",
                  "purpose": "يعرض التقارير المتاحة مع فتحها أو تنزيلها أو جدولة إصدارها.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/reports | Service: brand.service | Events: brand.report.opened, brand.report.exported | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                },
                {
                  "ref": "BrandDashboard.reports.generator",
                  "name": "مولد التقرير/التحليل",
                  "kind": "أداة",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/reports | Service: brand.service | Events: brand.report.generated | Permissions: brand.read / brand.write / brand.approve",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "FINAL_TARGET_APPROVED"
                }
              ],
              "popups": [
                {
                  "ref": "BrandDashboard.reports.modal.editor",
                  "name": "نافذة إدارة التقارير",
                  "purpose": "ينشئ تقريرًا أو تحليلًا جديدًا من نطاق وحقول قابلة للتحديد.",
                  "trigger": "زر إنشاء/تعديل من مكتبة التقارير",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "backend": "Entities: BrandIdentity, BrandAsset, BrandContent, CulturalResearch | Endpoints: GET/POST/PATCH /api/brand/reports | Service: brand.service | Events: brand.report.generated | Permissions: brand.read / brand.write / brand.approve"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "surface": "projects",
      "dashboards": [
        {
          "order": 1,
          "key": "projects",
          "dashboard": "ProjectManagementBoard",
          "title": "إدارة المشاريع",
          "domain": "projects",
          "service": "central projects + project UI",
          "permissions": "project.read / project.write / project.archive / task.manage",
          "entities": "Project, Task, Budget, Client, TeamMember, Attachment, Template, Report",
          "tabsCount": 8,
          "tabs": [
            {
              "code": "overview",
              "name": "نظرة عامة",
              "description": "التبويب الرئيسي لملخص المشروع وتقدمه والبطاقات الأساسية.",
              "backendScope": "ProjectManagementBoard local project state",
              "ref": "ProjectManagementBoard.overview",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.overview.project-summary",
                  "name": "ملخص المشروع",
                  "kind": "عرض",
                  "purpose": "يعرض اسم المشروع والوصف والمالك والحالة والإحصاءات الأساسية.",
                  "backend": "ProjectManagementBoard local project state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.overview.phase-progress",
                  "name": "شريط تقدم المراحل",
                  "kind": "عرض",
                  "purpose": "يعرض التقدم المرحلي للمشروع.",
                  "backend": "ProjectManagementBoard local project state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.overview.cards-grid",
                  "name": "شبكة بطاقات المشروع",
                  "kind": "أداة",
                  "purpose": "تعرض بطاقات الأداء والتقدم والمهام والميزانية الخاصة بالمشروع.",
                  "backend": "ProjectManagementBoard local project state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": [
                {
                  "ref": "ProjectManagementBoard.overview.dialog.project-edit",
                  "name": "نافذة تعديل المشروع",
                  "purpose": "تعديل بيانات المشروع الحالية عبر نموذج المشروع.",
                  "trigger": "خيار \"تعديل المشروع\" من قائمة الرأس",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "onProjectUpdated + AddProjectModal"
                },
                {
                  "ref": "ProjectManagementBoard.overview.dialog.project-delete",
                  "name": "نافذة تأكيد حذف المشروع",
                  "purpose": "تأكيد حذف المشروع الحالي.",
                  "trigger": "خيار \"حذف المشروع\" من قائمة الرأس",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "handleDeleteProject"
                },
                {
                  "ref": "ProjectManagementBoard.overview.dialog.project-archive",
                  "name": "نافذة تأكيد أرشفة المشروع",
                  "purpose": "تأكيد أرشفة المشروع الحالي.",
                  "trigger": "خيار \"أرشفة المشروع\" من قائمة الرأس",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "handleArchiveProject"
                }
              ]
            },
            {
              "code": "tasks",
              "name": "إدارة المهام",
              "description": "إدارة المهام بين عرض كانبان وعرض التفاصيل مع مساعد ذكي.",
              "backendScope": "useUnifiedTasks(project.id)",
              "ref": "ProjectManagementBoard.tasks",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.tasks.tasks-header",
                  "name": "رأس إدارة المهام",
                  "kind": "أداة",
                  "purpose": "يوفر التبديل بين لوحة كانبان وتفاصيل المهام.",
                  "backend": "useUnifiedTasks(project.id)",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.tasks.tasks-kpis",
                  "name": "مؤشرات المهام",
                  "kind": "عرض",
                  "purpose": "تعرض إجمالي المهام والمكتملة والمتأخرة ومعدل الإنجاز.",
                  "backend": "useUnifiedTasks(project.id)",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.tasks.tasks-workspace",
                  "name": "مساحة المهام",
                  "kind": "أداة",
                  "purpose": "تعرض لوحة كانبان أو تفاصيل المهام بحسب وضع العرض.",
                  "backend": "useUnifiedTasks(project.id)",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.tasks.ai-assistant",
                  "name": "مساعد المهام الذكي",
                  "kind": "أداة",
                  "purpose": "يوفر دعمًا ذكيًا في إدارة المهام والتحليل.",
                  "backend": "useUnifiedTasks(project.id)",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": [
                {
                  "ref": "ProjectManagementBoard.tasks.dialog.add-task",
                  "name": "نافذة إضافة/تعديل مهمة",
                  "purpose": "إضافة مهمة جديدة أو تعديل مهمة قائمة.",
                  "trigger": "زر إضافة مهمة أو تحرير مهمة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "AddTaskModal"
                },
                {
                  "ref": "ProjectManagementBoard.tasks.dialog.smart-task-generation",
                  "name": "نافذة التوليد الذكي للمهام",
                  "purpose": "توليد مهام ذكية للمشروع.",
                  "trigger": "زر التوليد الذكي داخل قائمة المهام",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "SmartTaskGenerationModal"
                },
                {
                  "ref": "ProjectManagementBoard.tasks.dialog.task-archive-confirm",
                  "name": "نافذة تأكيد أرشفة المهمة",
                  "purpose": "تأكيد أرشفة المهمة المحددة.",
                  "trigger": "إجراء أرشفة من لوحة تفاصيل المهمة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "TaskDetailsPanel archive"
                },
                {
                  "ref": "ProjectManagementBoard.tasks.dialog.task-delete-confirm",
                  "name": "نافذة تأكيد حذف المهمة",
                  "purpose": "تأكيد حذف المهمة المحددة.",
                  "trigger": "إجراء حذف من لوحة تفاصيل المهمة",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "DAV-DTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "TaskDetailsPanel delete"
                }
              ]
            },
            {
              "code": "finance",
              "name": "الإدارة المالية",
              "description": "الحالة المالية للمشروع والمصروفات والتدفق النقدي وأدوات الميزانية.",
              "backendScope": "Project finance local state",
              "ref": "ProjectManagementBoard.finance",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.finance.finance-status",
                  "name": "الحالة المالية",
                  "kind": "عرض",
                  "purpose": "تعرض حالة ميزانية المشروع بشكل عام.",
                  "backend": "Project finance local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.finance.finance-stats",
                  "name": "إحصائيات مالية",
                  "kind": "عرض",
                  "purpose": "تعرض المتبقي من الميزانية وإجمالي المصروفات والربح المتوقع.",
                  "backend": "Project finance local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.finance.expense-breakdown",
                  "name": "تفصيل المصروفات",
                  "kind": "عرض",
                  "purpose": "تعرض توزيع المصروفات حسب الفئة.",
                  "backend": "Project finance local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.finance.cashflow",
                  "name": "التدفق النقدي المتوقع",
                  "kind": "عرض",
                  "purpose": "يعرض التدفقات النقدية القادمة وخيارات التصدير.",
                  "backend": "Project finance local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.finance.budget-tools",
                  "name": "أدوات إدارة الميزانية",
                  "kind": "أداة",
                  "purpose": "توفر إضافة مصروف وطلب موافقة وتحليل الانحرافات.",
                  "backend": "Project finance local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": [
                {
                  "ref": "ProjectManagementBoard.finance.dialog.expense",
                  "name": "نافذة إضافة مصروف",
                  "purpose": "إضافة مصروف جديد إلى ميزانية المشروع.",
                  "trigger": "زر \"إضافة مصروف\"",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "ExpenseModal"
                },
                {
                  "ref": "ProjectManagementBoard.finance.dialog.approval-request",
                  "name": "نافذة طلب موافقة مالية",
                  "purpose": "تقديم طلب موافقة على تعديل ميزانية المشروع.",
                  "trigger": "زر \"طلب موافقة\"",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "ApprovalRequestModal"
                },
                {
                  "ref": "ProjectManagementBoard.finance.dialog.financial-analysis",
                  "name": "نافذة تحليل الانحرافات المالية",
                  "purpose": "عرض تحليل الانحرافات والقراءة المالية المتقدمة.",
                  "trigger": "زر \"عرض التحليل\"",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "FinancialAnalysisModal"
                }
              ]
            },
            {
              "code": "team",
              "name": "إدارة الفريق",
              "description": "إدارة أعضاء الفريق وتوزيع المهام والتقييم والأداء.",
              "backendScope": "Local team member state",
              "ref": "ProjectManagementBoard.team",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.team.team-health",
                  "name": "ملخص الفريق",
                  "kind": "عرض",
                  "purpose": "يعرض حالة الفريق وتوزيع الإنتاجية والتوافر.",
                  "backend": "Local team member state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.team.team-roster",
                  "name": "قائمة أعضاء الفريق",
                  "kind": "أداة",
                  "purpose": "تعرض أعضاء الفريق وبياناتهم التشغيلية.",
                  "backend": "Local team member state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.team.team-actions",
                  "name": "أدوات إدارة الفريق",
                  "kind": "أداة",
                  "purpose": "توفر إضافة عضو وتوزيع المهام والتقييم والإجراءات الإدارية.",
                  "backend": "Local team member state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": [
                {
                  "ref": "ProjectManagementBoard.team.dialog.add-member",
                  "name": "نافذة إضافة عضو للفريق",
                  "purpose": "إضافة عضو جديد إلى فريق المشروع.",
                  "trigger": "زر إضافة عضو",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "AddTeamMemberModal"
                },
                {
                  "ref": "ProjectManagementBoard.team.dialog.task-assignment",
                  "name": "نافذة إسناد مهمة",
                  "purpose": "إسناد المهام لأعضاء الفريق.",
                  "trigger": "زر إسناد المهام",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "TaskAssignmentModal"
                },
                {
                  "ref": "ProjectManagementBoard.team.dialog.task-redistribution",
                  "name": "نافذة إعادة توزيع المهام",
                  "purpose": "إعادة توزيع المهام بين أعضاء الفريق.",
                  "trigger": "زر إعادة توزيع المهام",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "TaskRedistributionModal"
                },
                {
                  "ref": "ProjectManagementBoard.team.dialog.manual-distribution",
                  "name": "نافذة التوزيع اليدوي للمهام",
                  "purpose": "توزيع يدوي تفصيلي للمهام.",
                  "trigger": "زر التوزيع اليدوي",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "ManualTaskDistributionModal"
                },
                {
                  "ref": "ProjectManagementBoard.team.dialog.performance-evaluation",
                  "name": "نافذة تقييم الأداء",
                  "purpose": "تقييم أداء عضو أو مجموعة من الفريق.",
                  "trigger": "زر تقييم الأداء",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "PerformanceEvaluationModal"
                }
              ]
            },
            {
              "code": "client",
              "name": "العميل",
              "description": "عرض رضا العميل وإحصاءاته وملفه التعريفي.",
              "backendScope": "Client mock/local data",
              "ref": "ProjectManagementBoard.client",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.client.client-status",
                  "name": "حالة رضا العميل",
                  "kind": "عرض",
                  "purpose": "تعرض الرضا العام عن مسار المشروع.",
                  "backend": "Client mock/local data",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.client.client-stats",
                  "name": "إحصائيات العميل",
                  "kind": "عرض",
                  "purpose": "تعرض تقييم العميل وعدد المشاريع السابقة ومعدل الاستجابة.",
                  "backend": "Client mock/local data",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.client.client-profile",
                  "name": "ملف العميل",
                  "kind": "عرض",
                  "purpose": "يعرض الملف التعريفي وتفاصيل العميل.",
                  "backend": "Client mock/local data",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "files",
              "name": "إدارة المرفقات",
              "description": "إدارة وثائق المشروع والمجلدات والصلاحيات.",
              "backendScope": "projectFiles data + attachments UI",
              "ref": "ProjectManagementBoard.files",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.files.files-summary",
                  "name": "ملخص المرفقات",
                  "kind": "عرض",
                  "purpose": "يعرض حالة الملفات والمجلدات المرتبطة بالمشروع.",
                  "backend": "projectFiles data + attachments UI",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.files.files-grid",
                  "name": "شبكة المستندات",
                  "kind": "أداة",
                  "purpose": "تعرض ملفات المشروع ووثائقه.",
                  "backend": "projectFiles data + attachments UI",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.files.files-actions",
                  "name": "أدوات إدارة المرفقات",
                  "kind": "أداة",
                  "purpose": "توفر الرفع والتنظيم والصلاحيات على الملفات.",
                  "backend": "projectFiles data + attachments UI",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": [
                {
                  "ref": "ProjectManagementBoard.files.dialog.file-upload",
                  "name": "نافذة رفع ملف",
                  "purpose": "رفع ملف جديد إلى مرفقات المشروع.",
                  "trigger": "زر رفع ملف",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "custom FileUploadModal"
                },
                {
                  "ref": "ProjectManagementBoard.files.dialog.folder-organization",
                  "name": "نافذة تنظيم المجلدات",
                  "purpose": "تنظيم الملفات داخل مجلدات وهيكل أرشفة.",
                  "trigger": "زر تنظيم المجلدات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "FolderOrganizationModal"
                },
                {
                  "ref": "ProjectManagementBoard.files.dialog.permissions",
                  "name": "نافذة صلاحيات الملفات",
                  "purpose": "ضبط صلاحيات الوصول على الملفات والمجلدات.",
                  "trigger": "زر الصلاحيات",
                  "componentRefs": [
                    "MDL-WND-01",
                    "MDL-HDR-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02"
                  ],
                  "backend": "PermissionsModal"
                }
              ]
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "إدارة النماذج والقوالب الخاصة بالمشروع.",
              "backendScope": "TemplateLibrary local props",
              "ref": "ProjectManagementBoard.templates",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.templates.templates-status",
                  "name": "حالة القوالب",
                  "kind": "عرض",
                  "purpose": "تعرض ملخص استخدام القوالب وحالتها.",
                  "backend": "TemplateLibrary local props",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.templates.templates-library",
                  "name": "مكتبة القوالب",
                  "kind": "أداة",
                  "purpose": "تعرض القوالب المتاحة للمشروع.",
                  "backend": "TemplateLibrary local props",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.templates.templates-actions",
                  "name": "أدوات القوالب",
                  "kind": "أداة",
                  "purpose": "توفر إجراءات تشغيل القوالب واستخدامها.",
                  "backend": "TemplateLibrary local props",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "reports",
              "name": "التقارير",
              "description": "مركز تقارير المشروع مع الإحصاءات والأنواع والقوائم والتقارير الآلية.",
              "backendScope": "ReportsTab local state",
              "ref": "ProjectManagementBoard.reports",
              "boxes": [
                {
                  "ref": "ProjectManagementBoard.reports.reports-header",
                  "name": "رأس مركز التقارير",
                  "kind": "عرض",
                  "purpose": "يعرض حالة تحديث التقارير ووصف المركز.",
                  "backend": "ReportsTab local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.reports.reports-stats",
                  "name": "إحصائيات التقارير",
                  "kind": "عرض",
                  "purpose": "تعرض عدد التقارير ومتوسط التوليد ومرات التصدير.",
                  "backend": "ReportsTab local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.reports.report-types",
                  "name": "أنواع التقارير",
                  "kind": "عرض",
                  "purpose": "تعرض فئات التقارير المتاحة وأعدادها.",
                  "backend": "ReportsTab local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.reports.reports-list",
                  "name": "قائمة التقارير",
                  "kind": "أداة",
                  "purpose": "تعرض التقارير المتاحة مع العرض والتنزيل والإنشاء.",
                  "backend": "ReportsTab local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ProjectManagementBoard.reports.auto-reports",
                  "name": "التقارير الآلية والتصدير",
                  "kind": "أداة",
                  "purpose": "توفر التقارير الدورية وأوامر التصدير السريع.",
                  "backend": "ReportsTab local state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            }
          ]
        }
      ]
    },
    {
      "surface": "archive",
      "dashboards": [
        {
          "order": 1,
          "key": "archive",
          "dashboard": "ArchiveWorkspace",
          "title": "الأرشيف",
          "domain": "archive",
          "service": "archive ui + central projects for archived list",
          "permissions": "archive.read / archive.export",
          "entities": "ArchiveDocument, ArchivedProject, HRRecord, FinancialRecord, LegalRecord, OrganizationalRecord, KnowledgeAsset, TemplateAsset, PolicyRecord",
          "tabsCount": 9,
          "tabs": [
            {
              "code": "documents",
              "name": "الوثائق والمستندات",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة الوثائق والمستندات.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.documents",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.documents.header-actions",
                  "name": "رأس الوثائق والمستندات",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة الوثائق والمستندات وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.documents.search",
                  "name": "بحث الوثائق والمستندات",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة الوثائق والمستندات.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.documents.records-list",
                  "name": "قائمة الوثائق والمستندات",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ الوثائق والمستندات.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "projects",
              "name": "المشاريع المكتملة",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة المشاريع المكتملة.",
              "backendScope": "Central projects query",
              "ref": "ArchiveWorkspace.projects",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.projects.header-actions",
                  "name": "رأس المشاريع المكتملة",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة المشاريع المكتملة وأزرار التصدير أو التصفية.",
                  "backend": "Central projects query",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.projects.search",
                  "name": "بحث المشاريع المكتملة",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة المشاريع المكتملة.",
                  "backend": "Central projects query",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.projects.records-list",
                  "name": "قائمة المشاريع المكتملة",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ المشاريع المكتملة.",
                  "backend": "Central projects query",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "hr",
              "name": "أرشيف الموارد البشرية",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة أرشيف الموارد البشرية.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.hr",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.hr.header-actions",
                  "name": "رأس أرشيف الموارد البشرية",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة أرشيف الموارد البشرية وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.hr.search",
                  "name": "بحث أرشيف الموارد البشرية",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة أرشيف الموارد البشرية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.hr.records-list",
                  "name": "قائمة أرشيف الموارد البشرية",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ أرشيف الموارد البشرية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "financial",
              "name": "السجلات المالية",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة السجلات المالية.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.financial",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.financial.header-actions",
                  "name": "رأس السجلات المالية",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة السجلات المالية وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.financial.search",
                  "name": "بحث السجلات المالية",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة السجلات المالية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.financial.records-list",
                  "name": "قائمة السجلات المالية",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ السجلات المالية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "legal",
              "name": "الوثائق القانونية",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة الوثائق القانونية.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.legal",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.legal.header-actions",
                  "name": "رأس الوثائق القانونية",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة الوثائق القانونية وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.legal.search",
                  "name": "بحث الوثائق القانونية",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة الوثائق القانونية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.legal.records-list",
                  "name": "قائمة الوثائق القانونية",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ الوثائق القانونية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "organizational",
              "name": "الهيكل التنظيمي",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة الهيكل التنظيمي.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.organizational",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.organizational.header-actions",
                  "name": "رأس الهيكل التنظيمي",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة الهيكل التنظيمي وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.organizational.search",
                  "name": "بحث الهيكل التنظيمي",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة الهيكل التنظيمي.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.organizational.records-list",
                  "name": "قائمة الهيكل التنظيمي",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ الهيكل التنظيمي.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "knowledge",
              "name": "قاعدة المعرفة",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة قاعدة المعرفة.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.knowledge",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.knowledge.header-actions",
                  "name": "رأس قاعدة المعرفة",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة قاعدة المعرفة وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.knowledge.search",
                  "name": "بحث قاعدة المعرفة",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة قاعدة المعرفة.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.knowledge.records-list",
                  "name": "قائمة قاعدة المعرفة",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ قاعدة المعرفة.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "templates",
              "name": "النماذج والقوالب",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة النماذج والقوالب.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.templates",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.templates.header-actions",
                  "name": "رأس النماذج والقوالب",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة النماذج والقوالب وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.templates.search",
                  "name": "بحث النماذج والقوالب",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة النماذج والقوالب.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.templates.records-list",
                  "name": "قائمة النماذج والقوالب",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ النماذج والقوالب.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "policies",
              "name": "السياسات والإجراءات",
              "description": "تصنيف أرشيفي فعلي ظاهر في ArchiveSidebar ويحمل لوحة محتوى مخصصة لفئة السياسات والإجراءات.",
              "backendScope": "Local/mock archive panel state",
              "ref": "ArchiveWorkspace.policies",
              "boxes": [
                {
                  "ref": "ArchiveWorkspace.policies.header-actions",
                  "name": "رأس السياسات والإجراءات",
                  "kind": "أداة",
                  "purpose": "يعرض عنوان فئة السياسات والإجراءات وأزرار التصدير أو التصفية.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.policies.search",
                  "name": "بحث السياسات والإجراءات",
                  "kind": "أداة",
                  "purpose": "يوفر البحث داخل فئة السياسات والإجراءات.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-MNU-01",
                    "ACT-STS-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "ArchiveWorkspace.policies.records-list",
                  "name": "قائمة السياسات والإجراءات",
                  "kind": "أداة",
                  "purpose": "تعرض السجلات أو العناصر المؤرشفة الخاصة بـ السياسات والإجراءات.",
                  "backend": "Local/mock archive panel state",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01",
                    "ACT-BTN-02",
                    "ACT-STS-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            }
          ]
        }
      ]
    },
    {
      "surface": "settings",
      "dashboards": [
        {
          "order": 1,
          "key": "settings",
          "dashboard": "SettingsWorkspace",
          "title": "الإعدادات",
          "domain": "settings",
          "service": "settings panels + central features",
          "permissions": "settings.read / settings.write / owner-only where applicable",
          "entities": "AccountProfile, SecurityPolicy, NotificationPreference, Integration, AIExperiment, ThemePreference, DataGovernanceRule, UserRole, AuditEvent, EngineJob, Dependency, Tool",
          "tabsCount": 13,
          "tabs": [
            {
              "code": "account",
              "name": "الحساب الشخصي",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم الحساب الشخصي.",
              "backendScope": "CustomEvent settings.updated for account",
              "ref": "SettingsWorkspace.account",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.account.disclaimer",
                  "name": "تنبيه أمني/تشغيلي",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ تنبيه أمني/تشغيلي داخل إعدادات الحساب.",
                  "backend": "CustomEvent settings.updated for account",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.account.profile-form",
                  "name": "نموذج البيانات الشخصية",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ نموذج البيانات الشخصية داخل إعدادات الحساب.",
                  "backend": "CustomEvent settings.updated for account",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.account.password-controls",
                  "name": "ضبط كلمة المرور والاعتماد",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ ضبط كلمة المرور والاعتماد داخل إعدادات الحساب.",
                  "backend": "CustomEvent settings.updated for account",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01",
                    "ACT-STS-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.account.account-stats",
                  "name": "إحصاءات الحساب",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إحصاءات الحساب داخل إعدادات الحساب.",
                  "backend": "CustomEvent settings.updated for account",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "security",
              "name": "الخصوصية والأمان",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم الخصوصية والأمان.",
              "backendScope": "CustomEvent settings.updated for security",
              "ref": "SettingsWorkspace.security",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.security.disclaimer",
                  "name": "تنبيه أمني/تشغيلي",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ تنبيه أمني/تشغيلي داخل الخصوصية والأمان.",
                  "backend": "CustomEvent settings.updated for security",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.security.status-card",
                  "name": "بطاقة الحالة",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ بطاقة الحالة داخل الخصوصية والأمان.",
                  "backend": "CustomEvent settings.updated for security",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.security.security-alerts",
                  "name": "تنبيهات الأمان الذكية",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ تنبيهات الأمان الذكية داخل الخصوصية والأمان.",
                  "backend": "CustomEvent settings.updated for security",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.security.mfa-api-keys",
                  "name": "MFA ومفاتيح API",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ MFA ومفاتيح API داخل الخصوصية والأمان.",
                  "backend": "CustomEvent settings.updated for security",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.security.devices-sessions",
                  "name": "الأجهزة والجلسات",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ الأجهزة والجلسات داخل الخصوصية والأمان.",
                  "backend": "CustomEvent settings.updated for security",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "notifications",
              "name": "الإشعارات",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم الإشعارات.",
              "backendScope": "CustomEvent settings.updated for notifications",
              "ref": "SettingsWorkspace.notifications",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.notifications.smart-notify",
                  "name": "الإشعارات الذكية",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ الإشعارات الذكية داخل الإشعارات والتنبيهات.",
                  "backend": "CustomEvent settings.updated for notifications",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.notifications.channel-preferences",
                  "name": "تفضيلات القنوات",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ تفضيلات القنوات داخل الإشعارات والتنبيهات.",
                  "backend": "CustomEvent settings.updated for notifications",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.notifications.schedule-settings",
                  "name": "الجدولة والساعات الهادئة",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ الجدولة والساعات الهادئة داخل الإشعارات والتنبيهات.",
                  "backend": "CustomEvent settings.updated for notifications",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.notifications.history",
                  "name": "سجل الإشعارات",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ سجل الإشعارات داخل الإشعارات والتنبيهات.",
                  "backend": "CustomEvent settings.updated for notifications",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-TML-01",
                    "DAV-TAG-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "integrations",
              "name": "التكاملات الخارجية",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم التكاملات الخارجية.",
              "backendScope": "CustomEvent settings.updated for integrations",
              "ref": "SettingsWorkspace.integrations",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.integrations.status-card",
                  "name": "بطاقة الحالة",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ بطاقة الحالة داخل التكاملات والربط.",
                  "backend": "CustomEvent settings.updated for integrations",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.integrations.integrations-list",
                  "name": "قائمة التكاملات",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ قائمة التكاملات داخل التكاملات والربط.",
                  "backend": "CustomEvent settings.updated for integrations",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.integrations.api-settings",
                  "name": "إعدادات API",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إعدادات API داخل التكاملات والربط.",
                  "backend": "CustomEvent settings.updated for integrations",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.integrations.webhooks-ai",
                  "name": "الويبهوكس والأتمتة الذكية",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ الويبهوكس والأتمتة الذكية داخل التكاملات والربط.",
                  "backend": "CustomEvent settings.updated for integrations",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "ai",
              "name": "الذكاء الاصطناعي",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم الذكاء الاصطناعي.",
              "backendScope": "CustomEvent settings.updated for ai",
              "ref": "SettingsWorkspace.ai",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.ai.active-experiments",
                  "name": "التجارب النشطة",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ التجارب النشطة داخل الذكاء الاصطناعي.",
                  "backend": "CustomEvent settings.updated for ai",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.ai.models",
                  "name": "إعدادات النماذج",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إعدادات النماذج داخل الذكاء الاصطناعي.",
                  "backend": "CustomEvent settings.updated for ai",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-TXT-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "IPF-TXA-01",
                    "ACT-BTN-01",
                    "ACT-BTN-02",
                    "ACT-STS-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.ai.training",
                  "name": "التدريب والجدولة",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ التدريب والجدولة داخل الذكاء الاصطناعي.",
                  "backend": "CustomEvent settings.updated for ai",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.ai.performance",
                  "name": "الأداء والتشغيل",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ الأداء والتشغيل داخل الذكاء الاصطناعي.",
                  "backend": "CustomEvent settings.updated for ai",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-CHT-01",
                    "DAV-TAG-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "theme",
              "name": "المظهر",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم المظهر.",
              "backendScope": "CustomEvent settings.updated for theme",
              "ref": "SettingsWorkspace.theme",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.theme.theme-mode",
                  "name": "وضع المظهر",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ وضع المظهر داخل إعدادات المظهر.",
                  "backend": "CustomEvent settings.updated for theme",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.theme.color-schemes",
                  "name": "أنظمة الألوان",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ أنظمة الألوان داخل إعدادات المظهر.",
                  "backend": "CustomEvent settings.updated for theme",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.theme.accessibility",
                  "name": "إمكانية الوصول",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إمكانية الوصول داخل إعدادات المظهر.",
                  "backend": "CustomEvent settings.updated for theme",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.theme.ai-personalization",
                  "name": "التخصيص الذكي",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ التخصيص الذكي داخل إعدادات المظهر.",
                  "backend": "CustomEvent settings.updated for theme",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "data-governance",
              "name": "إدارة البيانات",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم إدارة البيانات.",
              "backendScope": "CustomEvent settings.updated for data-governance",
              "ref": "SettingsWorkspace.data-governance",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.data-governance.status-card",
                  "name": "بطاقة الحالة",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ بطاقة الحالة داخل حوكمة البيانات.",
                  "backend": "CustomEvent settings.updated for data-governance",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.data-governance.ai-compliance",
                  "name": "مراقب الامتثال الذكي",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ مراقب الامتثال الذكي داخل حوكمة البيانات.",
                  "backend": "CustomEvent settings.updated for data-governance",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.data-governance.retention",
                  "name": "سياسات الاستبقاء",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ سياسات الاستبقاء داخل حوكمة البيانات.",
                  "backend": "CustomEvent settings.updated for data-governance",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.data-governance.backup-compliance",
                  "name": "النسخ الاحتياطي والامتثال",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ النسخ الاحتياطي والامتثال داخل حوكمة البيانات.",
                  "backend": "CustomEvent settings.updated for data-governance",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "users-roles",
              "name": "المستخدمون والأدوار",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم المستخدمون والأدوار.",
              "backendScope": "CustomEvent settings.updated for users-roles",
              "ref": "SettingsWorkspace.users-roles",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.users-roles.users-management",
                  "name": "إدارة المستخدمين",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إدارة المستخدمين داخل المستخدمون والأدوار.",
                  "backend": "CustomEvent settings.updated for users-roles",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.users-roles.roles-management",
                  "name": "إدارة الأدوار",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إدارة الأدوار داخل المستخدمون والأدوار.",
                  "backend": "CustomEvent settings.updated for users-roles",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.users-roles.access-summary",
                  "name": "ملخص الصلاحيات",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ ملخص الصلاحيات داخل المستخدمون والأدوار.",
                  "backend": "CustomEvent settings.updated for users-roles",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "audit",
              "name": "مركز التدقيق",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم مركز التدقيق.",
              "backendScope": "Dedicated feature panel for audit",
              "ref": "SettingsWorkspace.audit",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.audit.filters",
                  "name": "شريط الفلاتر",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ شريط الفلاتر داخل مركز التدقيق.",
                  "backend": "Dedicated feature panel for audit",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.audit.events-table",
                  "name": "جدول الأحداث",
                  "kind": "عرض",
                  "purpose": "يعرض البيانات التشغيلية الأساسية أو السجلات الخاصة بالتبويب.",
                  "backend": "Dedicated feature panel for audit",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "DAV-TBL-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "engine-jobs",
              "name": "لوحة المحركات",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم لوحة المحركات.",
              "backendScope": "Dedicated feature panel for engine-jobs",
              "ref": "SettingsWorkspace.engine-jobs",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.engine-jobs.summary-kpis",
                  "name": "مؤشرات المحركات",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ مؤشرات المحركات داخل لوحة المحركات.",
                  "backend": "Dedicated feature panel for engine-jobs",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.engine-jobs.jobs-list",
                  "name": "قائمة مهام المحركات",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ قائمة مهام المحركات داخل لوحة المحركات.",
                  "backend": "Dedicated feature panel for engine-jobs",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "dependency-graph",
              "name": "خريطة التبعيات",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم خريطة التبعيات.",
              "backendScope": "Dedicated feature panel for dependency-graph",
              "ref": "SettingsWorkspace.dependency-graph",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.dependency-graph.graph-canvas",
                  "name": "رسم التبعيات",
                  "kind": "عرض",
                  "purpose": "يعرض التمثيل البصري الرئيسي للمحتوى.",
                  "backend": "Dedicated feature panel for dependency-graph",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-DTL-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.dependency-graph.legend-summary",
                  "name": "الوسيلة والملخص",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ الوسيلة والملخص داخل خريطة التبعيات.",
                  "backend": "Dedicated feature panel for dependency-graph",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "tools-marketplace",
              "name": "سوق الأدوات",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم سوق الأدوات.",
              "backendScope": "Dedicated feature panel for tools-marketplace",
              "ref": "SettingsWorkspace.tools-marketplace",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.tools-marketplace.search-filters",
                  "name": "البحث والفلاتر",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ البحث والفلاتر داخل سوق الأدوات.",
                  "backend": "Dedicated feature panel for tools-marketplace",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "IPF-SRH-01",
                    "IPF-SLT-01",
                    "IPF-DAT-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.tools-marketplace.tools-grid",
                  "name": "شبكة الأدوات",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ شبكة الأدوات داخل سوق الأدوات.",
                  "backend": "Dedicated feature panel for tools-marketplace",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.tools-marketplace.quick-create",
                  "name": "إنشاء سريع",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ إنشاء سريع داخل سوق الأدوات.",
                  "backend": "Dedicated feature panel for tools-marketplace",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            },
            {
              "code": "admin-roles",
              "name": "إدارة الأدوار",
              "description": "فئة إعدادات فعلية معرفة داخل SettingsSidebar و CategoryPanelFactory باسم إدارة الأدوار.",
              "backendScope": "Dedicated feature panel for admin-roles",
              "ref": "SettingsWorkspace.admin-roles",
              "boxes": [
                {
                  "ref": "SettingsWorkspace.admin-roles.header-summary",
                  "name": "ملخص إدارة الأدوار",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ ملخص إدارة الأدوار داخل إدارة الأدوار.",
                  "backend": "Dedicated feature panel for admin-roles",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-KPI-01",
                    "DAV-TAG-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.admin-roles.roles-badges",
                  "name": "قائمة الأدوار الحالية",
                  "kind": "عرض",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ قائمة الأدوار الحالية داخل إدارة الأدوار.",
                  "backend": "Dedicated feature panel for admin-roles",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "DAV-LST-01",
                    "ACT-BTN-01",
                    "ACT-MNU-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                },
                {
                  "ref": "SettingsWorkspace.admin-roles.assign-controls",
                  "name": "عناصر إسناد الدور",
                  "kind": "أداة",
                  "purpose": "يعرض أو يدير القسم الفرعي الخاص بـ عناصر إسناد الدور داخل إدارة الأدوار.",
                  "backend": "Dedicated feature panel for admin-roles",
                  "componentRefs": [
                    "BaseBox",
                    "DAV-TTL-01",
                    "ACT-BTN-01"
                  ],
                  "state": "CODE_CURRENT_STATE"
                }
              ],
              "popups": []
            }
          ]
        }
      ]
    }
  ]
} as const;

export type AppSpec = typeof APP_SPEC;
export type WorkspaceSpec = AppSpec['workspaces'][number];
export type WorkspaceSurface = WorkspaceSpec['surface'];
export type DashboardSpec = WorkspaceSpec['dashboards'][number];
export type TabSpec = DashboardSpec['tabs'][number];
export type BoxSpec = TabSpec['boxes'][number];
export type PopupSpec = TabSpec['popups'][number];

export const APP_SPEC_COUNTS = APP_SPEC.counts;
