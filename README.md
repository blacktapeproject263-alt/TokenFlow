# ⏱️ Token Budget & Quota Telemetry Widget (`VidgetTokenLeft`)

[![Custom Element: Web Component](https://img.shields.io/badge/Element-%3Ctoken--budget--widget%3E-indigo.svg)](src/token-widget.js)
[![Zero Dependency: Vanilla JS](https://img.shields.io/badge/Dependencies-Zero%20(Native)-green.svg)](package.json)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](package.json)
[![GitHub Repository](https://img.shields.io/badge/GitHub-blacktapeproject263--alt%2FTokenFlow-blue.svg)](https://github.com/blacktapeproject263-alt/TokenFlow)

Легковесный, автономный веб-компонент (Custom Element) для интерактивного мониторинга расхода и остатка токенов контекстного окна в сессиях **Google Antigravity 2.0** и LLM-интерфейсах (Gemini, Claude, GPT).

---

## 🎯 Возможности

- **Визуальный прогресс-бар**: Плавная цветовая индикация состояния:
  - 🟢 **Optimal** (> 50% остатка) — безопасный рабочий диапазон.
  - 🟡 **Caution** (20% – 50% остатка) — приближение к лимиту, рекомендация сброса лишнего контекста.
  - 🔴 **Critical Low** (< 20% остатка) — риск выпадения ранних шагов из окна внимания.
- **Поддержка кастомных квот**: Пресеты для 1,000,000 токенов (Gemini Flash/Pro) и 2,000,000 токенов.
- **Калькулятор стоимости**: Автоматическая оценка стоимости расхода в USD.
- **Интерактивная симуляция**: Кнопки быстрой симуляции потребления (`+10k`, `+50k`, `+250k`) и сброса.
- **Изоляция Shadow DOM**: Стили не конфликтуют с родительской страницей (подходит для встраивания в `WebDashboards` или `abay_landing`).
- **Синхронизация**: Сохранение текущего состояния в `localStorage`.

---

## 🚀 Использование

### 1. Подключение скрипта
```html
<script type="module" src="path/to/VidgetTokenLeft/src/token-widget.js"></script>
```

### 2. Вставка тега
```html
<!-- Базовый виджет с лимитом 1M и начальным расходом 50k -->
<token-budget-widget limit="1000000" used="50000"></token-budget-widget>
```

---

## 📂 Структура проекта
```text
VidgetTokenLeft/
├── index.html              # Интерактивная демонстрационная витрина
├── package.json            # Манифест пакета
├── README.md               # Документация компонента
└── src/
    ├── token-widget.js     # Класс Custom Element <token-budget-widget>
    └── token-widget.css    # Glassmorphism стили и анимации
```
