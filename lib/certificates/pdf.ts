import type {Certificate} from "./contracts";
// A landscape page is written directly, with no browser/printer rotation metadata.
export function landscapePdf(jpeg:Uint8Array,width:number,height:number){
 const encode=(s:string)=>new TextEncoder().encode(s),parts:Uint8Array[]=[],offsets=[0];let length=0;
 function append(v:string|Uint8Array){const bytes=typeof v==='string'?encode(v):v;parts.push(bytes);length+=bytes.length;}
 function object(id:number,body:string){offsets[id]=length;append(`${id} 0 obj\n${body}\nendobj\n`);}
 append('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 object(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Certificate 4 0 R >> >> /Contents 5 0 R >>');
 offsets[4]=length;append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);append(jpeg);append('\nendstream\nendobj\n');
 const content='q\n841.89 0 0 595.28 0 0 cm\n/Certificate Do\nQ\n';object(5,`<< /Length ${encode(content).length} >>\nstream\n${content}endstream`);
 const xref=length;append('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)append(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
 const result=new Uint8Array(length);let position=0;for(const p of parts){result.set(p,position);position+=p.length;}return result;
}
function image(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('A certificate image could not be loaded. Please try again.'));img.src=src;});}
export async function downloadCertificate(c:Certificate,assets:{href:string;image:string}){
 if(c.status!=='valid'||!assets.href||!assets.image)throw new Error('A valid certificate and verification QR are required.');
 await document.fonts.ready;const [logo,qr]=await Promise.all([image('/atupa-logo.jpg'),image(assets.image)]);
 const canvas=document.createElement('canvas');canvas.width=2526;canvas.height=1786;const context=canvas.getContext('2d');if(!context)throw new Error('PDF export is unavailable in this browser.');const ctx=context;ctx.scale(3,3);
 const w=842,h=595;ctx.fillStyle='#faf8ed';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#d3cfb9';ctx.lineWidth=1;ctx.strokeRect(18,18,w-36,h-36);ctx.strokeRect(25,25,w-50,h-50);
 ctx.drawImage(logo,48,42,135,35);ctx.textAlign='right';ctx.fillStyle='#65705e';ctx.font='9px Arial';ctx.fillText('LANGUAGE. CULTURE. CONNECTION.',w-48,62);
 function center(value:string,y:number,size:number,maxWidth=720,italic=false){ctx.textAlign='center';ctx.fillStyle='#294c35';let font=size;ctx.font=`${italic?'italic ':''}${font}px Georgia`;while(ctx.measureText(value).width>maxWidth&&font>12){font--;ctx.font=`${italic?'italic ':''}${font}px Georgia`;}ctx.fillText(value,w/2,y,maxWidth);}
 ctx.textAlign='center';ctx.fillStyle='#a74628';ctx.font='11px Arial';ctx.fillText('CERTIFICATE OF COMPLETION',w/2,123);
 center('A connection carried forward.',166,30);center('This is to certify that',207,12);center(c.learnerName,265,44,720,true);
 ctx.strokeStyle='#ded9c2';ctx.beginPath();ctx.moveTo(70,284);ctx.lineTo(w-70,284);ctx.stroke();
 center('has completed',315,12);center(c.courseTitle,354,26);center(`${c.languageName} · ${c.level}`,381,12);
 const date=new Date(c.completedAt).toLocaleDateString(undefined,{dateStyle:'long',timeZone:'UTC'});
 ctx.textAlign='left';for(const [i,label,value] of [[0,'COMPLETED',date],[1,'CERTIFICATE ID',c.certificateId],[2,'STATUS',c.status]] as const){const y=432+i*35;ctx.fillStyle='#65705e';ctx.font='8px Arial';ctx.fillText(label,48,y);ctx.fillStyle='#294c35';ctx.font='11px Arial';ctx.fillText(value,48,y+15);}
 ctx.fillStyle='#fff';ctx.fillRect(692,426,102,102);ctx.drawImage(qr,699,433,88,88);ctx.textAlign='center';ctx.fillStyle='#65705e';ctx.font='8px Arial';ctx.fillText('Scan to verify',743,541);
 center(assets.href,563,8,744);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(v=>v?resolve(v):reject(new Error('Unable to prepare the PDF.')),'image/jpeg',.98));
 const bytes=landscapePdf(new Uint8Array(await blob.arrayBuffer()),canvas.width,canvas.height);const url=URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer],{type:'application/pdf'}));
 const link=document.createElement('a');link.href=url;link.download=`${c.certificateId}.pdf`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
