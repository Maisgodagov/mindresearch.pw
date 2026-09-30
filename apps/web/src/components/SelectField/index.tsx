import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { selectFieldDefaults } from "./const";
import { Arrow, Control, Empty, Menu, Option, Root, SearchInput, Value } from "./styles";
import type { Props, SelectOption } from "./types";

type Position = { top: number; left: number; width: number; maxHeight: number };

export function SelectField({
  value,
  options,
  onChange,
  placeholder = "Выберите вариант",
  disabled = false,
  className,
  style,
  size = selectFieldDefaults.size,
  showSearch = false,
  filterOption = true,
  notFoundContent = "Ничего не найдено",
  listHeight = 280,
  getPopupContainer,
  ...ariaProps
}: Props) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<Position | null>(null);
  void getPopupContainer;

  const selected = options.find((option) => String(option.value) === String(value));
  const visibleOptions = useMemo(() => {
    if (!showSearch || !query) return options;
    return options.filter((option) => typeof filterOption === "function"
      ? filterOption(query, option)
      : String(option.label ?? "").toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }, [filterOption, options, query, showSearch]);

  function updatePosition() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const maxHeight = Math.max(120, Math.min(listHeight, window.innerHeight - 24));
    const below = window.innerHeight - rect.bottom;
    const above = rect.top;
    const placeAbove = below < Math.min(220, maxHeight) && above > below;
    setPosition({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
      top: placeAbove ? Math.max(8, rect.top - Math.min(maxHeight, 280) - 6) : rect.bottom + 5,
      width: rect.width,
      maxHeight,
    });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const update = () => updatePosition();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, listHeight]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function choose(option: SelectOption) {
    if (option.disabled) return;
    onChange(option.value);
    close();
    triggerRef.current?.focus();
  }

  function toggle() {
    if (disabled) return;
    if (open) close();
    else {
      setActiveIndex(Math.max(0, options.findIndex((option) => String(option.value) === String(value))));
      setOpen(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((option) => String(option.value) === String(value))));
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + visibleOptions.length) % visibleOptions.length);
    } else if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      const option = visibleOptions[activeIndex];
      if (option) choose(option);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
    }
  }

  return (
    <Root ref={rootRef} className={className} style={style}>
      <Control
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        aria-label={ariaProps["aria-label"]}
        disabled={disabled}
        $size={size}
        $open={open}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <Value $placeholder={!selected}>{selected?.label ?? placeholder}</Value>
        <Arrow $open={open} aria-hidden="true" />
      </Control>
      {open && position && typeof document !== "undefined" && createPortal(
        <Menu
          id={id}
          ref={menuRef}
          role="listbox"
          aria-label={ariaProps["aria-label"]}
          $maxHeight={position.maxHeight}
          style={{ position: "fixed", top: position.top, left: position.left, width: position.width }}
        >
          {showSearch && (
            <SearchInput
              autoFocus
              value={query}
              onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
              onKeyDown={(event) => {
                if (event.key === "Escape") { event.preventDefault(); close(); triggerRef.current?.focus(); }
                if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((current) => Math.min(current + 1, visibleOptions.length - 1)); }
                if (event.key === "Enter" && visibleOptions[activeIndex]) { event.preventDefault(); choose(visibleOptions[activeIndex]); }
              }}
              placeholder="Поиск..."
              aria-label="Поиск вариантов"
            />
          )}
          {visibleOptions.length ? visibleOptions.map((option, index) => {
            const isSelected = String(option.value) === String(value);
            return (
              <Option
                id={`${id}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                key={String(option.value)}
                disabled={option.disabled}
                $selected={isSelected}
                $active={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                {option.label}
              </Option>
            );
          }) : <Empty>{notFoundContent}</Empty>}
        </Menu>,
        document.body,
      )}
    </Root>
  );
}

export type { Props as SelectFieldProps, SelectOption } from "./types";
