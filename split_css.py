import os

with open('css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

headers = [
    (1, "00_variables"),
    (121, "01_base_reset"),
    (172, "02_main_layout"),
    (181, "03_header"),
    (301, "04_toolbar"),
    (475, "05_two_column_layout"),
    (485, "06_slot_cards"),
    (660, "07_inspector_sidebar"),
    (1088, "08_drawer"),
    (1365, "09_modals"),
    (1749, "10_responsive"),
    (1820, "11_print"),
    (1882, "12_single_screen_stage"),
    (2929, "13_v3_redesign"),
    (3324, "14_full_width_workbench"),
    (3507, "15_geek_workbench"),
    (4109, "16_retailer_deck"),
    (4283, "17_ambient_bg"),
    (4377, "18_modern_header"),
    (4850, "19_monitor_panel"),
    (5207, "20_dev_cabinet"),
    (5543, "21_toast_notifications"),
    (5653, "22_pro_ai_chat"),
    (5943, "23_synergy_btn"),
    (6057, "24_pro_chat_rich"),
    (6163, "25_hardware_guide_pill"),
    (6197, "26_faq_accordion"),
    (6344, "27_legal_footer"),
    (6474, "28_encyclopedia_modal"),
    (6686, "29_slot_tooltip"),
    (6793, "30_comprehensive_responsive")
]

os.makedirs('css/modules', exist_ok=True)

main_css_imports = []

for i in range(len(headers)):
    start_line = headers[i][0] - 1
    end_line = headers[i+1][0] - 1 if i + 1 < len(headers) else len(lines)
    
    filename = f"{headers[i][1]}.css"
    content = "".join(lines[start_line:end_line])
    
    with open(f"css/modules/{filename}", 'w', encoding='utf-8') as out_f:
        out_f.write(content)
        
    main_css_imports.append(f"@import './modules/{filename}';")

with open('css/main.css', 'w', encoding='utf-8') as out_f:
    out_f.write("\n".join(main_css_imports))

print("CSS split successfully into css/modules/ and css/main.css created.")
