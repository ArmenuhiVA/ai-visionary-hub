import type { Lang } from "@/i18n";

export type CvEntry = {
  period: string;
  role: string;
  org: string;
  bullets?: string[];
  url?: string;
};

export type CvData = {
  sections: {
    education: string;
    experience: string;
    pastExperience: string;
    skills: string;
    languages: string;
    publications: string;
    other: string;
  };
  education: CvEntry[];
  experience: CvEntry[];
  pastExperience: CvEntry[];
  skills: string[];
  languages: { name: string; level: string }[];
  publications: string[];
  other: string[];
};

export const CV: Record<Lang, CvData> = {
  en: {
    sections: {
      education: "Education",
      experience: "Current Positions",
      pastExperience: "Past Experience",
      skills: "Professional Skills",
      languages: "Languages",
      publications: "Publications & Research",
      other: "Additional Information",
    },
    education: [
      {
        period: "2013–2016",
        role: "PhD (Aspirantura)",
        org: "Institute for Informatics and Automation Problems, NAS RA",
        bullets: [
          "PhD in Technical Sciences — Mathematical and Software Support of Computing Machines, Complexes, Systems and Networks",
        ],
      },
      {
        period: "2011–2013",
        role: "Master of Engineering (with Honors)",
        org: "Gavar State University",
        bullets: ["Informatics and Computing Technology"],
      },
      {
        period: "2007–2011",
        role: "Bachelor of Engineering (with Honors)",
        org: "Gavar State University",
        bullets: ["Informatics and Computing Technology"],
      },
    ],
    experience: [
      {
        period: "Jul 2025 – present",
        role: "Researcher",
        org: "Institute for Informatics and Automation Problems, NAS RA",
        bullets: ["AI-focused scientific research."],
      },
      {
        period: "Jan 2023 – present",
        role: "Lecturer",
        org: "French University in Armenia — Faculty of Informatics and Applied Mathematics",
        bullets: [
          "AI courses at bachelor and master level",
          "Curriculum and course material development",
          "Supervising student projects and internships",
        ],
      },
      {
        period: "May 2017 – present",
        role: "Assistant Lecturer",
        org: "National Polytechnic University of Armenia — Microsoft IT Academy",
        bullets: [
          "Python, Machine Learning, Deep Learning, Generative AI",
          "Course design and material development",
        ],
      },
      {
        period: "Sep 2018 – present",
        role: "Head of Department",
        org: "Department of Informatics and Physics-Mathematics, Gavar State University",
        bullets: [
          "Leading the “Computer Engineering” bachelor program",
          "Curriculum, learning outcomes and study plans",
          "Faculty selection",
        ],
      },
      {
        period: "Sep 2013 – present",
        role: "Lecturer",
        org: "Gavar State University",
        bullets: [
          "AI and Machine Learning, AI Tools, AI Systems, Neural Networks",
        ],
      },
      {
        period: "Jan 2024 – present",
        role: "Lecturer",
        org: "Voodoo Center / ARDY Academy",
        url: "https://ardy.am/am/course/45",
        bullets: ["Data Science & Machine Learning, AI Literacy (AI4ALL)"],
      },
      {
        period: "Sep 2024 – present",
        role: "Instructor",
        org: "AI Generation Program, FAST Foundation",
        bullets: ["Machine Learning and Deep Learning track"],
      },
    ],
    pastExperience: [
      {
        period: "May 2022 – Jul 2023",
        role: "Instructor",
        org: "Picsart Academy",
        bullets: ["Programming and data-science courses, curriculum and materials."],
      },
      {
        period: "Nov 2022 – Jul 2023",
        role: "Educational Programs Expert",
        org: "Armenian State University of Economics",
        bullets: [
          "Member of working group designing BSc “Information Systems” and MSc “IT in Business” programs.",
        ],
      },
      {
        period: "Jun 2020 – Sep 2021",
        role: "Programming & AI Consultant",
        org: "Brusov State University",
        bullets: [
          "HayLingvoTech grant — BSc in Computational Linguistics curriculum design and faculty training.",
        ],
      },
      {
        period: "Jul 2021 – Mar 2022",
        role: "Education Expert",
        org: "National Center for Professional Education Quality Assurance",
        bullets: ["Accreditation expert group member."],
      },
      {
        period: "Oct 2017 – Mar 2025",
        role: "Co-founder & CTO",
        org: "Luseen Mobile",
        url: "https://www.luseen.com",
        bullets: ["Software architect, backend engineer, project manager."],
      },
      {
        period: "Mar 2015 – Oct 2020",
        role: "Co-founder & Director",
        org: "Luseen Technologies Foundation",
        url: "https://www.luseen.am",
        bullets: ["Educational programs coordination."],
      },
      {
        period: "Sep 2016 – Sep 2018",
        role: "Head of IT Department",
        org: "Gavar State University",
        bullets: [
          "IT strategy across all university operations",
          "Educational software market research",
          "Department reporting to Rector and Scientific Council",
        ],
      },
      {
        period: "Sep 2011 – Aug 2016",
        role: "Software Developer",
        org: "Gavar State University",
        bullets: [
          "www.gsu.am development & maintenance (PHP, jQuery, Ajax, MySQL)",
          "Subdomain sites design and development",
          "CMS improvements, SEO/SMO, IT consulting",
          "E-learning GSU LMS deployment and maintenance",
        ],
      },
    ],
    skills: [
      "IT Trainer",
      "Python · Machine Learning · Deep Learning",
      "ML/DL frameworks and tools",
      "Java · OOP",
      "Database design · SQL · MySQL · MongoDB",
    ],
    languages: [
      { name: "Armenian", level: "Native" },
      { name: "Russian", level: "Good" },
      { name: "English", level: "Good" },
    ],
    publications: [
      "Around 15 scientific articles",
      "Research interests: machine and deep learning, computer-based testing, digital image processing",
    ],
    other: [
      "Participated in ~15 international workshops and training programs as university representative (Italy, Germany, Austria, Sweden, UK, Spain, Bulgaria)",
      "Author and lead instructor of Python and Artificial Intelligence courses at NPUA in collaboration with the Ministry of High-Tech Industry",
      "Designed and delivered faculty-development training at NPUA Continuing Education Center",
      "Member of the Scientific Council of Gavar State University",
    ],
  },

  hy: {
    sections: {
      education: "Կրթություն",
      experience: "Ներկայիս պաշտոններ",
      pastExperience: "Անցյալ փորձառություն",
      skills: "Մասնագիտական հմտություններ",
      languages: "Լեզվի իմացություն",
      publications: "Գիտական հրապարակումներ",
      other: "Այլ տվյալներ",
    },
    education: [
      {
        period: "2013–2016 թթ.",
        role: "Ասպիրանտուրա",
        org: "ՀՀ ԳԱԱ Ինֆորմատիկայի և ավտոմատացման պրոբլեմների ինստիտուտ",
        bullets: [
          "Տեխնիկական գիտությունների թեկնածուի գիտական աստիճան՝ «Հաշվողական մեքենաների, համալիրների, համակարգերի և ցանցերի մաթեմատիկական և ծրագրային ապահովում» մասնագիտությամբ",
        ],
      },
      {
        period: "2011–2013 թթ.",
        role: "Մագիստրատուրա (գերազանցության դիպլոմ)",
        org: "Գավառի պետական համալսարան",
        bullets: ["Ինֆորմատիկա և հաշվողական տեխնիկա"],
      },
      {
        period: "2007–2011 թթ.",
        role: "Բակալավրիատ (գերազանցության դիպլոմ)",
        org: "Գավառի պետական համալսարան",
        bullets: ["Ինֆորմատիկա և հաշվողական տեխնիկա"],
      },
    ],
    experience: [
      {
        period: "01.07.2025 — մինչ այժմ",
        role: "Գիտաշխատող",
        org: "ՀՀ ԳԱԱ Ինֆորմատիկայի և ավտոմատացման պրոբլեմների ինստիտուտ",
        bullets: ["Արհեստական բանականության ուղղվածությամբ գիտահետազոտական աշխատանքներ"],
      },
      {
        period: "15.01.2023 — մինչ այժմ",
        role: "Դասախոս",
        org: "Հայաստանում ֆրանսիական համալսարան, Ինֆորմատիկայի և կիրառական մաթեմատիկայի ֆակուլտետ",
        bullets: [
          "ԱԲ դասընթացների վարում (բակալավր, մագիստրատուրա)",
          "Դասընթացների ծրագրերի և ուսումնական նյութերի մշակում",
          "Նախագծերի և պրակտիկաների ղեկավարում",
        ],
      },
      {
        period: "01.05.2017 — մինչ այժմ",
        role: "Ասիստենտ",
        org: "Հայաստանի ազգային պոլիտեխնիկական համալսարան, Microsoft IT Academy",
        bullets: [
          "Python, Machine Learning, Deep Learning, Generative AI դասընթացների վարում",
          "Դասընթացների ծրագրերի և նյութերի մշակում",
        ],
      },
      {
        period: "08.09.2018 — մինչ այժմ",
        role: "Ամբիոնի վարիչ",
        org: "Ինֆորմատիկայի և ֆիզիկամաթեմատիկական գիտությունների ամբիոն, Գավառի պետական համալսարան",
        bullets: [
          "«Համակարգչային ճարտարագիտություն» ՄԿԾ-ի ղեկավարում",
          "Ուսումնական պլանների մշակում և համակարգում",
          "Դասախոսական կազմի ընտրություն",
        ],
      },
      {
        period: "01.09.2013 — մինչ այժմ",
        role: "Դասախոս",
        org: "Գավառի պետական համալսարան",
        bullets: [
          "Արհեստական բանականություն և մեքենայական ուսուցում, ԱԲ ծրագրագործիքային միջոցներ, ԱԲ համակարգեր, Նեյրոնային ցանցեր",
        ],
      },
      {
        period: "15.01.2024 — մինչ այժմ",
        role: "Դասախոս",
        org: "Վուդու կենտրոն, ԱՐԴԻ ակադեմիա",
        url: "https://ardy.am/am/course/45",
        bullets: ["Տվյալագիտություն և մեքենայական ուսուցում, AI4ALL"],
      },
      {
        period: "01.09.2024 — մինչ այժմ",
        role: "Դասընթացավար",
        org: "«ԱԲ սերունդ» ծրագիր, FAST հիմնադրամ",
        bullets: ["Մեքենայական ուսուցում, Խորը ուսուցում"],
      },
    ],
    pastExperience: [
      {
        period: "01.05.2022 — 01.07.2023",
        role: "Դասընթացավար",
        org: "Picsart Academy",
        bullets: ["Ծրագրավորման և տվյալագիտության դասընթացներ"],
      },
      {
        period: "15.11.2022 — 15.07.2023",
        role: "ՄԿԾ մշակման փորձագետ",
        org: "Հայաստանի պետական տնտեսագիտական համալսարան",
        bullets: ["«Տեղեկատվական համակարգեր» (բակալավր), «Տեղեկատվական տեխնոլոգիաները բիզնեսում» (մագիստրատուրա) ՄԿԾ-ների մշակում"],
      },
      {
        period: "25.06.2020 — 30.09.2021",
        role: "Ծրագրավորման և ԱԲ խորհրդատու",
        org: "Վ. Բրյուսովի անվան պետական համալսարան",
        bullets: ["«ՀայԼինգվոՏեք» — «Հաշվողական լեզվաբանություն» ՄԿԾ-ի մշակում և դասախոսների վերապատրաստում"],
      },
      {
        period: "22.07.2021 — 01.03.2022",
        role: "Կրթության փորձագետ",
        org: "Մասնագիտական կրթության որակի ապահովման ազգային կենտրոն",
        bullets: ["ՀՀ ԳԱԱ Միջազգային գիտակրթական կենտրոնի հավատարմագրման փորձագիտական խմբի անդամ"],
      },
      {
        period: "01.10.2017 — 01.03.2025",
        role: "Համահիմնադիր, տեխնիկական տնօրեն",
        org: "Luseen Mobile",
        url: "https://www.luseen.com",
        bullets: ["Software Architect, Backend ծրագրավորող, նախագծերի ղեկավար"],
      },
      {
        period: "01.03.2015 — 01.10.2020",
        role: "Համահիմնադիր, տնօրեն",
        org: "Luseen Technologies հիմնադրամ",
        url: "https://www.luseen.am",
        bullets: ["Կրթական ծրագրերի համակարգում"],
      },
      {
        period: "01.09.2016 — 01.09.2018",
        role: "Տեղեկատվական տեխնոլոգիաների բաժնի վարիչ",
        org: "Գավառի պետական համալսարան",
        bullets: [
          "ՏՏ ռազմավարության մշակում, միջոցառումների պլանավորում",
          "Կրթական ծրագրային միջոցների ուսումնասիրություն",
          "Բաժնի աշխատանքների վերահսկում և հաշվետվությունների ներկայացում",
        ],
      },
      {
        period: "01.09.2011 — 30.08.2016",
        role: "Ծրագրավորող",
        org: "Գավառի պետական համալսարան",
        bullets: [
          "www.gsu.am կայքի սպասարկում և զարգացում (PHP, jQuery, Ajax, MySQL)",
          "CMS համակարգի կատարելագործում, SMO և SEO",
          "«E-learning GSU» համակարգի ներդրում և սպասարկում",
        ],
      },
    ],
    skills: [
      "IT trainer",
      "Python · Machine Learning · Deep Learning",
      "ML/DL framework-ներ և գործիքներ",
      "Java · OOP",
      "Database Design · SQL · MySQL · MongoDB",
    ],
    languages: [
      { name: "Հայերեն", level: "Գերազանց" },
      { name: "Ռուսերեն", level: "Լավ" },
      { name: "Անգլերեն", level: "Լավ" },
    ],
    publications: [
      "Շուրջ 15 գիտական հոդվածներ",
      "Գիտական հետաքրքրությունների շրջանակ՝ մեքենայական և խորացված ուսուցում, համակարգչային թեստավորում, թվային պատկերների մշակում",
    ],
    other: [
      "Մասնակցել է ~15 միջազգային աշխատաժողովների և վերապատրաստումների (Իտալիա, Գերմանիա, Ավստրիա, Շվեդիա, Անգլիա, Իսպանիա, Բուլղարիա)",
      "ՀԱՊՀ-ում Python և ԱԲ դասընթացների հեղինակ և հիմնական դասախոս (ԲՏԱ նախարարության հետ համատեղ)",
      "Դասախոսների վերապատրաստման դասընթացների մշակում և անցկացում",
      "ԳՊՀ գիտական խորհրդի անդամ",
    ],
  },

  ru: {
    sections: {
      education: "Образование",
      experience: "Текущие позиции",
      pastExperience: "Опыт работы",
      skills: "Профессиональные навыки",
      languages: "Языки",
      publications: "Публикации и исследования",
      other: "Дополнительно",
    },
    education: [
      {
        period: "2013–2016",
        role: "Аспирантура",
        org: "Институт проблем информатики и автоматизации НАН РА",
        bullets: [
          "Кандидат технических наук — «Математическое и программное обеспечение вычислительных машин, комплексов, систем и сетей»",
        ],
      },
      {
        period: "2011–2013",
        role: "Магистратура (с отличием)",
        org: "Гаварский государственный университет",
        bullets: ["Информатика и вычислительная техника"],
      },
      {
        period: "2007–2011",
        role: "Бакалавриат (с отличием)",
        org: "Гаварский государственный университет",
        bullets: ["Информатика и вычислительная техника"],
      },
    ],
    experience: [
      {
        period: "Июль 2025 — настоящее время",
        role: "Научный сотрудник",
        org: "Институт проблем информатики и автоматизации НАН РА",
        bullets: ["Научные исследования в области искусственного интеллекта"],
      },
      {
        period: "Янв 2023 — настоящее время",
        role: "Преподаватель",
        org: "Французский университет в Армении — факультет информатики и прикладной математики",
        bullets: [
          "Курсы по ИИ (бакалавриат и магистратура)",
          "Разработка программ и учебных материалов",
          "Руководство проектами и практикой студентов",
        ],
      },
      {
        period: "Май 2017 — настоящее время",
        role: "Ассистент",
        org: "Национальный политехнический университет Армении — Microsoft IT Academy",
        bullets: [
          "Python, Machine Learning, Deep Learning, Generative AI",
          "Разработка курсов и материалов",
        ],
      },
      {
        period: "Сен 2018 — настоящее время",
        role: "Заведующий кафедрой",
        org: "Кафедра информатики и физико-математических наук, Гаварский ГУ",
        bullets: [
          "Руководство программой «Компьютерная инженерия»",
          "Учебные планы и результаты обучения",
          "Подбор преподавательского состава",
        ],
      },
      {
        period: "Сен 2013 — настоящее время",
        role: "Преподаватель",
        org: "Гаварский государственный университет",
        bullets: [
          "Искусственный интеллект и машинное обучение, инструменты ИИ, нейронные сети",
        ],
      },
      {
        period: "Янв 2024 — настоящее время",
        role: "Преподаватель",
        org: "Voodoo Center / ARDY Academy",
        url: "https://ardy.am/am/course/45",
        bullets: ["Data Science & Machine Learning, AI Literacy (AI4ALL)"],
      },
      {
        period: "Сен 2024 — настоящее время",
        role: "Инструктор",
        org: "Программа «AI Generation», фонд FAST",
        bullets: ["Machine Learning и Deep Learning"],
      },
    ],
    pastExperience: [
      {
        period: "Май 2022 — Июл 2023",
        role: "Преподаватель",
        org: "Picsart Academy",
        bullets: ["Курсы программирования и data science"],
      },
      {
        period: "Ноя 2022 — Июл 2023",
        role: "Эксперт по разработке программ",
        org: "Армянский государственный экономический университет",
        bullets: ["Разработка BSc «Информационные системы» и MSc «IT в бизнесе»"],
      },
      {
        period: "Июн 2020 — Сен 2021",
        role: "Консультант по программированию и ИИ",
        org: "Государственный университет им. В. Брюсова",
        bullets: ["Грант HayLingvoTech — разработка программы «Компьютерная лингвистика» и обучение преподавателей"],
      },
      {
        period: "Июл 2021 — Мар 2022",
        role: "Эксперт по образованию",
        org: "Национальный центр обеспечения качества проф. образования",
        bullets: ["Член аккредитационной экспертной группы"],
      },
      {
        period: "Окт 2017 — Мар 2025",
        role: "Сооснователь, CTO",
        org: "Luseen Mobile",
        url: "https://www.luseen.com",
        bullets: ["Software architect, backend-разработчик, руководитель проектов"],
      },
      {
        period: "Мар 2015 — Окт 2020",
        role: "Сооснователь, директор",
        org: "Luseen Technologies",
        url: "https://www.luseen.am",
        bullets: ["Координация образовательных программ"],
      },
      {
        period: "Сен 2016 — Сен 2018",
        role: "Начальник отдела ИТ",
        org: "Гаварский государственный университет",
        bullets: [
          "ИТ-стратегия университета",
          "Исследование рынка образовательного ПО",
          "Отчётность перед ректором и научным советом",
        ],
      },
      {
        period: "Сен 2011 — Авг 2016",
        role: "Разработчик",
        org: "Гаварский государственный университет",
        bullets: [
          "Разработка и поддержка www.gsu.am (PHP, jQuery, Ajax, MySQL)",
          "Развитие CMS, SEO/SMO",
          "Внедрение и поддержка LMS «E-learning GSU»",
        ],
      },
    ],
    skills: [
      "IT-тренер",
      "Python · Machine Learning · Deep Learning",
      "ML/DL фреймворки и инструменты",
      "Java · ООП",
      "Проектирование БД · SQL · MySQL · MongoDB",
    ],
    languages: [
      { name: "Армянский", level: "Родной" },
      { name: "Русский", level: "Хорошо" },
      { name: "Английский", level: "Хорошо" },
    ],
    publications: [
      "Около 15 научных статей",
      "Научные интересы: машинное и глубокое обучение, компьютерное тестирование, цифровая обработка изображений",
    ],
    other: [
      "Участвовал в ~15 международных воркшопах и тренингах (Италия, Германия, Австрия, Швеция, Великобритания, Испания, Болгария)",
      "Автор и ведущий преподаватель курсов Python и ИИ в НПУА (совместно с МВТП РА)",
      "Разработка и проведение тренингов для преподавателей в Центре непрерывного образования НПУА",
      "Член научного совета Гаварского ГУ",
    ],
  },
};
