with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add Guide Button in .header-brand
old_brand = """        <div class="header-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>
          </div>
          <span class="brand-title">PC BUILDER <span class="brand-badge">2026</span></span>
        </div>"""

new_brand = """        <div class="header-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>
          </div>
          <span class="brand-title">PC BUILDER <span class="brand-badge">2026</span></span>
          <button id="btn-hardware-guide" class="btn-guide-pill" type="button" title="Гид: Для чего каждый компонент в ПК?">
            <span class="guide-icon">💡</span>
            <span>Гид по деталям</span>
          </button>
        </div>"""

if old_brand in html:
    html = html.replace(old_brand, new_brand, 1)
    print("Added Guide button in header-brand.")
else:
    print("Warning: old_brand not found.")

# 2. Add FAQ and Legal Notice Footer right after details-section
faq_and_footer = """
    <!-- FAQ SECTION (ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ) -->
    <section class="faq-section" id="faq-section">
      <div class="faq-inner">
        <div class="faq-header">
          <span class="faq-badge">СПРАВОЧНИК & БАЗА ЗНАНИЙ</span>
          <h2 class="faq-title">Часто задаваемые вопросы (FAQ)</h2>
          <p class="faq-subtitle">Всё о совместимости, реальных ценах в Польше, балансе связок и выборе комплектующих</p>
        </div>

        <div class="faq-grid">
          <!-- FAQ 1 -->
          <details class="faq-card" open>
            <summary class="faq-summary">
              <span class="faq-icon">⚙️</span>
              <span class="faq-q-text">Как конфигуратор проверяет совместимость комплектующих?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p>Наш алгоритм производит многоуровневую проверку в реальном времени:</p>
              <ul>
                <li><strong>Сокет CPU и платы:</strong> проверяется точное совпадение (AMD AM4, AM5, Intel LGA1700, LGA1851).</li>
                <li><strong>Тип и поколение памяти:</strong> DDR4 и DDR5 имеют разные слоты и физически несовместимы. Конфигуратор не позволит выбрать DDR5 на DDR4-плату.</li>
                <li><strong>Габариты кулера и корпуса:</strong> высота башни (мм) сверяется с вместимостью корпуса. Для водяных систем (AIO) сверяется поддержка 240/360 мм радиаторов.</li>
                <li><strong>Мощность БП:</strong> суммируется пиковое TDP процессора, видеокарты и обвязки с обязательным запасом надежности 25–35%.</li>
              </ul>
            </div>
          </details>

          <!-- FAQ 2 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">💰</span>
              <span class="faq-q-text">Откуда берутся цены в злотых (PLN) и почему Morele/Ceneo?</span>
              <span class="faq-arrow faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p>Цены сканируются напрямую с крупнейших польских ритейлеров — <strong>Ceneo.pl, Morele.net и x-kom</strong>. Мы используем встроенный фильтр адекватности (Sanity Check): завышенные или ошибочные предложения (например, готовые ПК вместо отдельного процессора) автоматически отсекаются, гарантируя честные рыночные цены.</p>
            </div>
          </details>

          <!-- FAQ 3 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">⚖️</span>
              <span class="faq-q-text">Что такое Bottleneck (узкое место) и как оценивается синергия?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p><strong>Bottleneck</strong> — это дисбаланс, когда слабый компонент ограничивает потенциал более мощного.</p>
              <p>Например, в разрешении 1080p нагрузка на CPU максимальна, а в 4K упор почти всегда идет в GPU. Наш модуль и кнопка <em>«Проверить сборку с AI»</em> на базе Gemini Pro оценивают баланс связки с учетом разрешения, линий PCI-Express, объема видеопамяти VRAM и фаз питания VRM.</p>
            </div>
          </details>

          <!-- FAQ 4 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">🚀</span>
              <span class="faq-q-text">SSD против HDD: почему в 2026 году игры обязаны стоять на SSD?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p>Обычный жесткий диск (HDD) читает данные со скоростью <strong>120–180 МБ/с</strong>. Скоростной <strong>M.2 NVMe SSD</strong> читает со скоростью <strong>3500–7500 МБ/с</strong> (в 50 раз быстрее!).</p>
              <p>Современные игры с открытыми мирами подгружают текстуры прямо на ходу. На HDD это вызывает подвисания и микрофризы. Сегодня HDD нужен только как дешевый архив для семейных фото, видео и музыки.</p>
            </div>
          </details>

          <!-- FAQ 5 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">🧠</span>
              <span class="faq-q-text">В чем разница между бесплатным автоподбором и Gemini PRO AI?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p><strong>Бесплатный автоподбор:</strong> подбирает выверенные инженерные архетипы с шагом улучшения комплектующих под точную сумму бюджета.</p>
              <p><strong>Gemini PRO AI Чат-Консультант:</strong> ваш персональный ассистент. Вы можете написать ему любые пожелания своими словами («белый тихий корпус», «ПК для стримов CS2 за 5500 zł»), и AI сам составит сборку и сразу установит её на схему сайта!</p>
            </div>
          </details>

          <!-- FAQ 6 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">⚡</span>
              <span class="faq-q-text">Сколько оперативной памяти (RAM) нужно в 2026 году?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p><strong>16 ГБ (2×8GB):</strong> минимальный порог для ультрабюджетных сборок (до 3000 zł). Современные новинки с открытыми вкладками браузера уже загружают этот объем под завязку.</p>
              <p><strong>32 ГБ (2×16GB):</strong> золотой стандарт 2026 года для любых игр и работы. Обеспечивает запас под фоновые приложения и плавный геймплей.</p>
              <p><strong>64 ГБ+:</strong> требуется для профессионального 3D-моделирования, тяжелого видеомонтажа в 4K и работы с ИИ-моделями.</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- LEGAL NOTICE & FOOTER -->
    <footer class="app-footer-main" id="app-footer">
      <div class="footer-inner">
        <!-- Legal Notice 4-Column Grid -->
        <div class="footer-legal-grid">
          <div class="footer-legal-card">
            <div class="legal-card-header">
              <span class="legal-icon">⚖️</span>
              <h4>Правовое уведомление (Disclaimer)</h4>
            </div>
            <p>
              PC Builder является независимым некоммерческим справочным веб-инструментом. Все оценки совместимости, расчеты энергопотребления и FPS в играх носят информационный характер. Перед покупкой и сборкой ПК всегда сверяйтесь с официальной документацией и спецификациями производителей оборудования.
            </p>
          </div>

          <div class="footer-legal-card">
            <div class="legal-card-header">
              <span class="legal-icon">🏷️</span>
              <h4>Товарные знаки и бренды</h4>
            </div>
            <p>
              Все названия брендов, логотипы и товарные знаки (включая Intel®, Core™, AMD®, Ryzen™, Radeon™, NVIDIA®, GeForce®, RTX™, ASUS®, MSI®, Gigabyte®, Deepcool®, Corsair® и др.) принадлежат их законным правообладателям. Их упоминание на сайте служит исключительно для идентификации комплектующих.
            </p>
          </div>

          <div class="footer-legal-card">
            <div class="legal-card-header">
              <span class="legal-icon">🏪</span>
              <h4>Цены и партнерские ссылки</h4>
            </div>
            <p>
              Цены в польских злотых (PLN) агрегируются из открытых источников ритейлеров (Ceneo.pl, Morele.net, x-kom.pl). Сайт не является продавцом товаров. Ссылки на внешние магазины могут являться партнерскими, что помогает поддерживать и развивать проект без каких-либо дополнительных затрат для пользователей.
            </p>
          </div>

          <div class="footer-legal-card">
            <div class="legal-card-header">
              <span class="legal-icon">🛡️</span>
              <h4>Конфиденциальность и данные</h4>
            </div>
            <p>
              Сервис не собирает персональные данные и не требует регистрации. Ваши черновики сборок и пользовательские настройки сохраняются исключительно локально на вашем компьютере (технология LocalStorage в браузере) и не передаются третьим лицам.
            </p>
          </div>
        </div>

        <!-- Bottom Footer Row -->
        <div class="footer-bottom-bar">
          <div class="footer-brand-meta">
            <div class="footer-logo-box">💻</div>
            <div class="footer-meta-texts">
              <span class="footer-copy-brand">PC BUILDER 2026</span>
              <span class="footer-copy-text">Умный конфигуратор ПК с искусственным интеллектом Gemini Pro</span>
            </div>
          </div>
          <div class="footer-nav-links">
            <button type="button" class="footer-link-action" id="footer-btn-guide">💡 Гид по деталям</button>
            <a href="#faq-section" class="footer-link-action">❓ Частые вопросы (FAQ)</a>
            <a href="#main-stage" class="footer-link-action">↑ Наверх к сборке</a>
          </div>
        </div>
      </div>
    </footer>
"""

old_section_end = """        <!-- Saved Builds -->
        <div class="panel" id="saved-builds-panel">
          <div class="panel-header">
            <h3 data-i18n="dash.saved">СОХРАНЁННЫЕ СБОРКИ</h3>
          </div>
          <div id="saved-builds-list" class="saved-builds-list">
            <div class="placeholder-text" data-i18n="dash.saved.empty">Нет сохранённых конфигураций</div>
          </div>
        </div>
      </div>
    </section>"""

if old_section_end in html:
    html = html.replace(old_section_end, old_section_end + '\n' + faq_and_footer, 1)
    print("Added FAQ and Legal Notice Footer.")
else:
    print("Warning: old_section_end not found.")

# 3. Add Hardware Guide Modal before closing body tag
guide_modal_html = """
    <!-- HARDWARE GUIDE MODAL (ДЛЯ ЧЕГО КАЖДАЯ ДЕТАЛЬ В ПК) -->
    <div id="hardware-guide-overlay" class="modal-overlay hidden"></div>
    <div id="hardware-guide-modal" class="modal hardware-guide-modal hidden" role="dialog" aria-modal="true">
      <div class="modal-header guide-modal-header">
        <div class="guide-header-title-box">
          <div class="guide-header-icon">💡</div>
          <div>
            <h2 class="guide-modal-title">Энциклопедия железа: Для чего каждая деталь в ПК?</h2>
            <p class="guide-modal-subtitle">Понятное руководство простыми словами для новичков и полезная шпаргалка по выбору идеального баланса</p>
          </div>
        </div>
        <button id="hardware-guide-close" class="modal-close-btn" aria-label="Close guide">×</button>
      </div>

      <div class="guide-modal-body">
        <div class="guide-cards-grid">
          <!-- 1. CPU -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">💻</span>
              <div class="guide-comp-info">
                <h3>Процессор (CPU)</h3>
                <span class="guide-role-badge">«Мозг компьютера»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="cpu">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Выполняет все расчеты в системе: обсчитывает поведение искусственного интеллекта в играх, физику взрывов и разрушений, сетевой код и геометрию мира. Чем мощнее процессор, тем выше стабильность частоты кадров (1% Low FPS).
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Не гонитесь за 16 ядрами только для игр — 6-8 быстрых ядер (Ryzen 5 7600 или Ryzen 7 7800X3D с 3D V-Cache) дадут максимальный FPS при меньшем нагреве.</span>
            </div>
          </div>

          <!-- 2. Motherboard -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🖲️</span>
              <div class="guide-comp-info">
                <h3>Материнская плата</h3>
                <span class="guide-role-badge">«Скелет и нервная система»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="motherboard">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Объединяет все детали в единый организм. Через её дорожки процессор общается с видеокартой и памятью. Питает процессор через зону VRM (цепь питания).
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Сокет платы обязан строго совпадать с сокетом процессора (AM4 к AM4, AM5 к AM5, LGA1700 к LGA1700). Обращайте внимание на наличие радиаторов на VRM, чтобы плата не перегревалась.</span>
            </div>
          </div>

          <!-- 3. Cooler -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">❄️</span>
              <div class="guide-comp-info">
                <h3>Кулер / Охлаждение</h3>
                <span class="guide-role-badge">«Защита от перегрева»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="cooler">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Отводит колоссальное количество тепла от кристалла CPU. Если охлаждение слабое, процессор моментально нагревается до 95°C и начинает сбрасывать частоты («троттлить»), вызывая лаги.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Для большинства процессоров с TDP до 120W достаточно надежного воздушного башенного кулера (например, Deepcool AK400 или AK620). Водянка (СЖО) нужна горячим флагманам вроде Core i7/i9.</span>
            </div>
          </div>

          <!-- 4. RAM -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">⚡</span>
              <div class="guide-comp-info">
                <h3>Оперативная память (RAM)</h3>
                <span class="guide-role-badge">«Быстрый рабочий буфер»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="ram">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Сверхбыстрая память, куда загружаются текстуры, объекты текущего уровня и открытые программы прямо сейчас. При нехватке RAM игра начинает зависать, обращаясь к медленному диску.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Всегда ставьте <strong>две планки памяти</strong> (2×16GB) для работы в двухканальном режиме — это почти удваивает скорость обмена данными. 32GB DDR5 — золотой стандарт в 2026 году.</span>
            </div>
          </div>

          <!-- 5. GPU -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🎮</span>
              <div class="guide-comp-info">
                <h3>Видеокарта (GPU)</h3>
                <span class="guide-role-badge">«Главный двигатель игр»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="gpu">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Отвечает за отрисовку графики, шейдеры, освещение, эффекты трассировки лучей (Ray Tracing) и разрешение экрана. На видеокарту обычно уходит от 40% до 50% бюджета всего игрового ПК.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Для 1440p (2K) гейминга выбирайте карты минимум с 12-16GB видеопамяти VRAM (RTX 4070, RX 7800 XT или новее). 8GB видеопамяти в 2026 году подходят только для 1080p.</span>
            </div>
          </div>

          <!-- 6. SSD -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🚀</span>
              <div class="guide-comp-info">
                <h3>SSD Накопитель (NVMe)</h3>
                <span class="guide-role-badge">«Молниеносная память»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="ssd">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Электронный накопитель без движущихся частей. Windows загружается за 5-7 секунд, а уровни в играх — за пару мгновений. В современных играх SSD обязателен для мгновенной подгрузки текстур.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Выбирайте M.2 NVMe накопители стандарта PCIe 4.0 (скорость 4000-7000 МБ/с). Рекомендуемый объем — от 1TB до 2TB, так как современные игры весят по 100-150 ГБ каждая.</span>
            </div>
          </div>

          <!-- 7. HDD -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">💾</span>
              <div class="guide-comp-info">
                <h3>Жёсткий диск (HDD)</h3>
                <span class="guide-role-badge">«Вместительный архив»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="hdd">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Механический магнитный диск. Медленный (в 50 раз медленнее SSD), но дает огромный объем за небольшие деньги. Идеален под хранение фотоархивов, фильмов, сериалов и резервных копий.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Не ставьте на HDD операционную систему и новые игры. Это опциональный компонент только для тех, кому нужны терабайты недорогого файлового хранилища.</span>
            </div>
          </div>

          <!-- 8. PSU -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🔌</span>
              <div class="guide-comp-info">
                <h3>Блок питания (PSU)</h3>
                <span class="guide-role-badge">«Сердце компьютера»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="psu">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Преобразует переменный ток 220V из розетки в точные стабильные напряжения 12V, 5V и 3.3V. Качественный блок защищает все дорогостоящие детали от коротких замыканий и скачков напряжения в сети.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Никогда не экономьте на БП! Выбирайте проверенные бренды с сертификатом <strong>80 PLUS Bronze или Gold</strong> и запасом мощности не менее 20% от суммарного потребления ПК.</span>
            </div>
          </div>

          <!-- 9. Case -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">📦</span>
              <div class="guide-comp-info">
                <h3>Корпус (Case)</h3>
                <span class="guide-role-badge">«Дом и вентиляция»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="case">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Задает внешний вид сборки, защищает от пыли и обеспечивает сквозной воздушный поток. Глухие корпуса без забора воздуха превращают систему в духовку, заставляя вентиляторы шуметь на 100%.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Выбирайте корпуса с сетчатой передней панелью (Mesh) и пылевыми фильтрами. Убедитесь, что максимальная длина видеокарты корпуса больше выбранной модели GPU.</span>
            </div>
          </div>

          <!-- 10. Monitor -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🖥️</span>
              <div class="guide-comp-info">
                <h3>Монитор (Monitor)</h3>
                <span class="guide-role-badge">«Окно в систему»</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="monitor">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Передает все труды вашей видеокарты. Частота обновления (Гц) определяет плавность движений в играх, а тип матрицы (IPS, VA, OLED) — насыщенность цветов и глубину контраста.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">💡 Совет по выбору:</span>
              <span>Для динамичных шутеров важна герцовка от 144Hz до 240Hz. Для карт уровня RTX 4070 / RX 7800 XT идеален монитор 27" 1440p (2560x1440). 4K экраны требуют флагманских видеокарт.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
"""

html = html.replace('  </body>', guide_modal_html + '\n  </body>')
print("Added Hardware Guide Modal.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully.")
