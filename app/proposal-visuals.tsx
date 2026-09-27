"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, BookOpen, Check, ClipboardCheck, FileText, Layers3, Pause, Play, ShieldCheck, Target, Users, Workflow } from "lucide-react";

const paths = [
  { name: "Client follow-through", icon: ClipboardCheck, asset: "Plans & monthly reviews", title: "Arrive prepared. Leave with action.", steps: ["Approved updates", "Prepared review", "Owned next steps"], outcome: "A more consistent review service", value: "Give consultants more time for decisions and clients a clearer record of what happens next.", measure: "Preparation effort · corrections · action completion", build: "review" },
  { name: "Consultant capacity", icon: BookOpen, asset: "Methodology & expertise", title: "Make the expertise easier to apply.", steps: ["Approved resources", "Relevant guidance", "Ready-to-use materials"], outcome: "More repeatable client delivery", value: "Help consultants find the right guidance, prepare engagements and reuse approved materials.", measure: "Preparation time · source accuracy · repeat use", build: "consultant" },
  { name: "Customer growth", icon: Users, asset: "Existing relationships", title: "Find the next useful conversation.", steps: ["Eligible customer", "Confirmed need", "Relevant service"], outcome: "A clearer path to the next engagement", value: "Connect a stated customer need to plan refresh, review support or enterprise discovery.", measure: "Qualified meetings · paid reactivations · contribution", build: "refresh" },
];

export function BusinessOpportunityMap({ onExplore }: { onExplore: (id: string) => void }) {
  const [selected, setSelected] = useState(0);
  const path = paths[selected];
  return <div className="business-map">
    <div className="map-heading"><div><span className="visual-kicker">THE BUSINESS OPPORTUNITY</span><h3>More value from every plan.</h3></div><span className="concept-pill">Proposed operating model</span></div>
    <div className="business-map-grid">
      <div className="map-foundations"><span className="map-column-label">01 / CHOOSE A BUSINESS PRIORITY</span>{paths.map((p, i) => <button key={p.name} className={`map-choice ${selected === i ? "selected" : ""}`} onClick={() => setSelected(i)} aria-pressed={selected === i}><p.icon size={25}/><span><b>{p.name}</b><small>{p.asset}</small></span><ArrowRight size={20}/></button>)}</div>
      <div className="map-connections" aria-hidden="true"><svg viewBox="0 0 80 300" preserveAspectRatio="none">{[64,150,236].map((y,i)=><path key={i} d={`M0 ${y} C42 ${y} 35 150 80 150`} className={selected===i?"path-active":""}/>)}</svg></div>
      <div className="map-engine" key={path.name}><span className="map-column-label">02 / A CONNECTED WORKFLOW</span><div className="engine-emblem"><Layers3 size={30}/><span>ONE PAGE × ZEN</span></div><h4>{path.title}</h4><ol>{path.steps.map((s,i)=><li key={s} style={{"--item":i} as CSSProperties}><span>{i+1}</span>{s}</li>)}</ol><div className="human-gate"><ShieldCheck size={20}/><span>People approve advice,<br/>outreach and commitments.</span></div></div>
      <div className="map-exit" aria-hidden="true"><span/><ArrowRight size={24}/></div>
      <div className="map-value"><span className="map-column-label">03 / POTENTIAL BUSINESS VALUE</span><Target size={30} className="value-icon"/><h4>{path.outcome}</h4><p>{path.value}</p><div className="map-measure"><small>PROVE IT IN A PILOT</small><p>{path.measure}</p></div><button onClick={()=>onExplore(path.build)}>Explore this solution <ArrowRight size={18}/></button></div>
    </div>
    <p className="map-note">Concept diagram. Connections and benefits are proposed; no company systems are connected. Validate the workflow and economics before expanding.</p>
  </div>;
}

const stepIcons = [FileText, Workflow, ClipboardCheck, ShieldCheck];
export function SolutionFlow({ name, steps, details, step, onStep }: { name: string; steps: string[]; details: string[]; step: number; onStep: (step: number) => void }) {
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    if(!playing)return;
    const timer=setTimeout(()=>{if(step<3)onStep(step+1);else setPlaying(false)},7000);
    return()=>clearTimeout(timer);
  },[playing,step,onStep]);
  useEffect(()=>{
    const stop=()=>{if(document.hidden)setPlaying(false)};
    document.addEventListener("visibilitychange",stop);
    return()=>document.removeEventListener("visibilitychange",stop);
  },[]);
  return <div className={`solution-flow ${playing?"is-playing":""}`}>
    <div className="flow-heading"><span className="visual-kicker">HOW {name.toUpperCase()} WOULD WORK</span><button className="walkthrough-control" onClick={()=>{if(playing)setPlaying(false);else{onStep(0);setPlaying(true)}}} aria-pressed={playing}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?"Pause walkthrough":"Play 4-step walkthrough"}</button></div>
    <ol className="flow-cards" aria-label={`${name} proposed workflow`}>{steps.map((s,i)=>{const Icon=stepIcons[i];return <li key={s} className={step===i?"current":step>i?"visited":""}><button onClick={()=>{setPlaying(false);onStep(i)}} aria-pressed={step===i} aria-label={`Step ${i+1}: ${s}`}><span className="flow-card-top"><Icon size={25}/><span>0{i+1}</span></span><strong>{s}</strong><span className="flow-card-status">{step===i?"Showing this step":step>i?<><Check size={14}/> Explored</>:"Explore this step"}</span></button>{i<3&&<ArrowRight className="flow-connector" size={23}/>}</li>})}</ol>
    <div className="flow-explanation"><span>0{step+1}</span><p>{details[step]}</p><span className="flow-demo-label">Illustrative walkthrough</span></div>
  </div>;
}

export function CapacityBridge({ gross, maintenance, net }: {gross:number;maintenance:number;net:number}) {
  const max=Math.max(Math.abs(gross),maintenance,Math.abs(net),1);
  return <div className="capacity-bridge"><div className="capacity-bridge-title"><span>HOW THE HOURS ADD UP</span><span>Annualized example</span></div><div className="capacity-bars">{[
    {label:gross>=0?"Time recovered before upkeep":"Added review workload",value:gross,kind:"gross"},
    {label:"Recurring maintenance",value:-maintenance,kind:"upkeep"},
    {label:"Net capacity change",value:net,kind:"net"},
  ].map(item=><div className={`capacity-row ${item.kind}`} key={item.kind}><div><span>{item.label}</span><b>{Math.round(item.value).toLocaleString()} hrs</b></div><div className="capacity-track"><span style={{width:`${Math.abs(item.value)/max*100}%`}}/></div></div>)}</div><p>Illustrative capacity, not cash savings. One-time setup effort is excluded.</p></div>;
}
