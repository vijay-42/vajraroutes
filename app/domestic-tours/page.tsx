import type { Metadata } from "next";
import RegionPage from "@/components/RegionPage";

export const metadata: Metadata = { title: "Domestic Tour Packages" };

export default function DomesticPackages() {
  return <RegionPage region="domestic" />;
}
