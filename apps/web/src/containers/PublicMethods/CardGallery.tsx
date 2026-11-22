import { useEffect, useState } from "react";
import catalog from "../../../../api/src/public-methods/catalog.json";
import { characterAtlases, characters, layouts, type Layout } from "./cardScenes";
import { resultCard } from "./card";

const exampleMethod = catalog.find(method => method.slug === "fear-of-missing-out")!;
const exampleScales = [
  {label:"Общий страх упущенных возможностей", value:19, min:6, max:30, explanation:"", cardExplanation:"Ответы о переживаниях из-за событий, которые проходят без вас."},
  {label:"Страх упущенного удовольствия", value:9, min:3, max:15, explanation:""},
  {label:"Страх упущенных социальных возможностей", value:10, min:3, max:15, explanation:""},
];

const examples = [
  { layout:"poster", label:layouts.poster },
  { layout:"journal", label:layouts.journal },
  { layout:"tiles", label:"Мягкий контур" },
  { layout:"tiles", label:"Скруглённая плашка", resultShape:"rounded" },
] satisfies {layout:Layout;label:string;resultShape?:"organic" | "rounded"}[];

function LayoutComparison() {
  const [cards, setCards] = useState<{ label:string; url:string }[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const urls:string[] = [];
    void Promise.all(examples.map(async ({layout,label,resultShape}) => {
      const blob = await resultCard({
        method:exampleMethod, scales:exampleScales, explanation:"", revision:"example", completedAt:"",
      }, { scene:"library", character:"man", layout, resultShape });
      const url=active ? URL.createObjectURL(blob) : "";
      if(url)urls.push(url);
      return {label,url};
    })).then(items=>{if(active)setCards(items)}).catch(()=>{if(active)setError(true)});
    return ()=>{active=false;urls.forEach(url=>URL.revokeObjectURL(url))};
  },[]);
  return <section style={{margin:"32px 0"}}>
    <h2>Сравнить компоновки</h2>
    <p>Один пример FoMO, одинаковые баллы и иллюстрация.</p>
    {error && <p role="alert">Не удалось собрать примеры карточек.</p>}
    {!error && cards.length === 0 && <p role="status">Собираем карточки…</p>}
    {[cards.slice(2), cards.slice(0,2)].map((group,index)=>group.length>0 && <div key={index}
      style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:16,maxWidth:800,marginBottom:24}}>
      {group.map(({label,url})=><figure key={label} style={{margin:0,minWidth:0}}>
        <figcaption style={{fontWeight:700,marginBottom:8}}>{label}</figcaption>
        <img src={url} alt={label+" — пример результата FoMO"} style={{display:"block",width:"100%",borderRadius:12}} />
      </figure>)}
    </div>)}
  </section>;
}

export default function CardGallery() {
  return <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 64px", color: "#203e32" }}>
    <a href="/methods/">← Каталог тестов</a>
    <h1>Иллюстрации карточек результатов</h1>
    <LayoutComparison />
    <section>
      <h2>Фоны</h2>
      <img src="/images/result-cards/scenes-atlas.webp" alt="15 фонов карточек" style={{ display:"block", width:"100%", borderRadius:12 }} />
    </section>
    <section style={{ marginTop:32 }}>
      <h2>Персонажи</h2>
      {(["woman", "man"] as const).flatMap(id => characterAtlases.map((atlas,index) => <figure key={id+atlas} style={{ margin:"0 0 24px" }}>
        <img src={`/images/result-cards/${id}-${atlas}.webp`} alt={characters[id]} style={{
          display:"block", width:"100%", borderRadius:12,
          background:"repeating-conic-gradient(#e4e8e0 0% 25%, #f6f8f3 0% 50%) 0 / 24px 24px",
        }} />
        <figcaption style={{ marginTop:8 }}>{characters[id]} · набор {index+1}</figcaption>
      </figure>))}
    </section>
  </main>;
}
