import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET(){return NextResponse.json(await db.pageContent.findMany({orderBy:[{page:"asc"},{section:"asc"}]}))}
export async function PUT(req:NextRequest){const {page,section,content}=await req.json().catch(()=>({}));if(typeof page!=="string"||typeof section!=="string"||!content||typeof content!=="object")return NextResponse.json({error:"page, section, and JSON content are required."},{status:400});return NextResponse.json(await db.pageContent.upsert({where:{page_section:{page,section}},create:{page,section,content},update:{content}}))}
