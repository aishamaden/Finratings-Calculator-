import { useState, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// DATA LAYER — extracted verbatim from таблица_версия_2.xlsx
// ═══════════════════════════════════════════════════════════════════
const LOAN_DATA = {
  consumer: [
    {
      id: "kaspi-consumer",
      bank: "Kaspi",
      product: "Kaspi Кредит",
      termMonths: 60,
      rateMin: 19.9,
      gesv: 22.5,
      maxAmount: 5000000,
      minAmount: 10000,
      noCollateral: true,
      noGuarantor: true,
      online: true,
      approvalSpeed: "5 мин",
      commissions: [],
      insurance: [],
      originationFee: 0,
      processingFee: 0,
    },
    {
      id: "halyk-consumer",
      bank: "Halyk",
      product: "Онлайн кредит",
      termMonths: 84,
      rateMin: 21.0,
      gesv: 23.8,
      maxAmount: 7000000,
      minAmount: 50000,
      noCollateral: true,
      noGuarantor: true,
      online: true,
      approvalSpeed: "15 мин",
      commissions: [],
      insurance: [],
      originationFee: 0,
      processingFee: 0,
    },
  ],
  mortgage: [
    {
      id: "halyk-digital-mortgage",
      bank: "Halyk Bank",
      product: "Цифровая ипотека",
      programType: "Коммерческая",
      rateMin: 20.5, rateMax: 24,
      gesvMin: 22.78, gesvMax: 25,
      downPaymentMin: 20,
      termMonthsMin: 6, termMonthsMax: 240,
      maxAmount: null,
      newBuild: false, secondary: true,
      onlineApplication: true,
      commissions: [{ name: "Рассмотрение заявки", amount: 0, type: "fixed" }, { name: "Организация займа", amount: 1, type: "percent" }],
      insurance: ["страхование жилья"],
      notes: "подтверждение дохода",
    },
    {
      id: "halyk-7-20-25",
      bank: "Halyk Bank",
      product: "Программа «7-20-25»",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 7,
      gesvMin: 7.24, gesvMax: 7.8,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 30000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [{ name: "Организация займа", amount: 0, type: "fixed" }],
      insurance: [],
      notes: "гражданство РК; отсутствие жилья 18 мес.",
    },
    {
      id: "halyk-developer-partner",
      bank: "Halyk Bank",
      product: "Строящееся жильё (партнёр)",
      programType: "Программа с партнерами-застройщиками",
      rateMin: 5, rateMax: 18.5,
      gesvMin: 5.03, gesvMax: 20.15,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: null,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [{ name: "Рассмотрение заявки", amount: 0, type: "fixed" }, { name: "Организация займа", amount: 0, type: "fixed" }],
      insurance: [],
      notes: "гражданство РК; 21–63 года",
    },
    {
      id: "bcc-jana",
      bank: "Банк ЦентрКредит",
      product: "JAÑA ипотека",
      programType: "Коммерческая",
      rateMin: 5, rateMax: 15.5,
      gesvMin: 6, gesvMax: 17.6,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 50000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "резиденты РК, 21–68 лет",
    },
    {
      id: "bcc-ipoteka",
      bank: "Банк ЦентрКредит",
      product: "#Ипотека",
      programType: "Коммерческая",
      rateMin: 7, rateMax: 18.75,
      gesvMin: 8.3, gesvMax: 20.9,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 50000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [{ name: "Организация займа", amount: 0.5, type: "percent" }],
      insurance: [],
      notes: "резиденты РК, 21–68 лет",
    },
    {
      id: "bcc-ipoteka-plus",
      bank: "Банк ЦентрКредит",
      product: "#Ипотека ПЛЮС",
      programType: "Коммерческая",
      rateMin: 18.1, rateMax: 21.95,
      gesvMin: 23.9, gesvMax: 24.8,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 50000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bcc-ipoteka-ddu",
      bank: "Банк ЦентрКредит",
      product: "#Ипотека ДДУ",
      programType: "Программа с партнерами-застройщиками",
      rateMin: 20.55, rateMax: 22.35,
      gesvMin: 23.6, gesvMax: 25,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 80000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [
        { name: "Рассмотрение заявки", amount: 5000, type: "fixed" },
        { name: "Организация займа (зарплатный)", amount: 1, type: "percent" },
        { name: "Организация займа (прочие)", amount: 2, type: "percent" },
      ],
      insurance: [],
      notes: "резиденты РК, 21–68 лет; подтверждение дохода",
    },
    {
      id: "bcc-7-20-25",
      bank: "Банк ЦентрКредит",
      product: "7-20-25",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 7,
      gesvMin: 7.2, gesvMax: 7.2,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 30000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "резиденты РК, 18–68 лет; отсутствие жилья",
    },
    {
      id: "forte-mortgage-pledge",
      bank: "ForteBank",
      product: "Ипотека под залог недвижимости",
      programType: "Коммерческая (приостановлена)",
      rateMin: 21.5, rateMax: 21.5,
      gesvMin: 21.5, gesvMax: 25,
      downPaymentMin: 15,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 200000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: ["страхование жилья"],
      notes: "подтверждение дохода",
    },
    {
      id: "forte-mortgage-pledge-money",
      bank: "ForteBank",
      product: "Ипотека под заклад денег",
      programType: "Коммерческая (приостановлена)",
      rateMin: 5, rateMax: 15,
      gesvMin: 5.2, gesvMax: 20,
      downPaymentMin: 30,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 100000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "полное подтверждение дохода; страхование жилья не требуется",
    },
    {
      id: "eurasia-7-20-25",
      bank: "Евразийский банк",
      product: "Ипотека «7-20-25»",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 7,
      gesvMin: 7.22, gesvMax: 7.33,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 30000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "гражданство РК; 21+ лет; отсутствие жилья 18 мес.",
    },
    {
      id: "freedom-digital-new",
      bank: "Freedom Bank",
      product: "Цифровая ипотека (новостройки)",
      programType: "от партнеров банка",
      rateMin: 22, rateMax: 22,
      gesvMin: 24.5, gesvMax: 24.9,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: 70000000,
      newBuild: true, secondary: false,
      onlineApplication: true,
      commissions: [
        { name: "Оценка квартиры", amount: 0, type: "fixed" },
        { name: "Организация займа", amount: 0, type: "fixed" },
        { name: "Рассмотрение заявки", amount: 27000, type: "fixed" },
      ],
      insurance: [],
      notes: "21–63 года; зарплата на счёт Freedom Bank",
    },
    {
      id: "freedom-digital-secondary",
      bank: "Freedom Bank",
      product: "Цифровая ипотека (вторичное жильё)",
      programType: "Коммерческая",
      rateMin: 22, rateMax: 22,
      gesvMin: 24.5, gesvMax: 24.9,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: 70000000,
      newBuild: false, secondary: true,
      onlineApplication: true,
      commissions: [
        { name: "Оценка квартиры", amount: 0, type: "fixed" },
        { name: "Организация займа", amount: 0, type: "fixed" },
        { name: "Рассмотрение заявки", amount: 27000, type: "fixed" },
      ],
      insurance: [],
      notes: "21–63 года; зарплата на счёт Freedom Bank",
    },
    {
      id: "freedom-cascade",
      bank: "Freedom Bank",
      product: "Цифровая каскадная ипотека",
      programType: "Программа с партнерами банка",
      rateMin: 12.5, rateMax: 24,
      gesvMin: 18.8, gesvMax: 20.9,
      downPaymentMin: 20,
      termMonthsMin: 60, termMonthsMax: 240,
      maxAmount: 35000000,
      newBuild: true, secondary: false,
      onlineApplication: true,
      commissions: [
        { name: "Оценка квартиры", amount: 0, type: "fixed" },
        { name: "Организация займа", amount: 0, type: "fixed" },
        { name: "Рассмотрение заявки", amount: 27000, type: "fixed" },
      ],
      insurance: [],
      notes: "21–63 года; меньше срок — меньше ставка",
    },
    {
      id: "freedom-7-20-25",
      bank: "Freedom Bank",
      product: "Программа «7-20-25»",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 7,
      gesvMin: 7.2, gesvMax: 7.8,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 24000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "21–63 года; гражданство РК; отсутствие жилья 18 мес.",
    },
    {
      id: "rbk-developer-partner",
      bank: "Bank RBK",
      product: "Ипотека (партнёры-застройщики)",
      programType: "Программа с партнерами-застройщиками",
      rateMin: 1.6, rateMax: 19.8,
      gesvMin: 1.6, gesvMax: 25,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 75000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "rbk-needed-mortgage",
      bank: "Bank RBK",
      product: "Нужный кредит «Ипотека»",
      programType: "Коммерческая",
      rateMin: 22, rateMax: 22.4,
      gesvMin: 24.5, gesvMax: 25,
      downPaymentMin: 30,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 75000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [{ name: "Рассмотрение/организация (зависит от ставки)", amount: 0.5, type: "percent" }],
      insurance: [],
      notes: null,
    },
    {
      id: "rbk-7-20-25",
      bank: "Bank RBK",
      product: "Ипотека 7-20-25 (временно закрыта)",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 7,
      gesvMin: 7.2, gesvMax: 7.3,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 20000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "altyn-mortgage",
      bank: "Altyn Bank",
      product: "Ипотека",
      programType: "Коммерческая",
      rateMin: 21, rateMax: 22.4,
      gesvMin: 23.15, gesvMax: 24.93,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: 175000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "altyn-digital-mortgage",
      bank: "Altyn Bank",
      product: "Цифровая ипотека",
      programType: "Коммерческая",
      rateMin: 21, rateMax: 22.4,
      gesvMin: 23.15, gesvMax: 24.93,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: 175000000,
      newBuild: true, secondary: true,
      onlineApplication: true,
      commissions: [],
      insurance: [],
      notes: "под залог приобретаемого жилья",
    },
    {
      id: "altyn-partner-mortgage",
      bank: "Altyn Bank",
      product: "Партнерская ипотека",
      programType: "Программа с партнерами-застройщиками",
      rateMin: 0.1, rateMax: 18.5,
      gesvMin: 0.1, gesvMax: 20.31,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: 175000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "altyn-7-20-25",
      bank: "Altyn Bank",
      product: "Ипотека «7-20-25»",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 7,
      gesvMin: 7.23, gesvMax: 7.3,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 30000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "отсутствие жилья; мин доход 160 000 тг",
    },
    {
      id: "nurbank-mortgage",
      bank: "Нурбанк",
      product: "Ипотека",
      programType: "Коммерческая",
      rateMin: 20, rateMax: 22.2,
      gesvMin: 22.14, gesvMax: 24.96,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 180,
      maxAmount: 70000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [{ name: "Организация займа", amount: 2.5, type: "percent" }, { name: "Организация займа (фикс.)", amount: 12000, type: "fixed" }],
      insurance: [],
      notes: "21 год — пенсионный возраст",
    },
    {
      id: "otbasy-nauriz",
      bank: "Отбасы банк",
      product: "НАУРЫЗ",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 9,
      gesvMin: 7.1, gesvMax: 13,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 228,
      maxAmount: 36000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "депозит от 2 млн в Отбасы банке; балльная система отбора",
    },
    {
      id: "otbasy-otau",
      bank: "Отбасы банк",
      product: "Отау",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 9,
      gesvMin: 7.1, gesvMax: 13,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 228,
      maxAmount: 36000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "депозит от 1 млн в Отбасы банке",
    },
    {
      id: "otbasy-green",
      bank: "Отбасы банк",
      product: "Зеленая ипотека",
      programType: "Государственная программа",
      rateMin: 7, rateMax: 12.5,
      gesvMin: 7.3, gesvMax: 8.4,
      downPaymentMin: 15,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 50000000,
      newBuild: true, secondary: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "объект должен иметь сертификат ӨМІР/ГОСТ Р/BREAM/LEED",
    },
    {
      id: "otbasy-nurlyzher",
      bank: "Отбасы банк",
      product: "Нұрлы Жер",
      programType: "Государственная программа",
      rateMin: 5, rateMax: 5,
      gesvMin: 5.2, gesvMax: 5.2,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: null,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "ветераны, лица с инвалидностью, многодетные",
    },
    {
      id: "otbasy-bakytty",
      bank: "Отбасы банк",
      product: "Бақытты Отбасы (МГП 2-10-20)",
      programType: "Государственная программа",
      rateMin: 2, rateMax: 2,
      gesvMin: 2.1, gesvMax: 2.1,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 240,
      maxAmount: null,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "многодетные, дети-сироты, инвалиды I–II группы",
    },
    {
      id: "otbasy-svoy-dom",
      bank: "Отбасы банк",
      product: "Свой дом",
      programType: "Государственная программа",
      rateMin: 6, rateMax: 7,
      gesvMin: 6.2, gesvMax: 9,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 300,
      maxAmount: 200000000,
      newBuild: true, secondary: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "вкладчики Отбасы банка, накопившие от 500 000 тг",
    },
  ],
  auto: [
    {
      id: "kaspi-auto",
      bank: "Kaspi.kz",
      product: "Авто кредит",
      vehicleType: "Новый/б.у.",
      rateMin: 18, rateMax: 18,
      gesvMin: 18, gesvMax: 35,
      downPaymentMin: 5, downPaymentMax: 10,
      termMonthsMin: 12, termMonthsMax: 60,
      minAmount: 300000, maxAmount: 18000000,
      newVehicle: true, usedVehicle: true,
      onlineApplication: true,
      commissions: [],
      insurance: [],
      notes: "б/у не раньше 1997 (Колеса.кз); не раньше 2001 от частных лиц",
    },
    {
      id: "halyk-auto-subsidized",
      bank: "Halyk Bank",
      product: "Автокредит льготный",
      vehicleType: "Отечественного производства",
      rateMin: 4, rateMax: 4,
      gesvMin: 4.1, gesvMax: 7.5,
      downPaymentMin: 0,
      termMonthsMin: 6, termMonthsMax: 84,
      minAmount: 1500000, maxAmount: 10000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: true,
      commissions: [],
      insurance: [],
      notes: "Госпрограмма на отечественные авто",
    },
    {
      id: "halyk-digital-auto",
      bank: "Halyk Bank",
      product: "Цифровой автокредит",
      vehicleType: "Новый/б.у./электромобиль",
      rateMin: 23, rateMax: 28,
      gesvMin: 25.1, gesvMax: 32,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1500000, maxAmount: 30000000,
      newVehicle: true, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "На новые и электромобили Halyk Bank+1",
    },
    {
      id: "forte-auto-subsidized",
      bank: "Forte Bank",
      product: "Льготное автокредитование",
      vehicleType: "Отечественного производства",
      rateMin: 4, rateMax: 4,
      gesvMin: 4.1, gesvMax: 7.5,
      downPaymentMin: 20,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 10000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "Госпрограмма на отечественные авто (СарыаркаАвтоПром, Hyundai, Kia, Changan, Chery, Haval и др.)",
    },
    {
      id: "forte-auto-classic",
      bank: "Forte Bank",
      product: "Автокредитование",
      vehicleType: "Новые без пробега в автосалонах",
      rateMin: 0.1, rateMax: 23.5,
      gesvMin: 0.1, gesvMax: 26.6,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 50000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "Есть льготные и классические кредиты",
    },
    {
      id: "freedom-auto-salon",
      bank: "Freedom Bank",
      product: "Цифровой автокредит (автосалон)",
      vehicleType: "В автосалоне",
      rateMin: 21.5, rateMax: 24.5,
      gesvMin: 27.6, gesvMax: 34.5,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1200000, maxAmount: 40000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "Более высокие суммы",
    },
    {
      id: "freedom-auto-private",
      bank: "Freedom Bank",
      product: "Цифровой автокредит (физлица)",
      vehicleType: "У физических лиц",
      rateMin: 0.1, rateMax: 31,
      gesvMin: 1.2, gesvMax: 35,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: null, maxAmount: null,
      newVehicle: true, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "eurasia-auto-subsidized",
      bank: "Евразийский банк",
      product: "Льготное автокредитование",
      vehicleType: "Отечественного производства",
      rateMin: 4, rateMax: 4,
      gesvMin: 4.07, gesvMax: 4.08,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 450000, maxAmount: 13500000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "eurasia-auto-new",
      bank: "Евразийский банк",
      product: "Кредит на новый автомобиль",
      vehicleType: "Новые иностранные (Россия, Китай, СНГ)",
      rateMin: 0.12, rateMax: 30,
      gesvMin: 0.12, gesvMax: 35,
      downPaymentMin: 0, downPaymentMax: 5,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 450000, maxAmount: 45000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "eurasia-auto-used",
      bank: "Евразийский банк",
      product: "Кредит на авто с пробегом",
      vehicleType: "С пробегом (разные условия по стране)",
      rateMin: 23, rateMax: 30,
      gesvMin: 25.6, gesvMax: 35,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 200000, maxAmount: 20000000,
      newVehicle: false, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "СНГ ≤7 лет; Китай ≤5 лет; прочие ≤20 лет",
    },
    {
      id: "bcc-auto-used-private",
      bank: "Банк ЦентрКредит",
      product: "Авто с пробегом (частные лица)",
      vehicleType: "Япония, Европа, Корея, США",
      rateMin: 24.8, rateMax: 29.5,
      gesvMin: 31.9, gesvMax: 34.8,
      downPaymentMin: 30,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 15000000,
      newVehicle: false, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bcc-auto-used-promo",
      bank: "Банк ЦентрКредит",
      product: "Авто с пробегом (выгодные условия)",
      vehicleType: "Россия, Китай, Узбекистан ≤3 лет",
      rateMin: 24.8, rateMax: 29.5,
      gesvMin: 31.9, gesvMax: 34.8,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 25000000,
      newVehicle: false, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bcc-auto-new",
      bank: "Банк ЦентрКредит",
      product: "Кредит на новый автомобиль",
      vehicleType: "Allur, Astana Motors, Chery, Chevrolet, Haval, Kia, Skoda, Hyundai и др.",
      rateMin: 22.6, rateMax: 26.85,
      gesvMin: 26.19, gesvMax: 33.7,
      downPaymentMin: 10,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 45000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "altyn-auto",
      bank: "Altyn Bank",
      product: "Автокредит",
      vehicleType: null,
      rateMin: 24, rateMax: 30.3,
      gesvMin: 27.1, gesvMax: 34.9,
      downPaymentMin: 0,
      termMonthsMin: 12, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 30000000,
      newVehicle: true, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bereke-auto-new",
      bank: "Bereke Bank",
      product: "Автокредит (новый автомобиль)",
      vehicleType: "Новый",
      rateMin: 25.5, rateMax: 30,
      gesvMin: 29.9, gesvMax: 34.9,
      downPaymentMin: 0,
      termMonthsMin: 24, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 45000000,
      newVehicle: true, usedVehicle: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bereke-auto-used",
      bank: "Bereke Bank",
      product: "Автокредит (с пробегом)",
      vehicleType: "С пробегом",
      rateMin: 28.5, rateMax: 30,
      gesvMin: 33.6, gesvMax: 34.9,
      downPaymentMin: 10,
      termMonthsMin: 36, termMonthsMax: 84,
      minAmount: 1000000, maxAmount: 30000000,
      newVehicle: false, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "kzi-auto",
      bank: "KZI Bank",
      product: "Автокредит",
      vehicleType: null,
      rateMin: 21, rateMax: 25,
      gesvMin: 23.5, gesvMax: 28.5,
      downPaymentMin: 0,
      termMonthsMin: 12, termMonthsMax: 60,
      minAmount: 1000000, maxAmount: 50000000,
      newVehicle: true, usedVehicle: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
  ],
  refinancing: [
    {
      id: "halyk-refi",
      bank: "Halyk Bank",
      product: "Рефинансирование",
      rateMin: 17.5, rateMax: 38,
      gesvMin: 28.8, gesvMax: 45.3,
      maxAmount: 8000000,
      termMonths: 60,
      noCollateral: true,
      onlineApplication: true,
      commissions: [{ name: "Организация займа (с комиссией)", amount: 4, type: "percent" }],
      insurance: ["страхование жизни (опционально)"],
      notes: "также без комиссии или со страховкой",
    },
    {
      id: "freedom-refi",
      bank: "Freedom Bank",
      product: "Рефинансирование кредитов онлайн",
      rateMin: 22, rateMax: 22,
      gesvMin: 24.3, gesvMax: 34.4,
      maxAmount: 8000000,
      termMonths: 84,
      noCollateral: true,
      onlineApplication: true,
      commissions: [],
      insurance: [],
      notes: "любые кредиты в других банках и МФО; можно предоставить залог после выдачи",
    },
    {
      id: "bcc-refi-collateral",
      bank: "Банк ЦентрКредит",
      product: "Рефинансирование залоговых займов",
      rateMin: 23, rateMax: 25.5,
      gesvMin: 26, gesvMax: 28.6,
      maxAmount: 150000000,
      termMonths: 120,
      noCollateral: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bcc-refi-unsecured",
      bank: "Банк ЦентрКредит",
      product: "Рефинансирование беззалоговых займов",
      rateMin: 13, rateMax: 38,
      gesvMin: 30.93, gesvMax: 46,
      maxAmount: 8000000,
      termMonths: 60,
      noCollateral: true,
      onlineApplication: false,
      commissions: [],
      insurance: [{ name: "страхование жизни", amount: 4.5, type: "percent" }],
      notes: "стаж 6+ мес.; нет просрочек",
    },
    {
      id: "forte-refi",
      bank: "ForteBank",
      product: "Рефинансирование",
      rateMin: 28, rateMax: 37.9,
      gesvMin: 32.4, gesvMax: 46,
      maxAmount: 9500000,
      termMonths: 60,
      noCollateral: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "alatau-refi",
      bank: "Alatau City Bank",
      product: "Рефинансирование займов",
      rateMin: 37, rateMax: 37,
      gesvMin: 43, gesvMax: 46,
      maxAmount: 8000000,
      termMonths: 60,
      noCollateral: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "займы из других банков",
    },
    {
      id: "altyn-refi",
      bank: "Altyn Bank",
      product: "Рефинансирование",
      rateMin: 11.5, rateMax: 36.5,
      gesvMin: 27.11, gesvMax: 45.93,
      maxAmount: 8000000,
      termMonths: 60,
      noCollateral: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "до 10-ти займов",
    },
    {
      id: "eurasia-refi",
      bank: "Евразийский банк",
      product: "Внешнее рефинансирование",
      rateMin: 32, rateMax: 32,
      gesvMin: 37.01, gesvMax: 37.27,
      maxAmount: 7000000,
      termMonths: 60,
      noCollateral: true,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "18–65 лет; до 75 лет на момент окончания; нет просрочек",
    },
    {
      id: "bereke-refi",
      bank: "Bereke Bank",
      product: "Рефинансирование (другие банки)",
      rateMin: 28, rateMax: 42,
      gesvMin: 31.02, gesvMax: 45.5,
      maxAmount: 8000000,
      termMonths: 60,
      noCollateral: false,
      onlineApplication: true,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "bereke-auto-refi",
      bank: "Bereke Bank",
      product: "Рефинансирование автокредита",
      rateMin: 26.49, rateMax: 28.49,
      gesvMin: 29.94, gesvMax: 32.51,
      maxAmount: 15000000,
      termMonths: 84,
      noCollateral: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: null,
    },
    {
      id: "homecredit-refi",
      bank: "Home Credit Bank",
      product: "Рефинансирование кредитов",
      rateMin: 19, rateMax: 38,
      gesvMin: 23.2, gesvMax: 45.9,
      maxAmount: 9500000,
      termMonths: 60,
      noCollateral: false,
      onlineApplication: false,
      commissions: [],
      insurance: [],
      notes: "22 — пенсионный возраст; 45–75 для пенсионеров",
    },
    {
      id: "nurbank-refi-unsecured",
      bank: "Nurbank",
      product: "Внешнее рефинансирование беззалоговых",
      rateMin: 26.5, rateMax: 33,
      gesvMin: 31.13, gesvMax: 43.68,
      maxAmount: 7000000,
      termMonths: 60,
      noCollateral: true,
      onlineApplication: true,
      commissions: [{ name: "Организация займа (с комиссией)", amount: 2, type: "percent" }],
      insurance: [],
      notes: "21 — пенсионный возраст; стаж 6+ мес.",
    },
    {
      id: "nurbank-refi-collateral",
      bank: "Nurbank",
      product: "Внешнее рефинансирование залоговых",
      rateMin: 23, rateMax: 28.5,
      gesvMin: 26.08, gesvMax: 34.04,
      maxAmount: 7000000,
      termMonths: 120,
      noCollateral: false,
      onlineApplication: false,
      commissions: [{ name: "Организация займа (с комиссией)", amount: 2, type: "percent" }],
      insurance: [],
      notes: "21 — пенсионный возраст",
    },
    {
      id: "rbk-refi",
      bank: "Bank RBK",
      product: "Рефинансирование",
      rateMin: 11, rateMax: 37,
      gesvMin: 25.77, gesvMax: 46,
      maxAmount: 8000000,
      termMonths: 60,
      noCollateral: false,
      onlineApplication: true,
      commissions: [],
      insurance: [],
      notes: null,
    },
  ],
  business: [
    {
      id: "sberbank-biz",
      bank: "ДБ Сбербанк",
      product: "Бизнес Онлайн",
      type: "Кредитная линия",
      rateMin: 15, rateMax: 15,
      gesv: 16.8,
      maxAmount: 50000000,
      termMonths: 60,
      collateral: true,
      govProgram: false,
      onlineApplication: true,
      notes: null,
    },
    {
      id: "halyk-biz",
      bank: "Халык",
      product: "МСБ Старт",
      type: "Разовый",
      rateMin: 14.5, rateMax: 14.5,
      gesv: 16.1,
      maxAmount: 30000000,
      termMonths: 84,
      collateral: true,
      govProgram: true,
      onlineApplication: true,
      notes: "QazBusiness",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// CALCULATION ENGINE
// ═══════════════════════════════════════════════════════════════════
function calcAnnuityPayment(principal, annualRate, months) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function calcDifferentiatedSchedule(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  const principalPayment = principal / months;
  const schedule = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const payment = principalPayment + interest;
    balance -= principalPayment;
    schedule.push({ month: i, payment, principal: principalPayment, interest, balance: Math.max(0, balance) });
  }
  return schedule;
}

function calcAnnuitySchedule(principal, annualRate, months) {
  const r = annualRate === 0 ? 0 : annualRate / 100 / 12;
  const payment = calcAnnuityPayment(principal, annualRate, months);
  const schedule = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPart = payment - interest;
    balance -= principalPart;
    schedule.push({ month: i, payment, principal: principalPart, interest, balance: Math.max(0, balance) });
  }
  return schedule;
}

function calcIRR(cashflows, guess = 0.1) {
  let rate = guess;
  for (let iter = 0; iter < 100; iter++) {
    let npv = 0, dnpv = 0;
    cashflows.forEach((cf, t) => {
      npv += cf / Math.pow(1 + rate, t);
      dnpv -= (t * cf) / Math.pow(1 + rate, t + 1);
    });
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-8) return newRate;
    rate = newRate;
  }
  return rate;
}

function calcAPR(principal, monthlyPayment, months, upfrontFees) {
  const cashflows = [-principal + upfrontFees];
  for (let i = 0; i < months; i++) cashflows.push(monthlyPayment);
  const monthlyIRR = calcIRR(cashflows);
  return (Math.pow(1 + monthlyIRR, 12) - 1) * 100;
}

function calcTransparencyScore(product) {
  let score = 100;
  const commissionCount = (product.commissions || []).filter(c => c.amount > 0).length;
  score -= commissionCount * 10;
  const insuranceCount = (product.insurance || []).length;
  score -= insuranceCount * 8;
  if (product.rateMax && product.rateMin && product.rateMax - product.rateMin > 5) score -= 10;
  if (product.gesvMax && product.gesvMin && product.gesvMax - product.gesvMin > 5) score -= 5;
  const originationFeeTotal = (product.commissions || [])
    .filter(c => c.type === "percent")
    .reduce((s, c) => s + c.amount, 0);
  if (originationFeeTotal > 2) score -= 15;
  else if (originationFeeTotal > 0) score -= 7;
  return Math.max(0, Math.min(100, score));
}

function computeFullCost(product, loanAmount, termMonths, scheduleType, commissionType = "standard") {
  const rate = product.rateMin || 0;
  const schedule = scheduleType === "annuity"
    ? calcAnnuitySchedule(loanAmount, rate, termMonths)
    : calcDifferentiatedSchedule(loanAmount, rate, termMonths);

  const totalRepayment = schedule.reduce((s, p) => s + p.payment, 0);
  const totalInterest = schedule.reduce((s, p) => s + p.interest, 0);

  // Fixed upfront fees
  let upfrontFees = 0;
  (product.commissions || []).forEach(c => {
    if (c.type === "fixed") upfrontFees += c.amount;
    else if (c.type === "percent") {
      if (commissionType === "salary" && c.name && c.name.includes("зарплатный")) {
        upfrontFees += loanAmount * c.amount / 100;
      } else if (!c.name || !c.name.includes("зарплатный")) {
        upfrontFees += loanAmount * c.amount / 100;
      }
    }
  });

  // Insurance (annualized % if applicable)
  let insuranceCost = 0;
  (product.insurance || []).forEach(ins => {
    if (typeof ins === "object" && ins.type === "percent") {
      insuranceCost += loanAmount * ins.amount / 100;
    }
  });

  const totalCost = totalRepayment + upfrontFees + insuranceCost;
  const totalOverpayment = totalCost - loanAmount;

  const monthlyPayment = schedule[0]?.payment || 0;
  const apr = calcAPR(loanAmount, monthlyPayment, termMonths, upfrontFees + insuranceCost);

  const transparency = calcTransparencyScore(product);

  return {
    monthlyPayment,
    totalRepayment,
    totalInterest,
    upfrontFees,
    insuranceCost,
    totalCost,
    totalOverpayment,
    apr: isFinite(apr) ? apr : product.gesvMin,
    effectiveRate: product.gesvMin,
    transparency,
    schedule,
  };
}

// ═══════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════
const fmt = (n) => new Intl.NumberFormat("ru-KZ").format(Math.round(n));
const fmtPct = (n) => (typeof n === "number" && isFinite(n) ? n.toFixed(2) + "%" : "—");

const COLORS = ["#00d4aa", "#ff6b4a", "#4a9eff", "#ffbe4a", "#c04aff", "#ff4a8d", "#4affb8"];

function TransparencyBar({ score }) {
  const color = score >= 70 ? "#00d4aa" : score >= 40 ? "#ffbe4a" : "#ff6b4a";
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 6, overflow: "hidden", height: 8, width: "100%" }}>
      <div style={{ width: `${score}%`, height: "100%", background: color, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Pill({ color, children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px",
      borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
      background: color + "22", color, border: `1px solid ${color}55`,
    }}>{children}</span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function Page() {
  const [category, setCategory] = useState("mortgage");
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [termMonths, setTermMonths] = useState(120);
  const [monthlyIncome, setMonthlyIncome] = useState(500000);
  const [existingDebt, setExistingDebt] = useState(0);
  const [downPayment, setDownPayment] = useState(2000000);
  const [scheduleType, setScheduleType] = useState("annuity");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("compare");
  const [showSchedule, setShowSchedule] = useState(false);

  const products = LOAN_DATA[category] || [];
  const effectiveLoan = category === "mortgage" || category === "auto" ? loanAmount - downPayment : loanAmount;

  const results = useMemo(() => {
    return products.map(p => {
      const maxTerm = p.termMonthsMax || p.termMonths || termMonths;
      const t = Math.min(termMonths, maxTerm);
      const r = computeFullCost(p, Math.max(effectiveLoan, 1), t, scheduleType);
      const dti = ((r.monthlyPayment + existingDebt) / monthlyIncome) * 100;
      const affordability = dti <= 40 ? Math.round(100 - dti) : Math.max(0, Math.round(50 - dti));
      return { ...p, ...r, dti, affordability };
    }).sort((a, b) => a.apr - b.apr);
  }, [products, effectiveLoan, termMonths, scheduleType, existingDebt, monthlyIncome]);

  const selected = selectedProduct ? results.find(r => r.id === selectedProduct) || results[0] : results[0];

  const comparisonData = results.slice(0, 8).map(r => ({
    name: r.product.length > 16 ? r.product.slice(0, 14) + "…" : r.product,
    bank: r.bank,
    "Переплата": Math.round(r.totalOverpayment / 1000),
    "Комиссии+страхование": Math.round((r.upfrontFees + r.insuranceCost) / 1000),
  }));

  const pieData = selected ? [
    { name: "Основной долг", value: effectiveLoan },
    { name: "Проценты", value: Math.round(selected.totalInterest) },
    { name: "Комиссии", value: Math.round(selected.upfrontFees) },
    { name: "Страхование", value: Math.round(selected.insuranceCost) },
  ].filter(d => d.value > 0) : [];

  const scheduleChartData = (selected?.schedule || []).slice(0, 36).map((s, i) => ({
    month: i + 1,
    "Осн. долг": Math.round(s.principal),
    "Проценты": Math.round(s.interest),
    "Остаток": Math.round(s.balance / 1000),
  }));

  const categories = [
    { key: "mortgage", label: "🏠 Ипотека" },
    { key: "consumer", label: "💳 Потреб. кредиты" },
    { key: "auto", label: "🚗 Автокредиты" },
    { key: "refinancing", label: "🔄 Рефинансирование" },
    { key: "business", label: "🏢 Бизнес кредиты" },
  ];

  const S = {
    app: {
      background: "#0d0d1a",
      minHeight: "100vh",
      color: "#e0e0f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      fontSize: 14,
    },
    header: {
      background: "linear-gradient(135deg, #0d0d1a 0%, #131330 100%)",
      borderBottom: "1px solid #00d4aa33",
      padding: "20px 24px 0",
    },
    title: {
      fontSize: 22, fontWeight: 800, letterSpacing: -0.5,
      color: "#fff",
      display: "flex", alignItems: "center", gap: 10,
    },
    accent: { color: "#00d4aa" },
    badge: {
      background: "#00d4aa22", border: "1px solid #00d4aa55",
      color: "#00d4aa", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
    },
    tabs: { display: "flex", gap: 4, marginTop: 16, borderBottom: "none" },
    tab: (active) => ({
      padding: "10px 16px", borderRadius: "8px 8px 0 0", cursor: "pointer",
      fontWeight: active ? 700 : 500, fontSize: 13,
      background: active ? "#00d4aa" : "transparent",
      color: active ? "#0d0d1a" : "#888",
      border: "none", transition: "all 0.2s",
    }),
    catTab: (active) => ({
      padding: "7px 14px", borderRadius: 8, cursor: "pointer",
      fontWeight: active ? 700 : 400, fontSize: 12,
      background: active ? "#1e2044" : "transparent",
      color: active ? "#00d4aa" : "#666",
      border: `1px solid ${active ? "#00d4aa44" : "transparent"}`,
      transition: "all 0.2s",
    }),
    panel: {
      background: "#111126",
      border: "1px solid #ffffff0d",
      borderRadius: 12,
      padding: 18,
    },
    input: {
      background: "#0d0d1a", border: "1px solid #ffffff15", borderRadius: 8,
      color: "#e0e0f0", padding: "9px 12px", fontSize: 14, width: "100%",
      outline: "none",
    },
    label: { fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 0.5, marginBottom: 4, display: "block" },
    btn: (active) => ({
      padding: "7px 14px", borderRadius: 8, cursor: "pointer",
      fontWeight: active ? 700 : 400, fontSize: 12,
      background: active ? "#00d4aa" : "#1a1a2e",
      color: active ? "#0d0d1a" : "#aaa",
      border: `1px solid ${active ? "#00d4aa" : "#ffffff15"}`,
    }),
    row: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
    statCard: {
      background: "#0d0d1a", borderRadius: 10, padding: "14px 16px",
      border: "1px solid #ffffff0d",
    },
    statVal: { fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 },
    statLabel: { fontSize: 11, color: "#666", marginTop: 3 },
    productRow: (active) => ({
      background: active ? "#00d4aa0f" : "#0d0d1a",
      border: `1px solid ${active ? "#00d4aa44" : "#ffffff0d"}`,
      borderRadius: 10, padding: "12px 14px", cursor: "pointer",
      transition: "all 0.2s", marginBottom: 6,
    }),
    rankBadge: (rank) => ({
      width: 22, height: 22, borderRadius: "50%",
      background: rank === 0 ? "#00d4aa" : rank === 1 ? "#ffbe4a" : rank === 2 ? "#ff6b4a" : "#2a2a40",
      color: rank < 3 ? "#0d0d1a" : "#666",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 800, flexShrink: 0,
    }),
  };

  return (
    <div style={S.app}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={S.title}>
            <span style={{ fontSize: 26 }}>⚡</span>
            <span>FinRatings <span style={S.accent}>Калькулятор</span></span>
            <span style={S.badge}>Казахстан</span>
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>Обновлено: май 2026</div>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c.key} style={S.catTab(category === c.key)}
              onClick={() => { setCategory(c.key); setSelectedProduct(null); }}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={S.tabs}>
          {["compare", "detail", "schedule"].map(t => (
            <button key={t} style={S.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
              {t === "compare" ? "📊 Сравнение" : t === "detail" ? "🔬 Детали" : "📅 График платежей"}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, padding: 16, maxWidth: 1400, margin: "0 auto" }}>

        {/* LEFT: INPUTS */}
        <div>
          <div style={S.panel}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00d4aa", marginBottom: 14, letterSpacing: 0.5 }}>
              ⚙️ ПАРАМЕТРЫ РАСЧЁТА
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {(category === "mortgage" || category === "auto") && (
                <div>
                  <label style={S.label}>СТОИМОСТЬ ({category === "mortgage" ? "жилья" : "авто"})</label>
                  <input style={S.input} type="number" value={loanAmount}
                    onChange={e => setLoanAmount(+e.target.value)} />
                </div>
              )}

              {(category === "mortgage" || category === "auto") && (
                <div>
                  <label style={S.label}>ПЕРВОНАЧАЛЬНЫЙ ВЗНОС</label>
                  <input style={S.input} type="number" value={downPayment}
                    onChange={e => setDownPayment(+e.target.value)} />
                  <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>
                    {loanAmount > 0 ? ((downPayment / loanAmount * 100).toFixed(1) + "% от стоимости") : ""}
                  </div>
                </div>
              )}

              {(category === "consumer" || category === "refinancing" || category === "business") && (
                <div>
                  <label style={S.label}>СУММА КРЕДИТА</label>
                  <input style={S.input} type="number" value={loanAmount}
                    onChange={e => setLoanAmount(+e.target.value)} />
                </div>
              )}

              <div>
                <label style={S.label}>СРОК (МЕСЯЦЕВ)</label>
                <input style={S.input} type="number" value={termMonths} min={1} max={300}
                  onChange={e => setTermMonths(+e.target.value)} />
              </div>

              <div>
                <label style={S.label}>ЕЖЕМЕСЯЧНЫЙ ДОХОД</label>
                <input style={S.input} type="number" value={monthlyIncome}
                  onChange={e => setMonthlyIncome(+e.target.value)} />
              </div>

              <div>
                <label style={S.label}>ДРУГИЕ ДОЛГОВЫЕ ПЛАТЕЖИ</label>
                <input style={S.input} type="number" value={existingDebt}
                  onChange={e => setExistingDebt(+e.target.value)} />
              </div>

              <div>
                <label style={S.label}>ТИП ГРАФИКА</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={S.btn(scheduleType === "annuity")} onClick={() => setScheduleType("annuity")}>Аннуитет</button>
                  <button style={S.btn(scheduleType === "diff")} onClick={() => setScheduleType("diff")}>Дифференц.</button>
                </div>
              </div>
            </div>
          </div>

          {/* EFFECTIVE LOAN */}
          {(category === "mortgage" || category === "auto") && (
            <div style={{ ...S.panel, marginTop: 12, borderColor: "#00d4aa33" }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>СУММА КРЕДИТА (с учётом взноса)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#00d4aa" }}>{fmt(effectiveLoan)} ₸</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                {((downPayment / loanAmount) * 100).toFixed(1)}% первоначальный взнос
              </div>
            </div>
          )}

          {/* TOP PRODUCT DETAILS */}
          {selected && (
            <div style={{ ...S.panel, marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>ВЫБРАННЫЙ ПРОДУКТ</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 }}>{selected.product}</div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>{selected.bank}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["APR", fmtPct(selected.apr)],
                  ["ГЭСВ", fmtPct(selected.effectiveRate)],
                  ["Платёж/мес", fmt(selected.monthlyPayment) + " ₸"],
                  ["Переплата", fmt(selected.totalOverpayment) + " ₸"],
                  ["Прозрачность", selected.transparency + "/100"],
                  ["PTI", selected.dti?.toFixed(1) + "%"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#0a0a18", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#555" }}>{k}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#e0e0f0" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>ПРОЗРАЧНОСТЬ</div>
                <TransparencyBar score={selected.transparency} />
                <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>
                  {selected.transparency >= 70 ? "✅ Прозрачный продукт" : selected.transparency >= 40 ? "⚠️ Умеренно прозрачный" : "❌ Скрытые расходы"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: MAIN CONTENT */}
        <div>
          {activeTab === "compare" && (
            <div style={{ display: "grid", gap: 12 }}>
              {/* RANKING */}
              <div style={S.panel}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00d4aa", marginBottom: 12 }}>
                  🏆 РЕЙТИНГ ПРОДУКТОВ — {category === "mortgage" ? "ИПОТЕКА" : category === "consumer" ? "ПОТРЕБИТЕЛЬСКИЕ КРЕДИТЫ" : category === "auto" ? "АВТОКРЕДИТЫ" : category === "refinancing" ? "РЕФИНАНСИРОВАНИЕ" : "БИЗНЕС КРЕДИТЫ"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 100px 80px 80px", gap: 0, fontSize: 10, color: "#555", padding: "0 8px", marginBottom: 8 }}>
                  <div>ПРОДУКТ</div><div>APR</div><div>ПЛАТЁЖ/МЕС</div><div>ПЕРЕПЛАТА</div><div>ПРОЗРАЧНОСТЬ</div><div>PTI</div><div></div>
                </div>
                {results.map((r, i) => (
                  <div key={r.id} style={S.productRow(selectedProduct === r.id || (!selectedProduct && i === 0))}
                    onClick={() => setSelectedProduct(r.id)}>
                    <div style={{ display: "grid", gridTemplateColumns: "22px 1fr 1fr 1fr 1fr 100px 80px 80px", gap: 8, alignItems: "center" }}>
                      <div style={S.rankBadge(i)}>{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12, color: "#e0e0f0" }}>{r.product}</div>
                        <div style={{ fontSize: 10, color: "#555" }}>{r.bank}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: i === 0 ? "#00d4aa" : "#e0e0f0" }}>
                        {fmtPct(r.apr)}
                      </div>
                      <div style={{ fontSize: 12 }}>{fmt(r.monthlyPayment)} ₸</div>
                      <div style={{ fontSize: 12 }}>{fmt(r.totalOverpayment)} ₸</div>
                      <div>
                        <div style={{ fontSize: 10, marginBottom: 3 }}>{r.transparency}/100</div>
                        <TransparencyBar score={r.transparency} />
                      </div>
                      <div style={{ fontSize: 12, color: r.dti > 60 ? "#ff6b4a" : r.dti > 40 ? "#ffbe4a" : "#00d4aa" }}>
                        {r.dti?.toFixed(1)}%
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {r.programType?.includes("Государств") && <Pill color="#00d4aa">ГОС</Pill>}
                        {(r.commissions || []).filter(c => c.amount > 0).length === 0 && <Pill color="#4a9eff">0₸</Pill>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHARTS */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12 }}>ПЕРЕПЛАТА ПО ПРОДУКТАМ (тыс. ₸)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={comparisonData} margin={{ bottom: 30 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#555" }} angle={-30} textAnchor="end" />
                      <YAxis tick={{ fontSize: 9, fill: "#555" }} />
                      <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid #00d4aa33", borderRadius: 8, fontSize: 11 }}
                        formatter={(v) => [fmt(v * 1000) + " ₸"]} />
                      <Bar dataKey="Переплата" fill="#00d4aa" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Комиссии+страхование" fill="#ff6b4a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12 }}>СТРУКТУРА ВЫПЛАТ — {selected?.bank}</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                        label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        style={{ fontSize: 10 }}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid #00d4aa33", borderRadius: 8, fontSize: 11 }}
                        formatter={(v) => [fmt(v) + " ₸"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "detail" && selected && (
            <div style={{ display: "grid", gap: 12 }}>
              {/* HEADER */}
              <div style={{ ...S.panel, borderColor: "#00d4aa33" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>{selected.product}</div>
                    <div style={{ color: "#555", fontSize: 13 }}>{selected.bank}</div>
                    {selected.programType && <Pill color={selected.programType.includes("Государств") ? "#00d4aa" : "#4a9eff"}>{selected.programType}</Pill>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#00d4aa" }}>{fmtPct(selected.apr)}</div>
                    <div style={{ fontSize: 11, color: "#555" }}>Полный APR</div>
                  </div>
                </div>
              </div>

              {/* KEY METRICS */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Ежемесячный платёж", value: fmt(selected.monthlyPayment) + " ₸", color: "#00d4aa" },
                  { label: "Итоговая выплата", value: fmt(selected.totalRepayment + selected.upfrontFees + selected.insuranceCost) + " ₸", color: "#fff" },
                  { label: "Переплата всего", value: fmt(selected.totalOverpayment) + " ₸", color: "#ff6b4a" },
                  { label: "Переплата %", value: selected.totalOverpayment > 0 ? (selected.totalOverpayment / effectiveLoan * 100).toFixed(1) + "%" : "0%", color: "#ffbe4a" },
                ].map(m => (
                  <div key={m.label} style={S.statCard}>
                    <div style={{ ...S.statVal, color: m.color }}>{m.value}</div>
                    <div style={S.statLabel}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* COST BREAKDOWN */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 14 }}>💰 ДЕТАЛИЗАЦИЯ РАСХОДОВ</div>
                  {[
                    { label: "Основной долг", value: effectiveLoan, color: "#4a9eff" },
                    { label: "Проценты за весь срок", value: selected.totalInterest, color: "#00d4aa" },
                    { label: "Комиссии (разовые)", value: selected.upfrontFees, color: "#ffbe4a" },
                    { label: "Страхование", value: selected.insuranceCost, color: "#ff6b4a" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ffffff08" }}>
                      <div style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, display: "inline-block" }} />
                        {item.label}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: item.color }}>{fmt(item.value)} ₸</div>
                    </div>
                  ))}
                </div>

                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 14 }}>📊 СРАВНЕНИЕ СТАВОК</div>
                  {[
                    { label: "Номинальная ставка (мин.)", value: fmtPct(selected.rateMin) },
                    { label: "Номинальная ставка (макс.)", value: fmtPct(selected.rateMax) },
                    { label: "ГЭСВ (мин.)", value: fmtPct(selected.gesvMin ?? selected.gesv) },
                    { label: "ГЭСВ (макс.)", value: fmtPct(selected.gesvMax ?? selected.gesv) },
                    { label: "Рассчитанный APR", value: fmtPct(selected.apr), highlight: true },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: "flex", justifyContent: "space-between", padding: "8px 0",
                      borderBottom: "1px solid #ffffff08",
                      background: row.highlight ? "#00d4aa0a" : "transparent",
                      borderRadius: row.highlight ? 6 : 0, paddingLeft: row.highlight ? 8 : 0,
                    }}>
                      <div style={{ fontSize: 12, color: row.highlight ? "#00d4aa" : "#666" }}>{row.label}</div>
                      <div style={{ fontWeight: row.highlight ? 800 : 600, color: row.highlight ? "#00d4aa" : "#e0e0f0" }}>{row.value}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: "10px", background: "#0a0a18", borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>РЕАЛЬНАЯ СТОИМОСТЬ КРЕДИТА</div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      APR учитывает все комиссии и страховку, отражая фактическую стоимость заимствования.
                      {selected.apr > (selected.gesvMin ?? selected.gesv) + 1
                        ? <span style={{ color: "#ffbe4a" }}> ⚠️ APR выше ГЭСВ — есть скрытые расходы</span>
                        : <span style={{ color: "#00d4aa" }}> ✅ APR соответствует ГЭСВ</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* AFFORDABILITY */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 14 }}>📈 ПЛАТЁЖНАЯ НАГРУЗКА (PTI)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: "50%",
                      background: `conic-gradient(${selected.dti > 60 ? "#ff6b4a" : selected.dti > 40 ? "#ffbe4a" : "#00d4aa"} ${selected.dti}%, #1a1a2e 0%)`,
                      display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
                    }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#111126", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{selected.dti?.toFixed(0)}%</div>
                        <div style={{ fontSize: 9, color: "#555" }}>PTI</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: selected.dti > 60 ? "#ff6b4a" : selected.dti > 40 ? "#ffbe4a" : "#00d4aa", marginBottom: 4 }}>
                        {selected.dti > 60 ? "❌ Высокая нагрузка" : selected.dti > 40 ? "⚠️ Умеренная нагрузка" : "✅ Допустимая нагрузка"}
                      </div>
                      <div style={{ fontSize: 11, color: "#555" }}>
                        Платёж: {fmt(selected.monthlyPayment)} ₸<br />
                        Доп. долг: {fmt(existingDebt)} ₸<br />
                        Доход: {fmt(monthlyIncome)} ₸
                      </div>
                      <div style={{ fontSize: 10, color: "#444", marginTop: 6 }}>Рекомендуемый PTI ≤ 40%</div>
                    </div>
                  </div>
                </div>

                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 14 }}>🔍 ПРОЗРАЧНОСТЬ ПРОДУКТА</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      fontSize: 28, fontWeight: 900,
                      color: selected.transparency >= 70 ? "#00d4aa" : selected.transparency >= 40 ? "#ffbe4a" : "#ff6b4a"
                    }}>
                      {selected.transparency}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>из 100</div>
                      <div style={{ fontSize: 10, color: "#555" }}>Индекс прозрачности</div>
                    </div>
                  </div>
                  <TransparencyBar score={selected.transparency} />
                  <div style={{ fontSize: 11, color: "#555", marginTop: 10 }}>
                    {(selected.commissions || []).length === 0 && "✅ Нет комиссий. "}
                    {(selected.commissions || []).filter(c => c.amount > 0).length > 0 &&
                      `⚠️ ${(selected.commissions || []).filter(c => c.amount > 0).length} вид(а) комиссий. `}
                    {(selected.insurance || []).length === 0 && "✅ Страхование не обязательно. "}
                    {(selected.insurance || []).length > 0 && `⚠️ Требуется страхование (${(selected.insurance || []).length} вид). `}
                  </div>
                  {selected.notes && (
                    <div style={{ fontSize: 10, color: "#444", marginTop: 8, padding: "8px", background: "#0a0a18", borderRadius: 6 }}>
                      📋 {selected.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* COMMISSIONS */}
              {(selected.commissions || []).length > 0 && (
                <div style={S.panel}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#ffbe4a", marginBottom: 12 }}>⚠️ КОМИССИИ И ДОПОЛНИТЕЛЬНЫЕ РАСХОДЫ</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(selected.commissions || []).map((c, i) => (
                      <div key={i} style={{ background: "#0a0a18", borderRadius: 8, padding: "10px 12px", border: c.amount > 0 ? "1px solid #ffbe4a33" : "1px solid #ffffff08" }}>
                        <div style={{ fontSize: 11, color: "#888" }}>{c.name}</div>
                        <div style={{ fontWeight: 700, color: c.amount > 0 ? "#ffbe4a" : "#00d4aa", marginTop: 4 }}>
                          {c.type === "fixed" ? fmt(c.amount) + " ₸" : c.amount + "% от суммы"}
                        </div>
                        {c.type === "percent" && c.amount > 0 && (
                          <div style={{ fontSize: 10, color: "#555" }}>≈ {fmt(effectiveLoan * c.amount / 100)} ₸</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "schedule" && selected && (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ ...S.panel, borderColor: "#00d4aa33" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00d4aa", marginBottom: 4 }}>
                  📅 ГРАФИК ПЛАТЕЖЕЙ — {selected.product} ({selected.bank})
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>
                  {scheduleType === "annuity" ? "Аннуитетный" : "Дифференцированный"} график • {termMonths} месяцев
                </div>
              </div>

              <div style={S.panel}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12 }}>ДИНАМИКА ПЛАТЕЖЕЙ (первые 36 месяцев)</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={scheduleChartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#555" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#555" }} />
                    <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid #00d4aa33", borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [fmt(v) + " ₸"]} />
                    <Bar dataKey="Осн. долг" stackId="a" fill="#4a9eff" />
                    <Bar dataKey="Проценты" stackId="a" fill="#ff6b4a" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={S.panel}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>ТАБЛИЦА ПЛАТЕЖЕЙ</div>
                  <button style={{ ...S.btn(false), fontSize: 11 }} onClick={() => setShowSchedule(!showSchedule)}>
                    {showSchedule ? "Скрыть" : "Показать все"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr 1fr", fontSize: 11, color: "#555", marginBottom: 6, padding: "0 4px" }}>
                  <div>МЕС.</div><div>ПЛАТЁЖ</div><div>ОСНОВНОЙ ДОЛГ</div><div>ПРОЦЕНТЫ</div><div>ОСТАТОК</div>
                </div>
                {(showSchedule ? selected.schedule : selected.schedule.slice(0, 12)).map(s => (
                  <div key={s.month} style={{
                    display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr 1fr",
                    fontSize: 12, padding: "6px 4px",
                    borderBottom: "1px solid #ffffff05",
                    background: s.month % 2 === 0 ? "#0a0a1800" : "transparent",
                  }}>
                    <div style={{ color: "#555" }}>{s.month}</div>
                    <div style={{ fontWeight: 600 }}>{fmt(s.payment)} ₸</div>
                    <div style={{ color: "#4a9eff" }}>{fmt(s.principal)} ₸</div>
                    <div style={{ color: "#ff6b4a" }}>{fmt(s.interest)} ₸</div>
                    <div style={{ color: "#888" }}>{fmt(s.balance)} ₸</div>
                  </div>
                ))}
                {!showSchedule && selected.schedule.length > 12 && (
                  <div style={{ textAlign: "center", color: "#555", fontSize: 11, padding: "8px 0" }}>
                    ... ещё {selected.schedule.length - 12} платежей
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Первый платёж", value: fmt(selected.schedule[0]?.payment || 0) + " ₸" },
                  { label: "Последний платёж", value: fmt(selected.schedule[selected.schedule.length - 1]?.payment || 0) + " ₸" },
                  { label: "Итого процентов", value: fmt(selected.totalInterest) + " ₸" },
                  { label: "Итого комиссий", value: fmt(selected.upfrontFees) + " ₸" },
                ].map(m => (
                  <div key={m.label} style={S.statCard}>
                    <div style={S.statVal}>{m.value}</div>
                    <div style={S.statLabel}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #ffffff08", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "#333" }}>
          📌 Источник данных: сайты банков, АРРФР, КФГД | FinRatings.kz | Обновлено: май 2026
        </div>
        <div style={{ fontSize: 10, color: "#333" }}>
          Данные взяты из файла таблица_версия_2.xlsx — Казахстан
        </div>
      </div>
    </div>
  );
}
