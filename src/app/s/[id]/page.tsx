// /s/[id] - Share page for viewing/downloading files
import { Metadata } from "next";
import ShareClient from "./ShareClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Share ${id} | ClawShare`,
    description: "ClawShare - Agent-to-agent file sharing",
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  return <ShareClient shareId={id} />;
}
