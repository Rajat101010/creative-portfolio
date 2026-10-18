import { getPublicData } from "@/lib/content";
import { ServiceGrid } from "@/components/cards";
import { SectionTitle } from "@/components/section-title";
export default async function Services(){const d=await getPublicData();return <div className="container section-pad"><SectionTitle eyebrow="How I can help" title={String(d.servicePage.title||"What I can help you build")} description={String(d.servicePage.description||"From first idea to polished launch.")}/><ServiceGrid services={d.services}/></div>}
