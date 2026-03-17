import TechPassportPrint from "@/components/TechPassportPrint";
import { SearchResult } from "@/components/types";
import { TECH_PASSPORT_PRINT_TEMPLATE_STYLES } from "@/components/techPassportPrintTemplate";

interface TechPassportPrintPreviewProps {
  id: string;
  searchResult: SearchResult;
}

const TechPassportPrintPreview = ({ id, searchResult }: TechPassportPrintPreviewProps) => (
  <div
    id={id}
    style={{
      position: "absolute",
      top: "-9999px",
      left: "-9999px",
      width: "14.80cm",
      height: "10.50cm",
      visibility: "hidden",
    }}
  >
    <style>
      {TECH_PASSPORT_PRINT_TEMPLATE_STYLES}
    </style>
    <TechPassportPrint searchResult={searchResult} />
  </div>
);

export default TechPassportPrintPreview;
