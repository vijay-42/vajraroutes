import CollectionPage, { collectionMetadata, collectionParams, type CollectionProps } from "@/components/CollectionPage";

export const generateStaticParams = collectionParams("domestic");
export const generateMetadata = collectionMetadata("domestic");

export default function Page({ params }: CollectionProps) {
  return <CollectionPage region="domestic" params={params} />;
}
