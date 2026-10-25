import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { SortableSection } from "../SurveyBuilder/components/SortableBlocks";
import { Button } from "../../components/Button";

type DemoBlock = {
  id: string;
  title: string;
  custom?: boolean;
  gender: "auto" | "male" | "female";
  fallback: "male" | "female";
};
const initialBlocks: DemoBlock[] = [
  {
    id: "success",
    title: "Жизненная успешность",
    gender: "female",
    fallback: "male",
  },
  {
    id: "ambiguity",
    title: "Краткая шкала нетерпимости к неоднозначности (SAIS-7)",
    gender: "auto",
    fallback: "male",
  },
  {
    id: "stress",
    title: "Краткая шкала тревоги, депрессии и ПТСР (Котенёв)",
    gender: "auto",
    fallback: "male",
  },
  {
    id: "custom",
    title: "Дополнительные вопросы",
    custom: true,
    gender: "auto",
    fallback: "male",
  },
];
export function HeroBuilderDemo() {
  const [blocks, setBlocks] = useState(initialBlocks),
    [restored, setRestored] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [reservedHeight, setReservedHeight] = useState<number>();
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || blocks.length !== initialBlocks.length) return;
    const measure = () =>
      setReservedHeight(Math.ceil(list.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [blocks.length]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  useEffect(() => {
    if (blocks.length) return;
    const timer = window.setTimeout(() => {
      setRestored(true);
      setBlocks(initialBlocks.map((block) => ({ ...block })));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [blocks.length]);
  function update(id: string, patch: Partial<DemoBlock>) {
    setBlocks((old) =>
      old.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    );
  }
  function move(index: number, direction: number) {
    setRestored(false);
    setBlocks((old) => arrayMove(old, index, index + direction));
  }
  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setRestored(false);
    setBlocks((old) =>
      arrayMove(
        old,
        old.findIndex((b) => b.id === active.id),
        old.findIndex((b) => b.id === over.id),
      ),
    );
  }
  return (
    <div className="hero-composer">
      <h3>Соберите свой опрос</h3>
      <p className="inline-demo-note">
        Перетащите блоки, выберите бланк или уберите лишнее.
      </p>
      <div
        className="hero-composer-stage"
        style={{ minHeight: reservedHeight }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              ref={listRef}
              className={`hero-composer-list${restored ? " is-restored" : ""}`}
              aria-label="Блоки демонстрационного опроса"
            >
              {blocks.map((block, index) => (
                <SortableSection id={block.id} key={block.id}>
                  {(handle) => (
                    <div className="hero-demo-block" data-block-id={block.id}>
                      <div className="section-head">
                        {handle}
                        <div className="section-name">
                          <b>{block.title}</b>
                          <span>
                            {block.custom
                              ? "Собственный блок · без автоматического расчёта"
                              : "Подтверждённая методика · автоматический расчёт"}
                          </span>
                        </div>
                        <div className="hero-block-actions">
                          <Button
                            className="icon"
                            aria-label={`Выше: ${block.title}`}
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                          >
                            <ArrowUp size={15} />
                          </Button>
                          <Button
                            className="icon"
                            aria-label={`Ниже: ${block.title}`}
                            disabled={index === blocks.length - 1}
                            onClick={() => move(index, 1)}
                          >
                            <ArrowDown size={15} />
                          </Button>
                          <Button
                            className="icon delete-action"
                            aria-label={`Удалить: ${block.title}`}
                            onClick={() => {
                              setRestored(false);
                              setBlocks((old) =>
                                old.filter((b) => b.id !== block.id),
                              );
                            }}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                      {block.custom ? null : (
                        <div className="form-gender-control">
                          <span className="form-gender-label">
                            Бланк методики
                          </span>
                          <div
                            className="form-gender-options"
                            role="radiogroup"
                            aria-label={`Бланк: ${block.title}`}
                          >
                            {(
                              [
                                { value: "auto", label: "По полу" },
                                { value: "male", label: "Мужской" },
                                { value: "female", label: "Женский" },
                              ] as const
                            ).map((form) => (
                              <label key={form.value}>
                                <input
                                  type="radio"
                                  name={`hero-form-${block.id}`}
                                  value={form.value}
                                  checked={block.gender === form.value}
                                  onChange={() =>
                                    update(block.id, { gender: form.value })
                                  }
                                />
                                <span>{form.label}</span>
                              </label>
                            ))}
                          </div>
                          {block.gender === "auto" && (
                            <button
                              className="form-fallback"
                              onClick={() =>
                                update(block.id, {
                                  fallback:
                                    block.fallback === "male"
                                      ? "female"
                                      : "male",
                                })
                              }
                            >
                              Если пол не указан:{" "}
                              <u>
                                {block.fallback === "male"
                                  ? "мужской"
                                  : "женский"}
                              </u>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </SortableSection>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {!blocks.length && (
          <div className="hero-composer-empty" role="status">
            Все блоки удалены. Через секунду вернём пример.
          </div>
        )}
      </div>
      <span className="hero-demo-status" role="status" aria-live="polite">
        {blocks.length
          ? `${blocks.length} блока · изменения только в примере`
          : ""}
      </span>
    </div>
  );
}
