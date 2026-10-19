import Image from "next/image";

export function BrandLogo({tagline,sidebar=false}:{tagline?:string;sidebar?:boolean}) {
  return <span className={`brand-logo${sidebar?" brand-logo-sidebar":""}`}><span className="brand-logo-art"><Image src="/atupa-logo.jpg" width={675} height={175} alt="ATUPA" unoptimized loading="eager"/></span>{tagline&&<small>{tagline}</small>}</span>;
}
