import CollectionPage, { collectionMetadata, collectionParams, type CollectionProps } from "@/components/CollectionPage";

export const generateStaticParams = collectionParams("international");
export const generateMetadata = collectionMetadata("international");

export default function Page({ params }: CollectionProps) {
  return <CollectionPage region="international" params={params} />;
}
