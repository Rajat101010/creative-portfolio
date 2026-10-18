import { getSettings } from "@/lib/content";
import { Header,Footer } from "@/components/site-shell";
export default async function PublicLayout({children}:{children:React.ReactNode}){const s=await getSettings();const [projects,socials]=await Promise.all([import("@/lib/db").then(({db})=>db.project.findMany({orderBy:{sortOrder:"asc"}})),import("@/lib/db").then(({db})=>db.socialLink.findMany({orderBy:{sortOrder:"asc"}}))]);return <><Header settings={s}/><main>{children}</main><Footer settings={s} projects={projects} socials={socials}/></>}
