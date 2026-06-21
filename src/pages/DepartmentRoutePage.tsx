import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";
import { PageMeta } from "@/components/seo/PageMeta";
import Index from "./Index";

const departmentKeys = new Set([
  "financial",
  "legal",
  "marketing",
  "hr",
  "crm",
  "csr",
  "bcm",
  "training",
  "partnerships",
  "kmpa",
  "knowledge",
  "brand",
]);

const DepartmentRoutePage = () => {
  const { departmentId } = useParams<{ departmentId?: string }>();
  const { setActiveSection, setSelectedDepartment } = useNavigation();

  useEffect(() => {
    setActiveSection("departments");
    setSelectedDepartment(
      departmentId && departmentKeys.has(departmentId) ? departmentId : null,
    );
  }, [departmentId, setActiveSection, setSelectedDepartment]);

  return (
    <>
      <PageMeta
        title={departmentId ? `قسم ${departmentId} — سـوبــرا` : "الأقسام — منصة سـوبــرا"}
        description={
          departmentId
            ? `لوحة قسم ${departmentId} في منصة سـوبــرا مع المهام والمؤشرات والتقارير المتكاملة.`
            : "استعراض جميع الأقسام في منصة سـوبــرا: المالية، القانونية، التسويق، الموارد البشرية، وغيرها."
        }
        path={departmentId ? `/departments/${departmentId}` : "/departments"}
      />
      <Index />
    </>
  );
};

export default DepartmentRoutePage;
