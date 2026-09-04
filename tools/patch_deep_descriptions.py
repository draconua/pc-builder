with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the body of hardware-guide-modal with mature technical descriptions
old_guide_body_start = '<div class="guide-cards-grid">'
old_guide_body_end = '<!-- 10. Monitor -->'
idx1 = html.find(old_guide_body_start)
idx2 = html.find('</div>\n        </div>\n      </div>\n    </div>', idx1)

if idx1 != -1 and idx2 != -1:
    new_guide_grid = """<div class="guide-cards-grid">
          <!-- 1. CPU -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">💻</span>
              <div class="guide-comp-info">
                <h3>Процессор (CPU - Central Processing Unit)</h3>
                <span class="guide-role-badge">Вычислительное ядро архитектуры x86-64</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="cpu">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Осуществляет диспетчеризацию команд, физические симуляции (Havok/Chaos), логику ИИ, обработку геометрии и сетевую синхронизацию. Скорость процессора определяет темп подготовки кадров для видеокарты и формирует ключевой показатель комфорта — 1% Low FPS.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>В играх критичны производительность на такт (IPC) и объем кэша L3. Например, микросхемы с технологией 3D V-Cache (Ryzen 7 7800X3D) радикально сокращают латентность обращений к оперативной памяти с ~65 нс до ~12 нс, исключая микростаттеры в киберспорте и открытых мирах.</span>
            </div>
          </div>

          <!-- 2. Motherboard -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🖲️</span>
              <div class="guide-comp-info">
                <h3>Материнская плата (Motherboard)</h3>
                <span class="guide-role-badge">Системная магистраль и подсистема питания VRM</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="motherboard">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Коммутирует все узлы через шины PCI-Express, интерфейсы DMI/Infinity Fabric и каналы памяти DDR. Подсистема питания VRM (Voltage Regulator Module) преобразует 12V от блока питания в рабочие напряжения ядер Vcore (~1.1–1.3V).
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Количество реальных фаз питания и силовых сборок (DrMOS на 60–90A) с массивными алюминиевыми радиаторами определяют, сможет ли плата удерживать максимальные буст-частоты процессора без термического троттлинга цепей питания (VRM > 105°C).</span>
            </div>
          </div>

          <!-- 3. Cooler -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">❄️</span>
              <div class="guide-comp-info">
                <h3>Охлаждение процессора (Air / Liquid Cooler)</h3>
                <span class="guide-role-badge">Термодинамический контур рассеивания тепла</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="cooler">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Отводит тепло от теплораспределительной крышки (IHS) кремниевого кристалла процессора. При превышении температурного порога (TjMax ~89–100°C) алгоритмы Precision Boost и Thermal Velocity Boost снижают частоты и производительность.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Для энергоэффективных CPU до 130W (Ryzen 5/7, Core i5) оптимальны башенные кулеры с 4–7 тепловыми трубками из спеченной меди. Жидкостные СЖО с радиатором 360 мм необходимы процессорам с энергопотреблением свыше 200W в режиме PL2/MTP.</span>
            </div>
          </div>

          <!-- 4. RAM -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">⚡</span>
              <div class="guide-comp-info">
                <h3>Оперативная память (RAM - DDR4 / DDR5)</h3>
                <span class="guide-role-badge">Высокоскоростная буферизация данных низкой латентности</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="ram">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Служит промежуточным хранилищем для машинного кода и декомпрессированных текстур перед передачей в кэш-память процессора. Пропускная способность формируется частотой (МГц) и первичными/вторичными таймингами (CL/tRCD/tRP/tRAS).
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Установка двух модулей активирует двухканальный режим (Dual-Channel), удваивая ширину шины данных до 128 бит. В 2026 году золотой стандарт — 32 ГБ (2×16GB) DDR5-6000 с таймингами CL30 при синхронном соотношении UCLK:MCLK 1:1.</span>
            </div>
          </div>

          <!-- 5. GPU -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🎮</span>
              <div class="guide-comp-info">
                <h3>Видеокарта (GPU - Graphics Processing Unit)</h3>
                <span class="guide-role-badge">Массивно-параллельный графический вычислитель</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="gpu">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Оснащена тысячами вычислительных ядер (CUDA / Stream Processors), специализированными RT-ядрами трассировки лучей и тензорными блоками нейросетевого апскейлинга. Обрабатывает трехмерную геометрию, текстурирование и шейдерные эффекты.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Объем и пропускная способность видеопамяти (VRAM) имеют решающее значение: при нехватке видеопамяти ресурсы аварийно выгружаются в ОЗУ через PCIe, вызывая дропы FPS. Для 1440p в современных играх требуется не менее 12–16 ГБ VRAM, а для 4K — от 16 ГБ GDDR6X/GDDR7.</span>
            </div>
          </div>

          <!-- 6. SSD -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🚀</span>
              <div class="guide-comp-info">
                <h3>Твердотельный накопитель (SSD M.2 NVMe)</h3>
                <span class="guide-role-badge">Энергонезависимая 3D NAND память на шине PCI-Express</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="ssd">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Обеспечивает скорость линейного чтения до 5000–7500 МБ/с по протоколу NVMe 1.4/2.0. Поддерживает аппаратную спецификацию Microsoft DirectStorage, позволяющую видеокарте загружать ассеты напрямую из флеш-памяти в обход задержек центрального процессора.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Для стабильной производительности важна скорость произвольного чтения 4K блоков (IOPS) и наличие выделенного DRAM-буфера или поддержки HMB (Host Memory Buffer), что предотвращает просадку скорости при длительных операциях записи.</span>
            </div>
          </div>

          <!-- 7. HDD -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">💾</span>
              <div class="guide-comp-info">
                <h3>Жёсткий диск (HDD - Hard Disk Drive)</h3>
                <span class="guide-role-badge">Магнитный архив высокой плотности записи</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="hdd">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Электромеханический диск со шпинделем 5400–7200 об/мин. Скорость ограничена планкой 140–200 МБ/с при механических задержках позиционирования головок в 12–18 мс (в 200 раз медленнее NVMe).
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Используется исключительно как холодное файловое хранилище для видеоархивов, резервных копий и документов с минимальной стоимостью за терабайт. Установка современных ОС и требовательных игр на HDD в 2026 году категорически не рекомендуется.</span>
            </div>
          </div>

          <!-- 8. PSU -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🔌</span>
              <div class="guide-comp-info">
                <h3>Блок питания (PSU - Power Supply Unit)</h3>
                <span class="guide-role-badge">Импульсный стабилизатор электропитания постоянного тока</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="psu">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Преобразует сетевой переменный ток 220V в прецизионно стабилизированные шины +12V, +5V и +3.3V с резонансной топологией LLC и раздельной стабилизацией DC-DC.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Современные видеокарты формируют импульсные всплески потребления длительностью до 10 мс (Transient Spikes), превышающие номинальное TDP в 1.8–2 раза. Стандарт ATX 3.0/3.1 с разъемом 12V-2x6 спроектирован для бессбойного поглощения перегрузок до 200%.</span>
            </div>
          </div>

          <!-- 9. Case -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">📦</span>
              <div class="guide-comp-info">
                <h3>Корпус (Chassis / Enclosure)</h3>
                <span class="guide-role-badge">Несущая аэродинамическая рама и термоинтерфейс среды</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="case">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Формирует конвекционный воздушный тракт и защищает электронику от электромагнитных наводок (EMI). Обеспечивает физический клиренс для длиннобазных видеокарт (300–360 мм) и массивных кулеров.
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Сетчатая перфорированная передняя панель (High-Airflow Mesh) снижает гидравлическое сопротивление входящего потока воздуха, обеспечивая дельту температур основных узлов на 10–18°C ниже, чем в глухих стеклянных конструкциях.</span>
            </div>
          </div>

          <!-- 10. Monitor -->
          <div class="guide-component-card">
            <div class="guide-card-top">
              <span class="guide-comp-icon">🖥️</span>
              <div class="guide-comp-info">
                <h3>Монитор (Display Device)</h3>
                <span class="guide-role-badge">Устройство кадровой развертки и визуализации</span>
              </div>
              <button type="button" class="guide-quick-pick-btn" data-guide-cat="monitor">Выбрать в каталоге →</button>
            </div>
            <p class="guide-comp-desc">
              Принимает цифровой видеопоток по протоколам DisplayPort 1.4a/2.1 и HDMI 2.1. Определяет плотность пикселей (PPI), цветопередачу и время отклика матрицы (GtG).
            </p>
            <div class="guide-tip-box">
              <span class="guide-tip-label">⚙️ Архитектурные нюансы:</span>
              <span>Матрицы Fast-IPS и OLED обеспечивают отклик от 1 мс до 0.03 мс, устраняя размытие в динамике. Частота 144–240 Гц в сочетании с технологиями адаптивной синхронизации (G-Sync Compatible / AMD FreeSync) устраняет разрывы кадров (Tearing) без инпут-лага V-Sync.</span>
            </div>
          </div>
        </div>"""
    
    html = html[:idx1] + new_guide_grid + html[idx2+len('</div>\n        </div>\n      </div>\n    </div>'):]
    print("Replaced Hardware Guide cards with deep technical architecture descriptions.")
else:
    print("Warning: guide body indices not found.")

# Update FAQ section with practical engineering topics
faq_section_start = '<section class="faq-section" id="faq-section">'
faq_section_end = '</section>'
faq_idx1 = html.find(faq_section_start)
faq_idx2 = html.find(faq_section_end, faq_idx1)

if faq_idx1 != -1 and faq_idx2 != -1:
    new_faq_section = """<section class="faq-section" id="faq-section">
      <div class="faq-inner">
        <div class="faq-header">
          <span class="faq-badge">СПРАВОЧНИК & БАЗА ЗНАНИЙ</span>
          <h2 class="faq-title">Часто задаваемые вопросы (FAQ)</h2>
          <p class="faq-subtitle">Инженерные нюансы подбора комплектующих, баланса фреймтайма и актуальности цен на рынке</p>
        </div>

        <div class="faq-grid">
          <!-- FAQ 1 -->
          <details class="faq-card" open>
            <summary class="faq-summary">
              <span class="faq-icon">⚙️</span>
              <span class="faq-q-text">Как алгоритм рассчитывает совместимость и запас надежности?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p>Алгоритм конфигуратора выполняет комплексную валидацию по трем независимым контурам:</p>
              <ul>
                <li><strong>Физический контур:</strong> аппаратная сверка сокетов (AM4, AM5, LGA1700, LGA1851), механических ключей слотов ОЗУ (DDR4 vs DDR5), габаритов башенного кулера относительно ширины корпуса и длины видеокарты.</li>
                <li><strong>Электрический баланс:</strong> расчет суммарного потребления системы с учетом импульсных пиков видеокарты (Transient Spikes) и калибровкой необходимого запаса мощности БП на 25–35% для работы в зоне максимального КПД кривой 80 PLUS.</li>
                <li><strong>Логическая синергия:</strong> предупреждения о нерациональных связках — например, установка процессора серии 'K' на бюджетную материнскую плату H610 без радиаторов на фазах питания VRM.</li>
              </ul>
            </div>
          </details>

          <!-- FAQ 2 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">⚖️</span>
              <span class="faq-q-text">Что такое Bottleneck и почему 1% Low FPS важнее среднего значения?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p><strong>Bottleneck (узкое место)</strong> — состояние дисбаланса, при котором один из компонентов ограничивает раскрытие потенциала остальных.</p>
              <p>Средний FPS часто обманчив, так как отражает производительность видеокарты в спокойных сценах. В моменты интенсивных взрывов, перестрелок или быстрого перемещения на сцену выходит процессор и тайминги ОЗУ: если CPU не успевает рассчитать геометрию и физику кадра, GPU простаивает, вызывая микростаттеры и дропы 1% Low FPS. Кнопка <em>«Проверить сборку с AI»</em> анализирует стабильность именно этого показателя.</p>
            </div>
          </details>

          <!-- FAQ 3 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">⚡</span>
              <span class="faq-q-text">DDR4 против DDR5 в 2026 году: где оправдана экономия, а где нужен переход?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p><strong>DDR4:</strong> сохраняет экономический смысл только в ультрабюджетном сегменте (сборки до 3000–3500 zł на платформах AMD AM4 или Intel LGA1700 с памятью 3200–3600 МГц), где каждая сэкономленная сотня злотых перенаправляется в видеокарту.</p>
              <p><strong>DDR5:</strong> безальтернативный стандарт для всех современных платформ (AMD AM5, Intel LGA1851). Благодаря чипам Hynix A-die и комплектам DDR5-6000 CL30 задержки сравнялись с DDR4, а пропускная способность удвоилась, что дает от 15% до 25% прироста минимального фреймрейта в современных играх на движке Unreal Engine 5.</p>
            </div>
          </details>

          <!-- FAQ 4 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">🚀</span>
              <span class="faq-q-text">M.2 NVMe против SATA SSD и HDD: требования современных игровых движков</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p>Современные игры перешли на архитектуру потокового стриминга геометрии и виртуализированных текстур (Microsoft DirectStorage, Unreal Engine Nanite). Скорости SATA SSD (~500 МБ/с) и тем более HDD (~150 МБ/с) физически недостаточно для прокачки 10–15 ГБ данных в секунду.</p>
              <p>Твердотельные накопители <strong>M.2 NVMe PCIe 4.0</strong> (со скоростью 5000–7400 МБ/с) исключают «заикания» мира при повороте камеры, обеспечивают мгновенный запуск локаций и не создают очереди ожидания для графического процессора.</p>
            </div>
          </details>

          <!-- FAQ 5 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">💰</span>
              <span class="faq-q-text">Как формируются цены в злотых (PLN) и фильтруются аномалии ритейлеров?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p>Конфигуратор использует регулярную синхронизацию с крупнейшими польскими торговыми площадками — <strong>Ceneo.pl, Morele.net и x-kom.pl</strong>.</p>
              <p>Для предотвращения искажений внедрен алгоритм статистического отсева (Sanity Check): любые аномальные выбросы цен (например, когда поиск маркетплейса ошибочно привязывает к карточке процессора готовый ПК за 15000 zł или кулер за 100 zł) автоматически блокируются, защищая точность итоговой стоимости сборки.</p>
            </div>
          </details>

          <!-- FAQ 6 -->
          <details class="faq-card">
            <summary class="faq-summary">
              <span class="faq-icon">🧠</span>
              <span class="faq-q-text">В чем разница между базовым автоподбором и Gemini PRO AI-консультантом?</span>
              <span class="faq-chevron">▾</span>
            </summary>
            <div class="faq-content">
              <p><strong>Бесплатный автоподбор:</strong> математически оптимизирует конфигурацию по матрице эталонных архетипов, распределяя бюджет с точностью до злотого для максимизации соотношения FPS/Цена.</p>
              <p><strong>Gemini PRO AI Консультант:</strong> специализированная нейросетевая модель с глубоким пониманием архитектур. Вы можете описать любые специфические задачи («тихая белая сборка без RGB», «ПК для одновременного рендера видео в 4K и стримов на Twitch», «упор на тишину и минимальные децибелы»), и AI не только объяснит логику каждого выбора, но и <em>в один клик применит выбранные комплектующие на интерактивной схеме</em>.</p>
            </div>
          </details>
        </div>
      </div>
    </section>"""

    html = html[:faq_idx1] + new_faq_section + html[faq_idx2+len('</section>'):]
    print("Replaced FAQ section with substantive engineering topics.")
else:
    print("Warning: faq section indices not found.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully.")
