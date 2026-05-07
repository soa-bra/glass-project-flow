import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";
import Index from "./Index";

const departmentKeys = new Set([
  "financial",
  "legal",
  "marketing",
  "hr",
  "crm",
  "social",
  "training",
  "research",
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

  return <Index />;
};

export default DepartmentRoutePage;
