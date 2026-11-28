import type { Metadata } from "next";
import RegionPage from "@/components/RegionPage";

export const metadata: Metadata = { title: "International Tour Packages" };

export default function InternationalPackages() {
  return <RegionPage region="international" />;
}
