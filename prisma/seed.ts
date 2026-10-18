import { PrismaClient } from "@prisma/client";
const db=new PrismaClient();
async function main(){
 await db.siteSettings.upsert({where:{id:"main"},create:{id:"main",siteTitle:"Rajat Raj Shah",tagline:"Designer. Developer. Problem solver.",seoTitle:"Rajat Raj Shah — Developer & Designer",seoDescription:"Personal portfolio of a web developer, software engineer, and graphic designer.",contactEmail:"hello@example.com",footerText:"Designed with intent. Built with care."},update:{}});
 const pages=[
 ["home","hero",{name:"Rajat Raj Shah",eyebrow:"DESIGNER × DEVELOPER",roles:["Web Developer","Software Engineer","Graphic Designer"],intro:"I build digital experiences that are thoughtful, useful, and a little unexpected.",primaryLabel:"Explore my work",primaryHref:"/portfolio",secondaryLabel:"Let's talk",secondaryHref:"/contact"}],
 ["home","sections",{projectsTitle:"Selected work",projectsIntro:"A few things I've designed and built.",servicesTitle:"Ways I can help",blogTitle:"Notes & ideas"}],
 ["about","main",{title:"A curious mind, a practical builder.",bio:"I'm a developer and designer who enjoys turning complex ideas into clear, useful digital experiences. I care about details, accessibility, and making technology feel human."}],
 ["portfolio","main",{title:"Selected work",description:"A mix of products, experiments, and creative work."}],
 ["services","main",{title:"What I can help you build",description:"From first idea to polished launch."}],
 ["contact","main",{title:"Have a good project in mind?",description:"Tell me a little about it. I'll get back to you soon."}]
 ] as const;
 for(const [page,section,content] of pages) await db.pageContent.upsert({where:{page_section:{page,section}},create:{page,section,content},update:{}});
 if(await db.project.count()===0) await db.project.createMany({data:[
 {title:"Air Runner",slug:"air-runner",description:"A responsive airline booking experience with a clear, modern interface.",imageUrl:"",tags:["React","UI/UX","Responsive"],url:"https://air-runner.vercel.app/",featured:true,sortOrder:1},
 {title:"KP-26 Hub",slug:"kp-26-hub",description:"A campus companion bringing hostel updates, transport information, and student resources together.",imageUrl:"",tags:["React","Firebase","PWA"],url:"https://kp-26-hub.vercel.app/",featured:true,sortOrder:2},
 {title:"Personal Portfolio",slug:"personal-portfolio",description:"A personal home on the web for development, design, and creative projects.",imageUrl:"",tags:["Next.js","TypeScript","Design"],url:"https://www.rajatrajshah.com.np/",featured:true,sortOrder:3}
 ]});
 if(await db.skill.count()===0) await db.skill.createMany({data:[{name:"React / Next.js",category:"Development",level:84,sortOrder:1},{name:"HTML, CSS & TypeScript",category:"Development",level:90,sortOrder:2},{name:"Figma & UI/UX",category:"Design",level:82,sortOrder:3},{name:"Canva & Graphic Design",category:"Design",level:90,sortOrder:4},{name:"SEO & Social Media",category:"Marketing",level:78,sortOrder:5}]});
 if(await db.service.count()===0) await db.service.createMany({data:[{title:"Web Development",description:"Responsive, performant websites and web apps built around real user needs.",icon:"⌘",sortOrder:1},{title:"UI/UX & Visual Design",description:"Interfaces, design systems, and visual assets that make products feel cohesive.",icon:"✳",sortOrder:2},{title:"Content & Digital Marketing",description:"Content planning, social media execution, SEO, and practical growth support.",icon:"↗",sortOrder:3}]});
 if(await db.experience.count()===0) await db.experience.createMany({data:[{role:"Marketing Intern",company:"Aorta Rooms",description:"Supported SEO research, social content planning, LinkedIn scheduling, and campaign reporting.",startDate:"2025",endDate:"2025",sortOrder:1},{role:"Sales & Business Development Intern",company:"Venture Foster Group",description:"Worked on lead generation, outreach, email campaigns, and client communication.",startDate:"2025",endDate:"2025",sortOrder:2}]});
 if(await db.education.count()===0) await db.education.create({data:{institution:"KIIT University, Bhubaneswar",qualification:"B.Tech in Computer Science & Engineering",description:"Software engineering, web development, databases, and computer science fundamentals.",startDate:"2024",endDate:"Present"}});
 if(await db.socialLink.count()===0) await db.socialLink.createMany({data:[{label:"LinkedIn",url:"https://www.linkedin.com/",icon:"linkedin",sortOrder:1},{label:"GitHub",url:"https://github.com/",icon:"github",sortOrder:2},{label:"Instagram",url:"https://www.instagram.com/",icon:"instagram",sortOrder:3}]});
}
main().then(()=>console.log("Seed complete")).catch(e=>{console.error(e);process.exit(1)}).finally(()=>db.$disconnect());
