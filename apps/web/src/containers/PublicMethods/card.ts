import "@fontsource-variable/onest";
import "@fontsource/prata";
import type { PublicResult } from "./types";
import { formatScore } from "./types";
import { resultReading } from "./resultInterpretation";
import { cardScenes, characterAtlases, characterColumns, rangePosition, scenesFor, type Character, type Layout, type Scene } from "./cardScenes";

const assetRoot = "/images/result-cards/";
const assets = new Map<string, Promise<HTMLImageElement>>();
function loadArt(name: string) {
  const cached = assets.get(name);
  if (cached) return cached;
  const request = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Не удалось загрузить иллюстрацию"));
    img.src = assetRoot + name + ".webp";
  }).catch(error => { assets.delete(name); throw error; });
  assets.set(name,request);
  return request;
}

type Options = { scene?: Scene; character?: Character; layout?: Layout; resultShape?: "organic" | "rounded"; art?: { row: number; column: number; person: number; personRow?: number } };

export async function resultCard(result: PublicResult, options: Options = {}): Promise<Blob> {
  const choices = scenesFor(result);
  const scene = cardScenes[options.scene && choices.includes(options.scene) ? options.scene : choices[0]];
  const art = options.art;
  const character = options.character ?? "none";
  const journal = options.layout === "journal";
  const tiles = options.layout === "tiles";
  const rounded = options.resultShape === "rounded";
  const illustrated = tiles && !rounded;
  const cyrillic = "Методика результата АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ 0123456789";
  const [atlas, people, background, person] = await Promise.all([
    art ? loadArt("scenes-atlas").catch(() => null) : null,
    art && character !== "none" ? loadArt(`${character}-${characterAtlases[Math.floor(art.person / characterColumns)]}`).catch(() => null) : null,
    loadArt("scenes").catch(() => null),
    character === "none" ? null : loadArt(character).catch(() => null),
    document.fonts.load('400 48px Prata',cyrillic).catch(() => []),
    document.fonts.load('680 78px "Lora Variable"',cyrillic).catch(() => []),
    document.fonts.load('780 78px "Onest Variable"',cyrillic).catch(() => []),
    document.fonts.load('650 28px "Onest Variable"',cyrillic).catch(() => []),
  ]);
  const canvas = document.createElement("canvas");
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Браузер не поддерживает создание изображения");
  canvas.width = 1080;
  const width = canvas.width;
  const ink = "#203e32", paper = "#fff4dd", accent = scene.dark ? "#875854" : "#52764d";
  const font = (size:number, weight=500) => `${weight} ${size}px "Onest Variable", sans-serif`;
  const lines = (text:string, max:number) => text.trim().split(/\s+/).reduce((rows:string[], word) => {
    const last = rows.at(-1);
    if (last && c.measureText(last + " " + word).width <= max) rows[rows.length-1] += " " + word;
    else rows.push(word);
    return rows;
  },[]);
  const titleFont = journal ? font(90,780) : tiles ? (rounded ? font(82,780) : '680 82px "Lora Variable", serif') : '400 64px Prata, serif';
  const titleLeading = journal ? 92 : tiles ? 89 : 75;
  const titleTop = journal ? 217 : tiles ? (illustrated ? 233 : 205) : 229;
  c.font = titleFont;
  const title = lines(result.method.name, journal ? 910 : tiles ? 820 : 545);
  const titleBottom = titleTop + (title.length - 1) * titleLeading;
  const hasTotal = result.presentation !== "profile" && result.scales.length > 0;
  const total = hasTotal ? result.scales[0] : undefined;
  const rows = hasTotal ? result.scales.slice(1) : result.scales;
  const explanation = resultReading(result).card;
  const rowFont = tiles ? font(37,650) : font(32,650);
  const rowLeading = tiles ? 45 : 39;
  c.font = rowFont;
  const rowLabels = rows.map(scale => lines(scale.label, tiles ? 680 : journal ? 655 : 465));
  const rowHeights = rowLabels.map(row => row.length * rowLeading + (tiles ? 58 : journal ? 62 : 34));
  const scalesHeight = rowHeights.reduce((sum,height) => sum+height,0);
  const explanationLeading = 40;
  const explanationFont = font(31);
  c.font = explanationFont;
  const explanationLines = explanation ? lines(explanation,illustrated ? 810 : 865) : [];
  const totalHeight = journal ? 245 : illustrated ? 165 : tiles ? 242 : 0;
  c.font = font(25);
  const footer = result.cardNote ? lines(result.cardNote,865) : [];
  const panelInset = illustrated ? 102 : 60;
  const explanationGap = illustrated ? 72 : 34;
  const contentHeight = panelInset + (total ? totalHeight : 45) + scalesHeight
    + (explanationLines.length ? explanationGap + explanationLines.length*explanationLeading : 0) + footer.length*34 + 54;
  const minimumPanelTop = Math.max(795, titleBottom + (!journal && !tiles && total ? 395 : 270));
  canvas.height = Math.max(1920, minimumPanelTop + contentHeight + 28);
  const panelTop = canvas.height - contentHeight - (tiles ? 48 : 28);
  const artHeight = canvas.height;

  c.fillStyle = paper; c.fillRect(0,0,width,canvas.height);
  c.fillStyle = scene.fill; c.fillRect(0,0,width,artHeight);
  if (art && atlas) {
    const tileW = Math.floor(atlas.width/5), tileH = Math.floor(atlas.height/3);
    const sourceW = Math.min(tileW, tileH*width/artHeight);
    c.drawImage(atlas, art.column*tileW+(tileW-sourceW)/2, art.row*tileH, sourceW, tileH, 0, 0, width, artHeight);
  } else if (background) {
    const tileW = Math.floor(background.width/2), tileH = Math.floor(background.height/2);
    const cropHeight = Math.min(artHeight, 1920);
    const fit = Math.max(width/tileW,cropHeight/tileH);
    const sourceW=width/fit, sourceH=cropHeight/fit;
    c.drawImage(background,scene.column*tileW+(tileW-sourceW)*(tiles ? .2 : .5),scene.row*tileH+(tileH-sourceH)/2,sourceW,sourceH,0,0,width,artHeight);
  }
  if (person || (art && people)) {
    const personBottom=illustrated ? Math.max(panelTop+245,1405) : panelTop+170;
    const h = illustrated
      ? Math.min(1120,personBottom-titleBottom-30)
      : Math.min(780,artHeight-(220+title.length*72));

    c.filter = scene.dark ? "brightness(0.79) saturate(0.82)" : "none";
    if (art && people) {
      const tileW = Math.floor(people.width / characterColumns), tileH = Math.floor(people.height/3);
      const w = h*tileW/tileH;
      c.drawImage(people, (art.person % characterColumns)*tileW, (art.personRow ?? art.row)*tileH, tileW, tileH, width-w+45, personBottom-h,w,h);
    } else if (person) {
      const w = h * person.width / person.height;
      c.drawImage(person, journal ? (width-w)/2 : width-w+65, personBottom-h,w,h);
    }
    c.filter = "none";
  }
  if(!tiles){
    const wash=c.createLinearGradient(0,0,0,Math.min(panelTop,Math.max(830,titleBottom+(!journal && total ? 402 : 230))));
    wash.addColorStop(0,scene.dark?"rgba(25,27,45,.94)":"rgba(255,245,220,.98)");
    wash.addColorStop(.55,scene.dark?"rgba(25,27,45,.57)":"rgba(255,245,220,.72)");
    wash.addColorStop(1,"transparent");
    c.fillStyle=wash;c.fillRect(0,0,width,artHeight);
  }

  const line = (value:string,x:number,y:number) => c.fillText(value,x,y);
  if(!journal && !tiles){
    const column=c.createLinearGradient(0,0,750,0);
    column.addColorStop(0,"#fbefcf");
    column.addColorStop(.72,"rgba(251,239,207,.97)");
    column.addColorStop(1,"rgba(251,239,207,0)");
    c.fillStyle=column;c.fillRect(0,0,750,panelTop+8);
  }
  const headerInk=scene.dark && (journal || tiles) ? "#fff4dd" : ink;
  if(tiles){
    if(illustrated && result.method.abbreviation){
      c.fillStyle=scene.dark?"#f4cca0":"#f0ce83";
      c.font=font(27,700);
      const badgeWidth=c.measureText(result.method.abbreviation).width+60;
      c.beginPath();c.roundRect(width-56-badgeWidth,45,badgeWidth,60,30);c.fill();
      c.strokeStyle="#fff1d2";c.lineWidth=2;c.stroke();
    }
    c.fillStyle=headerInk;
    c.font=font(54,750);line("mindresearch.pro",67,91);
    c.textAlign="right";c.font=font(27,700);
    if(illustrated)c.fillStyle=ink;
    line(result.method.abbreviation,width-(illustrated?86:67),illustrated?84:91);
    c.fillStyle=headerInk;
    c.textAlign="left";c.font=titleFont;
    title.forEach((value,i)=>line(value,67,titleTop+i*titleLeading));
    if(illustrated){
      c.strokeStyle=scene.dark?"#f3bd79":"#a16819";
      c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(70,titleBottom+40);
      c.bezierCurveTo(195,titleBottom+2,376,titleBottom+5,284,titleBottom+38);
      c.bezierCurveTo(233,titleBottom+57,353,titleBottom+40,477,titleBottom+33);
      c.stroke();c.lineCap="butt";
    }
  }else{
    c.fillStyle=headerInk;
    c.font=font(journal?33:40,750);
    if(journal)c.textAlign="center";
    line("mindresearch.pro",journal ? width/2 : 65,86);
    c.textAlign="left";
    if(!journal){
      c.font=font(28,650);c.textAlign="right";line(result.method.abbreviation,555,86);
      c.fillRect(65,122,490,2);
    }
    c.textAlign=journal ? "center" : "left";
    c.font=titleFont;
    title.forEach((value,i)=>line(value,journal ? width/2 : 65,titleTop+i*titleLeading));
    c.textAlign="left";
  }

  const panelX=journal?0:30;
  const left=journal ? 80 : panelX+48, right=width-left;
  const resultInk=journal ? "#fff8e8" : ink;
  const muted=journal ? "#d5e2cb" : "#4a6354";
  const rule=journal ? "#607c6a" : "rgba(48, 71, 57, .24)";
  if(journal){
    c.fillStyle="rgba(28, 58, 46, .98)";
    c.beginPath();c.moveTo(0,panelTop+68);
    c.lineTo(width,panelTop-135);
    c.lineTo(width,canvas.height);c.lineTo(0,canvas.height);c.closePath();c.fill();
  }else if(tiles){
    c.fillStyle=scene.dark ? "#f8e0cf" : "#fff4da";
    const x=35, edge=width-x, bottom=canvas.height-34;
    c.beginPath();
    if(rounded){
      c.roundRect(x,panelTop,edge-x,bottom-panelTop,64);
    }else{
      c.moveTo(x,panelTop+170);
      c.bezierCurveTo(x,panelTop-24,206,panelTop-35,460,panelTop-32);
      c.bezierCurveTo(645,panelTop-29,596,panelTop+33,765,panelTop+33);
      c.bezierCurveTo(929,panelTop+33,edge,panelTop+49,edge,panelTop+178);
      c.lineTo(edge,bottom-55);
      c.quadraticCurveTo(edge,bottom,edge-55,bottom);
      c.lineTo(x+55,bottom);
      c.quadraticCurveTo(x,bottom,x,bottom-55);
      c.closePath();
    }
    c.fill();
    if(illustrated){c.strokeStyle="#fff9e8";c.lineWidth=3;c.stroke();}
  }else{
    const fade=c.createLinearGradient(0,panelTop-125,0,panelTop+54);
    fade.addColorStop(0,"rgba(255, 248, 231, 0)");
    fade.addColorStop(1,"rgba(255, 248, 231, .97)");
    c.fillStyle=fade;c.fillRect(0,panelTop-125,width,canvas.height-panelTop+125);
  }
  const divider=(top:number)=>{
    c.fillStyle=rule; c.fillRect(left,top,right-left,2);
  };

  const bar=(scale:PublicResult["scales"][number],x:number,top:number,w:number)=>{
    const fraction=rangePosition(scale);
    if(fraction===null)return;
    c.fillStyle=journal ? "#597263" : "#d7d6bd";c.fillRect(x,top,w,6);
    c.fillStyle=journal ? "#cadd9c" : accent;
    c.fillRect(x,top,w*fraction,6);
    c.beginPath();c.arc(x+w*fraction,top+3,8,0,Math.PI*2);c.fill();
  };

  let y=panelTop+panelInset;
  c.fillStyle=muted;c.font=font(32,650);
  if(journal)c.textAlign="center";
  if(journal || !total)line(total ? "Мой результат" : "Профиль шкал",journal ? width/2 : left,y);
  c.textAlign="left";
  if(total && !journal && !tiles){
    const scoreTop=titleBottom+95;
    c.fillStyle=headerInk;c.font=font(31,700);line("Мой результат",65,scoreTop);
    const value=formatScore(total.value);
    c.font=font(155,780);line(value,60,scoreTop+152);
    const scoreWidth=c.measureText(value).width;
    c.font=font(39,650);line("/ "+formatScore(total.max),80+scoreWidth,scoreTop+150);
    c.fillStyle=scene.dark?"#bccaab":"#8b9a75";c.fillRect(66,scoreTop+190,270,4);
    c.fillStyle=headerInk;c.fillRect(66,scoreTop+190,270*(rangePosition(total)??0),4);
  }else if(total && illustrated){
    const value=formatScore(total.value);
    const scoreX=left+36;
    c.fillStyle=ink;c.font=font(116,780);
    c.fillText(value,scoreX,y+45,310);
    const valueWidth=Math.min(c.measureText(value).width,310);
    c.font=font(42,700);
    line("/ "+formatScore(total.max),scoreX+valueWidth+18,y+45);
    c.fillStyle=ink;c.font=font(46,750);
    line("Мой результат",scoreX,y+99);
    y+=totalHeight;
  }else if(total && tiles){
    c.fillStyle=muted;c.font=font(32,700);line("Мой результат",left,y);
    const value=formatScore(total.value);
    c.fillStyle=ink;c.font=font(152,780);
    line(value,left-5,y+128);
    const valueWidth=c.measureText(value).width;
    c.font=font(40,700);line("из "+formatScore(total.max),left+valueWidth+14,y+126);
    const fraction=rangePosition(total);
    if(fraction!==null){
      const barWidth=right-left;
      c.fillStyle=scene.dark?"#d5b4a4":"#ded2b2";
      c.beginPath();c.roundRect(left,y+158,barWidth,28,14);c.fill();
      if(fraction>0){
        c.fillStyle=accent;
        c.beginPath();c.roundRect(left,y+158,barWidth*fraction,28,14);c.fill();
      }
    }
    y+=totalHeight;
  }else if(total){
    const value=formatScore(total.value);
    c.fillStyle=resultInk;c.font='400 144px Prata, serif';
    const valueWidth=c.measureText(value).width;
    c.textAlign="center";line(value,width/2,y+142);c.textAlign="left";
    c.font=font(36,650);c.fillStyle=muted;
    line("/ "+formatScore(total.max),width/2+valueWidth/2+20,y+142);
    bar(total,left,y+176,right-left);
    c.font=font(28,650);c.fillStyle=muted;
    line(formatScore(total.min),left,y+215);
    c.textAlign="right";line(formatScore(total.max),right,y+215);c.textAlign="left";
    y+=totalHeight;
  }else{
    if(!tiles)divider(y+13);
    y+=45;
  }

  rows.forEach((scale,index)=>{
    const labels=rowLabels[index];
    c.fillStyle=resultInk;c.font=rowFont;
    labels.forEach((label,i)=>line(label,left,y+34+i*rowLeading));
    const middle=y+25+(labels.length-1)*19.5;
    if(journal || tiles)bar(scale,left,y+labels.length*rowLeading+9,right-left);
    else bar(scale,right-335,middle-8,195);
    c.fillStyle=resultInk;c.font=font(tiles?40:33,750);c.textAlign="right";
    line(formatScore(scale.value)+" / "+formatScore(scale.max),right,journal||tiles?y+34:middle+6);
    c.textAlign="left";
    y+=rowHeights[index];
    if(!journal && !tiles && index<rows.length-1)divider(y-20);
  });
  if(explanationLines.length){
    if(illustrated){
      c.fillStyle="#e9e8d1";
      c.beginPath();c.roundRect(left,y+22,right-left,explanationLines.length*explanationLeading+40,24);c.fill();
    }
    c.fillStyle=resultInk; c.font=explanationFont; y+=explanationGap;
    explanationLines.forEach(value=>{line(value,left+(illustrated ? 28 : 0),y); y+=explanationLeading});
  }
  y+=34;
  c.font=font(25); c.fillStyle=muted;
  footer.forEach(value=>{line(value,left,y);y+=34});

  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob ? resolve(blob) : reject(new Error("Не удалось создать PNG")), "image/png"));
}
