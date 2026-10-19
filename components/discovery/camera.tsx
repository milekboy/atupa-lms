"use client";
import {useEffect,useRef,useState} from "react";
import {Button} from "@/components/ui";
type Detector={detect:(video:HTMLVideoElement)=>Promise<{rawValue:string}[]>};
type DetectorClass=new(options:{formats:string[]})=>Detector;
export function CardCamera({onCode,onClose}:{onCode:(value:string)=>void;onClose:()=>void}){
 const video=useRef<HTMLVideoElement>(null),[message,setMessage]=useState('Starting camera…');
 useEffect(()=>{let live=true,stream:MediaStream|undefined,timer:ReturnType<typeof setTimeout>|undefined;const Detector=(window as unknown as {BarcodeDetector?:DetectorClass}).BarcodeDetector;
 async function start(){try{if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('Camera scanning requires a secure connection. Enter your card code instead.');if(!Detector)throw new Error('QR scanning is not supported by this browser. Enter your card code instead.');stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});if(!live){stream.getTracks().forEach(t=>t.stop());return;}if(!video.current)return;video.current.srcObject=stream;await video.current.play();if(!live)return;setMessage('Point your camera at an ATUPA card QR code.');const detector=new Detector({formats:['qr_code']});async function scan(){if(!live||!video.current)return;try{const hits=await detector.detect(video.current);if(live&&hits[0]){stream?.getTracks().forEach(t=>t.stop());onCode(hits[0].rawValue);return;}}catch{/* A frame may be unreadable; keep the manual fallback available. */}if(live)timer=setTimeout(()=>void scan(),400);}void scan();}catch(e){stream?.getTracks().forEach(t=>t.stop());if(live)setMessage(e instanceof Error?e.message:'Camera unavailable. Enter the card code instead.');}}void start();return()=>{live=false;clearTimeout(timer);stream?.getTracks().forEach(t=>t.stop());};
 },[onCode]);
 return <section className="discover-camera"><video ref={video} muted playsInline aria-label="Camera QR preview"/><p role="status">{message}</p><Button variant="secondary" onClick={onClose}>Stop camera</Button></section>;
}
