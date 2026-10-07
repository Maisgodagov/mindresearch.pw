import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Leaf, Plus } from "lucide-react";
import { getCachedCurrentUser, initializeAuth } from "../../api";
import "./landing.css";

const pictureDimensions: Record<string, [number, number]> = {
  builder: [754, 1676], custom: [720, 676], catalog: [920, 898],
  share: [566, 235], desktop: [1100, 740], phone: [390, 820],
  statistics: [1175, 275], respondents: [1152, 976], scales: [1084, 322],
};

function Picture({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  const [width, height] = pictureDimensions[name];
  const filename = name === "catalog" ? "catalog-1163" : ["statistics", "respondents", "scales"].includes(name) ? `${name}-hd` : name;
  return <figure className={`landing-picture ${className}`}><img src={`/landing/${filename}.png`} alt={alt} width={width} height={height} loading={name === "builder" ? "eager" : "lazy"} /><figcaption>Пример интерфейса · демонстрационные данные</figcaption></figure>;
}

export function Landing() {
  const [signedIn, setSignedIn] = useState(Boolean(getCachedCurrentUser()));
  useEffect(() => {
    let active = true;
    document.title = "mindresearch — от вопросов к результатам";
    void initializeAuth().then(token => {
      if (active) setSignedIn(Boolean(token));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const create = signedIn ? "/app/surveys/new" : "/register";
  return <div className="landing">
    <header className="landing-header">
      <Link className="landing-brand" to="/" aria-label="Главная страница mindresearch"><Leaf size={27} />mindresearch</Link>
      <nav aria-label="Возможности платформы"><a href="#builder">Конструктор</a><a href="#catalog">Методики</a><a href="#results">Результаты</a></nav>
      <Link className="landing-header-action" to={signedIn ? "/app" : "/login"}>{signedIn ? "Мои опросы" : "Войти"}<ArrowRight size={16} /></Link>
    </header>
    <main>
      <section className="landing-hero landing-wrap">
        <div className="landing-hero-copy"><h1>От хороших вопросов<br />к понятным <em>результатам.</em></h1><p>Платформа для психологических исследований. Собирайте опросы из готовых методик и своих вопросов, приглашайте респондентов и изучайте результаты в одном месте.</p><div className="landing-actions"><Link className="landing-button" to={create}><Plus size={18} />{signedIn ? "Создать опрос" : "Начать исследование"}</Link><a className="landing-text-link" href="#builder">Посмотреть возможности<ArrowRight size={17} /></a></div><span className="landing-hero-note">От первого вопроса до выгрузки данных — весь процесс под рукой.</span></div>
        <div className="landing-hero-image"><div className="landing-browser"><span /><span /><span /><b>Ваше исследование</b></div><Picture name="builder" alt="Конструктор опроса с готовой методикой и собственным блоком вопросов" /></div>
      </section>
      <div className="landing-workflow landing-wrap"><div><span>01</span><strong>Соберите опрос</strong><p>Методики и ваши вопросы</p></div><ArrowRight /><div><span>02</span><strong>Поделитесь ссылкой</strong><p>Удобное прохождение на любом экране</p></div><ArrowRight /><div><span>03</span><strong>Изучите результаты</strong><p>Ответы, шкалы и качество прохождения</p></div></div>
      <section id="builder" className="landing-section landing-wrap landing-split"><div><h2>Ваш опрос.<br />Ваши правила.</h2><p className="landing-lead">Соберите исследование так, как задумали: от приветствия до последнего вопроса.</p><ul className="landing-benefits"><li><Check />Настройте начальный и финальный экраны, название и примерное время прохождения.</li><li><Check />Создавайте свои тесты: один или несколько вариантов ответа, текстовые и числовые поля.</li><li><Check />Меняйте порядок методик и собственных блоков. Отмечайте обязательные вопросы.</li><li><Check />Проверяйте опрос в предпросмотре. Черновик сохраняется автоматически.</li></ul><Link className="landing-text-link" to={create}>Собрать первый опрос<ArrowRight size={17} /></Link></div><Picture name="custom" alt="Собственный блок с вопросом, вариантами ответа и настройкой обязательности" /></section>
      <section id="catalog" className="landing-catalog"><div className="landing-wrap"><div className="landing-section-heading"><h2>Готовые методики.<br /><em>Меньше ручной работы.</em></h2><p>Найдите подходящий инструмент в каталоге. Изучите описание, добавьте его в опрос и используйте автоматический расчёт там, где он предусмотрен.</p></div><div className="landing-catalog-layout"><Picture name="catalog" alt="Каталог методик с поиском и фильтром категорий" /><div className="landing-feature-notes"><article><h3>Поиск и категории</h3><p>Ищите по названию, автору, категории или подкатегории. Сужайте выбор до интересующей области.</p></article><article><h3>Информация до добавления</h3><p>Откройте описание методики, чтобы понять, что она измеряет и подходит ли вашему исследованию.</p></article><article><h3>Автоматический подсчёт</h3><p>Для методик с расчётом платформа сама вычислит показатели. Результаты появятся в статистике.</p></article></div></div></div></section>
      <section className="landing-section landing-wrap landing-split"><div><h2>Опубликуйте.<br />Отправьте.<br /><em>Собирайте ответы.</em></h2><p className="landing-lead">Когда опрос готов, опубликуйте его и скопируйте ссылку. Отправляйте её в мессенджерах, по почте или размещайте там, где ваша аудитория.</p><ul className="landing-benefits"><li><Check />Храните незавершённые исследования в черновиках.</li><li><Check />Следите за количеством начатых и завершённых прохождений.</li><li><Check />Завершайте сбор ответов, когда исследование закончено.</li></ul></div><Picture name="share" alt="Карточка опубликованного опроса с кнопками копирования ссылки и статистики" /></section>
      <section className="landing-respondent landing-wrap"><div className="landing-section-heading"><h2>Удобно вам.<br />Понятно респонденту.</h2><p>Участнику достаточно открыть ссылку — регистрация не нужна. Опрос адаптируется к экрану, показывает прогресс и позволяет прерваться и продолжить позже.</p></div><div className="landing-devices"><Picture name="desktop" alt="Экран прохождения опроса на компьютере" className="landing-desktop" /><Picture name="phone" alt="Экран прохождения того же опроса на телефоне" className="landing-phone" /></div></section>
      <section id="results" className="landing-section landing-wrap"><div className="landing-section-heading"><h2>Ответы собраны.<br /><em>Что за ними стоит?</em></h2><p>От общего обзора исследования до конкретного респондента: смотрите ответы, рассчитанные шкалы и показатели процесса прохождения.</p></div><Picture name="statistics" alt="Статистика опроса: участники, завершённые прохождения и список результатов" /><Picture name="respondents" alt="Список респондентов с сортировкой, фильтрами и раскрытием ответов" className="landing-respondents-picture" /><div className="landing-results-grid"><Picture name="scales" alt="Автоматически рассчитанные показатели методики в результатах респондента" /><div className="landing-feature-notes"><article><h3>Результаты по методикам</h3><p>Раскрывайте ответы участника и смотрите рассчитанные значения шкал для методик с автоподсчётом.</p></article><article><h3>Время и качество прохождения</h3><p>Оценивайте скорость ответов, быстрые серии и другие доступные признаки. Они помогают изучать необычные прохождения; решение об исключении остаётся за вами.</p></article><article><h3>Фильтры и выгрузка</h3><p>Сортируйте и фильтруйте респондентов, выбирайте размер страницы и экспортируйте данные для дальнейшего анализа.</p></article></div></div></section>
      <section className="landing-extras landing-wrap"><article><h3>Представьте себя участникам</h3><p>Настройте публичный профиль исследователя и добавьте ссылку на него в начале опроса. Вы сами выбираете, будет ли профиль доступен другим.</p><Link className="landing-text-link" to={signedIn ? "/app/profile" : "/register"}>Настроить профиль<ArrowRight size={16} /></Link></article><article><h3>Не нашли нужную методику?</h3><p>Отправьте запрос на добавление. А пока можно собрать собственный блок вопросов и включить его в исследование.</p><Link className="landing-text-link" to={signedIn ? "/app/methodologies/suggest" : "/register"}>Запросить методику<ArrowRight size={16} /></Link></article></section>
      <section className="landing-faq landing-wrap"><h2>Несколько полезных деталей</h2>{[
        ["Можно объединить свои вопросы и готовые методики?", "Да. В одном опросе можно использовать несколько методик и собственные блоки, а затем менять их порядок."],
        ["Участник увидит свои результаты?", "Это зависит от настроек финального экрана. При создании опроса вы выбираете, показывать ли респонденту результаты методик."],
        ["Можно изменить опрос после получения ответов?", "После появления ответов изменение структуры ограничено, чтобы уже собранные данные оставались сопоставимыми. На странице редактирования будет объяснение этих ограничений."],
        ["Что означают показатели качества?", "Это признаки особенностей прохождения, а не доказательство недостоверности ответов. Смотрите доступность данных и отдельные метрики, прежде чем принимать решение."],
      ].map(([q, a]) => <details key={q}><summary>{q}<Plus size={18} /></summary><p>{a}</p></details>)}</section>
      <section className="landing-final landing-wrap"><Leaf size={35} /><h2>Следующее исследование<br />начинается с вашего вопроса.</h2><p>Соберите опрос — платформа поможет с остальным.</p><Link className="landing-button" to={create}>{signedIn ? "Создать опрос" : "Создать аккаунт"}<ArrowRight size={18} /></Link></section>
    </main><footer className="landing-footer landing-wrap"><Link className="landing-brand" to="/"><Leaf size={22} />mindresearch</Link><span>Психологические исследования — в одном месте.</span><a href="#" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Наверх ↑</a></footer>
  </div>;
}
