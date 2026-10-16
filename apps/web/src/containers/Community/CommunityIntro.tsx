import { Button } from "antd";

export function CommunityIntro({
  hasDraft,
  onStart,
}: {
  hasDraft: boolean;
  onStart: () => void;
}) {
  return (
    <section
      className="community-intro"
      aria-labelledby="community-intro-title"
    >
      <header className="intro-title">
        <h1 id="community-intro-title">Найти респондентов</h1>
      </header>
      <div className="intro-layout">
        <div className="intro-overview">
          <h2>Как это работает?</h2>
          <p className="intro-lead">
            Вы проходите опросы других.
            <br />
            <strong>А они — ваши.</strong>
          </p>
          <p className="intro-description">
            Здесь участники помогают друг другу собирать ответы для исследований.
            Проходите чужие опросы, получайте баллы и используйте их для продвижения
            своего — так его увидят другие участники и смогут пройти.
          </p>
        </div>
        <div className="intro-preparation">
          <div className="intro-card-heading">
            <h2>Начните с <span className="intro-anonymous">анонимной</span> карточки участника</h2>
          </div>
          <p>
            Она поможет подобрать опросы, для которых вы подходите: например,
            исследования для родителей или студентов определённого возраста.
          </p>
          <div className="intro-start">
            <Button type="primary" size="large" onClick={onStart}>
              {hasDraft
                ? "Продолжить заполнение карточки"
                : "Заполнить карточку участника"}
            </Button>
          </div>
          <p className="intro-privacy">
            Автор не видит вашу карточку. Данные используются только для подбора
            опросов.
          </p>
        </div>
      </div>
    </section>
  );
}
